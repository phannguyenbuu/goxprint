import{j as e,R as It,A as Ye,m as Be,L as Ze,r as j}from"./index-DWhpYpbU.js";import{A as jr}from"./AnimatedList-DML5fYC0.js";import{G as Ir}from"./GlowCard-tBTiApks.js";const t={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"176px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},lanSelect:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",cursor:"pointer",width:"100%"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",left:"12px",right:"12px",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",maxWidth:"404px",marginLeft:"auto",marginRight:"auto",pointerEvents:"none"},toast:{background:"rgba(18, 18, 26, 0.95)",backdropFilter:"blur(10px)",borderRadius:"8px",padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:"10px",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",pointerEvents:"auto"},toastIcon:{fontSize:"0.9rem",flexShrink:0},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},fe={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},credsInputRow:{display:"flex",gap:"6px"},credsInput:{fontSize:"0.8rem",padding:"6px 8px",background:"var(--color-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",flex:1,minWidth:0},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},expandSubBtn:{fontSize:"0.72rem",color:"var(--color-primary)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"block"},suggestedDriverBlock:{padding:"8px",background:"var(--color-inset-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",display:"flex",flexDirection:"column",gap:"6px"},driverSuggestionItem:{background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden"},driverModelHeader:{padding:"6px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255,255,255,0.02)"},driverOptionsList:{padding:"6px",borderTop:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},driverFileRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",background:"var(--color-inset-bg)",borderRadius:"4px",gap:"6px"},driverFileName:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},driverFileUrl:{fontSize:"0.62rem",color:"var(--color-text-secondary)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function Pn({hasAddressList:n,sync:i,p:_,commandStatus:g,getDestinationStatus:G,selectedLan:H,handleOpenStorageFiles:le,handleDeleteDest:ce,handleChangeFtp:he,handleEditIP:ie}){return e.jsxs("div",{style:fe.destinationsBlock,children:[e.jsx("span",{style:fe.destBlockTitle,children:"📂 Danh sách điểm scan:"}),n?i.address_list.filter(p=>{if(!p||typeof p!="object"||p.type==="Summary")return!1;const P=(p.name||"").trim();return P==="Summary"||P==="Total"||P.startsWith("Users:")?!1:!!(P||p.entry_id||p.registration_no&&p.registration_no!=="-"||p.email_address||p.email||p.folder||p.physical_path)}).map((p,P)=>{var R,ge;const re=p.email_address||p.email||"",S=p.physical_path||p.folder||p.folder_path||"",xe=(re||S||"").trim();let F="Folder";S.startsWith("ftp://")?F="FTP":S.startsWith("\\\\")?F="SMB":(re||re.includes("@"))&&(F="Email"),typeof G=="function"&&G(p);const u=p.registration_no&&p.registration_no!=="-"?p.registration_no:p.entry_id||P+1,D=`${_.id}-${u}`,y=((R=g[D])==null?void 0:R.isPending)||!1;return(ge=g[D])!=null&&ge.message,e.jsxs("div",{style:{...fe.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",u]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[p.name,(p.warning||p.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:p.warning||p.error,children:"⚠️"})]}),typeof p.file_count=="number"&&e.jsxs("span",{onClick:()=>le(H.lan_uid,xe),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",p.file_count," files"]}),p.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:p.entry_id})]}),he&&(F==="FTP"||F==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:y?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:y?.5:1,minWidth:"24px"},onClick:()=>ie&&ie(_.id,p),disabled:y,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:y?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:y?.5:1,minWidth:"24px"},onClick:()=>ce(_.id||_.mac_id||_.mac_address||_.ip||"0",p),disabled:y,title:"Xóa",children:"🗑️"})]},P)}):e.jsx("div",{style:fe.emptySubText,children:i.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Đang tải hoặc danh sách trống. Nhấn đồng bộ để lấy trực tiếp."})]})}const jn="https://agentapi.quanlymay.com",Vt=new Map;async function Ee(n,i={}){const _=`${i.method||"GET"}:${n}:${i.body||""}`;if(Vt.has(_))return Vt.get(_);const g=(async()=>{try{const G=await fetch(`${jn}${n}`,{...i,headers:{"Content-Type":"application/json","X-API-Token":"change-me",...i.headers}});if(!G.ok){const H=await G.json().catch(()=>({}));throw new Error(H.error||`HTTP error! status: ${G.status}`)}return await G.json()}finally{Vt.delete(_)}})();return Vt.set(_,g),g}async function In(){try{return await Ee("/api/new-lan-sites?lead=default")||{rows:[]}}catch(n){return console.error("Failed to fetch LAN sites:",n),{rows:[]}}}async function En(n,i,_,g,G){return Ee(`/api/devices/${encodeURIComponent(n)}/credentials`,{method:"PATCH",body:JSON.stringify({auth_user:i,auth_password:_,mac_id:g||n,printer_type:G})})}async function Ln(n,i,_){const g=i?`/api/devices/${n}/fetch-address-book?agent_uid=${i}`:`/api/devices/${n}/fetch-address-book`;return Ee(g,{method:"POST",body:JSON.stringify(_||{})})}async function Tt(n){return Ee(`/api/commands/${n}/status`)}async function Rn(n,i,_,g,G){const H=g?`/api/devices/${n}/add-email-dest?agent_uid=${g}`:`/api/devices/${n}/add-email-dest`;return Ee(H,{method:"POST",body:JSON.stringify({name:i,email:_,...G||{}})})}async function Nn(n,i,_,g){return Ee("/api/lan-emails",{method:"POST",body:JSON.stringify({lead:n,lan_uid:i,email:g,email_type:"private",pc_name:_})})}async function Dn(n){return Ee(`/api/lan-emails/${n}`,{method:"DELETE"})}async function Er(n,i){return Ee(`/api/scans/files?lan_uid=${encodeURIComponent(n)}&email=${encodeURIComponent(i)}`)}async function Lr(n,i,_,g,G,H){return Ee(`/api/devices/${n}/install-driver`,{method:"POST",body:JSON.stringify({brand:i,model:_,driver_name:g,driver_url:G,agent_uid:H})})}async function Mn(n,i,_,g=1,G=50,H,le){const ce=new URLSearchParams;return n&&ce.append("lead",n),ce.append("lan_uid",i),g&&ce.append("page",g.toString()),G&&ce.append("limit",G.toString()),ce.append("t",Date.now().toString()),Ee(`/api/jobs?${ce.toString()}`)}async function On(n,i,_){return Ee(`/api/agents/${n}/utility/${i}?lead=default`,{method:"POST",body:_?JSON.stringify(_):void 0})}async function Fn(n){return Ee(`/api/agents/${n}/utility-commands?lead=default&t=${Date.now()}`)}async function at(n,i,_,g){return Ee(`/api/agents/${n}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify({command:i,command_content:_,...g||{}})})}async function Un(n){return Ee(`/api/agents/${n}/emergency-restart?lead=default`,{method:"POST",body:"{}"})}function Bn({p:n,selectedLan:i,activeAgentUid:_,selectedAgentUid:g,copierCredentials:G,setCopierCredentials:H,saveAuthLoading:le,handleSaveAuth:ce,isExpanded:he,handleCopierClick:ie,onlineAgents:p,detectBrand:P,showToast:re,fetchRemotePage:S,setRemoteLockPrinter:xe,setActiveModal:F,hasAddressList:u,sync:D,commandStatus:y,getDestinationStatus:R,handleOpenStorageFiles:ge,handleEditIP:J,handleDeleteDest:_e,handleRefetchAddressBook:Ce,expandedDrivers:Pe,setExpandedDrivers:q,expandedDriverMenus:ne,setExpandedDriverMenus:Y,handleRemoteInstallDriver:me,setPublicFtpData:f}){var I,K,Z,V,ee;const[U,M]=It.useState(null),Q=It.useRef(!1),l=It.useCallback(async()=>{try{const o=await Ee(`/api/lan-sites?t=${Date.now()}`);if(o&&o.ok&&Array.isArray(o.rows)){const x=(n.mac_id||n.mac_address||n.mac||"").toUpperCase().replace(/[^0-9A-F]/g,"");for(const O of o.rows)for(const oe of O.printers||[]){const c=(oe.mac_id||oe.mac_address||oe.mac||"").toUpperCase().replace(/[^0-9A-F]/g,"");x&&c&&x.length>=10&&x===c&&oe.address_book_sync&&M(oe.address_book_sync)}}}catch{}},[n.mac_id,n.mac_address]),s=((I=y[n.id])==null?void 0:I.isPending)||!1,h=((K=y[n.id])==null?void 0:K.message)||"";It.useEffect(()=>{if(s&&M(null),Q.current&&!s){l();const o=setTimeout(l,1500),x=setTimeout(l,3500);return()=>{clearTimeout(o),clearTimeout(x)}}Q.current=s},[s,l]);const T=n.mac_address||"",k=n.ip||"",L=String(n.id!==void 0&&n.id!==null?n.id:""),b=T&&(y==null?void 0:y[T])||k&&(y==null?void 0:y[k])||L&&(y==null?void 0:y[L]),v=o=>o&&(Array.isArray(o.address_list)&&o.address_list.length>0||o.address_book_data&&Array.isArray(o.address_book_data.address_list)&&o.address_book_data.address_list.length>0),C=(v(U)?U:null)||(v(b==null?void 0:b.address_book_sync)?b.address_book_sync:null)||(v(b)?b:null)||(v(D)?D:null)||U||(b==null?void 0:b.address_book_sync)||b||D||{},W=n.suggested_drivers&&n.suggested_drivers.length>0,z=Pe[n.id],$=(()=>{var x;if(Array.isArray(C==null?void 0:C.address_list)&&C.address_list.length>0)return C.address_list;if(C!=null&&C.address_book_data&&Array.isArray(C.address_book_data.address_list))return C.address_book_data.address_list;const o=[C,C==null?void 0:C.result,C==null?void 0:C.result_payload,C==null?void 0:C.raw,b==null?void 0:b.result,b==null?void 0:b.result_payload,b==null?void 0:b.address_list,(x=b==null?void 0:b.address_book_sync)==null?void 0:x.address_list];for(const O of o)if(O){if(Array.isArray(O))return O;if(typeof O=="object"&&Array.isArray(O.address_list))return O.address_list;if(typeof O=="string"){let oe=O.trim();if(oe.includes("__ADDRESS_BOOK_JSON_START__"))try{oe=oe.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),oe=oe.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const c=JSON.parse(oe);if(c&&Array.isArray(c.address_list))return c.address_list;if(Array.isArray(c))return c}catch{}}}return Array.isArray(C==null?void 0:C.address_list)?C.address_list:[]})(),ae=$.filter(o=>{if(!o||typeof o!="object"||o.type==="Summary")return!1;const x=(o.name||"").trim();return x==="Summary"||x==="Total"||x.startsWith("Users:")?!1:!!(x||o.entry_id||o.registration_no&&o.registration_no!=="-"||o.email_address||o.email||o.folder||o.physical_path)}),B={...C,address_list:$,status:$.length>0?"success":(C==null?void 0:C.status)||"none",timestamp:((Z=y==null?void 0:y[n.id])==null?void 0:Z.timestamp)||(C==null?void 0:C.timestamp)||new Date().toISOString()},E=ae.length>0||u,a=ae.length,m=B.timestamp?new Date(B.timestamp).toLocaleTimeString("vi-VN"):"",w=It.useCallback(async(o,x)=>{var ke,je;const O=P(o.printer_name||o.name||"");if(O!=="ricoh"&&O!=="toshiba"){re("Thiết bị không hỗ trợ thay đổi FTP","error");return}const oe=O==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",c=((ke=i==null?void 0:i.agents)==null?void 0:ke.find(te=>te.is_agent_active))||((je=i==null?void 0:i.agents)==null?void 0:je[0]),ve=(c==null?void 0:c.local_ip)||(c==null?void 0:c.ip)||"";if(!ve){re("Không tìm thấy IP của Agent để cập nhật","error");return}const be=x.folder||x.physical_path||x.folder_path||"",de=be.match(/ftp:\/\/([^:/]+)/),Me=be.match(/^\\\\([^\\]+)/),Le=be.match(/^([^:/]+):/);let Oe="";de?Oe=de[1]:Me?Oe=Me[1]:Le&&(Oe=Le[1]),Oe||(Oe=ve);const $e=x.registration_no||x.id||"",Fe=x.name||x.username||x.display_name||"",A=o.ip||o.printer_ip||"";re(`Đang truy vấn tài khoản VPS cho ${x.name}...`,"info");let pe=o.auth_user||o.username||"",Ie=o.auth_password||o.password||"";try{const te=await Ee(`/api/devices/credentials-map?t=${Date.now()}`);if(te&&te.ok&&te.credentials){const dt=(o.mac_id||o.mac_address||"").toUpperCase().replace(/[^0-9A-F:]/g,""),ye=dt.replace(/[:-]/g,""),pt=A,ot=dt&&te.credentials[dt]||ye&&te.credentials[ye]||pt&&te.credentials[pt];ot&&(pe=ot.user||ot.auth_user||pe,Ie=ot.password||ot.auth_password||Ie)}}catch{}if(!pe){re("⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS!","error");return}try{const te=await at(g,oe,"",{printer_ip:A,auth_user:pe,auth_password:Ie,target_id:$e,target_name:Fe,old_ip:Oe,new_ip:ve});te&&te.ok?re(`Cập nhật FTP cho ${x.name} thành công!`,"success"):re(`Lỗi: ${(te==null?void 0:te.error)||"Không thể chạy lệnh"}`,"error")}catch(te){re(`Lỗi gửi lệnh: ${(te==null?void 0:te.message)||te}`,"error")}},[g,i,P,re]);return e.jsx("div",{id:`copier-card-${n.id}`,onClick:()=>ie(String(n.id)),style:{width:"100%"},children:e.jsxs(Ir,{children:[e.jsxs("div",{style:fe.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:fe.copierTitle,children:["🖨️ ",(()=>{if(n.printer_name&&n.printer_name.trim())return n.printer_name.trim();const o=(n.mac_id||"").replace(/-/g,":").toUpperCase();return o.startsWith("58:38:79")||o.startsWith("00:26:73")?"Thiết bị Ricoh (Đang thám dò...)":o.startsWith("00:80:91")?"Thiết bị Toshiba (Đang thám dò...)":o.startsWith("00:11:22")?"Thiết bị HP (Đang thám dò...)":"Thiết bị Photocopy (Đang thám dò...)"})()]}),e.jsxs("div",{style:fe.copierSubtitle,children:["IP: ",n.ip," · MAC: ",n.mac_id||"—",n.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:n.agent_uid})]})]})]}),e.jsx("span",{style:{...fe.statusBadge,color:n.probed?n.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:n.probed?n.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:n.probed?n.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:n.probed?n.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsxs("div",{style:fe.sectionBlock,children:[e.jsx("span",{style:fe.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsxs("div",{style:fe.credsInputRow,children:[e.jsx("input",{type:"text",style:fe.credsInput,placeholder:"admin",autoComplete:"new-password",name:`printer_user_${n.id}`,value:((V=G[n.id])==null?void 0:V.user)||"",onChange:o=>H(x=>({...x,[n.id]:{...x[n.id],user:o.target.value}}))}),e.jsx("input",{type:"password",style:fe.credsInput,placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${n.id}`,value:((ee=G[n.id])==null?void 0:ee.pass)||"",onChange:o=>H(x=>({...x,[n.id]:{...x[n.id],pass:o.target.value}}))}),e.jsx("button",{style:{...fe.smallBtn,padding:"8px 12px",fontSize:"0.8rem",whiteSpace:"nowrap"},onClick:()=>ce(n),disabled:le[n.id],children:le[n.id]?"Lưu...":"Lưu Auth"})]})]}),e.jsxs("div",{style:{...fe.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:D.status==="success"?"rgba(0, 255, 136, 0.05)":D.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:D.status==="success"?"rgba(0, 255, 136, 0.15)":D.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:fe.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),s?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:h}):E?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",a," mục) ",m?` • ${m}`:""]}):D.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",D.error," ",m?`(${m})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...fe.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:async()=>{Ce(n),setTimeout(l,2e3),setTimeout(l,4500)},disabled:s||p.length===0,children:["🔄 ",B.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),E&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(Pn,{hasAddressList:E,sync:B,p:n,commandStatus:y,getDestinationStatus:R,selectedLan:i,handleOpenStorageFiles:ge,handleEditIP:J,handleDeleteDest:_e,handleChangeFtp:w})})]}),W&&e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("button",{style:fe.expandSubBtn,onClick:()=>q(o=>({...o,[n.id]:!z})),children:z?"▲ Ẩn driver đề xuất":"▼ Xem driver đề xuất từ catalog"}),e.jsx(Ye,{children:z&&e.jsx(Be.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},style:{overflow:"hidden",marginTop:"6px"},children:e.jsx("div",{style:fe.suggestedDriverBlock,children:n.suggested_drivers.map((o,x)=>{const O=o.brand==="ricoh"?"var(--color-primary)":o.brand==="toshiba"?"var(--color-error)":"var(--color-success)",oe=`${n.id}-${x}`,c=ne[oe]||!1;return e.jsxs("div",{style:fe.driverSuggestionItem,children:[e.jsxs("div",{style:fe.driverModelHeader,onClick:()=>Y(ve=>({...ve,[oe]:!c})),children:[e.jsxs("span",{style:{fontSize:"0.8rem",fontWeight:600},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:O,marginRight:"6px"}}),o.brand.toUpperCase()," - ",o.model]}),e.jsx("span",{style:{fontSize:"0.75rem",color:"var(--color-primary)"},children:c?"▲":"▼"})]}),c&&e.jsx("div",{style:fe.driverOptionsList,children:o.drivers&&o.drivers.length>0?o.drivers.map((ve,be)=>e.jsxs("div",{style:fe.driverFileRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:fe.driverFileName,children:ve.name}),e.jsx("div",{style:fe.driverFileUrl,title:ve.url,children:ve.url.split("/").pop()})]}),e.jsx("div",{style:{display:"flex",gap:"4px"},children:e.jsx("button",{style:{...fe.smallBtn,padding:"4px 8px",fontSize:"0.7rem"},onClick:()=>me(n.mac_id||n.mac_address||n.ip||n.id,o.brand,o.model,ve.name,ve.url),disabled:p.length===0,children:"Cài đặt"})})]},be)):e.jsx("div",{style:fe.emptySubText,children:"Không tìm thấy driver nào."})})]},x)})})})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...fe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{f({printerId:n.id,name:"",email:"",agentUid:g}),F("public_ftp")},disabled:p.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...fe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{var x,O;const o=g||n.agent_uid||_||((O=(x=i==null?void 0:i.agents)==null?void 0:x[0])==null?void 0:O.agent_uid)||"";if(!o){re("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}S(o,n.ip,"/")},disabled:!i||!i.agents||i.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...fe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#ef4444",color:"#ef4444"},onClick:()=>{xe({ip:n.ip,name:n.name||n.printer_name||n.ip,id:n.id,agentUid:g}),F("remote_lock")},disabled:p.length===0,children:"🔒 Khóa máy từ xa"}),P(n.name||n.printer_name||n.ip)==="ricoh"&&(n.name||n.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...fe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>re("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),P(n.name||n.printer_name||n.ip)==="toshiba"&&e.jsx("button",{style:{...fe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>re("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]})},n.id)}function Gn(n){const{setCopierCredentials:i,activeAgentUid:_,activeLoadingFile:g,activeModal:G,activeTab:H,addCameraLoading:le,addressBookModal:ce,agentUid:he,agents:ie,cameraAgentUid:p,cameraFileFilter:P,cameras:re,camerasLoading:S,canNavigateNext:xe,canNavigatePrev:F,commandStatus:u,copierCredentials:D,deleteCameraLoading:y,deleteScanPointModal:R,destToDelete:ge,detectBrand:J,editIpData:_e,editIpModal:Ce,editIpNewIp:Pe,editIpSaving:q,expandedCopierId:ne,expandedDriverMenus:Y,expandedDrivers:me,expandedPrinters:f,fetchLanSitesData:U,fetchRemotePage:M,fileTypeFilter:Q,filteredPrinters:l,getDestinationStatus:s=()=>({label:"✔ ACTIVE",type:"success",title:""}),getTargetAgentUid:h,handleCopierClick:T,handleDeleteDest:k,handleEditIP:L,handleOpenStorageFiles:b,handleRefetchAddressBook:v,handleRemoteInstallDriver:C,handleSaveAuth:W,infoDetailModal:z,installDriverModal:$,installDriverSaving:ae,installedCount:B,isAllInstalled:E,lanSites:a,lanSitesLoading:m,liveAddressBooks:w,mockAgentApi:I,newCamIp:K,newCamName:Z,newCamPass:V,newCamPort:ee,newCamRtsp:o,newCamUser:x,onlineAgents:O,pendingScanPoints:oe,printers:c,publicFtpData:ve,publicFtpModal:be,publicFtpSaving:de,record30sLoading:Me,remoteLockModal:Le,remoteLockPrinter:Oe,saveAuthLoading:$e,selectedAgentUid:Fe,selectedCamera:A,selectedCameraAgentUid:pe,selectedLan:Ie,selectedLanUid:ke,setActiveModal:je,setExpandedDriverMenus:te,setExpandedDrivers:dt,setPublicFtpData:ye,setRemoteLockPrinter:pt,showToast:ot,storageFilesModal:Kt,storageFilesModalData:Et,storageFilesModalLoading:Lt,storageFilterDate:Rt,submittingScanPoint:Ct,toshibaVncData:Nt,utilityActionPending:ir,utilityCommands:ar,utilityCommandsLoading:or,utilitySettingsLoading:sr,utilityStatusMsg:lr,viewOutputModal:Ve,vncTunnelLoading:cr,webPreviewHistory:dr,webPreviewHistoryIndex:Je,webPreviewLoading:ht,webPreviewModal:yt,webPreviewTab:Dt}=n;return e.jsx(e.Fragment,{children:e.jsxs(Be.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:t.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(jr,{className:"copiers-grid",style:t.gridContainer,children:m?e.jsxs("div",{style:t.loadingContainer,children:[e.jsx(Ze,{}),e.jsx("div",{style:t.loadingText,children:"Đang tải dữ liệu thiết bị..."})]}):l.length===0?e.jsxs("div",{style:t.emptyStateContainer,children:[e.jsx("div",{style:t.emptyIcon,children:"🖨️"}),e.jsx("div",{style:t.emptyTitle,children:"Không tìm thấy máy photocopy nào"}),e.jsx("div",{style:t.emptySubtitle,children:'Vui lòng chọn mạng LAN khác hoặc nhấp "Làm mới" để quét lại thiết bị.'})]}):l.map(qe=>{const et=String(ne)===String(qe.id),Mt=Ne=>{if(!Ne)return null;let De=Ne;if(typeof De=="string"){let mt=De.trim();if(mt.includes("__ADDRESS_BOOK_JSON_START__"))try{mt=mt.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),mt=mt.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{De=JSON.parse(mt)}catch{return null}}if(typeof De!="object")return null;let Ft=0;for(;De&&typeof De=="object"&&!Array.isArray(De.address_list)&&De.address_book_sync&&Ft<5;)De=De.address_book_sync,Ft++;return De},Ot=(qe.mac_address||qe.mac_id||"").toUpperCase().replace(/-/g,":"),Re=Mt(Ot?w==null?void 0:w[Ot]:null),ft=Mt(qe.address_book_sync),Jt=Re&&Array.isArray(Re.address_list),st=ft&&Array.isArray(ft.address_list)&&ft.address_list.length>0,kt=Jt?Re:st?ft:Re||ft||{},qt=(Array.isArray(kt.address_list)?kt.address_list.filter(Ne=>{if(!Ne||typeof Ne!="object"||Ne.type==="Summary")return!1;const De=(Ne.name||"").trim();return De==="Summary"||De==="Total"||De.startsWith("Users:")?!1:!!(De||Ne.entry_id||Ne.registration_no&&Ne.registration_no!=="-"||Ne.email_address||Ne.email||Ne.folder||Ne.physical_path)}):[]).length>0,Xt=((Ie==null?void 0:Ie.agents)||[]).filter(Ne=>Ne.is_agent_active),Qt=h?h(qe.id):Fe||qe.agent_uid||"";return e.jsx(Bn,{p:qe,selectedLan:Ie,activeAgentUid:he,selectedAgentUid:Qt,copierCredentials:D||{},setCopierCredentials:i,saveAuthLoading:$e||{},handleSaveAuth:W,isExpanded:et,handleCopierClick:T,onlineAgents:Xt,detectBrand:J||(()=>"generic"),showToast:ot||(()=>{}),fetchRemotePage:M||(()=>{}),setRemoteLockPrinter:pt,setActiveModal:je,hasAddressList:qt,sync:kt,commandStatus:u||{},getDestinationStatus:s||(()=>({})),handleOpenStorageFiles:b||(()=>{}),handleEditIP:L||(()=>{}),handleDeleteDest:k||(()=>{}),handleRefetchAddressBook:v||(()=>{}),expandedDrivers:me||{},setExpandedDrivers:dt,expandedDriverMenus:Y||{},setExpandedDriverMenus:te,handleRemoteInstallDriver:C||(()=>{}),setPublicFtpData:ye},qe.id)})})]},"copiers-tab")})}function nr(n){const i=(n||"").trim();return i&&i.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function zn(n){const{AgentPage:i,activeLoadingFile:_,activeModal:g,activeTab:G,allocatedVncAddr:H,cameraFiles:le,cameraForm:ce,cameraLogs:he,cameraStatus:ie,cameraTestLoading:p,cameraTestResult:P,cameras:re,camerasLoading:S,commandStatus:xe,confirmModal:F,copierCredentials:u,customRecordDuration:D,customRunCommand:y,deleteScanPointModal:R,directLan:ge,editIpModalData:J,editableSettingsText:_e,emailFileCounts:Ce,executeRemoteInstallDriver:Pe,expandedDriverMenus:q,expandedDrivers:ne,expandedPrinters:Y,fetchCameraFiles:me,fetchCameraStatus:f,fetchRemotePage:U,fetchRemotePageOld:M,ftpDetailData:Q,getDestinationStatus:l=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:s=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:h,handleAddPrivateFtp:T,handleAddPublicFtp:k,handleCloseWebPreview:L,handleConfirmDeleteScanPoint:b,handleCopierClick:v,handleDeleteCamera:C,handleDeleteCameraFile:W,handleDeleteDest:z,handleEditIP:$,handleFetchEntryDetail:ae,handleHistoryBack:B,handleHistoryForward:E,handleOpenStorageFiles:a,handlePlaySegmentFile:m,handleQueryVideo:w,handleRecord30s:I,handleRefetchAddressBook:K,handleRemoteInstallDriver:Z,handleSaveAuth:V,handleSaveCameraConfig:ee,handleSaveEditIP:o,handleTriggerUtilityExec:x,handleSaveSettings:O,handleStartToshibaVnc:oe,handleTestCameraConnection:c,handleToggleDirectLan:ve,handleViewScanPointsJson:be,installDriverModal:de,ipInputModal:Me,isRecording30s:Le,isSavingSettings:Oe,lanSites:$e,lanSitesLoading:Fe,liveAddressBooks:A,lockAspect:pe,pollCommandStatus:Ie,previewBlobUrl:ke,privateFtpData:je,privateFtpLoading:te,publicFtpData:dt,publicFtpLoading:ye,queriedVideoUrl:pt,queryDuration:ot,queryTimestamp:Kt,queryVideoLoading:Et,recording30sCountdown:Lt,remoteLockPrinter:Rt,resolveRelativePath:Ct,saveAuthLoading:Nt,savedLocal:ir,scaleX:ar,scaleY:or,scanAutoOpenDir:sr,scanAutoOpenFile:lr,scanPointsViewerModal:Ve,selectedCamera:cr,selectedCameraAgentUid:dr,selectedLan:Je,selectedLanUid:ht,selectedTargetAgents:yt,selectedUtilityAgent:Dt,setActiveLoadingFile:qe,setActiveModal:et,setActiveTab:Mt,setAllocatedVncAddr:Ot,setCameraFiles:Re,setCameraForm:ft,setCameraLogs:Jt,setCameraStatus:st,setCameraTestLoading:kt,setCameraTestResult:Te,setCameras:qt,setCamerasLoading:Xt,setCommandStatus:Qt,setConfirmModal:Ne,setCopierCredentials:De,setCustomRecordDuration:Ft,setCustomRunCommand:mt,setDeleteScanPointModal:Rr,setDirectLan:Nr,setEditIpModalData:Dr,setEditableSettingsText:Mr,setEmailFileCounts:At,setExpandedDriverMenus:Or,setExpandedDrivers:Fr,setExpandedPrinters:Yt,setFtpDetailData:Pt,setInstallDriverModal:Ur,setIpInputModal:Ut,setIsRecording30s:pr,setIsSavingSettings:Br,setLanSites:Gr,setLanSitesLoading:zr,setLiveAddressBooks:Hr,setLockAspect:Zt,setPreviewBlobUrl:bt,setPrivateFtpData:Ke,setPrivateFtpLoading:Wr,setPublicFtpData:$r,setPublicFtpLoading:Vr,setQueriedVideoUrl:Kr,setQueryDuration:Jr,setQueryTimestamp:mr,setQueryVideoLoading:qr,setRecording30sCountdown:gr,setRemoteLockPrinter:Xr,setSaveAuthLoading:Bt,setScaleX:Qr,setScaleY:Yr,setScanAutoOpenDir:Zr,setScanAutoOpenFile:en,setScanPointsViewerModal:tn,setSelectedCamera:rn,setSelectedCameraAgentUid:nn,setSelectedLanUid:an,setSelectedTargetAgents:tt,setSelectedUtilityAgent:Xe,setSettingsSaveStatus:on,setShowPreviewDetails:sn,setShowSettings:Gt,setStorageFiles:ln,setStorageLoading:cn,setStorageModalData:dn,setToasts:pn,setToshibaVncData:er,setUtilityActionPending:mn,setUtilityCommands:ur,setUtilityCommandsLoading:gn,setUtilitySettingsLoading:un,setUtilityStatusMsg:hn,setViewOutputModal:fn,setVncTunnelLoading:xn,setWebPreviewHistory:_n,setWebPreviewHistoryIndex:xt,setWebPreviewLoading:yn,setWebPreviewModal:bn,setWebPreviewTab:vn,settingsSaveStatus:lt,showPreviewDetails:vt,showSettings:Sn,storageFiles:wn,storageLoading:Tn,storageModalData:Cn,toasts:hr,toshibaVncData:tr,utilityActionPending:ct,utilityCommands:zt,utilityCommandsLoading:kn,utilitySettingsLoading:Ge,utilityStatusMsg:rr,viewOutputModal:fr,vncTunnelLoading:Ht,webPreviewHistory:An,webPreviewHistoryIndex:rt,webPreviewLoading:ue,webPreviewModal:jt,webPreviewTab:xr}=n;return e.jsx(e.Fragment,{children:e.jsx(Be.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:t.tabContent,children:e.jsx(jr,{children:Je.agents.filter(Se=>Se.is_agent_active).length===0?e.jsx("div",{style:t.emptyText,children:"Không có Agent nào đang online trong mạng LAN này."}):Je.agents.filter(Se=>Se.is_agent_active).map(Se=>{const nt=Se.is_agent_active;return e.jsxs(Ir,{children:[e.jsxs("div",{style:t.cardHeader,children:[e.jsxs("span",{style:t.cardTitle,children:["💻 ",Se.hostname]}),e.jsx("span",{style:{...t.statusBadge,color:nt?"var(--color-status-online)":"var(--color-status-offline)",borderColor:nt?"var(--color-status-online)":"var(--color-status-offline)",background:nt?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:nt?Se.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]}),e.jsxs("div",{style:t.cardDetails,children:[e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"UID:"}),e.jsx("span",{style:{...t.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:Se.agent_uid})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...t.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[Se.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async we=>{we.stopPropagation();try{const ze=await at(Se.agent_uid,"get_agent_ip","");if(ze.ok&&ze.command_id){n.showToast&&n.showToast("Đang yêu cầu lấy lại IP cục bộ...","info");const He=ze.command_id,it=Date.now(),_t=setInterval(async()=>{try{if(Date.now()-it>12e3){clearInterval(_t);return}const se=await Tt(He);se.status==="success"?(clearInterval(_t),n.fetchLanSitesData&&await n.fetchLanSitesData(!0),n.showToast&&n.showToast("Đã cập nhật IP cục bộ mới nhất!","success")):se.status==="failed"&&(clearInterval(_t),n.showToast&&n.showToast("Không thể lấy lại IP cục bộ: "+(se.error||"Thất bại"),"error"))}catch(se){console.error(se),clearInterval(_t)}},1e3)}else n.showToast&&n.showToast("Gửi yêu cầu thất bại: "+(ze.error||"Lỗi kết nối"),"error")}catch(ze){n.showToast&&n.showToast("Lỗi: "+ze.message,"error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:we=>we.currentTarget.style.opacity="1",onMouseLeave:we=>we.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:t.detailValue,children:Se.local_mac||"—"})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:t.detailValue,children:(()=>{const we=(Se.ftp_sites||[]).find(Ue=>(Ue.name||"").toLowerCase()==="goxprint")||(Se.ftp_sites||[])[0],ze=(we==null?void 0:we.path)||"",He=nr((Je==null?void 0:Je.lan_uid)||""),it=nr(Se.agent_uid||""),se=`storage/uploads/scans/${nr(Se.lead||"default")}/${He}/${it}/`,Qe=Je?Je.emails.filter(Ue=>Ue.email_type==="private"&&Ue.pc_name&&Ue.pc_name.toLowerCase().trim()===Se.agent_uid.toLowerCase().trim()):[],Wt=Qe.reduce((Ue,St)=>Ue+(Ce[St.email]??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:ze?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:ze?"normal":"italic"},children:ze||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:se})]})]}),Qe.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[Qe.map(Ue=>{const St=Ce[Ue.email]??0;return e.jsxs("button",{style:{...t.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>a((Je==null?void 0:Je.lan_uid)||"",Ue.email),title:`Xem tệp của ${Ue.email}`,children:["📁 ",St," tệp"]},Ue.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[Wt," tệp"]})]})]}),Qe.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:t.detailValue,children:Se.ftp_ports||"—"})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:t.detailValue,children:e.jsx("button",{onClick:()=>{Xe(Se),et("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:t.detailValue,children:Se.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!Se.ftp_sites||Se.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:Se.ftp_sites.map((we,ze)=>{const He=we.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${He?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:He?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:He?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:He?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:He?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",we.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",He?"Đang chạy":"Đã dừng",")"]})]}),we.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",we.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:we.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:we.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:we.ftp_password||"goxprint"})]})]})]})]},ze)})})]})]},Se.agent_uid)})})},"agents-tab")})}function Hn(n){var Wt,Ue,St,_r,yr,br,vr,Sr,wr,Tr,Cr;const{AgentPage:i,activeLoadingFile:_,activeModal:g,activeTab:G,allocatedVncAddr:H,cameraFiles:le,cameraForm:ce,cameraLogs:he,cameraStatus:ie,cameraTestLoading:p,cameraTestResult:P,cameras:re,camerasLoading:S,commandStatus:xe,confirmModal:F={isOpen:!1},accessDeniedState:u={isOpen:!1,ip:""},copierCredentials:D,customRecordDuration:y,customRunCommand:R,deleteScanPointModal:ge={isOpen:!1},directLan:J,editIpModalData:_e={isOpen:!1},editableSettingsText:Ce,emailFileCounts:Pe,executeRemoteInstallDriver:q,expandedDriverMenus:ne,expandedDrivers:Y,expandedPrinters:me,fetchCameraFiles:f,fetchCameraStatus:U,fetchRemotePage:M,fetchRemotePageOld:Q,formatBytes:l,formatJsonText:s,ftpDetailData:h,getDestinationStatus:T=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:k=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:L,handleAddPrivateFtp:b,handleAddPublicFtp:v,handleCloseWebPreview:C,handleConfirmDeleteScanPoint:W,handleCopierClick:z,handleDeleteCamera:$,handleDeleteCameraFile:ae,handleDeleteDest:B,handleEditIP:E,handleEmergencyRestart:a,handleFetchEntryDetail:m,handleHistoryBack:w,handleHistoryForward:I,handleOpenStorageFiles:K,handlePlaySegmentFile:Z,handleQueryVideo:V,handleRecord30s:ee,handleRefetchAddressBook:o,handleRemoteInstallDriver:x,handleSaveAuth:O,handleSaveCameraConfig:oe,handleSaveEditIP:c,handleSaveSettings:ve,handleStartToshibaVnc:be,handleTestCameraConnection:de,handleToggleDirectLan:Me,handleToggleSetting:Le,handleTriggerUtility:Oe,handleTriggerUtilityExec:$e,handleViewScanPointsJson:Fe,installDriverModal:A={isOpen:!1},ipInputModal:pe={isOpen:!1},isRecording30s:Ie,isSavingSettings:ke,lanSites:je,lanSitesLoading:te,liveAddressBooks:dt,lockAspect:ye,modalContentRef:pt,pollCommandStatus:ot,previewBlobUrl:Kt,previewIframeRef:Et,privateFtpData:Lt,privateFtpLoading:Rt,publicFtpData:Ct,publicFtpLoading:Nt,queriedVideoUrl:ir,queryDuration:ar,queryTimestamp:or,queryVideoLoading:sr,recording30sCountdown:lr,remoteLockPrinter:Ve,resolveRelativePath:cr,saveAuthLoading:dr,savedLocal:Je,scaleX:ht,scaleY:yt,scanAutoOpenDir:Dt,scanAutoOpenFile:qe,scanPointsViewerModal:et={isOpen:!1},selectedCamera:Mt,selectedCameraAgentUid:Ot,selectedLan:Re,selectedLanUid:ft,selectedTargetAgents:Jt,selectedUtilityAgent:st,setActiveLoadingFile:kt,setActiveModal:Te,setActiveTab:qt,setAllocatedVncAddr:Xt,setCameraFiles:Qt,setCameraForm:Ne,setCameraLogs:De,setCameraStatus:Ft,setCameraTestLoading:mt,setCameraTestResult:Rr,setCameras:Nr,setCamerasLoading:Dr,setCommandStatus:Mr,setConfirmModal:At,setCopierCredentials:Or,setCustomRecordDuration:Fr,setCustomRunCommand:Yt,setDeleteScanPointModal:Pt,setDirectLan:Ur,setEditIpModalData:Ut,setEditableSettingsText:pr,setEmailFileCounts:Br,setExpandedDriverMenus:Gr,setExpandedDrivers:zr,setExpandedPrinters:Hr,setFtpDetailData:Zt,setInstallDriverModal:bt,setIpInputModal:Ke,setIsRecording30s:Wr,setIsSavingSettings:$r,setLanSites:Vr,setLanSitesLoading:Kr,setLiveAddressBooks:Jr,setLockAspect:mr,setPreviewBlobUrl:qr,setPrivateFtpData:gr,setPrivateFtpLoading:Xr,setPublicFtpData:Bt,setPublicFtpLoading:Qr,setQueriedVideoUrl:Yr,setQueryDuration:Zr,setQueryTimestamp:en,setQueryVideoLoading:tn,setRecording30sCountdown:rn,setRemoteLockPrinter:nn,setSaveAuthLoading:an,setScaleX:tt,setScaleY:Xe,setScanAutoOpenDir:on,setScanAutoOpenFile:sn,setScanPointsViewerModal:Gt,setSelectedCamera:ln,setSelectedCameraAgentUid:cn,setSelectedLanUid:dn,setSelectedTargetAgents:pn,setSelectedUtilityAgent:er,setSettingsSaveStatus:mn,setShowPreviewDetails:ur,setShowSettings:gn,setStorageFiles:un,setStorageLoading:hn,setStorageModalData:fn,setToasts:xn,setToshibaVncData:_n,setUtilityActionPending:xt,setUtilityCommands:yn,setUtilityCommandsLoading:bn,setUtilitySettingsLoading:vn,setUtilityStatusMsg:lt,setViewOutputModal:vt,setVncTunnelLoading:Sn,setWebPreviewHistory:wn,setWebPreviewHistoryIndex:Tn,setWebPreviewLoading:Cn,setWebPreviewModal:hr,setWebPreviewTab:tr,settingsSaveStatus:ct,showPreviewDetails:zt,showSettings:kn,showToast:Ge,storageFiles:rr,storageLoading:fr,storageModalData:Ht={isOpen:!1},toasts:An,toshibaVncData:rt,utilityActionPending:ue,utilityCommands:jt,utilityCommandsLoading:xr,utilitySettingsLoading:Se,utilityStatusMsg:nt,viewOutputModal:we={isOpen:!1},vncTunnelLoading:ze,webPreviewHistory:He,webPreviewHistoryIndex:it,webPreviewLoading:_t,webPreviewModal:se={isOpen:!1},webPreviewTab:Qe}=n;return e.jsxs(e.Fragment,{children:[e.jsx(Ye,{children:g&&e.jsx("div",{style:t.modalOverlay,onClick:()=>Te(null),children:e.jsxs(Be.div,{style:t.modalCard,onClick:r=>r.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[g==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:t.modalSubtitle,children:Ht.email})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:fr?e.jsxs("div",{style:t.modalLoading,children:[e.jsx(Ze,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):rr.length===0?e.jsx("div",{style:t.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:t.filesList,children:rr.map((r,d)=>e.jsxs("div",{style:t.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${r.url}`,target:"_blank",rel:"noreferrer",style:t.fileLinkName,children:r.name}),e.jsxs("div",{style:t.fileMetaDetails,children:["Dung lượng: ",l(r.size)," · Mtime: ",new Date(r.mtime).toLocaleString("vi-VN")]}),r.upload_completed_at&&e.jsxs("div",{style:t.fileUploadMeta,children:["Tải lên VPS: ",new Date(r.upload_completed_at).toLocaleTimeString("vi-VN"),r.upload_duration!=null?` (${r.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${r.url}`,download:!0,target:"_blank",rel:"noreferrer",style:t.fileDownloadBtn,children:"Tải về"})]},d))})}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>K(Ht.lanUid,Ht.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Te(null),children:"Đóng"})]})]}),g==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:t.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:Ct.name,onChange:r=>Bt(d=>({...d,name:r.target.value}))}),e.jsx("span",{style:t.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:t.modalInput,placeholder:"VD: goxprint@gmail.com",value:Ct.email,onChange:r=>Bt(d=>({...d,email:r.target.value}))}),e.jsx("span",{style:t.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:t.modalInput,value:Ct.agentUid,onChange:r=>Bt(d=>({...d,agentUid:r.target.value})),children:(Re&&Re.agents||[]).filter(r=>r.is_agent_active).map(r=>e.jsxs("option",{value:r.agent_uid,children:[r.hostname," (",r.local_ip,")"]},r.agent_uid))})]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:v,disabled:Nt,children:Nt?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Te(null),children:"Hủy bỏ"})]})]}),g==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:t.modalInput,placeholder:"VD: user.pc1@gmail.com",value:Lt.email,onChange:r=>gr(d=>({...d,email:r.target.value}))}),e.jsxs("span",{style:t.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",Lt.agentUid]})]})}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:b,disabled:Rt,children:Rt?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Te(null),children:"Hủy bỏ"})]})]}),g==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:t.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:t.modalDetailsList,children:[e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...t.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(Wt=infoDetailData.details)==null?void 0:Wt.proto})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Server Host:"}),e.jsx("span",{style:t.detailValue,children:(Ue=infoDetailData.details)==null?void 0:Ue.server})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:t.detailValue,children:(St=infoDetailData.details)==null?void 0:St.port})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...t.detailValue,fontFamily:"monospace"},children:(_r=infoDetailData.details)==null?void 0:_r.path})]})]})}),e.jsx("div",{style:t.modalFooter,children:e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>Te(null),children:"Đóng cửa sổ"})})]}),g==="ftp_detail"&&h&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:t.modalSubtitle,children:["Cổng Port: ",h.port]})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>{Te(null),Zt(null)},children:"×"})]}),e.jsx("div",{style:t.modalBody,children:e.jsxs("div",{style:t.modalDetailsList,children:[e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...t.detailValue,fontWeight:700,color:"var(--color-primary)"},children:h.port})]}),e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...t.detailValue,fontWeight:700,color:h.error?"var(--color-error)":"var(--color-success)"},children:h.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),h.error&&e.jsxs("div",{style:t.detailRow,children:[e.jsx("span",{style:t.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...t.detailValue,color:"var(--color-error)"},children:h.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...t.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:h.path})]})]})}),e.jsx("div",{style:t.modalFooter,children:e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Te(null),Zt(null)},children:"Đóng cửa sổ"})})]}),g==="utilities"&&st&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:t.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:t.modalSubtitle,children:["Máy: ",st.hostname," · IP: ",st.local_ip,":",st.web_port||9173]})]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>{Te(null),er(null),lt(null)},children:"×"})]}),e.jsxs("div",{style:{...t.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[nt&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:nt.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:nt.isError?"#ef4444":"#10b981",border:`1px solid ${nt.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:nt.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:Se?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(Ze,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:qe,onChange:()=>Le("scan_auto_open_file",qe),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Dt,onChange:()=>Le("scan_auto_open_dir",Dt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500,fontSize:"0.8rem",color:"var(--color-text)"},children:"Lối tắt ngoài Desktop (%TEMP%/GoPrinxAgent/ftp)"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Tạo Shortcut thư mục Scan ra màn hình Desktop cho nhân viên dễ mở"})]}),e.jsx("button",{onClick:()=>{const r=jt.find(d=>d.command==="create_scan_shortcut");$e("create_scan_shortcut",(r==null?void 0:r.command_content)||"")},disabled:ue!==null,style:{padding:"6px 12px",fontSize:"0.75rem",borderRadius:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-primary)",color:"var(--color-primary)",cursor:ue!==null?"not-allowed":"pointer",whiteSpace:"nowrap",fontWeight:600,display:"flex",alignItems:"center",gap:"5px"},children:"🔗 Tạo Shortcut Desktop"})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[xr?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(Ze,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsxs(e.Fragment,{children:[jt.length>0?(()=>{const r=jt.filter(N=>N.command!=="dxdiag"&&N.command!=="open_web_setting"),d=r.findIndex(N=>N.command==="sync_all_scanpoints");if(d>-1){const[N]=r.splice(d,1);r.unshift(N)}return r.map(N=>{const X=N.command==="emergency_restart";return e.jsxs("button",{onClick:()=>$e(N.command,N.command_content),disabled:ue!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:X?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:ue!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:ue!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:Ae=>{ue===null&&(Ae.currentTarget.style.borderColor=X?"#ef4444":"var(--color-primary)",Ae.currentTarget.style.background=X?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:Ae=>{Ae.currentTarget.style.borderColor=X?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",Ae.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:ue===N.command?e.jsx(Ze,{size:"sm"}):N.icon||"🔧"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:X?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:N.label})]},N.command)})})():e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>Oe("printers"),disabled:ue!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:ue!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:ue!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{ue===null&&(r.currentTarget.style.borderColor="var(--color-primary)",r.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="var(--color-surface-light)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:ue==="printers"?e.jsx(Ze,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>Oe("scan"),disabled:ue!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:ue!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:ue!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{ue===null&&(r.currentTarget.style.borderColor="var(--color-primary)",r.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="var(--color-surface-light)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:ue==="scan"?e.jsx(Ze,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Thư mục Scan"})]})]}),e.jsxs("button",{onClick:()=>{if(!st)return;xt("check_watchdog"),lt({text:"⌛ Đang kiểm tra watchdog...",isError:!1});const r=jt.find(d=>d.command==="check_watchdog");triggerAgentUtilityExec(st.agent_uid,"check_watchdog",(r==null?void 0:r.command_content)||"").then(d=>{if(d.ok&&d.command_id){const X=Date.now(),Ae=setInterval(async()=>{if(Date.now()-X>3e4){clearInterval(Ae),lt({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),xt(null);return}try{const We=await getCommandStatus(d.command_id);if(We.status==="success"){clearInterval(Ae);const gt=We.result_payload||We.result||We.error||"Hoàn thành";vt({isOpen:!0,title:"🩺 Check Watchdog",content:gt}),lt(null),xt(null)}else if(We.status==="failed"){clearInterval(Ae);const gt=We.error||We.result_payload||We.result||"Failed";vt({isOpen:!0,title:"🩺 Check Watchdog",content:gt}),lt(null),xt(null)}}catch{}},2e3)}else lt({text:"❌ "+(d.error||"Không thể gửi lệnh"),isError:!0}),xt(null)}).catch(d=>{lt({text:"❌ "+d.message,isError:!0}),xt(null)})},disabled:ue!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:ue!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:ue!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{ue===null&&(r.currentTarget.style.borderColor="var(--color-primary)",r.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="var(--color-surface-light)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:ue==="check_watchdog"?e.jsx(Ze,{size:"sm"}):"🩺"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Check watchdog"})]}),e.jsxs("button",{onClick:a,disabled:ue!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"12px",padding:"16px 8px",cursor:ue!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:ue!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:r=>{ue===null&&(r.currentTarget.style.borderColor="#ef4444",r.currentTarget.style.background="rgba(239, 68, 68, 0.05)")},onMouseLeave:r=>{r.currentTarget.style.borderColor="rgba(239, 68, 68, 0.25)",r.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:ue==="emergency_restart"?e.jsx(Ze,{size:"sm"}):"🔌"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#ef4444",lineHeight:"1.2",wordBreak:"break-word"},children:"Emergency Kill"})]})]}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:R,onChange:r=>Yt(r.target.value),onKeyDown:r=>{r.key==="Enter"&&R.trim()&&Oe("run_command",{command_line:R.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:ue!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{R.trim()&&Oe("run_command",{command_line:R.trim()})},disabled:ue!==null||!R.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:R.trim()?"var(--color-primary)":"var(--color-surface)",color:R.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:R.trim()&&ue===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:ue==="run_command"?e.jsx(Ze,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(r=>e.jsx("button",{onClick:()=>Yt(r.cmd),disabled:ue!==null,title:r.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:R===r.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:R===r.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:ue!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:r.label},r.cmd))})]})]})]})]}),e.jsx("div",{style:t.modalFooter,children:e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Te(null),er(null),lt(null)},children:"Đóng cửa sổ"})})]}),g==="edit_ip"&&_e&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:r=>{const d=r.target.value;d&&Ut(N=>{if(!N)return null;const X=N.newPort||"2130";return{...N,newIp:`${d}:${X}`,newPort:X}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((Re==null?void 0:Re.agents)||[]).map((r,d)=>{const N=r.local_ip||r.ip||"",X=r.hostname||r.uid||`Agent ${d+1}`;return e.jsxs("option",{value:N,children:[X," (",N,")"]},d)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:_e.newPort||"",onChange:r=>{const d=r.target.value;Ut(N=>{if(!N)return null;let X=N.newIp||"";return X.includes(":")&&(X=X.split(":")[0]),{...N,newPort:d,newIp:d?`${X}:${d}`:X}})},placeholder:"2130",style:t.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:_e.newIp,onChange:r=>{const d=r.target.value;Ut(N=>{if(!N)return null;let X=N.newPort||"2130";return d.includes(":")&&(X=d.split(":")[1].trim()||X),{...N,newIp:d,newPort:X}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:t.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",_e.entry.folder||_e.entry.physical_path||_e.entry.folder_path]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>Te(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...t.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(_e.newIp||"").trim().includes(":")){Ge("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}c()},disabled:!_e.newIp.trim(),children:"Lưu lại"})]})]}),g==="remote_lock"&&Ve&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:Ve.name})," (",Ve.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Te(null),Ge(`Đang gửi lệnh khóa máy ${Ve.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ve.ip,action:"lock_machine",agent_uid:Ve.agentUid}).then(r=>{r.ok?Ge(`Đã gửi lệnh khóa máy ${Ve.name} thành công!`,"success"):Ge("Lỗi: "+(r.error||"Failed"),"error")}).catch(r=>{Ge("Lỗi: "+r.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Te(null),Ge(`Đang gửi lệnh mở khóa máy ${Ve.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ve.ip,action:"enable_machine",agent_uid:Ve.agentUid}).then(r=>{r.ok?Ge(`Đã gửi lệnh mở khóa máy ${Ve.name} thành công!`,"success"):Ge("Lỗi: "+(r.error||"Failed"),"error")}).catch(r=>{Ge("Lỗi: "+r.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),g==="toshiba_vnc"&&rt&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("h3",{style:t.modalTitle,children:["📺 Kết nối VNC - ",rt.printerName]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Te(null),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:ze?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:J?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{Te(null),window.open(`http://${rt.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):H?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${rt.agentUid}&ip=${rt.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async r=>{const d=r.currentTarget.getBoundingClientRect(),N=r.clientX-d.left,X=r.clientY-d.top,Ae=N/d.width,We=X/d.height,gt=Math.round(Ae*1024),$t=Math.round(We*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:rt.agentUid,ip:rt.ip,port:49105,x:gt,y:$t})})}catch(ut){console.error("VNC Click error:",ut)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!J&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:H})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(H),Ge("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),Ge("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${H}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{Te(null),M(rt.ip,"","GET",null,!1,rt.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(Ye,{children:F.isOpen&&e.jsx("div",{style:t.confirmOverlay,onClick:()=>At(r=>({...r,isOpen:!1})),children:e.jsxs(Be.div,{style:t.confirmModalCard,onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsxs("h3",{style:t.modalTitle,children:["⚠️ ",F.title]}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>At(r=>({...r,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:t.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:F.message})}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var r;At(d=>({...d,isOpen:!1})),(r=F.onConfirm)==null||r.call(F)},children:"Đồng ý"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>At(r=>({...r,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(Ye,{children:u.isOpen&&e.jsx("div",{style:t.confirmOverlay,children:e.jsxs(Be.div,{style:{...t.confirmModalCard,maxWidth:"420px",textAlign:"center",border:"1px solid rgba(239, 68, 68, 0.4)",background:"rgba(24, 24, 32, 0.98)",padding:"24px"},onClick:r=>r.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"12px"},children:"🚫"}),e.jsx("h3",{style:{fontSize:"1.1rem",fontWeight:700,color:"var(--color-error)",margin:"0 0 12px 0"},children:"Truy cập bị từ chối"}),e.jsxs("p",{style:{fontSize:"0.88rem",color:"var(--color-text)",lineHeight:1.5,margin:"0 0 20px 0"},children:["Public IP ",e.jsx("strong",{children:u.ip})," không được chấp nhận, hãy liên hệ admin"]}),e.jsx("button",{onClick:()=>{window.location.href="/dashboard"},style:{width:"100%",padding:"10px 16px",fontSize:"0.85rem",fontWeight:700,background:"var(--color-primary)",color:"white",border:"none",borderRadius:"8px",cursor:"pointer"},children:"Quay về Dashboard ↗"})]})})}),e.jsx(Ye,{children:ge.isOpen&&e.jsx("div",{style:t.confirmOverlay,onClick:()=>Pt(r=>({...r,isOpen:!1})),children:e.jsxs(Be.div,{style:{...t.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Pt(r=>({...r,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((yr=ge.entry)==null?void 0:yr.name)||((br=ge.entry)==null?void 0:br.name_1)||((vr=ge.entry)==null?void 0:vr.email_address)||((Sr=ge.entry)==null?void 0:Sr.folder)||((wr=ge.entry)==null?void 0:wr.registration_no)||"không tên",'"']}),((Tr=ge.entry)==null?void 0:Tr.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(Cr=ge.entry)==null?void 0:Cr.registration_no]})]}),e.jsxs("div",{style:t.formGroup,children:[e.jsx("label",{style:t.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:t.modalInput,value:ge.agentUid,onChange:r=>Pt(d=>({...d,agentUid:r.target.value})),children:(Re&&Re.agents||[]).filter(r=>r.is_agent_active).map(r=>e.jsxs("option",{value:r.agent_uid,children:[r.hostname," (",r.local_ip,")"]},r.agent_uid))}),e.jsx("span",{style:t.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:W,children:"Xác nhận xóa"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Pt(r=>({...r,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(Ye,{children:A.isOpen&&e.jsx("div",{style:t.confirmOverlay,onClick:()=>bt(r=>({...r,isOpen:!1})),children:e.jsxs(Be.div,{style:t.confirmModalCard,onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>bt(r=>({...r,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:"0 0 12px 0"},children:["Bạn chuẩn bị cài đặt driver ",e.jsxs("strong",{children:['"',A.driverName,'"']})," từ xa."]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),!(Re!=null&&Re.agents)||Re.agents.filter(r=>r.is_agent_active).length===0?e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-text-secondary)",fontStyle:"italic",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px"},children:"Không có Agent online trong LAN này"}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px",maxHeight:"200px",overflowY:"auto"},children:Re.agents.filter(r=>r.is_agent_active).map(r=>{const d=A.selectedAgentUids.includes(r.agent_uid);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"0.82rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:d,onChange:N=>{bt(X=>{const Ae=X.selectedAgentUids;return N.target.checked?{...X,selectedAgentUids:[...Ae,r.agent_uid]}:{...X,selectedAgentUids:Ae.filter(We=>We!==r.agent_uid)}})},style:{width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsxs("span",{children:[r.hostname," (",r.local_ip,")"]})]},r.agent_uid)})})]})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:A.selectedAgentUids.length===0,onClick:()=>{bt(r=>({...r,isOpen:!1})),A.selectedAgentUids.forEach(r=>{q(A.printerId,A.brand,A.model,A.driverName,A.driverUrl,r)})},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>bt(r=>({...r,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(Ye,{children:pe.isOpen&&e.jsx("div",{style:{...t.confirmOverlay,zIndex:170},onClick:()=>Ke(r=>({...r,isOpen:!1,error:""})),children:e.jsxs(Be.div,{style:t.confirmModalCard,onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:t.modalTitle,children:pe.title}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>Ke(r=>({...r,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:t.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[pe.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:pe.value,onChange:r=>Ke(d=>({...d,value:r.target.value,error:""})),onKeyDown:r=>{if(r.key==="Enter"){const d=/^(\d{1,3}\.){3}\d{1,3}$/;if(!d.test(pe.value.trim())){Ke(Ae=>({...Ae,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const N=(pe.changeAllTo||"").trim();if(N&&!d.test(N)){Ke(Ae=>({...Ae,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const X=pe.onConfirm;Ke(Ae=>({...Ae,isOpen:!1,error:""})),X(pe.value.trim(),N)}r.key==="Escape"&&Ke(d=>({...d,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:pe.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:r=>{pe.error||(r.target.style.borderColor="var(--color-primary)")},onBlur:r=>{pe.error||(r.target.style.borderColor="var(--color-surface-light)")}}),pe.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:pe.changeAllTo||"",onChange:r=>Ke(d=>({...d,changeAllTo:r.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:r=>{r.target.style.borderColor="var(--color-primary)"},onBlur:r=>{r.target.style.borderColor="var(--color-surface-light)"}})]}),pe.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",pe.error]}),pe.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:pe.scanStatus})]}),e.jsxs("div",{style:t.modalFooter,children:[e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const r=/^(\d{1,3}\.){3}\d{1,3}$/;if(!r.test(pe.value.trim())){Ke(X=>({...X,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const d=(pe.changeAllTo||"").trim();if(d&&!r.test(d)){Ke(X=>({...X,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const N=pe.onConfirm;Ke(X=>({...X,isOpen:!1,error:""})),N(pe.value.trim(),d)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...t.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Ke(r=>({...r,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(Ye,{children:we.isOpen&&e.jsx("div",{style:{...t.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>vt(r=>({...r,isOpen:!1})),children:e.jsxs(Be.div,{style:{...t.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:r=>r.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:{...t.modalTitle,fontSize:"0.85rem"},children:we.title}),e.jsx("button",{style:t.modalCloseBtn,onClick:()=>vt(r=>({...r,isOpen:!1})),children:"×"})]}),we.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:pt,value:Ce,onChange:r=>pr(r.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),ct&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:ct.startsWith("❌")?"rgba(239,68,68,0.1)":ct.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:ct.startsWith("❌")?"#f87171":ct.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${ct.startsWith("❌")?"rgba(239,68,68,0.15)":ct.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:ct})]}):e.jsx("pre",{ref:pt,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:s(we.content)}),e.jsxs("div",{style:{...t.modalFooter,marginTop:"10px"},children:[we.title.includes("settings.json")&&e.jsx("button",{disabled:ke,style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:ke?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:ke?"not-allowed":"pointer"},onClick:ve,children:ke?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(we.title.includes("settings.json")?Ce:s(we.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>vt(r=>({...r,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(Ye,{children:se&&se.isOpen&&e.jsxs("div",{className:"web-preview-modal-overlay",style:{...t.confirmOverlay,zIndex:190,alignItems:"flex-start",paddingTop:"5vh"},onClick:C,children:[e.jsx("style",{children:`
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
            `}),(()=>{let r="Trang cấu hình máy in";if(se.html&&se.html!=="LOADING"&&!se.html.startsWith("ERROR:"))if(se.html==="DIRECT_LAN")r="Kết nối trực tiếp LAN";else{const d=se.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);d&&d[1]&&(r=d[1].trim())}return e.jsxs(Be.div,{className:"web-preview-modal-card",style:{...t.confirmModalCard,maxWidth:"1200px",width:"95%",height:"85vh",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px"},onClick:d=>d.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:t.modalHeader,children:[e.jsx("h3",{style:{...t.modalTitle,fontSize:"0.85rem"},children:se.title}),e.jsx("button",{style:t.modalCloseBtn,onClick:C,children:"×"})]}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",gap:"15px",minHeight:0},children:se.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px"},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"var(--color-text-secondary)",fontWeight:500},children:"Đang đợi phản hồi từ Agent..."}),e.jsx("span",{style:{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",textAlign:"center",maxWidth:"320px"},children:"Agent đang kết nối trực tiếp đến máy in và nạp cấu hình..."})]}):se.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"2.2rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600,textAlign:"center"},children:"Lỗi lấy trang Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.75rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"12px",background:"rgba(239, 68, 68, 0.08)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.15)",width:"100%",boxSizing:"border-box",fontFamily:"monospace"},children:se.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255, 255, 255, 0.03)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"var(--color-text)"},children:e.jsxs("span",{children:["🔌 Kết nối: ",e.jsx("strong",{children:J?"⚡ Trực tiếp LAN":"🌐 Qua Agent"})]})}),e.jsx("button",{onClick:()=>ur(!zt),style:{background:"none",border:"none",color:"var(--color-primary)",cursor:"pointer",fontWeight:600,fontSize:"0.72rem",display:"flex",alignItems:"center",gap:"4px"},children:zt?"Thu gọn ▲":"Cài đặt & Chi tiết ▼"})]}),zt&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",background:"rgba(16, 185, 129, 0.04)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 14px"},children:[e.jsxs("div",{style:{fontSize:"0.74rem",color:"var(--color-text-secondary)"},children:[e.jsx("span",{style:{color:"#10b981",fontWeight:700},children:"🟢 Kết nối Live:"})," ",r," (",e.jsx("span",{style:{fontFamily:"monospace"},children:se.ip}),")"]}),e.jsx("button",{onClick:()=>window.open(`http://${se.ip}/`,"_blank"),style:{padding:"6px 12px",fontSize:"0.72rem",fontWeight:600,background:"#10b981",border:"none",borderRadius:"6px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.15)"},children:"🌐 Mở trực tiếp LAN"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.74rem",fontWeight:600,color:"var(--color-text)"},children:"🔗 Chế độ kết nối:"}),e.jsxs("div",{style:{display:"flex",gap:"6px"},children:[e.jsx("button",{onClick:()=>Me(!1),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:J?"rgba(255,255,255,0.05)":"var(--color-primary)",color:J?"var(--color-text-secondary)":"white",border:J?"1px solid var(--color-surface-light)":"1px solid var(--color-primary)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"🔌 Qua Agent (Từ xa)"}),e.jsx("button",{onClick:()=>Me(!0),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:J?"#10b981":"rgba(255,255,255,0.05)",color:J?"white":"var(--color-text-secondary)",border:J?"1px solid #10b981":"1px solid var(--color-surface-light)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"⚡ Trực tiếp LAN (Cùng Wifi)"})]})]}),J&&window.location.protocol==="https:"&&e.jsxs("div",{style:{color:"#fbbf24",background:"rgba(251, 191, 36, 0.08)",border:"1px solid rgba(251, 191, 36, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["⚠️ ",e.jsx("strong",{children:"Mixed Content Block:"})," Trình duyệt di động/máy tính sẽ chặn kết nối HTTP trực tiếp đến IP máy in từ trang web bảo mật HTTPS. Để kết nối trực tiếp thành công, hãy mở trang web quản trị qua ",e.jsx("strong",{children:"HTTP"})," hoặc click nút ",e.jsx("strong",{children:"🌐 Mở trực tiếp LAN"})," phía trên để truy cập trong tab mới."]}),J&&e.jsxs("div",{style:{color:"#60a5fa",background:"rgba(96, 165, 250, 0.08)",border:"1px solid rgba(96, 165, 250, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["💡 ",e.jsx("strong",{children:"Chế độ trực tiếp LAN:"})," Thiết bị kết nối trực tiếp đến IP máy in qua mạng Wifi nội bộ.",e.jsxs("ul",{style:{margin:"4px 0 0 16px",padding:0},children:[e.jsx("li",{children:"Thanh địa chỉ và Lịch sử duyệt sẽ không tự động cập nhật."}),e.jsx("li",{children:"Chức năng thu phóng (Ngang/Dọc) trong iframe không áp dụng (vui lòng zoom bằng thao tác vuốt)."})]})]}),!J&&e.jsxs("div",{style:{color:"var(--color-text-secondary)",background:"rgba(255, 255, 255, 0.02)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:[e.jsx("strong",{style:{color:"var(--color-primary)"},children:"🛠️ Nhật ký & Thông số kết nối ngược (SSH Reverse Tunnel):"}),e.jsxs("div",{style:{marginTop:"6px",fontFamily:"monospace",display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy khách (Agent Uid):"})," ",se.agentUid]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Địa chỉ IP Máy in:"})," ",se.ip]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng dịch vụ máy in:"})," 80"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy chủ VPS:"})," 31.97.76.62"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng kết nối trên VPS (Assigned Port):"})," ",se.url?se.url.split(":").pop():"Đang cấp phát..."]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Phương thức xác thực:"})," SSH Key pair (Root User)"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Đường dẫn kết nối:"})," ",e.jsx("span",{style:{color:"var(--color-text)"},children:se.url||"N/A"})]}),se.url&&e.jsxs("div",{style:{color:"#fbbf24",marginTop:"4px"},children:["⚠️ Nếu Iframe hiển thị màn hình trắng / lỗi kết nối, có thể do trình duyệt chặn nội dung Mixed Content (HTTP trên trang HTTPS). Hãy click nút ",e.jsx("strong",{children:"🔗 Mở tab mới ↗"})," ở thanh điều khiển phía dưới để xem trực tiếp."]})]})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 12px"},children:[e.jsx("button",{onClick:w,disabled:it<=0,style:{background:"none",border:"none",color:it<=0?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:it<=0?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Back",children:"◀"}),e.jsx("button",{onClick:I,disabled:it>=He.length-1,style:{background:"none",border:"none",color:it>=He.length-1?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:it>=He.length-1?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Forward",children:"▶"}),e.jsx("button",{onClick:()=>M(se.ip,se.path),style:{background:"none",border:"none",color:"var(--color-text)",cursor:"pointer",padding:"4px",fontSize:"0.8rem",display:"flex",alignItems:"center"},title:"Refresh",children:"🔄"}),e.jsxs("div",{style:{flex:1,background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontFamily:"monospace",color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:["http://",se.ip,se.path||"/"]}),se.url&&e.jsx("a",{href:se.url,target:"_blank",rel:"noreferrer",style:{background:"var(--color-primary)",color:"white",border:"none",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",marginLeft:"8px"},title:"Mở trang quản trị Web Image Monitor trong tab mới",children:"🔗 Mở tab mới ↗"})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid var(--color-surface-light)",gap:"15px",paddingBottom:"4px"},children:[e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:Qe==="iframe"?600:500,color:Qe==="iframe"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:Qe==="iframe"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>tr("iframe"),children:"🌐 Giao diện máy in"}),e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:Qe==="html"?600:500,color:Qe==="html"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:Qe==="html"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>tr("html"),children:"📄 Xem mã HTML (Text)"})]}),Qe==="html"?e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px",flex:1,minHeight:0},children:J?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"10px",color:"var(--color-text-secondary)",fontSize:"0.76rem",padding:"20px",textAlign:"center"},children:[e.jsx("span",{children:"📄 Chế độ trực tiếp LAN không tải mã nguồn về server."}),e.jsxs("span",{style:{fontSize:"0.70rem",color:"rgba(255,255,255,0.4)"},children:["Hãy chuyển sang chế độ ",e.jsx("strong",{children:"Qua Agent (Từ xa)"})," để phân tích và xem mã nguồn HTML của máy in."]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Mã nguồn HTML gốc từ máy in:"}),e.jsx("button",{style:{border:"none",background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",padding:"4px 10px",borderRadius:"6px",fontSize:"0.72rem",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"},onClick:()=>{navigator.clipboard.writeText(se.html),Ge("Đã copy mã HTML vào clipboard","success")},children:"📋 Copy HTML"})]}),e.jsx("pre",{style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.5,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)"},children:se.html})]})}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↔️ Ngang:"}),e.jsx("button",{onClick:()=>{const d=Math.max(.3,parseFloat((ht-.05).toFixed(2)));tt(d),ye&&Xe(d)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:ht,onChange:d=>{const N=parseFloat(d.target.value);tt(N),ye&&Xe(N)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsx("button",{onClick:()=>{const d=Math.min(2,parseFloat((ht+.05).toFixed(2)));tt(d),ye&&Xe(d)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:"var(--color-text)"},children:[Math.round(ht*100),"%"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↕️ Dọc:"}),e.jsx("button",{onClick:()=>{const d=Math.max(.3,parseFloat((yt-.05).toFixed(2)));Xe(d),ye&&tt(d)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ye,children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:yt,onChange:d=>{const N=parseFloat(d.target.value);Xe(N),ye&&tt(N)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)",opacity:ye?.5:1},disabled:ye}),e.jsx("button",{onClick:()=>{const d=Math.min(2,parseFloat((yt+.05).toFixed(2)));Xe(d),ye&&tt(d)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ye,children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:ye?"var(--color-text-secondary)":"var(--color-text)"},children:[Math.round(yt*100),"%"]})]}),e.jsx("button",{onClick:()=>{mr(!ye),ye||Xe(ht)},style:{background:ye?"rgba(124, 106, 247, 0.15)":"var(--color-background)",border:ye?"1px solid var(--color-accent, #7c6af7)":"1px solid var(--color-surface-light)",color:ye?"var(--color-accent, #7c6af7)":"var(--color-text-secondary)",padding:"4px 10px",borderRadius:"6px",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",transition:"all 0.2s ease"},title:ye?"Bỏ liên kết tỷ lệ":"Liên kết tỷ lệ Ngang & Dọc",children:ye?"🔗 Đồng bộ":"🔓 Tự do"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("button",{onClick:()=>{tt(.95),Xe(.95)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"Mặc định"}),e.jsx("button",{onClick:()=>{tt(1),Xe(1)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"100%"}),e.jsx("button",{onClick:()=>{var d;try{const N=Et.current;if(!N)return;const X=N.contentDocument||((d=N.contentWindow)==null?void 0:d.document);if(X&&X.body){const Ae=X.body.style.width,We=X.body.style.transform;X.body.style.transform="none",X.body.style.width="auto";const gt=X.body.scrollWidth||X.documentElement.scrollWidth||1024,$t=N.clientWidth||800;if(X.body.style.width=Ae,X.body.style.transform=We,gt>0&&$t>0){let ut=$t/gt;ut=Math.max(.3,Math.min(1.5,ut)),ut=Math.round(ut*20)/20,tt(ut),ye&&Xe(ut)}}}catch(N){console.error(N)}},style:{background:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)",color:"#10b981",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:600},children:"📐 Vừa khung"})]})]}),e.jsxs("div",{style:{flex:1,minHeight:0,background:"white",borderRadius:"8px",overflow:"hidden",border:"1px solid var(--color-surface-light)",position:"relative"},children:[e.jsx("iframe",{ref:Et,src:se.url?se.url:J?`http://${se.ip}${se.path||"/"}`:Kt,style:{width:"100%",height:"100%",border:"none",background:"white"}}),_t&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang đợi phản hồi từ Agent..."})]})]})]})]})}),e.jsxs("div",{style:{...t.modalFooter,marginTop:"15px",flexShrink:0,borderTop:"1px solid var(--color-surface-light)",paddingTop:"12px"},children:[se.html!=="LOADING"&&!se.html.startsWith("ERROR:")&&e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const d=new Blob([se.html],{type:"text/html;charset=utf-8"}),N=URL.createObjectURL(d);window.open(N,"_blank")},children:"↗️ Xem mã HTML gốc"}),e.jsx("button",{style:{...t.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)",marginLeft:"8px"},onClick:()=>hr(d=>d?{...d,isOpen:!1}:null),children:"Đóng"})]})]})})()]})}),e.jsx(Ye,{children:et.isOpen&&e.jsx(Be.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>Gt(r=>({...r,isOpen:!1})),children:e.jsxs(Be.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:r=>r.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[et.copierName," · MAC: ",et.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>Gt(r=>({...r,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:et.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(et.jsonData,null,2)),Ge("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(et.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>Gt(r=>({...r,isOpen:!1})),children:"Đóng"})})]})})})]})}const Wn=(n={})=>{const{showToast:i,pollCommandStatus:_,utilityCommands:g}=n,[G,H]=j.useState([]),[le,ce]=j.useState(()=>localStorage.getItem("goxprint_selected_lan_uid")||""),[he,ie]=j.useState(!1),[p,P]=j.useState(()=>{try{const l=localStorage.getItem("goxprint_expanded_printers");return l?JSON.parse(l):{}}catch{return{}}}),[re,S]=j.useState({}),[xe,F]=j.useState({}),[u,D]=j.useState({}),[y,R]=j.useState({isOpen:!1,copier:null,oldIp:"",newIp:"",targetAgentUid:"",status:"",error:""}),[ge,J]=j.useState({isOpen:!1,ip:""}),_e=j.useRef({}),Ce=j.useMemo(()=>localStorage.getItem("goxprint_last_viewed_copier_id"),[]),Pe=j.useCallback(async(l=!1)=>{l&&ie(!0);try{const s=await In(),h=(s==null?void 0:s.rows)||(Array.isArray(s)?s:[]);H(h);try{const T=(s==null?void 0:s.client_ip)||"",k=!!(s!=null&&s.is_allowed),L=(s==null?void 0:s.active_public_ips)||[],b=[];h.forEach(W=>{(W.agents||[]).forEach(z=>{const $=z.public_ip||z.wan_ip||"",ae=z.local_ip||"";($===T||ae===T)&&b.push(z)})});const v=b.length>0,C=k||v;if(console.log("=================================================="),console.log("🌐 [PUBLIC IP ACCESS CONTROL CHECK]"),console.log("📌 IP Public hiện tại của trình duyệt:",T),console.log("🛡️ Danh sách Public IP đang Active trên Server:",L),console.log("✅ Quyền truy cập toàn bộ LAN (Is Whitelisted/Allowed):",k?"CÓ (FULL ACCESS)":"KHÔNG (LIMITED BY AGENT PUBLIC IP)"),console.log("💻 Danh sách Agent có cùng Public IP với trình duyệt:",b.length>0?b:k?"Đang mở Full LAN (Tất cả Agent)":"Không tìm thấy Agent cùng IP"),console.log("=================================================="),!C&&T){console.warn(`[ACCESS DENIED] Public IP ${T} is not allowed and not in the same network.`),J({isOpen:!0,ip:T}),setTimeout(()=>{alert(`Public IP ${T} không được chấp nhận, hãy liên hệ admin`),window.location.href="/dashboard"},100);return}console.log("[FRONTEND SCANPOINTS VPS] DANH SÁCH DANH BẠ TỪ SCANPOINTS VPS (< 3 NGÀY):"),h.forEach(W=>{(W.printers||[]).forEach(z=>{var E;const $=z.address_book_sync||{},ae=Array.isArray($.address_list)?$.address_list:((E=$.address_book_data)==null?void 0:E.address_list)||[],B=z.mac_address||z.mac_id||"—";ae.length>0&&console.log(`📌 Máy in [${z.printer_name||z.name}] - IP: ${z.ip} | MAC: ${B} (${ae.length} điểm scan trong ScanPoints VPS):`,ae)})}),console.log("==================================================")}catch(T){console.error("Console log error:",T)}h.length>0&&ce(T=>{if(T&&h.some(L=>L.lan_uid===T))return T;const k=h[0].lan_uid;return localStorage.setItem("goxprint_selected_lan_uid",k),k}),l&&i("Đã cập nhật danh sách mạng LAN","success")}catch(s){console.error("Failed to fetch LAN sites:",s),l&&i(`Không thể tải dữ liệu LAN: ${s.message}`,"error")}finally{ie(!1)}},[i]);j.useEffect(()=>{Pe()},[Pe]);const q=j.useMemo(()=>!G||G.length===0?null:G.find(l=>l.lan_uid===le)||G[0],[G,le]),ne=j.useCallback(l=>{if(!l)return;const s=l.lan_uid,h=Date.now();if(!_e.current[s]||h-_e.current[s]>180*1e3){_e.current[s]=h;const T=(l.agents||[]).filter(k=>k.is_agent_active);if(T.length>0){T.sort((L,b)=>{const v=new Date(L.last_seen||L.updated_at||L.last_ping||0).getTime();return new Date(b.last_seen||b.updated_at||b.last_ping||0).getTime()-v});const k=T[0];if(k&&_){i(`⏳ Agent (${k.agent_uid}) đang thực hiện quét ngầm mạng LAN...`,"info",6e3);const L=k,b=(g||[]).find(W=>W.command==="force_subnet_scan"),C={command:"force_subnet_scan",command_content:(b==null?void 0:b.command_content)||"",lead:l.lead};Ee(`/api/agents/${L.agent_uid}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify(C)}).then(W=>{const z=(W==null?void 0:W.command_id)||(W==null?void 0:W.id);z&&_(Number(z),`scan_lan_${s}`,async $=>{console.log("🔍 [PRINTAGENT RESULT] Kết quả force_subnet_scan:",$);let ae=[];const B=($==null?void 0:$.result)||($==null?void 0:$.result_payload)||($==null?void 0:$.output)||($==null?void 0:$.error_message)||($==null?void 0:$.raw)||"";if(Array.isArray(B))ae=B;else if(typeof B=="string"&&B.trim()){try{const E=JSON.parse(B.trim());Array.isArray(E)&&(ae=E)}catch{}if(ae.length===0)try{let E="";if(B.includes("__PRINTERS_JSON_START__"))E=B.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].trim();else{const a=B.match(/(\[\s*\{[\s\S]*\}\s*\])/);a&&(E=a[1])}if(E){const a=JSON.parse(E);Array.isArray(a)&&(ae=a)}}catch(E){console.error("🔍 [Frontend] Lỗi parse JSON máy in:",E)}}if(ae.length>0){i(`✓ Quét mạng LAN hoàn tất, tìm thấy ${ae.length} máy in!`,"success",4e3);try{await Ee("/api/new-devices",{method:"POST",body:JSON.stringify({lan_uid:s||"default",devices:ae})})}catch{}Pe()}else i("✓ Quét mạng LAN hoàn tất","success",4e3)},async $=>{i("[-] Quét mạng LAN có lỗi","error",4e3)},"⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN...")}).catch(W=>{console.error(W)})}}}},[i,_,g]),Y=j.useMemo(()=>{if(!q)return[];const l=(q.printers||[]).filter(s=>{const h=(s.printer_name||"").toLowerCase().trim();return!(h.includes("unknown")||h==="unknown printer"||h.includes("pdf")||h.includes("fax")||h.includes("brother")||h.includes("canon lbp")||h.includes("rustdesk"))});return Ce?[...l].sort((s,h)=>{const T=String(s.id)===Ce,k=String(h.id)===Ce;return T&&!k?-1:!T&&k?1:0}):l},[q,Ce]),me=j.useCallback(l=>{var b;const s=Number(l),h=(b=q==null?void 0:q.printers)==null?void 0:b.find(v=>Number(v.id)===s);if(!h||!q)return"";const T=(q.agents||[]).filter(v=>v.is_agent_active),k=u[s];if(k&&T.some(C=>C.agent_uid===k))return k;const L=T.find(v=>v.agent_uid===h.agent_uid)||T[0];return L?L.agent_uid:h.agent_uid||""},[q,u]),f=l=>{localStorage.setItem("goxprint_last_viewed_copier_id",l)};return j.useEffect(()=>{if(q){const l={};q.printers.forEach(s=>{const h=(q.agents||[]).filter(k=>k.is_agent_active),T=h.find(k=>k.agent_uid===s.agent_uid)||h[0];l[s.id]=T?T.agent_uid:s.agent_uid||""}),D(s=>({...l,...s})),S(s=>{const h={...s};return q.printers.forEach(T=>{const k=T.auth_user||T.user||"",L=T.auth_password||T.password||"",b=(()=>{try{const z=localStorage.getItem(`copier_auth_${T.id}`)||(T.mac_id?localStorage.getItem(`copier_auth_${T.mac_id}`):null);return z?JSON.parse(z):null}catch{return null}})(),v=h[T.id],C=(v==null?void 0:v.user)!==void 0?v.user:k!==""?k:(b==null?void 0:b.user)!==void 0?b.user:"",W=(v==null?void 0:v.pass)!==void 0?v.pass:L!==""?L:(b==null?void 0:b.pass)!==void 0?b.pass:"";h[T.id]={user:C,pass:W}}),h})}},[q]),{lanSites:G,setLanSites:H,selectedLanUid:le,setSelectedLanUid:ce,selectedLan:q,lanSitesLoading:he,setLanSitesLoading:ie,fetchLanSitesData:Pe,triggerLanScan:ne,filteredPrinters:Y,copierCredentials:re,setCopierCredentials:S,saveAuthLoading:xe,setSaveAuthLoading:F,handleSaveAuth:async l=>{const s=String(typeof l=="object"?l.id:l),h=typeof l=="object"?l.mac_id||l.mac_address||"":s,T=typeof l=="object"&&(l.printer_type||l.type)||"",k=re[s]||{user:"",pass:""};try{localStorage.setItem(`copier_auth_${s}`,JSON.stringify(k)),h&&localStorage.setItem(`copier_auth_${h}`,JSON.stringify(k))}catch{}F(L=>({...L,[s]:!0}));try{const L=await En(h||s,k.user,k.pass,h,T);if(L.ok){const b=L.command_id||L.id;b&&_?(i("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),_(b,s,v=>{const C=v!=null&&v.error?` (${v.error})`:v!=null&&v.result?` (${v.result})`:"";i(`Đã test đăng nhập thành công và lưu vào database!${C}`,"success",5e3),H(W=>W.map(z=>({...z,printers:z.printers.map($=>String($.id)===String(s)||h&&$.mac_id===h?{...$,auth_user:k.user,auth_password:k.pass}:$)}))),F(W=>({...W,[s]:!1}))},v=>{i(`Lỗi Agent lưu Auth: ${v}`,"error"),F(C=>({...C,[s]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(i("Đã lưu tài khoản Web UI máy photocopy thành công","success"),H(v=>v.map(C=>({...C,printers:C.printers.map(W=>String(W.id)===String(s)||h&&W.mac_id===h?{...W,auth_user:k.user,auth_password:k.pass}:W)}))),F(v=>({...v,[s]:!1})))}else throw new Error(L.error||"Lỗi lưu thông tin đăng nhập")}catch(L){i(`Lỗi lưu Auth: ${L.message}`,"error"),F(b=>({...b,[s]:!1}))}},editIpModalData:y,setEditIpModalData:R,handleEditIP:l=>{const s=me(l.id);R({isOpen:!0,copier:l,oldIp:l.ip||"",newIp:l.ip||"",targetAgentUid:s,status:"",error:""})},handleSaveEditIP:async()=>{if(!y.copier||!y.newIp)return;const l=y.copier,s=y.oldIp,h=y.newIp.trim(),T=y.targetAgentUid;if(!h){R(k=>({...k,error:"Vui lòng nhập địa chỉ IP mới!"}));return}R(k=>({...k,status:"⌛ Đang gửi lệnh đổi IP tới Agent...",error:""})),i(`Đang gửi lệnh đổi IP từ ${s} ➔ ${h}...`,"info",3e3);try{const L=(l.printer_type||l.printer_name||"").toLowerCase().includes("toshiba")?"toshiba_change_ftp":"ricoh_change_ftp",b=await at(T,L,"",{old_ip:s,new_ip:h,printer_ip:s,target_ip:s});if(!b.ok||!b.command_id)throw new Error(b.error||"Không thể tạo lệnh đổi IP");R(v=>({...v,status:"⌛ Agent đang kết nối máy in để thực hiện đổi IP..."})),_&&_(b.command_id,`edit_ip_${l.id}`,v=>{i(`✓ Đã đổi IP thành công từ ${s} ➔ ${h}!`,"success",5e3),H(C=>C.map(W=>({...W,printers:W.printers.map(z=>String(z.id)===String(l.id)||z.mac_id===l.mac_id?{...z,ip:h}:z)}))),R(C=>({...C,isOpen:!1,status:"",error:""}))},v=>{i(`[-] Lỗi đổi IP: ${v}`,"error"),R(C=>({...C,status:"",error:v}))},"⏳ Agent đang cập nhật địa chỉ IP trên máy photo...")}catch(k){R(L=>({...L,status:"",error:k.message||"Lỗi không xác định"})),i(`Lỗi gửi lệnh đổi IP: ${k.message}`,"error")}},expandedPrinters:p,setExpandedPrinters:P,selectedTargetAgents:u,setSelectedTargetAgents:D,getTargetAgentUid:me,handleCopierClick:f,accessDeniedState:ge,setAccessDeniedState:J}},kr=new Set(["get_agent_ip","get_public_ip","view_settings_json","view_printers_json","view_scan_points_json","view_agent_loader_debug","view_stout","view_sterror","dxdiag","printers","clean_temp","scan","ricoh_list_scan","toshiba_list_scan"]),Ar={get_agent_ip:"Địa chỉ IP Local của Agent",get_public_ip:"Địa chỉ IP Public (Internet)",view_settings_json:"Nội dung tệp settings.json",view_printers_json:"Nội dung tệp printers.json",view_scan_points_json:"Nội dung tệp scan_points.json",view_agent_loader_debug:"Nội dung tệp agent_loader_debug.txt",view_stout:"Nội dung tệp stout.txt (1000 dòng cuối)",view_sterror:"Nội dung tệp sterror.txt (1000 dòng cuối)",dxdiag:"Kết quả kiểm tra cấu hình hệ thống (DxDiag)",printers:"Danh sách máy in hệ thống",clean_temp:"Kết quả dọn dẹp thư mục tạm & Driver",scan:"Nội dung thư mục Scan gốc (%TEMP%/GoPrinxAgent/ftp)",ricoh_list_scan:"Danh bạ Scan trên máy photo Ricoh",toshiba_list_scan:"Danh bạ Scan trên máy photo Toshiba"},$n=(n={})=>{const{showToast:i,setViewOutputModal:_,setIpInputModal:g}=n,[G,H]=j.useState([]),[le,ce]=j.useState(!1),[he,ie]=j.useState(!1),[p,P]=j.useState(null),[re,S]=j.useState(null),[xe,F]=j.useState(null),[u,D]=j.useState(""),[y,R]=j.useState(!1),[ge,J]=j.useState(""),[_e,Ce]=j.useState("ping 8.8.8.8"),Pe=j.useCallback((U,M,Q,l,s)=>{var b;(b=n.setCommandStatus)==null||b.call(n,v=>({...v,[M]:{message:s||"Đang thực thi lệnh...",isPending:!0}}));const h=1500,T=6e4,k=Date.now(),L=setInterval(async()=>{var C,W,z,$,ae;const v=Date.now()-k;if(v>T){clearInterval(L),(C=n.setCommandStatus)==null||C.call(n,B=>({...B,[M]:{message:"Lỗi: Quá thời gian chờ (Timeout 60s)",isPending:!1}})),l&&l("Quá thời gian chờ (Timeout 60s)");return}try{const B=await Tt(U);if(B.ok&&B.status==="success"){clearInterval(L);const E=B.result?` (${B.result})`:"";(W=n.setCommandStatus)==null||W.call(n,a=>({...a,[M]:{message:`Đã hoàn tất thành công!${E}`,isPending:!1}})),Q(B)}else if(B.ok&&B.status==="failed"){clearInterval(L);const E=B.error||B.error_message||B.result||"Thực thi thất bại";(z=n.setCommandStatus)==null||z.call(n,a=>({...a,[M]:{message:`Lỗi: ${E}`,isPending:!1}})),l&&l(E)}else{const E=B.received_at?`Agent đã nhận lệnh (${Math.round(v/1e3)}s)...`:`Đang gửi lệnh tới Agent (${Math.round(v/1e3)}s)...`;($=n.setCommandStatus)==null||$.call(n,a=>({...a,[M]:{message:E,isPending:!0}}))}}catch(B){clearInterval(L),(ae=n.setCommandStatus)==null||ae.call(n,E=>({...E,[M]:{message:`Lỗi kết nối: ${B.message||"Lỗi polling"}`,isPending:!1}})),l&&l(B.message||"Lệnh thực hiện thất bại từ Agent")}},h)},[n]),q=async(U,M,Q)=>{try{const l=await Mn(U,10),h=(l.jobs||l.commands||[]).filter(T=>T.status==="pending"&&T.command_type===M);return Q?h.some(T=>{const k=T.command_params||{};return Object.keys(Q).every(L=>String(k[L])===String(Q[L]))}):h.length>0}catch{return!1}},ne=j.useCallback(async U=>{ie(!0),J("");try{const M=await at(U,"view_settings_json","");if(!M.ok||!M.command_id)throw new Error(M.error||"Không thể gửi lệnh xem settings.json");Pe(M.command_id,"view_settings",Q=>{const l=typeof Q.result_payload=="object"&&Q.result_payload?JSON.stringify(Q.result_payload,null,2):Q.result_payload||Q.result||"";D(l),ie(!1)},Q=>{J(`❌ Không thể nạp settings.json: ${Q}`),ie(!1)},"⌛ Đang nạp settings.json từ Agent...")}catch(M){J(`❌ Lỗi nạp cấu hình: ${M.message}`),ie(!1)}},[Pe]),Y=async U=>{if(!U||!u)return;try{JSON.parse(u)}catch(Q){J(`❌ Lỗi định dạng JSON: ${Q.message}`);return}R(!0),J("⌛ Đang gửi cấu hình mới tới Agent...");const M=btoa(unescape(encodeURIComponent(u)));try{const Q=(G||[]).find(T=>T.command==="save_settings_json"),l=(Q==null?void 0:Q.command_content)||"",s=await at(U,"save_settings_json",l,{base64_content:M});if(!s.ok||!s.command_id)throw new Error(s.error||"Không thể tạo lệnh tiện ích");const h=s.command_id;Pe(h,"save_settings",()=>{J("✅ Đã lưu và nạp lại cấu hình settings.json thành công!"),R(!1),i&&i("Đã lưu cấu hình Agent thành công","success")},T=>{J(`❌ Lỗi lưu cấu hình: ${T}`),R(!1)},"⌛ Agent đang ghi đè tệp settings.json...")}catch(Q){J(`❌ Lỗi gửi lệnh: ${Q.message}`),R(!1)}},me=j.useCallback(async(U,M,Q,l={})=>{let s=xe,h="",T="",k={};if(typeof U=="string"?(h=U,T=M||h,k=Q||{}):(s=U||xe,h=M||"",T=Q||h,k=l||{}),!!s){S(h),P({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const L=await On(s.agent_uid,T,k);if(!L.ok||!L.command_id)throw new Error(L.error||"Không thể tạo lệnh tiện ích");const b=L.command_id,v=6e4,C=1e3,W=Date.now(),z=setInterval(async()=>{try{const $=Date.now()-W;if($>v){clearInterval(z),P({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),S(null);return}const ae=await Tt(b);if(ae.status==="success")clearInterval(z),P({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),S(null);else if(ae.status==="failed"||!ae.ok)clearInterval(z),P({text:`❌ Thất bại: ${ae.error||"Lệnh thất bại từ Agent"}`,isError:!0}),S(null);else{const B=Math.round($/1e3);ae.received_at?P({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${B}s)`,isError:!1}):P({text:`⌛ Đang chuyển lệnh tới Agent... (${B}s)`,isError:!1})}}catch($){console.error("Error polling utility status:",$)}},C)}catch(L){console.error(`Failed to trigger ${h}:`,L),P({text:`Lỗi kết nối hoặc gửi lệnh: ${L.message}`,isError:!0}),S(null)}}},[xe]),f=j.useCallback(async(U,M,Q)=>{let l=xe,s="",h="";if(typeof U=="string"?(s=U,h=M||""):(l=U||xe,s=M||"",h=Q||""),!l)return;if(await q(l.agent_uid,"trigger_utility",{action:"exec_utility",command:s})){i&&i("Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!","info");return}const k=G.find(v=>v.command===s),L=(k==null?void 0:k.output_modal)||kr.has(s),b=(k==null?void 0:k.label)||Ar[s]||s;if(s==="change_agent_ip"||s==="check_scan_ip_match"){const v=s==="change_agent_ip",C=(l==null?void 0:l.local_ip)||(l==null?void 0:l.ip)||(l==null?void 0:l.agent_ip)||(l==null?void 0:l.localIp)||"";g&&g({isOpen:!0,title:v?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:v?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:C,changeAllTo:"",scanStatus:v?"⏳ Loading... Đang quét điểm scan FTP trên máy photo...":"",error:"",onConfirm:(W,z)=>{const $=h.replace("__TARGET_IP__",W);S(s),P({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),at(l.agent_uid,s,$,{target_ip:W,ip:W,printer_ip:W,change_all_to:z||""}).then(ae=>{if(!ae.ok||!ae.command_id)throw new Error(ae.error||"Không thể tạo lệnh tiện ích");const B=ae.command_id,E=6e4,a=Date.now(),m=setInterval(async()=>{try{const w=Date.now()-a;if(w>E){clearInterval(m),P({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),S(null);return}const I=await Tt(B);if(I.status==="success")clearInterval(m),L&&_?_({isOpen:!0,title:b,content:typeof I.result_payload=="object"&&I.result_payload?JSON.stringify(I.result_payload,null,2):I.result_payload||I.error||I.result||"(không có nội dung)",rawPayload:I.result_payload||I.result||""}):P({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),S(null);else if(I.status==="failed"||!I.ok)clearInterval(m),P({text:`❌ Thất bại: ${I.error||"Lệnh thất bại từ Agent"}`,isError:!0}),S(null);else{const K=Math.round(w/1e3);P({text:`⌛ Agent đang thực hiện lệnh... (${K}s)`,isError:!1})}}catch(w){console.error("Error polling status:",w)}},1e3)}).catch(ae=>{P({text:`Lỗi gửi lệnh: ${ae.message}`,isError:!0}),S(null)})}});return}S(s),P({text:"⌛ Đang gửi lệnh thực thi tới Agent...",isError:!1});try{const v=await at(l.agent_uid,s,h);if(!v.ok||!v.command_id)throw new Error(v.error||"Không thể tạo lệnh tiện ích");const C=v.command_id,W=6e4,z=1e3,$=Date.now(),ae=setInterval(async()=>{try{const B=Date.now()-$;if(B>W){clearInterval(ae),P({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),S(null);return}const E=await Tt(C);if(E.status==="success")clearInterval(ae),L&&_?_({isOpen:!0,title:b,content:typeof E.result_payload=="object"&&E.result_payload?JSON.stringify(E.result_payload,null,2):E.result_payload||E.error||E.result||"(không có nội dung)",rawPayload:E.result_payload||E.result||""}):P({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),S(null);else if(E.status==="failed"||!E.ok)clearInterval(ae),L&&_?_({isOpen:!0,title:b,content:E.error||typeof E.result_payload=="object"&&E.result_payload?JSON.stringify(E.result_payload,null,2):E.result_payload||E.result||"(không có nội dung)",rawPayload:E.result_payload||E.result||""}):P({text:`❌ Thất bại: ${E.error||"Lệnh thất bại từ Agent"}`,isError:!0}),S(null);else{const a=Math.round(B/1e3),m=E.progress_text||`Đang xử lý... (${a}s)`;P({text:`⌛ ${m}`,isError:!1})}}catch(B){const E=(B==null?void 0:B.message)||String(B||"");L&&_&&(E.startsWith("[PATH]")||E.includes("stout")||E.includes("sterror")||E.includes("settings.json"))?(clearInterval(ae),_({isOpen:!0,title:b,content:E,rawPayload:E}),P(null),S(null)):console.error("Poll error:",B)}},z)}catch(v){P({text:`Lỗi: ${v.message}`,isError:!0}),S(null)}},[xe,G,i,g,_]);return{VIEW_COMMANDS:kr,VIEW_COMMAND_TITLES:Ar,utilityCommands:G,setUtilityCommands:H,utilityCommandsLoading:le,setUtilityCommandsLoading:ce,utilitySettingsLoading:he,setUtilitySettingsLoading:ie,utilityStatusMsg:p,setUtilityStatusMsg:P,utilityActionPending:re,setUtilityActionPending:S,selectedUtilityAgent:xe,setSelectedUtilityAgent:F,editableSettingsText:u,setEditableSettingsText:D,isSavingSettings:y,setIsSavingSettings:R,settingsSaveStatus:ge,setSettingsSaveStatus:J,customRunCommand:_e,setCustomRunCommand:Ce,pollCommandStatus:Pe,loadUtilitySettings:ne,handleSaveSettings:Y,handleTriggerUtility:me,handleTriggerUtilityExec:f}},Vn=(n={})=>{const{showToast:i,pollCommandStatus:_}=n,[g,G]=j.useState({isOpen:!1,copier:null,url:"",tunnelUrl:"",directUrl:"",auth:{user:"",pass:""}}),[H,le]=j.useState("tunnel"),[ce,he]=j.useState(!1),[ie,p]=j.useState([]),[P,re]=j.useState(-1),[S,xe]=j.useState(!1),[F,u]=j.useState(null),D=j.useRef(null),[y,R]=j.useState({isOpen:!1,printerId:"",copier:null,targetAgentUid:"",status:"",error:""}),ge=j.useCallback(()=>{F&&(URL.revokeObjectURL(F),u(null)),G(ne=>({...ne,isOpen:!1}))},[F]),J=j.useCallback(async(ne,Y,me="/")=>{if(!ne){i&&i("Không tìm thấy Agent UID","error");return}const f=(M,Q)=>`
      <html>
        <head>
          <title>${M}</title>
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
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${M}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${Q}</div>
        </body>
      </html>
    `,U=window.open("about:blank","_blank");U&&U.document.write(f("Đang kết nối tên miền...",`Đang kết nối đến máy in ${Y} qua tên miền *.app.goxprint.com...`)),he(!0);try{const l=await(await fetch(`https://agentapi.quanlymay.com/api/agents/${ne}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:Y,printer_port:80})})).json();l.ok&&l.url?U&&(U.location.href=l.url):(U&&U.close(),i&&i("Kết nối lỗi: "+(l.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch(M){U&&U.close(),i&&i("Lỗi hệ thống VPS: "+(M.message||M),"error")}finally{he(!1)}},[i]),_e=j.useCallback(()=>{if(P>0){const ne=ie[P-1];re(P-1),g.copier&&J(g.copier.agent_uid,g.copier.ip,ne)}},[P,ie,g,J]),Ce=j.useCallback(()=>{if(P<ie.length-1){const ne=ie[P+1];re(P+1),g.copier&&J(g.copier.agent_uid,g.copier.ip,ne)}},[P,ie,g,J]);return{webPreviewModal:g,setWebPreviewModal:G,webPreviewTab:H,setWebPreviewTab:le,webPreviewLoading:ce,setWebPreviewLoading:he,webPreviewHistory:ie,setWebPreviewHistory:p,webPreviewHistoryIndex:P,setWebPreviewHistoryIndex:re,showPreviewDetails:S,setShowPreviewDetails:xe,previewBlobUrl:F,setPreviewBlobUrl:u,previewIframeRef:D,handleCloseWebPreview:ge,fetchRemotePage:J,handleHistoryBack:_e,handleHistoryForward:Ce,installDriverModal:y,setInstallDriverModal:R,handleRemoteInstallDriver:(ne,Y,me)=>{R({isOpen:!0,printerId:String(ne),copier:Y,targetAgentUid:me,status:"",error:""})},executeRemoteInstallDriver:async()=>{if(!y.copier||!y.targetAgentUid)return;const{printerId:ne,copier:Y,targetAgentUid:me}=y;R(f=>({...f,status:"⌛ Đang gửi lệnh cài đặt Driver tới Agent...",error:""})),i&&i("Đang tạo lệnh tải và cài đặt Driver máy in tự động...","info",3e3);try{const f=await Lr(me,Y.ip,Y.printer_name||Y.name||"Printer",Y.printer_type||Y.brand||"");if(!f.ok||!f.command_id)throw new Error(f.error||"Không thể tạo lệnh cài driver");R(U=>({...U,status:"⌛ Agent đang tải gói Driver và tiến hành Silent Install..."})),_&&_(f.command_id,`install_driver_${ne}`,U=>{i&&i("✓ Đã cài đặt Driver máy in thành công lên máy Agent!","success",5e3),R(M=>({...M,isOpen:!1,status:"",error:""}))},U=>{i&&i(`[-] Lỗi cài đặt Driver: ${U}`,"error"),R(M=>({...M,status:"",error:U}))},"⏳ Agent đang cài đặt Driver vào hệ thống Windows...")}catch(f){R(U=>({...U,status:"",error:f.message||"Lỗi không xác định"})),i&&i(`Lỗi cài đặt Driver: ${f.message}`,"error")}}}},Kn=(n={})=>{const{showToast:i,pollCommandStatus:_,setViewOutputModal:g}=n,[G,H]=j.useState({isOpen:!1,agentUid:"",agentName:"",currentPath:"",items:[],loading:!1,error:""}),[le,ce]=j.useState([]),[he,ie]=j.useState(!1),[p,P]=j.useState({isOpen:!1,printer:null,data:null,rawJson:""}),re=(F,u)=>{if(!u||u===".")return F;if(u===".."){const D=F.split("/").filter(Boolean);return D.pop(),D.join("/")||""}return F?`${F}/${u}`:u},S=j.useCallback(async(F,u,D="")=>{H({isOpen:!0,agentUid:F,agentName:u,currentPath:D,items:[],loading:!0,error:""});try{const y=await Er(F,D);if(y.ok)H(R=>({...R,items:y.items||y.files||[],loading:!1}));else throw new Error(y.error||"Không thể tải danh sách tệp")}catch(y){H(R=>({...R,loading:!1,error:y.message||"Lỗi kết nối tới Agent"})),i&&i(`Không thể mở thư mục lưu trữ: ${y.message}`,"error")}},[i]),xe=j.useCallback(async(F,u)=>{if(F){i&&i("⌛ Đang tải file scan_points.json từ Agent...","info",3e3);try{const D=await at(F,"view_scan_points_json","");if(!D.ok||!D.command_id)throw new Error(D.error||"Không thể tạo lệnh xem file scan_points.json");_&&_(D.command_id,`view_scan_points_${(u==null?void 0:u.id)||"json"}`,y=>{const R=y.result_payload||y.result||"";let ge=null;if(typeof R=="object"&&R!==null)ge=R;else if(typeof R=="string")try{ge=JSON.parse(R)}catch{ge=null}const J=ge?JSON.stringify(ge,null,2):String(R);P({isOpen:!0,printer:u,data:ge,rawJson:J}),g&&g({isOpen:!0,title:`📋 Danh bạ Scan (${(u==null?void 0:u.printer_name)||(u==null?void 0:u.name)||"Copier"})`,content:J,rawPayload:R})},y=>{i&&i(`Lỗi xem scan_points.json: ${y}`,"error")},"⏳ Agent đang đọc file scan_points.json...")}catch(D){i&&i(`Lỗi đọc file scan_points.json: ${D.message}`,"error")}}},[i,_,g]);return{storageModalData:G,setStorageModalData:H,storageFiles:le,setStorageFiles:ce,storageLoading:he,setStorageLoading:ie,handleOpenStorageFiles:S,resolveRelativePath:re,scanPointsViewerModal:p,setScanPointsViewerModal:P,handleViewScanPointsJson:xe}},Jn=(n={})=>{const[i,_]=j.useState([]),g=j.useCallback((Q,l="info",s=3e3)=>{const h=Date.now().toString()+Math.random().toString().slice(2,6);_(T=>[...T,{id:h,message:Q,type:l}]),setTimeout(()=>{_(T=>T.filter(k=>k.id!==h))},s)},[]),[G,H]=j.useState("copiers"),[le,ce]=j.useState({}),[he,ie]=j.useState(null),[p,P]=j.useState({isOpen:!1,title:"",message:""}),[re,S]=j.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[xe,F]=j.useState({isOpen:!1,title:"",content:"",rawPayload:null}),[u,D]=j.useState({isOpen:!1,title:"",hint:"",value:"",changeAllTo:"",scanStatus:"",error:""}),[y,R]=j.useState({printerId:"",name:"",email:"",agentUid:""}),[ge,J]=j.useState(!1),[_e,Ce]=j.useState({lanUid:"",agentUid:"",email:""}),[Pe,q]=j.useState(!1),[ne,Y]=j.useState(null),me=$n({showToast:g,setViewOutputModal:F,setIpInputModal:D,setCommandStatus:ce}),f=Wn({showToast:g,pollCommandStatus:me.pollCommandStatus,utilityCommands:me.utilityCommands}),U=Vn({showToast:g,pollCommandStatus:me.pollCommandStatus}),M=Kn({showToast:g,pollCommandStatus:me.pollCommandStatus,setViewOutputModal:F});return{toasts:i,showToast:g,activeTab:G,setActiveTab:H,commandStatus:le,setCommandStatus:ce,activeModal:he,setActiveModal:ie,confirmModal:p,setConfirmModal:P,deleteScanPointModal:re,setDeleteScanPointModal:S,viewOutputModal:xe,setViewOutputModal:F,ipInputModal:u,setIpInputModal:D,publicFtpData:y,setPublicFtpData:R,publicFtpLoading:ge,setPublicFtpLoading:J,privateFtpData:_e,setPrivateFtpData:Ce,privateFtpLoading:Pe,setPrivateFtpLoading:q,getDestinationStatus:()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:()=>({label:"✔ ACTIVE",type:"success",title:""}),...f,...me,...U,...M}},wt="https://agentapi.quanlymay.com",qn=(n={})=>{const{cameraForm:i,cameras:_,customRecordDuration:g,directLan:G,fetchCameraFiles:H,fetchCameraStatus:le,fetchCameras:ce,isRecording30s:he,setActiveModal:ie,setAllocatedVncAddr:p,setCameraTestLoading:P,setCameraTestResult:re,setIsRecording30s:S,setRecording30sCountdown:xe,setSelectedCamera:F,setToshibaVncData:u,setVncTunnelLoading:D,showToast:y}=n;return{cameraForm:i,cameras:_,customRecordDuration:g,directLan:G,fetchCameraFiles:H,fetchCameraStatus:le,fetchCameras:ce,handleDeleteCamera:async(q,ne)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{const me=await(await fetch(`${wt}/api/agents/${q}/cameras/${ne}/delete`,{method:"POST"})).json();me.ok?(y("Đã xóa camera thành công!","success"),ce(q),F(null)):y("Lỗi xóa camera: "+me.error,"error")}catch(Y){y("Lỗi hệ thống: "+Y.message,"error")}},handleDeleteCameraFile:async(q,ne,Y)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${Y}`))try{const f=await(await fetch(`${wt}/api/agents/${q}/cameras/${ne}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:Y})})).json();f.ok?(y("Đã xóa tệp video thành công!","success"),H(q,ne)):y("Lỗi xóa tệp: "+f.error,"error")}catch(me){y("Lỗi hệ thống: "+me.message,"error")}},handleRecord30s:async(q,ne)=>{if(he)return;const Y=_.find(M=>M.id===ne),me=(Y==null?void 0:Y.mac_address)||"";if(!me){y("Camera không có thông tin MAC ID để điều khiển!","error");return}S(!0),xe(g);let f=g;const U=setInterval(()=>{f-=1,xe(Math.max(f,0)),f<=0&&clearInterval(U)},1e3);try{y(`Đang gửi yêu cầu ghi hình ${g}s...`,"info");const Q=await(await fetch(`${wt}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:me,action:"record",duration:g})})).json();clearInterval(U),Q.ok?y(Q.message||`Ghi hình ${g}s hoàn tất!`,"success"):y("Lỗi ghi hình: "+Q.error,"error")}catch(M){clearInterval(U),y("Lỗi kết nối ghi hình: "+M.message,"error")}finally{S(!1),setTimeout(()=>{le(q,ne),H(q,ne)},1500)}},handleSaveCameraConfig:async q=>{try{const Y=await(await fetch(`${wt}/api/agents/${q}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();Y.ok?(y("Đã lưu cấu hình camera thành công!","success"),ce(q),F(null)):y("Lỗi lưu cấu hình: "+Y.error,"error")}catch(ne){y("Lỗi hệ thống: "+ne.message,"error")}},handleStartToshibaVnc:async(q,ne,Y)=>{if(u({ip:q,printerName:ne,agentUid:Y}),p(""),ie("toshiba_vnc"),G){p(`${q}:49105`);return}D(!0);try{const f=await(await fetch(`${wt}/api/agents/${Y}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:q,printer_port:49105})})).json();if(f.ok&&f.url_port){const U=f.url_port.replace("http://","").replace("https://","");p(U)}else y("Không thể mở đường hầm VNC: "+(f.error||"Lỗi không xác định"),"error"),ie(null)}catch(me){y("Lỗi kết nối VPS: "+(me.message||me),"error"),ie(null)}finally{D(!1)}},handleTestCameraConnection:async q=>{P(!0),re(null);try{const Y=await(await fetch(`${wt}/api/agents/${q}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:i.rtsp_url})})).json();Y.ok&&Y.result?re(Y.result):re({ok:!1,msg:Y.error||"Lỗi kiểm tra kết nối"})}catch(ne){re({ok:!1,msg:"Lỗi: "+ne.message})}finally{P(!1)}},isRecording30s:he,setActiveModal:ie,setAllocatedVncAddr:p,setCameraTestLoading:P,setCameraTestResult:re,setIsRecording30s:S,setRecording30sCountdown:xe,setSelectedCamera:F,setToshibaVncData:u,setVncTunnelLoading:D,showToast:y}},Xn={ricoh_create_scan:`import requests
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
`},Qn="https://agentapi.quanlymay.com";function Pr(n,i,_){const g=n.email_address||n.email||"",G=n.physical_path||n.folder||n.folder_path||"",H=(g||G||"").trim();if(!H)return{label:"UNKNOWN",type:"error",title:""};if(n.type==="Email"||g.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const ce=(i||[]).find(p=>(p.email||"").toLowerCase().trim()===H.toLowerCase().trim()),he=ce?ce.email_number:Number(n.registration_no);if(!he||isNaN(he))return{label:"✔ ACTIVE",type:"success",title:""};const ie=(_||[]).find(p=>p.is_master&&p.is_agent_active)||(_||[]).find(p=>p.is_agent_active)||(_||[])[0];if(ie){const p=(ie.ftp_sites||[]).find(P=>Number(P.port)===Number(he));if(p){const P=("C:/Scangox/"+H).toLowerCase().replace(/\\/g,"/"),S=(p.path||"").toLowerCase().replace(/\\/g,"/")===P;return p.running&&S?{label:"✔ OK",type:"success",title:""}:p.running&&!S?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${p.path} instead of expected: C:/Scangox/${H}`}:p.error&&(p.error.toLowerCase().includes("in use")||p.error.toLowerCase().includes("busy")||p.error.toLowerCase().includes("already bound")||p.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:p.error}:{label:"❌ FAILED",type:"error",title:p.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}const Yn=(n={})=>{const{activeAgentUid:i,cameras:_,copierCredentials:g={},deleteScanPointModal:G,editIpModalData:H,fetchLanSitesData:le,getTargetAgentUid:ce,isDuplicatePending:he,lanSites:ie=[],pollCommandStatus:p,queryDuration:P,queryTimestamp:re,replaceToast:S,saveScanPointToDb:xe,selectedCamera:F,selectedLan:u,setActiveModal:D,setDeleteScanPointModal:y,setEditIpModalData:R,setInstallDriverModal:ge,setLiveAddressBooks:J,setQueriedVideoUrl:_e,setQueryDuration:Ce,setQueryTimestamp:Pe,setQueryVideoLoading:q,setStorageFiles:ne,setStorageLoading:Y,setStorageModalData:me,showToast:f,utilityCommands:U=[],detectBrand:M}=n,Q=async a=>{const m=String((a==null?void 0:a.mac_address)||(a==null?void 0:a.mac_id)||(a==null?void 0:a.mac)||"").trim(),w=String((a==null?void 0:a.ip)||(a==null?void 0:a.printer_ip)||(typeof a=="string"?a:"")||(a==null?void 0:a.id)||"").trim(),I=m.toUpperCase().replace(/[^0-9A-F:]/g,""),K=I.replace(/[:-]/g,"");let Z="",V="";try{const ee=await Ee(`/api/devices/credentials-map?t=${Date.now()}`);if(ee&&ee.ok&&ee.credentials){const o=ee.credentials,x=I&&o[I]||K&&o[K]||I&&o[I.replace(/:/g,"-")]||w&&o[w];x&&(Z=String(x.user||x.auth_user||"").trim(),V=String(x.password||x.auth_password||x.pass||"").trim())}}catch(ee){throw new Error(`❌ Lỗi kết nối VPS khi tải tài khoản máy in: ${ee.message||"Lỗi mạng"}`)}if(!Z){const ee=I||w||"chưa xác định";throw new Error(`⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS cho thiết bị (MAC/IP: ${ee}). Vui lòng nhập User/Pass và bấm "Lưu Auth" trước!`)}return{user:Z,pass:V,mac:I||w}},l=async(a,m,w,I)=>{var o;const K=w||re,Z=I||P;if(!K)return;const V=((o=_.find(x=>x.id===m))==null?void 0:o.name)||"";if(await he(a,"trigger_utility",{action:"query_camera_video",camera_name:V,timestamp:K,duration:Z})){f("Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!","info");return}q(!0),_e("");try{const O=await(await fetch(`${Qn}/api/agents/${a}/cameras/${m}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:K,duration:Z})})).json();if(O.ok){const oe=K.replace(/[- :]/g,""),c=oe.substring(0,8)+"_"+oe.substring(8,14);_e(`clip_${F.camera_name}_${c}.mp4`)}else f("Không truy xuất được video: "+O.error,"error")}catch(x){f("Lỗi kết nối render: "+x.message,"error")}finally{q(!1)}},s=a=>{const m=a.match(/_(\d{8}_\d{6})\.mp4$/);if(m){const w=m[1],I=`${w.substring(0,4)}-${w.substring(4,6)}-${w.substring(6,8)} ${w.substring(9,11)}:${w.substring(11,13)}:${w.substring(13,15)}`;Pe(I),Ce(60),l(i,F.id,I,60),setTimeout(()=>{var K;(K=document.getElementById("video-playback-card"))==null||K.scrollIntoView({behavior:"smooth",block:"center"})},100)}else f("Không parse được thời gian từ tên tệp","error")},h=(a,m)=>{var Z,V,ee,o,x;const I=(ie||[]).flatMap(O=>O.printers||[]).find(O=>String(O.id)===String(a)||O.mac_id===a||O.ip===a)||((Z=u==null?void 0:u.printers)==null?void 0:Z[0]),K=(I==null?void 0:I.agent_uid)||ce(a)||((ee=(V=u==null?void 0:u.agents)==null?void 0:V.find(O=>O.is_agent_active))==null?void 0:ee.agent_uid)||((x=(o=u==null?void 0:u.agents)==null?void 0:o[0])==null?void 0:x.agent_uid)||"kythuat02";y({isOpen:!0,printerId:a,entry:m,agentUid:K})},T=async()=>{var x,O,oe,c,ve;const{printerId:a,entry:m,agentUid:w}=G;if(!m)return;y(be=>({...be,isOpen:!1}));const I=m.email_address||m.email||"",K=m.physical_path||m.folder||m.folder_path||"",Z=(I||K||"").trim(),V=String(m.registration_no&&m.registration_no!=="-"?m.registration_no:m.entry_id||"").trim(),o=((u==null?void 0:u.emails)||[]).find(be=>be.email.toLowerCase().trim()===Z.toLowerCase().trim());if(o&&o.id){f("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const be=await Dn(o.id);if(be.ok)f("Đã xóa thành công!","success"),await le();else throw new Error(be.error||"Không thể xóa")}catch(be){f(`Lỗi xóa: ${be.message}`,"error")}return}f("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const de=(ie||[]).flatMap(A=>A.printers||[]).find(A=>String(A.id)===String(a)||A.mac_id===a||A.ip===a)||((x=u==null?void 0:u.printers)==null?void 0:x[0]),Le=((de==null?void 0:de.printer_type)||(de==null?void 0:de.printer_name)||"").toLowerCase().includes("toshiba")?"toshiba_delete_scan":"ricoh_delete_scan",Oe=(U||[]).find(A=>A.command===Le),$e=w||(de==null?void 0:de.agent_uid)||((oe=(O=u==null?void 0:u.agents)==null?void 0:O.find(A=>A.is_agent_active))==null?void 0:oe.agent_uid)||((ve=(c=u==null?void 0:u.agents)==null?void 0:c[0])==null?void 0:ve.agent_uid)||"kythuat02";let Fe;if($e){let A=Oe;if(!A)try{A=(await Fn($e)||[]).find(ye=>ye.command===Le)}catch{}const pe=(de==null?void 0:de.ip)||(de==null?void 0:de.printer_ip)||(a.includes(".")?a:""),{user:Ie,pass:ke}=await Q(de),je=String((m==null?void 0:m.entry_id)||(m==null?void 0:m.id)||V||"").trim()||"null";let te=(A==null?void 0:A.command_content)||Xn[Le]||"";if(!te){f(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${Le}' trên hệ thống VPS!`,"error");return}te=te.replace(/__TARGET_IP__/g,pe||"null"),te=te.replace(/__TARGET_USER__/g,Ie||"admin"),te=te.replace(/__TARGET_PASS__/g,ke||""),te=te.replace(/__TARGET_ID__/g,je),te=te.replace(/__TARGET_SCAN_USER__/g,(m==null?void 0:m.name)||"null"),Fe=await at($e,Le,te,{printer_ip:pe,ip:pe,auth_user:Ie,auth_password:ke,target_id:je,entry_id:je,registration_no:V})}if(!Fe.ok||!Fe.command_id)throw new Error(Fe.error||"Không thể tạo lệnh xóa");p(Fe.command_id,a,async A=>{f(`Đã xóa đăng ký #${V} thành công!`,"success"),console.log("Finish delete scan point, updating address book state directly",A);const pe=(de==null?void 0:de.mac_address)||(de==null?void 0:de.mac_id)||a,Ie=pe?String(pe).toUpperCase().replace(/-/g,":"):"";let ke=(A==null?void 0:A.address_book_sync)||(A==null?void 0:A.address_book_data);if(!ke&&(A!=null&&A.result||A!=null&&A.result_payload)){const je=String(A.result||A.result_payload||"");if(je.includes("__ADDRESS_BOOK_JSON_START__"))try{let te=je.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();te=te.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),ke=JSON.parse(te)}catch{}}Ie&&ke&&J(je=>({...je,[Ie]:ke})),z(de||a),await le(!0)},A=>{f(`Lỗi xóa điểm scan: ${A}`,"error")},`⌛ Đang xóa điểm scan #${V}...`)}catch(be){f(`Lỗi gửi lệnh xóa: ${be.message}`,"error")}},k=(a,m)=>{const w=m.folder||m.physical_path||m.folder_path||"";let I="",K="2130";const Z=w.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),V=w.match(/^\\\\([^\\]+)(.*)$/);if(Z)I=Z[1],K=Z[2]||"2130";else if(V)I=V[1],K="";else{const o=w.match(/^([^:/]+)(?::(\d+))?(.*)$/);o&&!w.startsWith("\\\\")&&(I=o[1],K=o[2]||"2130")}const ee=I?K?`${I}:${K}`:I:"192.168.1.100:2130";R({printerId:a,entry:m,currentIp:I,newIp:ee,newPort:K||"2130"}),D("edit_ip")},L=async()=>{var oe;if(!H)return;const{printerId:a,entry:m,newIp:w,newPort:I}=H,K=m.folder||m.physical_path||m.folder_path||"",Z=K.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),V=K.match(/^\\\\([^\\]+)(.*)$/);let ee=w.trim();if((I||"2130").trim(),ee.includes(":")){const c=ee.split(":");ee=c[0].trim(),c[1].trim()}if(Z)Z[3];else if(V)V[2];else{const c=K.match(/^([^:/]+)(?::(\d+))?(.*)$/);c&&!K.startsWith("\\\\")&&c[3]}const o=ce(a),x=m.registration_no;D(null),f("Gửi yêu cầu thay đổi IP của điểm scan...","info",3e3);let O="";if(Z)O=Z[1];else if(V)O=V[1];else{const c=K.match(/^([^:/]+)/);c&&!K.startsWith("\\\\")&&(O=c[1])}O||(O=ee);try{const c=(oe=u==null?void 0:u.printers)==null?void 0:oe.find(A=>A.id===Number(a)),ve=(c==null?void 0:c.mac_address)||(c==null?void 0:c.mac_id)||"",be=ve?String(ve).toUpperCase().replace(/-/g,":"):"",de=g[be]||g[a]||{},Me=de.user||(c==null?void 0:c.auth_user)||(c==null?void 0:c.username),Le=de.pass||(c==null?void 0:c.auth_password)||(c==null?void 0:c.password)||"";if(!Me)throw new Error(`Chưa cấu hình tài khoản Web cho máy in ${(c==null?void 0:c.printer_name)||(c==null?void 0:c.name)||"Photocopy"}!`);const $e=(M?M((c==null?void 0:c.printer_name)||(c==null?void 0:c.name)||""):"ricoh")==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",Fe=await at(o,$e,"",{printer_ip:(c==null?void 0:c.ip)||"",auth_user:Me,auth_password:Le,target_id:x,target_name:m.name,old_ip:O,new_ip:ee});if(!Fe.ok||!Fe.command_id)throw new Error(Fe.error||"Không thể gửi lệnh thay đổi FTP");p(Fe.command_id,a,async A=>{f(`Đã thay đổi IP điểm scan #${x} thành công!`,"success");const pe=(c==null?void 0:c.mac_address)||(c==null?void 0:c.mac_id)||a,Ie=pe?String(pe).toUpperCase().replace(/-/g,":"):"";let ke=(A==null?void 0:A.address_book_sync)||(A==null?void 0:A.address_book_data);if(!ke&&(A!=null&&A.result||A!=null&&A.result_payload)){const je=String(A.result||A.result_payload||"");if(je.includes("__ADDRESS_BOOK_JSON_START__"))try{let te=je.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();te=te.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),ke=JSON.parse(te)}catch{}}Ie&&ke&&J(je=>({...je,[Ie]:ke})),z&&z(a),await le(!0)},A=>{f(`Lỗi thay đổi IP: ${A}`,"error")},`⌛ Đang cập nhật IP điểm scan #${x}...`)}catch(c){f(`Lỗi gửi lệnh thay đổi IP: ${c.message}`,"error")}},b=async(a,m)=>{me({lanUid:a,email:m}),Y(!0),ne([]),D("storage");try{const w=await Er(a,m);if(w.ok)ne(w.rows||[]);else throw new Error(w.error||"Lỗi server")}catch(w){f(`Không thể lấy tệp đã scan: ${w.message}`,"error")}finally{Y(!1)}},v=(a,m,w,I,K)=>{var V,ee;const Z=ce(a)||((ee=(V=u==null?void 0:u.agents)==null?void 0:V.find(o=>o.is_agent_active))==null?void 0:ee.agent_uid)||"";ge({isOpen:!0,printerId:a,brand:m,model:w,driverName:I,driverUrl:K,selectedAgentUids:Z?[Z]:[]})},C=async(a,m,w,I,K,Z)=>{const V=`driver-install-progress-${Z}`;S(V,`⏳ [${Z}] Đang gửi lệnh cài đặt driver...`,"info");try{const ee=await Lr(a,m,w,I,K,Z);if(!ee.ok)throw new Error(ee.error||"Server trả về lỗi");const o=ee.command_id;if(!o){S(V,`✅ [${Z}] Đã gửi lệnh cài đặt driver.`,"success");return}const x=3e5,O=2e3,oe=Date.now();let c="";const ve=setInterval(async()=>{try{const be=Date.now()-oe;if(be>x){clearInterval(ve),S(V,`⏰ [${Z}] Quá thời gian chờ (5 phút).`,"info");return}const de=await Tt(o);if(de.status==="success")clearInterval(ve),S(V,`✅ [${Z}] Cài đặt driver thành công!`,"success");else if(de.status==="failed"||!de.ok)clearInterval(ve),S(V,`❌ [${Z}] Cài driver thất bại: ${de.error||"Lỗi không xác định"}`,"error");else{const Me=de.progress_text||"";if(Me&&Me!==c)c=Me,S(V,`⏳ [${Z}] ${Me}`,"info");else if(!Me){const Le=Math.round(be/1e3);de.received_at?S(V,`⚡ [${Z}] Đã nhận lệnh - đang cài đặt... (${Le}s)`,"info"):S(V,`⌛ [${Z}] Đang chuyển lệnh tới Agent... (${Le}s)`,"info")}}}catch{}},O)}catch(ee){S(V,`❌ Không thể cài driver: ${ee.message}`,"error")}},W=a=>{if(a===0)return"0 Bytes";const m=1024,w=["Bytes","KB","MB","GB"],I=Math.floor(Math.log(a)/Math.log(m));return parseFloat((a/Math.pow(m,I)).toFixed(1))+" "+w[I]},z=async a=>{let m=String(typeof a=="object"?a.id||a.ip||a.mac_address||a.mac_id:a);(!m||m==="0"||m==="undefined")&&typeof a=="object"&&(m=a.ip||a.mac_address||a.mac_id||"0");const w=typeof a=="object"?a:null,I=ce?ce(m):(w==null?void 0:w.agent_uid)||"";f&&f("⌛ Đang yêu cầu Agent đọc trực tiếp danh bạ từ máy photocopy...","info",3e3);try{const{user:K,pass:Z}=await Q(w||{ip:m,mac_address:m}),V={auth_user:K,auth_password:Z};w&&(w.ip&&(V.printer_ip=w.ip),(w.name||w.printer_name)&&(V.printer_name=w.name||w.printer_name),(w.mac_address||w.mac_id)&&(V.mac_id=w.mac_address||w.mac_id));const ee=await Ln(m,I||void 0,V);if(!ee.ok||!ee.command_id)throw new Error(ee.error||"Không thể tạo lệnh đọc danh bạ");p&&p(ee.command_id,m,async o=>{let x=(o==null?void 0:o.address_book_sync)||(o==null?void 0:o.address_book_data)||(o==null?void 0:o.result);if(!x&&typeof(o==null?void 0:o.result_payload)=="string"){const O=o.result_payload;if(O.includes("__ADDRESS_BOOK_JSON_START__"))try{const oe=O.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();x=JSON.parse(oe)}catch{}if(!x){const oe=O.match(/(\{\s*"status"[\s\S]*"address_list"[\s\S]*\})/);if(oe)try{x=JSON.parse(oe[1])}catch{}}}console.log("=================================================="),console.log(`[FRONTEND] KẾT QUẢ ĐỒNG BỘ DANH BẠ MÁY IN (Command ID #${ee.command_id}):`,o),console.log(`[FRONTEND] CHI TIẾT DANH BẠ (Count: ${(x==null?void 0:x.count)||0}):`,(x==null?void 0:x.address_list)||x),console.log("=================================================="),f&&f("✓ Đã cập nhật danh bạ máy in thành công!","success"),x&&n.setCommandStatus&&n.setCommandStatus(O=>({...O,[m]:{...O[m]||{},address_book_sync:x,isPending:!1}})),le&&await le()},o=>{console.error(`[FRONTEND LỖI ĐỒNG BỘ DANH BẠ] Command ID #${ee.command_id}:`,o),f&&f(`Lỗi đọc danh bạ: ${o}`,"error")},"⌛ Agent đang đọc danh bạ máy in...")}catch(K){f&&f(`Lỗi gửi lệnh đọc danh bạ: ${K.message}`,"error")}},$=async()=>{var K;const{printerId:a,name:m,email:w,agentUid:I}=n.publicFtpData||{};if(!m||!m.trim()){f&&f("Vui lòng nhập tên điểm scan","error");return}n.setPublicFtpLoading&&n.setPublicFtpLoading(!0);try{const V=(ie||[]).flatMap(c=>c.printers||[]).find(c=>String(c.id)===String(a)||c.mac_id===a||c.ip===a)||((K=u==null?void 0:u.printers)==null?void 0:K[0]),{user:ee,pass:o,mac:x}=await Q(V||{id:a,mac_address:a}),O={mac_address:x,printer_ip:(V==null?void 0:V.ip)||"",auth_user:ee,auth_password:o},oe=await Rn(a,m.trim(),w,I||void 0,O);if(n.setPublicFtpLoading&&n.setPublicFtpLoading(!1),D&&D(null),!oe.ok||!oe.command_id)throw new Error(oe.error||"Lỗi gửi lệnh");p&&p(oe.command_id,a,async c=>{f&&f(`Đã tạo điểm scan "${m.trim()}" thành công!`,"success"),z(a),le&&await le()},c=>{f&&f(`Thêm điểm scan thất bại: ${c}`,"error")},`⌛ Đang tạo điểm scan "${m.trim()}"...`)}catch(Z){n.setPublicFtpLoading&&n.setPublicFtpLoading(!1),f&&f(`Lỗi: ${Z.message}`,"error")}},ae=async()=>{const{lanUid:a,agentUid:m,email:w}=n.privateFtpData||{};if(!w||!w.includes("@")){f&&f("Địa chỉ email không hợp lệ","error");return}n.setPrivateFtpLoading&&n.setPrivateFtpLoading(!0);try{const I=await Nn("default",a,m,w);if(n.setPrivateFtpLoading&&n.setPrivateFtpLoading(!1),D&&D(null),I.ok)f&&f("Đã thêm Private FTP thành công","success"),le&&await le();else throw new Error(I.error||"Lỗi server")}catch(I){n.setPrivateFtpLoading&&n.setPrivateFtpLoading(!1),f&&f(`Lỗi thêm FTP riêng: ${I.message}`,"error")}},B=async()=>{if(!i){f&&f("Chưa chọn Agent để khởi động lại","error");return}f&&f(`Đang gửi lệnh khởi động lại Agent (${i})...`,"info",4e3);try{const a=await Un(i);if(a.ok)f&&f("Đã gửi lệnh khởi động lại Agent khẩn cấp!","success"),D&&D(null);else throw new Error(a.error||"Thất bại")}catch(a){f&&f(`Lỗi khởi động lại: ${a.message}`,"error")}},E=j.useCallback(a=>Pr(a,(u==null?void 0:u.emails)||[],(u==null?void 0:u.agents)||[]),[u]);return{executeRemoteInstallDriver:C,formatBytes:W,getDestinationStatus:E,getDestinationStatusHtml:Pr,handleAddPrivateFtp:ae,handleAddPublicFtp:$,handleConfirmDeleteScanPoint:T,handleDeleteDest:h,handleEditIP:k,handleEmergencyRestart:B,handleOpenStorageFiles:b,handlePlaySegmentFile:s,handleQueryVideo:l,handleRefetchAddressBook:z,handleRemoteInstallDriver:v,handleSaveEditIP:L}};function Zn(){const n=Jn({}),i=qn(n),_=Yn({...n,...i});return{...n,...i,..._}}function ni(){var re;const n=Zn(),{toasts:i=[],lanSitesLoading:_,lanSites:g=[],selectedLanUid:G,setSelectedLanUid:H,activeTab:le,setActiveTab:ce,selectedLan:he,triggerLanScan:ie,filteredPrinters:p,fetchLanSitesData:P}=n;return e.jsxs(Be.div,{style:t.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:t.toastContainer,children:e.jsx(Ye,{children:i.map(S=>e.jsxs(Be.div,{style:{...t.toast,borderLeft:`4px solid ${S.type==="success"?"var(--color-success)":S.type==="error"?"var(--color-error)":"var(--color-primary)"}`},initial:{opacity:0,x:50,scale:.9},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:50,scale:.9},children:[e.jsx("span",{style:t.toastIcon,children:S.type==="success"?"✔️":S.type==="error"?"❌":"ℹ️"}),e.jsx("div",{style:{flex:1,fontSize:"0.8rem"},children:S.message})]},S.id))})}),e.jsxs("div",{style:t.fixedHeader,children:[e.jsxs("div",{style:t.header,children:[e.jsx("h1",{style:t.title,children:"🛠️ Quản lý Mạng LAN"}),e.jsx("button",{style:{...t.smallBtn,borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>P(!0),children:"🔄 Làm mới"})]}),e.jsxs("div",{style:t.filterBar,children:[e.jsx("label",{style:t.filterLabel,children:"Mạng LAN hiện tại:"}),_&&g.length===0?e.jsx(Ze,{size:"sm"}):e.jsx("select",{value:G,onChange:S=>{H(S.target.value),localStorage.setItem("goxprint_selected_lan_uid",S.target.value)},style:t.lanSelect,children:g.map(S=>{var xe;return e.jsxs("option",{value:S.lan_uid,children:[S.lan_name||S.lan_uid," (",S.active_agents," Agent - ",((xe=S.printers)==null?void 0:xe.length)??0," máy Photo)"]},S.lan_uid)})})]}),e.jsxs("div",{style:t.tabBar,children:[e.jsxs("button",{style:{...t.tabBtn,color:le==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:le==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>ce("agents"),children:["💻 Máy tính (",((re=he==null?void 0:he.agents)==null?void 0:re.filter(S=>S.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...t.tabBtn,color:le==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:le==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{ce("copiers"),ie(he)},children:["🖨️ Photocopy (",p.length,")"]})]})]}),e.jsxs("div",{style:t.scrollableContent,children:[_&&e.jsx("div",{style:t.loadingWrapper,children:e.jsx(Ze,{size:"md"})}),!_&&he&&e.jsxs(Ye,{mode:"wait",children:[le==="agents"&&e.jsx(zn,{...n}),le==="copiers"&&e.jsx(Gn,{...n})]})]}),e.jsx(Hn,{...n})]})}export{ni as AgentPage,ni as default};
