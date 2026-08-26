import{j as e,R as Pt,A as et,m as Ke,L as Qe,r as j}from"./index-DkBnhApl.js";import{A as Ir}from"./AnimatedList-BcnJamEY.js";import{G as Er}from"./GlowCard-CSSUMJeE.js";const t={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"176px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},lanSelect:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",cursor:"pointer",width:"100%"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",left:"12px",right:"12px",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",maxWidth:"404px",marginLeft:"auto",marginRight:"auto",pointerEvents:"none"},toast:{background:"rgba(18, 18, 26, 0.95)",backdropFilter:"blur(10px)",borderRadius:"8px",padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:"10px",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",pointerEvents:"auto"},toastIcon:{fontSize:"0.9rem",flexShrink:0},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},ue={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},credsInputRow:{display:"flex",gap:"6px"},credsInput:{fontSize:"0.8rem",padding:"6px 8px",background:"var(--color-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",flex:1,minWidth:0},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},expandSubBtn:{fontSize:"0.72rem",color:"var(--color-primary)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"block"},suggestedDriverBlock:{padding:"8px",background:"var(--color-inset-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",display:"flex",flexDirection:"column",gap:"6px"},driverSuggestionItem:{background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden"},driverModelHeader:{padding:"6px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255,255,255,0.02)"},driverOptionsList:{padding:"6px",borderTop:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},driverFileRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",background:"var(--color-inset-bg)",borderRadius:"4px",gap:"6px"},driverFileName:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},driverFileUrl:{fontSize:"0.62rem",color:"var(--color-text-secondary)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function An({hasAddressList:n,sync:i,p:v,commandStatus:f,getDestinationStatus:B,selectedLan:G,handleOpenStorageFiles:ne,handleDeleteDest:ie,handleChangeFtp:me,handleEditIP:re}){return e.jsxs("div",{style:ue.destinationsBlock,children:[e.jsx("span",{style:ue.destBlockTitle,children:"📂 Danh sách điểm scan:"}),n?i.address_list.filter(h=>{if(!h||typeof h!="object"||h.type==="Summary")return!1;const P=(h.name||"").trim();return P==="Summary"||P==="Total"||P.startsWith("Users:")?!1:!!(P||h.entry_id||h.registration_no&&h.registration_no!=="-"||h.email_address||h.email||h.folder||h.physical_path)}).map((h,P)=>{var N,ae;const Z=h.email_address||h.email||"",T=h.physical_path||h.folder||h.folder_path||"",fe=(Z||T||"").trim();let F="Folder";T.startsWith("ftp://")?F="FTP":T.startsWith("\\\\")?F="SMB":(Z||Z.includes("@"))&&(F="Email"),typeof B=="function"&&B(h);const x=h.registration_no&&h.registration_no!=="-"?h.registration_no:h.entry_id||P+1,M=`${v.id}-${x}`,m=((N=f[M])==null?void 0:N.isPending)||!1;return(ae=f[M])!=null&&ae.message,e.jsxs("div",{style:{...ue.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",x]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[h.name,(h.warning||h.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:h.warning||h.error,children:"⚠️"})]}),typeof h.file_count=="number"&&e.jsxs("span",{onClick:()=>ne(G.lan_uid,fe),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",h.file_count," files"]}),h.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:h.entry_id})]}),me&&(F==="FTP"||F==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:m?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:m?.5:1,minWidth:"24px"},onClick:()=>re&&re(v.id,h),disabled:m,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:m?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:m?.5:1,minWidth:"24px"},onClick:()=>ie(v.id||v.mac_id||v.mac_address||v.ip||"0",h),disabled:m,title:"Xóa",children:"🗑️"})]},P)}):e.jsx("div",{style:ue.emptySubText,children:i.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Đang tải hoặc danh sách trống. Nhấn đồng bộ để lấy trực tiếp."})]})}const Pn="https://agentapi.quanlymay.com",Vt=new Map;async function Ie(n,i={}){const v=`${i.method||"GET"}:${n}:${i.body||""}`;if(Vt.has(v))return Vt.get(v);const f=(async()=>{try{const B=await fetch(`${Pn}${n}`,{...i,headers:{"Content-Type":"application/json","X-API-Token":"change-me",...i.headers}});if(!B.ok){const G=await B.json().catch(()=>({}));throw new Error(G.error||`HTTP error! status: ${B.status}`)}return await B.json()}finally{Vt.delete(v)}})();return Vt.set(v,f),f}async function jn(){try{return(await Ie("/api/new-lan-sites?lead=default")).rows||[]}catch(n){return console.error("Failed to fetch LAN sites:",n),[]}}async function In(n,i,v,f,B){return Ie(`/api/devices/${encodeURIComponent(n)}/credentials`,{method:"PATCH",body:JSON.stringify({auth_user:i,auth_password:v,mac_id:f||n,printer_type:B})})}async function En(n,i,v){const f=i?`/api/devices/${n}/fetch-address-book?agent_uid=${i}`:`/api/devices/${n}/fetch-address-book`;return Ie(f,{method:"POST",body:JSON.stringify(v||{})})}async function St(n){return Ie(`/api/commands/${n}/status`)}async function Ln(n,i,v,f,B){const G=f?`/api/devices/${n}/add-email-dest?agent_uid=${f}`:`/api/devices/${n}/add-email-dest`;return Ie(G,{method:"POST",body:JSON.stringify({name:i,email:v,...B||{}})})}async function Rn(n,i,v,f){return Ie("/api/lan-emails",{method:"POST",body:JSON.stringify({lead:n,lan_uid:i,email:f,email_type:"private",pc_name:v})})}async function Nn(n){return Ie(`/api/lan-emails/${n}`,{method:"DELETE"})}async function Lr(n,i){return Ie(`/api/scans/files?lan_uid=${encodeURIComponent(n)}&email=${encodeURIComponent(i)}`)}async function Rr(n,i,v,f,B,G){return Ie(`/api/devices/${n}/install-driver`,{method:"POST",body:JSON.stringify({brand:i,model:v,driver_name:f,driver_url:B,agent_uid:G})})}async function Dn(n,i,v,f=1,B=50,G,ne){const ie=new URLSearchParams;return n&&ie.append("lead",n),ie.append("lan_uid",i),f&&ie.append("page",f.toString()),B&&ie.append("limit",B.toString()),ie.append("t",Date.now().toString()),Ie(`/api/jobs?${ie.toString()}`)}async function Mn(n,i,v){return Ie(`/api/agents/${n}/utility/${i}?lead=default`,{method:"POST",body:v?JSON.stringify(v):void 0})}async function On(n){return Ie(`/api/agents/${n}/utility-commands?lead=default&t=${Date.now()}`)}async function at(n,i,v,f){return Ie(`/api/agents/${n}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify({command:i,command_content:v,...f||{}})})}async function Fn(n){return Ie(`/api/agents/${n}/emergency-restart?lead=default`,{method:"POST",body:"{}"})}function Un({p:n,selectedLan:i,activeAgentUid:v,selectedAgentUid:f,copierCredentials:B,setCopierCredentials:G,saveAuthLoading:ne,handleSaveAuth:ie,isExpanded:me,handleCopierClick:re,onlineAgents:h,detectBrand:P,showToast:Z,fetchRemotePage:T,setRemoteLockPrinter:fe,setActiveModal:F,hasAddressList:x,sync:M,commandStatus:m,getDestinationStatus:N,handleOpenStorageFiles:ae,handleEditIP:ee,handleDeleteDest:Ce,handleRefetchAddressBook:he,expandedDrivers:Ee,setExpandedDrivers:ge,expandedDriverMenus:Q,setExpandedDriverMenus:K,handleRemoteInstallDriver:ce,setPublicFtpData:_}){var E,W,J,H,q;const[U,c]=Pt.useState(null),s=Pt.useRef(!1),l=Pt.useCallback(async()=>{try{const a=await Ie(`/api/lan-sites?t=${Date.now()}`);if(a&&a.ok&&Array.isArray(a.rows)){const y=(n.mac_id||n.mac_address||n.mac||"").toUpperCase().replace(/[^0-9A-F]/g,"");for(const O of a.rows)for(const te of O.printers||[]){const d=(te.mac_id||te.mac_address||te.mac||"").toUpperCase().replace(/[^0-9A-F]/g,"");y&&d&&y.length>=10&&y===d&&te.address_book_sync&&c(te.address_book_sync)}}}catch{}},[n.mac_id,n.mac_address]),g=((E=m[n.id])==null?void 0:E.isPending)||!1,w=((W=m[n.id])==null?void 0:W.message)||"";Pt.useEffect(()=>{if(g&&c(null),s.current&&!g){l();const a=setTimeout(l,1500),y=setTimeout(l,3500);return()=>{clearTimeout(a),clearTimeout(y)}}s.current=g},[g,l]);const R=n.mac_address||"",L=n.ip||"",S=String(n.id!==void 0&&n.id!==null?n.id:""),C=R&&(m==null?void 0:m[R])||L&&(m==null?void 0:m[L])||S&&(m==null?void 0:m[S]),I=a=>a&&(Array.isArray(a.address_list)&&a.address_list.length>0||a.address_book_data&&Array.isArray(a.address_book_data.address_list)&&a.address_book_data.address_list.length>0),A=(I(U)?U:null)||(I(C==null?void 0:C.address_book_sync)?C.address_book_sync:null)||(I(C)?C:null)||(I(M)?M:null)||U||(C==null?void 0:C.address_book_sync)||C||M||{},Y=n.suggested_drivers&&n.suggested_drivers.length>0,de=Ee[n.id],xe=(()=>{var y;if(Array.isArray(A==null?void 0:A.address_list)&&A.address_list.length>0)return A.address_list;if(A!=null&&A.address_book_data&&Array.isArray(A.address_book_data.address_list))return A.address_book_data.address_list;const a=[A,A==null?void 0:A.result,A==null?void 0:A.result_payload,A==null?void 0:A.raw,C==null?void 0:C.result,C==null?void 0:C.result_payload,C==null?void 0:C.address_list,(y=C==null?void 0:C.address_book_sync)==null?void 0:y.address_list];for(const O of a)if(O){if(Array.isArray(O))return O;if(typeof O=="object"&&Array.isArray(O.address_list))return O.address_list;if(typeof O=="string"){let te=O.trim();if(te.includes("__ADDRESS_BOOK_JSON_START__"))try{te=te.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),te=te.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const d=JSON.parse(te);if(d&&Array.isArray(d.address_list))return d.address_list;if(Array.isArray(d))return d}catch{}}}return Array.isArray(A==null?void 0:A.address_list)?A.address_list:[]})(),le=xe.filter(a=>{if(!a||typeof a!="object"||a.type==="Summary")return!1;const y=(a.name||"").trim();return y==="Summary"||y==="Total"||y.startsWith("Users:")?!1:!!(y||a.entry_id||a.registration_no&&a.registration_no!=="-"||a.email_address||a.email||a.folder||a.physical_path)}),$={...A,address_list:xe,status:xe.length>0?"success":(A==null?void 0:A.status)||"none",timestamp:((J=m==null?void 0:m[n.id])==null?void 0:J.timestamp)||(A==null?void 0:A.timestamp)||new Date().toISOString()},z=le.length>0||x,o=le.length,u=$.timestamp?new Date($.timestamp).toLocaleTimeString("vi-VN"):"",k=Pt.useCallback(async(a,y)=>{var Le,Pe;const O=P(a.printer_name||a.name||"");if(O!=="ricoh"&&O!=="toshiba"){Z("Thiết bị không hỗ trợ thay đổi FTP","error");return}const te=O==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",d=((Le=i==null?void 0:i.agents)==null?void 0:Le.find(X=>X.is_agent_active))||((Pe=i==null?void 0:i.agents)==null?void 0:Pe[0]),we=(d==null?void 0:d.local_ip)||(d==null?void 0:d.ip)||"";if(!we){Z("Không tìm thấy IP của Agent để cập nhật","error");return}const be=y.folder||y.physical_path||y.folder_path||"",oe=be.match(/ftp:\/\/([^:/]+)/),De=be.match(/^\\\\([^\\]+)/),Ae=be.match(/^([^:/]+):/);let We="";oe?We=oe[1]:De?We=De[1]:Ae&&(We=Ae[1]),We||(We=we);const Ye=y.registration_no||y.id||"",ve=y.name||y.username||y.display_name||"",b=a.ip||a.printer_ip||"";Z(`Đang truy vấn tài khoản VPS cho ${y.name}...`,"info");let Me=a.auth_user||a.username||"",Te=a.auth_password||a.password||"";try{const X=await Ie(`/api/devices/credentials-map?t=${Date.now()}`);if(X&&X.ok&&X.credentials){const ye=(a.mac_id||a.mac_address||"").toUpperCase().replace(/[^0-9A-F:]/g,""),tt=ye.replace(/[:-]/g,""),ht=b,rt=ye&&X.credentials[ye]||tt&&X.credentials[tt]||ht&&X.credentials[ht];rt&&(Me=rt.user||rt.auth_user||Me,Te=rt.password||rt.auth_password||Te)}}catch{}if(!Me){Z("⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS!","error");return}try{const X=await at(f,te,"",{printer_ip:b,auth_user:Me,auth_password:Te,target_id:Ye,target_name:ve,old_ip:We,new_ip:we});X&&X.ok?Z(`Cập nhật FTP cho ${y.name} thành công!`,"success"):Z(`Lỗi: ${(X==null?void 0:X.error)||"Không thể chạy lệnh"}`,"error")}catch(X){Z(`Lỗi gửi lệnh: ${(X==null?void 0:X.message)||X}`,"error")}},[f,i,P,Z]);return e.jsx("div",{id:`copier-card-${n.id}`,onClick:()=>re(String(n.id)),style:{width:"100%"},children:e.jsxs(Er,{children:[e.jsxs("div",{style:ue.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:ue.copierTitle,children:["🖨️ ",(()=>{if(n.printer_name&&n.printer_name.trim())return n.printer_name.trim();const a=(n.mac_id||"").replace(/-/g,":").toUpperCase();return a.startsWith("58:38:79")||a.startsWith("00:26:73")?"Thiết bị Ricoh (Đang thám dò...)":a.startsWith("00:80:91")?"Thiết bị Toshiba (Đang thám dò...)":a.startsWith("00:11:22")?"Thiết bị HP (Đang thám dò...)":"Thiết bị Photocopy (Đang thám dò...)"})()]}),e.jsxs("div",{style:ue.copierSubtitle,children:["IP: ",n.ip," · MAC: ",n.mac_id||"—",n.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:n.agent_uid})]})]})]}),e.jsx("span",{style:{...ue.statusBadge,color:n.probed?n.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:n.probed?n.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:n.probed?n.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:n.probed?n.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsxs("div",{style:ue.sectionBlock,children:[e.jsx("span",{style:ue.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsxs("div",{style:ue.credsInputRow,children:[e.jsx("input",{type:"text",style:ue.credsInput,placeholder:"admin",autoComplete:"new-password",name:`printer_user_${n.id}`,value:((H=B[n.id])==null?void 0:H.user)||"",onChange:a=>G(y=>({...y,[n.id]:{...y[n.id],user:a.target.value}}))}),e.jsx("input",{type:"password",style:ue.credsInput,placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${n.id}`,value:((q=B[n.id])==null?void 0:q.pass)||"",onChange:a=>G(y=>({...y,[n.id]:{...y[n.id],pass:a.target.value}}))}),e.jsx("button",{style:{...ue.smallBtn,padding:"8px 12px",fontSize:"0.8rem",whiteSpace:"nowrap"},onClick:()=>ie(n),disabled:ne[n.id],children:ne[n.id]?"Lưu...":"Lưu Auth"})]})]}),e.jsxs("div",{style:{...ue.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:M.status==="success"?"rgba(0, 255, 136, 0.05)":M.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:M.status==="success"?"rgba(0, 255, 136, 0.15)":M.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:ue.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),g?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:w}):z?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",o," mục) ",u?` • ${u}`:""]}):M.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",M.error," ",u?`(${u})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...ue.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:async()=>{he(n),setTimeout(l,2e3),setTimeout(l,4500)},disabled:g||h.length===0,children:["🔄 ",$.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),z&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(An,{hasAddressList:z,sync:$,p:n,commandStatus:m,getDestinationStatus:N,selectedLan:i,handleOpenStorageFiles:ae,handleEditIP:ee,handleDeleteDest:Ce,handleChangeFtp:k})})]}),Y&&e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("button",{style:ue.expandSubBtn,onClick:()=>ge(a=>({...a,[n.id]:!de})),children:de?"▲ Ẩn driver đề xuất":"▼ Xem driver đề xuất từ catalog"}),e.jsx(et,{children:de&&e.jsx(Ke.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},style:{overflow:"hidden",marginTop:"6px"},children:e.jsx("div",{style:ue.suggestedDriverBlock,children:n.suggested_drivers.map((a,y)=>{const O=a.brand==="ricoh"?"var(--color-primary)":a.brand==="toshiba"?"var(--color-error)":"var(--color-success)",te=`${n.id}-${y}`,d=Q[te]||!1;return e.jsxs("div",{style:ue.driverSuggestionItem,children:[e.jsxs("div",{style:ue.driverModelHeader,onClick:()=>K(we=>({...we,[te]:!d})),children:[e.jsxs("span",{style:{fontSize:"0.8rem",fontWeight:600},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:O,marginRight:"6px"}}),a.brand.toUpperCase()," - ",a.model]}),e.jsx("span",{style:{fontSize:"0.75rem",color:"var(--color-primary)"},children:d?"▲":"▼"})]}),d&&e.jsx("div",{style:ue.driverOptionsList,children:a.drivers&&a.drivers.length>0?a.drivers.map((we,be)=>e.jsxs("div",{style:ue.driverFileRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:ue.driverFileName,children:we.name}),e.jsx("div",{style:ue.driverFileUrl,title:we.url,children:we.url.split("/").pop()})]}),e.jsx("div",{style:{display:"flex",gap:"4px"},children:e.jsx("button",{style:{...ue.smallBtn,padding:"4px 8px",fontSize:"0.7rem"},onClick:()=>ce(n.mac_id||n.mac_address||n.ip||n.id,a.brand,a.model,we.name,we.url),disabled:h.length===0,children:"Cài đặt"})})]},be)):e.jsx("div",{style:ue.emptySubText,children:"Không tìm thấy driver nào."})})]},y)})})})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...ue.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{_({printerId:n.id,name:"",email:"",agentUid:f}),F("public_ftp")},disabled:h.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...ue.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{var y,O;const a=f||n.agent_uid||v||((O=(y=i==null?void 0:i.agents)==null?void 0:y[0])==null?void 0:O.agent_uid)||"";if(!a){Z("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}T(a,n.ip,"/")},disabled:!i||!i.agents||i.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...ue.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#ef4444",color:"#ef4444"},onClick:()=>{fe({ip:n.ip,name:n.name||n.printer_name||n.ip,id:n.id,agentUid:f}),F("remote_lock")},disabled:h.length===0,children:"🔒 Khóa máy từ xa"}),P(n.name||n.printer_name||n.ip)==="ricoh"&&(n.name||n.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...ue.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>Z("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),P(n.name||n.printer_name||n.ip)==="toshiba"&&e.jsx("button",{style:{...ue.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>Z("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]})},n.id)}function Bn(n){const{setCopierCredentials:i,activeAgentUid:v,activeLoadingFile:f,activeModal:B,activeTab:G,addCameraLoading:ne,addressBookModal:ie,agentUid:me,agents:re,cameraAgentUid:h,cameraFileFilter:P,cameras:Z,camerasLoading:T,canNavigateNext:fe,canNavigatePrev:F,commandStatus:x,copierCredentials:M,deleteCameraLoading:m,deleteScanPointModal:N,destToDelete:ae,detectBrand:ee,editIpData:Ce,editIpModal:he,editIpNewIp:Ee,editIpSaving:ge,expandedCopierId:Q,expandedDriverMenus:K,expandedDrivers:ce,expandedPrinters:_,fetchLanSitesData:U,fetchRemotePage:c,fileTypeFilter:s,filteredPrinters:l,getDestinationStatus:g=()=>({label:"✔ ACTIVE",type:"success",title:""}),getTargetAgentUid:w,handleCopierClick:R,handleDeleteDest:L,handleEditIP:S,handleOpenStorageFiles:C,handleRefetchAddressBook:I,handleRemoteInstallDriver:A,handleSaveAuth:Y,infoDetailModal:de,installDriverModal:xe,installDriverSaving:le,installedCount:$,isAllInstalled:z,lanSites:o,lanSitesLoading:u,liveAddressBooks:k,mockAgentApi:E,newCamIp:W,newCamName:J,newCamPass:H,newCamPort:q,newCamRtsp:a,newCamUser:y,onlineAgents:O,pendingScanPoints:te,printers:d,publicFtpData:we,publicFtpModal:be,publicFtpSaving:oe,record30sLoading:De,remoteLockModal:Ae,remoteLockPrinter:We,saveAuthLoading:Ye,selectedAgentUid:ve,selectedCamera:b,selectedCameraAgentUid:Me,selectedLan:Te,selectedLanUid:Le,setActiveModal:Pe,setExpandedDriverMenus:X,setExpandedDrivers:ye,setPublicFtpData:tt,setRemoteLockPrinter:ht,showToast:rt,storageFilesModal:jt,storageFilesModalData:It,storageFilesModalLoading:Et,storageFilterDate:wt,submittingScanPoint:Lt,toshibaVncData:rr,utilityActionPending:nr,utilityCommands:ir,utilityCommandsLoading:ar,utilitySettingsLoading:or,utilityStatusMsg:Je,viewOutputModal:sr,vncTunnelLoading:lr,webPreviewHistory:cr,webPreviewHistoryIndex:Oe,webPreviewLoading:ft,webPreviewModal:Rt,webPreviewTab:Nt}=n;return e.jsx(e.Fragment,{children:e.jsxs(Ke.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:t.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(Ir,{className:"copiers-grid",style:t.gridContainer,children:u?e.jsxs("div",{style:t.loadingContainer,children:[e.jsx(Qe,{}),e.jsx("div",{style:t.loadingText,children:"Đang tải dữ liệu thiết bị..."})]}):l.length===0?e.jsxs("div",{style:t.emptyStateContainer,children:[e.jsx("div",{style:t.emptyIcon,children:"🖨️"}),e.jsx("div",{style:t.emptyTitle,children:"Không tìm thấy máy photocopy nào"}),e.jsx("div",{style:t.emptySubtitle,children:'Vui lòng chọn mạng LAN khác hoặc nhấp "Làm mới" để quét lại thiết bị.'})]}):l.map(Ue=>{const Dt=String(Q)===String(Ue.id),Mt=Re=>{if(!Re)return null;let Ne=Re;if(typeof Ne=="string"){let ct=Ne.trim();if(ct.includes("__ADDRESS_BOOK_JSON_START__"))try{ct=ct.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),ct=ct.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{Ne=JSON.parse(ct)}catch{return null}}if(typeof Ne!="object")return null;let Ot=0;for(;Ne&&typeof Ne=="object"&&!Array.isArray(Ne.address_list)&&Ne.address_book_sync&&Ot<5;)Ne=Ne.address_book_sync,Ot++;return Ne},Be=(Ue.mac_address||Ue.mac_id||"").toUpperCase().replace(/-/g,":"),xt=Mt(Be?k==null?void 0:k[Be]:null),mt=Mt(Ue.address_book_sync),ot=xt&&Array.isArray(xt.address_list),$t=mt&&Array.isArray(mt.address_list)&&mt.address_list.length>0,Se=ot?xt:$t?mt:xt||mt||{},Kt=(Array.isArray(Se.address_list)?Se.address_list.filter(Re=>{if(!Re||typeof Re!="object"||Re.type==="Summary")return!1;const Ne=(Re.name||"").trim();return Ne==="Summary"||Ne==="Total"||Ne.startsWith("Users:")?!1:!!(Ne||Re.entry_id||Re.registration_no&&Re.registration_no!=="-"||Re.email_address||Re.email||Re.folder||Re.physical_path)}):[]).length>0,Jt=((Te==null?void 0:Te.agents)||[]).filter(Re=>Re.is_agent_active),qt=w?w(Ue.id):ve||Ue.agent_uid||"";return e.jsx(Un,{p:Ue,selectedLan:Te,activeAgentUid:me,selectedAgentUid:qt,copierCredentials:M||{},setCopierCredentials:i,saveAuthLoading:Ye||{},handleSaveAuth:Y,isExpanded:Dt,handleCopierClick:R,onlineAgents:Jt,detectBrand:ee||(()=>"generic"),showToast:rt||(()=>{}),fetchRemotePage:c||(()=>{}),setRemoteLockPrinter:ht,setActiveModal:Pe,hasAddressList:Kt,sync:Se,commandStatus:x||{},getDestinationStatus:g||(()=>({})),handleOpenStorageFiles:C||(()=>{}),handleEditIP:S||(()=>{}),handleDeleteDest:L||(()=>{}),handleRefetchAddressBook:I||(()=>{}),expandedDrivers:ce||{},setExpandedDrivers:ye,expandedDriverMenus:K||{},setExpandedDriverMenus:X,handleRemoteInstallDriver:A||(()=>{}),setPublicFtpData:tt},Ue.id)})})]},"copiers-tab")})}function tr(n){const i=(n||"").trim();return i&&i.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function Gn(n){const{AgentPage:i,activeLoadingFile:v,activeModal:f,activeTab:B,allocatedVncAddr:G,cameraFiles:ne,cameraForm:ie,cameraLogs:me,cameraStatus:re,cameraTestLoading:h,cameraTestResult:P,cameras:Z,camerasLoading:T,commandStatus:fe,confirmModal:F,copierCredentials:x,customRecordDuration:M,customRunCommand:m,deleteScanPointModal:N,directLan:ae,editIpModalData:ee,editableSettingsText:Ce,emailFileCounts:he,executeRemoteInstallDriver:Ee,expandedDriverMenus:ge,expandedDrivers:Q,expandedPrinters:K,fetchCameraFiles:ce,fetchCameraStatus:_,fetchRemotePage:U,fetchRemotePageOld:c,ftpDetailData:s,getDestinationStatus:l=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:g=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:w,handleAddPrivateFtp:R,handleAddPublicFtp:L,handleCloseWebPreview:S,handleConfirmDeleteScanPoint:C,handleCopierClick:I,handleDeleteCamera:A,handleDeleteCameraFile:Y,handleDeleteDest:de,handleEditIP:xe,handleFetchEntryDetail:le,handleHistoryBack:$,handleHistoryForward:z,handleOpenStorageFiles:o,handlePlaySegmentFile:u,handleQueryVideo:k,handleRecord30s:E,handleRefetchAddressBook:W,handleRemoteInstallDriver:J,handleSaveAuth:H,handleSaveCameraConfig:q,handleSaveEditIP:a,handleTriggerUtilityExec:y,handleSaveSettings:O,handleStartToshibaVnc:te,handleTestCameraConnection:d,handleToggleDirectLan:we,handleViewScanPointsJson:be,installDriverModal:oe,ipInputModal:De,isRecording30s:Ae,isSavingSettings:We,lanSites:Ye,lanSitesLoading:ve,liveAddressBooks:b,lockAspect:Me,pollCommandStatus:Te,previewBlobUrl:Le,privateFtpData:Pe,privateFtpLoading:X,publicFtpData:ye,publicFtpLoading:tt,queriedVideoUrl:ht,queryDuration:rt,queryTimestamp:jt,queryVideoLoading:It,recording30sCountdown:Et,remoteLockPrinter:wt,resolveRelativePath:Lt,saveAuthLoading:rr,savedLocal:nr,scaleX:ir,scaleY:ar,scanAutoOpenDir:or,scanAutoOpenFile:Je,scanPointsViewerModal:sr,selectedCamera:lr,selectedCameraAgentUid:cr,selectedLan:Oe,selectedLanUid:ft,selectedTargetAgents:Rt,selectedUtilityAgent:Nt,setActiveLoadingFile:Ue,setActiveModal:Dt,setActiveTab:Mt,setAllocatedVncAddr:Be,setCameraFiles:xt,setCameraForm:mt,setCameraLogs:ot,setCameraStatus:$t,setCameraTestLoading:Se,setCameraTestResult:dr,setCameras:Kt,setCamerasLoading:Jt,setCommandStatus:qt,setConfirmModal:Re,setCopierCredentials:Ne,setCustomRecordDuration:Ot,setCustomRunCommand:ct,setDeleteScanPointModal:Nr,setDirectLan:Dr,setEditIpModalData:Mr,setEditableSettingsText:Tt,setEmailFileCounts:Or,setExpandedDriverMenus:Fr,setExpandedDrivers:Xt,setExpandedPrinters:Ct,setFtpDetailData:Ur,setInstallDriverModal:Ft,setIpInputModal:pr,setIsRecording30s:Br,setIsSavingSettings:Gr,setLanSites:zr,setLanSitesLoading:Hr,setLiveAddressBooks:Qt,setLockAspect:_t,setPreviewBlobUrl:qe,setPrivateFtpData:Wr,setPrivateFtpLoading:Vr,setPublicFtpData:$r,setPublicFtpLoading:Kr,setQueriedVideoUrl:Jr,setQueryDuration:mr,setQueryTimestamp:qr,setQueryVideoLoading:gr,setRecording30sCountdown:Xr,setRemoteLockPrinter:Ut,setSaveAuthLoading:Qr,setScaleX:Yr,setScaleY:Zr,setScanAutoOpenDir:en,setScanAutoOpenFile:tn,setScanPointsViewerModal:rn,setSelectedCamera:nn,setSelectedCameraAgentUid:an,setSelectedLanUid:nt,setSelectedTargetAgents:Ze,setSelectedUtilityAgent:ur,setSettingsSaveStatus:on,setShowPreviewDetails:Bt,setShowSettings:sn,setStorageFiles:ln,setStorageLoading:cn,setStorageModalData:dn,setToasts:Yt,setToshibaVncData:pn,setUtilityActionPending:hr,setUtilityCommands:mn,setUtilityCommandsLoading:gn,setUtilitySettingsLoading:un,setUtilityStatusMsg:hn,setViewOutputModal:fn,setVncTunnelLoading:xn,setWebPreviewHistory:gt,setWebPreviewHistoryIndex:_n,setWebPreviewLoading:yn,setWebPreviewModal:bn,setWebPreviewTab:st,settingsSaveStatus:yt,showPreviewDetails:vn,showSettings:Sn,storageFiles:wn,storageLoading:Tn,storageModalData:fr,toasts:Zt,toshibaVncData:lt,utilityActionPending:Gt,utilityCommands:Cn,utilityCommandsLoading:Ve,utilitySettingsLoading:er,utilityStatusMsg:xr,viewOutputModal:zt,vncTunnelLoading:kn,webPreviewHistory:it,webPreviewHistoryIndex:pe,webPreviewLoading:kt,webPreviewModal:_r,webPreviewTab:yr}=n;return e.jsx(e.Fragment,{children:e.jsx(Ke.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:t.tabContent,children:e.jsx(Ir,{children:Oe.agents.filter(_e=>_e.is_agent_active).length===0?e.jsx("div",{style:t.emptyText,children:"Không có Agent nào đang online trong mạng LAN này."}):Oe.agents.filter(_e=>_e.is_agent_active).map(_e=>{const Xe=_e.is_agent_active;return e.jsxs(Er,{children:[e.jsxs("div",{style:t.cardHeader,children:[e.jsxs("span",{style:t.cardTitle,children:["💻 ",_e.hostname]}),e.jsx("span",{style:{...t.statusBadge,color:Xe?"var(--color-status-online)":"var(--color-status-offline)",borderColor:Xe?"var(--color-status-online)":"var(--color-status-offline)",background:Xe?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:Xe?_e.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]}),e.jsxs("div",{style:t.cardDetails,children:[e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"UID:"}),e.jsx("span",{style:{...t.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:_e.agent_uid})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...t.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[_e.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async je=>{je.stopPropagation();try{const Ge=await at(_e.agent_uid,"get_agent_ip","");if(Ge.ok&&Ge.command_id){n.showToast&&n.showToast("Đang yêu cầu lấy lại IP cục bộ...","info");const Fe=Ge.command_id,At=Date.now(),se=setInterval(async()=>{try{if(Date.now()-At>12e3){clearInterval(se);return}const ze=await St(Fe);ze.status==="success"?(clearInterval(se),n.fetchLanSitesData&&await n.fetchLanSitesData(!0),n.showToast&&n.showToast("Đã cập nhật IP cục bộ mới nhất!","success")):ze.status==="failed"&&(clearInterval(se),n.showToast&&n.showToast("Không thể lấy lại IP cục bộ: "+(ze.error||"Thất bại"),"error"))}catch(ze){console.error(ze),clearInterval(se)}},1e3)}else n.showToast&&n.showToast("Gửi yêu cầu thất bại: "+(Ge.error||"Lỗi kết nối"),"error")}catch(Ge){n.showToast&&n.showToast("Lỗi: "+Ge.message,"error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:je=>je.currentTarget.style.opacity="1",onMouseLeave:je=>je.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:t.detailValue,children:_e.local_mac||"—"})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:t.detailValue,children:(()=>{const je=(_e.ftp_sites||[]).find(He=>(He.name||"").toLowerCase()==="goxprint")||(_e.ftp_sites||[])[0],Ge=(je==null?void 0:je.path)||"",Fe=tr((Oe==null?void 0:Oe.lan_uid)||""),At=tr(_e.agent_uid||""),ze=`storage/uploads/scans/${tr(_e.lead||"default")}/${Fe}/${At}/`,ut=Oe?Oe.emails.filter(He=>He.email_type==="private"&&He.pc_name&&He.pc_name.toLowerCase().trim()===_e.agent_uid.toLowerCase().trim()):[],Ht=ut.reduce((He,bt)=>He+(he[bt.email]??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:Ge?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:Ge?"normal":"italic"},children:Ge||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:ze})]})]}),ut.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[ut.map(He=>{const bt=he[He.email]??0;return e.jsxs("button",{style:{...t.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>o((Oe==null?void 0:Oe.lan_uid)||"",He.email),title:`Xem tệp của ${He.email}`,children:["📁 ",bt," tệp"]},He.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[Ht," tệp"]})]})]}),ut.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:t.detailValue,children:_e.ftp_ports||"—"})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:t.detailValue,children:e.jsx("button",{onClick:()=>{ur(_e),Dt("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:t.detailValue,children:_e.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!_e.ftp_sites||_e.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:_e.ftp_sites.map((je,Ge)=>{const Fe=je.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${Fe?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:Fe?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:Fe?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:Fe?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:Fe?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",je.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",Fe?"Đang chạy":"Đã dừng",")"]})]}),je.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",je.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:je.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:je.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:je.ftp_password||"goxprint"})]})]})]})]},Ge)})})]})]},_e.agent_uid)})})},"agents-tab")})}function zn(n){var ut,Ht,He,bt,br,vr,Sr,wr,Tr,Cr,kr;const{AgentPage:i,activeLoadingFile:v,activeModal:f,activeTab:B,allocatedVncAddr:G,cameraFiles:ne,cameraForm:ie,cameraLogs:me,cameraStatus:re,cameraTestLoading:h,cameraTestResult:P,cameras:Z,camerasLoading:T,commandStatus:fe,confirmModal:F={isOpen:!1},copierCredentials:x,customRecordDuration:M,customRunCommand:m,deleteScanPointModal:N={isOpen:!1},directLan:ae,editIpModalData:ee={isOpen:!1},editableSettingsText:Ce,emailFileCounts:he,executeRemoteInstallDriver:Ee,expandedDriverMenus:ge,expandedDrivers:Q,expandedPrinters:K,fetchCameraFiles:ce,fetchCameraStatus:_,fetchRemotePage:U,fetchRemotePageOld:c,formatBytes:s,formatJsonText:l,ftpDetailData:g,getDestinationStatus:w=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:R=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:L,handleAddPrivateFtp:S,handleAddPublicFtp:C,handleCloseWebPreview:I,handleConfirmDeleteScanPoint:A,handleCopierClick:Y,handleDeleteCamera:de,handleDeleteCameraFile:xe,handleDeleteDest:le,handleEditIP:$,handleEmergencyRestart:z,handleFetchEntryDetail:o,handleHistoryBack:u,handleHistoryForward:k,handleOpenStorageFiles:E,handlePlaySegmentFile:W,handleQueryVideo:J,handleRecord30s:H,handleRefetchAddressBook:q,handleRemoteInstallDriver:a,handleSaveAuth:y,handleSaveCameraConfig:O,handleSaveEditIP:te,handleSaveSettings:d,handleStartToshibaVnc:we,handleTestCameraConnection:be,handleToggleDirectLan:oe,handleToggleSetting:De,handleTriggerUtility:Ae,handleTriggerUtilityExec:We,handleViewScanPointsJson:Ye,installDriverModal:ve={isOpen:!1},ipInputModal:b={isOpen:!1},isRecording30s:Me,isSavingSettings:Te,lanSites:Le,lanSitesLoading:Pe,liveAddressBooks:X,lockAspect:ye,modalContentRef:tt,pollCommandStatus:ht,previewBlobUrl:rt,previewIframeRef:jt,privateFtpData:It,privateFtpLoading:Et,publicFtpData:wt,publicFtpLoading:Lt,queriedVideoUrl:rr,queryDuration:nr,queryTimestamp:ir,queryVideoLoading:ar,recording30sCountdown:or,remoteLockPrinter:Je,resolveRelativePath:sr,saveAuthLoading:lr,savedLocal:cr,scaleX:Oe,scaleY:ft,scanAutoOpenDir:Rt,scanAutoOpenFile:Nt,scanPointsViewerModal:Ue={isOpen:!1},selectedCamera:Dt,selectedCameraAgentUid:Mt,selectedLan:Be,selectedLanUid:xt,selectedTargetAgents:mt,selectedUtilityAgent:ot,setActiveLoadingFile:$t,setActiveModal:Se,setActiveTab:dr,setAllocatedVncAddr:Kt,setCameraFiles:Jt,setCameraForm:qt,setCameraLogs:Re,setCameraStatus:Ne,setCameraTestLoading:Ot,setCameraTestResult:ct,setCameras:Nr,setCamerasLoading:Dr,setCommandStatus:Mr,setConfirmModal:Tt,setCopierCredentials:Or,setCustomRecordDuration:Fr,setCustomRunCommand:Xt,setDeleteScanPointModal:Ct,setDirectLan:Ur,setEditIpModalData:Ft,setEditableSettingsText:pr,setEmailFileCounts:Br,setExpandedDriverMenus:Gr,setExpandedDrivers:zr,setExpandedPrinters:Hr,setFtpDetailData:Qt,setInstallDriverModal:_t,setIpInputModal:qe,setIsRecording30s:Wr,setIsSavingSettings:Vr,setLanSites:$r,setLanSitesLoading:Kr,setLiveAddressBooks:Jr,setLockAspect:mr,setPreviewBlobUrl:qr,setPrivateFtpData:gr,setPrivateFtpLoading:Xr,setPublicFtpData:Ut,setPublicFtpLoading:Qr,setQueriedVideoUrl:Yr,setQueryDuration:Zr,setQueryTimestamp:en,setQueryVideoLoading:tn,setRecording30sCountdown:rn,setRemoteLockPrinter:nn,setSaveAuthLoading:an,setScaleX:nt,setScaleY:Ze,setScanAutoOpenDir:ur,setScanAutoOpenFile:on,setScanPointsViewerModal:Bt,setSelectedCamera:sn,setSelectedCameraAgentUid:ln,setSelectedLanUid:cn,setSelectedTargetAgents:dn,setSelectedUtilityAgent:Yt,setSettingsSaveStatus:pn,setShowPreviewDetails:hr,setShowSettings:mn,setStorageFiles:gn,setStorageLoading:un,setStorageModalData:hn,setToasts:fn,setToshibaVncData:xn,setUtilityActionPending:gt,setUtilityCommands:_n,setUtilityCommandsLoading:yn,setUtilitySettingsLoading:bn,setUtilityStatusMsg:st,setViewOutputModal:yt,setVncTunnelLoading:vn,setWebPreviewHistory:Sn,setWebPreviewHistoryIndex:wn,setWebPreviewLoading:Tn,setWebPreviewModal:fr,setWebPreviewTab:Zt,settingsSaveStatus:lt,showPreviewDetails:Gt,showSettings:Cn,showToast:Ve,storageFiles:er,storageLoading:xr,storageModalData:zt={isOpen:!1},toasts:kn,toshibaVncData:it,utilityActionPending:pe,utilityCommands:kt,utilityCommandsLoading:_r,utilitySettingsLoading:yr,utilityStatusMsg:_e,viewOutputModal:Xe={isOpen:!1},vncTunnelLoading:je,webPreviewHistory:Ge,webPreviewHistoryIndex:Fe,webPreviewLoading:At,webPreviewModal:se={isOpen:!1},webPreviewTab:ze}=n;return e.jsxs(e.Fragment,{children:[e.jsx(et,{children:f&&e.jsx("div",{style:t.modalOverlay,onClick:()=>Se(null),children:e.jsxs(Ke.div,{style:t.modalCard,onClick:r=>r.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[f==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:t.modalSubtitle,children:zt.email})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:xr?e.jsxs("div",{style:t.modalLoading,children:[e.jsx(Qe,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):er.length===0?e.jsx("div",{style:t.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:t.filesList,children:er.map((r,p)=>e.jsxs("div",{style:t.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${r.url}`,target:"_blank",rel:"noreferrer",style:t.fileLinkName,children:r.name}),e.jsxs("div",{style:t.fileMetaDetails,children:["Dung lượng: ",s(r.size)," · Mtime: ",new Date(r.mtime).toLocaleString("vi-VN")]}),r.upload_completed_at&&e.jsxs("div",{style:t.fileUploadMeta,children:["Tải lên VPS: ",new Date(r.upload_completed_at).toLocaleTimeString("vi-VN"),r.upload_duration!=null?` (${r.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${r.url}`,download:!0,target:"_blank",rel:"noreferrer",style:t.fileDownloadBtn,children:"Tải về"})]},p))})}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>E(zt.lanUid,zt.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Se(null),children:"Đóng"})]})]}),f==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:t.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:wt.name,onChange:r=>Ut(p=>({...p,name:r.target.value}))}),e.jsx("span",{style:t.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:t.modalInput,placeholder:"VD: goxprint@gmail.com",value:wt.email,onChange:r=>Ut(p=>({...p,email:r.target.value}))}),e.jsx("span",{style:t.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:t.modalInput,value:wt.agentUid,onChange:r=>Ut(p=>({...p,agentUid:r.target.value})),children:(Be&&Be.agents||[]).filter(r=>r.is_agent_active).map(r=>e.jsxs("option",{value:r.agent_uid,children:[r.hostname," (",r.local_ip,")"]},r.agent_uid))})]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:C,disabled:Lt,children:Lt?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Se(null),children:"Hủy bỏ"})]})]}),f==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:t.modalInput,placeholder:"VD: user.pc1@gmail.com",value:It.email,onChange:r=>gr(p=>({...p,email:r.target.value}))}),e.jsxs("span",{style:t.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",It.agentUid]})]})}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:S,disabled:Et,children:Et?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Se(null),children:"Hủy bỏ"})]})]}),f==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:t.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:t.modalDetailsList,children:[e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...t.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(ut=infoDetailData.details)==null?void 0:ut.proto})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Server Host:"}),e.jsx("span",{style:t.detailValue,children:(Ht=infoDetailData.details)==null?void 0:Ht.server})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:t.detailValue,children:(He=infoDetailData.details)==null?void 0:He.port})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...t.detailValue,fontFamily:"monospace"},children:(bt=infoDetailData.details)==null?void 0:bt.path})]})]})}),e.jsx("div",{style:t.modalFooter,children:e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>Se(null),children:"Đóng cửa sổ"})})]}),f==="ftp_detail"&&g&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:t.modalSubtitle,children:["Cổng Port: ",g.port]})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>{Se(null),Qt(null)},children:"×"})]}),e.jsx("div",{style:t.modalBody,children:e.jsxs("div",{style:t.modalDetailsList,children:[e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...t.detailValue,fontWeight:700,color:"var(--color-primary)"},children:g.port})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...t.detailValue,fontWeight:700,color:g.error?"var(--color-error)":"var(--color-success)"},children:g.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),g.error&&e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...t.detailValue,color:"var(--color-error)"},children:g.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...t.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:g.path})]})]})}),e.jsx("div",{style:t.modalFooter,children:e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Se(null),Qt(null)},children:"Đóng cửa sổ"})})]}),f==="utilities"&&ot&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:t.modalSubtitle,children:["Máy: ",ot.hostname," · IP: ",ot.local_ip,":",ot.web_port||9173]})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>{Se(null),Yt(null),st(null)},children:"×"})]}),e.jsxs("div",{style:{...t.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[_e&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:_e.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:_e.isError?"#ef4444":"#10b981",border:`1px solid ${_e.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:_e.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:yr?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(Qe,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Nt,onChange:()=>De("scan_auto_open_file",Nt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Rt,onChange:()=>De("scan_auto_open_dir",Rt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500,fontSize:"0.8rem",color:"var(--color-text)"},children:"Lối tắt ngoài Desktop (%TEMP%/GoPrinxAgent/ftp)"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Tạo Shortcut thư mục Scan ra màn hình Desktop cho nhân viên dễ mở"})]}),e.jsx("button",{onClick:()=>{const r=kt.find(p=>p.command==="create_scan_shortcut");We("create_scan_shortcut",(r==null?void 0:r.command_content)||"")},disabled:pe!==null,style:{padding:"6px 12px",fontSize:"0.75rem",borderRadius:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-primary)",color:"var(--color-primary)",cursor:pe!==null?"not-allowed":"pointer",whiteSpace:"nowrap",fontWeight:600,display:"flex",alignItems:"center",gap:"5px"},children:"🔗 Tạo Shortcut Desktop"})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[_r?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(Qe,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsxs(e.Fragment,{children:[kt.length>0?(()=>{const r=kt.filter(D=>D.command!=="dxdiag"&&D.command!=="open_web_setting"),p=r.findIndex(D=>D.command==="sync_all_scanpoints");if(p>-1){const[D]=r.splice(p,1);r.unshift(D)}return r.map(D=>{const V=D.command==="emergency_restart";return e.jsxs("button",{onClick:()=>We(D.command,D.command_content),disabled:pe!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:V?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:pe!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:pe!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:ke=>{pe===null&&(ke.currentTarget.style.borderColor=V?"#ef4444":"var(--color-primary)",ke.currentTarget.style.background=V?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:ke=>{ke.currentTarget.style.borderColor=V?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",ke.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:pe===D.command?e.jsx(Qe,{size:"sm"}):D.icon||"🔧"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:V?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:D.label})]},D.command)})})():e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>Ae("printers"),disabled:pe!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:pe!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:pe!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{pe===null&&(r.currentTarget.style.borderColor="var(--color-primary)",r.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="var(--color-surface-light)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:pe==="printers"?e.jsx(Qe,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>Ae("scan"),disabled:pe!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:pe!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:pe!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{pe===null&&(r.currentTarget.style.borderColor="var(--color-primary)",r.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="var(--color-surface-light)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:pe==="scan"?e.jsx(Qe,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Thư mục Scan"})]})]}),e.jsxs("button",{onClick:()=>{if(!ot)return;gt("check_watchdog"),st({text:"⌛ Đang kiểm tra watchdog...",isError:!1});const r=kt.find(p=>p.command==="check_watchdog");triggerAgentUtilityExec(ot.agent_uid,"check_watchdog",(r==null?void 0:r.command_content)||"").then(p=>{if(p.ok&&p.command_id){const V=Date.now(),ke=setInterval(async()=>{if(Date.now()-V>3e4){clearInterval(ke),st({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),gt(null);return}try{const $e=await getCommandStatus(p.command_id);if($e.status==="success"){clearInterval(ke);const dt=$e.result_payload||$e.result||$e.error||"Hoàn thành";yt({isOpen:!0,title:"🩺 Check Watchdog",content:dt}),st(null),gt(null)}else if($e.status==="failed"){clearInterval(ke);const dt=$e.error||$e.result_payload||$e.result||"Failed";yt({isOpen:!0,title:"🩺 Check Watchdog",content:dt}),st(null),gt(null)}}catch{}},2e3)}else st({text:"❌ "+(p.error||"Không thể gửi lệnh"),isError:!0}),gt(null)}).catch(p=>{st({text:"❌ "+p.message,isError:!0}),gt(null)})},disabled:pe!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:pe!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:pe!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{pe===null&&(r.currentTarget.style.borderColor="var(--color-primary)",r.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="var(--color-surface-light)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:pe==="check_watchdog"?e.jsx(Qe,{size:"sm"}):"🩺"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Check watchdog"})]}),e.jsxs("button",{onClick:z,disabled:pe!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"12px",padding:"16px 8px",cursor:pe!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:pe!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{pe===null&&(r.currentTarget.style.borderColor="#ef4444",r.currentTarget.style.background="rgba(239, 68, 68, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="rgba(239, 68, 68, 0.25)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:pe==="emergency_restart"?e.jsx(Qe,{size:"sm"}):"🔌"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#ef4444",lineHeight:"1.2",wordBreak:"break-word"},children:"Emergency Kill"})]})]}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:m,onChange:r=>Xt(r.target.value),onKeyDown:r=>{r.key==="Enter"&&m.trim()&&Ae("run_command",{command_line:m.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:pe!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{m.trim()&&Ae("run_command",{command_line:m.trim()})},disabled:pe!==null||!m.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:m.trim()?"var(--color-primary)":"var(--color-surface)",color:m.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:m.trim()&&pe===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:pe==="run_command"?e.jsx(Qe,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(r=>e.jsx("button",{onClick:()=>Xt(r.cmd),disabled:pe!==null,title:r.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:m===r.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:m===r.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:pe!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:r.label},r.cmd))})]})]})]})]}),e.jsx("div",{style:t.modalFooter,children:e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Se(null),Yt(null),st(null)},children:"Đóng cửa sổ"})})]}),f==="edit_ip"&&ee&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:r=>{const p=r.target.value;p&&Ft(D=>{if(!D)return null;const V=D.newPort||"2130";return{...D,newIp:`${p}:${V}`,newPort:V}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((Be==null?void 0:Be.agents)||[]).map((r,p)=>{const D=r.local_ip||r.ip||"",V=r.hostname||r.uid||`Agent ${p+1}`;return e.jsxs("option",{value:D,children:[V," (",D,")"]},p)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:ee.newPort||"",onChange:r=>{const p=r.target.value;Ft(D=>{if(!D)return null;let V=D.newIp||"";return V.includes(":")&&(V=V.split(":")[0]),{...D,newPort:p,newIp:p?`${V}:${p}`:V}})},placeholder:"2130",style:t.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:ee.newIp,onChange:r=>{const p=r.target.value;Ft(D=>{if(!D)return null;let V=D.newPort||"2130";return p.includes(":")&&(V=p.split(":")[1].trim()||V),{...D,newIp:p,newPort:V}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:t.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",ee.entry.folder||ee.entry.physical_path||ee.entry.folder_path]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>Se(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...t.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(ee.newIp||"").trim().includes(":")){Ve("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}te()},disabled:!ee.newIp.trim(),children:"Lưu lại"})]})]}),f==="remote_lock"&&Je&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:Je.name})," (",Je.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Se(null),Ve(`Đang gửi lệnh khóa máy ${Je.name}...`,"info",3e3),modifyDeviceAddressss({ip:Je.ip,action:"lock_machine",agent_uid:Je.agentUid}).then(r=>{r.ok?Ve(`Đã gửi lệnh khóa máy ${Je.name} thành công!`,"success"):Ve("Lỗi: "+(r.error||"Failed"),"error")}).catch(r=>{Ve("Lỗi: "+r.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Se(null),Ve(`Đang gửi lệnh mở khóa máy ${Je.name}...`,"info",3e3),modifyDeviceAddressss({ip:Je.ip,action:"enable_machine",agent_uid:Je.agentUid}).then(r=>{r.ok?Ve(`Đã gửi lệnh mở khóa máy ${Je.name} thành công!`,"success"):Ve("Lỗi: "+(r.error||"Failed"),"error")}).catch(r=>{Ve("Lỗi: "+r.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),f==="toshiba_vnc"&&it&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("h3",{style:t.modalTitle,children:["📺 Kết nối VNC - ",it.printerName]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Se(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:je?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:ae?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{Se(null),window.open(`http://${it.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):G?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${it.agentUid}&ip=${it.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async r=>{const p=r.currentTarget.getBoundingClientRect(),D=r.clientX-p.left,V=r.clientY-p.top,ke=D/p.width,$e=V/p.height,dt=Math.round(ke*1024),Wt=Math.round($e*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:it.agentUid,ip:it.ip,port:49105,x:dt,y:Wt})})}catch(pt){console.error("VNC Click error:",pt)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!ae&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:G})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(G),Ve("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),Ve("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${G}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{Se(null),U(it.ip,"","GET",null,!1,it.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(et,{children:F.isOpen&&e.jsx("div",{style:t.confirmOverlay,onClick:()=>Tt(r=>({...r,isOpen:!1})),children:e.jsxs(Ke.div,{style:t.confirmModalCard,onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("h3",{style:t.modalTitle,children:["⚠️ ",F.title]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Tt(r=>({...r,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:F.message})}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var r;Tt(p=>({...p,isOpen:!1})),(r=F.onConfirm)==null||r.call(F)},children:"Đồng ý"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Tt(r=>({...r,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:N.isOpen&&e.jsx("div",{style:t.confirmOverlay,onClick:()=>Ct(r=>({...r,isOpen:!1})),children:e.jsxs(Ke.div,{style:{...t.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Ct(r=>({...r,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((br=N.entry)==null?void 0:br.name)||((vr=N.entry)==null?void 0:vr.name_1)||((Sr=N.entry)==null?void 0:Sr.email_address)||((wr=N.entry)==null?void 0:wr.folder)||((Tr=N.entry)==null?void 0:Tr.registration_no)||"không tên",'"']}),((Cr=N.entry)==null?void 0:Cr.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(kr=N.entry)==null?void 0:kr.registration_no]})]}),e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:t.modalInput,value:N.agentUid,onChange:r=>Ct(p=>({...p,agentUid:r.target.value})),children:(Be&&Be.agents||[]).filter(r=>r.is_agent_active).map(r=>e.jsxs("option",{value:r.agent_uid,children:[r.hostname," (",r.local_ip,")"]},r.agent_uid))}),e.jsx("span",{style:t.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:A,children:"Xác nhận xóa"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Ct(r=>({...r,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:ve.isOpen&&e.jsx("div",{style:t.confirmOverlay,onClick:()=>_t(r=>({...r,isOpen:!1})),children:e.jsxs(Ke.div,{style:t.confirmModalCard,onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>_t(r=>({...r,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:"0 0 12px 0"},children:["Bạn chuẩn bị cài đặt driver ",e.jsxs("strong",{children:['"',ve.driverName,'"']})," từ xa."]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),!(Be!=null&&Be.agents)||Be.agents.filter(r=>r.is_agent_active).length===0?e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-text-secondary)",fontStyle:"italic",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px"},children:"Không có Agent online trong LAN này"}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px",maxHeight:"200px",overflowY:"auto"},children:Be.agents.filter(r=>r.is_agent_active).map(r=>{const p=ve.selectedAgentUids.includes(r.agent_uid);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"0.82rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:p,onChange:D=>{_t(V=>{const ke=V.selectedAgentUids;return D.target.checked?{...V,selectedAgentUids:[...ke,r.agent_uid]}:{...V,selectedAgentUids:ke.filter($e=>$e!==r.agent_uid)}})},style:{width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsxs("span",{children:[r.hostname," (",r.local_ip,")"]})]},r.agent_uid)})})]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:ve.selectedAgentUids.length===0,onClick:()=>{_t(r=>({...r,isOpen:!1})),ve.selectedAgentUids.forEach(r=>{Ee(ve.printerId,ve.brand,ve.model,ve.driverName,ve.driverUrl,r)})},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>_t(r=>({...r,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:b.isOpen&&e.jsx("div",{style:{...t.confirmOverlay,zIndex:170},onClick:()=>qe(r=>({...r,isOpen:!1,error:""})),children:e.jsxs(Ke.div,{style:t.confirmModalCard,onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:b.title}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>qe(r=>({...r,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[b.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:b.value,onChange:r=>qe(p=>({...p,value:r.target.value,error:""})),onKeyDown:r=>{if(r.key==="Enter"){const p=/^(\d{1,3}\.){3}\d{1,3}$/;if(!p.test(b.value.trim())){qe(ke=>({...ke,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const D=(b.changeAllTo||"").trim();if(D&&!p.test(D)){qe(ke=>({...ke,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const V=b.onConfirm;qe(ke=>({...ke,isOpen:!1,error:""})),V(b.value.trim(),D)}r.key==="Escape"&&qe(p=>({...p,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:b.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:r=>{b.error||(r.target.style.borderColor="var(--color-primary)")},onBlur:r=>{b.error||(r.target.style.borderColor="var(--color-surface-light)")}}),b.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:b.changeAllTo||"",onChange:r=>qe(p=>({...p,changeAllTo:r.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:r=>{r.target.style.borderColor="var(--color-primary)"},onBlur:r=>{r.target.style.borderColor="var(--color-surface-light)"}})]}),b.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",b.error]}),b.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:b.scanStatus})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const r=/^(\d{1,3}\.){3}\d{1,3}$/;if(!r.test(b.value.trim())){qe(V=>({...V,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const p=(b.changeAllTo||"").trim();if(p&&!r.test(p)){qe(V=>({...V,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const D=b.onConfirm;qe(V=>({...V,isOpen:!1,error:""})),D(b.value.trim(),p)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>qe(r=>({...r,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(et,{children:Xe.isOpen&&e.jsx("div",{style:{...t.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>yt(r=>({...r,isOpen:!1})),children:e.jsxs(Ke.div,{style:{...t.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:{...t.modalTitle,fontSize:"0.85rem"},children:Xe.title}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>yt(r=>({...r,isOpen:!1})),children:"×"})]}),Xe.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:tt,value:Ce,onChange:r=>pr(r.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),lt&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:lt.startsWith("❌")?"rgba(239,68,68,0.1)":lt.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:lt.startsWith("❌")?"#f87171":lt.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${lt.startsWith("❌")?"rgba(239,68,68,0.15)":lt.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:lt})]}):e.jsx("pre",{ref:tt,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:l(Xe.content)}),e.jsxs("div",{style:{...t.modalFooter,marginTop:"10px"},children:[Xe.title.includes("settings.json")&&e.jsx("button",{disabled:Te,style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:Te?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:Te?"not-allowed":"pointer"},onClick:d,children:Te?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(Xe.title.includes("settings.json")?Ce:l(Xe.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>yt(r=>({...r,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(et,{children:se&&se.isOpen&&e.jsxs("div",{className:"web-preview-modal-overlay",style:{...t.confirmOverlay,zIndex:190,alignItems:"flex-start",paddingTop:"5vh"},onClick:I,children:[e.jsx("style",{children:`
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
            `}),(()=>{let r="Trang cấu hình máy in";if(se.html&&se.html!=="LOADING"&&!se.html.startsWith("ERROR:"))if(se.html==="DIRECT_LAN")r="Kết nối trực tiếp LAN";else{const p=se.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);p&&p[1]&&(r=p[1].trim())}return e.jsxs(Ke.div,{className:"web-preview-modal-card",style:{...t.confirmModalCard,maxWidth:"1200px",width:"95%",height:"85vh",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px"},onClick:p=>p.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:{...t.modalTitle,fontSize:"0.85rem"},children:se.title}),e.jsx("button",{style:t.modalCloseBtn,onClick:I,children:"×"})]}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",gap:"15px",minHeight:0},children:se.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px"},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"var(--color-text-secondary)",fontWeight:500},children:"Đang đợi phản hồi từ Agent..."}),e.jsx("span",{style:{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",textAlign:"center",maxWidth:"320px"},children:"Agent đang kết nối trực tiếp đến máy in và nạp cấu hình..."})]}):se.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"2.2rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600,textAlign:"center"},children:"Lỗi lấy trang Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.75rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"12px",background:"rgba(239, 68, 68, 0.08)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.15)",width:"100%",boxSizing:"border-box",fontFamily:"monospace"},children:se.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255, 255, 255, 0.03)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"var(--color-text)"},children:e.jsxs("span",{children:["🔌 Kết nối: ",e.jsx("strong",{children:ae?"⚡ Trực tiếp LAN":"🌐 Qua Agent"})]})}),e.jsx("button",{onClick:()=>hr(!Gt),style:{background:"none",border:"none",color:"var(--color-primary)",cursor:"pointer",fontWeight:600,fontSize:"0.72rem",display:"flex",alignItems:"center",gap:"4px"},children:Gt?"Thu gọn ▲":"Cài đặt & Chi tiết ▼"})]}),Gt&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",background:"rgba(16, 185, 129, 0.04)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 14px"},children:[e.jsxs("div",{style:{fontSize:"0.74rem",color:"var(--color-text-secondary)"},children:[e.jsx("span",{style:{color:"#10b981",fontWeight:700},children:"🟢 Kết nối Live:"})," ",r," (",e.jsx("span",{style:{fontFamily:"monospace"},children:se.ip}),")"]}),e.jsx("button",{onClick:()=>window.open(`http://${se.ip}/`,"_blank"),style:{padding:"6px 12px",fontSize:"0.72rem",fontWeight:600,background:"#10b981",border:"none",borderRadius:"6px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.15)"},children:"🌐 Mở trực tiếp LAN"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.74rem",fontWeight:600,color:"var(--color-text)"},children:"🔗 Chế độ kết nối:"}),e.jsxs("div",{style:{display:"flex",gap:"6px"},children:[e.jsx("button",{onClick:()=>oe(!1),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:ae?"rgba(255,255,255,0.05)":"var(--color-primary)",color:ae?"var(--color-text-secondary)":"white",border:ae?"1px solid var(--color-surface-light)":"1px solid var(--color-primary)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"🔌 Qua Agent (Từ xa)"}),e.jsx("button",{onClick:()=>oe(!0),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:ae?"#10b981":"rgba(255,255,255,0.05)",color:ae?"white":"var(--color-text-secondary)",border:ae?"1px solid #10b981":"1px solid var(--color-surface-light)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"⚡ Trực tiếp LAN (Cùng Wifi)"})]})]}),ae&&window.location.protocol==="https:"&&e.jsxs("div",{style:{color:"#fbbf24",background:"rgba(251, 191, 36, 0.08)",border:"1px solid rgba(251, 191, 36, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["⚠️ ",e.jsx("strong",{children:"Mixed Content Block:"})," Trình duyệt di động/máy tính sẽ chặn kết nối HTTP trực tiếp đến IP máy in từ trang web bảo mật HTTPS. Để kết nối trực tiếp thành công, hãy mở trang web quản trị qua ",e.jsx("strong",{children:"HTTP"})," hoặc click nút ",e.jsx("strong",{children:"🌐 Mở trực tiếp LAN"})," phía trên để truy cập trong tab mới."]}),ae&&e.jsxs("div",{style:{color:"#60a5fa",background:"rgba(96, 165, 250, 0.08)",border:"1px solid rgba(96, 165, 250, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["💡 ",e.jsx("strong",{children:"Chế độ trực tiếp LAN:"})," Thiết bị kết nối trực tiếp đến IP máy in qua mạng Wifi nội bộ.",e.jsxs("ul",{style:{margin:"4px 0 0 16px",padding:0},children:[e.jsx("li",{children:"Thanh địa chỉ và Lịch sử duyệt sẽ không tự động cập nhật."}),e.jsx("li",{children:"Chức năng thu phóng (Ngang/Dọc) trong iframe không áp dụng (vui lòng zoom bằng thao tác vuốt)."})]})]}),!ae&&e.jsxs("div",{style:{color:"var(--color-text-secondary)",background:"rgba(255, 255, 255, 0.02)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:[e.jsx("strong",{style:{color:"var(--color-primary)"},children:"🛠️ Nhật ký & Thông số kết nối ngược (SSH Reverse Tunnel):"}),e.jsxs("div",{style:{marginTop:"6px",fontFamily:"monospace",display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy khách (Agent Uid):"})," ",se.agentUid]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Địa chỉ IP Máy in:"})," ",se.ip]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng dịch vụ máy in:"})," 80"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy chủ VPS:"})," 31.97.76.62"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng kết nối trên VPS (Assigned Port):"})," ",se.url?se.url.split(":").pop():"Đang cấp phát..."]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Phương thức xác thực:"})," SSH Key pair (Root User)"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Đường dẫn kết nối:"})," ",e.jsx("span",{style:{color:"var(--color-text)"},children:se.url||"N/A"})]}),se.url&&e.jsxs("div",{style:{color:"#fbbf24",marginTop:"4px"},children:["⚠️ Nếu Iframe hiển thị màn hình trắng / lỗi kết nối, có thể do trình duyệt chặn nội dung Mixed Content (HTTP trên trang HTTPS). Hãy click nút ",e.jsx("strong",{children:"🔗 Mở tab mới ↗"})," ở thanh điều khiển phía dưới để xem trực tiếp."]})]})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 12px"},children:[e.jsx("button",{onClick:u,disabled:Fe<=0,style:{background:"none",border:"none",color:Fe<=0?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:Fe<=0?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Back",children:"◀"}),e.jsx("button",{onClick:k,disabled:Fe>=Ge.length-1,style:{background:"none",border:"none",color:Fe>=Ge.length-1?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:Fe>=Ge.length-1?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Forward",children:"▶"}),e.jsx("button",{onClick:()=>U(se.ip,se.path),style:{background:"none",border:"none",color:"var(--color-text)",cursor:"pointer",padding:"4px",fontSize:"0.8rem",display:"flex",alignItems:"center"},title:"Refresh",children:"🔄"}),e.jsxs("div",{style:{flex:1,background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontFamily:"monospace",color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:["http://",se.ip,se.path||"/"]}),se.url&&e.jsx("a",{href:se.url,target:"_blank",rel:"noreferrer",style:{background:"var(--color-primary)",color:"white",border:"none",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",marginLeft:"8px"},title:"Mở trang quản trị Web Image Monitor trong tab mới",children:"🔗 Mở tab mới ↗"})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid var(--color-surface-light)",gap:"15px",paddingBottom:"4px"},children:[e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:ze==="iframe"?600:500,color:ze==="iframe"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:ze==="iframe"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>Zt("iframe"),children:"🌐 Giao diện máy in"}),e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:ze==="html"?600:500,color:ze==="html"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:ze==="html"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>Zt("html"),children:"📄 Xem mã HTML (Text)"})]}),ze==="html"?e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px",flex:1,minHeight:0},children:ae?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"10px",color:"var(--color-text-secondary)",fontSize:"0.76rem",padding:"20px",textAlign:"center"},children:[e.jsx("span",{children:"📄 Chế độ trực tiếp LAN không tải mã nguồn về server."}),e.jsxs("span",{style:{fontSize:"0.70rem",color:"rgba(255,255,255,0.4)"},children:["Hãy chuyển sang chế độ ",e.jsx("strong",{children:"Qua Agent (Từ xa)"})," để phân tích và xem mã nguồn HTML của máy in."]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Mã nguồn HTML gốc từ máy in:"}),e.jsx("button",{style:{border:"none",background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",padding:"4px 10px",borderRadius:"6px",fontSize:"0.72rem",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"},onClick:()=>{navigator.clipboard.writeText(se.html),Ve("Đã copy mã HTML vào clipboard","success")},children:"📋 Copy HTML"})]}),e.jsx("pre",{style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.5,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)"},children:se.html})]})}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↔️ Ngang:"}),e.jsx("button",{onClick:()=>{const p=Math.max(.3,parseFloat((Oe-.05).toFixed(2)));nt(p),ye&&Ze(p)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:Oe,onChange:p=>{const D=parseFloat(p.target.value);nt(D),ye&&Ze(D)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsx("button",{onClick:()=>{const p=Math.min(2,parseFloat((Oe+.05).toFixed(2)));nt(p),ye&&Ze(p)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:"var(--color-text)"},children:[Math.round(Oe*100),"%"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↕️ Dọc:"}),e.jsx("button",{onClick:()=>{const p=Math.max(.3,parseFloat((ft-.05).toFixed(2)));Ze(p),ye&&nt(p)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ye,children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:ft,onChange:p=>{const D=parseFloat(p.target.value);Ze(D),ye&&nt(D)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)",opacity:ye?.5:1},disabled:ye}),e.jsx("button",{onClick:()=>{const p=Math.min(2,parseFloat((ft+.05).toFixed(2)));Ze(p),ye&&nt(p)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ye,children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:ye?"var(--color-text-secondary)":"var(--color-text)"},children:[Math.round(ft*100),"%"]})]}),e.jsx("button",{onClick:()=>{mr(!ye),ye||Ze(Oe)},style:{background:ye?"rgba(124, 106, 247, 0.15)":"var(--color-background)",border:ye?"1px solid var(--color-accent, #7c6af7)":"1px solid var(--color-surface-light)",color:ye?"var(--color-accent, #7c6af7)":"var(--color-text-secondary)",padding:"4px 10px",borderRadius:"6px",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",transition:"all 0.2s ease"},title:ye?"Bỏ liên kết tỷ lệ":"Liên kết tỷ lệ Ngang & Dọc",children:ye?"🔗 Đồng bộ":"🔓 Tự do"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("button",{onClick:()=>{nt(.95),Ze(.95)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"Mặc định"}),e.jsx("button",{onClick:()=>{nt(1),Ze(1)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"100%"}),e.jsx("button",{onClick:()=>{var p;try{const D=jt.current;if(!D)return;const V=D.contentDocument||((p=D.contentWindow)==null?void 0:p.document);if(V&&V.body){const ke=V.body.style.width,$e=V.body.style.transform;V.body.style.transform="none",V.body.style.width="auto";const dt=V.body.scrollWidth||V.documentElement.scrollWidth||1024,Wt=D.clientWidth||800;if(V.body.style.width=ke,V.body.style.transform=$e,dt>0&&Wt>0){let pt=Wt/dt;pt=Math.max(.3,Math.min(1.5,pt)),pt=Math.round(pt*20)/20,nt(pt),ye&&Ze(pt)}}}catch(D){console.error(D)}},style:{background:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)",color:"#10b981",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:600},children:"📐 Vừa khung"})]})]}),e.jsxs("div",{style:{flex:1,minHeight:0,background:"white",borderRadius:"8px",overflow:"hidden",border:"1px solid var(--color-surface-light)",position:"relative"},children:[e.jsx("iframe",{ref:jt,src:se.url?se.url:ae?`http://${se.ip}${se.path||"/"}`:rt,style:{width:"100%",height:"100%",border:"none",background:"white"}}),At&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang đợi phản hồi từ Agent..."})]})]})]})]})}),e.jsxs("div",{style:{...t.modalFooter,marginTop:"15px",flexShrink:0,borderTop:"1px solid var(--color-surface-light)",paddingTop:"12px"},children:[se.html!=="LOADING"&&!se.html.startsWith("ERROR:")&&e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const p=new Blob([se.html],{type:"text/html;charset=utf-8"}),D=URL.createObjectURL(p);window.open(D,"_blank")},children:"↗️ Xem mã HTML gốc"}),e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)",marginLeft:"8px"},onClick:()=>fr(p=>p?{...p,isOpen:!1}:null),children:"Đóng"})]})]})})()]})}),e.jsx(et,{children:Ue.isOpen&&e.jsx(Ke.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>Bt(r=>({...r,isOpen:!1})),children:e.jsxs(Ke.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:r=>r.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[Ue.copierName," · MAC: ",Ue.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>Bt(r=>({...r,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:Ue.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(Ue.jsonData,null,2)),Ve("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(Ue.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>Bt(r=>({...r,isOpen:!1})),children:"Đóng"})})]})})})]})}const Hn=(n={})=>{const{showToast:i,pollCommandStatus:v,utilityCommands:f}=n,[B,G]=j.useState([]),[ne,ie]=j.useState(()=>localStorage.getItem("goxprint_selected_lan_uid")||""),[me,re]=j.useState(!1),[h,P]=j.useState(()=>{try{const c=localStorage.getItem("goxprint_expanded_printers");return c?JSON.parse(c):{}}catch{return{}}}),[Z,T]=j.useState({}),[fe,F]=j.useState({}),[x,M]=j.useState({}),[m,N]=j.useState({isOpen:!1,copier:null,oldIp:"",newIp:"",targetAgentUid:"",status:"",error:""}),ae=j.useRef({}),ee=j.useMemo(()=>localStorage.getItem("goxprint_last_viewed_copier_id"),[]),Ce=j.useCallback(async(c=!1)=>{c&&re(!0);try{const s=await jn(),l=(s==null?void 0:s.rows)||(Array.isArray(s)?s:[]);G(l);try{const g=(s==null?void 0:s.client_ip)||"(Unknown)",w=!!(s!=null&&s.is_allowed),R=(s==null?void 0:s.active_public_ips)||[],L=[];l.forEach(S=>{(S.agents||[]).forEach(C=>{const I=C.public_ip||C.wan_ip||"",A=C.local_ip||"";(I===g||A===g)&&L.push(C)})}),console.log("=================================================="),console.log("🌐 [PUBLIC IP ACCESS CONTROL CHECK]"),console.log("📌 IP Public hiện tại của trình duyệt:",g),console.log("🛡️ Danh sách Public IP đang Active trên Server:",R),console.log("✅ Quyền truy cập toàn bộ LAN (Is Whitelisted/Allowed):",w?"CÓ (FULL ACCESS)":"KHÔNG (LIMITED BY AGENT PUBLIC IP)"),console.log("💻 Danh sách Agent có cùng Public IP với trình duyệt:",L.length>0?L:w?"Đang mở Full LAN (Tất cả Agent)":"Không tìm thấy Agent cùng IP"),console.log("=================================================="),console.log("[FRONTEND SCANPOINTS VPS] DANH SÁCH DANH BẠ TỪ SCANPOINTS VPS (< 3 NGÀY):"),l.forEach(S=>{(S.printers||[]).forEach(C=>{var de;const I=C.address_book_sync||{},A=Array.isArray(I.address_list)?I.address_list:((de=I.address_book_data)==null?void 0:de.address_list)||[],Y=C.mac_address||C.mac_id||"—";A.length>0&&console.log(`📌 Máy in [${C.printer_name||C.name}] - IP: ${C.ip} | MAC: ${Y} (${A.length} điểm scan trong ScanPoints VPS):`,A)})}),console.log("==================================================")}catch(g){console.error("Console log error:",g)}l.length>0&&ie(g=>{if(g&&l.some(R=>R.lan_uid===g))return g;const w=l[0].lan_uid;return localStorage.setItem("goxprint_selected_lan_uid",w),w}),c&&i("Đã cập nhật danh sách mạng LAN","success")}catch(s){console.error("Failed to fetch LAN sites:",s),c&&i(`Không thể tải dữ liệu LAN: ${s.message}`,"error")}finally{re(!1)}},[i]);j.useEffect(()=>{Ce()},[Ce]);const he=j.useMemo(()=>!B||B.length===0?null:B.find(c=>c.lan_uid===ne)||B[0],[B,ne]),Ee=j.useCallback(c=>{if(!c)return;const s=c.lan_uid,l=Date.now();if(!ae.current[s]||l-ae.current[s]>180*1e3){ae.current[s]=l;const g=(c.agents||[]).filter(w=>w.is_agent_active);if(g.length>0){g.sort((R,L)=>{const S=new Date(R.last_seen||R.updated_at||R.last_ping||0).getTime();return new Date(L.last_seen||L.updated_at||L.last_ping||0).getTime()-S});const w=g[0];if(w&&v){i(`⏳ Agent (${w.agent_uid}) đang thực hiện quét ngầm mạng LAN...`,"info",6e3);const R=w,L=(f||[]).find(I=>I.command==="force_subnet_scan"),C={command:"force_subnet_scan",command_content:(L==null?void 0:L.command_content)||"",lead:c.lead};Ie(`/api/agents/${R.agent_uid}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify(C)}).then(I=>{const A=(I==null?void 0:I.command_id)||(I==null?void 0:I.id);A&&v(Number(A),`scan_lan_${s}`,async Y=>{console.log("🔍 [PRINTAGENT RESULT] Kết quả force_subnet_scan:",Y);let de=[];const xe=(Y==null?void 0:Y.result)||(Y==null?void 0:Y.result_payload)||(Y==null?void 0:Y.output)||(Y==null?void 0:Y.error_message)||(Y==null?void 0:Y.raw)||"";if(Array.isArray(xe))de=xe;else if(typeof xe=="string"&&xe.trim()){try{const le=JSON.parse(xe.trim());Array.isArray(le)&&(de=le)}catch{}if(de.length===0)try{let le="";if(xe.includes("__PRINTERS_JSON_START__"))le=xe.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].trim();else{const $=xe.match(/(\[\s*\{[\s\S]*\}\s*\])/);$&&(le=$[1])}if(le){const $=JSON.parse(le);Array.isArray($)&&(de=$)}}catch(le){console.error("🔍 [Frontend] Lỗi parse JSON máy in:",le)}}if(de.length>0){i(`✓ Quét mạng LAN hoàn tất, tìm thấy ${de.length} máy in!`,"success",4e3);try{await Ie("/api/new-devices",{method:"POST",body:JSON.stringify({lan_uid:s||"default",devices:de})})}catch{}Ce()}else i("✓ Quét mạng LAN hoàn tất","success",4e3)},async Y=>{i("[-] Quét mạng LAN có lỗi","error",4e3)},"⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN...")}).catch(I=>{console.error(I)})}}}},[i,v,f]),ge=j.useMemo(()=>{if(!he)return[];const c=(he.printers||[]).filter(s=>{const l=(s.printer_name||"").toLowerCase().trim();return!(l.includes("unknown")||l==="unknown printer"||l.includes("pdf")||l.includes("fax")||l.includes("brother")||l.includes("canon lbp")||l.includes("rustdesk"))});return ee?[...c].sort((s,l)=>{const g=String(s.id)===ee,w=String(l.id)===ee;return g&&!w?-1:!g&&w?1:0}):c},[he,ee]),Q=j.useCallback(c=>{var L;const s=Number(c),l=(L=he==null?void 0:he.printers)==null?void 0:L.find(S=>Number(S.id)===s);if(!l||!he)return"";const g=(he.agents||[]).filter(S=>S.is_agent_active),w=x[s];if(w&&g.some(C=>C.agent_uid===w))return w;const R=g.find(S=>S.agent_uid===l.agent_uid)||g[0];return R?R.agent_uid:l.agent_uid||""},[he,x]),K=c=>{localStorage.setItem("goxprint_last_viewed_copier_id",c)};return j.useEffect(()=>{if(he){const c={};he.printers.forEach(s=>{const l=(he.agents||[]).filter(w=>w.is_agent_active),g=l.find(w=>w.agent_uid===s.agent_uid)||l[0];c[s.id]=g?g.agent_uid:s.agent_uid||""}),M(s=>({...c,...s})),T(s=>{const l={...s};return he.printers.forEach(g=>{const w=g.auth_user||g.user||"",R=g.auth_password||g.password||"",L=(()=>{try{const A=localStorage.getItem(`copier_auth_${g.id}`)||(g.mac_id?localStorage.getItem(`copier_auth_${g.mac_id}`):null);return A?JSON.parse(A):null}catch{return null}})(),S=l[g.id],C=(S==null?void 0:S.user)!==void 0?S.user:w!==""?w:(L==null?void 0:L.user)!==void 0?L.user:"",I=(S==null?void 0:S.pass)!==void 0?S.pass:R!==""?R:(L==null?void 0:L.pass)!==void 0?L.pass:"";l[g.id]={user:C,pass:I}}),l})}},[he]),{lanSites:B,setLanSites:G,selectedLanUid:ne,setSelectedLanUid:ie,selectedLan:he,lanSitesLoading:me,setLanSitesLoading:re,fetchLanSitesData:Ce,triggerLanScan:Ee,filteredPrinters:ge,copierCredentials:Z,setCopierCredentials:T,saveAuthLoading:fe,setSaveAuthLoading:F,handleSaveAuth:async c=>{const s=String(typeof c=="object"?c.id:c),l=typeof c=="object"?c.mac_id||c.mac_address||"":s,g=typeof c=="object"&&(c.printer_type||c.type)||"",w=Z[s]||{user:"",pass:""};try{localStorage.setItem(`copier_auth_${s}`,JSON.stringify(w)),l&&localStorage.setItem(`copier_auth_${l}`,JSON.stringify(w))}catch{}F(R=>({...R,[s]:!0}));try{const R=await In(l||s,w.user,w.pass,l,g);if(R.ok){const L=R.command_id||R.id;L&&v?(i("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),v(L,s,S=>{const C=S!=null&&S.error?` (${S.error})`:S!=null&&S.result?` (${S.result})`:"";i(`Đã test đăng nhập thành công và lưu vào database!${C}`,"success",5e3),G(I=>I.map(A=>({...A,printers:A.printers.map(Y=>String(Y.id)===String(s)||l&&Y.mac_id===l?{...Y,auth_user:w.user,auth_password:w.pass}:Y)}))),F(I=>({...I,[s]:!1}))},S=>{i(`Lỗi Agent lưu Auth: ${S}`,"error"),F(C=>({...C,[s]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(i("Đã lưu tài khoản Web UI máy photocopy thành công","success"),G(S=>S.map(C=>({...C,printers:C.printers.map(I=>String(I.id)===String(s)||l&&I.mac_id===l?{...I,auth_user:w.user,auth_password:w.pass}:I)}))),F(S=>({...S,[s]:!1})))}else throw new Error(R.error||"Lỗi lưu thông tin đăng nhập")}catch(R){i(`Lỗi lưu Auth: ${R.message}`,"error"),F(L=>({...L,[s]:!1}))}},editIpModalData:m,setEditIpModalData:N,handleEditIP:c=>{const s=Q(c.id);N({isOpen:!0,copier:c,oldIp:c.ip||"",newIp:c.ip||"",targetAgentUid:s,status:"",error:""})},handleSaveEditIP:async()=>{if(!m.copier||!m.newIp)return;const c=m.copier,s=m.oldIp,l=m.newIp.trim(),g=m.targetAgentUid;if(!l){N(w=>({...w,error:"Vui lòng nhập địa chỉ IP mới!"}));return}N(w=>({...w,status:"⌛ Đang gửi lệnh đổi IP tới Agent...",error:""})),i(`Đang gửi lệnh đổi IP từ ${s} ➔ ${l}...`,"info",3e3);try{const R=(c.printer_type||c.printer_name||"").toLowerCase().includes("toshiba")?"toshiba_change_ftp":"ricoh_change_ftp",L=await at(g,R,"",{old_ip:s,new_ip:l,printer_ip:s,target_ip:s});if(!L.ok||!L.command_id)throw new Error(L.error||"Không thể tạo lệnh đổi IP");N(S=>({...S,status:"⌛ Agent đang kết nối máy in để thực hiện đổi IP..."})),v&&v(L.command_id,`edit_ip_${c.id}`,S=>{i(`✓ Đã đổi IP thành công từ ${s} ➔ ${l}!`,"success",5e3),G(C=>C.map(I=>({...I,printers:I.printers.map(A=>String(A.id)===String(c.id)||A.mac_id===c.mac_id?{...A,ip:l}:A)}))),N(C=>({...C,isOpen:!1,status:"",error:""}))},S=>{i(`[-] Lỗi đổi IP: ${S}`,"error"),N(C=>({...C,status:"",error:S}))},"⏳ Agent đang cập nhật địa chỉ IP trên máy photo...")}catch(w){N(R=>({...R,status:"",error:w.message||"Lỗi không xác định"})),i(`Lỗi gửi lệnh đổi IP: ${w.message}`,"error")}},expandedPrinters:h,setExpandedPrinters:P,selectedTargetAgents:x,setSelectedTargetAgents:M,getTargetAgentUid:Q,handleCopierClick:K}},Ar=new Set(["get_agent_ip","get_public_ip","view_settings_json","view_printers_json","view_scan_points_json","view_agent_loader_debug","view_stout","view_sterror","dxdiag","printers","clean_temp","scan","ricoh_list_scan","toshiba_list_scan"]),Pr={get_agent_ip:"Địa chỉ IP Local của Agent",get_public_ip:"Địa chỉ IP Public (Internet)",view_settings_json:"Nội dung tệp settings.json",view_printers_json:"Nội dung tệp printers.json",view_scan_points_json:"Nội dung tệp scan_points.json",view_agent_loader_debug:"Nội dung tệp agent_loader_debug.txt",view_stout:"Nội dung tệp stout.txt (1000 dòng cuối)",view_sterror:"Nội dung tệp sterror.txt (1000 dòng cuối)",dxdiag:"Kết quả kiểm tra cấu hình hệ thống (DxDiag)",printers:"Danh sách máy in hệ thống",clean_temp:"Kết quả dọn dẹp thư mục tạm & Driver",scan:"Nội dung thư mục Scan gốc (%TEMP%/GoPrinxAgent/ftp)",ricoh_list_scan:"Danh bạ Scan trên máy photo Ricoh",toshiba_list_scan:"Danh bạ Scan trên máy photo Toshiba"},Wn=(n={})=>{const{showToast:i,setViewOutputModal:v,setIpInputModal:f}=n,[B,G]=j.useState([]),[ne,ie]=j.useState(!1),[me,re]=j.useState(!1),[h,P]=j.useState(null),[Z,T]=j.useState(null),[fe,F]=j.useState(null),[x,M]=j.useState(""),[m,N]=j.useState(!1),[ae,ee]=j.useState(""),[Ce,he]=j.useState("ping 8.8.8.8"),Ee=j.useCallback((U,c,s,l,g)=>{var C;(C=n.setCommandStatus)==null||C.call(n,I=>({...I,[c]:{message:g||"Đang thực thi lệnh...",isPending:!0}}));const w=1500,R=6e4,L=Date.now(),S=setInterval(async()=>{var A,Y,de,xe,le;const I=Date.now()-L;if(I>R){clearInterval(S),(A=n.setCommandStatus)==null||A.call(n,$=>({...$,[c]:{message:"Lỗi: Quá thời gian chờ (Timeout 60s)",isPending:!1}})),l&&l("Quá thời gian chờ (Timeout 60s)");return}try{const $=await St(U);if($.ok&&$.status==="success"){clearInterval(S);const z=$.result?` (${$.result})`:"";(Y=n.setCommandStatus)==null||Y.call(n,o=>({...o,[c]:{message:`Đã hoàn tất thành công!${z}`,isPending:!1}})),s($)}else if($.ok&&$.status==="failed"){clearInterval(S);const z=$.error||$.error_message||$.result||"Thực thi thất bại";(de=n.setCommandStatus)==null||de.call(n,o=>({...o,[c]:{message:`Lỗi: ${z}`,isPending:!1}})),l&&l(z)}else{const z=$.received_at?`Agent đã nhận lệnh (${Math.round(I/1e3)}s)...`:`Đang gửi lệnh tới Agent (${Math.round(I/1e3)}s)...`;(xe=n.setCommandStatus)==null||xe.call(n,o=>({...o,[c]:{message:z,isPending:!0}}))}}catch($){clearInterval(S),(le=n.setCommandStatus)==null||le.call(n,z=>({...z,[c]:{message:`Lỗi kết nối: ${$.message||"Lỗi polling"}`,isPending:!1}})),l&&l($.message||"Lệnh thực hiện thất bại từ Agent")}},w)},[n]),ge=async(U,c,s)=>{try{const l=await Dn(U,10),w=(l.jobs||l.commands||[]).filter(R=>R.status==="pending"&&R.command_type===c);return s?w.some(R=>{const L=R.command_params||{};return Object.keys(s).every(S=>String(L[S])===String(s[S]))}):w.length>0}catch{return!1}},Q=j.useCallback(async U=>{re(!0),ee("");try{const c=await at(U,"view_settings_json","");if(!c.ok||!c.command_id)throw new Error(c.error||"Không thể gửi lệnh xem settings.json");Ee(c.command_id,"view_settings",s=>{const l=typeof s.result_payload=="object"&&s.result_payload?JSON.stringify(s.result_payload,null,2):s.result_payload||s.result||"";M(l),re(!1)},s=>{ee(`❌ Không thể nạp settings.json: ${s}`),re(!1)},"⌛ Đang nạp settings.json từ Agent...")}catch(c){ee(`❌ Lỗi nạp cấu hình: ${c.message}`),re(!1)}},[Ee]),K=async U=>{if(!U||!x)return;try{JSON.parse(x)}catch(s){ee(`❌ Lỗi định dạng JSON: ${s.message}`);return}N(!0),ee("⌛ Đang gửi cấu hình mới tới Agent...");const c=btoa(unescape(encodeURIComponent(x)));try{const s=(B||[]).find(R=>R.command==="save_settings_json"),l=(s==null?void 0:s.command_content)||"",g=await at(U,"save_settings_json",l,{base64_content:c});if(!g.ok||!g.command_id)throw new Error(g.error||"Không thể tạo lệnh tiện ích");const w=g.command_id;Ee(w,"save_settings",()=>{ee("✅ Đã lưu và nạp lại cấu hình settings.json thành công!"),N(!1),i&&i("Đã lưu cấu hình Agent thành công","success")},R=>{ee(`❌ Lỗi lưu cấu hình: ${R}`),N(!1)},"⌛ Agent đang ghi đè tệp settings.json...")}catch(s){ee(`❌ Lỗi gửi lệnh: ${s.message}`),N(!1)}},ce=j.useCallback(async(U,c,s,l={})=>{let g=fe,w="",R="",L={};if(typeof U=="string"?(w=U,R=c||w,L=s||{}):(g=U||fe,w=c||"",R=s||w,L=l||{}),!!g){T(w),P({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const S=await Mn(g.agent_uid,R,L);if(!S.ok||!S.command_id)throw new Error(S.error||"Không thể tạo lệnh tiện ích");const C=S.command_id,I=6e4,A=1e3,Y=Date.now(),de=setInterval(async()=>{try{const xe=Date.now()-Y;if(xe>I){clearInterval(de),P({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),T(null);return}const le=await St(C);if(le.status==="success")clearInterval(de),P({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),T(null);else if(le.status==="failed"||!le.ok)clearInterval(de),P({text:`❌ Thất bại: ${le.error||"Lệnh thất bại từ Agent"}`,isError:!0}),T(null);else{const $=Math.round(xe/1e3);le.received_at?P({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${$}s)`,isError:!1}):P({text:`⌛ Đang chuyển lệnh tới Agent... (${$}s)`,isError:!1})}}catch(xe){console.error("Error polling utility status:",xe)}},A)}catch(S){console.error(`Failed to trigger ${w}:`,S),P({text:`Lỗi kết nối hoặc gửi lệnh: ${S.message}`,isError:!0}),T(null)}}},[fe]),_=j.useCallback(async(U,c,s)=>{let l=fe,g="",w="";if(typeof U=="string"?(g=U,w=c||""):(l=U||fe,g=c||"",w=s||""),!l)return;if(await ge(l.agent_uid,"trigger_utility",{action:"exec_utility",command:g})){i&&i("Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!","info");return}const L=B.find(I=>I.command===g),S=(L==null?void 0:L.output_modal)||Ar.has(g),C=(L==null?void 0:L.label)||Pr[g]||g;if(g==="change_agent_ip"||g==="check_scan_ip_match"){const I=g==="change_agent_ip",A=(l==null?void 0:l.local_ip)||(l==null?void 0:l.ip)||(l==null?void 0:l.agent_ip)||(l==null?void 0:l.localIp)||"";f&&f({isOpen:!0,title:I?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:I?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:A,changeAllTo:"",scanStatus:I?"⏳ Loading... Đang quét điểm scan FTP trên máy photo...":"",error:"",onConfirm:(Y,de)=>{const xe=w.replace("__TARGET_IP__",Y);T(g),P({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),at(l.agent_uid,g,xe,{target_ip:Y,ip:Y,printer_ip:Y,change_all_to:de||""}).then(le=>{if(!le.ok||!le.command_id)throw new Error(le.error||"Không thể tạo lệnh tiện ích");const $=le.command_id,z=6e4,o=Date.now(),u=setInterval(async()=>{try{const k=Date.now()-o;if(k>z){clearInterval(u),P({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),T(null);return}const E=await St($);if(E.status==="success")clearInterval(u),S&&v?v({isOpen:!0,title:C,content:typeof E.result_payload=="object"&&E.result_payload?JSON.stringify(E.result_payload,null,2):E.result_payload||E.error||E.result||"(không có nội dung)",rawPayload:E.result_payload||E.result||""}):P({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),T(null);else if(E.status==="failed"||!E.ok)clearInterval(u),P({text:`❌ Thất bại: ${E.error||"Lệnh thất bại từ Agent"}`,isError:!0}),T(null);else{const W=Math.round(k/1e3);P({text:`⌛ Agent đang thực hiện lệnh... (${W}s)`,isError:!1})}}catch(k){console.error("Error polling status:",k)}},1e3)}).catch(le=>{P({text:`Lỗi gửi lệnh: ${le.message}`,isError:!0}),T(null)})}});return}T(g),P({text:"⌛ Đang gửi lệnh thực thi tới Agent...",isError:!1});try{const I=await at(l.agent_uid,g,w);if(!I.ok||!I.command_id)throw new Error(I.error||"Không thể tạo lệnh tiện ích");const A=I.command_id,Y=6e4,de=1e3,xe=Date.now(),le=setInterval(async()=>{try{const $=Date.now()-xe;if($>Y){clearInterval(le),P({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),T(null);return}const z=await St(A);if(z.status==="success")clearInterval(le),S&&v?v({isOpen:!0,title:C,content:typeof z.result_payload=="object"&&z.result_payload?JSON.stringify(z.result_payload,null,2):z.result_payload||z.error||z.result||"(không có nội dung)",rawPayload:z.result_payload||z.result||""}):P({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),T(null);else if(z.status==="failed"||!z.ok)clearInterval(le),S&&v?v({isOpen:!0,title:C,content:z.error||typeof z.result_payload=="object"&&z.result_payload?JSON.stringify(z.result_payload,null,2):z.result_payload||z.result||"(không có nội dung)",rawPayload:z.result_payload||z.result||""}):P({text:`❌ Thất bại: ${z.error||"Lệnh thất bại từ Agent"}`,isError:!0}),T(null);else{const o=Math.round($/1e3),u=z.progress_text||`Đang xử lý... (${o}s)`;P({text:`⌛ ${u}`,isError:!1})}}catch($){const z=($==null?void 0:$.message)||String($||"");S&&v&&(z.startsWith("[PATH]")||z.includes("stout")||z.includes("sterror")||z.includes("settings.json"))?(clearInterval(le),v({isOpen:!0,title:C,content:z,rawPayload:z}),P(null),T(null)):console.error("Poll error:",$)}},de)}catch(I){P({text:`Lỗi: ${I.message}`,isError:!0}),T(null)}},[fe,B,i,f,v]);return{VIEW_COMMANDS:Ar,VIEW_COMMAND_TITLES:Pr,utilityCommands:B,setUtilityCommands:G,utilityCommandsLoading:ne,setUtilityCommandsLoading:ie,utilitySettingsLoading:me,setUtilitySettingsLoading:re,utilityStatusMsg:h,setUtilityStatusMsg:P,utilityActionPending:Z,setUtilityActionPending:T,selectedUtilityAgent:fe,setSelectedUtilityAgent:F,editableSettingsText:x,setEditableSettingsText:M,isSavingSettings:m,setIsSavingSettings:N,settingsSaveStatus:ae,setSettingsSaveStatus:ee,customRunCommand:Ce,setCustomRunCommand:he,pollCommandStatus:Ee,loadUtilitySettings:Q,handleSaveSettings:K,handleTriggerUtility:ce,handleTriggerUtilityExec:_}},Vn=(n={})=>{const{showToast:i,pollCommandStatus:v}=n,[f,B]=j.useState({isOpen:!1,copier:null,url:"",tunnelUrl:"",directUrl:"",auth:{user:"",pass:""}}),[G,ne]=j.useState("tunnel"),[ie,me]=j.useState(!1),[re,h]=j.useState([]),[P,Z]=j.useState(-1),[T,fe]=j.useState(!1),[F,x]=j.useState(null),M=j.useRef(null),[m,N]=j.useState({isOpen:!1,printerId:"",copier:null,targetAgentUid:"",status:"",error:""}),ae=j.useCallback(()=>{F&&(URL.revokeObjectURL(F),x(null)),B(Q=>({...Q,isOpen:!1}))},[F]),ee=j.useCallback(async(Q,K,ce="/")=>{if(!Q){i&&i("Không tìm thấy Agent UID","error");return}const _=(c,s)=>`
      <html>
        <head>
          <title>${c}</title>
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
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${c}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${s}</div>
        </body>
      </html>
    `,U=window.open("about:blank","_blank");U&&U.document.write(_("Đang kết nối tên miền...",`Đang kết nối đến máy in ${K} qua tên miền *.app.goxprint.com...`)),me(!0);try{const l=await(await fetch(`https://agentapi.quanlymay.com/api/agents/${Q}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:K,printer_port:80})})).json();l.ok&&l.url?U&&(U.location.href=l.url):(U&&U.close(),i&&i("Kết nối lỗi: "+(l.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch(c){U&&U.close(),i&&i("Lỗi hệ thống VPS: "+(c.message||c),"error")}finally{me(!1)}},[i]),Ce=j.useCallback(()=>{if(P>0){const Q=re[P-1];Z(P-1),f.copier&&ee(f.copier.agent_uid,f.copier.ip,Q)}},[P,re,f,ee]),he=j.useCallback(()=>{if(P<re.length-1){const Q=re[P+1];Z(P+1),f.copier&&ee(f.copier.agent_uid,f.copier.ip,Q)}},[P,re,f,ee]);return{webPreviewModal:f,setWebPreviewModal:B,webPreviewTab:G,setWebPreviewTab:ne,webPreviewLoading:ie,setWebPreviewLoading:me,webPreviewHistory:re,setWebPreviewHistory:h,webPreviewHistoryIndex:P,setWebPreviewHistoryIndex:Z,showPreviewDetails:T,setShowPreviewDetails:fe,previewBlobUrl:F,setPreviewBlobUrl:x,previewIframeRef:M,handleCloseWebPreview:ae,fetchRemotePage:ee,handleHistoryBack:Ce,handleHistoryForward:he,installDriverModal:m,setInstallDriverModal:N,handleRemoteInstallDriver:(Q,K,ce)=>{N({isOpen:!0,printerId:String(Q),copier:K,targetAgentUid:ce,status:"",error:""})},executeRemoteInstallDriver:async()=>{if(!m.copier||!m.targetAgentUid)return;const{printerId:Q,copier:K,targetAgentUid:ce}=m;N(_=>({..._,status:"⌛ Đang gửi lệnh cài đặt Driver tới Agent...",error:""})),i&&i("Đang tạo lệnh tải và cài đặt Driver máy in tự động...","info",3e3);try{const _=await Rr(ce,K.ip,K.printer_name||K.name||"Printer",K.printer_type||K.brand||"");if(!_.ok||!_.command_id)throw new Error(_.error||"Không thể tạo lệnh cài driver");N(U=>({...U,status:"⌛ Agent đang tải gói Driver và tiến hành Silent Install..."})),v&&v(_.command_id,`install_driver_${Q}`,U=>{i&&i("✓ Đã cài đặt Driver máy in thành công lên máy Agent!","success",5e3),N(c=>({...c,isOpen:!1,status:"",error:""}))},U=>{i&&i(`[-] Lỗi cài đặt Driver: ${U}`,"error"),N(c=>({...c,status:"",error:U}))},"⏳ Agent đang cài đặt Driver vào hệ thống Windows...")}catch(_){N(U=>({...U,status:"",error:_.message||"Lỗi không xác định"})),i&&i(`Lỗi cài đặt Driver: ${_.message}`,"error")}}}},$n=(n={})=>{const{showToast:i,pollCommandStatus:v,setViewOutputModal:f}=n,[B,G]=j.useState({isOpen:!1,agentUid:"",agentName:"",currentPath:"",items:[],loading:!1,error:""}),[ne,ie]=j.useState([]),[me,re]=j.useState(!1),[h,P]=j.useState({isOpen:!1,printer:null,data:null,rawJson:""}),Z=(F,x)=>{if(!x||x===".")return F;if(x===".."){const M=F.split("/").filter(Boolean);return M.pop(),M.join("/")||""}return F?`${F}/${x}`:x},T=j.useCallback(async(F,x,M="")=>{G({isOpen:!0,agentUid:F,agentName:x,currentPath:M,items:[],loading:!0,error:""});try{const m=await Lr(F,M);if(m.ok)G(N=>({...N,items:m.items||m.files||[],loading:!1}));else throw new Error(m.error||"Không thể tải danh sách tệp")}catch(m){G(N=>({...N,loading:!1,error:m.message||"Lỗi kết nối tới Agent"})),i&&i(`Không thể mở thư mục lưu trữ: ${m.message}`,"error")}},[i]),fe=j.useCallback(async(F,x)=>{if(F){i&&i("⌛ Đang tải file scan_points.json từ Agent...","info",3e3);try{const M=await at(F,"view_scan_points_json","");if(!M.ok||!M.command_id)throw new Error(M.error||"Không thể tạo lệnh xem file scan_points.json");v&&v(M.command_id,`view_scan_points_${(x==null?void 0:x.id)||"json"}`,m=>{const N=m.result_payload||m.result||"";let ae=null;if(typeof N=="object"&&N!==null)ae=N;else if(typeof N=="string")try{ae=JSON.parse(N)}catch{ae=null}const ee=ae?JSON.stringify(ae,null,2):String(N);P({isOpen:!0,printer:x,data:ae,rawJson:ee}),f&&f({isOpen:!0,title:`📋 Danh bạ Scan (${(x==null?void 0:x.printer_name)||(x==null?void 0:x.name)||"Copier"})`,content:ee,rawPayload:N})},m=>{i&&i(`Lỗi xem scan_points.json: ${m}`,"error")},"⏳ Agent đang đọc file scan_points.json...")}catch(M){i&&i(`Lỗi đọc file scan_points.json: ${M.message}`,"error")}}},[i,v,f]);return{storageModalData:B,setStorageModalData:G,storageFiles:ne,setStorageFiles:ie,storageLoading:me,setStorageLoading:re,handleOpenStorageFiles:T,resolveRelativePath:Z,scanPointsViewerModal:h,setScanPointsViewerModal:P,handleViewScanPointsJson:fe}},Kn=(n={})=>{const[i,v]=j.useState([]),f=j.useCallback((s,l="info",g=3e3)=>{const w=Date.now().toString()+Math.random().toString().slice(2,6);v(R=>[...R,{id:w,message:s,type:l}]),setTimeout(()=>{v(R=>R.filter(L=>L.id!==w))},g)},[]),[B,G]=j.useState("copiers"),[ne,ie]=j.useState({}),[me,re]=j.useState(null),[h,P]=j.useState({isOpen:!1,title:"",message:""}),[Z,T]=j.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[fe,F]=j.useState({isOpen:!1,title:"",content:"",rawPayload:null}),[x,M]=j.useState({isOpen:!1,title:"",hint:"",value:"",changeAllTo:"",scanStatus:"",error:""}),[m,N]=j.useState({printerId:"",name:"",email:"",agentUid:""}),[ae,ee]=j.useState(!1),[Ce,he]=j.useState({lanUid:"",agentUid:"",email:""}),[Ee,ge]=j.useState(!1),[Q,K]=j.useState(null),ce=Wn({showToast:f,setViewOutputModal:F,setIpInputModal:M,setCommandStatus:ie}),_=Hn({showToast:f,pollCommandStatus:ce.pollCommandStatus,utilityCommands:ce.utilityCommands}),U=Vn({showToast:f,pollCommandStatus:ce.pollCommandStatus}),c=$n({showToast:f,pollCommandStatus:ce.pollCommandStatus,setViewOutputModal:F});return{toasts:i,showToast:f,activeTab:B,setActiveTab:G,commandStatus:ne,setCommandStatus:ie,activeModal:me,setActiveModal:re,confirmModal:h,setConfirmModal:P,deleteScanPointModal:Z,setDeleteScanPointModal:T,viewOutputModal:fe,setViewOutputModal:F,ipInputModal:x,setIpInputModal:M,publicFtpData:m,setPublicFtpData:N,publicFtpLoading:ae,setPublicFtpLoading:ee,privateFtpData:Ce,setPrivateFtpData:he,privateFtpLoading:Ee,setPrivateFtpLoading:ge,getDestinationStatus:()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:()=>({label:"✔ ACTIVE",type:"success",title:""}),..._,...ce,...U,...c}},vt="https://agentapi.quanlymay.com",Jn=(n={})=>{const{cameraForm:i,cameras:v,customRecordDuration:f,directLan:B,fetchCameraFiles:G,fetchCameraStatus:ne,fetchCameras:ie,isRecording30s:me,setActiveModal:re,setAllocatedVncAddr:h,setCameraTestLoading:P,setCameraTestResult:Z,setIsRecording30s:T,setRecording30sCountdown:fe,setSelectedCamera:F,setToshibaVncData:x,setVncTunnelLoading:M,showToast:m}=n;return{cameraForm:i,cameras:v,customRecordDuration:f,directLan:B,fetchCameraFiles:G,fetchCameraStatus:ne,fetchCameras:ie,handleDeleteCamera:async(ge,Q)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{const ce=await(await fetch(`${vt}/api/agents/${ge}/cameras/${Q}/delete`,{method:"POST"})).json();ce.ok?(m("Đã xóa camera thành công!","success"),ie(ge),F(null)):m("Lỗi xóa camera: "+ce.error,"error")}catch(K){m("Lỗi hệ thống: "+K.message,"error")}},handleDeleteCameraFile:async(ge,Q,K)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${K}`))try{const _=await(await fetch(`${vt}/api/agents/${ge}/cameras/${Q}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:K})})).json();_.ok?(m("Đã xóa tệp video thành công!","success"),G(ge,Q)):m("Lỗi xóa tệp: "+_.error,"error")}catch(ce){m("Lỗi hệ thống: "+ce.message,"error")}},handleRecord30s:async(ge,Q)=>{if(me)return;const K=v.find(c=>c.id===Q),ce=(K==null?void 0:K.mac_address)||"";if(!ce){m("Camera không có thông tin MAC ID để điều khiển!","error");return}T(!0),fe(f);let _=f;const U=setInterval(()=>{_-=1,fe(Math.max(_,0)),_<=0&&clearInterval(U)},1e3);try{m(`Đang gửi yêu cầu ghi hình ${f}s...`,"info");const s=await(await fetch(`${vt}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:ce,action:"record",duration:f})})).json();clearInterval(U),s.ok?m(s.message||`Ghi hình ${f}s hoàn tất!`,"success"):m("Lỗi ghi hình: "+s.error,"error")}catch(c){clearInterval(U),m("Lỗi kết nối ghi hình: "+c.message,"error")}finally{T(!1),setTimeout(()=>{ne(ge,Q),G(ge,Q)},1500)}},handleSaveCameraConfig:async ge=>{try{const K=await(await fetch(`${vt}/api/agents/${ge}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();K.ok?(m("Đã lưu cấu hình camera thành công!","success"),ie(ge),F(null)):m("Lỗi lưu cấu hình: "+K.error,"error")}catch(Q){m("Lỗi hệ thống: "+Q.message,"error")}},handleStartToshibaVnc:async(ge,Q,K)=>{if(x({ip:ge,printerName:Q,agentUid:K}),h(""),re("toshiba_vnc"),B){h(`${ge}:49105`);return}M(!0);try{const _=await(await fetch(`${vt}/api/agents/${K}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:ge,printer_port:49105})})).json();if(_.ok&&_.url_port){const U=_.url_port.replace("http://","").replace("https://","");h(U)}else m("Không thể mở đường hầm VNC: "+(_.error||"Lỗi không xác định"),"error"),re(null)}catch(ce){m("Lỗi kết nối VPS: "+(ce.message||ce),"error"),re(null)}finally{M(!1)}},handleTestCameraConnection:async ge=>{P(!0),Z(null);try{const K=await(await fetch(`${vt}/api/agents/${ge}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:i.rtsp_url})})).json();K.ok&&K.result?Z(K.result):Z({ok:!1,msg:K.error||"Lỗi kiểm tra kết nối"})}catch(Q){Z({ok:!1,msg:"Lỗi: "+Q.message})}finally{P(!1)}},isRecording30s:me,setActiveModal:re,setAllocatedVncAddr:h,setCameraTestLoading:P,setCameraTestResult:Z,setIsRecording30s:T,setRecording30sCountdown:fe,setSelectedCamera:F,setToshibaVncData:x,setVncTunnelLoading:M,showToast:m}},qn={ricoh_create_scan:`import requests
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
    m = re.search(r'wimTokens*[:=]s*["']?([^"'s;>]+)["']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'names*=s*["']?wimToken["']?[^>]*?values*=s*["']?([^"'s>]+)["']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'values*=s*["']?([^"'s>]+)["']?[^>]*?names*=s*["']?wimToken["']?', html, re.IGNORECASE)
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
    raw_entries = parse_ajax_address_list(ajax_resp.text)
    if not raw_entries:
        raw_entries = parse_html_address_list(resp.text)
    print(f"  -> Tổng số điểm scan tìm thấy trên máy in: {len(raw_entries)}")
    
    for idx, item in enumerate(raw_entries, 1):
        eid = item["entry_id"]
        reg = item["registration_no"]
        name = item["name"]
        if eid == target_id or reg == target_id or reg.lstrip('0') == target_id.lstrip('0') or (target_name and name.lower() == target_name.lower()):
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

    print("  -> Lấy wimToken MỚI từ adrsList.cgi...")
    fresh_resp = session.get(list_url, timeout=10)
    fresh_token = extract_wim_token(fresh_resp.text)
    if fresh_token:
        wim_token = fresh_token

    print("")
    print(f"[5/5] Đang gửi POST xóa Mã ĐK '{reg_to_delete}' (Entry ID: {entry_id_to_delete})...")
    conf_url = f"{BASE_URL}/web/entry/en/address/adrsConfDeleteEntry.cgi"
    del_url = f"{BASE_URL}/web/entry/en/address/adrsDeleteEntry.cgi"
    
    del_val = str(entry_id_to_delete or reg_to_delete)
    reg_val = str(reg_to_delete)
    
    # Step 1: POST to adrsConfDeleteEntry.cgi
    form1 = {
        "wimToken": wim_token,
        "entryIndex": del_val,
        "entryIndexIn": del_val,
        "regiNoListIn": del_val,
        "selectedRegiNoIn": del_val,
        "deleteListIn": del_val,
        "wayFrom": "adrsList.cgi?modeIn=LIST_ALL",
        "wayTo": "adrsDeleteEntry.cgi",
        "deleteRegNo": reg_val
    }
    r_conf = session.post(conf_url, files={k: (None, str(v)) for k, v in form1.items()}, headers={"Referer": list_url}, timeout=10)
    confirm_token = extract_wim_token(r_conf.text) or wim_token
    print(f"  -> Trích xuất confirm wimToken từ bước 1: '{confirm_token}'")

    # Step 2: POST to adrsDeleteEntry.cgi
    form2 = {
        "wimToken": confirm_token,
        "entryIndex": del_val,
        "entryIndexIn": del_val,
        "regiNoListIn": del_val,
        "selectedRegiNoIn": del_val,
        "deleteListIn": del_val,
        "wayFrom": "adrsConfDeleteEntry.cgi",
        "wayTo": "adrsList.cgi?modeIn=LIST_ALL",
        "deleteRegNo": reg_val
    }
    session.post(del_url, files={k: (None, str(v)) for k, v in form2.items()}, headers={"Referer": conf_url}, timeout=10)
    
    time.sleep(2.0)
    
    # Verification Step
    print("  -> Đang xác minh lại danh bạ máy in sau khi xóa...")
    v_list_resp = session.get(list_url, timeout=10)
    v_token = extract_wim_token(v_list_resp.text) or wim_token
    v_ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={v_token}"
    v_ajax = session.get(v_ajax_url, timeout=10)
    
    still_exists = False
    v_raw_entries = parse_ajax_address_list(v_ajax.text) or parse_html_address_list(v_list_resp.text)
    for item in v_raw_entries:
        v_eid = item["entry_id"]
        v_reg = item["registration_no"]
        v_name = item["name"]
        if v_eid == entry_id_to_delete or v_reg == reg_to_delete or v_reg.lstrip('0') == reg_to_delete.lstrip('0') or (target_name and v_name.lower() == target_name.lower()):
            still_exists = True
            break

    if still_exists:
        raise RuntimeError(f"KHÔNG THỂ XÓA: Đã gửi yêu cầu xóa nhưng Mã ĐK '{reg_to_delete}' (Tên: '{target_name}') vẫn còn trên máy in Ricoh!")

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
    global BASE_URL
    session = requests.Session()
    session.verify = False
    try:
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    except Exception:
        pass
    logout(session)
    time.sleep(0.5)
    print(f"[2/4] Đang đăng nhập Web Image Monitor ({BASE_URL})...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    try:
        resp = session.get(form_url, timeout=5, verify=False)
    except Exception as net_err:
        if BASE_URL.startswith("http://"):
            print(f"  [!] HTTP port 80 timeout/lỗi ({net_err}). Tự động thử HTTPS (port 443)...")
            BASE_URL = f"https://{IP}"
            form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
            resp = session.get(form_url, timeout=8, verify=False)
        else:
            raise net_err
    wim_token = extract_wim_token(resp.text)
    login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode()
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
    data = {"userid": encoded_user, "username": encoded_user, "password": encoded_pass, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}
    r_log = session.post(login_url, data=data, headers={"Referer": form_url}, timeout=8, verify=False)
    if "Authentication has failed" in r_log.text or "not correct" in r_log.text:
        raise RuntimeError("Sai tài khoản hoặc mật khẩu đăng nhập Ricoh WIM!")
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
    for p in ["123456", "1234", "12345", "admin", ""]:
        if p not in pws: pws.append(p)

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
        print(f"__ADDRESS_BOOK_JSON_START__
{json.dumps(final_result, ensure_ascii=False)}
__ADDRESS_BOOK_JSON_END__")

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
`},Xn="https://agentapi.quanlymay.com";function jr(n,i,v){const f=n.email_address||n.email||"",B=n.physical_path||n.folder||n.folder_path||"",G=(f||B||"").trim();if(!G)return{label:"UNKNOWN",type:"error",title:""};if(n.type==="Email"||f.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const ie=(i||[]).find(h=>(h.email||"").toLowerCase().trim()===G.toLowerCase().trim()),me=ie?ie.email_number:Number(n.registration_no);if(!me||isNaN(me))return{label:"✔ ACTIVE",type:"success",title:""};const re=(v||[]).find(h=>h.is_master&&h.is_agent_active)||(v||[]).find(h=>h.is_agent_active)||(v||[])[0];if(re){const h=(re.ftp_sites||[]).find(P=>Number(P.port)===Number(me));if(h){const P=("C:/Scangox/"+G).toLowerCase().replace(/\\/g,"/"),T=(h.path||"").toLowerCase().replace(/\\/g,"/")===P;return h.running&&T?{label:"✔ OK",type:"success",title:""}:h.running&&!T?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${h.path} instead of expected: C:/Scangox/${G}`}:h.error&&(h.error.toLowerCase().includes("in use")||h.error.toLowerCase().includes("busy")||h.error.toLowerCase().includes("already bound")||h.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:h.error}:{label:"❌ FAILED",type:"error",title:h.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}const Qn=(n={})=>{const{activeAgentUid:i,cameras:v,copierCredentials:f={},deleteScanPointModal:B,editIpModalData:G,fetchLanSitesData:ne,getTargetAgentUid:ie,isDuplicatePending:me,lanSites:re=[],pollCommandStatus:h,queryDuration:P,queryTimestamp:Z,replaceToast:T,saveScanPointToDb:fe,selectedCamera:F,selectedLan:x,setActiveModal:M,setDeleteScanPointModal:m,setEditIpModalData:N,setInstallDriverModal:ae,setLiveAddressBooks:ee,setQueriedVideoUrl:Ce,setQueryDuration:he,setQueryTimestamp:Ee,setQueryVideoLoading:ge,setStorageFiles:Q,setStorageLoading:K,setStorageModalData:ce,showToast:_,utilityCommands:U=[],detectBrand:c}=n,s=async o=>{const u=String((o==null?void 0:o.mac_address)||(o==null?void 0:o.mac_id)||(o==null?void 0:o.mac)||"").trim(),k=String((o==null?void 0:o.ip)||(o==null?void 0:o.printer_ip)||(typeof o=="string"?o:"")||(o==null?void 0:o.id)||"").trim(),E=u.toUpperCase().replace(/[^0-9A-F:]/g,""),W=E.replace(/[:-]/g,"");let J="",H="";try{const q=await Ie(`/api/devices/credentials-map?t=${Date.now()}`);if(q&&q.ok&&q.credentials){const a=q.credentials,y=E&&a[E]||W&&a[W]||E&&a[E.replace(/:/g,"-")]||k&&a[k];y&&(J=String(y.user||y.auth_user||"").trim(),H=String(y.password||y.auth_password||y.pass||"").trim())}}catch(q){throw new Error(`❌ Lỗi kết nối VPS khi tải tài khoản máy in: ${q.message||"Lỗi mạng"}`)}if(!J){const q=E||k||"chưa xác định";throw new Error(`⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS cho thiết bị (MAC/IP: ${q}). Vui lòng nhập User/Pass và bấm "Lưu Auth" trước!`)}return{user:J,pass:H,mac:E||k}},l=async(o,u,k,E)=>{var a;const W=k||Z,J=E||P;if(!W)return;const H=((a=v.find(y=>y.id===u))==null?void 0:a.name)||"";if(await me(o,"trigger_utility",{action:"query_camera_video",camera_name:H,timestamp:W,duration:J})){_("Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!","info");return}ge(!0),Ce("");try{const O=await(await fetch(`${Xn}/api/agents/${o}/cameras/${u}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:W,duration:J})})).json();if(O.ok){const te=W.replace(/[- :]/g,""),d=te.substring(0,8)+"_"+te.substring(8,14);Ce(`clip_${F.camera_name}_${d}.mp4`)}else _("Không truy xuất được video: "+O.error,"error")}catch(y){_("Lỗi kết nối render: "+y.message,"error")}finally{ge(!1)}},g=o=>{const u=o.match(/_(\d{8}_\d{6})\.mp4$/);if(u){const k=u[1],E=`${k.substring(0,4)}-${k.substring(4,6)}-${k.substring(6,8)} ${k.substring(9,11)}:${k.substring(11,13)}:${k.substring(13,15)}`;Ee(E),he(60),l(i,F.id,E,60),setTimeout(()=>{var W;(W=document.getElementById("video-playback-card"))==null||W.scrollIntoView({behavior:"smooth",block:"center"})},100)}else _("Không parse được thời gian từ tên tệp","error")},w=(o,u)=>{var J,H,q,a,y;const E=(re||[]).flatMap(O=>O.printers||[]).find(O=>String(O.id)===String(o)||O.mac_id===o||O.ip===o)||((J=x==null?void 0:x.printers)==null?void 0:J[0]),W=(E==null?void 0:E.agent_uid)||ie(o)||((q=(H=x==null?void 0:x.agents)==null?void 0:H.find(O=>O.is_agent_active))==null?void 0:q.agent_uid)||((y=(a=x==null?void 0:x.agents)==null?void 0:a[0])==null?void 0:y.agent_uid)||"kythuat02";m({isOpen:!0,printerId:o,entry:u,agentUid:W})},R=async()=>{var y,O,te,d,we;const{printerId:o,entry:u,agentUid:k}=B;if(!u)return;m(be=>({...be,isOpen:!1}));const E=u.email_address||u.email||"",W=u.physical_path||u.folder||u.folder_path||"",J=(E||W||"").trim(),H=String(u.registration_no&&u.registration_no!=="-"?u.registration_no:u.entry_id||"").trim(),a=((x==null?void 0:x.emails)||[]).find(be=>be.email.toLowerCase().trim()===J.toLowerCase().trim());if(a&&a.id){_("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const be=await Nn(a.id);if(be.ok)_("Đã xóa thành công!","success"),await ne();else throw new Error(be.error||"Không thể xóa")}catch(be){_(`Lỗi xóa: ${be.message}`,"error")}return}_("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const oe=(re||[]).flatMap(b=>b.printers||[]).find(b=>String(b.id)===String(o)||b.mac_id===o||b.ip===o)||((y=x==null?void 0:x.printers)==null?void 0:y[0]),Ae=((oe==null?void 0:oe.printer_type)||(oe==null?void 0:oe.printer_name)||"").toLowerCase().includes("toshiba")?"toshiba_delete_scan":"ricoh_delete_scan",We=(U||[]).find(b=>b.command===Ae),Ye=k||(oe==null?void 0:oe.agent_uid)||((te=(O=x==null?void 0:x.agents)==null?void 0:O.find(b=>b.is_agent_active))==null?void 0:te.agent_uid)||((we=(d=x==null?void 0:x.agents)==null?void 0:d[0])==null?void 0:we.agent_uid)||"kythuat02";let ve;if(Ye){let b=We;if(!b)try{b=(await On(Ye)||[]).find(tt=>tt.command===Ae)}catch{}const Me=(oe==null?void 0:oe.ip)||(oe==null?void 0:oe.printer_ip)||(o.includes(".")?o:""),{user:Te,pass:Le}=await s(oe),Pe=String((u==null?void 0:u.entry_id)||(u==null?void 0:u.id)||H||"").trim()||"null";let X=(b==null?void 0:b.command_content)||qn[Ae]||"";if(!X){_(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${Ae}' trên hệ thống VPS!`,"error");return}X=X.replace(/__TARGET_IP__/g,Me||"null"),X=X.replace(/__TARGET_USER__/g,Te||"admin"),X=X.replace(/__TARGET_PASS__/g,Le||""),X=X.replace(/__TARGET_ID__/g,Pe),X=X.replace(/__TARGET_SCAN_USER__/g,(u==null?void 0:u.name)||"null"),ve=await at(Ye,Ae,X,{printer_ip:Me,ip:Me,auth_user:Te,auth_password:Le,target_id:Pe,entry_id:Pe,registration_no:H})}if(!ve.ok||!ve.command_id)throw new Error(ve.error||"Không thể tạo lệnh xóa");h(ve.command_id,o,async b=>{_(`Đã xóa đăng ký #${H} thành công!`,"success"),console.log("Finish delete scan point, updating address book state directly",b);const Me=(oe==null?void 0:oe.mac_address)||(oe==null?void 0:oe.mac_id)||o,Te=Me?String(Me).toUpperCase().replace(/-/g,":"):"";let Le=(b==null?void 0:b.address_book_sync)||(b==null?void 0:b.address_book_data);if(!Le&&(b!=null&&b.result||b!=null&&b.result_payload)){const Pe=String(b.result||b.result_payload||"");if(Pe.includes("__ADDRESS_BOOK_JSON_START__"))try{let X=Pe.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();X=X.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),Le=JSON.parse(X)}catch{}}Te&&Le&&ee(Pe=>({...Pe,[Te]:Le})),de(oe||o),await ne(!0)},b=>{_(`Lỗi xóa điểm scan: ${b}`,"error")},`⌛ Đang xóa điểm scan #${H}...`)}catch(be){_(`Lỗi gửi lệnh xóa: ${be.message}`,"error")}},L=(o,u)=>{const k=u.folder||u.physical_path||u.folder_path||"";let E="",W="2130";const J=k.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),H=k.match(/^\\\\([^\\]+)(.*)$/);if(J)E=J[1],W=J[2]||"2130";else if(H)E=H[1],W="";else{const a=k.match(/^([^:/]+)(?::(\d+))?(.*)$/);a&&!k.startsWith("\\\\")&&(E=a[1],W=a[2]||"2130")}const q=E?W?`${E}:${W}`:E:"192.168.1.100:2130";N({printerId:o,entry:u,currentIp:E,newIp:q,newPort:W||"2130"}),M("edit_ip")},S=async()=>{var te;if(!G)return;const{printerId:o,entry:u,newIp:k,newPort:E}=G,W=u.folder||u.physical_path||u.folder_path||"",J=W.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),H=W.match(/^\\\\([^\\]+)(.*)$/);let q=k.trim();if((E||"2130").trim(),q.includes(":")){const d=q.split(":");q=d[0].trim(),d[1].trim()}if(J)J[3];else if(H)H[2];else{const d=W.match(/^([^:/]+)(?::(\d+))?(.*)$/);d&&!W.startsWith("\\\\")&&d[3]}const a=ie(o),y=u.registration_no;M(null),_("Gửi yêu cầu thay đổi IP của điểm scan...","info",3e3);let O="";if(J)O=J[1];else if(H)O=H[1];else{const d=W.match(/^([^:/]+)/);d&&!W.startsWith("\\\\")&&(O=d[1])}O||(O=q);try{const d=(te=x==null?void 0:x.printers)==null?void 0:te.find(b=>b.id===Number(o)),we=(d==null?void 0:d.mac_address)||(d==null?void 0:d.mac_id)||"",be=we?String(we).toUpperCase().replace(/-/g,":"):"",oe=f[be]||f[o]||{},De=oe.user||(d==null?void 0:d.auth_user)||(d==null?void 0:d.username),Ae=oe.pass||(d==null?void 0:d.auth_password)||(d==null?void 0:d.password)||"";if(!De)throw new Error(`Chưa cấu hình tài khoản Web cho máy in ${(d==null?void 0:d.printer_name)||(d==null?void 0:d.name)||"Photocopy"}!`);const Ye=(c?c((d==null?void 0:d.printer_name)||(d==null?void 0:d.name)||""):"ricoh")==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",ve=await at(a,Ye,"",{printer_ip:(d==null?void 0:d.ip)||"",auth_user:De,auth_password:Ae,target_id:y,target_name:u.name,old_ip:O,new_ip:q});if(!ve.ok||!ve.command_id)throw new Error(ve.error||"Không thể gửi lệnh thay đổi FTP");h(ve.command_id,o,async b=>{_(`Đã thay đổi IP điểm scan #${y} thành công!`,"success");const Me=(d==null?void 0:d.mac_address)||(d==null?void 0:d.mac_id)||o,Te=Me?String(Me).toUpperCase().replace(/-/g,":"):"";let Le=(b==null?void 0:b.address_book_sync)||(b==null?void 0:b.address_book_data);if(!Le&&(b!=null&&b.result||b!=null&&b.result_payload)){const Pe=String(b.result||b.result_payload||"");if(Pe.includes("__ADDRESS_BOOK_JSON_START__"))try{let X=Pe.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();X=X.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),Le=JSON.parse(X)}catch{}}Te&&Le&&ee(Pe=>({...Pe,[Te]:Le})),de&&de(o),await ne(!0)},b=>{_(`Lỗi thay đổi IP: ${b}`,"error")},`⌛ Đang cập nhật IP điểm scan #${y}...`)}catch(d){_(`Lỗi gửi lệnh thay đổi IP: ${d.message}`,"error")}},C=async(o,u)=>{ce({lanUid:o,email:u}),K(!0),Q([]),M("storage");try{const k=await Lr(o,u);if(k.ok)Q(k.rows||[]);else throw new Error(k.error||"Lỗi server")}catch(k){_(`Không thể lấy tệp đã scan: ${k.message}`,"error")}finally{K(!1)}},I=(o,u,k,E,W)=>{var H,q;const J=ie(o)||((q=(H=x==null?void 0:x.agents)==null?void 0:H.find(a=>a.is_agent_active))==null?void 0:q.agent_uid)||"";ae({isOpen:!0,printerId:o,brand:u,model:k,driverName:E,driverUrl:W,selectedAgentUids:J?[J]:[]})},A=async(o,u,k,E,W,J)=>{const H=`driver-install-progress-${J}`;T(H,`⏳ [${J}] Đang gửi lệnh cài đặt driver...`,"info");try{const q=await Rr(o,u,k,E,W,J);if(!q.ok)throw new Error(q.error||"Server trả về lỗi");const a=q.command_id;if(!a){T(H,`✅ [${J}] Đã gửi lệnh cài đặt driver.`,"success");return}const y=3e5,O=2e3,te=Date.now();let d="";const we=setInterval(async()=>{try{const be=Date.now()-te;if(be>y){clearInterval(we),T(H,`⏰ [${J}] Quá thời gian chờ (5 phút).`,"info");return}const oe=await St(a);if(oe.status==="success")clearInterval(we),T(H,`✅ [${J}] Cài đặt driver thành công!`,"success");else if(oe.status==="failed"||!oe.ok)clearInterval(we),T(H,`❌ [${J}] Cài driver thất bại: ${oe.error||"Lỗi không xác định"}`,"error");else{const De=oe.progress_text||"";if(De&&De!==d)d=De,T(H,`⏳ [${J}] ${De}`,"info");else if(!De){const Ae=Math.round(be/1e3);oe.received_at?T(H,`⚡ [${J}] Đã nhận lệnh - đang cài đặt... (${Ae}s)`,"info"):T(H,`⌛ [${J}] Đang chuyển lệnh tới Agent... (${Ae}s)`,"info")}}}catch{}},O)}catch(q){T(H,`❌ Không thể cài driver: ${q.message}`,"error")}},Y=o=>{if(o===0)return"0 Bytes";const u=1024,k=["Bytes","KB","MB","GB"],E=Math.floor(Math.log(o)/Math.log(u));return parseFloat((o/Math.pow(u,E)).toFixed(1))+" "+k[E]},de=async o=>{let u=String(typeof o=="object"?o.id||o.ip||o.mac_address||o.mac_id:o);(!u||u==="0"||u==="undefined")&&typeof o=="object"&&(u=o.ip||o.mac_address||o.mac_id||"0");const k=typeof o=="object"?o:null,E=ie?ie(u):(k==null?void 0:k.agent_uid)||"";_&&_("⌛ Đang yêu cầu Agent đọc trực tiếp danh bạ từ máy photocopy...","info",3e3);try{const{user:W,pass:J}=await s(k||{ip:u,mac_address:u}),H={auth_user:W,auth_password:J};k&&(k.ip&&(H.printer_ip=k.ip),(k.name||k.printer_name)&&(H.printer_name=k.name||k.printer_name),(k.mac_address||k.mac_id)&&(H.mac_id=k.mac_address||k.mac_id));const q=await En(u,E||void 0,H);if(!q.ok||!q.command_id)throw new Error(q.error||"Không thể tạo lệnh đọc danh bạ");h&&h(q.command_id,u,async a=>{let y=(a==null?void 0:a.address_book_sync)||(a==null?void 0:a.address_book_data)||(a==null?void 0:a.result);if(!y&&typeof(a==null?void 0:a.result_payload)=="string"){const O=a.result_payload;if(O.includes("__ADDRESS_BOOK_JSON_START__"))try{const te=O.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();y=JSON.parse(te)}catch{}if(!y){const te=O.match(/(\{\s*"status"[\s\S]*"address_list"[\s\S]*\})/);if(te)try{y=JSON.parse(te[1])}catch{}}}console.log("=================================================="),console.log(`[FRONTEND] KẾT QUẢ ĐỒNG BỘ DANH BẠ MÁY IN (Command ID #${q.command_id}):`,a),console.log(`[FRONTEND] CHI TIẾT DANH BẠ (Count: ${(y==null?void 0:y.count)||0}):`,(y==null?void 0:y.address_list)||y),console.log("=================================================="),_&&_("✓ Đã cập nhật danh bạ máy in thành công!","success"),y&&n.setCommandStatus&&n.setCommandStatus(O=>({...O,[u]:{...O[u]||{},address_book_sync:y,isPending:!1}})),ne&&await ne()},a=>{console.error(`[FRONTEND LỖI ĐỒNG BỘ DANH BẠ] Command ID #${q.command_id}:`,a),_&&_(`Lỗi đọc danh bạ: ${a}`,"error")},"⌛ Agent đang đọc danh bạ máy in...")}catch(W){_&&_(`Lỗi gửi lệnh đọc danh bạ: ${W.message}`,"error")}},xe=async()=>{var W;const{printerId:o,name:u,email:k,agentUid:E}=n.publicFtpData||{};if(!u||!u.trim()){_&&_("Vui lòng nhập tên điểm scan","error");return}n.setPublicFtpLoading&&n.setPublicFtpLoading(!0);try{const H=(re||[]).flatMap(d=>d.printers||[]).find(d=>String(d.id)===String(o)||d.mac_id===o||d.ip===o)||((W=x==null?void 0:x.printers)==null?void 0:W[0]),{user:q,pass:a,mac:y}=await s(H||{id:o,mac_address:o}),O={mac_address:y,printer_ip:(H==null?void 0:H.ip)||"",auth_user:q,auth_password:a},te=await Ln(o,u.trim(),k,E||void 0,O);if(n.setPublicFtpLoading&&n.setPublicFtpLoading(!1),M&&M(null),!te.ok||!te.command_id)throw new Error(te.error||"Lỗi gửi lệnh");h&&h(te.command_id,o,async d=>{_&&_(`Đã tạo điểm scan "${u.trim()}" thành công!`,"success"),de(o),ne&&await ne()},d=>{_&&_(`Thêm điểm scan thất bại: ${d}`,"error")},`⌛ Đang tạo điểm scan "${u.trim()}"...`)}catch(J){n.setPublicFtpLoading&&n.setPublicFtpLoading(!1),_&&_(`Lỗi: ${J.message}`,"error")}},le=async()=>{const{lanUid:o,agentUid:u,email:k}=n.privateFtpData||{};if(!k||!k.includes("@")){_&&_("Địa chỉ email không hợp lệ","error");return}n.setPrivateFtpLoading&&n.setPrivateFtpLoading(!0);try{const E=await Rn("default",o,u,k);if(n.setPrivateFtpLoading&&n.setPrivateFtpLoading(!1),M&&M(null),E.ok)_&&_("Đã thêm Private FTP thành công","success"),ne&&await ne();else throw new Error(E.error||"Lỗi server")}catch(E){n.setPrivateFtpLoading&&n.setPrivateFtpLoading(!1),_&&_(`Lỗi thêm FTP riêng: ${E.message}`,"error")}},$=async()=>{if(!i){_&&_("Chưa chọn Agent để khởi động lại","error");return}_&&_(`Đang gửi lệnh khởi động lại Agent (${i})...`,"info",4e3);try{const o=await Fn(i);if(o.ok)_&&_("Đã gửi lệnh khởi động lại Agent khẩn cấp!","success"),M&&M(null);else throw new Error(o.error||"Thất bại")}catch(o){_&&_(`Lỗi khởi động lại: ${o.message}`,"error")}},z=j.useCallback(o=>jr(o,(x==null?void 0:x.emails)||[],(x==null?void 0:x.agents)||[]),[x]);return{executeRemoteInstallDriver:A,formatBytes:Y,getDestinationStatus:z,getDestinationStatusHtml:jr,handleAddPrivateFtp:le,handleAddPublicFtp:xe,handleConfirmDeleteScanPoint:R,handleDeleteDest:w,handleEditIP:L,handleEmergencyRestart:$,handleOpenStorageFiles:C,handlePlaySegmentFile:g,handleQueryVideo:l,handleRefetchAddressBook:de,handleRemoteInstallDriver:I,handleSaveEditIP:S}};function Yn(){const n=Kn({}),i=Jn(n),v=Qn({...n,...i});return{...n,...i,...v}}function ri(){var Z;const n=Yn(),{toasts:i=[],lanSitesLoading:v,lanSites:f=[],selectedLanUid:B,setSelectedLanUid:G,activeTab:ne,setActiveTab:ie,selectedLan:me,triggerLanScan:re,filteredPrinters:h,fetchLanSitesData:P}=n;return e.jsxs(Ke.div,{style:t.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:t.toastContainer,children:e.jsx(et,{children:i.map(T=>e.jsxs(Ke.div,{style:{...t.toast,borderLeft:`4px solid ${T.type==="success"?"var(--color-success)":T.type==="error"?"var(--color-error)":"var(--color-primary)"}`},initial:{opacity:0,x:50,scale:.9},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:50,scale:.9},children:[e.jsx("span",{style:t.toastIcon,children:T.type==="success"?"✔️":T.type==="error"?"❌":"ℹ️"}),e.jsx("div",{style:{flex:1,fontSize:"0.8rem"},children:T.message})]},T.id))})}),e.jsxs("div",{style:t.fixedHeader,children:[e.jsxs("div",{style:t.header,children:[e.jsx("h1",{style:t.title,children:"🛠️ Quản lý Mạng LAN"}),e.jsx("button",{style:{...t.smallBtn,borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>P(!0),children:"🔄 Làm mới"})]}),e.jsxs("div",{style:t.filterBar,children:[e.jsx("label",{style:t.filterLabel,children:"Mạng LAN hiện tại:"}),v&&f.length===0?e.jsx(Qe,{size:"sm"}):e.jsx("select",{value:B,onChange:T=>{G(T.target.value),localStorage.setItem("goxprint_selected_lan_uid",T.target.value)},style:t.lanSelect,children:f.map(T=>{var fe;return e.jsxs("option",{value:T.lan_uid,children:[T.lan_name||T.lan_uid," (",T.active_agents," Agent - ",((fe=T.printers)==null?void 0:fe.length)??0," máy Photo)"]},T.lan_uid)})})]}),e.jsxs("div",{style:t.tabBar,children:[e.jsxs("button",{style:{...t.tabBtn,color:ne==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:ne==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>ie("agents"),children:["💻 Máy tính (",((Z=me==null?void 0:me.agents)==null?void 0:Z.filter(T=>T.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...t.tabBtn,color:ne==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:ne==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{ie("copiers"),re(me)},children:["🖨️ Photocopy (",h.length,")"]})]})]}),e.jsxs("div",{style:t.scrollableContent,children:[v&&e.jsx("div",{style:t.loadingWrapper,children:e.jsx(Qe,{size:"md"})}),!v&&me&&e.jsxs(et,{mode:"wait",children:[ne==="agents"&&e.jsx(Gn,{...n}),ne==="copiers"&&e.jsx(Bn,{...n})]})]}),e.jsx(zn,{...n})]})}export{ri as AgentPage,ri as default};
