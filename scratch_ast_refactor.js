const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('app-gox/src/pages/AgentPage.tsx');

// Find all JSX Expressions inside the return statement
const returnStatements = sourceFile.getDescendantsOfKind(SyntaxKind.ReturnStatement);
let mainReturn = null;
for (const ret of returnStatements) {
    if (ret.getText().length > 1000) {
        mainReturn = ret;
        break;
    }
}

if (!mainReturn) {
    console.log("Could not find main return");
    process.exit(1);
}

// Find {activeTab === 'agents' && ...}
const jsxExpressions = mainReturn.getDescendantsOfKind(SyntaxKind.JsxExpression);
let agentsExpr = null;
let camerasExpr = null;

for (const expr of jsxExpressions) {
    const text = expr.getText();
    if (text.startsWith("{activeTab === 'agents' &&")) {
        agentsExpr = expr;
    }
    if (text.startsWith("{activeTab === 'cameras' &&")) {
        camerasExpr = expr;
    }
}

console.log("Found AgentsTab:", agentsExpr ? "YES" : "NO");
console.log("Found CamerasTab:", camerasExpr ? "YES" : "NO");

// Modals: The modals start right after camerasTab? No, they are a list of Modals inside <AnimatePresence>.
// Let's find all `{/* ... Modal */}`
const jsxElements = mainReturn.getDescendantsOfKind(SyntaxKind.JsxElement);
const jsxSelfClosingElements = mainReturn.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

// Let's find the Modals container. In AgentPage, there is an AnimatePresence that wraps Modals.
let animatePresenceElements = [];
for (const el of jsxElements) {
    if (el.getOpeningElement().getTagNameNode().getText() === 'AnimatePresence') {
        animatePresenceElements.push(el);
    }
}

// The second AnimatePresence contains the modals (or maybe the last one)
let modalsAnimatePresence = animatePresenceElements[animatePresenceElements.length - 1];

console.log("Found Modals container:", modalsAnimatePresence ? "YES" : "NO");

if (agentsExpr && camerasExpr && modalsAnimatePresence) {
    
    // We will extract the TEXT of these nodes, and replace them in the file text!
    // Much safer than ts-morph AST replace which sometimes formats weirdly.
    
    const fileText = sourceFile.getFullText();
    
    const aStart = agentsExpr.getStart();
    const aEnd = agentsExpr.getEnd();
    const aCode = fileText.substring(aStart, aEnd);
    
    const cStart = camerasExpr.getStart();
    const cEnd = camerasExpr.getEnd();
    const cCode = fileText.substring(cStart, cEnd);
    
    // For modals, we will extract the children of the AnimatePresence, so we don't extract the AnimatePresence itself.
    // Actually, wait, let's just extract the AnimatePresence itself if it only wraps modals!
    // But wait, there is a CAMERA OPERATIONS MODAL right before it!
    const cameraModalText = "{/* CAMERA OPERATIONS MODAL */}";
    const cameraModalIdx = fileText.indexOf(cameraModalText);
    
    // Modals block is from CAMERA OPERATIONS MODAL to the end of modalsAnimatePresence!
    let mStart = cameraModalIdx;
    if (mStart === -1) {
        console.log("Could not find CAMERA OPERATIONS MODAL");
        mStart = modalsAnimatePresence.getStart(); // fallback
    }
    const mEnd = modalsAnimatePresence.getEnd();
    const mCode = fileText.substring(mStart, mEnd);

    // Save to files
    const writeComp = (name, code) => {
        let cleanCode = code;
        if (cleanCode.startsWith("{activeTab") && cleanCode.endsWith("}")) {
            // Strip {activeTab === 'xxx' && (
            // and )}
            cleanCode = cleanCode.substring(cleanCode.indexOf('(') + 1, cleanCode.lastIndexOf(')'));
        }
        
        const out = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../AgentStyles';
import { GlowCard } from '../../components/ui/GlowCard';
import { AnimatedList } from '../../components/ui/AnimatedList';
import { safePathToken } from '../../utils/stringUtils';

export function ${name}(props: any) {
  const propsToDestructure = props;
  return (
    <>
      ${cleanCode}
    </>
  );
}
`;
        fs.mkdirSync('app-gox/src/pages/Agent/components', { recursive: true });
        fs.writeFileSync(`app-gox/src/pages/Agent/components/${name}.tsx`, out, 'utf-8');
    };

    writeComp('AgentsTab', aCode);
    writeComp('CamerasTab', cCode);
    writeComp('AgentModals', mCode);
    
    // Replace in AgentPage
    let newText = fileText;
    
    // Replace bottom up to avoid offset issues
    // First, modals
    newText = newText.substring(0, mStart) + `<AgentModals {...propsToPass} />` + newText.substring(mEnd);
    
    // Now we need to recalculate offsets for CamerasTab because we modified the text?
    // No, it's better to just use replace() if the strings are unique!
    newText = newText.replace(cCode, `{activeTab === 'cameras' && <CamerasTab {...propsToPass} />}`);
    newText = newText.replace(aCode, `{activeTab === 'agents' && <AgentsTab {...propsToPass} />}`);
    
    // Add imports
    const imports = `import { AgentsTab } from './Agent/components/AgentsTab';
import { CamerasTab } from './Agent/components/CamerasTab';
import { AgentModals } from './Agent/components/AgentModals';
`;
    newText = imports + newText;
    
    // Add propsToPass
    newText = newText.replace('export default function AgentPage(props: Props) {', 
        'export default function AgentPage(props: Props) {\n  const propsToPass: any = {};');
        
    fs.writeFileSync('app-gox/src/pages/AgentPage.tsx', newText, 'utf-8');
    console.log("Successfully split the monolith!");

} else {
    console.log("Missing a block.");
}
