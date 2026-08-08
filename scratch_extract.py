with open('app-gox/src/pages/AgentPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
start = -1
for i, l in enumerate(lines):
    if "{activeTab === 'cameras' && (" in l:
        start = i; break
depth = 0
for i in range(start, len(lines)):
    depth += lines[i].count('{') - lines[i].count('}')
    if depth == 0 and i > start:
        end = i+1; break

with open('scratch_cameras_tab.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines[start+1:end-1])
