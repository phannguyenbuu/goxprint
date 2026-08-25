import{j as e,R as Or,A as wt,m as st,L as _t,r as p}from"./index-DbtHsNiH.js";import{A as Tn}from"./AnimatedList-B5jO79jA.js";import{G as Cn}from"./GlowCard-BKL1Eo_F.js";const n={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"176px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},lanSelect:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",cursor:"pointer",width:"100%"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",left:"12px",right:"12px",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",maxWidth:"404px",marginLeft:"auto",marginRight:"auto",pointerEvents:"none"},toast:{background:"rgba(18, 18, 26, 0.95)",backdropFilter:"blur(10px)",borderRadius:"8px",padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:"10px",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",pointerEvents:"auto"},toastIcon:{fontSize:"0.9rem",flexShrink:0},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},ie={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},credsInputRow:{display:"flex",gap:"6px"},credsInput:{fontSize:"0.8rem",padding:"6px 8px",background:"var(--color-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",flex:1,minWidth:0},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},expandSubBtn:{fontSize:"0.72rem",color:"var(--color-primary)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"block"},suggestedDriverBlock:{padding:"8px",background:"var(--color-inset-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",display:"flex",flexDirection:"column",gap:"6px"},driverSuggestionItem:{background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden"},driverModelHeader:{padding:"6px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255,255,255,0.02)"},driverOptionsList:{padding:"6px",borderTop:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},driverFileRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",background:"var(--color-inset-bg)",borderRadius:"4px",gap:"6px"},driverFileName:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},driverFileUrl:{fontSize:"0.62rem",color:"var(--color-text-secondary)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function An({hasAddressList:a,sync:w,p:A,commandStatus:b,getDestinationStatus:Y,selectedLan:J,handleOpenStorageFiles:be,handleDeleteDest:se,handleChangeFtp:me,handleEditIP:Ae}){return e.jsxs("div",{style:ie.destinationsBlock,children:[e.jsx("span",{style:ie.destBlockTitle,children:"📂 Danh sách điểm scan:"}),a?w.address_list.filter(x=>{if(!x||typeof x!="object"||x.type==="Summary")return!1;const ue=(x.name||"").trim();return ue==="Summary"||ue==="Total"||ue.startsWith("Users:")?!1:!!(ue||x.entry_id||x.registration_no&&x.registration_no!=="-"||x.email_address||x.email||x.folder||x.physical_path)}).map((x,ue)=>{var we,te;const ae=x.email_address||x.email||"",N=x.physical_path||x.folder||x.folder_path||"",he=(ae||N||"").trim();let fe="Folder";N.startsWith("ftp://")?fe="FTP":N.startsWith("\\\\")?fe="SMB":(ae||ae.includes("@"))&&(fe="Email"),Y(x);const Qe=x.registration_no&&x.registration_no!=="-"?x.registration_no:x.entry_id||ue+1,U=`${A.id}-${Qe}`,T=((we=b[U])==null?void 0:we.isPending)||!1;return(te=b[U])!=null&&te.message,e.jsxs("div",{style:{...ie.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",Qe]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[x.name,(x.warning||x.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:x.warning||x.error,children:"⚠️"})]}),typeof x.file_count=="number"&&e.jsxs("span",{onClick:()=>be(J.lan_uid,he),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",x.file_count," files"]}),x.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:x.entry_id})]}),me&&(fe==="FTP"||fe==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:T?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:T?.5:1,minWidth:"24px"},onClick:()=>Ae&&Ae(A.id,x),disabled:T,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:T?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:T?.5:1,minWidth:"24px"},onClick:()=>se(A.id||A.mac_id||A.mac_address||A.ip,x),disabled:T,title:"Xóa",children:"🗑️"})]},ue)}):e.jsx("div",{style:ie.emptySubText,children:w.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Đang tải hoặc danh sách trống. Nhấn đồng bộ để lấy trực tiếp."})]})}const jn="https://agentapi.quanlymay.com",Qr=new Map;async function Ve(a,w={}){const A=`${w.method||"GET"}:${a}:${w.body||""}`;if(Qr.has(A))return Qr.get(A);const b=(async()=>{try{const Y=await fetch(`${jn}${a}`,{...w,headers:{"Content-Type":"application/json","X-API-Token":"change-me",...w.headers}});if(!Y.ok){const J=await Y.json().catch(()=>({}));throw new Error(J.error||`HTTP error! status: ${Y.status}`)}return await Y.json()}finally{Qr.delete(A)}})();return Qr.set(A,b),b}async function In(){try{return(await Ve("/api/lan-sites?lead=default")).rows||[]}catch(a){return console.error("Failed to fetch LAN sites:",a),[]}}async function Pn(a,w,A,b,Y){return Ve(`/api/devices/${encodeURIComponent(a)}/credentials`,{method:"PATCH",body:JSON.stringify({auth_user:w,auth_password:A,mac_id:b||a,printer_type:Y})})}async function En(a,w,A){const b=w?`/api/devices/${a}/fetch-address-book?agent_uid=${w}`:`/api/devices/${a}/fetch-address-book`;return Ve(b,{method:"POST",body:JSON.stringify(A||{})})}async function Ft(a){return Ve(`/api/commands/${a}/status`)}async function Rn(a,w,A,b,Y){const J=b?`/api/devices/${a}/add-email-dest?agent_uid=${b}`:`/api/devices/${a}/add-email-dest`;return Ve(J,{method:"POST",body:JSON.stringify({name:w,email:A,...Y||{}})})}async function Ln(a,w,A,b){return Ve("/api/lan-emails",{method:"POST",body:JSON.stringify({lead:a,lan_uid:w,email:b,email_type:"private",pc_name:A})})}async function Nn(a,w,A,b){return Ve(`/api/devices/${a}/delete-email-dest`,{method:"POST",body:JSON.stringify({registration_no:w,entry_id:A,agent_uid:b})})}async function Dn(a){return Ve(`/api/lan-emails/${a}`,{method:"DELETE"})}async function kn(a,w){return Ve(`/api/scans/files?lan_uid=${encodeURIComponent(a)}&email=${encodeURIComponent(w)}`)}async function On(a,w,A,b,Y,J){return Ve(`/api/devices/${a}/install-driver`,{method:"POST",body:JSON.stringify({brand:w,model:A,driver_name:b,driver_url:Y,agent_uid:J})})}async function Mn(a){return Ve(`/api/agents/${a}/settings?lead=default`)}async function Fn(a,w,A,b=1,Y=50,J,be){const se=new URLSearchParams;return A&&se.append("agent_uid",A),b&&se.append("page",b.toString()),Y&&se.append("limit",Y.toString()),se.append("t",Date.now().toString()),Ve(`/api/jobs?${se.toString()}`)}async function Un(a,w){return Ve(`/api/agents/${a}/settings?lead=default`,{method:"POST",body:JSON.stringify(w)})}async function Bn(a,w,A){return Ve(`/api/agents/${a}/utility/${w}?lead=default`,{method:"POST",body:A?JSON.stringify(A):void 0})}async function wn(a){return Ve(`/api/agents/${a}/utility-commands?lead=default&t=${Date.now()}`)}async function Lt(a,w,A,b){return Ve(`/api/agents/${a}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify({command:w,command_content:A,...b||{}})})}async function Gn(a){return Ve(`/api/agents/${a}/emergency-restart?lead=default`,{method:"POST",body:"{}"})}const zn=Nn;function Hn({p:a,selectedLan:w,activeAgentUid:A,selectedAgentUid:b,copierCredentials:Y,setCopierCredentials:J,saveAuthLoading:be,handleSaveAuth:se,isExpanded:me,handleCopierClick:Ae,onlineAgents:x,detectBrand:ue,showToast:ae,fetchRemotePage:N,setRemoteLockPrinter:he,setActiveModal:fe,hasAddressList:Qe,sync:U,commandStatus:T,getDestinationStatus:we,handleOpenStorageFiles:te,handleEditIP:Ge,handleDeleteDest:dt,handleRefetchAddressBook:Je,expandedDrivers:pt,setExpandedDrivers:_e,expandedDriverMenus:xe,setExpandedDriverMenus:oe,handleRemoteInstallDriver:ye,setPublicFtpData:Re}){var G,q,$,W,z;const[K,Ye]=Or.useState(null),Ke=Or.useRef(!1),He=Or.useCallback(async()=>{try{const f=await Ve(`/api/lan-sites?t=${Date.now()}`);if(f&&f.ok&&Array.isArray(f.rows)){const C=(a.mac_id||a.mac_address||"").toUpperCase().replace(/-/g,":");for(const Z of f.rows)for(const D of Z.printers||[]){const S=(D.mac_id||D.mac_address||"").toUpperCase().replace(/-/g,":");C&&S&&C===S&&D.address_book_sync&&(D.address_book_sync.address_list||D.address_book_sync.result)&&Ye(D.address_book_sync)}}}catch{}},[a.mac_id,a.mac_address]),ke=((G=T[a.id])==null?void 0:G.isPending)||!1,Ct=((q=T[a.id])==null?void 0:q.message)||"";Or.useEffect(()=>{if(ke&&Ye(null),Ke.current&&!ke){He();const f=setTimeout(He,1500),C=setTimeout(He,3500);return()=>{clearTimeout(f),clearTimeout(C)}}Ke.current=ke},[ke,He]);const H=K||U,Nt=a.suggested_drivers&&a.suggested_drivers.length>0,mt=pt[a.id],xt=(()=>{var C,Z,D,S,_;if(Array.isArray(H==null?void 0:H.address_list)&&H.address_list.length>0)return H.address_list;if(H!=null&&H.address_book_data&&Array.isArray(H.address_book_data.address_list))return H.address_book_data.address_list;const f=[H,H==null?void 0:H.result,H==null?void 0:H.result_payload,H==null?void 0:H.raw,(C=T==null?void 0:T[a.id])==null?void 0:C.result,(Z=T==null?void 0:T[a.id])==null?void 0:Z.result_payload,(D=T==null?void 0:T[a.id])==null?void 0:D.address_list,(_=(S=T==null?void 0:T[a.id])==null?void 0:S.address_book_sync)==null?void 0:_.address_list];for(const ge of f)if(ge){if(Array.isArray(ge))return ge;if(typeof ge=="object"&&Array.isArray(ge.address_list))return ge.address_list;if(typeof ge=="string"){let Te=ge.trim();if(Te.includes("__ADDRESS_BOOK_JSON_START__"))try{Te=Te.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),Te=Te.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const le=JSON.parse(Te);if(le&&Array.isArray(le.address_list))return le.address_list;if(Array.isArray(le))return le}catch{}}}return Array.isArray(H==null?void 0:H.address_list)?H.address_list:[]})(),ut=xt.filter(f=>{if(!f||typeof f!="object"||f.type==="Summary")return!1;const C=(f.name||"").trim();return C==="Summary"||C==="Total"||C.startsWith("Users:")?!1:!!(C||f.entry_id||f.registration_no&&f.registration_no!=="-"||f.email_address||f.email||f.folder||f.physical_path)}),gt={...H,address_list:xt,status:xt.length>0?"success":(H==null?void 0:H.status)||"none",timestamp:(($=T==null?void 0:T[a.id])==null?void 0:$.timestamp)||(H==null?void 0:H.timestamp)||new Date().toISOString()},yt=ut.length>0||Qe,Ut=ut.length,E=gt.timestamp?new Date(gt.timestamp).toLocaleTimeString("vi-VN"):"",j=Or.useCallback(async(f,C)=>{var Se,re;const Z=ue(f.printer_name||f.name||"");if(Z!=="ricoh"&&Z!=="toshiba"){ae("Thiết bị không hỗ trợ thay đổi FTP","error");return}const D=Z==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",S=((Se=w==null?void 0:w.agents)==null?void 0:Se.find(h=>h.is_agent_active))||((re=w==null?void 0:w.agents)==null?void 0:re[0]),_=(S==null?void 0:S.local_ip)||(S==null?void 0:S.ip)||"";if(!_){ae("Không tìm thấy IP của Agent để cập nhật","error");return}const ge=C.folder||C.physical_path||C.folder_path||"",Te=ge.match(/ftp:\/\/([^:/]+)/),le=ge.match(/^\\\\([^\\]+)/),ze=ge.match(/^([^:/]+):/);let Le="";Te?Le=Te[1]:le?Le=le[1]:ze&&(Le=ze[1]),Le||(Le=_);const tt=C.registration_no||C.id||"",F=C.name||C.username||C.display_name||"",je=f.ip||f.printer_ip||"",Ie=f.auth_user||f.username||"admin",B=f.auth_password||f.password||"";ae(`Đang gửi lệnh cập nhật FTP cho ${C.name}...`,"info");try{const h=await Lt(b,D,"",{printer_ip:je,auth_user:Ie,auth_password:B,target_id:tt,target_name:F,old_ip:Le,new_ip:_});h&&h.ok?ae(`Cập nhật FTP cho ${C.name} thành công!`,"success"):ae(`Lỗi: ${(h==null?void 0:h.error)||"Không thể chạy lệnh"}`,"error")}catch(h){ae(`Lỗi gửi lệnh: ${(h==null?void 0:h.message)||h}`,"error")}},[b,w,ue,ae]);return e.jsx("div",{id:`copier-card-${a.id}`,onClick:()=>Ae(String(a.id)),style:{width:"100%"},children:e.jsxs(Cn,{children:[e.jsxs("div",{style:ie.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:ie.copierTitle,children:["🖨️ ",(()=>{if(a.printer_name&&a.printer_name.trim())return a.printer_name.trim();const f=(a.mac_id||"").replace(/-/g,":").toUpperCase();return f.startsWith("58:38:79")||f.startsWith("00:26:73")?"Thiết bị Ricoh (Đang thám dò...)":f.startsWith("00:80:91")?"Thiết bị Toshiba (Đang thám dò...)":f.startsWith("00:11:22")?"Thiết bị HP (Đang thám dò...)":"Thiết bị Photocopy (Đang thám dò...)"})()]}),e.jsxs("div",{style:ie.copierSubtitle,children:["IP: ",a.ip," · MAC: ",a.mac_id||"—",a.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:a.agent_uid})]})]})]}),e.jsx("span",{style:{...ie.statusBadge,color:a.probed?a.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:a.probed?a.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:a.probed?a.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:a.probed?a.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsxs("div",{style:ie.sectionBlock,children:[e.jsx("span",{style:ie.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsxs("div",{style:ie.credsInputRow,children:[e.jsx("input",{type:"text",style:ie.credsInput,placeholder:"admin",autoComplete:"new-password",name:`printer_user_${a.id}`,value:((W=Y[a.id])==null?void 0:W.user)||"",onChange:f=>J(C=>({...C,[a.id]:{...C[a.id],user:f.target.value}}))}),e.jsx("input",{type:"password",style:ie.credsInput,placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${a.id}`,value:((z=Y[a.id])==null?void 0:z.pass)||"",onChange:f=>J(C=>({...C,[a.id]:{...C[a.id],pass:f.target.value}}))}),e.jsx("button",{style:{...ie.smallBtn,padding:"8px 12px",fontSize:"0.8rem",whiteSpace:"nowrap"},onClick:()=>se(a),disabled:be[a.id],children:be[a.id]?"Lưu...":"Lưu Auth"})]})]}),e.jsxs("div",{style:{...ie.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:U.status==="success"?"rgba(0, 255, 136, 0.05)":U.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:U.status==="success"?"rgba(0, 255, 136, 0.15)":U.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:ie.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),ke?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:Ct}):yt?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",Ut," mục) ",E?` • ${E}`:""]}):U.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",U.error," ",E?`(${E})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...ie.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:async()=>{Je(a),setTimeout(He,2e3),setTimeout(He,4500)},disabled:ke||x.length===0,children:["🔄 ",gt.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),yt&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(An,{hasAddressList:yt,sync:gt,p:a,commandStatus:T,getDestinationStatus:we,selectedLan:w,handleOpenStorageFiles:te,handleEditIP:Ge,handleDeleteDest:dt,handleChangeFtp:j})})]}),Nt&&e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("button",{style:ie.expandSubBtn,onClick:()=>_e(f=>({...f,[a.id]:!mt})),children:mt?"▲ Ẩn driver đề xuất":"▼ Xem driver đề xuất từ catalog"}),e.jsx(wt,{children:mt&&e.jsx(st.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},style:{overflow:"hidden",marginTop:"6px"},children:e.jsx("div",{style:ie.suggestedDriverBlock,children:a.suggested_drivers.map((f,C)=>{const Z=f.brand==="ricoh"?"var(--color-primary)":f.brand==="toshiba"?"var(--color-error)":"var(--color-success)",D=`${a.id}-${C}`,S=xe[D]||!1;return e.jsxs("div",{style:ie.driverSuggestionItem,children:[e.jsxs("div",{style:ie.driverModelHeader,onClick:()=>oe(_=>({..._,[D]:!S})),children:[e.jsxs("span",{style:{fontSize:"0.8rem",fontWeight:600},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:Z,marginRight:"6px"}}),f.brand.toUpperCase()," - ",f.model]}),e.jsx("span",{style:{fontSize:"0.75rem",color:"var(--color-primary)"},children:S?"▲":"▼"})]}),S&&e.jsx("div",{style:ie.driverOptionsList,children:f.drivers&&f.drivers.length>0?f.drivers.map((_,ge)=>e.jsxs("div",{style:ie.driverFileRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:ie.driverFileName,children:_.name}),e.jsx("div",{style:ie.driverFileUrl,title:_.url,children:_.url.split("/").pop()})]}),e.jsx("div",{style:{display:"flex",gap:"4px"},children:e.jsx("button",{style:{...ie.smallBtn,padding:"4px 8px",fontSize:"0.7rem"},onClick:()=>ye(a.mac_id||a.mac_address||a.ip||a.id,f.brand,f.model,_.name,_.url),disabled:x.length===0,children:"Cài đặt"})})]},ge)):e.jsx("div",{style:ie.emptySubText,children:"Không tìm thấy driver nào."})})]},C)})})})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...ie.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{Re({printerId:a.id,name:"",email:"",agentUid:b}),fe("public_ftp")},disabled:x.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...ie.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{var C,Z;const f=b||a.agent_uid||A||((Z=(C=w==null?void 0:w.agents)==null?void 0:C[0])==null?void 0:Z.agent_uid)||"";if(!f){ae("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}N(a.ip,"","GET",null,!1,f,80)},disabled:!w||!w.agents||w.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...ie.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#ef4444",color:"#ef4444"},onClick:()=>{he({ip:a.ip,name:a.name||a.printer_name||a.ip,id:a.id,agentUid:b}),fe("remote_lock")},disabled:x.length===0,children:"🔒 Khóa máy từ xa"}),ue(a.name||a.printer_name||a.ip)==="ricoh"&&(a.name||a.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...ie.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>ae("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),ue(a.name||a.printer_name||a.ip)==="toshiba"&&e.jsx("button",{style:{...ie.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>ae("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]})},a.id)}function $n(a){const{setCopierCredentials:w,activeAgentUid:A,activeLoadingFile:b,activeModal:Y,activeTab:J,addCameraLoading:be,addressBookModal:se,agentUid:me,agents:Ae,cameraAgentUid:x,cameraFileFilter:ue,cameras:ae,camerasLoading:N,canNavigateNext:he,canNavigatePrev:fe,commandStatus:Qe,copierCredentials:U,deleteCameraLoading:T,deleteScanPointModal:we,destToDelete:te,detectBrand:Ge,editIpData:dt,editIpModal:Je,editIpNewIp:pt,editIpSaving:_e,expandedCopierId:xe,expandedDriverMenus:oe,expandedDrivers:ye,expandedPrinters:Re,fetchLanSitesData:K,fetchRemotePage:Ye,fileTypeFilter:Ke,filteredPrinters:He,getDestinationStatus:ke,getTargetAgentUid:Ct,handleCopierClick:H,handleDeleteDest:Nt,handleEditIP:mt,handleOpenStorageFiles:xt,handleRefetchAddressBook:ut,handleRemoteInstallDriver:gt,handleSaveAuth:yt,infoDetailModal:Ut,installDriverModal:E,installDriverSaving:j,installedCount:G,isAllInstalled:q,lanSites:$,lanSitesLoading:W,liveAddressBooks:z,mockAgentApi:f,newCamIp:C,newCamName:Z,newCamPass:D,newCamPort:S,newCamRtsp:_,newCamUser:ge,onlineAgents:Te,pendingScanPoints:le,printers:ze,publicFtpData:Le,publicFtpModal:tt,publicFtpSaving:F,record30sLoading:je,remoteLockModal:Ie,remoteLockPrinter:B,saveAuthLoading:Se,selectedAgentUid:re,selectedCamera:h,selectedCameraAgentUid:at,selectedLan:ce,selectedLanUid:br,setActiveModal:Bt,setExpandedDriverMenus:Sr,setExpandedDrivers:ve,setPublicFtpData:Gt,setRemoteLockPrinter:vr,showToast:er,storageFilesModal:tr,storageFilesModalData:rr,storageFilesModalLoading:X,storageFilterDate:kt,submittingScanPoint:nr,toshibaVncData:ir,utilityActionPending:zt,utilityCommands:wr,utilityCommandsLoading:Tr,utilitySettingsLoading:Mr,utilityStatusMsg:Ze,viewOutputModal:Fr,vncTunnelLoading:Ur,webPreviewHistory:Dt,webPreviewHistoryIndex:Ne,webPreviewLoading:ot,webPreviewModal:At,webPreviewTab:Ht}=a;return e.jsx(e.Fragment,{children:e.jsxs(st.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:n.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(Tn,{className:"copiers-grid",style:n.gridContainer,children:W?e.jsxs("div",{style:n.loadingContainer,children:[e.jsx(_t,{}),e.jsx("div",{style:n.loadingText,children:"Đang tải dữ liệu thiết bị..."})]}):He.length===0?e.jsxs("div",{style:n.emptyStateContainer,children:[e.jsx("div",{style:n.emptyIcon,children:"🖨️"}),e.jsx("div",{style:n.emptyTitle,children:"Không tìm thấy máy photocopy nào"}),e.jsx("div",{style:n.emptySubtitle,children:'Vui lòng chọn mạng LAN khác hoặc nhấp "Làm mới" để quét lại thiết bị.'})]}):He.map(De=>{const jt=String(xe)===String(De.id),sr=Pe=>{if(!Pe)return null;let Me=Pe;if(typeof Me=="string"){let Tt=Me.trim();if(Tt.includes("__ADDRESS_BOOK_JSON_START__"))try{Tt=Tt.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),Tt=Tt.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{Me=JSON.parse(Tt)}catch{return null}}if(typeof Me!="object")return null;let ar=0;for(;Me&&typeof Me=="object"&&!Array.isArray(Me.address_list)&&Me.address_book_sync&&ar<5;)Me=Me.address_book_sync,ar++;return Me},Oe=(De.mac_id||De.mac_address||"").toUpperCase().replace(/-/g,":"),Ot=sr(Oe?z==null?void 0:z[Oe]:null),It=sr(De.address_book_sync),bt=Ot&&Array.isArray(Ot.address_list),$t=It&&Array.isArray(It.address_list)&&It.address_list.length>0,de=bt?Ot:$t?It:Ot||It||{},Cr=(Array.isArray(de.address_list)?de.address_list.filter(Pe=>{if(!Pe||typeof Pe!="object"||Pe.type==="Summary")return!1;const Me=(Pe.name||"").trim();return Me==="Summary"||Me==="Total"||Me.startsWith("Users:")?!1:!!(Me||Pe.entry_id||Pe.registration_no&&Pe.registration_no!=="-"||Pe.email_address||Pe.email||Pe.folder||Pe.physical_path)}):[]).length>0,kr=((ce==null?void 0:ce.agents)||[]).filter(Pe=>Pe.is_agent_active),Ar=Ct?Ct(De.id):re||De.agent_uid||"";return e.jsx(Hn,{p:De,selectedLan:ce,activeAgentUid:me,selectedAgentUid:Ar,copierCredentials:U||{},setCopierCredentials:w,saveAuthLoading:Se||{},handleSaveAuth:yt,isExpanded:jt,handleCopierClick:H,onlineAgents:kr,detectBrand:Ge||(()=>"generic"),showToast:er||(()=>{}),fetchRemotePage:Ye||(()=>{}),setRemoteLockPrinter:vr,setActiveModal:Bt,hasAddressList:Cr,sync:de,commandStatus:Qe||{},getDestinationStatus:ke||(()=>({})),handleOpenStorageFiles:xt||(()=>{}),handleEditIP:mt||(()=>{}),handleDeleteDest:Nt||(()=>{}),handleRefetchAddressBook:ut||(()=>{}),expandedDrivers:ye||{},setExpandedDrivers:ve,expandedDriverMenus:oe||{},setExpandedDriverMenus:Sr,handleRemoteInstallDriver:gt||(()=>{}),setPublicFtpData:Gt},De.id)})})]},"copiers-tab")})}function vn(a){const w=(a||"").trim();return w&&w.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function Wn(a){const{AgentPage:w,activeLoadingFile:A,activeModal:b,activeTab:Y,allocatedVncAddr:J,cameraFiles:be,cameraForm:se,cameraLogs:me,cameraStatus:Ae,cameraTestLoading:x,cameraTestResult:ue,cameras:ae,camerasLoading:N,commandStatus:he,confirmModal:fe,copierCredentials:Qe,customRecordDuration:U,customRunCommand:T,deleteScanPointModal:we,directLan:te,editIpModalData:Ge,editableSettingsText:dt,emailFileCounts:Je,executeRemoteInstallDriver:pt,expandedDriverMenus:_e,expandedDrivers:xe,expandedPrinters:oe,fetchCameraFiles:ye,fetchCameraStatus:Re,fetchRemotePage:K,fetchRemotePageOld:Ye,ftpDetailData:Ke,getDestinationStatus:He,getDestinationStatusHtml:ke,getLiveQueryTimestamp:Ct,handleAddPrivateFtp:H,handleAddPublicFtp:Nt,handleCloseWebPreview:mt,handleConfirmDeleteScanPoint:xt,handleCopierClick:ut,handleDeleteCamera:gt,handleDeleteCameraFile:yt,handleDeleteDest:Ut,handleEditIP:E,handleFetchEntryDetail:j,handleHistoryBack:G,handleHistoryForward:q,handleOpenStorageFiles:$,handlePlaySegmentFile:W,handleQueryVideo:z,handleRecord30s:f,handleRefetchAddressBook:C,handleRemoteInstallDriver:Z,handleSaveAuth:D,handleSaveCameraConfig:S,handleSaveEditIP:_,handleTriggerUtilityExec:ge,handleSaveSettings:Te,handleStartToshibaVnc:le,handleTestCameraConnection:ze,handleToggleDirectLan:Le,handleViewScanPointsJson:tt,installDriverModal:F,ipInputModal:je,isRecording30s:Ie,isSavingSettings:B,lanSites:Se,lanSitesLoading:re,liveAddressBooks:h,lockAspect:at,pollCommandStatus:ce,previewBlobUrl:br,privateFtpData:Bt,privateFtpLoading:Sr,publicFtpData:ve,publicFtpLoading:Gt,queriedVideoUrl:vr,queryDuration:er,queryTimestamp:tr,queryVideoLoading:rr,recording30sCountdown:X,remoteLockPrinter:kt,resolveRelativePath:nr,saveAuthLoading:ir,savedLocal:zt,scaleX:wr,scaleY:Tr,scanAutoOpenDir:Mr,scanAutoOpenFile:Ze,scanPointsViewerModal:Fr,selectedCamera:Ur,selectedCameraAgentUid:Dt,selectedLan:Ne,selectedLanUid:ot,selectedTargetAgents:At,selectedUtilityAgent:Ht,setActiveLoadingFile:De,setActiveModal:jt,setActiveTab:sr,setAllocatedVncAddr:Oe,setCameraFiles:Ot,setCameraForm:It,setCameraLogs:bt,setCameraStatus:$t,setCameraTestLoading:de,setCameraTestResult:Wt,setCameras:Cr,setCamerasLoading:kr,setCommandStatus:Ar,setConfirmModal:Pe,setCopierCredentials:Me,setCustomRecordDuration:ar,setCustomRunCommand:Tt,setDeleteScanPointModal:Yr,setDirectLan:Zr,setEditIpModalData:jr,setEditableSettingsText:Vt,setEmailFileCounts:en,setExpandedDriverMenus:tn,setExpandedDrivers:Ir,setExpandedPrinters:Jt,setFtpDetailData:rn,setInstallDriverModal:Kt,setIpInputModal:Br,setIsRecording30s:nn,setIsSavingSettings:qt,setLanSites:Gr,setLanSitesLoading:sn,setLiveAddressBooks:Pr,setLockAspect:St,setPreviewBlobUrl:rt,setPrivateFtpData:an,setPrivateFtpLoading:Xt,setPublicFtpData:on,setPublicFtpLoading:or,setQueriedVideoUrl:O,setQueryDuration:zr,setQueryTimestamp:Er,setQueryVideoLoading:Pt,setRecording30sCountdown:ln,setRemoteLockPrinter:lr,setSaveAuthLoading:cn,setScaleX:dn,setScaleY:Hr,setScanAutoOpenDir:nt,setScanAutoOpenFile:pn,setScanPointsViewerModal:Q,setSelectedCamera:cr,setSelectedCameraAgentUid:$r,setSelectedLanUid:ht,setSelectedTargetAgents:$e,setSelectedUtilityAgent:Wr,setSettingsSaveStatus:dr,setShowPreviewDetails:pr,setShowSettings:Rr,setStorageFiles:mn,setStorageLoading:Qt,setStorageModalData:un,setToasts:Et,setToshibaVncData:gn,setUtilityActionPending:mr,setUtilityCommands:hn,setUtilityCommandsLoading:Ee,setUtilitySettingsLoading:fn,setUtilityStatusMsg:ee,setViewOutputModal:ur,setVncTunnelLoading:Vr,setWebPreviewHistory:Rt,setWebPreviewHistoryIndex:Lr,setWebPreviewLoading:_n,setWebPreviewModal:xn,setWebPreviewTab:Fe,settingsSaveStatus:it,showPreviewDetails:Yt,showSettings:Jr,storageFiles:yn,storageLoading:Mt,storageModalData:Kr,toasts:lt,toshibaVncData:vt,utilityActionPending:Zt,utilityCommands:gr,utilityCommandsLoading:qe,utilitySettingsLoading:Nr,utilityStatusMsg:hr,viewOutputModal:fr,vncTunnelLoading:bn,webPreviewHistory:ft,webPreviewHistoryIndex:V,webPreviewLoading:_r,webPreviewModal:qr,webPreviewTab:Xr}=a;return e.jsx(e.Fragment,{children:e.jsx(st.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:n.tabContent,children:e.jsx(Tn,{children:Ne.agents.filter(ne=>ne.is_agent_active).length===0?e.jsx("div",{style:n.emptyText,children:"Không có Agent nào đang online trong mạng LAN này."}):Ne.agents.filter(ne=>ne.is_agent_active).map(ne=>{const et=ne.is_agent_active;return e.jsxs(Cn,{children:[e.jsxs("div",{style:n.cardHeader,children:[e.jsxs("span",{style:n.cardTitle,children:["💻 ",ne.hostname]}),e.jsx("span",{style:{...n.statusBadge,color:et?"var(--color-status-online)":"var(--color-status-offline)",borderColor:et?"var(--color-status-online)":"var(--color-status-offline)",background:et?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:et?ne.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]}),e.jsxs("div",{style:n.cardDetails,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"UID:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:ne.agent_uid})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...n.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[ne.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async Ue=>{Ue.stopPropagation();try{const Xe=await Lt(ne.agent_uid,"get_agent_ip","");if(Xe.ok&&Xe.command_id){a.showToast&&a.showToast("Đang yêu cầu lấy lại IP cục bộ...","info");const We=Xe.command_id,xr=Date.now(),r=setInterval(async()=>{try{if(Date.now()-xr>12e3){clearInterval(r);return}const i=await Ft(We);i.status==="success"?(clearInterval(r),a.fetchLanSitesData&&await a.fetchLanSitesData(!0),a.showToast&&a.showToast("Đã cập nhật IP cục bộ mới nhất!","success")):i.status==="failed"&&(clearInterval(r),a.showToast&&a.showToast("Không thể lấy lại IP cục bộ: "+(i.error||"Thất bại"),"error"))}catch(i){console.error(i),clearInterval(r)}},1e3)}else a.showToast&&a.showToast("Gửi yêu cầu thất bại: "+(Xe.error||"Lỗi kết nối"),"error")}catch(Xe){a.showToast&&a.showToast("Lỗi: "+Xe.message,"error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:Ue=>Ue.currentTarget.style.opacity="1",onMouseLeave:Ue=>Ue.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:n.detailValue,children:ne.local_mac||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:n.detailValue,children:(()=>{const Ue=(ne.ftp_sites||[]).find(c=>(c.name||"").toLowerCase()==="goxprint")||(ne.ftp_sites||[])[0],Xe=(Ue==null?void 0:Ue.path)||"",We=vn((Ne==null?void 0:Ne.lan_uid)||""),xr=vn(ne.agent_uid||""),i=`storage/uploads/scans/${vn(ne.lead||"default")}/${We}/${xr}/`,s=Ne?Ne.emails.filter(c=>c.email_type==="private"&&c.pc_name&&c.pc_name.toLowerCase().trim()===ne.agent_uid.toLowerCase().trim()):[],l=s.reduce((c,g)=>c+(Je[g.email]??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:Xe?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:Xe?"normal":"italic"},children:Xe||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:i})]})]}),s.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[s.map(c=>{const g=Je[c.email]??0;return e.jsxs("button",{style:{...n.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>$((Ne==null?void 0:Ne.lan_uid)||"",c.email),title:`Xem tệp của ${c.email}`,children:["📁 ",g," tệp"]},c.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[l," tệp"]})]})]}),s.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:n.detailValue,children:ne.ftp_ports||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:n.detailValue,children:e.jsx("button",{onClick:()=>{Wr(ne),jt("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:n.detailValue,children:ne.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!ne.ftp_sites||ne.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:ne.ftp_sites.map((Ue,Xe)=>{const We=Ue.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${We?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:We?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:We?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:We?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:We?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",Ue.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",We?"Đang chạy":"Đã dừng",")"]})]}),Ue.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",Ue.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:Ue.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:Ue.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:Ue.ftp_password||"goxprint"})]})]})]})]},Xe)})})]})]},ne.agent_uid)})})},"agents-tab")})}function Vn(a){var s,l,c,g,m,d,R,k,I,P,v;const{AgentPage:w,activeLoadingFile:A,activeModal:b,activeTab:Y,allocatedVncAddr:J,cameraFiles:be,cameraForm:se,cameraLogs:me,cameraStatus:Ae,cameraTestLoading:x,cameraTestResult:ue,cameras:ae,camerasLoading:N,commandStatus:he,confirmModal:fe,copierCredentials:Qe,customRecordDuration:U,customRunCommand:T,deleteScanPointModal:we,directLan:te,editIpModalData:Ge,editableSettingsText:dt,emailFileCounts:Je,executeRemoteInstallDriver:pt,expandedDriverMenus:_e,expandedDrivers:xe,expandedPrinters:oe,fetchCameraFiles:ye,fetchCameraStatus:Re,fetchRemotePage:K,fetchRemotePageOld:Ye,formatBytes:Ke,formatJsonText:He,ftpDetailData:ke,getDestinationStatus:Ct,getDestinationStatusHtml:H,getLiveQueryTimestamp:Nt,handleAddPrivateFtp:mt,handleAddPublicFtp:xt,handleCloseWebPreview:ut,handleConfirmDeleteScanPoint:gt,handleCopierClick:yt,handleDeleteCamera:Ut,handleDeleteCameraFile:E,handleDeleteDest:j,handleEditIP:G,handleEmergencyRestart:q,handleFetchEntryDetail:$,handleHistoryBack:W,handleHistoryForward:z,handleOpenStorageFiles:f,handlePlaySegmentFile:C,handleQueryVideo:Z,handleRecord30s:D,handleRefetchAddressBook:S,handleRemoteInstallDriver:_,handleSaveAuth:ge,handleSaveCameraConfig:Te,handleSaveEditIP:le,handleSaveSettings:ze,handleStartToshibaVnc:Le,handleTestCameraConnection:tt,handleToggleDirectLan:F,handleToggleSetting:je,handleTriggerUtility:Ie,handleTriggerUtilityExec:B,handleViewScanPointsJson:Se,installDriverModal:re,ipInputModal:h,isRecording30s:at,isSavingSettings:ce,lanSites:br,lanSitesLoading:Bt,liveAddressBooks:Sr,lockAspect:ve,modalContentRef:Gt,pollCommandStatus:vr,previewBlobUrl:er,previewIframeRef:tr,privateFtpData:rr,privateFtpLoading:X,publicFtpData:kt,publicFtpLoading:nr,queriedVideoUrl:ir,queryDuration:zt,queryTimestamp:wr,queryVideoLoading:Tr,recording30sCountdown:Mr,remoteLockPrinter:Ze,resolveRelativePath:Fr,saveAuthLoading:Ur,savedLocal:Dt,scaleX:Ne,scaleY:ot,scanAutoOpenDir:At,scanAutoOpenFile:Ht,scanPointsViewerModal:De,selectedCamera:jt,selectedCameraAgentUid:sr,selectedLan:Oe,selectedLanUid:Ot,selectedTargetAgents:It,selectedUtilityAgent:bt,setActiveLoadingFile:$t,setActiveModal:de,setActiveTab:Wt,setAllocatedVncAddr:Cr,setCameraFiles:kr,setCameraForm:Ar,setCameraLogs:Pe,setCameraStatus:Me,setCameraTestLoading:ar,setCameraTestResult:Tt,setCameras:Yr,setCamerasLoading:Zr,setCommandStatus:jr,setConfirmModal:Vt,setCopierCredentials:en,setCustomRecordDuration:tn,setCustomRunCommand:Ir,setDeleteScanPointModal:Jt,setDirectLan:rn,setEditIpModalData:Kt,setEditableSettingsText:Br,setEmailFileCounts:nn,setExpandedDriverMenus:qt,setExpandedDrivers:Gr,setExpandedPrinters:sn,setFtpDetailData:Pr,setInstallDriverModal:St,setIpInputModal:rt,setIsRecording30s:an,setIsSavingSettings:Xt,setLanSites:on,setLanSitesLoading:or,setLiveAddressBooks:O,setLockAspect:zr,setPreviewBlobUrl:Er,setPrivateFtpData:Pt,setPrivateFtpLoading:ln,setPublicFtpData:lr,setPublicFtpLoading:cn,setQueriedVideoUrl:dn,setQueryDuration:Hr,setQueryTimestamp:nt,setQueryVideoLoading:pn,setRecording30sCountdown:Q,setRemoteLockPrinter:cr,setSaveAuthLoading:$r,setScaleX:ht,setScaleY:$e,setScanAutoOpenDir:Wr,setScanAutoOpenFile:dr,setScanPointsViewerModal:pr,setSelectedCamera:Rr,setSelectedCameraAgentUid:mn,setSelectedLanUid:Qt,setSelectedTargetAgents:un,setSelectedUtilityAgent:Et,setSettingsSaveStatus:gn,setShowPreviewDetails:mr,setShowSettings:hn,setStorageFiles:Ee,setStorageLoading:fn,setStorageModalData:ee,setToasts:ur,setToshibaVncData:Vr,setUtilityActionPending:Rt,setUtilityCommands:Lr,setUtilityCommandsLoading:_n,setUtilitySettingsLoading:xn,setUtilityStatusMsg:Fe,setViewOutputModal:it,setVncTunnelLoading:Yt,setWebPreviewHistory:Jr,setWebPreviewHistoryIndex:yn,setWebPreviewLoading:Mt,setWebPreviewModal:Kr,setWebPreviewTab:lt,settingsSaveStatus:vt,showPreviewDetails:Zt,showSettings:gr,showToast:qe,storageFiles:Nr,storageLoading:hr,storageModalData:fr,toasts:bn,toshibaVncData:ft,utilityActionPending:V,utilityCommands:_r,utilityCommandsLoading:qr,utilitySettingsLoading:Xr,utilityStatusMsg:ne,viewOutputModal:et,vncTunnelLoading:Ue,webPreviewHistory:Xe,webPreviewHistoryIndex:We,webPreviewLoading:xr,webPreviewModal:r,webPreviewTab:i}=a;return e.jsxs(e.Fragment,{children:[e.jsx(wt,{children:b&&e.jsx("div",{style:n.modalOverlay,onClick:()=>de(null),children:e.jsxs(st.div,{style:n.modalCard,onClick:t=>t.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[b==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:n.modalSubtitle,children:fr.email})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:hr?e.jsxs("div",{style:n.modalLoading,children:[e.jsx(_t,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):Nr.length===0?e.jsx("div",{style:n.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:n.filesList,children:Nr.map((t,o)=>e.jsxs("div",{style:n.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${t.url}`,target:"_blank",rel:"noreferrer",style:n.fileLinkName,children:t.name}),e.jsxs("div",{style:n.fileMetaDetails,children:["Dung lượng: ",Ke(t.size)," · Mtime: ",new Date(t.mtime).toLocaleString("vi-VN")]}),t.upload_completed_at&&e.jsxs("div",{style:n.fileUploadMeta,children:["Tải lên VPS: ",new Date(t.upload_completed_at).toLocaleTimeString("vi-VN"),t.upload_duration!=null?` (${t.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${t.url}`,download:!0,target:"_blank",rel:"noreferrer",style:n.fileDownloadBtn,children:"Tải về"})]},o))})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>f(fr.lanUid,fr.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>de(null),children:"Đóng"})]})]}),b==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:n.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:kt.name,onChange:t=>lr(o=>({...o,name:t.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: goxprint@gmail.com",value:kt.email,onChange:t=>lr(o=>({...o,email:t.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:n.modalInput,value:kt.agentUid,onChange:t=>lr(o=>({...o,agentUid:t.target.value})),children:(Oe&&Oe.agents||[]).filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:xt,disabled:nr,children:nr?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>de(null),children:"Hủy bỏ"})]})]}),b==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: user.pc1@gmail.com",value:rr.email,onChange:t=>Pt(o=>({...o,email:t.target.value}))}),e.jsxs("span",{style:n.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",rr.agentUid]})]})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:mt,disabled:X,children:X?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>de(null),children:"Hủy bỏ"})]})]}),b==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:n.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(s=infoDetailData.details)==null?void 0:s.proto})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Server Host:"}),e.jsx("span",{style:n.detailValue,children:(l=infoDetailData.details)==null?void 0:l.server})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:n.detailValue,children:(c=infoDetailData.details)==null?void 0:c.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace"},children:(g=infoDetailData.details)==null?void 0:g.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>de(null),children:"Đóng cửa sổ"})})]}),b==="ftp_detail"&&ke&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:n.modalSubtitle,children:["Cổng Port: ",ke.port]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{de(null),Pr(null)},children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:ke.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:ke.error?"var(--color-error)":"var(--color-success)"},children:ke.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),ke.error&&e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...n.detailValue,color:"var(--color-error)"},children:ke.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...n.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:ke.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{de(null),Pr(null)},children:"Đóng cửa sổ"})})]}),b==="utilities"&&bt&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:n.modalSubtitle,children:["Máy: ",bt.hostname," · IP: ",bt.local_ip,":",bt.web_port||9173]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{de(null),Et(null),Fe(null)},children:"×"})]}),e.jsxs("div",{style:{...n.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[ne&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:ne.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:ne.isError?"#ef4444":"#10b981",border:`1px solid ${ne.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:ne.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:Xr?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(_t,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Ht,onChange:()=>je("scan_auto_open_file",Ht),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:At,onChange:()=>je("scan_auto_open_dir",At),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500,fontSize:"0.8rem",color:"var(--color-text)"},children:"Lối tắt ngoài Desktop (%TEMP%/GoPrinxAgent/ftp)"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Tạo Shortcut thư mục Scan ra màn hình Desktop cho nhân viên dễ mở"})]}),e.jsx("button",{onClick:()=>{const t=_r.find(o=>o.command==="create_scan_shortcut");t?B("create_scan_shortcut",t.command_content):B("create_scan_shortcut",`import os, sys, tempfile, subproce pathlib
temp_dir = pathlib.Path(tempfile.gettempdir()) / "GoPrinxAgent" / "ftp"
temp_dir.mkdir(parents=True, exist_ok=True)
desktop_dir = pathlib.Path.home() / "Desktop"
if not desktop_dir.exists(): desktop_dir = pathlib.Path(os.path.expanduser("~")) / "Desktop"
shortcut_path = desktop_dir / "Thu muc Scan (GoPrinx).lnk"
ps_cmd = f'''
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("{shortcut_path}")
$Shortcut.TargetPath = "{temp_dir}"
$Shortcut.Description = "Thu muc luu tru tep Scan cua GoPrinx PrintAgent"
$Shortcut.Save()
'''
res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], capture_output=True, text=True, errors='ignore')
if shortcut_path.exists(): msg = f"✅ Đã tạo thành công Shortcut 'Thu muc Scan (GoPrinx).lnk' ngoài Desktop!\\nĐường dẫn gốc: {temp_dir}"
else: msg = f"❌ Không thể tạo Shortcut. Lỗi: {res.stderr or res.stdout or 'Không rõ nguyên nhân'}"
if globals().get('context'): globals()['context']['result_payload'] = msg
else: raise RuntimeError(msg)`)},disabled:V!==null,style:{padding:"6px 12px",fontSize:"0.75rem",borderRadius:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-primary)",color:"var(--color-primary)",cursor:V!==null?"not-allowed":"pointer",whiteSpace:"nowrap",fontWeight:600,display:"flex",alignItems:"center",gap:"5px"},children:"🔗 Tạo Shortcut Desktop"})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[qr?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(_t,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsxs(e.Fragment,{children:[_r.length>0?(()=>{const t=_r.filter(u=>u.command!=="dxdiag"&&u.command!=="open_web_setting"),o=t.findIndex(u=>u.command==="sync_all_scanpoints");if(o>-1){const[u]=t.splice(o,1);t.unshift(u)}return t.map(u=>{const y=u.command==="emergency_restart";return e.jsxs("button",{onClick:()=>B(u.command,u.command_content),disabled:V!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:y?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:V!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:V!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:L=>{V===null&&(L.currentTarget.style.borderColor=y?"#ef4444":"var(--color-primary)",L.currentTarget.style.background=y?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:L=>{L.currentTarget.style.borderColor=y?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",L.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:V===u.command?e.jsx(_t,{size:"sm"}):u.icon||"🔧"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:y?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:u.label})]},u.command)})})():e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>Ie("printers"),disabled:V!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:V!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:V!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{V===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:V==="printers"?e.jsx(_t,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>Ie("scan"),disabled:V!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:V!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:V!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{V===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:V==="scan"?e.jsx(_t,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Thư mục Scan"})]})]}),e.jsxs("button",{onClick:()=>{if(!bt)return;Rt("check_watchdog"),Fe({text:"⌛ Đang kiểm tra watchdog...",isError:!1}),triggerAgentUtilityExec(bt.agent_uid,"check_watchdog",`import subproce os, sys
results = []
def check(name):
    try:
        out = subprocess.check_output(['tasklist', '/FI', f'IMAGENAME eq {name}'], text=True, creationflags=0x08000000)
        count = out.lower().count(name.lower())
        return count
    except:
        return 0

wd = check('cmd.exe')
pa = check('printagent.exe')

exe_dir = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.getcwd()
wd_exists = os.path.exists(os.path.join(exe_dir, 'watchdog.bat'))

lines = []
lines.append(f'printagent.exe: {pa} process(es) running')
lines.append(f'watchdog.bat file: {"EXISTS" if wd_exists else "NOT FOUND"} in {exe_dir}')
raise RuntimeError('\\n'.join(lines))`).then(o=>{if(o.ok&&o.command_id){const y=Date.now(),L=setInterval(async()=>{if(Date.now()-y>3e4){clearInterval(L),Fe({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),Rt(null);return}try{const M=await getCommandStatus(o.command_id);if(M.status==="success"){clearInterval(L);const Ce=M.result_payload||M.result||M.error||"Hoàn thành";it({isOpen:!0,title:"🩺 Check Watchdog",content:Ce}),Fe(null),Rt(null)}else if(M.status==="failed"){clearInterval(L);const Ce=M.error||M.result_payload||M.result||"Failed";it({isOpen:!0,title:"🩺 Check Watchdog",content:Ce}),Fe(null),Rt(null)}}catch{}},2e3)}else Fe({text:"❌ "+(o.error||"Không thể gửi lệnh"),isError:!0}),Rt(null)}).catch(o=>{Fe({text:"❌ "+o.message,isError:!0}),Rt(null)})},disabled:V!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:V!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:V!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{V===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:V==="check_watchdog"?e.jsx(_t,{size:"sm"}):"🩺"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Check watchdog"})]}),e.jsxs("button",{onClick:q,disabled:V!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"12px",padding:"16px 8px",cursor:V!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:V!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{V===null&&(t.currentTarget.style.borderColor="#ef4444",t.currentTarget.style.background="rgba(239, 68, 68, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="rgba(239, 68, 68, 0.25)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:V==="emergency_restart"?e.jsx(_t,{size:"sm"}):"🔌"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#ef4444",lineHeight:"1.2",wordBreak:"break-word"},children:"Emergency Kill"})]})]}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:T,onChange:t=>Ir(t.target.value),onKeyDown:t=>{t.key==="Enter"&&T.trim()&&Ie("run_command",{command_line:T.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:V!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{T.trim()&&Ie("run_command",{command_line:T.trim()})},disabled:V!==null||!T.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:T.trim()?"var(--color-primary)":"var(--color-surface)",color:T.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:T.trim()&&V===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:V==="run_command"?e.jsx(_t,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(t=>e.jsx("button",{onClick:()=>Ir(t.cmd),disabled:V!==null,title:t.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:T===t.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:T===t.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:V!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:t.label},t.cmd))})]})]})]})]}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{de(null),Et(null),Fe(null)},children:"Đóng cửa sổ"})})]}),b==="edit_ip"&&Ge&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:t=>{const o=t.target.value;o&&Kt(u=>{if(!u)return null;const y=u.newPort||"2130";return{...u,newIp:`${o}:${y}`,newPort:y}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((Oe==null?void 0:Oe.agents)||[]).map((t,o)=>{const u=t.local_ip||t.ip||"",y=t.hostname||t.uid||`Agent ${o+1}`;return e.jsxs("option",{value:u,children:[y," (",u,")"]},o)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:Ge.newPort||"",onChange:t=>{const o=t.target.value;Kt(u=>{if(!u)return null;let y=u.newIp||"";return y.includes(":")&&(y=y.split(":")[0]),{...u,newPort:o,newIp:o?`${y}:${o}`:y}})},placeholder:"2130",style:n.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:Ge.newIp,onChange:t=>{const o=t.target.value;Kt(u=>{if(!u)return null;let y=u.newPort||"2130";return o.includes(":")&&(y=o.split(":")[1].trim()||y),{...u,newIp:o,newPort:y}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:n.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",Ge.entry.folder||Ge.entry.physical_path||Ge.entry.folder_path]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>de(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...n.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(Ge.newIp||"").trim().includes(":")){qe("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}le()},disabled:!Ge.newIp.trim(),children:"Lưu lại"})]})]}),b==="remote_lock"&&Ze&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:Ze.name})," (",Ze.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{de(null),qe(`Đang gửi lệnh khóa máy ${Ze.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ze.ip,action:"lock_machine",agent_uid:Ze.agentUid}).then(t=>{t.ok?qe(`Đã gửi lệnh khóa máy ${Ze.name} thành công!`,"success"):qe("Lỗi: "+(t.error||"Failed"),"error")}).catch(t=>{qe("Lỗi: "+t.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{de(null),qe(`Đang gửi lệnh mở khóa máy ${Ze.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ze.ip,action:"enable_machine",agent_uid:Ze.agentUid}).then(t=>{t.ok?qe(`Đã gửi lệnh mở khóa máy ${Ze.name} thành công!`,"success"):qe("Lỗi: "+(t.error||"Failed"),"error")}).catch(t=>{qe("Lỗi: "+t.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),b==="toshiba_vnc"&&ft&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["📺 Kết nối VNC - ",ft.printerName]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:Ue?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:te?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{de(null),window.open(`http://${ft.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):J?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${ft.agentUid}&ip=${ft.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async t=>{const o=t.currentTarget.getBoundingClientRect(),u=t.clientX-o.left,y=t.clientY-o.top,L=u/o.width,M=y/o.height,Ce=Math.round(L*1024),pe=Math.round(M*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:ft.agentUid,ip:ft.ip,port:49105,x:Ce,y:pe})})}catch(Be){console.error("VNC Click error:",Be)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!te&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:J})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(J),qe("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),qe("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${J}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{de(null),K(ft.ip,"","GET",null,!1,ft.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(wt,{children:fe.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>Vt(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:n.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["⚠️ ",fe.title]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Vt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:fe.message})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var t;Vt(o=>({...o,isOpen:!1})),(t=fe.onConfirm)==null||t.call(fe)},children:"Đồng ý"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Vt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(wt,{children:we.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>Jt(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:{...n.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Jt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((m=we.entry)==null?void 0:m.name)||((d=we.entry)==null?void 0:d.name_1)||((R=we.entry)==null?void 0:R.email_address)||((k=we.entry)==null?void 0:k.folder)||((I=we.entry)==null?void 0:I.registration_no)||"không tên",'"']}),((P=we.entry)==null?void 0:P.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(v=we.entry)==null?void 0:v.registration_no]})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:n.modalInput,value:we.agentUid,onChange:t=>Jt(o=>({...o,agentUid:t.target.value})),children:(Oe&&Oe.agents||[]).filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))}),e.jsx("span",{style:n.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:gt,children:"Xác nhận xóa"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Jt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(wt,{children:re.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>St(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:n.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>St(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:"0 0 12px 0"},children:["Bạn chuẩn bị cài đặt driver ",e.jsxs("strong",{children:['"',re.driverName,'"']})," từ xa."]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),!(Oe!=null&&Oe.agents)||Oe.agents.filter(t=>t.is_agent_active).length===0?e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-text-secondary)",fontStyle:"italic",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px"},children:"Không có Agent online trong LAN này"}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px",maxHeight:"200px",overflowY:"auto"},children:Oe.agents.filter(t=>t.is_agent_active).map(t=>{const o=re.selectedAgentUids.includes(t.agent_uid);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"0.82rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:o,onChange:u=>{St(y=>{const L=y.selectedAgentUids;return u.target.checked?{...y,selectedAgentUids:[...L,t.agent_uid]}:{...y,selectedAgentUids:L.filter(M=>M!==t.agent_uid)}})},style:{width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsxs("span",{children:[t.hostname," (",t.local_ip,")"]})]},t.agent_uid)})})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:re.selectedAgentUids.length===0,onClick:()=>{St(t=>({...t,isOpen:!1})),re.selectedAgentUids.forEach(t=>{pt(re.printerId,re.brand,re.model,re.driverName,re.driverUrl,t)})},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>St(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(wt,{children:h.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:170},onClick:()=>rt(t=>({...t,isOpen:!1,error:""})),children:e.jsxs(st.div,{style:n.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:h.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>rt(t=>({...t,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[h.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:h.value,onChange:t=>rt(o=>({...o,value:t.target.value,error:""})),onKeyDown:t=>{if(t.key==="Enter"){const o=/^(\d{1,3}\.){3}\d{1,3}$/;if(!o.test(h.value.trim())){rt(L=>({...L,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const u=(h.changeAllTo||"").trim();if(u&&!o.test(u)){rt(L=>({...L,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const y=h.onConfirm;rt(L=>({...L,isOpen:!1,error:""})),y(h.value.trim(),u)}t.key==="Escape"&&rt(o=>({...o,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:h.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:t=>{h.error||(t.target.style.borderColor="var(--color-primary)")},onBlur:t=>{h.error||(t.target.style.borderColor="var(--color-surface-light)")}}),h.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:h.changeAllTo||"",onChange:t=>rt(o=>({...o,changeAllTo:t.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:t=>{t.target.style.borderColor="var(--color-primary)"},onBlur:t=>{t.target.style.borderColor="var(--color-surface-light)"}})]}),h.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",h.error]}),h.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:h.scanStatus})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const t=/^(\d{1,3}\.){3}\d{1,3}$/;if(!t.test(h.value.trim())){rt(y=>({...y,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const o=(h.changeAllTo||"").trim();if(o&&!t.test(o)){rt(y=>({...y,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const u=h.onConfirm;rt(y=>({...y,isOpen:!1,error:""})),u(h.value.trim(),o)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>rt(t=>({...t,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(wt,{children:et.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>it(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:{...n.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:{...n.modalTitle,fontSize:"0.85rem"},children:et.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>it(t=>({...t,isOpen:!1})),children:"×"})]}),et.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:Gt,value:dt,onChange:t=>Br(t.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),vt&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:vt.startsWith("❌")?"rgba(239,68,68,0.1)":vt.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:vt.startsWith("❌")?"#f87171":vt.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${vt.startsWith("❌")?"rgba(239,68,68,0.15)":vt.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:vt})]}):e.jsx("pre",{ref:Gt,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:He(et.content)}),e.jsxs("div",{style:{...n.modalFooter,marginTop:"10px"},children:[et.title.includes("settings.json")&&e.jsx("button",{disabled:ce,style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:ce?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:ce?"not-allowed":"pointer"},onClick:ze,children:ce?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(et.title.includes("settings.json")?dt:He(et.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>it(t=>({...t,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(wt,{children:r&&r.isOpen&&e.jsxs("div",{className:"web-preview-modal-overlay",style:{...n.confirmOverlay,zIndex:190,alignItems:"flex-start",paddingTop:"5vh"},onClick:ut,children:[e.jsx("style",{children:`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              @media (max-width: 767px) {
                .web-preview-modal-overlay {
                  padding-top: 0px !important;
                  align-items: center !important;
                  justify-content: center !important;
                }
                .web-preview-modal-card {
                  width: 100% !important;
                  height: 100vh !important;
                  max-height: 100vh !important;
                  border-radius: 0px !important;
                  padding: 12px !important;
                  margin: 0 !important;
                }
              }
            `}),(()=>{let t="Trang cấu hình máy in";if(r.html&&r.html!=="LOADING"&&!r.html.startsWith("ERROR:"))if(r.html==="DIRECT_LAN")t="Kết nối trực tiếp LAN";else{const o=r.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);o&&o[1]&&(t=o[1].trim())}return e.jsxs(st.div,{className:"web-preview-modal-card",style:{...n.confirmModalCard,maxWidth:"1200px",width:"95%",height:"85vh",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px"},onClick:o=>o.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:{...n.modalTitle,fontSize:"0.85rem"},children:r.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:ut,children:"×"})]}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",gap:"15px",minHeight:0},children:r.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px"},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"var(--color-text-secondary)",fontWeight:500},children:"Đang đợi phản hồi từ Agent..."}),e.jsx("span",{style:{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",textAlign:"center",maxWidth:"320px"},children:"Agent đang kết nối trực tiếp đến máy in và nạp cấu hình..."})]}):r.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"2.2rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600,textAlign:"center"},children:"Lỗi lấy trang Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.75rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"12px",background:"rgba(239, 68, 68, 0.08)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.15)",width:"100%",boxSizing:"border-box",fontFamily:"monospace"},children:r.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255, 255, 255, 0.03)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"var(--color-text)"},children:e.jsxs("span",{children:["🔌 Kết nối: ",e.jsx("strong",{children:te?"⚡ Trực tiếp LAN":"🌐 Qua Agent"})]})}),e.jsx("button",{onClick:()=>mr(!Zt),style:{background:"none",border:"none",color:"var(--color-primary)",cursor:"pointer",fontWeight:600,fontSize:"0.72rem",display:"flex",alignItems:"center",gap:"4px"},children:Zt?"Thu gọn ▲":"Cài đặt & Chi tiết ▼"})]}),Zt&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",background:"rgba(16, 185, 129, 0.04)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 14px"},children:[e.jsxs("div",{style:{fontSize:"0.74rem",color:"var(--color-text-secondary)"},children:[e.jsx("span",{style:{color:"#10b981",fontWeight:700},children:"🟢 Kết nối Live:"})," ",t," (",e.jsx("span",{style:{fontFamily:"monospace"},children:r.ip}),")"]}),e.jsx("button",{onClick:()=>window.open(`http://${r.ip}/`,"_blank"),style:{padding:"6px 12px",fontSize:"0.72rem",fontWeight:600,background:"#10b981",border:"none",borderRadius:"6px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.15)"},children:"🌐 Mở trực tiếp LAN"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.74rem",fontWeight:600,color:"var(--color-text)"},children:"🔗 Chế độ kết nối:"}),e.jsxs("div",{style:{display:"flex",gap:"6px"},children:[e.jsx("button",{onClick:()=>F(!1),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:te?"rgba(255,255,255,0.05)":"var(--color-primary)",color:te?"var(--color-text-secondary)":"white",border:te?"1px solid var(--color-surface-light)":"1px solid var(--color-primary)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"🔌 Qua Agent (Từ xa)"}),e.jsx("button",{onClick:()=>F(!0),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:te?"#10b981":"rgba(255,255,255,0.05)",color:te?"white":"var(--color-text-secondary)",border:te?"1px solid #10b981":"1px solid var(--color-surface-light)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"⚡ Trực tiếp LAN (Cùng Wifi)"})]})]}),te&&window.location.protocol==="https:"&&e.jsxs("div",{style:{color:"#fbbf24",background:"rgba(251, 191, 36, 0.08)",border:"1px solid rgba(251, 191, 36, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["⚠️ ",e.jsx("strong",{children:"Mixed Content Block:"})," Trình duyệt di động/máy tính sẽ chặn kết nối HTTP trực tiếp đến IP máy in từ trang web bảo mật HTTPS. Để kết nối trực tiếp thành công, hãy mở trang web quản trị qua ",e.jsx("strong",{children:"HTTP"})," hoặc click nút ",e.jsx("strong",{children:"🌐 Mở trực tiếp LAN"})," phía trên để truy cập trong tab mới."]}),te&&e.jsxs("div",{style:{color:"#60a5fa",background:"rgba(96, 165, 250, 0.08)",border:"1px solid rgba(96, 165, 250, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["💡 ",e.jsx("strong",{children:"Chế độ trực tiếp LAN:"})," Thiết bị kết nối trực tiếp đến IP máy in qua mạng Wifi nội bộ.",e.jsxs("ul",{style:{margin:"4px 0 0 16px",padding:0},children:[e.jsx("li",{children:"Thanh địa chỉ và Lịch sử duyệt sẽ không tự động cập nhật."}),e.jsx("li",{children:"Chức năng thu phóng (Ngang/Dọc) trong iframe không áp dụng (vui lòng zoom bằng thao tác vuốt)."})]})]}),!te&&e.jsxs("div",{style:{color:"var(--color-text-secondary)",background:"rgba(255, 255, 255, 0.02)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:[e.jsx("strong",{style:{color:"var(--color-primary)"},children:"🛠️ Nhật ký & Thông số kết nối ngược (SSH Reverse Tunnel):"}),e.jsxs("div",{style:{marginTop:"6px",fontFamily:"monospace",display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy khách (Agent Uid):"})," ",r.agentUid]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Địa chỉ IP Máy in:"})," ",r.ip]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng dịch vụ máy in:"})," 80"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy chủ VPS:"})," 31.97.76.62"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng kết nối trên VPS (Assigned Port):"})," ",r.url?r.url.split(":").pop():"Đang cấp phát..."]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Phương thức xác thực:"})," SSH Key pair (Root User)"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Đường dẫn kết nối:"})," ",e.jsx("span",{style:{color:"var(--color-text)"},children:r.url||"N/A"})]}),r.url&&e.jsxs("div",{style:{color:"#fbbf24",marginTop:"4px"},children:["⚠️ Nếu Iframe hiển thị màn hình trắng / lỗi kết nối, có thể do trình duyệt chặn nội dung Mixed Content (HTTP trên trang HTTPS). Hãy click nút ",e.jsx("strong",{children:"🔗 Mở tab mới ↗"})," ở thanh điều khiển phía dưới để xem trực tiếp."]})]})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 12px"},children:[e.jsx("button",{onClick:W,disabled:We<=0,style:{background:"none",border:"none",color:We<=0?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:We<=0?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Back",children:"◀"}),e.jsx("button",{onClick:z,disabled:We>=Xe.length-1,style:{background:"none",border:"none",color:We>=Xe.length-1?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:We>=Xe.length-1?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Forward",children:"▶"}),e.jsx("button",{onClick:()=>K(r.ip,r.path),style:{background:"none",border:"none",color:"var(--color-text)",cursor:"pointer",padding:"4px",fontSize:"0.8rem",display:"flex",alignItems:"center"},title:"Refresh",children:"🔄"}),e.jsxs("div",{style:{flex:1,background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontFamily:"monospace",color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:["http://",r.ip,r.path||"/"]}),r.url&&e.jsx("a",{href:r.url,target:"_blank",rel:"noreferrer",style:{background:"var(--color-primary)",color:"white",border:"none",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",marginLeft:"8px"},title:"Mở trang quản trị Web Image Monitor trong tab mới",children:"🔗 Mở tab mới ↗"})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid var(--color-surface-light)",gap:"15px",paddingBottom:"4px"},children:[e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:i==="iframe"?600:500,color:i==="iframe"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:i==="iframe"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>lt("iframe"),children:"🌐 Giao diện máy in"}),e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:i==="html"?600:500,color:i==="html"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:i==="html"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>lt("html"),children:"📄 Xem mã HTML (Text)"})]}),i==="html"?e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px",flex:1,minHeight:0},children:te?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"10px",color:"var(--color-text-secondary)",fontSize:"0.76rem",padding:"20px",textAlign:"center"},children:[e.jsx("span",{children:"📄 Chế độ trực tiếp LAN không tải mã nguồn về server."}),e.jsxs("span",{style:{fontSize:"0.70rem",color:"rgba(255,255,255,0.4)"},children:["Hãy chuyển sang chế độ ",e.jsx("strong",{children:"Qua Agent (Từ xa)"})," để phân tích và xem mã nguồn HTML của máy in."]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Mã nguồn HTML gốc từ máy in:"}),e.jsx("button",{style:{border:"none",background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",padding:"4px 10px",borderRadius:"6px",fontSize:"0.72rem",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"},onClick:()=>{navigator.clipboard.writeText(r.html),qe("Đã copy mã HTML vào clipboard","success")},children:"📋 Copy HTML"})]}),e.jsx("pre",{style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.5,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)"},children:r.html})]})}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↔️ Ngang:"}),e.jsx("button",{onClick:()=>{const o=Math.max(.3,parseFloat((Ne-.05).toFixed(2)));ht(o),ve&&$e(o)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:Ne,onChange:o=>{const u=parseFloat(o.target.value);ht(u),ve&&$e(u)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsx("button",{onClick:()=>{const o=Math.min(2,parseFloat((Ne+.05).toFixed(2)));ht(o),ve&&$e(o)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:"var(--color-text)"},children:[Math.round(Ne*100),"%"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↕️ Dọc:"}),e.jsx("button",{onClick:()=>{const o=Math.max(.3,parseFloat((ot-.05).toFixed(2)));$e(o),ve&&ht(o)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ve,children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:ot,onChange:o=>{const u=parseFloat(o.target.value);$e(u),ve&&ht(u)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)",opacity:ve?.5:1},disabled:ve}),e.jsx("button",{onClick:()=>{const o=Math.min(2,parseFloat((ot+.05).toFixed(2)));$e(o),ve&&ht(o)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ve,children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:ve?"var(--color-text-secondary)":"var(--color-text)"},children:[Math.round(ot*100),"%"]})]}),e.jsx("button",{onClick:()=>{zr(!ve),ve||$e(Ne)},style:{background:ve?"rgba(124, 106, 247, 0.15)":"var(--color-background)",border:ve?"1px solid var(--color-accent, #7c6af7)":"1px solid var(--color-surface-light)",color:ve?"var(--color-accent, #7c6af7)":"var(--color-text-secondary)",padding:"4px 10px",borderRadius:"6px",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",transition:"all 0.2s ease"},title:ve?"Bỏ liên kết tỷ lệ":"Liên kết tỷ lệ Ngang & Dọc",children:ve?"🔗 Đồng bộ":"🔓 Tự do"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("button",{onClick:()=>{ht(.95),$e(.95)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"Mặc định"}),e.jsx("button",{onClick:()=>{ht(1),$e(1)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"100%"}),e.jsx("button",{onClick:()=>{var o;try{const u=tr.current;if(!u)return;const y=u.contentDocument||((o=u.contentWindow)==null?void 0:o.document);if(y&&y.body){const L=y.body.style.width,M=y.body.style.transform;y.body.style.transform="none",y.body.style.width="auto";const Ce=y.body.scrollWidth||y.documentElement.scrollWidth||1024,pe=u.clientWidth||800;if(y.body.style.width=L,y.body.style.transform=M,Ce>0&&pe>0){let Be=pe/Ce;Be=Math.max(.3,Math.min(1.5,Be)),Be=Math.round(Be*20)/20,ht(Be),ve&&$e(Be)}}}catch(u){console.error(u)}},style:{background:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)",color:"#10b981",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:600},children:"📐 Vừa khung"})]})]}),e.jsxs("div",{style:{flex:1,minHeight:0,background:"white",borderRadius:"8px",overflow:"hidden",border:"1px solid var(--color-surface-light)",position:"relative"},children:[e.jsx("iframe",{ref:tr,src:r.url?r.url:te?`http://${r.ip}${r.path||"/"}`:er,style:{width:"100%",height:"100%",border:"none",background:"white"}}),xr&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang đợi phản hồi từ Agent..."})]})]})]})]})}),e.jsxs("div",{style:{...n.modalFooter,marginTop:"15px",flexShrink:0,borderTop:"1px solid var(--color-surface-light)",paddingTop:"12px"},children:[r.html!=="LOADING"&&!r.html.startsWith("ERROR:")&&e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const o=new Blob([r.html],{type:"text/html;charset=utf-8"}),u=URL.createObjectURL(o);window.open(u,"_blank")},children:"↗️ Xem mã HTML gốc"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)",marginLeft:"8px"},onClick:()=>Kr(o=>o?{...o,isOpen:!1}:null),children:"Đóng"})]})]})})()]})}),e.jsx(wt,{children:De.isOpen&&e.jsx(st.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>pr(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[De.copierName," · MAC: ",De.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>pr(t=>({...t,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:De.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(De.jsonData,null,2)),qe("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(De.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>pr(t=>({...t,isOpen:!1})),children:"Đóng"})})]})})})]})}const ct="https://agentapi.quanlymay.com",Jn=(a={})=>{const{...w}=a,[A,b]=p.useState([]),[Y,J]=p.useState(()=>localStorage.getItem("goxprint_selected_lan_uid")||""),[be,se]=p.useState(!1),[me,Ae]=p.useState(""),[x,ue]=p.useState(()=>{const r=localStorage.getItem("goxprint_active_tab");return r==="agents"||r==="copiers"||r==="cameras"?r:"agents"}),[ae,N]=p.useState({}),[he,fe]=p.useState(()=>{try{const r=localStorage.getItem("goxprint_expanded_printers");return r?JSON.parse(r):{}}catch{return{}}}),[Qe,U]=p.useState({}),[T,we]=p.useState({}),[te,Ge]=p.useState({}),[dt,Je]=p.useState({}),[pt,_e]=p.useState({}),[xe,oe]=p.useState(()=>{try{const r=sessionStorage.getItem("gox_live_address_books");return r?JSON.parse(r):window._liveAddressBooksCache||{}}catch{return window._liveAddressBooksCache||{}}}),ye=p.useCallback(r=>{oe(i=>{const s=typeof r=="function"?r(i):r;try{window._liveAddressBooksCache=s,sessionStorage.setItem("gox_live_address_books",JSON.stringify(s))}catch{}return s})},[]),[Re,K]=p.useState([]),[Ye,Ke]=p.useState(!1),[He,ke]=p.useState(null),[Ct,H]=p.useState({id:null,camera_name:"Camera mới",rtsp_url:"",segment_duration:60,prefix:"rec",video_codec:"copy",audio_codec:"copy",no_audio:!0}),[Nt,mt]=p.useState(null),[xt,ut]=p.useState([]),[gt,yt]=p.useState([]),[Ut,E]=p.useState(null),[j,G]=p.useState(!1),[q,$]=p.useState(""),[W,z]=p.useState(10),[f,C]=p.useState(""),[Z,D]=p.useState(!1),[S,_]=p.useState(!1),[ge,Te]=p.useState(null),[le,ze]=p.useState(!1),[Le,tt]=p.useState(30),[F,je]=p.useState(30);p.useEffect(()=>{Z||Te(null)},[Z]),p.useEffect(()=>{window.fnGetCookie=r=>"",window.fnSetCookie=(r,i)=>{},window.fnGetLocalestring=r=>"",window.fnGetHelp=r=>{}},[]);const[Ie,B]=p.useState([]),[Se,re]=p.useState(null),[h,at]=p.useState(null),[ce,br]=p.useState(null),[Bt,Sr]=p.useState(null),[ve,Gt]=p.useState(null),[vr,er]=p.useState(""),[tr,rr]=p.useState(!1),[X,kt]=p.useState(null),[nr,ir]=p.useState(!1),[zt,wr]=p.useState(()=>localStorage.getItem("goxprint_direct_lan")==="true");p.useEffect(()=>{localStorage.setItem("goxprint_direct_lan",String(zt))},[zt]);const Tr=r=>{const i=(r||"").toLowerCase();return i.includes("ricoh")||i.includes("savin")||i.includes("aficio")||i.includes("gestetner")||i.includes("lanier")||i.includes("infotec")||i.includes("mp ")||i.startsWith("mp")||i.includes("im ")||i.startsWith("im")||i.includes("pro ")||i.startsWith("pro")?"ricoh":i.includes("toshiba")?"toshiba":i.includes("xerox")||i.includes("fujifilm")||i.includes("apeos")||i.includes("workcentre")||i.includes("versalink")||i.includes("altalink")?"xerox":"other"},[Mr,Ze]=p.useState("iframe"),[Fr,Ur]=p.useState(()=>window.innerWidth>=768),[Dt,Ne]=p.useState([]),[ot,At]=p.useState(-1),[Ht,De]=p.useState(""),[jt,sr]=p.useState(.95),[Oe,Ot]=p.useState(.95),[It,bt]=p.useState(!0),$t=p.useRef(null),de=p.useRef(null),Wt=p.useRef({}),[Cr,kr]=p.useState(null),[Ar,Pe]=p.useState({isOpen:!1,title:"",message:"",onConfirm:()=>{}}),[Me,ar]=p.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[Tt,Yr]=p.useState({isOpen:!1,printerId:"",brand:"",model:"",driverName:"",driverUrl:"",selectedAgentUids:[]}),[Zr,jr]=p.useState({isOpen:!1,title:"🌐 Đổi địa chỉ IP tĩnh",hint:"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.",value:"",changeAllTo:"",scanStatus:"",error:"",onConfirm:()=>{}}),[Vt,en]=p.useState({lanUid:"",email:""}),[tn,Ir]=p.useState([]),[Jt,rn]=p.useState(!1),[Kt,Br]=p.useState({printerId:"",name:"",email:"",agentUid:""}),[nn,qt]=p.useState(!1),[Gr,sn]=p.useState({lanUid:"",agentUid:"",email:""}),[Pr,St]=p.useState(!1),[rt]=p.useState({regNo:"",name:"",details:null}),[an,Xt]=p.useState({isOpen:!1,copierName:"",macId:"",loading:!1,jsonData:null}),on=async r=>{const i=!!(r.agent_uid&&!r.mac_id&&!r.mac_address),s=(r.mac_id||r.mac_address||"").replace(/-/g,":").toUpperCase(),l=r.agent_uid||r.agentUid||"";Xt({isOpen:!0,copierName:r.hostname?`Máy tính: ${r.hostname}`:r.printer_name||r.name||"Máy Photocopy",macId:s||l,loading:!0,jsonData:null});try{const c=i?`${ct}/api/lan-sites/scan-points?agent_uid=${encodeURIComponent(l)}`:`${ct}/api/lan-sites/scan-points?mac_id=${encodeURIComponent(s)}`,m=await(await fetch(c)).json();m.ok&&m.scan_points?Xt(d=>({...d,loading:!1,jsonData:i?m.scan_points:m.scan_points[s]&&Object.keys(m.scan_points[s]).length>0?m.scan_points[s]:Object.keys(m.scan_points).length>0?m.scan_points:r.address_book_sync||{}})):Xt(d=>({...d,loading:!1,jsonData:r.address_book_sync||{message:"Không tìm thấy dữ liệu scan_points.json trên VPS"}}))}catch{Xt(g=>({...g,loading:!1,jsonData:r.address_book_sync||{error:"Lỗi kết nối VPS"}}))}},[or]=p.useState(()=>localStorage.getItem("goxprint_last_viewed_copier_id")||"");p.useEffect(()=>{localStorage.setItem("goxprint_active_tab",x)},[x]),p.useEffect(()=>{localStorage.setItem("goxprint_expanded_printers",JSON.stringify(he))},[he]);const O=p.useCallback((r,i="info",s=5e3)=>{const l=Math.random().toString(36).substring(2,9);B(c=>[...c,{id:l,message:r,type:i}]),s>0&&setTimeout(()=>{B(c=>c.filter(g=>g.id!==l))},s)},[]),zr=p.useCallback((r,i,s="info")=>{B(l=>[...l.filter(c=>c.id!==r),{id:r,message:i,type:s}])},[]),Er=(r,i)=>{if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:"))try{const m=new URL(r);return m.pathname+m.search}catch{return r}if(r.startsWith("/"))return r;const l=i.split("?")[0].split("/");l.pop();const g=l.join("/")+"/"+r;try{const m=new URL(g,"http://localhost");return m.pathname+m.search}catch{return g}},Pt=async(r,i,s="GET",l,c=!1,g,m=80)=>{const d=g||(X==null?void 0:X.agentUid);if(!d){console.error("No agent UID available for remote page fetch"),O("Không tìm thấy Target Agent UID","error");return}if(zt){window.open(`http://${r}:${m}${i||"/"}`,"_blank");return}const R=(I,P)=>`
      <html>
        <head>
          <title>${I}</title>
          <style>
            body {
              background: #0f172a;
              color: #f8fafc;
              font-family: sans-serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .spinner {
              border: 4px solid rgba(255,255,255,0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #3b82f6;
              animation: spin 1s linear infinite;
              margin-bottom: 16px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${I}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${P}</div>
        </body>
      </html>
    `,k=window.open("about:blank","_blank");k&&k.document.write(R("Đang kết nối tên miền...",`Đang kết nối đến máy in ${r} qua tên miền *.app.goxprint.com...`));try{const P=await(await fetch(`${ct}/api/agents/${d}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:r,printer_port:m})})).json();P.ok?k&&P.url&&(k.location.href=P.url):(k&&k.close(),O("Kết nối lỗi: "+(P.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch(I){k&&k.close(),O("Lỗi hệ thống VPS: "+(I.message||I),"error")}},ln=()=>{if(ot>0&&X){const r=ot-1;At(r),Pt(X.ip,Dt[r],"GET",void 0,!0)}},lr=()=>{if(ot<Dt.length-1&&X){const r=ot+1;At(r),Pt(X.ip,Dt[r],"GET",void 0,!0)}},cn=r=>{wr(r),X&&(r?(kt(i=>i?{...i,html:"DIRECT_LAN"}:null),ir(!1)):Pt(X.ip,X.path,"GET",void 0,!1,X.agentUid))},dn=()=>{X&&X.agentUid&&fetch(`${ct}/api/agents/${X.agentUid}/tunnel/stop`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:X.ip})}).catch(console.error),kt(null),ir(!1),Ne([]),At(-1)};p.useEffect(()=>{const r=i=>{const s=i.data;if(!(!s||typeof s!="object")&&!(!X||!X.ip)){if(s.type==="iframe_navigate"){const l=Er(s.href,s.currentPath);Pt(X.ip,l)}else if(s.type==="iframe_submit"){const l=Er(s.action,s.currentPath);Pt(X.ip,l,"POST",s.formData)}}};return window.addEventListener("message",r),()=>window.removeEventListener("message",r)},[X,Dt,ot]),p.useEffect(()=>{if(X!=null&&X.html&&X.html!=="LOADING"&&!X.html.startsWith("ERROR:")){const r=new Blob([X.html],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(r);return De(i),()=>{URL.revokeObjectURL(i)}}else De("")},[X==null?void 0:X.html]),p.useEffect(()=>{const r=()=>{var s;try{const l=$t.current;if(!l)return;const c=l.contentDocument||((s=l.contentWindow)==null?void 0:s.document);c&&c.body&&(c.documentElement.style.height="auto",c.body.style.height="auto",c.body.style.minHeight="100%",c.body.style.transform=`scale(${jt}, ${Oe})`,c.body.style.transformOrigin="top left",c.body.style.width=`${100/jt}%`,c.body.style.boxSizing="border-box")}catch(l){console.error("Failed to apply scaling:",l)}};r();const i=$t.current;if(i)return i.addEventListener("load",r),()=>{i.removeEventListener("load",r)}},[Ht,jt,Oe]);const Hr=p.useRef({}),nt=p.useCallback(async(r=!1)=>{r&&se(!0);try{const i=await In();b(i),Array.isArray(i)&&i.forEach(s=>{const l=s.agents||s.nodes||[];Array.isArray(l)&&l.forEach(c=>{const g=c.agent_uid||c.uid,m=c.local_ip||c.ip;if(g&&m){const d=Hr.current[g];if(d&&d!==m){const R=`⚠️ Máy tính Agent (${g}) vừa thay đổi địa chỉ IP từ ${d} sang ${m}!`;O(R,"warning");const k=`[JOB LOG - IP CHANGE DETECTED] Vì địa chỉ IP máy PC (${g}) đổi từ ${d} sang ${m}, tất cả điểm scan (address_list.folder chứa ${d}) sẽ được tự động cập nhật sang ${m} bằng lệnh ricoh_change_scan / toshiba_change_scan.`;console.log("📌 "+k);try{fetch(`${ct}/api/jobs/log`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"ip_changed",agent_uid:g,old_ip:d,new_ip:m,log_text:k})}).catch(()=>{})}catch{}const I=s.printers||[],P=v=>{if(!v)return"";let t=v.trim();return t.includes("://")&&(t=t.split("://")[1]),t=t.split("/")[0].split(":")[0].trim(),t};I.forEach(v=>{const t=Tr(v.printer_name||v.name||"");if(t!=="ricoh"&&t!=="toshiba"&&t!=="xerox")return;let o=[];v.address_book_data&&Array.isArray(v.address_book_data.address_list)&&(o=v.address_book_data.address_list),o.filter(y=>{if(!y)return!1;const L=y.folder||y.server_host||y.server||"",M=P(L);return String(y.protocol||"").toUpperCase()==="EMAIL"?!1:M===d}).forEach(y=>{const L=t==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",M=y.registration_no||y.id||"",Ce=y.name||y.username||y.display_name||"",pe=v.ip||v.printer_ip||"",Be=v.auth_user||v.username,Dr=v.auth_password||v.password||"";if(!Be){console.warn(`[AUTO TRIGGER] Skip auto trigger change_ftp for printer ${pe}: No auth user credentials configured.`);return}console.log(`🚀 [AUTO TRIGGER ${L.toUpperCase()}] Printer: ${pe}, Target ID: ${M}, Name: ${Ce}, IP: ${d} -> ${m}`),Lt(g,L,"",{printer_ip:pe,auth_user:Be,auth_password:Dr,target_id:M,target_name:Ce,old_ip:d,new_ip:m}).then(Sn=>{console.log(`✅ [AUTO TRIGGER ${L.toUpperCase()} SUCCESS]:`,Sn)}).catch(Sn=>{console.error(`❌ [AUTO TRIGGER ${L.toUpperCase()} ERROR]:`,Sn)})})})}Hr.current[g]=m}})}),i&&i.length>0,i.length>0&&J(s=>{if(s&&i.some(m=>m.lan_uid===s))return s;const c=localStorage.getItem("goxprint_selected_lan_uid");return c&&i.some(m=>m.lan_uid===c)?c:(localStorage.setItem("goxprint_selected_lan_uid",i[0].lan_uid),i[0].lan_uid)})}catch(i){console.error(i),O("Không thể kết nối dữ liệu VPS","error")}finally{r&&se(!1)}},[O]);p.useEffect(()=>{nt(!0);const r=setInterval(()=>{nt(!1)},5e3);return()=>clearInterval(r)},[nt]),p.useEffect(()=>{const r=setInterval(async()=>{try{const i=await fetch(`${ct}/api/agent-ips`,{headers:{"X-API-Token":"change-me"}});if(!i.ok)return;const s=await i.json();if(s&&s.ok&&Array.isArray(s.data))for(const l of s.data){const c=l.agent_uid,g=l.lan_uid,m=l.agent_name||c,d=l.reference_ip,R=l.current_ip;c&&fetch(`${ct}/api/agents/${c}/utility/exec?lead=default`,{method:"POST",headers:{"Content-Type":"application/json","X-API-Token":"change-me"},body:JSON.stringify({command:"get_agent_ip",command_content:"",is_auto:!0})}).catch(()=>{}),d&&R&&R!==d&&(O(`Cảnh báo: Agent [${m}] đã thay đổi IP từ [${d}] sang [${R}]!`,"warning"),fetch(`${ct}/api/agent-ips/save`,{method:"POST",headers:{"Content-Type":"application/json","X-API-Token":"change-me"},body:JSON.stringify({agent_uid:c,lan_uid:g,agent_name:m,ip:R})}).catch(()=>{}))}}catch(i){console.error("Error in 2s IP polling: ",i)}},2e3);return()=>clearInterval(r)},[O]);const pn=p.useCallback(async r=>{if(r){Ke(!0);try{const s=await(await fetch(`${ct}/api/agents/${r}/cameras`)).json();s.ok?K(s.cameras||[]):O("Không tải được danh sách camera: "+s.error,"error")}catch(i){O("Lỗi tải camera: "+i.message,"error")}finally{Ke(!1)}}},[O]),Q=p.useMemo(()=>A.find(r=>r.lan_uid===Y),[A,Y]),cr=p.useMemo(()=>((Q==null?void 0:Q.agents)||[]).filter(r=>r.is_agent_active),[Q]),$r=p.useMemo(()=>{var r;return me&&cr.some(s=>s.agent_uid===me)?me:((r=cr[0])==null?void 0:r.agent_uid)||""},[me,cr]),ht=()=>{const r=new Date,i=new Date(r.getTime()-45*1e3),s=i.getFullYear(),l=String(i.getMonth()+1).padStart(2,"0"),c=String(i.getDate()).padStart(2,"0"),g=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0"),d=String(i.getSeconds()).padStart(2,"0");return`${s}-${l}-${c} ${g}:${m}:${d}`};p.useEffect(()=>{ke(null),H({id:null,camera_name:"",rtsp_url:"",segment_duration:60,prefix:"rec",video_codec:"copy",audio_codec:"copy",no_audio:!0})},[$r]);const $e=p.useCallback((r,i,s,l,c="Đang thực hiện lệnh...")=>{N(I=>({...I,[i]:{message:c,isPending:!0}}));const g=18e4,m=2e3,d=Date.now();let R=!1;const k=setInterval(async()=>{try{const I=Date.now()-d;if(I>g){clearInterval(k),N(t=>{const o={...t};return delete o[i],o}),l("Lệnh bị quá thời gian (Timeout 180s)");return}const P=await Ft(r),v=Math.round(I/1e3);P.status==="success"?(clearInterval(k),N(t=>{const o={...t};return delete o[i],o}),s(P)):P.status==="failed"||!P.ok?(clearInterval(k),N(t=>{const o={...t};return delete o[i],o}),l(P.error||"Lệnh thực hiện thất bại từ Agent")):P.received_at?(N(t=>({...t,[i]:{message:`⚡ Agent đã nhận - đang thực thi... (${v}s)`,isPending:!0}})),R||(R=!0,O("Agent đã nhận lệnh và đang truy cập máy photocopy...","info",3e3))):N(t=>({...t,[i]:{message:`⌛ Đang gửi lệnh tới agent... (${v}s)`,isPending:!0}}))}catch(I){clearInterval(k),N(P=>{const v={...P};return delete v[i],v}),l(I.message||"Lệnh thực hiện thất bại từ Agent")}},m)},[O]),Wr=p.useCallback(r=>{if(!r)return;const i=r.lan_uid,s=Date.now();if(!Wt.current[i]||s-Wt.current[i]>180*1e3){Wt.current[i]=s;const l=(r.agents||[]).filter(c=>c.is_agent_active);if(l.length>0){l.sort((g,m)=>{const d=new Date(g.last_seen||g.updated_at||g.last_ping||0).getTime();return new Date(m.last_seen||m.updated_at||m.last_ping||0).getTime()-d});const c=l[0];if(c){O(`⏳ Agent (${c.agent_uid}) đang thực hiện quét ngầm mạng LAN...`,"info",6e3);const g=c,d={command:"force_subnet_scan",command_content:`def force_scan():
    import logging, threading, sys, os, json, socket, time, subprocess, re, tempfile
    from datetime import datetime
    LOGGER = logging.getLogger(__name__)
    
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    
    if False:
        print("[*] Đang thực thi 100% Clean Fresh Scan theo Native Built-in PrintAgent Service...")
        try:
            printers = bridge_obj._load_printers(force_live=True)
            try: bridge_obj.trigger_once()
            except Exception: pass
            
            printers_list = []
            for p in (printers or []):
                mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "") or "").strip().upper().replace("-", ":")
                ip = str(getattr(p, "ip", "") or "").strip()
                name = str(getattr(p, "name", "") or "").strip()
                p_type = str(getattr(p, "printer_type", "") or "unknown").strip().lower()
                
                if not mac: continue
                if mac.startswith(("00:10:A4", "00:00:AA", "9C:93:4E", "E8:4D:EC", "C0:FB:F9", "1C:7D:22", "00:00:01", "00:00:02", "00:00:03", "00:00:04", "00:00:05", "00:00:06", "00:00:07", "00:00:08", "00:00:09", "08:00:37", "00:00:87")):
                    p_type = "xerox"
                    if "Copier" in name: name = name.replace("Copier", "Xerox Copier")
                if p_type == "unknown" and (name.startswith("Copier (") or "printer" not in name.lower()): continue
                
                p_dict = {
                    "name": name, "printer_name": name, "ip": ip, "mac_address": mac,
                    "printer_type": p_type, "is_online": getattr(p, "is_online", True),
                    "status": "online" if getattr(p, "is_online", True) else "offline", "probed": True,
                    "user": getattr(p, "user", "") or getattr(p, "auth_user", ""),
                    "password": getattr(p, "password", "") or getattr(p, "auth_password", ""),
                    "auth_user": getattr(p, "auth_user", "") or getattr(p, "user", ""),
                    "auth_password": getattr(p, "auth_password", "") or getattr(p, "password", ""),
                    "updated_at": getattr(p, "updated_at", "") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                printers_list.append(p_dict)
            
            count = len(printers_list)
            online_count = sum(1 for p in printers_list if p.get("is_online", True))
            msg = f"Đã quét xong mạng LAN (Clean Fresh Scan). Tìm thấy {count} máy in ({online_count} Online)."
            print(f"  [✓] CLEAN SCAN SUCCESS: {msg}")
            
            res_str = json.dumps(printers_list, ensure_ascii=False, indent=2)
            if globals().get('context'): globals()['context']['result_payload'] = res_str
            else: print(res_str)
        except Exception as e:
            err_msg = f"[-] LỖI THỰC THI NATIVE: {e}"
            print(err_msg); raise RuntimeError(err_msg)
    else:
        print("==================================================")
        print("  [CLEAN FRESH SCAN] DÒ QUÉT TẠO MỚI PRINTERS.JSON")
        print("==================================================")
        print("[1/5] Dò tìm IP Local & Bảng ARP Neighbor...")
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            subnet_prefix = '.'.join(local_ip.split('.')[:3])
            print(f"  -> Hostname : {hostname}")
            print(f"  -> Local IP : {local_ip} (Subnet: {subnet_prefix}.0/24)")
        except Exception as e:
            subnet_prefix = "192.168.1"
            print(f"  -> Subnet   : {subnet_prefix}.0/24 ({e})")

        print("  -> Fast Ping Sweep to populate ARP cache...")
        def _fast_ping(ip_addr):
            try: subprocess.run(["ping", "-n", "1", "-w", "500", ip_addr], capture_output=True, creationflags=0x08000000)
            except: pass
        try:
            pt_threads = []
            for i in range(1, 255):
                t = threading.Thread(target=_fast_ping, args=(f"{subnet_prefix}.{i}",))
                pt_threads.append(t)
                t.start()
                if len(pt_threads) >= 40:
                    for t in pt_threads: t.join()
                    pt_threads = []
            for t in pt_threads: t.join()
        except Exception: pass

        arp_map = {}
        try:
            ps_cmd = 'Get-NetNeighbor -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object IPAddress,LinkLayerAddress | ConvertTo-Json -Compress'
            ps_res = subprocess.run(['powershell', '-NoProfile', '-Command', ps_cmd], capture_output=True, text=True, errors='ignore')
            if ps_res.stdout.strip():
                items = json.loads(ps_res.stdout.strip())
                if isinstance(items, dict): items = [items]
                for it in items:
                    ip_val = str(it.get('IPAddress') or '').strip()
                    mac_val = str(it.get('LinkLayerAddress') or '').strip().replace('-', ':').upper()
                    if ip_val and mac_val and mac_val != '00:00:00:00:00:00': arp_map[ip_val] = mac_val
        except Exception: pass

        try:
            arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore').stdout
            for line in arp_out.splitlines():
                m = re.search(r'([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
                if m:
                    ip_k = m.group(1); mac_v = m.group(2).replace('-', ':').upper()
                    if ip_k not in arp_map and mac_v != '00:00:00:00:00:00': arp_map[ip_k] = mac_v
        except Exception: pass

        vps_auth_map = {}
        try:
            import urllib.request
            req = urllib.request.Request("http://192.168.1.154/api/devices/credentials-map", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=2) as resp:
                auth_json = json.loads(resp.read().decode('utf-8'))
                if auth_json.get("ok"):
                    vps_auth_map = auth_json.get("credentials") or {}
                    print(f"  -> Nạp thành công {len(vps_auth_map)} tài khoản máy in từ VPS Database.")
        except Exception as e:
            print(f"  [!] Chưa kết nối VPS auth DB ({e}). Sẽ lưu thông tin rỗng.")

        temp_dir = tempfile.gettempdir()
        target_dir = os.path.join(temp_dir, 'GoPrinxAgent')
        os.makedirs(target_dir, exist_ok=True)
        json_file = os.path.join(target_dir, 'printers.json')

        print("")
        print(f"[2/5] Dò quét cổng máy in (80, 443, 9100, 515, 631, 161) dải {subnet_prefix}.1 -> 254...")
        discovered_printers = []
        lock = threading.Lock()
        PORTS_TO_CHECK = [80, 443, 9100, 515, 631, 161]

        def detect_brand(name_str, mac_str):
            s = name_str.lower(); clean_mac = mac_str.replace('-', ':').upper()
            if "toshiba" in s or "e-studio" in s or clean_mac.startswith("00:80:91"): return "toshiba"
            if any(k in s for k in ("ricoh", "aficio", "mp ", "sp ", "pro ")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74")): return "ricoh"
            if any(k in s for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy")) or clean_mac.startswith(("00:1E:0B", "00:08:C7")): return "hp"
            if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma")) or clean_mac.startswith(("00:1B:A9", "00:00:85")): return "canon"
            if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre", "fuji", "apeos")) or clean_mac.startswith(("00:10:A4", "00:00:AA", "9C:93:4E", "E8:4D:EC", "C0:FB:F9", "1C:7D:22", "00:00:01", "00:00:02", "00:00:03", "00:00:04", "00:00:05", "00:00:06", "00:00:07", "00:00:08", "00:00:09", "08:00:37", "00:00:87")): return "xerox"
            if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith("00:21:B7"): return "brother"
            if any(k in s for k in ("epson", "workforce", "ecotank")) or clean_mac.startswith("00:00:48"): return "epson"
            return "unknown"

        def probe_host(ip):
            has_open = False
            for port in PORTS_TO_CHECK:
                try:
                    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                        s.settimeout(0.5)
                        if s.connect_ex((ip, port)) == 0: has_open = True; break
                except Exception: pass
            
            mac = arp_map.get(ip, "")
            if not has_open:
                if not mac: return
                if detect_brand("", mac) == "unknown": return

            model_name = ""
            if has_open:
                try:
                    import urllib.request, ssl
                    ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
                    req = urllib.request.Request(f"http://{ip}/", headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, context=ctx, timeout=1.5) as r:
                        body = r.read().decode('utf-8', errors='ignore'); body_low = body.lower()
                        if "topaccess" in body_low or "toshiba" in body_low:
                            m = re.search(r'e-studio[a-z0-9]+', body, re.IGNORECASE)
                            model_name = f"TOSHIBA {m.group(0)}" if m else "TOSHIBA e-STUDIO"
                        elif "webarch" in body_low or "ricoh" in body_low or "wimtoken" in body_low:
                            m = re.search(r'(?:aficios+)?mps+[0-9a-z]+', body, re.IGNORECASE)
                            model_name = f"RICOH {m.group(0).upper()}" if m else "RICOH MP"
                        elif "epson" in body_low: model_name = "EPSON Printer"
                        elif "canon" in body_low: model_name = "Canon Printer"
                        elif "hp " in body_low or "laserjet" in body_low: model_name = "HP LaserJet Printer"
                except Exception: pass

            if not mac: return
            if not model_name: model_name = f"Printer ({ip})"
            brand = detect_brand(model_name, mac)
            if brand == "unknown" and (model_name.startswith("Copier (") or "printer" not in model_name.lower()): return

            vps_cred = vps_auth_map.get(mac) or {}
            auth_u = vps_cred.get("auth_user", "")
            auth_p = vps_cred.get("auth_password", "")

            printer_obj = {
                "name": model_name, "printer_name": model_name, "ip": ip, "mac_address": mac,
                "printer_type": brand, "is_online": True, "status": "online", "probed": True,
                "user": auth_u, "password": auth_p, "auth_user": auth_u, "auth_password": auth_p,
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            with lock:
                discovered_printers.append(printer_obj)
                print(f"  [✓] ONLINE  | IP: {ip:<15} | MAC: {mac:<17} | Loại: {brand:<8} | Tên: {model_name}")

        threads = []
        for i in range(1, 255):
            t = threading.Thread(target=probe_host, args=(f"{subnet_prefix}.{i}",))
            threads.append(t); t.start()
            if len(threads) >= 40:
                for t in threads: t.join()
                threads = []
        for t in threads: t.join()

        print("")
        print(f"[3/5] Dò tìm thấy {len(discovered_printers)} máy in đang ONLINE.")

        _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36", "router", "modem")
        valid_final_printers = [
            p for p in discovered_printers
            if p.get('mac_address') and not any(kw in str(p.get('name') or '').lower() for kw in _DEVICE_NAME_BLACKLIST)
        ]

        print("")
        print("[4/5] Ghi tệp printers.json TẠO MỚI HOÀN TOÀN (100% Clean Fresh Scan)...")
        with open(json_file, 'w', encoding='utf-8') as f: json.dump(valid_final_printers, f, ensure_ascii=False, indent=2)

        print(f"  [✓] TẠO MỚI THÀNH CÔNG: Đã ghi {len(valid_final_printers)} máy in đang Online vào:")
        print(f"      {json_file}")
        print("==================================================")
        
        res_str = json.dumps(valid_final_printers, ensure_ascii=False, indent=2)
        print("__PRINTERS_JSON_START__\\n" + res_str + "\\n__PRINTERS_JSON_END__")
        if globals().get('context'): globals()['context']['result_payload'] = res_str
        else: print(res_str)

try:
    force_scan()
except Exception as err:
    print(f"[-] LỖI THỰC THI: {err}")`,lead:r.lead};fetch(`${ct}/ui/agents/${g.agent_uid}/utility/exec`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(R=>R.json()).then(R=>{const k=(R==null?void 0:R.command_id)||(R==null?void 0:R.id);k?$e(Number(k),`scan_lan_${i}`,async I=>{console.log("[DEBUG_LAN_SCAN] pollData received from LAN scan:",I);let P=[];const v=(I==null?void 0:I.result)||(I==null?void 0:I.result_payload)||(I==null?void 0:I.raw);if(Array.isArray(v))P=v;else if(typeof v=="string"){let t=v;if(v.includes("__PRINTERS_JSON_START__"))t=v.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].trim();else{const o=v.match(/\[\s*\{[\s\S]*\}\s*\]|\[\s*\]/);o&&(t=o[0])}try{const o=JSON.parse(t);Array.isArray(o)&&(P=o)}catch{}}P.length>0?(O(`✓ Quét mạng LAN hoàn tất, tìm thấy ${P.length} máy in!`,"success",4e3),b(t=>t.map(o=>o.lan_uid===i?{...o,printers:P.map((u,y)=>({id:u.id||9e4+y,...u}))}:o))):(O("✓ Quét mạng LAN hoàn tất, đang cập nhật danh sách máy photocopy...","success",4e3),await nt(!0))},async I=>{await nt(!0)},"⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN..."):setTimeout(()=>nt(!0),5e3)}).catch(R=>{console.error(R),setTimeout(()=>nt(!0),5e3)})}}}},[O,$e,nt]),dr=p.useCallback(r=>{var g;const i=Number(r),s=(g=Q==null?void 0:Q.printers)==null?void 0:g.find(m=>Number(m.id)===i);if(!s||!Q)return"";const l=(Q.agents||[]).filter(m=>m.is_agent_active),c=pt[i];return c&&l.some(d=>d.agent_uid===c)?c:s.agent_uid&&l.some(d=>d.agent_uid===s.agent_uid)?s.agent_uid:l.length>0?l[0].agent_uid:s.agent_uid||""},[Q,pt]),[pr,Rr]=p.useState({});p.useEffect(()=>{if(!Q||!Q.emails){Rr({});return}let r=!0;return(async()=>{const s={},l=Q.emails.filter(c=>c.email_type==="private");await Promise.all(l.map(async c=>{try{const g=await kn(Q.lan_uid,c.email);r&&(g.ok&&Array.isArray(g.rows)?s[c.email]=g.rows.length:s[c.email]=0)}catch(g){console.error(`Failed to fetch scan files count for ${c.email}`,g),r&&(s[c.email]=0)}})),r&&Rr(s)})(),()=>{r=!1}},[Q]);const[mn,Qt]=p.useState(!0),[un,Et]=p.useState(!0),[gn,mr]=p.useState(!1),[hn,Ee]=p.useState(null),[fn,ee]=p.useState(null),[ur,Vr]=p.useState([]),[Rt,Lr]=p.useState(!1),[_n,xn]=p.useState(""),[Fe,it]=p.useState({isOpen:!1,title:"",content:""}),[Yt,Jr]=p.useState("");p.useEffect(()=>{Fe.isOpen&&de.current&&(de.current.scrollTop=de.current.scrollHeight)},[Fe.isOpen,Fe.content,Yt]);const[yn,Mt]=p.useState(!1),[Kr,lt]=p.useState(null),vt=async()=>{if(!h)return;try{JSON.parse(Yt)}catch(s){lt(`❌ Lỗi định dạng JSON: ${s.message}`);return}Mt(!0),lt("⌛ Đang gửi cấu hình mới tới Agent...");const i=`import os, sys, json, base64
new_content = base64.b64decode("${btoa(unescape(encodeURIComponent(Yt)))}").decode("utf-8")
try:
    parsed = json.loads(new_content)
    exe_dir = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.getcwd()
    candidates = [
        os.path.join(exe_dir, 'settings.json'),
        os.path.join(os.getcwd(), 'settings.json'),
        'settings.json',
    ]
    found = None
    for p in candidates:
        if os.path.exists(p):
            found = p
            break
    if not found:
        found = candidates[0]

    with open(found + '.bak', 'w', encoding='utf-8') as f_bak:
        try:
            with open(found, 'r', encoding='utf-8') as f_orig:
                f_bak.write(f_orig.read())
        except:
            pass

    with open(found, 'w', encoding='utf-8') as f:
        json.dump(parsed, f, ensure_ascii=False, indent=2)

    try:
        if 'bridge' in globals():
            globals()['bridge']._config.reload()
    except Exception as e:
        pass

    msg = "Đã lưu cấu hình thành công!"
    if globals().get('context'):
        globals()['context']['result_payload'] = msg
    else:
        raise RuntimeError(msg)
except Exception as e:
    raise RuntimeError(str(e))
`;try{const s=await Lt(h.agent_uid,"save_settings_json",i);if(!s.ok||!s.command_id)throw new Error(s.error||"Không thể tạo lệnh tiện ích");const l=s.command_id,c=6e4,g=Date.now(),m=setInterval(async()=>{try{if(Date.now()-g>c){clearInterval(m),lt("❌ Lưu thất bại: Hết thời gian chờ (60s)"),Mt(!1);return}const R=await Ft(l);R.status==="success"?(clearInterval(m),lt("✔️ Đã lưu cấu hình và tự động reload thành công!"),Mt(!1),it(k=>({...k,content:Yt})),setTimeout(()=>lt(null),3e3)):(R.status==="failed"||!R.ok)&&(clearInterval(m),lt(`❌ Lỗi từ máy trạm: ${R.error||"Lưu thất bại"}`),Mt(!1))}catch(d){console.error("Poll error:",d)}},1e3)}catch(s){lt(`❌ Lỗi kết nối: ${s.message}`),Mt(!1)}},Zt=r=>{try{let i=r;for(;typeof i=="string";){const s=i.trim();if(s.startsWith("{")&&s.endsWith("}")||s.startsWith("[")&&s.endsWith("]")||s.startsWith('"')&&s.endsWith('"'))i=JSON.parse(i);else break}return typeof i=="object"&&i!==null?JSON.stringify(i,null,2):(typeof i=="string"&&(i=i.replace(/\\n/g,`
`).replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")),String(i))}catch{return r}};p.useEffect(()=>{Fe.isOpen&&Fe.title.includes("settings.json")&&(Jr(Zt(Fe.content)),lt(null))},[Fe.isOpen,Fe.title,Fe.content]);const gr=async(r,i,s)=>{try{const l=await Fn(void 0,void 0,r);if(l.ok&&l.jobs){const c=l.jobs.filter(g=>g.status==="pending");for(const g of c)if(g.command_type===i)try{const m=JSON.parse(g.command_params);let d=!0;for(const R of Object.keys(s))if(m[R]!==s[R]){d=!1;break}if(d)return!0}catch{if(g.command_params===JSON.stringify(s))return!0}}}catch(l){console.error("Failed to check duplicate pending jobs",l)}return!1},qe=new Set(["view_settings_json","view_stout","view_sterror","get_public_ip","check_watchdog","open_web_setting"]),Nr={view_settings_json:"⚙️ settings.json",view_stout:"📄 stout.txt — 100 dòng gần nhất",view_sterror:"🔴 sterror.txt — 100 dòng gần nhất",get_public_ip:"🌍 IP Public",check_watchdog:"🩺 Check Watchdog",open_web_setting:"🌐 Web setting"},hr=p.useCallback(async r=>{var i,s;if(r){mr(!0),ee(null);try{const l=await Mn(r.agent_uid);if(l.ok)Qt(!!l.scan_auto_open_file),Et(!!l.scan_auto_open_dir);else throw new Error(l.error||"Agent không tồn tại trên VPS")}catch(l){console.error("Failed to load agent settings:",l);const c=(i=l.message)!=null&&i.includes("Agent not found")||(s=l.message)!=null&&s.includes("404")?"Agent này chưa được đăng ký trên VPS backend. Vui lòng đảm bảo agent đang chạy và đã kết nối.":`Không thể tải cài đặt từ VPS: ${l.message}`;ee({text:c,isError:!0}),Qt(!0),Et(!0)}finally{mr(!1)}}},[]),fr=p.useCallback(async(r,i)=>{if(!h)return;const s=!i;r==="scan_auto_open_file"?Qt(s):Et(s);try{const l=await Un(h.agent_uid,{[r]:s});if(!l.ok)throw new Error(l.error||"Failed to update setting");ee({text:"Đã cập nhật cài đặt thành công.",isError:!1})}catch(l){console.error("Failed to update agent setting:",l),r==="scan_auto_open_file"?Qt(i):Et(i),ee({text:`Lỗi cập nhật cài đặt: ${l.message}`,isError:!0})}},[h]),bn=p.useCallback(async(r,i)=>{if(!h)return;const s=r==="printers"?"devices_and_printers":r==="scan"?"open_scan_folder":r==="change_ip"?"change_ip":r==="run_command"?"run_command":"dxdiag";if(await gr(h.agent_uid,"trigger_utility",{action:s,...i||{}})){O("Lệnh tiện ích này đang chờ phản hồi từ Agent!","info");return}Ee(r),ee({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const c=await Bn(h.agent_uid,s,i);if(!c.ok||!c.command_id)throw new Error(c.error||"Không thể tạo lệnh tiện ích");const g=c.command_id,m=6e4,d=1e3,R=Date.now(),k=setInterval(async()=>{try{const I=Date.now()-R;if(I>m){clearInterval(k),ee({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Ee(null);return}const P=await Ft(g);if(P.status==="success")clearInterval(k),ee({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),Ee(null);else if(P.status==="failed"||!P.ok)clearInterval(k),ee({text:`❌ Thất bại: ${P.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Ee(null);else{const v=Math.round(I/1e3);P.received_at?ee({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${v}s)`,isError:!1}):ee({text:`⌛ Đang chuyển lệnh tới Agent... (${v}s)`,isError:!1})}}catch(I){console.error("Error polling utility status:",I)}},d)}catch(c){console.error(`Failed to trigger ${r}:`,c),ee({text:`Lỗi kết nối hoặc gửi lệnh: ${c.message}`,isError:!0}),Ee(null)}},[h]),ft=p.useCallback(async(r,i)=>{var R;if(!h)return;if(await gr(h.agent_uid,"trigger_utility",{action:"exec_utility",command:r})){O("Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!","info");return}const l=ur.find(k=>k.command===r),c=(l==null?void 0:l.output_modal)||qe.has(r),g=(l==null?void 0:l.label)||Nr[r]||r;let m=i;if(r==="change_agent_ip"||r==="check_scan_ip_match"){const k=r==="change_agent_ip",I=(h==null?void 0:h.local_ip)||(h==null?void 0:h.ip)||(h==null?void 0:h.agent_ip)||(h==null?void 0:h.localIp)||"";if(jr({isOpen:!0,title:k?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:k?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:I,changeAllTo:"",scanStatus:k?"⏳ Loading... Đang quét điểm scan FTP trên máy photo...":"",error:"",onConfirm:(P,v)=>{const t=i.replace("__TARGET_IP__",P);Ee(r),ee({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),Lt(h.agent_uid,r,t,{target_ip:P,ip:P,printer_ip:P,change_all_to:v||""}).then(o=>{if(!o.ok||!o.command_id)throw new Error(o.error||"Không thể tạo lệnh tiện ích");const u=o.command_id,y=6e4,L=Date.now(),M=setInterval(async()=>{try{const Ce=Date.now()-L;if(Ce>y){clearInterval(M),ee({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Ee(null);return}const pe=await Ft(u);if(pe.status==="success")clearInterval(M),c?(it({isOpen:!0,title:g,content:typeof pe.result_payload=="object"&&pe.result_payload?JSON.stringify(pe.result_payload,null,2):pe.result_payload||pe.error||pe.result||"(không có nội dung)"}),ee(null)):ee({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),Ee(null);else if(pe.status==="failed"||!pe.ok)clearInterval(M),c?(it({isOpen:!0,title:g,content:pe.error||(typeof pe.result_payload=="object"&&pe.result_payload?JSON.stringify(pe.result_payload,null,2):pe.result_payload||pe.result||"(không có nội dung)")}),ee(null)):ee({text:`❌ Thất bại: ${pe.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Ee(null);else{const Be=Math.round(Ce/1e3);ee({text:`⌛ Đang xử lý... (${Be}s)`,isError:!1})}}catch(Ce){console.error("Poll error:",Ce)}},1e3)}).catch(o=>{ee({text:`Lỗi: ${o.message}`,isError:!0}),Ee(null)})}}),k&&I){const P=ur.find(v=>v.command==="check_scan_ip_match");if(P&&P.command_content){const v=P.command_content.replace("__TARGET_IP__",I);Lt(h.agent_uid,"check_scan_ip_match",v,{target_ip:I,ip:I,printer_ip:I}).then(t=>{if(t.ok&&t.command_id){const o=Date.now(),u=setInterval(async()=>{if(Date.now()-o>4e4){clearInterval(u);return}try{const L=await Ft(t.command_id);if(L.status==="success"||L.status==="failed"){clearInterval(u);const M=L.result_payload||L.result||L.error||"";jr(Ce=>({...Ce,scanStatus:M?`🔍 ${M}`:""}))}}catch{}},1500)}}).catch(()=>{})}}return}const d=(R=Q==null?void 0:Q.printers)==null?void 0:R[0];m.includes("__TARGET_IP__")&&(m=m.replace(/__TARGET_IP__/g,(d==null?void 0:d.ip)||"192.168.1.155")),m.includes("__TARGET_USER__")&&(m=m.replace(/__TARGET_USER__/g,(d==null?void 0:d.auth_user)||(d==null?void 0:d.user)||"admin")),m.includes("__TARGET_PASS__")&&(m=m.replace(/__TARGET_PASS__/g,(d==null?void 0:d.auth_password)||(d==null?void 0:d.password)||"")),m.includes("__TARGET_ID__")&&(m=m.replace(/__TARGET_ID__/g,"001")),m.includes("__TARGET_SCAN_USER__")&&(m=m.replace(/__TARGET_SCAN_USER__/g,"scan")),r.includes("toshiba")&&(m=m.replace(/timeout=\d+/g,"timeout=25")),Ee(r),ee({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const k=await Lt(h.agent_uid,r,m);if(!k.ok||!k.command_id)throw new Error(k.error||"Không thể tạo lệnh tiện ích");const I=k.command_id,P=6e4,v=Date.now(),t=setInterval(async()=>{try{const o=Date.now()-v;if(o>P){clearInterval(t),ee({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Ee(null);return}const u=await Ft(I);if(u.status==="success")clearInterval(t),c?(it({isOpen:!0,title:g,content:typeof u.result_payload=="object"&&u.result_payload?JSON.stringify(u.result_payload,null,2):u.result_payload||u.error||u.result||"(không có nội dung)"}),ee(null)):ee({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),Ee(null);else if(u.status==="failed"||!u.ok)clearInterval(t),c?(it({isOpen:!0,title:g,content:u.error||(typeof u.result_payload=="object"&&u.result_payload?JSON.stringify(u.result_payload,null,2):u.result_payload||u.result||"(không có nội dung)")}),ee(null)):ee({text:`❌ Thất bại: ${u.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Ee(null);else{const y=Math.round(o/1e3),L=u.progress_text||`Đang xử lý... (${y}s)`;ee({text:`⌛ ${L}`,isError:!1})}}catch(o){const u=(o==null?void 0:o.message)||String(o||"");c&&(u.startsWith("[PATH]")||u.includes("stout")||u.includes("sterror")||u.includes("settings.json"))?(clearInterval(t),it({isOpen:!0,title:g,content:u}),ee(null),Ee(null)):console.error("Poll error:",o)}},1e3)}catch(k){ee({text:`Lỗi: ${k.message}`,isError:!0}),Ee(null)}},[h,ur]),V=p.useCallback(async()=>{if(!h)return;if(await gr(h.agent_uid,"emergency_restart",{action:"emergency_restart"})){O("Yêu cầu khởi động lại Agent đang chờ phản hồi từ Agent!","info");return}Pe({isOpen:!0,title:"🚨 Kích hoạt Khởi động khẩn cấp",message:"Lệnh này sẽ đánh dấu yêu cầu thoát khẩn cấp cho Agent này trên server. File watchdog.bat (nếu có trên máy client) sẽ tự động phát hiện và ép đóng printagent.exe rồi mở lại. Việc này giúp thoát khỏi tình trạng treo update. Bạn có chắc chắn muốn thực hiện?",onConfirm:async()=>{Ee("emergency_restart"),ee({text:"⌛ Đang đăng ký cờ khởi động lại khẩn cấp...",isError:!1});try{const i=await Gn(h.agent_uid);if(!i.ok)throw new Error(i.error||"Thất bại");ee({text:"⚡ Đã lưu cờ tắt khẩn cấp trên Server. Chờ Watchdog quét...",isError:!1})}catch(i){ee({text:`❌ Lỗi: ${i.message}`,isError:!0})}finally{Ee(null)}}})},[h]);p.useEffect(()=>{Se==="utilities"&&h&&(hr(h),Lr(!0),wn(h.agent_uid).then(r=>{r!=null&&r.ok&&Array.isArray(r.commands)&&Vr(r.commands)}).catch(r=>console.error("Failed to load utility commands:",r)).finally(()=>Lr(!1)))},[Se,h,hr]);const _r=p.useMemo(()=>{if(!Q)return[];const r=(Q.printers||[]).filter(i=>{const s=(i.printer_name||"").toLowerCase().trim();return!(s.includes("unknown")||s==="unknown printer"||s.includes("pdf")||s.includes("fax")||s.includes("brother")||s.includes("canon lbp")||s.includes("rustdesk")||i.probed&&!i.is_online)});return or?[...r].sort((i,s)=>{const l=String(i.id)===or,c=String(s.id)===or;return l&&!c?-1:!l&&c?1:0}):r},[Q,or]),qr=r=>{localStorage.setItem("goxprint_last_viewed_copier_id",r)};p.useEffect(()=>{if(Q){const r={};Q.printers.forEach(i=>{const s=(Q.agents||[]).filter(c=>c.is_agent_active),l=s.find(c=>c.agent_uid===i.agent_uid)||s[0];r[i.id]=l?l.agent_uid:i.agent_uid||""}),_e(i=>({...r,...i})),Ge(i=>{const s={...i};return Q.printers.forEach(l=>{const c=l.auth_user||l.user||"",g=l.auth_password||l.password||"",m=(()=>{try{const I=localStorage.getItem(`copier_auth_${l.id}`)||(l.mac_id?localStorage.getItem(`copier_auth_${l.mac_id}`):null);return I?JSON.parse(I):null}catch{return null}})(),d=s[l.id],R=(d==null?void 0:d.user)!==void 0?d.user:c!==""?c:(m==null?void 0:m.user)!==void 0?m.user:"",k=(d==null?void 0:d.pass)!==void 0?d.pass:g!==""?g:(m==null?void 0:m.pass)!==void 0?m.pass:"";s[l.id]={user:R,pass:k}}),s})}},[Q]);const Xr=async r=>{const i=String(typeof r=="object"?r.id:r),s=typeof r=="object"?r.mac_id||r.mac_address||"":i,l=typeof r=="object"&&(r.printer_type||r.type)||"",c=te[i]||{user:"",pass:""};try{localStorage.setItem(`copier_auth_${i}`,JSON.stringify(c)),s&&localStorage.setItem(`copier_auth_${s}`,JSON.stringify(c))}catch{}Je(g=>({...g,[i]:!0}));try{const g=await Pn(s||i,c.user,c.pass,s,l);if(g.ok){const m=g.command_id||g.id;m?(O("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),$e(m,i,d=>{const R=d!=null&&d.error?` (${d.error})`:d!=null&&d.result?` (${d.result})`:"";O(`Đã test đăng nhập thành công và lưu vào database!${R}`,"success",5e3),b(k=>k.map(I=>({...I,printers:I.printers.map(P=>String(P.id)===String(i)||s&&P.mac_id===s?{...P,auth_user:c.user,auth_password:c.pass}:P)}))),Je(k=>({...k,[i]:!1}))},d=>{O(`Lỗi Agent lưu Auth: ${d}`,"error"),Je(R=>({...R,[i]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(O("Đã lưu tài khoản Web UI máy photocopy thành công","success"),b(d=>d.map(R=>({...R,printers:R.printers.map(k=>String(k.id)===String(i)||s&&k.mac_id===s?{...k,auth_user:c.user,auth_password:c.pass}:k)}))),Je(d=>({...d,[i]:!1})))}else throw new Error(g.error||"Lưu thất bại")}catch(g){O(`Lỗi lưu Auth: ${g.message}`,"error"),Je(m=>({...m,[i]:!1}))}},ne=async(r,i,s,l,c)=>{try{const m=await(await fetch(`${ct}/api/scan-points/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:r,address_book_data:i,printer_name:s||"Photocopy",ip:l||"",agent_uid:c||""})})).json();console.log("Saved scan point to DB:",m)}catch(g){console.error("Failed to save scan point to DB:",g)}},et=async r=>{var R,k,I,P,v;const i=(A||[]).flatMap(t=>t.printers||[]),s=typeof r=="object"&&r!==null?r:i.find(t=>String(t.id)===String(r)||t.mac_id===r||t.mac_address===r||t.ip===r)||((R=Q==null?void 0:Q.printers)==null?void 0:R.find(t=>String(t.id)===String(r)||t.mac_id===r||t.mac_address===r||t.ip===r))||{},l=String(s.id||(typeof r=="string"?r:"")),c=s.ip||s.printer_ip||(typeof r=="string"&&r.includes(".")?r:""),g=s.mac_address||s.mac_id||(typeof r=="string"&&r.includes(":")?r:l);if(!c){O("Thiếu thông tin IP máy in hợp lệ. Vui lòng chọn máy in cụ thể.","error");return}const m=dr(l)||dr(c)||dr(g);O("Bắt đầu gửi yêu cầu đồng bộ danh bạ máy in...","info",3e3);const d=g?String(g).toUpperCase().replace(/-/g,":"):"";d&&ye(t=>({...t,[d]:{status:"loading",address_list:[]}}));try{const t=((k=te[l])==null?void 0:k.user)||((I=te[c])==null?void 0:I.user)||s.auth_user||s.user,o=((P=te[l])==null?void 0:P.pass)||((v=te[c])==null?void 0:v.pass)||s.auth_password||s.password||"";if(!t){O(`Chưa cấu hình tài khoản Web cho máy in ${s.printer_name||s.name||"Photocopy"}!`,"error"),d&&ye(M=>({...M,[d]:{status:"error",address_list:[]}}));return}const L=await En(c&&c!=="0.0.0.0"?c:g||l,m||void 0,{mac_address:g,printer_ip:c,ip:c,auth_user:t,auth_password:o});if(!L.ok||!L.command_id)throw new Error(L.error||"Không thể tạo lệnh đồng bộ");$e(L.command_id,l,async M=>{const Ce=g?String(g).toUpperCase().replace(/-/g,":"):"";let pe=(M==null?void 0:M.address_book_sync)||(M==null?void 0:M.address_book_data);if(!pe&&(M!=null&&M.result||M!=null&&M.result_payload)){const Be=String(M.result||M.result_payload||"");if(Be.includes("__ADDRESS_BOOK_JSON_START__"))try{let Dr=Be.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();Dr=Dr.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),pe=JSON.parse(Dr)}catch{}}Ce&&pe&&(ye(Be=>({...Be,[Ce]:pe})),ne(Ce,pe,s.printer_name||s.name,s.ip||s.printer_ip,m)),await nt(),fe(Be=>({...Be,[l]:!0}))},M=>{O(`Đồng bộ thất bại: ${M}`,"error")},"⌛ Đang đồng bộ danh bạ...")}catch(t){O(`Lỗi gửi lệnh đồng bộ: ${t.message}`,"error")}};return{VIEW_COMMANDS:qe,activeAgentUid:$r,activeLoadingFile:ge,activeModal:Se,activeTab:x,allocatedVncAddr:vr,autoScanTriggers:Wt,cameraFiles:gt,cameraForm:Ct,cameraLogs:xt,cameraStatus:Nt,cameraTestLoading:j,cameraTestResult:Ut,cameras:Re,camerasLoading:Ye,commandStatus:ae,confirmModal:Ar,copierCredentials:te,customRecordDuration:F,customRunCommand:_n,deleteScanPointModal:Me,detectBrand:Tr,directLan:zt,editIpModalData:Cr,editableSettingsText:Yt,emailFileCounts:pr,expandedDriverMenus:T,expandedDrivers:Qe,expandedPrinters:he,fetchCameraFiles:async(r,i)=>{try{const l=await(await fetch(`${ct}/api/agents/${r}/cameras/${i}/files`,{method:"POST"})).json();l.ok&&yt(l.files||[])}catch{}},fetchCameraStatus:async(r,i)=>{try{const l=await(await fetch(`${ct}/api/agents/${r}/cameras/${i}/status`,{method:"POST"})).json();l.ok&&l.status?(mt(l.status),ut(l.status.logs||[])):O("Không lấy được trạng thái camera: "+(l.error||"Lỗi kết nối"),"error")}catch(s){O("Lỗi lấy trạng thái: "+s.message,"error")}},fetchCameras:pn,fetchLanSitesData:nt,fetchRemotePage:Pt,filteredPrinters:_r,formatJsonText:Zt,ftpDetailData:ce,getLiveQueryTimestamp:ht,getTargetAgentUid:dr,handleAddPrivateFtp:async()=>{const{lanUid:r,agentUid:i,email:s}=Gr;if(!s||!s.includes("@")){O("Địa chỉ email không hợp lệ","error");return}St(!0);try{const l=await Ln("default",r,i,s);if(St(!1),re(null),l.ok)O("Đã thêm Private FTP thành công","success"),await nt();else throw new Error(l.error||"Lỗi server")}catch(l){St(!1),O(`Lỗi thêm FTP riêng: ${l.message}`,"error")}},handleAddPublicFtp:async()=>{var c,g,m;const{printerId:r,name:i,email:s,agentUid:l}=Kt;if(!i||!i.trim()){O("Vui lòng nhập tên điểm scan","error");return}if(s&&!s.includes("@")){O("Địa chỉ email không hợp lệ","error");return}qt(!0),O("Đang tạo yêu cầu thêm FTP/Email lên máy in...","info",3e3);try{const d=(c=Q==null?void 0:Q.printers)==null?void 0:c.find(v=>String(v.id)===String(r)||v.mac_id===r),R=((g=te[r])==null?void 0:g.user)||(d==null?void 0:d.auth_user),k=((m=te[r])==null?void 0:m.pass)||(d==null?void 0:d.auth_password)||"";if(!R){qt(!1),O(`Chưa cấu hình tài khoản Web cho máy in ${(d==null?void 0:d.printer_name)||(d==null?void 0:d.name)||"Photocopy"}!`,"error");return}const I={mac_address:(d==null?void 0:d.mac_id)||(d==null?void 0:d.mac_address)||r,printer_ip:(d==null?void 0:d.ip)||"",auth_user:R,auth_password:k},P=await Rn(r,i.trim(),s,l||void 0,I);if(qt(!1),re(null),!P.ok||!P.command_id)throw new Error(P.error||"Lỗi gửi lệnh");$e(P.command_id,r,async v=>{O(`Đã tạo điểm scan "${i.trim()}" thành công!`,"success"),console.log("Finish add public FTP scan point, updating address book state directly");const t=(d==null?void 0:d.mac_address)||(d==null?void 0:d.mac_id)||r,o=t?String(t).toUpperCase().replace(/-/g,":"):"";let u=(v==null?void 0:v.address_book_sync)||(v==null?void 0:v.address_book_data);if(!u&&(v!=null&&v.result||v!=null&&v.result_payload)){const y=String(v.result||v.result_payload||"");if(y.includes("__ADDRESS_BOOK_JSON_START__"))try{let L=y.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();L=L.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),u=JSON.parse(L)}catch{}}o&&u&&ye(y=>({...y,[o]:u})),et(r),await nt()},v=>{O(`Thêm điểm scan thất bại: ${v}`,"error")},`⌛ Đang tạo điểm scan "${i.trim()}"...`)}catch(d){qt(!1),O(`Lỗi: ${d.message}`,"error")}},handleCloseWebPreview:dn,handleCopierClick:qr,handleEmergencyRestart:V,handleHistoryBack:ln,handleHistoryForward:lr,handleRefetchAddressBook:et,handleSaveAuth:Xr,handleSaveSettings:vt,handleToggleDirectLan:cn,handleToggleSetting:fr,handleTriggerUtility:bn,handleTriggerUtilityExec:ft,handleViewScanPointsJson:on,installDriverModal:Tt,ipInputModal:Zr,isDuplicatePending:gr,isRecording30s:le,isSavingSettings:yn,lanSites:A,lanSitesLoading:be,liveAddressBooks:xe,loadUtilitySettings:hr,lockAspect:It,modalContentRef:de,onlineAgents:cr,pollCommandStatus:$e,previewBlobUrl:Ht,previewIframeRef:$t,privateFtpData:Gr,privateFtpLoading:Pr,publicFtpData:Kt,publicFtpLoading:nn,queriedVideoUrl:f,queryDuration:W,queryTimestamp:q,queryVideoLoading:Z,recording30sCountdown:Le,remoteLockPrinter:Bt,replaceToast:zr,resolveRelativePath:Er,saveAuthLoading:dt,saveScanPointToDb:ne,scaleX:jt,scaleY:Oe,scanAutoOpenDir:un,scanAutoOpenFile:mn,scanPointsViewerModal:an,selectedCamera:He,selectedCameraAgentUid:me,selectedLan:Q,selectedLanUid:Y,selectedTargetAgents:pt,selectedUtilityAgent:h,setActiveLoadingFile:Te,setActiveModal:re,setActiveTab:ue,setAllocatedVncAddr:er,setCameraFiles:yt,setCameraForm:H,setCameraLogs:ut,setCameraStatus:mt,setCameraTestLoading:G,setCameraTestResult:E,setCameras:K,setCamerasLoading:Ke,setCommandStatus:N,setConfirmModal:Pe,setCopierCredentials:Ge,setCustomRecordDuration:je,setCustomRunCommand:xn,setDeleteScanPointModal:ar,setDirectLan:wr,setEditIpModalData:kr,setEditableSettingsText:Jr,setEmailFileCounts:Rr,setExpandedDriverMenus:we,setExpandedDrivers:U,setExpandedPrinters:fe,setFtpDetailData:br,setInstallDriverModal:Yr,setIpInputModal:jr,setIsRecording30s:ze,setIsSavingSettings:Mt,setLanSites:b,setLanSitesLoading:se,setLiveAddressBooks:ye,setLockAspect:bt,setPreviewBlobUrl:De,setPrivateFtpData:sn,setPrivateFtpLoading:St,setPublicFtpData:Br,setPublicFtpLoading:qt,setQueriedVideoUrl:C,setQueryDuration:z,setQueryTimestamp:$,setQueryVideoLoading:D,setRecording30sCountdown:tt,setRemoteLockPrinter:Sr,setSaveAuthLoading:Je,setScaleX:sr,setScaleY:Ot,setScanAutoOpenDir:Et,setScanAutoOpenFile:Qt,setScanPointsViewerModal:Xt,setSelectedCamera:ke,setSelectedCameraAgentUid:Ae,setSelectedLanUid:J,setSelectedTargetAgents:_e,setSelectedUtilityAgent:at,setSettingsSaveStatus:lt,setShowPreviewDetails:Ur,setShowSettings:_,setStorageFiles:Ir,setStorageLoading:rn,setStorageModalData:en,setToasts:B,setToshibaVncData:Gt,setUtilityActionPending:Ee,setUtilityCommands:Vr,setUtilityCommandsLoading:Lr,setUtilitySettingsLoading:mr,setUtilityStatusMsg:ee,setViewOutputModal:it,setVncTunnelLoading:rr,setWebPreviewHistory:Ne,setWebPreviewHistoryIndex:At,setWebPreviewLoading:ir,setWebPreviewModal:kt,setWebPreviewTab:Ze,settingsSaveStatus:Kr,showPreviewDetails:Fr,showSettings:S,showToast:O,storageFiles:tn,storageLoading:Jt,storageModalData:Vt,toasts:Ie,toshibaVncData:ve,triggerLanScan:Wr,utilityActionPending:hn,utilityCommands:ur,utilityCommandsLoading:Rt,utilitySettingsLoading:gn,utilityStatusMsg:fn,viewOutputModal:Fe,vncTunnelLoading:tr,webPreviewHistory:Dt,webPreviewHistoryIndex:ot,webPreviewLoading:nr,webPreviewModal:X,webPreviewTab:Mr}},yr="https://agentapi.quanlymay.com",Kn=(a={})=>{const{cameraForm:w,cameras:A,customRecordDuration:b,directLan:Y,fetchCameraFiles:J,fetchCameraStatus:be,fetchCameras:se,isRecording30s:me,setActiveModal:Ae,setAllocatedVncAddr:x,setCameraTestLoading:ue,setCameraTestResult:ae,setIsRecording30s:N,setRecording30sCountdown:he,setSelectedCamera:fe,setToshibaVncData:Qe,setVncTunnelLoading:U,showToast:T}=a;return{cameraForm:w,cameras:A,customRecordDuration:b,directLan:Y,fetchCameraFiles:J,fetchCameraStatus:be,fetchCameras:se,handleDeleteCamera:async(_e,xe)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{const ye=await(await fetch(`${yr}/api/agents/${_e}/cameras/${xe}/delete`,{method:"POST"})).json();ye.ok?(T("Đã xóa camera thành công!","success"),se(_e),fe(null)):T("Lỗi xóa camera: "+ye.error,"error")}catch(oe){T("Lỗi hệ thống: "+oe.message,"error")}},handleDeleteCameraFile:async(_e,xe,oe)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${oe}`))try{const Re=await(await fetch(`${yr}/api/agents/${_e}/cameras/${xe}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:oe})})).json();Re.ok?(T("Đã xóa tệp video thành công!","success"),J(_e,xe)):T("Lỗi xóa tệp: "+Re.error,"error")}catch(ye){T("Lỗi hệ thống: "+ye.message,"error")}},handleRecord30s:async(_e,xe)=>{if(me)return;const oe=A.find(Ye=>Ye.id===xe),ye=(oe==null?void 0:oe.mac_address)||"";if(!ye){T("Camera không có thông tin MAC ID để điều khiển!","error");return}N(!0),he(b);let Re=b;const K=setInterval(()=>{Re-=1,he(Math.max(Re,0)),Re<=0&&clearInterval(K)},1e3);try{T(`Đang gửi yêu cầu ghi hình ${b}s...`,"info");const Ke=await(await fetch(`${yr}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:ye,action:"record",duration:b})})).json();clearInterval(K),Ke.ok?T(Ke.message||`Ghi hình ${b}s hoàn tất!`,"success"):T("Lỗi ghi hình: "+Ke.error,"error")}catch(Ye){clearInterval(K),T("Lỗi kết nối ghi hình: "+Ye.message,"error")}finally{N(!1),setTimeout(()=>{be(_e,xe),J(_e,xe)},1500)}},handleSaveCameraConfig:async _e=>{try{const oe=await(await fetch(`${yr}/api/agents/${_e}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(w)})).json();oe.ok?(T("Đã lưu cấu hình camera thành công!","success"),se(_e),fe(null)):T("Lỗi lưu cấu hình: "+oe.error,"error")}catch(xe){T("Lỗi hệ thống: "+xe.message,"error")}},handleStartToshibaVnc:async(_e,xe,oe)=>{if(Qe({ip:_e,printerName:xe,agentUid:oe}),x(""),Ae("toshiba_vnc"),Y){x(`${_e}:49105`);return}U(!0);try{const Re=await(await fetch(`${yr}/api/agents/${oe}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:_e,printer_port:49105})})).json();if(Re.ok&&Re.url_port){const K=Re.url_port.replace("http://","").replace("https://","");x(K)}else T("Không thể mở đường hầm VNC: "+(Re.error||"Lỗi không xác định"),"error"),Ae(null)}catch(ye){T("Lỗi kết nối VPS: "+(ye.message||ye),"error"),Ae(null)}finally{U(!1)}},handleTestCameraConnection:async _e=>{ue(!0),ae(null);try{const oe=await(await fetch(`${yr}/api/agents/${_e}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:w.rtsp_url})})).json();oe.ok&&oe.result?ae(oe.result):ae({ok:!1,msg:oe.error||"Lỗi kiểm tra kết nối"})}catch(xe){ae({ok:!1,msg:"Lỗi: "+xe.message})}finally{ue(!1)}},isRecording30s:me,setActiveModal:Ae,setAllocatedVncAddr:x,setCameraTestLoading:ue,setCameraTestResult:ae,setIsRecording30s:N,setRecording30sCountdown:he,setSelectedCamera:fe,setToshibaVncData:Qe,setVncTunnelLoading:U,showToast:T}},qn={ricoh_create_scan:`import requests
import re
import base64
import json
import time

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
TARGET_NAME = "__TARGET_SCAN_USER__"
TARGET_EMAIL = "__TARGET_EMAIL__"
BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH EXEC] TẠO ĐIỂM SCAN PHOTOCOPY - IP: {IP}")
print("==================================================")

def extract_wim_token(html: str) -> str:
    if not html: return ""
    m = re.search(r'wimToken[ ]*[:=][ ]*["\\']?([^"\\' ;>]+)["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name[ ]*=[ ]*["\\']?wimToken["\\']?[^>]*?value[ ]*=[ ]*["\\']?([^"\\' ;>]+)["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value[ ]*=[ ]*["\\']?([^"\\' ;>]+)["\\']?[^>]*?name[ ]*=[ ]*["\\']?wimToken["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def logout(session: requests.Session):
    print("[*] Đang đăng xuất để giải phóng phiên (Tránh lỗi đầy Session)...")
    try:
        session.get(f"{BASE_URL}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
    except:
        pass

def login() -> requests.Session:
    session = requests.Session()
    print(f"[*] Đang lấy form đăng nhập từ {IP}...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    
    login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode()
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
    
    data = {
        "userid": encoded_user,
        "username": encoded_user,
        "password": encoded_pass,
        "wimToken": wim_token,
        "open": "websys/webArch/authForm.cgi"
    }
    print("[*] Đang gửi thông tin đăng nhập...")
    session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    return session

def get_next_id(session: requests.Session, wim_token: str) -> str:
    print("[*] Đang tính toán mã ĐK tiếp theo...")
    ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
    resp = session.get(ajax_url, timeout=10)
    
    entries = parse_ajax_address_list(resp.text)
    max_id = 0
    for entry in entries:
        reg = entry.get("registration_no", "")
        if reg.isdigit():
            max_id = max(max_id, int(reg))
            
    next_id = str(max_id + 1).zfill(5)
    print(f"[*] Mã ĐK tiếp theo sẽ là: {next_id}")
    return next_id

def create_email_scan(session: requests.Session, name: str, email: str):
    print(f"[*] Đang chuẩn bị tạo điểm scan...")
    list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    next_id = get_next_id(session, wim_token)
    
    get_wizard_url = f"{BASE_URL}/web/entry/en/address/adrsGetUserWizard.cgi"
    set_wizard_url = f"{BASE_URL}/web/entry/en/address/adrsSetUserWizard.cgi"
    
    # BƯỚC 0: INIT WIZARD
    print(f"[*] Đang khởi tạo phiên giao dịch Wizard...")
    init_data = {
        "mode": "ADDUSER",
        "outputSpecifyModeIn": "DEFAULT",
        "entryIndexIn": next_id,
        "wimToken": wim_token
    }
    resp_init = session.post(get_wizard_url, data=init_data, headers={"Referer": list_url}, timeout=10)
    wim_token = extract_wim_token(resp_init.text) or wim_token

    # BƯỚC 1: BASE
    print(f"[*] Đang gửi yêu cầu Bước 1 (BASE) với ID {next_id}...")
    base_data = [
        ("wimToken", wim_token),
        ("mode", "ADDUSER"),
        ("step", "BASE"),
        ("entryIndexIn", next_id),
        ("entryNameIn", name[:20]),
        ("entryDisplayNameIn", name[:16]),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1")
    ]
    resp_base = session.post(set_wizard_url, data=base_data, headers={"Referer": list_url}, timeout=10)
    wim_token = extract_wim_token(resp_base.text) or wim_token

    # BƯỚC 2: MAIL
    print(f"[*] Đang gửi yêu cầu Bước 2 (MAIL)...")
    mail_data = {
        "wimToken": wim_token,
        "mode": "ADDUSER",
        "step": "MAIL",
        "mailAddressIn": email
    }
    resp_mail = session.post(set_wizard_url, data=mail_data, headers={"Referer": list_url}, timeout=10)
    wim_token = extract_wim_token(resp_mail.text) or wim_token

    # BƯỚC 3: CONFIRM
    print(f"[*] Đang gửi yêu cầu Bước 3 (CONFIRM)...")
    confirm_items = [
        ("wimToken", wim_token),
        ("mode", "ADDUSER"),
        ("step", "CONFIRM"),
        ("stepListIn", "BASE"),
        ("stepListIn", "MAIL")
    ]
    resp_confirm = session.post(set_wizard_url, data=confirm_items, headers={"Referer": list_url}, timeout=10)
    
    print("[*] Đang đóng quá trình để lưu (Simulate Back)...")
    session.get(list_url, timeout=10)

    if resp_confirm.status_code == 200:
        print("[+] Yêu cầu Đã được lưu (CONFIRM) thành công! Hãy kiểm tra lại máy in.")

def strip_html(text: str) -> str:
    if not text: return ""
    result = []
    in_tag = False
    for char in text:
        if char == '<':
            in_tag = True
        elif char == '>':
            in_tag = False
        elif not in_tag:
            result.append(char)
    clean = "".join(result)
    return clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').strip()

def parse_javascript_array_fields(data: str) -> list:
    fields = []
    current = []
    in_quotes = False
    quote_char = ""
    escaped = False
    for char in data:
        if escaped:
            current.append(char)
            escaped = False
            continue
        if char == "\\\\":
            current.append(char)
            escaped = True
            continue
        if char in {"'", '"'}:
            if not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char:
                in_quotes = False
            else:
                current.append(char)
            continue
        if char == "," and not in_quotes:
            fields.append("".join(current).strip())
            current = []
        else:
            current.append(char)
    fields.append("".join(current).strip())
    return fields

def parse_ajax_address_list(data: str) -> list:
    entries = []
    raw = str(data or "").strip()
    if not raw: return entries
    first = raw.find("[[")
    last = raw.rfind("]]")
    if first < 0 or last <= first:
        first = raw.find("[")
        last = raw.rfind("]")
        if first < 0 or last <= first: return entries
        inner = raw[first+1 : last]
    else:
        inner = raw[first+2 : last]
    
    rows = inner.split("],[")
    for raw_row in rows:
        raw_row = raw_row.strip("[]")
        fields = parse_javascript_array_fields(raw_row)
        if len(fields) < 4:
            continue
        raw_entry_id = fields[0].strip().strip("'\\"")
        reg_no = fields[2].strip("'\\"") if len(fields) > 2 else ""
        name = fields[3].strip("'\\"") if len(fields) > 3 else ""
        email = fields[6].strip("'\\"") if len(fields) > 6 else ""
        folder = fields[7].strip("'\\"") if len(fields) > 7 else ""
        if name or reg_no:
            entries.append({
                "entry_id": raw_entry_id,
                "registration_no": reg_no,
                "name": name,
                "email_address": email,
                "folder": folder
            })
    return entries

def parse_html_address_list(html: str) -> list:
    entries = []
    start_tbody = html.find('<tbody id="ReportListArea_TableBody">')
    if start_tbody < 0:
        return entries
    end_tbody = html.find('</tbody>', start_tbody)
    if end_tbody < 0:
        return entries
    tbody = html[start_tbody : end_tbody]
    
    rows = tbody.split('<tr')
    for row in rows:
        if 'reportListDummyRow' in row or 'reportListHeader' in row:
            continue
        # Extract entryIndex value
        entry_id = ""
        idx = row.find('entryIndex')
        if idx >= 0:
            val_idx = row.find('value=', idx)
            if val_idx >= 0:
                q = row[val_idx+6]
                if q in ('"', "'"):
                    end_q = row.find(q, val_idx+7)
                    if end_q >= 0:
                        entry_id = row[val_idx+7 : end_q]
        
        # Extract cells between <td> and </td>
        cells = []
        td_idx = 0
        while True:
            td_start = row.find('<td', td_idx)
            if td_start < 0:
                break
            content_start = row.find('>', td_start) + 1
            td_end = row.find('</td>', content_start)
            if td_end < 0:
                break
            cells.append(strip_html(row[content_start : td_end]))
            td_idx = td_end + 5
            
        if len(cells) < 2:
            continue
            
        reg_no = ""
        p_name = ""
        email = ""
        folder = ""
        for c in cells:
            if not reg_no and (c.isdigit() or (len(c) <= 4 and c != "-")):
                reg_no = c
            elif "@" in c and not email:
                email = c
            elif ("/" in c or "\\\\" in c) and not folder:
                folder = c
            elif c and c != "-" and not p_name and c not in ("User", "Group", "Summary"):
                p_name = c
        if p_name or reg_no:
            entries.append({
                "entry_id": entry_id,
                "registration_no": reg_no or "001",
                "name": p_name or "ScanUser",
                "email_address": email,
                "folder": folder
            })
    return entries

def auto_sync_address_book(session: requests.Session):
    try:
        print("[*] Đang tự động quét lại danh bạ máy in...")
        list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        resp = session.get(list_url, timeout=10)
        html_text = resp.text
        wim_token = extract_wim_token(html_text)
        
        if not wim_token or "authForm.cgi" in html_text:
            print("  [i] Phiên làm việc hết hạn, thử đăng nhập lại để quét...")
            session = requests.Session()
            session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
            time.sleep(1.0)
            form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
            r_form = session.get(form_url, timeout=10)
            wt = extract_wim_token(r_form.text)
            encoded_user = base64.b64encode(USER.encode()).decode()
            encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
            data = {"userid": encoded_user, "username": encoded_user, "password": encoded_pass, "wimToken": wt, "open": "websys/webArch/authForm.cgi"}
            session.post(f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi", data=data, headers={"Referer": form_url}, timeout=10)
            
            resp = session.get(list_url, timeout=10)
            html_text = resp.text
            wim_token = extract_wim_token(html_text)

        entries = []
        if wim_token:
            ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
            ajax_resp = session.get(ajax_url, timeout=10)
            if ajax_resp.status_code == 200 and "[" in ajax_resp.text:
                entries = parse_ajax_address_list(ajax_resp.text)

        if not entries and html_text:
            entries = parse_html_address_list(html_text)

        print(f"[*] TỔNG CỘNG LẤY ĐƯỢC: {len(entries)} MỤC TRÊN MÁY PHOTOCOPY RICOH:")
        print("--------------------------------------------------")
        for idx, item in enumerate(entries, 1):
            print(f"  #{idx:02d} | Mã ĐK: {item['registration_no']} | Tên: {item['name']} | ID: {item['entry_id']}")
        print("--------------------------------------------------")

        output_payload = {
            "status": "success",
            "count": len(entries),
            "address_list": entries
        }
        print(f"__ADDRESS_BOOK_JSON_START__\\\\n{json.dumps(output_payload, ensure_ascii=False)}\\\\n__ADDRESS_BOOK_JSON_END__")
    except Exception as list_err:
        print(f"[-] Lỗi quét danh bạ tự động: {list_err}")

sess = None
try:
    sess = login()
    create_email_scan(sess, TARGET_NAME, TARGET_EMAIL)
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI: {err}")
finally:
    if sess:
        try:
            auto_sync_address_book(sess)
        except Exception: pass
        logout(sess)
print("==================================================")
`,ricoh_delete_scan:`import requests
import re
import base64
import json
import sys
import time

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
TARGET_ID = "__TARGET_ID__"
TARGET_NAME = "__TARGET_SCAN_USER__"
BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH EXEC] XÓA ĐIỂM SCAN PHOTOCOPY - IP: {IP}")
print("==================================================")
print("[1/5] Cấu hình tham số:")
print(f"  - IP Máy in   : {IP}")
print(f"  - Đăng nhập   : {USER}")
print(f"  - Target ID   : {TARGET_ID}")
print(f"  - Target Name : {TARGET_NAME}")
print(f"  - Base URL    : {BASE_URL}")

def extract_wim_token(html: str) -> str:
    if not html: return ""
    m = re.search(r'wimToken\\s*[:=]\\s*["\\']?([^"\\'\\s;>]+)["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name\\s*=\\s*["\\']?wimToken["\\']?[^>]*?value\\s*=\\s*["\\']?([^"\\'\\s>]+)["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value\\s*=\\s*["\\']?([^"\\'\\s>]+)["\\']?[^>]*?name\\s*=\\s*["\\']?wimToken["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def logout(session: requests.Session):
    print("[*] Đang đăng xuất để giải phóng phiên làm việc...")
    try:
        session.get(f"{BASE_URL}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
        time.sleep(1)
        print("  [✓] Giải phóng phiên OK.")
    except Exception as e:
        print(f"  [!] Logout warning: {e}")

def login() -> requests.Session:
    session = requests.Session()
    logout(session)
    time.sleep(1.0)
    
    print("")
    print(f"[2/5] Tiến hành đăng nhập WIM ({IP})...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    print(f"  -> Lấy form từ: {form_url}")
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    print(f"  -> Extracted wimToken: '{wim_token}'")
    
    login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode()
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
    
    data = {
        "userid": encoded_user,
        "username": encoded_user,
        "password": encoded_pass,
        "wimToken": wim_token,
        "open": "websys/webArch/authForm.cgi"
    }
    print(f"  -> Đang gửi POST login tới {login_url}...")
    resp = session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    
    if "Authentication has failed" in resp.text or "not correct" in resp.text:
        raise RuntimeError("Sai tài khoản hoặc mật khẩu đăng nhập máy in Ricoh!")
    elif "SESSIONFULL" in resp.text or "session limit" in resp.text.lower():
        raise RuntimeError("Đầy phiên đăng nhập (Session Full). Vui lòng đợi 1 phút hoặc reset máy in!")
    else:
        print("  [✓] Đăng nhập thành công vào máy in Ricoh!")
        
    return session

def delete_scan_by_id_or_name(session: requests.Session, target_id: str, target_name: str):
    print("")
    print("[3/5] Tải danh sách điểm scan từ máy in...")
    list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    
    if not wim_token or "authForm.cgi" in resp.text or "login.cgi" in resp.text:
        print("  [i] Phiên làm việc cần làm mới, tiến hành re-login...")
        session = login()
        resp = session.get(list_url, timeout=10)
        wim_token = extract_wim_token(resp.text)

    if not wim_token:
        raise RuntimeError(f"Không lấy được wimToken từ trang danh sách (HTTP {resp.status_code}, length={len(resp.text)}). Vui lòng kiểm tra lại trạng thái đăng nhập máy in.")

    ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
    print(f"  -> Gọi AJAX lấy danh bạ: {ajax_url}")
    ajax_resp = session.get(ajax_url, timeout=10)
    
    print("")
    print(f"[4/5] Tìm kiếm điểm scan khớp (ID: '{target_id}', Tên: '{target_name}')...")
    reg_to_delete = None
    entry_id_to_delete = None
    raw_entries = re.findall(r"\\[([^\\]]+)\\]", ajax_resp.text)
    print(f"  -> Tổng số điểm scan tìm thấy trên máy in: {len(raw_entries)}")
    
    for idx, raw in enumerate(raw_entries, 1):
        fields = [f.strip().strip("'").strip('"') for f in raw.split(',')]
        if len(fields) >= 4:
            eid = fields[0].lstrip("[")
            reg = fields[2]
            name = fields[3]
            if reg == target_id or reg.lstrip('0') == target_id.lstrip('0') or (target_name and name.lower() == target_name.lower()):
                reg_to_delete = reg
                entry_id_to_delete = eid
                print(f"  [✓] MATCH! Tìm thấy mục trùng khớp tại dòng #{idx}: Entry ID={eid}, Mã ĐK={reg}, Tên='{name}'")
                break

    if not reg_to_delete and target_id and target_id != "null":
        reg_to_delete = target_id.zfill(5)
        entry_id_to_delete = target_id
        print(f"  [i] Sử dụng Mã ĐK định dạng chuẩn: {reg_to_delete}")

    if not reg_to_delete:
        raise RuntimeError(f"KHÔNG tìm thấy điểm scan nào phù hợp (ID: '{target_id}', Tên: '{target_name}') trên máy in để xóa!")

    # RE-FETCH list_url to get a FRESH wimToken (the AJAX call consumed the old one)
    print("  -> Lấy wimToken MỚI từ adrsList.cgi (vì AJAX call đã tiêu thụ token cũ)...")
    fresh_resp = session.get(list_url, timeout=10)
    fresh_token = extract_wim_token(fresh_resp.text)
    if fresh_token:
        wim_token = fresh_token
        print(f"  -> Fresh wimToken: '{wim_token}'")

    print("")
    print(f"[5/5] Đang gửi POST xóa Mã ĐK '{reg_to_delete}' (Entry ID: {entry_id_to_delete})...")
    delete_url = f"{BASE_URL}/web/entry/en/address/adrsDeleteEntries.cgi"
    
    del_val = str(entry_id_to_delete or reg_to_delete)
    reg_val = str(reg_to_delete)
    
    form = {
        "wimToken": wim_token,
        "entryIndex": del_val,
        "entryIndexIn": del_val,
        "regiNoListIn": del_val,
        "selectedRegiNoIn": del_val,
        "deleteListIn": del_val,
        "modeIn": "LIST_ALL",
        "deleteRegNo": reg_val
    }
    
    multipart_form = {k: (None, str(v)) for k, v in form.items()}
    session.post(delete_url, files=multipart_form, headers={"Referer": list_url}, timeout=10)
    
    time.sleep(1.5)
    
    # Verification Step
    print("  -> Đang xác minh lại danh bạ máy in sau khi xóa...")
    v_list_resp = session.get(list_url, timeout=10)
    v_token = extract_wim_token(v_list_resp.text) or wim_token
    v_ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={v_token}"
    v_ajax = session.get(v_ajax_url, timeout=10)
    
    still_exists = False
    v_raw_entries = re.findall(r"\\[([^\\]]+)\\]", v_ajax.text)
    for raw in v_raw_entries:
        fields = [f.strip().strip("'").strip('"') for f in raw.split(',')]
        if len(fields) >= 4:
            v_reg = fields[2]
            v_name = fields[3]
            if v_reg == reg_to_delete or v_reg.lstrip('0') == reg_to_delete.lstrip('0') or (target_name and v_name.lower() == target_name.lower()):
                still_exists = True
                break

    if still_exists:
        print("  [!] Lần 1 (theo Entry ID) chưa xóa thành công, thử xóa theo Mã ĐK chuẩn (zfill)...")
        reg_zfill = reg_to_delete.zfill(5)
        fresh_resp2 = session.get(list_url, timeout=10)
        fresh_token2 = extract_wim_token(fresh_resp2.text) or v_token
        
        form2 = {
            "wimToken": fresh_token2,
            "entryIndex": reg_zfill,
            "entryIndexIn": reg_zfill,
            "regiNoListIn": reg_zfill,
            "selectedRegiNoIn": reg_zfill,
            "deleteListIn": reg_zfill,
            "modeIn": "LIST_ALL",
            "deleteRegNo": reg_zfill
        }
        multipart_form2 = {k: (None, str(v)) for k, v in form2.items()}
        session.post(delete_url, files=multipart_form2, headers={"Referer": list_url}, timeout=10)
        time.sleep(1.5)
        
        v_list_resp3 = session.get(list_url, timeout=10)
        v_token3 = extract_wim_token(v_list_resp3.text) or fresh_token2
        v_ajax3 = session.get(f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={v_token3}", timeout=10)
        
        still_exists2 = False
        for raw in re.findall(r"\\[([^\\]]+)\\]", v_ajax3.text):
            fields = [f.strip().strip("'").strip('"') for f in raw.split(',')]
            if len(fields) >= 4:
                if fields[2] == reg_to_delete or fields[2].lstrip('0') == reg_to_delete.lstrip('0') or (target_name and fields[3].lower() == target_name.lower()):
                    still_exists2 = True
                    break
        
        if still_exists2:
            raise RuntimeError(f"KHÔNG THỂ XÓA: Đã gửi 2 lần POST xóa nhưng Mã ĐK '{reg_to_delete}' (Tên: '{target_name}') vẫn còn trên máy in Ricoh!")

    print(f"  [✓] XÁC MINH THÀNH CÔNG: Đã xóa hoàn toàn điểm scan Mã ĐK '{reg_to_delete}' khỏi máy in Ricoh {IP}!")

sess = None
try:
    sess = login()
    delete_scan_by_id_or_name(sess, TARGET_ID, TARGET_NAME)
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI: {err}")
finally:
    if sess:
        logout(sess)
print("==================================================")
`,ricoh_list_scan:`import requests
import re
import base64
import json
import sys
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH EXEC] QUÉT DANH BẠ SCAN PHOTOCOPY - IP: {IP}")
print("==================================================")
print(f"[1/4] Khởi tạo cấu hình: IP={IP}, USER={USER}")

def extract_wim_token(html: str) -> str:
    if not html: return ""
    m = re.search(r'wimToken\\s*[:=]\\s*["\\']?([^"\\'\\s;>]+)["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name\\s*=\\s*["\\']?wimToken["\\']?\\s+value\\s*=\\s*["\\']?([^"\\'\\s>]+)["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value\\s*=\\s*["\\']?([^"\\'\\s>]+)["\\']?\\s+name\\s*=\\s*["\\']?wimToken["\\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def strip_html(text: str) -> str:
    if not text: return ""
    clean = re.sub(r'<[^>]+>', '', text)
    return clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').strip()

def logout(session: requests.Session):
    try:
        session.get(f"{BASE_URL}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
        time.sleep(0.5)
    except: pass

def login() -> requests.Session:
    session = requests.Session()
    logout(session)
    time.sleep(1.0)
    print(f"[2/4] Đang đăng nhập Web Image Monitor...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode()
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
    data = {"userid": encoded_user, "username": encoded_user, "password": encoded_pass, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}
    session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    print("  [✓] Đăng nhập thành công!")
    return session

def parse_javascript_array_fields(data: str) -> list:
    fields = []
    current = []
    in_quotes = False
    quote_char = ""
    escaped = False
    for char in data:
        if escaped:
            current.append(char)
            escaped = False
            continue
        if char == "\\\\":
            current.append(char)
            escaped = True
            continue
        if char in {"'", '"'}:
            if not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char:
                in_quotes = False
            else:
                current.append(char)
            continue
        if char == "," and not in_quotes:
            fields.append("".join(current).strip())
            current = []
        else:
            current.append(char)
    fields.append("".join(current).strip())
    return fields

def parse_ajax_address_list(data: str) -> list:
    entries = []
    raw = str(data or "").strip()
    if not raw: return entries
    
    first = raw.find("[")
    last = raw.rfind("]")
    if first < 0 or last <= first: return entries
    data_str = raw[first : last + 1]

    raw_entries = re.findall(r"\\[([^\\]]+)\\]", data_str)
    for raw_row in raw_entries:
        fields = parse_javascript_array_fields(raw_row)
        if len(fields) < 4:
            continue
        raw_entry_id = fields[0].strip().lstrip("[").strip("'\\"")
        reg_no = fields[2].strip("'\\"") if len(fields) > 2 else ""
        name = fields[3].strip("'\\"") if len(fields) > 3 else ""
        email = fields[6].strip("'\\"") if len(fields) > 6 else ""
        folder = fields[7].strip("'\\"") if len(fields) > 7 else ""
        
        if name or reg_no:
            entries.append({
                "entry_id": raw_entry_id,
                "registration_no": reg_no,
                "name": name,
                "email_address": email,
                "folder": folder
            })
    return entries

def parse_html_address_list(html: str) -> list:
    entries = []
    tbody_match = re.search(r'<tbody id="ReportListArea_TableBody">(.*?)</tbody>', html, re.S)
    if not tbody_match:
        return entries

    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", tbody_match.group(1), re.S)
    for row in rows:
        if "reportListDummyRow" in row:
            continue
        cells = re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)
        if len(cells) < 2:
            continue
        
        entry_id = ""
        id_match = re.search(r'name=["\\']entryIndex["\\'][^>]*value=["\\'](\\d+)["\\']', row, re.I)
        if not id_match:
            id_match = re.search(r'value=["\\'](\\d+)["\\'][^>]*name=["\\']entryIndex["\\']', row, re.I)
        if id_match:
            entry_id = id_match.group(1)
        else:
            fallback_match = re.search(r'entryIndexIn=(\\d+)', row, re.I)
            if fallback_match:
                entry_id = fallback_match.group(1)

        cleaned_cells = [strip_html(c) for c in cells]
        reg_no = ""
        p_name = ""
        email = ""
        folder = ""

        for c in cleaned_cells:
            if not reg_no and (c.isdigit() or (len(c) <= 4 and c != "-")):
                reg_no = c
            elif "@" in c and not email:
                email = c
            elif ("\\\\" in c or "/" in c) and not folder:
                folder = c
            elif c and c != "-" and not p_name and c not in ("User", "Group", "Summary"):
                p_name = c

        if p_name or reg_no:
            entries.append({
                "entry_id": entry_id,
                "registration_no": reg_no or "001",
                "name": p_name or "ScanUser",
                "email_address": email,
                "folder": folder
            })
    return entries

def fetch_list():
    sess = login()
    try:
        print(f"[3/4] Truy cập danh mục 'To Address List' từ Ricoh {IP}...")
        list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        resp = sess.get(list_url, timeout=10)
        html_text = resp.text
        wim_token = extract_wim_token(html_text)
        
        if not wim_token or "authForm.cgi" in html_text:
            print("  [i] Thử lại đăng nhập...")
            sess = login()
            resp = sess.get(list_url, timeout=10)
            html_text = resp.text
            wim_token = extract_wim_token(html_text)

        entries = []
        if wim_token:
            ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
            ajax_resp = sess.get(ajax_url, timeout=10)
            if ajax_resp.status_code == 200 and "[" in ajax_resp.text:
                entries = parse_ajax_address_list(ajax_resp.text)

        if not entries and html_text:
            print("  [i] Parse danh bạ từ HTML table...")
            entries = parse_html_address_list(html_text)

        print(f"[4/4] TỔNG CỘNG LẤY ĐƯỢC: {len(entries)} MỤC TRÊN MÁY PHOTOCOPY RICOH:")
        print("--------------------------------------------------")
        for idx, item in enumerate(entries, 1):
            print(f"  #{idx:02d} | Mã ĐK: {item['registration_no']} | Tên: {item['name']} | ID: {item['entry_id']}")
        print("--------------------------------------------------")

        output_payload = {
            "status": "success",
            "count": len(entries),
            "address_list": entries
        }
        print(f"__ADDRESS_BOOK_JSON_START__\\n{json.dumps(output_payload, ensure_ascii=False)}\\n__ADDRESS_BOOK_JSON_END__")

    finally:
        logout(sess)
        print("  [✓] Đã hoàn tất và đăng xuất.")

try:
    fetch_list()
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI QUÉT DANH BẠ: {err}")
print("==================================================")
`,toshiba_create_scan:`"""Tạo Scan-to-FTP template trên Toshiba TopAccess - cấu trúc XML copy chính xác từ template cuong1 đang hoạt động."""
import requests
import socket
import re
import sys
import json
import urllib3
from datetime import datetime
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
NAME = "__TARGET_NAME__"

def get_local_ip(target_ip):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((target_ip, 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

SECURE_PDF_BLOCK = """<SecurePDF><Enabled>false</Enabled><EncryptionLevel>40bitRC4</EncryptionLevel><DocumentOpenPassword/><Permissions><Enabled>false</Enabled><PermissionsPassword/><PrintAuthority>Disable</PrintAuthority><EditAuthority>Disable</EditAuthority><Accessibility>false</Accessibility><CopyAuthority>false</CopyAuthority></Permissions></SecurePDF>"""

def build_register_template_xml(scan_username, local_ip, ftp_port, ftp_user, ftp_password, template_slot, group_slot):
    sp = SECURE_PDF_BLOCK
    
    # Scan XML block - matches JS scanXML variable (line 1509)
    scan_xml = (
        f"<ColorParameter><ColorMode>Monochrome</ColorMode></ColorParameter>"
        f"<ImageAdjustmentParameter>"
        f"<ImageMode>Text</ImageMode><ImageQuality>Middle</ImageQuality><ImageRotate>0</ImageRotate>"
        f"<Exposure><ExposureMode>Auto</ExposureMode><ExposureLevel>0</ExposureLevel></Exposure>"
        f"<BackgroundAdjustment>0</BackgroundAdjustment>"
        f"<Contrast>0</Contrast>"
        f"<Sharpness>0</Sharpness>"
        f"<Saturation>0</Saturation>"
        f"<RGBAdjustment><Red>0</Red><Green>0</Green><Blue>0</Blue></RGBAdjustment>"
        f"</ImageAdjustmentParameter>"
        f"<Scan Enabled='true'><ScanParameter>"
        f"<DuplexMode>Simplex</DuplexMode>"
        f"<Resolution>200</Resolution>"
        f"<OriginalSizeInformation><OriginalSize>Undefined</OriginalSize></OriginalSizeInformation>"
        f"<AutoOriginalDetectionMode>true</AutoOriginalDetectionMode>"
        f"<MixedOriginalSizes>false</MixedOriginalSizes>"
        f"<OmitBlankPage><Enabled>false</Enabled></OmitBlankPage>"
        f"<OutSideErase><Enabled>false</Enabled><DetectExposureLevel></DetectExposureLevel></OutSideErase>"
        f"<DropOutColor><Enabled>false</Enabled><RangeAdjustment>0</RangeAdjustment></DropOutColor>"
        f"<NoiseReduction>Disable</NoiseReduction>"
        f"<FoldingOriginal><Scan>false</Scan></FoldingOriginal>"
        f"</ScanParameter>"
        f"<Output>"
        f"<Preview Enabled='false'></Preview>"
        f"<FTPStore Index='1' Enabled='true'><FTPStoreParameter>"
        f"<FileFormatInformation><FileFormat>PDFMulti</FileFormat>{sp}</FileFormatInformation>"
        f"<ServerName>{local_ip}</ServerName>"
        f"<CommandPort>{ftp_port}</CommandPort>"
        f"<StorePath>{scan_username}</StorePath>"
        f"<UserName>{ftp_user}</UserName>"
        f"<Password>{ftp_password}</Password>"
        f"<SSL>false</SSL>"
        f"</FTPStoreParameter></FTPStore>"
        f"</Output></Scan>"
    )
    
    # SetValue part 1: JobTemplates - matches JS gblSETRequestXMLArray[0] (line 1511)
    set_value_1 = (
        f"<JobTemplates><View><New><Template>"
        f"<OriginalKey>Queues/Scan</OriginalKey>"
        f"<MetaData>"
        f"<caption1>Scan To</caption1>"
        f"<caption2>File</caption2>"
        f"<userName></userName>"
        f"<isPasswordProtected>false</isPasswordProtected>"
        f"<autoStart>false</autoStart>"
        f"<NotificationSettings>"
        f"<email Enabled='false'></email>"
        f"<onJobCompletion>false</onJobCompletion>"
        f"<onError>false</onError>"
        f"</NotificationSettings>"
        f"<type>Normal</type>"
        f"</MetaData>"
        f"<Params><saveFileName nameFormat='standard-date'>DOCMMDDYY</saveFileName></Params>"
        f"</Template></New></View></JobTemplates>"
    )
    
    # SetValue part 2: Queues - matches JS gblSETRequestXMLArray[1] (line 1511)
    set_value_2 = (
        f"<Queues><Scan><WorkflowExecutionParameter>"
        f"<WorkflowPolicy></WorkflowPolicy>"
        f"{scan_xml}"
        f"</WorkflowExecutionParameter></Scan></Queues>"
    )
    
    # Command: RegisterTemplate - matches JS glbContentWebServerCmdArray (line 1515)
    cmd = (
        f"<RegisterTemplate>"
        f"<commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>"
        f"<Params>"
        f"<param name='selectedGroup'>{group_slot}</param>"
        f"<param name='selectedTemplate'>{template_slot}</param>"
        f"<param name='newMetadata'>JobTemplates/View/New/Template/MetaData</param>"
        f"<param name='originalKey'>Queues/Scan</param>"
        f"<param name='newParamsData'>JobTemplates/View/New/Template/Params</param>"
        f"<param name='newTemplatePassword'></param>"
        f"</Params>"
        f"</RegisterTemplate>"
    )
    
    return (
        f"<?xml version='1.0' encoding='UTF-8'?>"
        f"<DeviceInformationModel>"
        f"<SetValue>{set_value_1}</SetValue>"
        f"<SetValue>{set_value_2}</SetValue>"
        f"<Command>{cmd}</Command>"
        f"</DeviceInformationModel>"
    )


def setup_toshiba_scan(printer_ip, admin_user, admin_password, scan_username, existing_group=None):
    print(f"[*] Tạo Scan-to-FTP cho Toshiba {printer_ip}, user: {scan_username}")
    
    local_ip = get_local_ip(printer_ip)
    ftp_port = "2130"
    ftp_user = "goxprint"
    ftp_password = "goxprint"
    print(f"[*] FTP Server: {local_ip}:{ftp_port}")
    
    # Bootstrap
    session = requests.Session()
    origin = f"http://{printer_ip}"
    landing = f"{origin}/?MAIN=TOPACCESS"
    cgi = f"{origin}/contentwebserver"
    session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; ToshibaTopAccessAgent/1.0)", "Accept": "*/*", "Cache-Control": "no-cache", "Pragma": "no-cache", "Referer": landing})
    session.cookies.set("pageTrack", "MAIN=TOPACCESS")
    
    try:
        session.get(landing, verify=False, timeout=10)
    except Exception as e:
        print(f"[-] Kết nối thất bại: {e}")
        return
    
    csrf = session.cookies.get("Session") or ""
    if not csrf:
        print("[-] Không lấy được Session cookie!")
        return
    headers = {"Content-Type": "text/plain; charset=utf-8", "csrfpId": csrf}

    # Login
    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><SetValue><Authentication><UserCredential><userName>{admin_user}</userName><passwd>{admin_password}</passwd><ipaddress>{local_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue><Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command></DeviceInformationModel>"""
    r = session.post(cgi, data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
    if "STATUS_OK" not in r.text and "Success" not in r.text:
        print(f"[-] Login thất bại: {r.text[:200]}")
        return
    print("[+] Login OK")
    csrf = session.cookies.get("Session") or csrf
    headers["csrfpId"] = csrf

    # License
    try:
        session.post(cgi, data="""<DeviceInformationModel><SetValue overrideDelta="false"><Payload><path>TopAccess/SessionInfo/LICENSE_SETTINGS</path><value>,METASCAN:NO,PDF-A:YES,EWB:YES,IPSEC:NO,</value></Payload></SetValue></DeviceInformationModel>""".encode("utf-8"), headers=headers, verify=False, timeout=5)
    except:
        pass

    # Tạo Group hoặc dùng group có sẵn
    if existing_group:
        group_slot = existing_group
        print(f"[*] Dùng Group có sẵn: {group_slot}")
    else:
        print(f"[*] Tìm Group slot cho '{scan_username}'...")
        group_slot = None
        for g in range(2, 201):
            slot = f"{g:03d}"
            gxml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><SetValue><JobTemplates><View><New><Group><MetaData><groupName>{scan_username}</groupName><userName></userName><notificationEmail></notificationEmail></MetaData></Group></New></View></JobTemplates></SetValue><Command><RegisterGroup><commandNode>JobTemplates/GroupList</commandNode><Params><param name='selectedGroup'>{slot}</param><param name='newGroupPassword'></param><param name='newMetadata'>JobTemplates/View/New/Group/MetaData</param></Params></RegisterGroup></Command></DeviceInformationModel>"""
            try:
                r = session.post(cgi, data=gxml.encode("utf-8"), headers=headers, verify=False, timeout=8)
                if "STATUS_OK" in r.text:
                    group_slot = slot
                    print(f"[+] Group '{scan_username}' = slot {slot}")
                    break
                elif "ALREADY_ASSIGNED" in r.text:
                    continue
                else:
                    m = re.search(r'<statusOfOperation>([^<]+)</statusOfOperation>', r.text)
                    print(f"[-] Slot {slot}: {m.group(1) if m else r.text[:200]}")
                    break
            except Exception as e:
                print(f"[-] Error: {e}")
                break
        
        if not group_slot:
            print("[-] Không tìm được Group slot!")
            return

    # Tạo Template
    print(f"[*] Tạo Template FTP scan...")
    success = False
    for i in range(1, 61):
        t_slot = f"{i:03d}"
        txml = build_register_template_xml(scan_username, local_ip, ftp_port, ftp_user, ftp_password, t_slot, group_slot)
        try:
            r = session.post(cgi, data=txml.encode("utf-8"), headers=headers, verify=False, timeout=12)
            with open("register_response.xml", "w", encoding="utf-8") as f:
                f.write(r.text)
            if "STATUS_OK" in r.text or "Success" in r.text:
                print(f"[+] THÀNH CÔNG! Group {group_slot} / Template {t_slot}")
                print(f"    Tên: Scan To {scan_username}")
                print(f"    FTP: {local_ip}:{ftp_port}/{scan_username}/")
                success = True
                break
            elif "ALREADY_ASSIGNED" in r.text:
                continue
            else:
                m = re.search(r'<statusOfOperation>([^<]+)</statusOfOperation>', r.text)
                print(f"[-] Template lỗi: {m.group(1) if m else 'Unknown'}")
                print(f"[DEBUG] {r.text[:500]}")
                break
        except Exception as e:
            print(f"[-] Error: {e}")
            break

    if not success:
        print("[-] Không tạo được Template!")

    # Logout
    try:
        session.post(cgi, data="""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>""".encode("utf-8"), headers=headers, verify=False, timeout=3)
        print("[+] Logout OK")
    except:
        pass

    # Auto-fetch updated address book and populate context/bridge for auto-reload
    import time
    print("  -> Chờ 3 giây để máy photo Toshiba cập nhật hoàn tất bộ nhớ đệm...")
    time.sleep(3)
    try:
        from datetime import datetime
        import json
        import xml.etree.ElementTree as ET
        
        get_list_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><GetValue><JobTemplates><View><GroupList/></View></JobTemplates></GetValue><Command><GetGroupList><commandNode>JobTemplates/GroupList</commandNode><Params><param name='viewXpath'>JobTemplates/View/GroupList</param><param name='currentPage'>1</param><param name='pageSize'>200</param><param name='definedGroups'>true</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetGroupList></Command></DeviceInformationModel>"""
        r_list = session.post(cgi, data=get_list_xml.encode("utf-8"), headers={"Content-Type": "text/plain; charset=utf-8"}, verify=False, timeout=10)
        if r_list.status_code == 200:
            root = ET.fromstring(r_list.text)
            entries = []
            for g_node in root.findall(".//Group"):
                id_node = g_node.find("groupID")
                g_id = id_node.text.strip() if id_node is not None and id_node.text else ""
                name_node = g_node.find(".//groupName")
                g_name = name_node.text.strip() if name_node is not None and name_node.text else ""
                if g_id and g_name and g_name != "Undefined":
                    entries.append({
                        "entry_id": g_id,
                        "name": g_name,
                        "registration_no": g_id,
                        "email_address": f"{g_name}@scan.local",
                        "folder_path": f"ftp://{local_ip}:{ftp_port}/{g_name}/",
                        "physical_path": f"ftp://{local_ip}:{ftp_port}/{g_name}/",
                        "protocol": "FTP",
                        "server_host": local_ip,
                        "folder_port_no": ftp_port,
                        "path_on_folder": f"/{g_name}/"
                    })
            
            addr_list = [{
                "name": "Summary", "registration_no": "-", "email_address": "", "folder_path": "",
                "entry_id": "", "physical_path": "", "protocol": "", "server_host": "",
                "folder_port_no": "", "path_on_folder": ""
            }] + entries

            final_result = {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "address_list": addr_list
            }

            bridge_obj = globals().get('bridge') or locals().get('bridge')
            if bridge_obj:
                try:
                    real_mac = ""
                    try:
                        local_printers = bridge_obj._load_local_printers_json() or []
                        for p_item in local_printers:
                            p_item_ip = str(p_item.get("ip") or "").strip()
                            if p_item_ip == printer_ip or (printer_ip and printer_ip in p_item_ip):
                                real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                                break
                    except Exception: pass

                    try:
                        from agent.models import Printer as AgentPrinter
                        p = AgentPrinter(ip=printer_ip, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")
                    except Exception:
                        from types import SimpleNamespace
                        p = SimpleNamespace(ip=printer_ip, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")

                    bridge_obj._post_address_book_sync_data(p, final_result)
                    print(f"  [✓] TỰ ĐỘNG ĐỒNG BỘ DANH BẠ MỚI NHẤT ({len(entries)} GROUPS) VỀ SERVER THANH CONG!")
                except Exception as sync_err:
                    print(f"  [!] Sync post warning: {sync_err}")

            res_str = json.dumps(final_result, ensure_ascii=False)
            if globals().get('context'):
                globals()['context']['result_payload'] = res_str
                globals()['context']['address_book_data'] = final_result
    except Exception as fetch_err:
        print(f"  [!] Tự động lấy danh bạ sau khi tạo thất bại: {fetch_err}")


if globals().get('context') and isinstance(globals()['context'], dict):
    ctx = globals()['context']
    if ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip'):
        IP = str(ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip')).strip()
    if ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user'):
        USER = str(ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user')).strip()
    if ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass'):
        PASSWORD = str(ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass')).strip()
    if ctx.get('name') or ctx.get('target_name') or ctx.get('email'):
        NAME = str(ctx.get('name') or ctx.get('target_name') or ctx.get('email')).strip()

try:
    setup_toshiba_scan(IP, USER, PASSWORD, NAME)
except Exception as err:
    print("")
    print(f"[-] LOI THUC THI: {err}")
    print("==================================================")
    sys.exit(1)
print("==================================================")
`,toshiba_delete_scan:`import requests
import urllib3
import sys
import socket
import ssl
import re
import json
import xml.etree.ElementTree as ET
from datetime import datetime

if getattr(sys, "stdout", None) and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ToshibaSSLAdapter(requests.adapters.HTTPAdapter):
    def init_poolmanager(self, *args, **kwargs):
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        try:
            ctx.set_ciphers('DEFAULT:@SECLEVEL=1')
        except Exception:
            pass
        kwargs['ssl_context'] = ctx
        return super().init_poolmanager(*args, **kwargs)

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
TARGET_ID = "__TARGET_ID__"

print("==================================================")
print(f"  [TOSHIBA EXEC] XOA / RESET GROUP & TEMPLATE SCAN - IP: {IP}")
print("==================================================")
print(f"[1/4] Tham so: IP={IP}, USER={USER}, TARGET_ID={TARGET_ID}")

def reset_single_toshiba_template(ip, user, password, target_id):
    if not target_id or str(target_id).lower() in ("null", "none", ""):
        raise RuntimeError("Chua truyen ID diem scan/group can reset!")
    
    target_raw = str(target_id).strip()
    if "-" in target_raw:
        parts = target_raw.split("-")
        parsed_group = parts[0].zfill(3)
        parsed_template = parts[1].zfill(3)
    else:
        parsed_group = target_raw.zfill(3)
        parsed_template = target_raw.zfill(3)

    user_name = user or "admin"
    pws = []
    if password: pws.append(password)

    base_urls = [
        f"http://{ip}",
        f"https://{ip}:10443",
        f"https://{ip}"
    ]

    session = requests.Session()
    try:
        session.mount("https://", ToshibaSSLAdapter())
    except Exception:
        pass

    login_success = False
    working_base_url = ""
    working_pw = ""
    user_token_id = ""
    log_history = []

    print("")
    print(f"[2/4] Dang nhap Toshiba TopAccess ({ip})...")

    for target_url in base_urls:
        if login_success: break
        
        landing_url = f"{target_url}/?MAIN=TOPACCESS"
        try:
            r_boot = session.get(landing_url, verify=False, timeout=5)
            print(f"  -> GET Landing {landing_url}: status={r_boot.status_code}, cookies={dict(session.cookies)}")
        except Exception as boot_exc:
            print(f"  [!] GET Landing {landing_url} exc: {boot_exc}")

        csrf_token = session.cookies.get("Session") or session.cookies.get("session") or ""

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'Referer': landing_url,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
        if csrf_token:
            headers['csrfpId'] = csrf_token

        try:
            local_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_ip = "127.0.0.1"

        for pw in pws:
            login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue>
    <Authentication>
        <UserCredential>
            <userName>{user_name}</userName>
            <passwd>{pw}</passwd>
            <ipaddress>{local_ip}</ipaddress>
            <applicationType>TOP_ACCESS</applicationType>
        </UserCredential>
    </Authentication>
</SetValue>
<Command>
    <Login>
        <commandNode>Authentication/UserCredential</commandNode>
        <Params><appName>TOPACCESS</appName></Params>
    </Login>
</Command>
</DeviceInformationModel>"""
            try:
                r_log = session.post(f"{target_url}/contentwebserver", data=login_xml.encode('utf-8'), headers=headers, verify=False, timeout=6)
                resp_text = r_log.text.strip()
                resp_snippet = resp_text[:180].replace(chr(10), " ").replace(chr(13), " ")
                log_msg = f"{target_url} (pw='{pw}') => HTTP {r_log.status_code}: {resp_snippet}"
                print(f"  -> Login: {log_msg}")
                log_history.append(log_msg)

                # Extract userTokenId from response
                m_token = re.search(r'<userTokenId>([^<]+)</userTokenId>', resp_text)
                if m_token:
                    user_token_id = m_token.group(1).strip()
                    headers['userTokenId'] = user_token_id
                    print(f"  [✓] Extracted userTokenId: '{user_token_id}'")

                csrf_token = session.cookies.get("Session") or session.cookies.get("session") or csrf_token
                if csrf_token:
                    headers['csrfpId'] = csrf_token

                if r_log.status_code == 200 and ("STATUS_OK" in resp_text or "<LoginResult>Success</LoginResult>" in resp_text or user_token_id):
                    login_success = True
                    working_base_url = target_url
                    working_pw = pw
                    print(f"  [OK] DANG NHAP TOPACCESS THANH CONG qua {target_url} (User: '{user_name}', PW: '{pw}')!")
                    break
            except Exception as log_exc:
                print(f"  [!] POST Login {target_url} (pw='{pw}') exc: {log_exc}")

    if not login_success:
        err_details = chr(10).join(log_history[-6:])
        raise RuntimeError(f"DANG NHAP THAT BAI: May in Toshiba {ip} tu choi dang nhap TopAccess voi tat ca mat khau/cong.{chr(10)}Nhat ky dang nhap:{chr(10)}{err_details}")

    # Step 2.5: License Settings Payload
    print("  -> Khoi tao LICENSE_SETTINGS session payload...")
    license_xml = """<DeviceInformationModel><SetValue overrideDelta="false"><Payload><path>TopAccess/SessionInfo/LICENSE_SETTINGS</path><value>,METASCAN:NO,PDF-A:YES,EWB:YES,IPSEC:NO,</value></Payload></SetValue></DeviceInformationModel>"""
    try:
        r_lic = session.post(f"{working_base_url}/contentwebserver", data=license_xml.encode('utf-8'), headers=headers, verify=False, timeout=5)
        print(f"  [✓] LICENSE_SETTINGS: HTTP {r_lic.status_code}")
    except Exception as lic_exc:
        print(f"  [!] LICENSE_SETTINGS exc: {lic_exc}")

    print("")
    print(f"[3/4] Xoa/Reset Group '{parsed_group}' va Template tương ứng...")

    auth_xml_block = ""
    if user_token_id:
        auth_xml_block = f"<SetValue><Authentication><UserCredential><userTokenId>{user_token_id}</userTokenId></UserCredential></Authentication></SetValue>"

    reset_ok = False
    del_history = []

    # 1. DeleteGroup with EXACT commandNode JobTemplates/GroupList/Group
    act_1 = "DeleteGroup_JobTemplates_Group"
    xml_1 = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel>{auth_xml_block}<Command><DeleteGroup><commandNode>JobTemplates/GroupList/Group</commandNode><Params><param name="selectedGroup">{parsed_group}</param><param name="inputGroupPassword"></param></Params></DeleteGroup></Command></DeviceInformationModel>"""

    # 2. DeleteTemplate with EXACT commandNode JobTemplates/GroupList/Group/TemplateList/Template
    act_2 = "DeleteTemplate_JobTemplates_Group_Template"
    xml_2 = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel>{auth_xml_block}<Command><DeleteTemplate><commandNode>JobTemplates/GroupList/Group/TemplateList/Template</commandNode><Params><param name="selectedGroup">{parsed_group}</param><param name="selectedTemplate">{parsed_template}</param><param name="inputGroupPassword"></param></Params></DeleteTemplate></Command></DeviceInformationModel>"""

    # 3. RegisterGroup Reset with commandNode JobTemplates/GroupList/Group
    act_3 = "RegisterGroup_Reset_Group"
    xml_3 = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel>{auth_xml_block}<SetValue><JobTemplates><View><Group><MetaData><groupName>Undefined</groupName><userName>Undefined</userName><notificationEmail></notificationEmail></MetaData></Group></View></JobTemplates></SetValue><Command><RegisterGroup><commandNode>JobTemplates/GroupList/Group</commandNode><Params><param name="selectedGroup">{parsed_group}</param><param name="newGroupPassword"></param><param name="inputGroupPassword"></param><param name="newMetadata">JobTemplates/View/Group/MetaData</param></Params></RegisterGroup></Command></DeviceInformationModel>"""

    # 4. Clear Template Metadata in Group
    act_4 = "ClearTemplate_Metadata"
    xml_4 = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel>{auth_xml_block}<SetValue><JobTemplates><View><Template><OriginalKey>Queues/Scan</OriginalKey><MetaData><caption1></caption1><caption2></caption2><userName></userName><isPasswordProtected>false</isPasswordProtected><autoStart>false</autoStart></MetaData><Params><saveFileName nameFormat="standard-date"></saveFileName></Params></Template></View></JobTemplates></SetValue><Command><RegisterTemplate><commandNode>JobTemplates/GroupList/Group/TemplateList/Template</commandNode><Params><param name="selectedTemplate">{parsed_template}</param><param name="selectedGroup">{parsed_group}</param><param name="newTemplatePassword"></param><param name="inputGroupPassword"></param><param name="newMetadata">JobTemplates/View/Template/MetaData</param><param name="newParamsData">JobTemplates/View/Template/Params</param><param name="originalKey">Queues/Scan</param></Params></RegisterTemplate></Command></DeviceInformationModel>"""

    all_payloads = [
        (act_1, xml_1),
        (act_2, xml_2),
        (act_3, xml_3),
        (act_4, xml_4),
    ]

    for act_name, xml_data in all_payloads:
        try:
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
            r_del = session.post(f"{working_base_url}/contentwebserver", data=xml_data.encode('utf-8'), headers=headers, verify=False, timeout=6)
            resp_text = r_del.text.strip()
            resp_snippet = resp_text[:180].replace(chr(10), " ").replace(chr(13), " ")
            log_msg = f"Act={act_name} => HTTP {r_del.status_code}: {resp_snippet}"
            print(f"  -> {log_msg}")
            del_history.append(log_msg)

            has_error = "MODULE_ERROR:" in resp_text or "STATUS_FAILED" in resp_text
            has_ok = r_del.status_code == 200 and ("STATUS_OK" in resp_text or "<DeleteGroupResult>Success</DeleteGroupResult>" in resp_text or "<DeleteTemplateResult>Success</DeleteTemplateResult>" in resp_text or ("<DeviceInformationModel>" in resp_text and not has_error))

            if has_ok:
                print(f"  [OK] DA THUC HIEN THANH CONG VIA {act_name}!")
                reset_ok = True
        except Exception as e:
            print(f"  [!] Loi gui XML {act_name}: {e}")

    # Step 3.5: Fetch GetTemplateList to verify
    print("")
    print(f"  -> Dang kiem tra TemplateList trong Group {parsed_group}...")
    get_templates_xml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>{parsed_group}</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>false</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"""
    try:
        r_tmpl = session.post(f"{working_base_url}/contentwebserver", data=get_templates_xml.encode('utf-8'), headers=headers, verify=False, timeout=6)
        print(f"  -> GetTemplateList HTTP {r_tmpl.status_code}, len={len(r_tmpl.text)}")
        if r_tmpl.status_code == 200:
            if 'valid="true"' not in r_tmpl.text:
                reset_ok = True
                print(f"  [✓] XAC MINH TRUC TIEP: Group {parsed_group} khong con chua bat ky Template hop le nao!")
            else:
                m_c2 = re.findall(r"<caption2>([^<]*)</caption2>", r_tmpl.text)
                print(f"  -> Template Captions hien tai trong Group {parsed_group}: {m_c2[:5]}")
    except Exception as v_exc:
        print(f"  [!] Verification fetch exc: {v_exc}")

    logout_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>"""
    try:
        session.post(f"{working_base_url}/contentwebserver", data=logout_xml.encode('utf-8'), headers=headers, verify=False, timeout=3)
        print("  [✓] Đã gửi lệnh Logout để TopAccess LƯU CẬP NHẬT DATABASE!")
    except Exception:
        pass

    import time
    print('  -> Chờ 2 giây để máy photo Toshiba hoàn tất lưu database...')
    time.sleep(2)

    # Step 3.6: Auto-refresh & post updated address book by running GetGroupList XML (toshiba_list.py logic)
    print("  -> Đang tự động quét lại XML GetGroupList và đồng bộ danh bạ về Server VPS...")
    try:
        try:
            local_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_ip = "127.0.0.1"
        ftp_port = "2130"

        get_groups_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><GetValue><JobTemplates><View><GroupList/></View></JobTemplates></GetValue><Command><GetGroupList><commandNode>JobTemplates/GroupList</commandNode><Params><param name='viewXpath'>JobTemplates/View/GroupList</param><param name='currentPage'>1</param><param name='pageSize'>200</param><param name='definedGroups'>true</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetGroupList></Command></DeviceInformationModel>"""
        headers['Content-Type'] = 'text/plain; charset=utf-8'
        r_groups = session.post(f"{working_base_url}/contentwebserver", data=get_groups_xml.encode('utf-8'), headers=headers, verify=False, timeout=10)
        
        entries = []
        if r_groups.status_code == 200:
            root = ET.fromstring(r_groups.text)
            for g in root.findall(".//Group"):
                id_node = g.find("groupID")
                gid = id_node.text.strip() if id_node is not None and id_node.text else ""
                group_name_node = g.find(".//groupName")
                group_name = group_name_node.text.strip() if group_name_node is not None and group_name_node.text else ""
                if gid and group_name and group_name != 'Undefined' and group_name != 'Useful Template':
                    entries.append({
                        "entry_id": gid,
                        "name": group_name,
                        "registration_no": gid,
                        "email_address": f"{group_name}@scan.local",
                        "folder_path": f"ftp://{local_ip}:{ftp_port}/{group_name}/",
                        "physical_path": f"ftp://{local_ip}:{ftp_port}/{group_name}/",
                        "protocol": "FTP",
                        "server_host": local_ip,
                        "folder_port_no": ftp_port,
                        "path_on_folder": f"/{group_name}/"
                    })

        print(f"  [+] Đếm danh bạ mới: Còn lại {len(entries)} điểm scan hợp lệ.")
        addr_list = [{
            "name": "Summary", "registration_no": "-", "email_address": "", "folder_path": "",
            "entry_id": "", "physical_path": "", "protocol": "", "server_host": "",
            "folder_port_no": "", "path_on_folder": ""
        }] + entries

        final_result = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "address_list": addr_list
        }

        if globals().get("bridge"):
            try:
                b_inst = globals()["bridge"]
                real_mac = ""
                try:
                    local_printers = b_inst._load_local_printers_json() or []
                    for p_item in local_printers:
                        p_item_ip = str(p_item.get("ip") or "").strip()
                        if p_item_ip == ip or (ip and ip in p_item_ip):
                            real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                            break
                except Exception: pass

                try:
                    from agent.models import Printer as AgentPrinter
                    p_obj = AgentPrinter(ip=ip, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")
                except Exception:
                    from types import SimpleNamespace
                    p_obj = SimpleNamespace(ip=ip, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")

                if hasattr(b_inst, "_post_address_book_sync_data"):
                    b_inst._post_address_book_sync_data(p_obj, final_result)
                    print(f"  [✓] ĐÃ CẬP NHẬT VÀ ĐỒNG BỘ DANH BẠ MOI NHAT ({len(entries)} ENTRIES) VE SERVER THANH CONG!")
            except Exception:
                pass

        if globals().get("context"):
            globals()["context"]["address_book_data"] = final_result
            globals()["context"]["result_payload"] = json.dumps(final_result, ensure_ascii=False)
    except Exception as fetch_err:
        print(f"  [!] Lỗi cập nhật danh bạ XML: {fetch_err}")

    if not reset_ok:
        err_details = chr(10).join(del_history[-6:])
        raise RuntimeError(f"XOA/RESET THAT BAI: Da dang nhap OK nhung Toshiba tu choi xoa/reset ID '{target_id}'. Nhat ky:{chr(10)}{err_details}")

    if not reset_ok:
        err_details = chr(10).join(del_history[-6:])
        raise RuntimeError(f"XOA/RESET THAT BAI: Da dang nhap OK nhung Toshiba tu choi xoa/reset ID '{target_id}'. Nhat ky:{chr(10)}{err_details}")

    print("")
    print(f"[4/4] XÁC MINH THÀNH CÔNG: Đã xóa/reset điểm scan ID '{target_id}' trên máy in Toshiba {ip}.")
    if 'final_result' in locals() and final_result:
        print(json.dumps(final_result, ensure_ascii=False))

if globals().get('context') and isinstance(globals()['context'], dict):
    ctx = globals()['context']
    if ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip'):
        IP = str(ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip')).strip()
    if ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user'):
        USER = str(ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user')).strip()
    if ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass'):
        PASSWORD = str(ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass')).strip()
    if ctx.get('target_id') or ctx.get('entry_id') or ctx.get('registration_no'):
        TARGET_ID = str(ctx.get('target_id') or ctx.get('entry_id') or ctx.get('registration_no')).strip()

try:
    reset_single_toshiba_template(IP, USER, PASSWORD, TARGET_ID)
except Exception as err:
    print("")
    print(f"[-] LOI THUC THI: {err}")
    print("==================================================")
    sys.exit(1)
print("==================================================")
`,toshiba_list_scan:`import requests
import urllib3
import re
import sys
import json
import socket
import xml.etree.ElementTree as ET
from datetime import datetime

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"

print("==================================================")
print(f"  [TOSHIBA EXEC] QUÉT DANH SÁCH GROUP SCAN - IP: {IP}")
print("==================================================")
print(f"[1/3] Khởi tạo kết nối: IP={IP}, USER={USER}")

def test_toshiba():
    import time
    print('  -> Chờ 3 giây để máy photo Toshiba cập nhật hoàn tất bộ nhớ database...')
    time.sleep(3)
    session = requests.Session()
    try:
        session.get(f"http://{IP}/?MAIN=TOPACCESS", timeout=5)
    except Exception as e:
        raise RuntimeError(f"Kết nối tới Toshiba {IP} thất bại: {e}")

    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue><Authentication><UserCredential><userName>{USER or "admin"}</userName><passwd>{PASSWORD}</passwd><ipaddress>127.0.0.1</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue>
<Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command>
</DeviceInformationModel>"""

    headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'Referer': f'http://{IP}/TopAccessLogin.html',
        'User-Agent': 'Mozilla/5.0'
    }
    cookie = session.cookies.get("Session")
    if cookie: headers['csrfpId'] = cookie

    print("[2/3] Đăng nhập TopAccess Web Service...")
    try:
        session.post(f"http://{IP}/contentwebserver", data=login_xml.encode('utf-8'), headers=headers, timeout=5)
        print("  [✓] Đăng nhập OK.")
    except Exception as e:
        raise RuntimeError(f"Đăng nhập Toshiba thất bại: {e}")

    new_cookie = session.cookies.get("Session")
    if new_cookie: headers['csrfpId'] = new_cookie

    print("[3/3] Truy vấn danh sách Group List...")
    get_groups_xml = """<DeviceInformationModel><GetValue><JobTemplates><View><GroupList/></View></JobTemplates></GetValue><Command><GetGroupList><commandNode>JobTemplates/GroupList</commandNode><Params><param name='viewXpath'>JobTemplates/View/GroupList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedGroups'>true</param><param name='locale'>en_GB</param></Params></GetGroupList></Command></DeviceInformationModel>"""

    try:
        r3 = session.post(f"http://{IP}/contentwebserver", data=get_groups_xml.encode('utf-8'), headers=headers, timeout=5)
        try:
            local_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_ip = "127.0.0.1"
        ftp_port = "2130"

        print("")
        print("--- CÁC GROUP SCAN ĐANG ĐƯỢC SỬ DỤNG ---")
        entries = []
        try:
            root = ET.fromstring(r3.text)
            groups = root.findall(".//Group")
            valid_count = 0
            for g in groups:
                gid = g.get('gid')
                group_name_node = g.find(".//groupName")
                group_name = group_name_node.text if group_name_node is not None else None
                if group_name and group_name.strip() and group_name.strip() != 'Undefined':
                    print(f"  [+] Group ID: {gid} | Tên Group: {group_name}")
                    valid_count += 1
                    if group_name.strip() != 'Useful Template':
                        entries.append({
                            "entry_id": gid,
                            "name": group_name.strip(),
                            "registration_no": gid,
                            "email_address": f"{group_name.strip()}@scan.local",
                            "folder": f"ftp://{local_ip}:{ftp_port}/{group_name.strip()}/",
                            "folder_path": f"ftp://{local_ip}:{ftp_port}/{group_name.strip()}/",
                            "physical_path": f"ftp://{local_ip}:{ftp_port}/{group_name.strip()}/",
                            "protocol": "FTP",
                            "server_host": local_ip,
                            "folder_port_no": ftp_port,
                            "path_on_folder": f"/{group_name.strip()}/"
                        })
            print(f"-> Tổng cộng: {valid_count} Groups hợp lệ.")
            
            summary_name = f"Users: {len(entries)}, Groups: 0, User Codes: 0"
            addr_list = [{
                "type": "Summary", "registration_no": "-", "name": summary_name,
                "user_code": "-", "date_last_used": "-", "email_address": "-", "folder": "-",
                "entry_id": "", "physical_path": "", "protocol": "", "server_host": "",
                "folder_port_no": "", "path_on_folder": ""
            }] + entries

            final_result = {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "address_list": addr_list
            }

            bridge_obj = globals().get('bridge') or locals().get('bridge')
            if bridge_obj:
                try:
                    real_mac = ""
                    try:
                        local_printers = bridge_obj._load_local_printers_json() or []
                        for p_item in local_printers:
                            p_item_ip = str(p_item.get("ip") or "").strip()
                            if p_item_ip == IP or (IP and IP in p_item_ip):
                                real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                                break
                    except Exception: pass

                    try:
                        from agent.models import Printer as AgentPrinter
                        p = AgentPrinter(ip=IP, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")
                    except Exception:
                        from types import SimpleNamespace
                        p = SimpleNamespace(ip=IP, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")

                    bridge_obj._post_address_book_sync_data(p, final_result)
                    print(f"  [✓] TỰ ĐỘNG ĐỒNG BỘ DANH BẠ MỚI NHẤT ({len(entries)} GROUPS) VỀ SERVER THANH CONG!")
                except Exception as sync_err:
                    print(f"  [!] Sync post warning: {sync_err}")

            res_str = json.dumps(final_result, ensure_ascii=False)
            if globals().get('context'):
                globals()['context']['result_payload'] = res_str
                globals()['context']['address_book_data'] = final_result
        except Exception as e:
            raise RuntimeError(f"Parse XML kết quả Toshiba thất bại: {e}")
    except Exception as e:
        raise RuntimeError(f"Gọi API GetGroupList thất bại: {e}")

try:
    test_toshiba()
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI: {err}")
    print("==================================================")
    sys.exit(1)
print("==================================================")
`,toshiba_change_scan:`import requests
import socket
import re
import sys
import json
import time
import urllib3
import xml.etree.ElementTree as ET
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Config parameters as requested
IP = "192.168.1.156"
USER = "admin"
PASSWORD = "123456"
TARGET_ID = "005"
OLD_IP = "192.168.1.43"
NEW_IP = "192.168.1.999"
NAME = "buu"

def get_local_ip(target_ip):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((target_ip, 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

SECURE_PDF_BLOCK = """<SecurePDF><Enabled>false</Enabled><EncryptionLevel>40bitRC4</EncryptionLevel><DocumentOpenPassword/><Permissions><Enabled>false</Enabled><PermissionsPassword/><PrintAuthority>Disable</PrintAuthority><EditAuthority>Disable</EditAuthority><Accessibility>false</Accessibility><CopyAuthority>false</CopyAuthority></Permissions></SecurePDF>"""

def build_register_template_xml(scan_username, new_target_ip, ftp_port, ftp_user, ftp_password, template_slot, group_slot):
    sp = SECURE_PDF_BLOCK
    
    scan_xml = (
        f"<ColorParameter><ColorMode>Monochrome</ColorMode></ColorParameter>"
        f"<ImageAdjustmentParameter>"
        f"<ImageMode>Text</ImageMode><ImageQuality>Middle</ImageQuality><ImageRotate>0</ImageRotate>"
        f"<Exposure><ExposureMode>Auto</ExposureMode><ExposureLevel>0</ExposureLevel></Exposure>"
        f"<BackgroundAdjustment>0</BackgroundAdjustment>"
        f"<Contrast>0</Contrast>"
        f"<Sharpness>0</Sharpness>"
        f"<Saturation>0</Saturation>"
        f"<RGBAdjustment><Red>0</Red><Green>0</Green><Blue>0</Blue></RGBAdjustment>"
        f"</ImageAdjustmentParameter>"
        f"<Scan Enabled='true'><ScanParameter>"
        f"<DuplexMode>Simplex</DuplexMode>"
        f"<Resolution>200</Resolution>"
        f"<OriginalSizeInformation><OriginalSize>Undefined</OriginalSize></OriginalSizeInformation>"
        f"<AutoOriginalDetectionMode>true</AutoOriginalDetectionMode>"
        f"<MixedOriginalSizes>false</MixedOriginalSizes>"
        f"<OmitBlankPage><Enabled>false</Enabled></OmitBlankPage>"
        f"<OutSideErase><Enabled>false</Enabled><DetectExposureLevel></DetectExposureLevel></OutSideErase>"
        f"<DropOutColor><Enabled>false</Enabled><RangeAdjustment>0</RangeAdjustment></DropOutColor>"
        f"<NoiseReduction>Disable</NoiseReduction>"
        f"<FoldingOriginal><Scan>false</Scan></FoldingOriginal>"
        f"</ScanParameter>"
        f"<Output>"
        f"<Preview Enabled='false'></Preview>"
        f"<FTPStore Index='1' Enabled='true'><FTPStoreParameter>"
        f"<FileFormatInformation><FileFormat>PDFMulti</FileFormat>{sp}</FileFormatInformation>"
        f"<ServerName>{new_target_ip}</ServerName>"
        f"<CommandPort>{ftp_port}</CommandPort>"
        f"<StorePath>{scan_username}</StorePath>"
        f"<UserName>{ftp_user}</UserName>"
        f"<Password>{ftp_password}</Password>"
        f"<SSL>false</SSL>"
        f"</FTPStoreParameter></FTPStore>"
        f"</Output></Scan>"
    )
    
    set_value_1 = (
        f"<JobTemplates><View><New><Template>"
        f"<OriginalKey>Queues/Scan</OriginalKey>"
        f"<MetaData>"
        f"<caption1>Scan To</caption1>"
        f"<caption2>File</caption2>"
        f"<userName></userName>"
        f"<isPasswordProtected>false</isPasswordProtected>"
        f"<autoStart>false</autoStart>"
        f"<NotificationSettings>"
        f"<email Enabled='false'></email>"
        f"<onJobCompletion>false</onJobCompletion>"
        f"<onError>false</onError>"
        f"</NotificationSettings>"
        f"<type>Normal</type>"
        f"</MetaData>"
        f"<Params><saveFileName nameFormat='standard-date'>DOCMMDDYY</saveFileName></Params>"
        f"</Template></New></View></JobTemplates>"
    )
    
    set_value_2 = (
        f"<Queues><Scan><WorkflowExecutionParameter>"
        f"<WorkflowPolicy></WorkflowPolicy>"
        f"{scan_xml}"
        f"</WorkflowExecutionParameter></Scan></Queues>"
    )
    
    cmd = (
        f"<RegisterTemplate>"
        f"<commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>"
        f"<Params>"
        f"<param name='selectedGroup'>{group_slot}</param>"
        f"<param name='selectedTemplate'>{template_slot}</param>"
        f"<param name='newMetadata'>JobTemplates/View/New/Template/MetaData</param>"
        f"<param name='originalKey'>Queues/Scan</param>"
        f"<param name='newParamsData'>JobTemplates/View/New/Template/Params</param>"
        f"<param name='newTemplatePassword'></param>"
        f"</Params>"
        f"</RegisterTemplate>"
    )
    
    return (
        f"<?xml version='1.0' encoding='UTF-8'?>"
        f"<DeviceInformationModel>"
        f"<SetValue>{set_value_1}</SetValue>"
        f"<SetValue>{set_value_2}</SetValue>"
        f"<Command>{cmd}</Command>"
        f"</DeviceInformationModel>"
    )

def main():
    print("==================================================")
    print(f"  [TOSHIBA STANDALONE CHANGE SCAN] IP: {IP}")
    print("==================================================")
    print(f"[STEP 1] THAM SỐ ĐẦU VÀO:")
    print(f"  - Máy in (Printer IP) : {IP}")
    print(f"  - Admin User          : {USER}")
    print(f"  - Admin Password      : {'*' * len(PASSWORD)}")
    print(f"  - Template Target ID  : {TARGET_ID}")
    print(f"  - Đường dẫn cũ (OLD)  : \\\\\\\\{OLD_IP}\\\\{NAME}\\\\")
    print(f"  - Đường dẫn mới (NEW) : \\\\\\\\{NEW_IP}\\\\{NAME}\\\\")
    print("")

    target_slot = TARGET_ID.zfill(3)
    group_slot = target_slot
    template_slot = target_slot

    session = requests.Session()
    origin = f"http://{IP}"
    landing = f"{origin}/?MAIN=TOPACCESS"
    cgi = f"{origin}/contentwebserver"

    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ToshibaTopAccessClient/1.0",
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Referer": landing
    })
    session.cookies.set("pageTrack", "MAIN=TOPACCESS")

    # STEP 2: LANDING & CSRF EXTRACTION
    print(f"[STEP 2] TRUY CẬP LANDING PAGE TOPACCESS ({landing})...")
    try:
        r_landing = session.get(landing, verify=False, timeout=5)
        print(f"  -> HTTP Landing Status: {r_landing.status_code}")
    except Exception as e:
        print(f"  [!] LỖI KẾT NỐI MÁY IN {IP}: {e}")
        return

    csrf_token = session.cookies.get("Session") or ""
    if not csrf_token:
        print("  [!] LỖI: Không trích xuất được Session/CSRF cookie từ landing page!")
        return
    print(f"  [✓] CSRF Token Extracted: {csrf_token}")

    headers = {
        "Content-Type": "text/plain; charset=utf-8",
        "csrfpId": csrf_token
    }

    # STEP 3: LOGIN TOPACCESS
    print(f"\\n[STEP 3] ĐĂNG NHẬP (LOGIN) VÀO TOSHIBA TOPACCESS VỚI USER '{USER}'...")
    local_client_ip = get_local_ip(IP)
    login_xml = (
        f"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>"
        f"<DeviceInformationModel><SetValue><Authentication><UserCredential>"
        f"<userName>{USER}</userName><passwd>{PASSWORD}</passwd><ipaddress>{local_client_ip}</ipaddress>"
        f"<applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue>"
        f"<Command><Login><commandNode>Authentication/UserCredential</commandNode>"
        f"<Params><appName>TOPACCESS</appName></Params></Login></Command></DeviceInformationModel>"
    )

    try:
        r_login = session.post(cgi, data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
        print(f"  -> HTTP Login Status: {r_login.status_code}")
        print(f"  -> Response Snippet: {r_login.text[:300].strip()}")

        if "STATUS_OK" not in r_login.text and "Success" not in r_login.text:
            print(f"  [!] ĐĂNG NHẬP THẤT BẠI: {r_login.text[:200]}")
            return
        print(f"  [✓] ĐĂNG NHẬP THÀNH CÔNG (LOGIN OK)!")
    except Exception as login_exc:
        print(f"  [!] LỖI TRONG QUÁ TRÌNH LOGIN: {login_exc}")
        return

    # Refresh CSRF
    csrf_token = session.cookies.get("Session") or csrf_token
    headers["csrfpId"] = csrf_token

    # STEP 4: PREPARE AND BUILD CHANGE XML
    print(f"\\n[STEP 4] CẬP NHẬT CẤU HÌNH TEMPLATE {target_slot} (ĐỔI SANG IP MỚI '{NEW_IP}')...")
    update_xml = build_register_template_xml(
        scan_username=NAME,
        new_target_ip=NEW_IP,
        ftp_port="2130",
        ftp_user="goxprint",
        ftp_password="goxprint",
        template_slot=template_slot,
        group_slot=group_slot
    )

    print(f"  -> Target Group Slot   : {group_slot}")
    print(f"  -> Target Template Slot: {template_slot}")
    print(f"  -> Target ServerName   : {NEW_IP}")
    print(f"  -> Target Folder Path  : \\\\\\\\{NEW_IP}\\\\{NAME}\\\\")

    # STEP 5: SUBMIT REGISTER / CHANGE TEMPLATE POST
    print(f"\\n[STEP 5] GỬI LỆNH CẬP NHẬT (POST REGISTER TEMPLATE) TỚI TOSHIBA TOPACCESS...")
    operation_success = False
    try:
        r_update = session.post(cgi, data=update_xml.encode("utf-8"), headers=headers, verify=False, timeout=12)
        print(f"  -> HTTP Response Code: {r_update.status_code}")
        print(f"  -> Response Payload  : {r_update.text[:400].strip()}")

        if "STATUS_OK" in r_update.text or "Success" in r_update.text:
            operation_success = True
            print(f"  [✓] CẬP NHẬT THÀNH CÔNG (UPDATE SUCCESSFUL)!")
            print(f"      Đã đổi đường dẫn Scan cho ID {target_slot} từ \\\\\\\\{OLD_IP}\\\\{NAME}\\\\ ➔ \\\\\\\\{NEW_IP}\\\\{NAME}\\\\")
        else:
            m = re.search(r'<statusOfOperation>([^<]+)</statusOfOperation>', r_update.text)
            err_msg = m.group(1) if m else r_update.text[:200]
            print(f"  [!] LỖI CẬP NHẬT TEMPLATE: {err_msg}")
    except Exception as update_exc:
        print(f"  [!] LỖI GỬI LỆNH UPDATE: {update_exc}")

    # STEP 6: LOGOUT TOPACCESS
    print(f"\\n[STEP 6] ĐĂNG XUẤT (LOGOUT) KHỎI TOSHIBA TOPACCESS...")
    logout_xml = (
        f"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>"
        f"<DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode>"
        f"</Logout></Command></DeviceInformationModel>"
    )
    try:
        r_logout = session.post(cgi, data=logout_xml.encode("utf-8"), headers=headers, verify=False, timeout=5)
        print(f"  -> HTTP Logout Status: {r_logout.status_code}")
        print(f"  [✓] ĐĂNG XUẤT THÀNH CÔNG (LOGOUT OK)!")
    except Exception as logout_exc:
        print(f"  [!] Lỗi khi gửi lệnh Logout: {logout_exc}")
    finally:
        session.close()

    print("\\n==================================================")
    if operation_success:
        print(f"  [KẾT QUẢ] THÀNH CÔNG HOÀN HẢO CHUYỂN IP POINT ID {target_slot} -> {NEW_IP}")
    else:
        print(f"  [KẾT QUẢ] THẤT BẠI KHI CẬP NHẬT ID {target_slot}")
    print("==================================================")

if __name__ == "__main__":
    main()
`},Xn="https://agentapi.quanlymay.com";function Qn(a,w,A){const b=a.email_address||a.email||"",Y=a.physical_path||a.folder||a.folder_path||"",J=(b||Y||"").trim();if(!J)return{label:"UNKNOWN",type:"error",title:""};if(a.type==="Email"||b.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const se=(w||[]).find(x=>(x.email||"").toLowerCase().trim()===J.toLowerCase().trim()),me=se?se.email_number:Number(a.registration_no);if(!me||isNaN(me))return{label:"✔ ACTIVE",type:"success",title:""};const Ae=(A||[]).find(x=>x.is_master&&x.is_agent_active)||(A||[]).find(x=>x.is_agent_active)||(A||[])[0];if(Ae){const x=(Ae.ftp_sites||[]).find(ue=>Number(ue.port)===Number(me));if(x){const ue=("C:/Scangox/"+J).toLowerCase().replace(/\\/g,"/"),N=(x.path||"").toLowerCase().replace(/\\/g,"/")===ue;return x.running&&N?{label:"✔ OK",type:"success",title:""}:x.running&&!N?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${x.path} instead of expected: C:/Scangox/${J}`}:x.error&&(x.error.toLowerCase().includes("in use")||x.error.toLowerCase().includes("busy")||x.error.toLowerCase().includes("already bound")||x.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:x.error}:{label:"❌ FAILED",type:"error",title:x.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}const Yn=(a={})=>{const{activeAgentUid:w,cameras:A,copierCredentials:b={},deleteScanPointModal:Y,editIpModalData:J,fetchLanSitesData:be,getTargetAgentUid:se,handleRefetchAddressBook:me,isDuplicatePending:Ae,lanSites:x=[],pollCommandStatus:ue,queryDuration:ae,queryTimestamp:N,replaceToast:he,saveScanPointToDb:fe,selectedCamera:Qe,selectedLan:U,setActiveModal:T,setDeleteScanPointModal:we,setEditIpModalData:te,setInstallDriverModal:Ge,setLiveAddressBooks:dt,setQueriedVideoUrl:Je,setQueryDuration:pt,setQueryTimestamp:_e,setQueryVideoLoading:xe,setStorageFiles:oe,setStorageLoading:ye,setStorageModalData:Re,showToast:K,utilityCommands:Ye=[],detectBrand:Ke}=a,He=async(E,j,G,q)=>{var C;const $=G||N,W=q||ae;if(!$)return;const z=((C=A.find(Z=>Z.id===j))==null?void 0:C.name)||"";if(await Ae(E,"trigger_utility",{action:"query_camera_video",camera_name:z,timestamp:$,duration:W})){K("Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!","info");return}xe(!0),Je("");try{const D=await(await fetch(`${Xn}/api/agents/${E}/cameras/${j}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:$,duration:W})})).json();if(D.ok){const S=$.replace(/[- :]/g,""),_=S.substring(0,8)+"_"+S.substring(8,14);Je(`clip_${Qe.camera_name}_${_}.mp4`)}else K("Không truy xuất được video: "+D.error,"error")}catch(Z){K("Lỗi kết nối render: "+Z.message,"error")}finally{xe(!1)}};return{executeRemoteInstallDriver:async(E,j,G,q,$,W)=>{const z=`driver-install-progress-${W}`;he(z,`⏳ [${W}] Đang gửi lệnh cài đặt driver...`,"info");try{const f=await On(E,j,G,q,$,W);if(!f.ok)throw new Error(f.error||"Server trả về lỗi");const C=f.command_id;if(!C){he(z,`✅ [${W}] Đã gửi lệnh cài đặt driver.`,"success");return}const Z=3e5,D=2e3,S=Date.now();let _="";const ge=setInterval(async()=>{try{const Te=Date.now()-S;if(Te>Z){clearInterval(ge),he(z,`⏰ [${W}] Quá thời gian chờ (5 phút).`,"info");return}const le=await Ft(C);if(le.status==="success")clearInterval(ge),he(z,`✅ [${W}] Cài đặt driver thành công!`,"success");else if(le.status==="failed"||!le.ok)clearInterval(ge),he(z,`❌ [${W}] Cài driver thất bại: ${le.error||"Lỗi không xác định"}`,"error");else{const ze=le.progress_text||"";if(ze&&ze!==_)_=ze,he(z,`⏳ [${W}] ${ze}`,"info");else if(!ze){const Le=Math.round(Te/1e3);le.received_at?he(z,`⚡ [${W}] Đã nhận lệnh - đang cài đặt... (${Le}s)`,"info"):he(z,`⌛ [${W}] Đang chuyển lệnh tới Agent... (${Le}s)`,"info")}}}catch{}},D)}catch(f){he(z,`❌ Không thể cài driver: ${f.message}`,"error")}},formatBytes:E=>{if(E===0)return"0 Bytes";const j=1024,G=["Bytes","KB","MB","GB"],q=Math.floor(Math.log(E)/Math.log(j));return parseFloat((E/Math.pow(j,q)).toFixed(1))+" "+G[q]},getDestinationStatus:E=>Qn(E,(U==null?void 0:U.emails)||[],(U==null?void 0:U.agents)||[]),handleConfirmDeleteScanPoint:async()=>{var Z;const{printerId:E,entry:j,agentUid:G}=Y;if(!E||!j){K(`Lỗi nội bộ: Không xác định được máy in (ID: ${E}) hoặc điểm scan.`,"error"),we(D=>({...D,isOpen:!1}));return}we(D=>({...D,isOpen:!1}));const q=j.email_address||j.email||"",$=j.physical_path||j.folder||j.folder_path||"",W=(q||$||"").trim(),z=String(j.registration_no&&j.registration_no!=="-"?j.registration_no:j.entry_id||"").trim(),C=((U==null?void 0:U.emails)||[]).find(D=>D.email.toLowerCase().trim()===W.toLowerCase().trim());if(C&&C.id){K("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const D=await Dn(C.id);if(D.ok)K("Đã xóa thành công!","success"),await be();else throw new Error(D.error||"Không thể xóa")}catch(D){K(`Lỗi xóa: ${D.message}`,"error")}return}K("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const S=(x||[]).flatMap(F=>F.printers||[]).find(F=>String(F.id)===String(E)||F.mac_id===E||F.ip===E)||((Z=U==null?void 0:U.printers)==null?void 0:Z[0]),_=((S==null?void 0:S.printer_type)||(S==null?void 0:S.printer_name)||"").toLowerCase(),ge=_.includes("toshiba"),Te=_.includes("xerox")||_.includes("fuji"),le=ge?"toshiba_delete_scan":Te?"xerox_delete_scan":"ricoh_delete_scan",ze=(Ye||[]).find(F=>F.command===le),Le=G||se(E);let tt;if(Le){let F=ze;if(!F)try{F=(await wn(Le)||[]).find(Bt=>Bt.command===le)}catch{}const je=(S==null?void 0:S.ip)||(S==null?void 0:S.printer_ip)||(E.includes(".")?E:""),Ie=(S==null?void 0:S.mac_address)||(S==null?void 0:S.mac_id)||"",B=Ie?String(Ie).toUpperCase().replace(/-/g,":"):"",Se=b[B]||b[E]||{},re=Se.user||(S==null?void 0:S.auth_user),h=Se.pass||(S==null?void 0:S.auth_password)||"";if(!re){K(`Chưa cấu hình tài khoản Web cho máy in ${(S==null?void 0:S.printer_name)||(S==null?void 0:S.name)||"Photocopy"}!`,"error");return}const at=String((j==null?void 0:j.entry_id)||(j==null?void 0:j.id)||z||"").trim()||"null";let ce=(F==null?void 0:F.command_content)||qn[le]||"";if(!ce){K(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${le}' trên hệ thống VPS!`,"error");return}ce=ce.replace(/__TARGET_IP__/g,je||"null"),ce=ce.replace(/__TARGET_USER__/g,re||"admin"),ce=ce.replace(/__TARGET_PASS__/g,h||""),ce=ce.replace(/__TARGET_ID__/g,at),ce=ce.replace(/__TARGET_SCAN_USER__/g,(j==null?void 0:j.name)||"null"),le.includes("toshiba")&&(ce=ce.replace(/timeout=\d+/g,"timeout=25")),tt=await Lt(Le,le,ce,{printer_ip:je,ip:je,auth_user:re,auth_password:h,target_id:at,entry_id:at,registration_no:z})}else tt=await zn(E,z,j.entry_id||"",G||void 0);if(!tt.ok||!tt.command_id)throw new Error(tt.error||"Không thể tạo lệnh xóa");ue(tt.command_id,E,async F=>{K(`Đã xóa đăng ký #${z} thành công!`,"success"),console.log("Finish delete scan point, updating address book state directly",F);const je=(S==null?void 0:S.mac_address)||(S==null?void 0:S.mac_id)||E,Ie=je?String(je).toUpperCase().replace(/-/g,":"):"";let B=(F==null?void 0:F.address_book_sync)||(F==null?void 0:F.address_book_data);if(!B&&(F!=null&&F.result||F!=null&&F.result_payload)){const Se=String(F.result||F.result_payload||"");if(Se.includes("__ADDRESS_BOOK_JSON_START__"))try{let re=Se.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();re=re.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),B=JSON.parse(re)}catch{}}Ie&&B&&dt(Se=>({...Se,[Ie]:B})),me&&me(E),await be(!0)},F=>{K(`Lỗi xóa điểm scan: ${F}`,"error")},`⌛ Đang xóa điểm scan #${z}...`)}catch(D){K(`Lỗi gửi lệnh xóa: ${D.message}`,"error")}},handleDeleteDest:(E,j)=>{var q,$;const G=se(E)||(($=(q=U==null?void 0:U.agents)==null?void 0:q.find(W=>W.is_agent_active))==null?void 0:$.agent_uid)||"";we({isOpen:!0,printerId:E,entry:j,agentUid:G})},handleEditIP:(E,j)=>{const G=j.folder||j.physical_path||j.folder_path||"";let q="",$="2130";const W=G.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),z=G.match(/^\\\\([^\\]+)(.*)$/);if(W)q=W[1],$=W[2]||"2130";else if(z)q=z[1],$="";else{const C=G.match(/^([^:/]+)(?::(\d+))?(.*)$/);C&&!G.startsWith("\\\\")&&(q=C[1],$=C[2]||"2130")}const f=q?$?`${q}:${$}`:q:"192.168.1.100:2130";te({printerId:E,entry:j,currentIp:q,newIp:f,newPort:$||"2130"}),T("edit_ip")},handleOpenStorageFiles:async(E,j)=>{Re({lanUid:E,email:j}),ye(!0),oe([]),T("storage");try{const G=await kn(E,j);if(G.ok)oe(G.rows||[]);else throw new Error(G.error||"Lỗi server")}catch(G){K(`Không thể lấy tệp đã scan: ${G.message}`,"error")}finally{ye(!1)}},handlePlaySegmentFile:E=>{const j=E.match(/_(\d{8}_\d{6})\.mp4$/);if(j){const G=j[1],q=`${G.substring(0,4)}-${G.substring(4,6)}-${G.substring(6,8)} ${G.substring(9,11)}:${G.substring(11,13)}:${G.substring(13,15)}`;_e(q),pt(60),He(w,Qe.id,q,60),setTimeout(()=>{var $;($=document.getElementById("video-playback-card"))==null||$.scrollIntoView({behavior:"smooth",block:"center"})},100)}else K("Không parse được thời gian từ tên tệp","error")},handleQueryVideo:He,handleRemoteInstallDriver:(E,j,G,q,$)=>{var z,f;const W=se(E)||((f=(z=U==null?void 0:U.agents)==null?void 0:z.find(C=>C.is_agent_active))==null?void 0:f.agent_uid)||"";Ge({isOpen:!0,printerId:E,brand:j,model:G,driverName:q,driverUrl:$,selectedAgentUids:W?[W]:[]})},handleSaveEditIP:async()=>{var S;if(!J)return;const{printerId:E,entry:j,newIp:G,newPort:q}=J,$=j.folder||j.physical_path||j.folder_path||"",W=$.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),z=$.match(/^\\\\([^\\]+)(.*)$/);let f=G.trim();if((q||"2130").trim(),f.includes(":")){const _=f.split(":");f=_[0].trim(),_[1].trim()}if(W)W[3];else if(z)z[2];else{const _=$.match(/^([^:/]+)(?::(\d+))?(.*)$/);_&&!$.startsWith("\\\\")&&_[3]}const C=se(E),Z=j.registration_no;T(null),K("Gửi yêu cầu thay đổi IP của điểm scan...","info",3e3);let D="";if(W)D=W[1];else if(z)D=z[1];else{const _=$.match(/^([^:/]+)/);_&&!$.startsWith("\\\\")&&(D=_[1])}D||(D=f);try{const _=(S=U==null?void 0:U.printers)==null?void 0:S.find(B=>B.id===Number(E)),ge=(_==null?void 0:_.mac_address)||(_==null?void 0:_.mac_id)||"",Te=ge?String(ge).toUpperCase().replace(/-/g,":"):"",le=b[Te]||b[E]||{},ze=le.user||(_==null?void 0:_.auth_user)||(_==null?void 0:_.username),Le=le.pass||(_==null?void 0:_.auth_password)||(_==null?void 0:_.password)||"";if(!ze)throw new Error(`Chưa cấu hình tài khoản Web cho máy in ${(_==null?void 0:_.printer_name)||(_==null?void 0:_.name)||"Photocopy"}!`);const F=(Ke?Ke((_==null?void 0:_.printer_name)||(_==null?void 0:_.name)||""):"ricoh")==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp";let je="";try{const Se=(await wn(C)||[]).find(re=>re.command===F);Se&&(je=Se.command_content)}catch(B){console.warn("Could not fetch command content for change ftp",B)}F.includes("toshiba")&&je&&(je=je.replace(/timeout=\d+/g,"timeout=25"));const Ie=await Lt(C,F,je,{printer_ip:(_==null?void 0:_.ip)||"",auth_user:ze,auth_password:Le,target_id:Z,target_name:j.name,old_ip:D,new_ip:f});if(!Ie.ok||!Ie.command_id)throw new Error(Ie.error||"Không thể gửi lệnh thay đổi FTP");ue(Ie.command_id,E,async B=>{K(`Đã thay đổi IP điểm scan #${Z} thành công!`,"success");const Se=(_==null?void 0:_.mac_address)||(_==null?void 0:_.mac_id)||E,re=Se?String(Se).toUpperCase().replace(/-/g,":"):"";let h=(B==null?void 0:B.address_book_sync)||(B==null?void 0:B.address_book_data);if(!h&&(B!=null&&B.result||B!=null&&B.result_payload)){const at=String(B.result||B.result_payload||"");if(at.includes("__ADDRESS_BOOK_JSON_START__"))try{let ce=at.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();ce=ce.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),h=JSON.parse(ce)}catch{}}re&&h&&dt(at=>({...at,[re]:h})),me&&me(E),await be(!0)},B=>{K(`Lỗi thay đổi IP: ${B}`,"error")},`⌛ Đang cập nhật IP điểm scan #${Z}...`)}catch(_){K(`Lỗi gửi lệnh thay đổi IP: ${_.message}`,"error")}}}};function Zn(){const a=Jn({}),w=Kn(a),A=Yn({...a,...w});return{...a,...w,...A}}function ni(){var ae;const a=Zn(),{toasts:w=[],lanSitesLoading:A,lanSites:b=[],selectedLanUid:Y,setSelectedLanUid:J,activeTab:be,setActiveTab:se,selectedLan:me,triggerLanScan:Ae,filteredPrinters:x,fetchLanSitesData:ue}=a;return e.jsxs(st.div,{style:n.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:n.toastContainer,children:e.jsx(wt,{children:w.map(N=>e.jsxs(st.div,{style:{...n.toast,borderLeft:`4px solid ${N.type==="success"?"var(--color-success)":N.type==="error"?"var(--color-error)":"var(--color-primary)"}`},initial:{opacity:0,x:50,scale:.9},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:50,scale:.9},children:[e.jsx("span",{style:n.toastIcon,children:N.type==="success"?"✔️":N.type==="error"?"❌":"ℹ️"}),e.jsx("div",{style:{flex:1,fontSize:"0.8rem"},children:N.message})]},N.id))})}),e.jsxs("div",{style:n.fixedHeader,children:[e.jsxs("div",{style:n.header,children:[e.jsx("h1",{style:n.title,children:"🛠️ Quản lý Mạng LAN"}),e.jsx("button",{style:{...n.smallBtn,borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>ue(!0),children:"🔄 Làm mới"})]}),e.jsxs("div",{style:n.filterBar,children:[e.jsx("label",{style:n.filterLabel,children:"Mạng LAN hiện tại:"}),A&&b.length===0?e.jsx(_t,{size:"sm"}):e.jsx("select",{value:Y,onChange:N=>{J(N.target.value),localStorage.setItem("goxprint_selected_lan_uid",N.target.value)},style:n.lanSelect,children:b.map(N=>{var he;return e.jsxs("option",{value:N.lan_uid,children:[N.lan_name||N.lan_uid," (",N.active_agents," Agent - ",((he=N.printers)==null?void 0:he.filter(fe=>fe.is_online).length)??0," máy Photo)"]},N.lan_uid)})})]}),e.jsxs("div",{style:n.tabBar,children:[e.jsxs("button",{style:{...n.tabBtn,color:be==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:be==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>se("agents"),children:["💻 Máy tính (",((ae=me==null?void 0:me.agents)==null?void 0:ae.filter(N=>N.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...n.tabBtn,color:be==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:be==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{se("copiers"),Ae(me)},children:["🖨️ Photocopy (",x.length,")"]})]})]}),e.jsxs("div",{style:n.scrollableContent,children:[A&&e.jsx("div",{style:n.loadingWrapper,children:e.jsx(_t,{size:"md"})}),!A&&me&&e.jsxs(wt,{mode:"wait",children:[be==="agents"&&e.jsx(Wn,{...a}),be==="copiers"&&e.jsx($n,{...a})]})]}),e.jsx(Vn,{...a})]})}export{ni as AgentPage,ni as default};
