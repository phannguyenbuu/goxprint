import{j as e,R as Or,A as wt,m as st,L as _t,r as d}from"./index-BWmSzKxV.js";import{A as Tn}from"./AnimatedList-B6r_l9Lw.js";import{G as Cn}from"./GlowCard-cfGSuboA.js";const n={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"176px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},lanSelect:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",cursor:"pointer",width:"100%"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",left:"12px",right:"12px",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",maxWidth:"404px",marginLeft:"auto",marginRight:"auto",pointerEvents:"none"},toast:{background:"rgba(18, 18, 26, 0.95)",backdropFilter:"blur(10px)",borderRadius:"8px",padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:"10px",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",pointerEvents:"auto"},toastIcon:{fontSize:"0.9rem",flexShrink:0},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},se={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},credsInputRow:{display:"flex",gap:"6px"},credsInput:{fontSize:"0.8rem",padding:"6px 8px",background:"var(--color-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",flex:1,minWidth:0},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},expandSubBtn:{fontSize:"0.72rem",color:"var(--color-primary)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"block"},suggestedDriverBlock:{padding:"8px",background:"var(--color-inset-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",display:"flex",flexDirection:"column",gap:"6px"},driverSuggestionItem:{background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden"},driverModelHeader:{padding:"6px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255,255,255,0.02)"},driverOptionsList:{padding:"6px",borderTop:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},driverFileRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",background:"var(--color-inset-bg)",borderRadius:"4px",gap:"6px"},driverFileName:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},driverFileUrl:{fontSize:"0.62rem",color:"var(--color-text-secondary)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function An({hasAddressList:a,sync:k,p:j,commandStatus:v,getDestinationStatus:Z,selectedLan:X,handleOpenStorageFiles:ye,handleDeleteDest:ae,handleChangeFtp:pe,handleEditIP:ke}){return e.jsxs("div",{style:se.destinationsBlock,children:[e.jsx("span",{style:se.destBlockTitle,children:"📂 Danh sách điểm scan:"}),a?k.address_list.filter(f=>{if(!f||typeof f!="object"||f.type==="Summary")return!1;const me=(f.name||"").trim();return me==="Summary"||me==="Total"||me.startsWith("Users:")?!1:!!(me||f.entry_id||f.registration_no&&f.registration_no!=="-"||f.email_address||f.email||f.folder||f.physical_path)}).map((f,me)=>{var we,te;const oe=f.email_address||f.email||"",F=f.physical_path||f.folder||f.folder_path||"",ge=(oe||F||"").trim();let he="Folder";F.startsWith("ftp://")?he="FTP":F.startsWith("\\\\")?he="SMB":(oe||oe.includes("@"))&&(he="Email"),Z(f);const Xe=f.registration_no&&f.registration_no!=="-"?f.registration_no:f.entry_id||me+1,G=`${j.id}-${Xe}`,C=((we=v[G])==null?void 0:we.isPending)||!1;return(te=v[G])!=null&&te.message,e.jsxs("div",{style:{...se.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",Xe]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[f.name,(f.warning||f.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:f.warning||f.error,children:"⚠️"})]}),typeof f.file_count=="number"&&e.jsxs("span",{onClick:()=>ye(X.lan_uid,ge),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",f.file_count," files"]}),f.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:f.entry_id})]}),pe&&(he==="FTP"||he==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:C?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:C?.5:1,minWidth:"24px"},onClick:()=>ke&&ke(j.id,f),disabled:C,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:C?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:C?.5:1,minWidth:"24px"},onClick:()=>ae(j.id||j.mac_id||j.mac_address||j.ip,f),disabled:C,title:"Xóa",children:"🗑️"})]},me)}):e.jsx("div",{style:se.emptySubText,children:k.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Đang tải hoặc danh sách trống. Nhấn đồng bộ để lấy trực tiếp."})]})}const jn="https://agentapi.quanlymay.com",Qr=new Map;async function We(a,k={}){const j=`${k.method||"GET"}:${a}:${k.body||""}`;if(Qr.has(j))return Qr.get(j);const v=(async()=>{try{const Z=await fetch(`${jn}${a}`,{...k,headers:{"Content-Type":"application/json","X-API-Token":"change-me",...k.headers}});if(!Z.ok){const X=await Z.json().catch(()=>({}));throw new Error(X.error||`HTTP error! status: ${Z.status}`)}return await Z.json()}finally{Qr.delete(j)}})();return Qr.set(j,v),v}async function In(){try{return(await We("/api/lan-sites?lead=default")).rows||[]}catch(a){return console.error("Failed to fetch LAN sites:",a),[]}}async function En(a,k,j,v,Z){return We(`/api/devices/${encodeURIComponent(a)}/credentials`,{method:"PATCH",body:JSON.stringify({auth_user:k,auth_password:j,mac_id:v||a,printer_type:Z})})}async function Pn(a,k,j){const v=k?`/api/devices/${a}/fetch-address-book?agent_uid=${k}`:`/api/devices/${a}/fetch-address-book`;return We(v,{method:"POST",body:JSON.stringify(j||{})})}async function Ut(a){return We(`/api/commands/${a}/status`)}async function Rn(a,k,j,v,Z){const X=v?`/api/devices/${a}/add-email-dest?agent_uid=${v}`:`/api/devices/${a}/add-email-dest`;return We(X,{method:"POST",body:JSON.stringify({name:k,email:j,...Z||{}})})}async function Ln(a,k,j,v){return We("/api/lan-emails",{method:"POST",body:JSON.stringify({lead:a,lan_uid:k,email:v,email_type:"private",pc_name:j})})}async function Nn(a,k,j,v){return We(`/api/devices/${a}/delete-email-dest`,{method:"POST",body:JSON.stringify({registration_no:k,entry_id:j,agent_uid:v})})}async function Dn(a){return We(`/api/lan-emails/${a}`,{method:"DELETE"})}async function kn(a,k){return We(`/api/scans/files?lan_uid=${encodeURIComponent(a)}&email=${encodeURIComponent(k)}`)}async function On(a,k,j,v,Z,X){return We(`/api/devices/${a}/install-driver`,{method:"POST",body:JSON.stringify({brand:k,model:j,driver_name:v,driver_url:Z,agent_uid:X})})}async function Mn(a){return We(`/api/agents/${a}/settings?lead=default`)}async function Fn(a,k,j,v=1,Z=50,X,ye){const ae=new URLSearchParams;return j&&ae.append("agent_uid",j),v&&ae.append("page",v.toString()),Z&&ae.append("limit",Z.toString()),ae.append("t",Date.now().toString()),We(`/api/jobs?${ae.toString()}`)}async function Un(a,k){return We(`/api/agents/${a}/settings?lead=default`,{method:"POST",body:JSON.stringify(k)})}async function Bn(a,k,j){return We(`/api/agents/${a}/utility/${k}?lead=default`,{method:"POST",body:j?JSON.stringify(j):void 0})}async function wn(a){return We(`/api/agents/${a}/utility-commands?lead=default&t=${Date.now()}`)}async function Nt(a,k,j,v){return We(`/api/agents/${a}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify({command:k,command_content:j,...v||{}})})}async function Gn(a){return We(`/api/agents/${a}/emergency-restart?lead=default`,{method:"POST",body:"{}"})}const zn=Nn;function Hn({p:a,selectedLan:k,activeAgentUid:j,selectedAgentUid:v,copierCredentials:Z,setCopierCredentials:X,saveAuthLoading:ye,handleSaveAuth:ae,isExpanded:pe,handleCopierClick:ke,onlineAgents:f,detectBrand:me,showToast:oe,fetchRemotePage:F,setRemoteLockPrinter:ge,setActiveModal:he,hasAddressList:Xe,sync:G,commandStatus:C,getDestinationStatus:we,handleOpenStorageFiles:te,handleEditIP:Me,handleDeleteDest:dt,handleRefetchAddressBook:Ve,expandedDrivers:pt,setExpandedDrivers:fe,expandedDriverMenus:_e,setExpandedDriverMenus:le,handleRemoteInstallDriver:xe,setPublicFtpData:Ee}){var z,Q,W,V,H;const[K,Qe]=Or.useState(null),Je=Or.useRef(!1),Ge=Or.useCallback(async()=>{try{const h=await We(`/api/lan-sites?t=${Date.now()}`);if(h&&h.ok&&Array.isArray(h.rows)){const E=(a.mac_id||a.mac_address||"").toUpperCase().replace(/-/g,":");for(const ce of h.rows)for(const U of ce.printers||[]){const y=(U.mac_id||U.mac_address||"").toUpperCase().replace(/-/g,":");E&&y&&E===y&&U.address_book_sync&&(U.address_book_sync.address_list||U.address_book_sync.result)&&Qe(U.address_book_sync)}}}catch{}},[a.mac_id,a.mac_address]),Te=((z=C[a.id])==null?void 0:z.isPending)||!1,Ct=((Q=C[a.id])==null?void 0:Q.message)||"";Or.useEffect(()=>{if(Te&&Qe(null),Je.current&&!Te){Ge();const h=setTimeout(Ge,1500),E=setTimeout(Ge,3500);return()=>{clearTimeout(h),clearTimeout(E)}}Je.current=Te},[Te,Ge]);const $=K||G,Dt=a.suggested_drivers&&a.suggested_drivers.length>0,mt=pt[a.id],xt=(()=>{var E,ce,U,y,J;if(Array.isArray($==null?void 0:$.address_list)&&$.address_list.length>0)return $.address_list;if($!=null&&$.address_book_data&&Array.isArray($.address_book_data.address_list))return $.address_book_data.address_list;const h=[$,$==null?void 0:$.result,$==null?void 0:$.result_payload,$==null?void 0:$.raw,(E=C==null?void 0:C[a.id])==null?void 0:E.result,(ce=C==null?void 0:C[a.id])==null?void 0:ce.result_payload,(U=C==null?void 0:C[a.id])==null?void 0:U.address_list,(J=(y=C==null?void 0:C[a.id])==null?void 0:y.address_book_sync)==null?void 0:J.address_list];for(const T of h)if(T){if(Array.isArray(T))return T;if(typeof T=="object"&&Array.isArray(T.address_list))return T.address_list;if(typeof T=="string"){let be=T.trim();if(be.includes("__ADDRESS_BOOK_JSON_START__"))try{be=be.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),be=be.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const ue=JSON.parse(be);if(ue&&Array.isArray(ue.address_list))return ue.address_list;if(Array.isArray(ue))return ue}catch{}}}return Array.isArray($==null?void 0:$.address_list)?$.address_list:[]})(),ut=xt.filter(h=>{if(!h||typeof h!="object"||h.type==="Summary")return!1;const E=(h.name||"").trim();return E==="Summary"||E==="Total"||E.startsWith("Users:")?!1:!!(E||h.entry_id||h.registration_no&&h.registration_no!=="-"||h.email_address||h.email||h.folder||h.physical_path)}),gt={...$,address_list:xt,status:xt.length>0?"success":($==null?void 0:$.status)||"none",timestamp:((W=C==null?void 0:C[a.id])==null?void 0:W.timestamp)||($==null?void 0:$.timestamp)||new Date().toISOString()},yt=ut.length>0||Xe,Bt=ut.length,w=gt.timestamp?new Date(gt.timestamp).toLocaleTimeString("vi-VN"):"",I=Or.useCallback(async(h,E)=>{var N;const ce=me(h.printer_name||h.name||"");if(ce!=="ricoh"&&ce!=="toshiba"){oe("Thiết bị không hỗ trợ thay đổi FTP","error");return}const U=ce==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",y=(N=k==null?void 0:k.agents)==null?void 0:N.find(B=>B.is_agent_active);if(!y){oe("Không tìm thấy Agent nào đang online để cập nhật","error");return}const J=(y==null?void 0:y.local_ip)||(y==null?void 0:y.ip)||"",T=E.folder||E.physical_path||E.folder_path||"",be=T.match(/ftp:\/\/([^:/]+)/),ue=T.match(/^\\\\([^\\]+)/),Fe=T.match(/^([^:/]+):/);let Ae="";be?Ae=be[1]:ue?Ae=ue[1]:Fe&&(Ae=Fe[1]),Ae||(Ae=J);const Ye=E.registration_no||E.id||"",O=E.name||E.username||E.display_name||"",Ue=h.ip||h.printer_ip||"",Ce=h.auth_user||h.username||"admin",Se=h.auth_password||h.password||"";oe(`Đang gửi lệnh cập nhật FTP cho ${E.name}...`,"info");try{const B=await Nt(v,U,"",{printer_ip:Ue,auth_user:Ce,auth_password:Se,target_id:Ye,target_name:O,old_ip:Ae,new_ip:J});B&&B.ok?oe(`Cập nhật FTP cho ${E.name} thành công!`,"success"):oe(`Lỗi: ${(B==null?void 0:B.error)||"Không thể chạy lệnh"}`,"error")}catch(B){oe(`Lỗi gửi lệnh: ${(B==null?void 0:B.message)||B}`,"error")}},[v,k,me,oe]);return e.jsx("div",{id:`copier-card-${a.id}`,onClick:()=>ke(String(a.id)),style:{width:"100%"},children:e.jsxs(Cn,{children:[e.jsxs("div",{style:se.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:se.copierTitle,children:["🖨️ ",(()=>{if(a.printer_name&&a.printer_name.trim())return a.printer_name.trim();const h=(a.mac_id||"").replace(/-/g,":").toUpperCase();return h.startsWith("58:38:79")||h.startsWith("00:26:73")?"Thiết bị Ricoh (Đang thám dò...)":h.startsWith("00:80:91")?"Thiết bị Toshiba (Đang thám dò...)":h.startsWith("00:11:22")?"Thiết bị HP (Đang thám dò...)":"Thiết bị Photocopy (Đang thám dò...)"})()]}),e.jsxs("div",{style:se.copierSubtitle,children:["IP: ",a.ip," · MAC: ",a.mac_id||"—",a.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:a.agent_uid})]})]})]}),e.jsx("span",{style:{...se.statusBadge,color:a.probed?a.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:a.probed?a.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:a.probed?a.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:a.probed?a.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsxs("div",{style:se.sectionBlock,children:[e.jsx("span",{style:se.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsxs("div",{style:se.credsInputRow,children:[e.jsx("input",{type:"text",style:se.credsInput,placeholder:"admin",autoComplete:"new-password",name:`printer_user_${a.id}`,value:((V=Z[a.id])==null?void 0:V.user)||"",onChange:h=>X(E=>({...E,[a.id]:{...E[a.id],user:h.target.value}}))}),e.jsx("input",{type:"password",style:se.credsInput,placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${a.id}`,value:((H=Z[a.id])==null?void 0:H.pass)||"",onChange:h=>X(E=>({...E,[a.id]:{...E[a.id],pass:h.target.value}}))}),e.jsx("button",{style:{...se.smallBtn,padding:"8px 12px",fontSize:"0.8rem",whiteSpace:"nowrap"},onClick:()=>ae(a),disabled:ye[a.id],children:ye[a.id]?"Lưu...":"Lưu Auth"})]})]}),e.jsxs("div",{style:{...se.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:G.status==="success"?"rgba(0, 255, 136, 0.05)":G.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:G.status==="success"?"rgba(0, 255, 136, 0.15)":G.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:se.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),Te?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:Ct}):yt?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",Bt," mục) ",w?` • ${w}`:""]}):G.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",G.error," ",w?`(${w})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...se.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:async()=>{Ve(a),setTimeout(Ge,2e3),setTimeout(Ge,4500)},disabled:Te||f.length===0,children:["🔄 ",gt.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),yt&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(An,{hasAddressList:yt,sync:gt,p:a,commandStatus:C,getDestinationStatus:we,selectedLan:k,handleOpenStorageFiles:te,handleEditIP:Me,handleDeleteDest:dt,handleChangeFtp:I})})]}),Dt&&e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("button",{style:se.expandSubBtn,onClick:()=>fe(h=>({...h,[a.id]:!mt})),children:mt?"▲ Ẩn driver đề xuất":"▼ Xem driver đề xuất từ catalog"}),e.jsx(wt,{children:mt&&e.jsx(st.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},style:{overflow:"hidden",marginTop:"6px"},children:e.jsx("div",{style:se.suggestedDriverBlock,children:a.suggested_drivers.map((h,E)=>{const ce=h.brand==="ricoh"?"var(--color-primary)":h.brand==="toshiba"?"var(--color-error)":"var(--color-success)",U=`${a.id}-${E}`,y=_e[U]||!1;return e.jsxs("div",{style:se.driverSuggestionItem,children:[e.jsxs("div",{style:se.driverModelHeader,onClick:()=>le(J=>({...J,[U]:!y})),children:[e.jsxs("span",{style:{fontSize:"0.8rem",fontWeight:600},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:ce,marginRight:"6px"}}),h.brand.toUpperCase()," - ",h.model]}),e.jsx("span",{style:{fontSize:"0.75rem",color:"var(--color-primary)"},children:y?"▲":"▼"})]}),y&&e.jsx("div",{style:se.driverOptionsList,children:h.drivers&&h.drivers.length>0?h.drivers.map((J,T)=>e.jsxs("div",{style:se.driverFileRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:se.driverFileName,children:J.name}),e.jsx("div",{style:se.driverFileUrl,title:J.url,children:J.url.split("/").pop()})]}),e.jsx("div",{style:{display:"flex",gap:"4px"},children:e.jsx("button",{style:{...se.smallBtn,padding:"4px 8px",fontSize:"0.7rem"},onClick:()=>xe(a.mac_id||a.mac_address||a.ip||a.id,h.brand,h.model,J.name,J.url),disabled:f.length===0,children:"Cài đặt"})})]},T)):e.jsx("div",{style:se.emptySubText,children:"Không tìm thấy driver nào."})})]},E)})})})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...se.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{Ee({printerId:a.id,name:"",email:"",agentUid:v}),he("public_ftp")},disabled:f.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...se.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{const h=v||a.agent_uid||j||"";if(!h){oe("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}F(a.ip,"","GET",null,!1,h,80)},disabled:!k||!k.agents||k.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...se.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#ef4444",color:"#ef4444"},onClick:()=>{ge({ip:a.ip,name:a.name||a.printer_name||a.ip,id:a.id,agentUid:v}),he("remote_lock")},disabled:f.length===0,children:"🔒 Khóa máy từ xa"}),me(a.name||a.printer_name||a.ip)==="ricoh"&&(a.name||a.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...se.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>oe("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),me(a.name||a.printer_name||a.ip)==="toshiba"&&e.jsx("button",{style:{...se.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>oe("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]})},a.id)}function $n(a){const{setCopierCredentials:k,activeAgentUid:j,activeLoadingFile:v,activeModal:Z,activeTab:X,addCameraLoading:ye,addressBookModal:ae,agentUid:pe,agents:ke,cameraAgentUid:f,cameraFileFilter:me,cameras:oe,camerasLoading:F,canNavigateNext:ge,canNavigatePrev:he,commandStatus:Xe,copierCredentials:G,deleteCameraLoading:C,deleteScanPointModal:we,destToDelete:te,detectBrand:Me,editIpData:dt,editIpModal:Ve,editIpNewIp:pt,editIpSaving:fe,expandedCopierId:_e,expandedDriverMenus:le,expandedDrivers:xe,expandedPrinters:Ee,fetchLanSitesData:K,fetchRemotePage:Qe,fileTypeFilter:Je,filteredPrinters:Ge,getDestinationStatus:Te,getTargetAgentUid:Ct,handleCopierClick:$,handleDeleteDest:Dt,handleEditIP:mt,handleOpenStorageFiles:xt,handleRefetchAddressBook:ut,handleRemoteInstallDriver:gt,handleSaveAuth:yt,infoDetailModal:Bt,installDriverModal:w,installDriverSaving:I,installedCount:z,isAllInstalled:Q,lanSites:W,lanSitesLoading:V,liveAddressBooks:H,mockAgentApi:h,newCamIp:E,newCamName:ce,newCamPass:U,newCamPort:y,newCamRtsp:J,newCamUser:T,onlineAgents:be,pendingScanPoints:ue,printers:Fe,publicFtpData:Ae,publicFtpModal:Ye,publicFtpSaving:O,record30sLoading:Ue,remoteLockModal:Ce,remoteLockPrinter:Se,saveAuthLoading:N,selectedAgentUid:B,selectedCamera:S,selectedCameraAgentUid:at,selectedLan:re,selectedLanUid:kt,setActiveModal:Gt,setExpandedDriverMenus:vr,setExpandedDrivers:ve,setPublicFtpData:zt,setRemoteLockPrinter:wr,showToast:tr,storageFilesModal:rr,storageFilesModalData:nr,storageFilesModalLoading:Y,storageFilterDate:At,submittingScanPoint:ir,toshibaVncData:sr,utilityActionPending:Ht,utilityCommands:Tr,utilityCommandsLoading:Cr,utilitySettingsLoading:Mr,utilityStatusMsg:Ze,viewOutputModal:Fr,vncTunnelLoading:Ur,webPreviewHistory:Ot,webPreviewHistoryIndex:Pe,webPreviewLoading:ot,webPreviewModal:jt,webPreviewTab:$t}=a;return e.jsx(e.Fragment,{children:e.jsxs(st.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:n.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(Tn,{className:"copiers-grid",style:n.gridContainer,children:V?e.jsxs("div",{style:n.loadingContainer,children:[e.jsx(_t,{}),e.jsx("div",{style:n.loadingText,children:"Đang tải dữ liệu thiết bị..."})]}):Ge.length===0?e.jsxs("div",{style:n.emptyStateContainer,children:[e.jsx("div",{style:n.emptyIcon,children:"🖨️"}),e.jsx("div",{style:n.emptyTitle,children:"Không tìm thấy máy photocopy nào"}),e.jsx("div",{style:n.emptySubtitle,children:'Vui lòng chọn mạng LAN khác hoặc nhấp "Làm mới" để quét lại thiết bị.'})]}):Ge.map(Re=>{const It=String(_e)===String(Re.id),ar=je=>{if(!je)return null;let Ne=je;if(typeof Ne=="string"){let Tt=Ne.trim();if(Tt.includes("__ADDRESS_BOOK_JSON_START__"))try{Tt=Tt.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),Tt=Tt.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{Ne=JSON.parse(Tt)}catch{return null}}if(typeof Ne!="object")return null;let or=0;for(;Ne&&typeof Ne=="object"&&!Array.isArray(Ne.address_list)&&Ne.address_book_sync&&or<5;)Ne=Ne.address_book_sync,or++;return Ne},Le=(Re.mac_id||Re.mac_address||"").toUpperCase().replace(/-/g,":"),Mt=ar(Le?H==null?void 0:H[Le]:null),Et=ar(Re.address_book_sync),bt=Mt&&Array.isArray(Mt.address_list),Wt=Et&&Array.isArray(Et.address_list)&&Et.address_list.length>0,de=bt?Mt:Wt?Et:Mt||Et||{},kr=(Array.isArray(de.address_list)?de.address_list.filter(je=>{if(!je||typeof je!="object"||je.type==="Summary")return!1;const Ne=(je.name||"").trim();return Ne==="Summary"||Ne==="Total"||Ne.startsWith("Users:")?!1:!!(Ne||je.entry_id||je.registration_no&&je.registration_no!=="-"||je.email_address||je.email||je.folder||je.physical_path)}):[]).length>0,Ar=((re==null?void 0:re.agents)||[]).filter(je=>je.is_agent_active),jr=Ct?Ct(Re.id):B||Re.agent_uid||"";return e.jsx(Hn,{p:Re,selectedLan:re,activeAgentUid:pe,selectedAgentUid:jr,copierCredentials:G||{},setCopierCredentials:k,saveAuthLoading:N||{},handleSaveAuth:yt,isExpanded:It,handleCopierClick:$,onlineAgents:Ar,detectBrand:Me||(()=>"generic"),showToast:tr||(()=>{}),fetchRemotePage:Qe||(()=>{}),setRemoteLockPrinter:wr,setActiveModal:Gt,hasAddressList:kr,sync:de,commandStatus:Xe||{},getDestinationStatus:Te||(()=>({})),handleOpenStorageFiles:xt||(()=>{}),handleEditIP:mt||(()=>{}),handleDeleteDest:Dt||(()=>{}),handleRefetchAddressBook:ut||(()=>{}),expandedDrivers:xe||{},setExpandedDrivers:ve,expandedDriverMenus:le||{},setExpandedDriverMenus:vr,handleRemoteInstallDriver:gt||(()=>{}),setPublicFtpData:zt},Re.id)})})]},"copiers-tab")})}function vn(a){const k=(a||"").trim();return k&&k.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function Wn(a){const{AgentPage:k,activeLoadingFile:j,activeModal:v,activeTab:Z,allocatedVncAddr:X,cameraFiles:ye,cameraForm:ae,cameraLogs:pe,cameraStatus:ke,cameraTestLoading:f,cameraTestResult:me,cameras:oe,camerasLoading:F,commandStatus:ge,confirmModal:he,copierCredentials:Xe,customRecordDuration:G,customRunCommand:C,deleteScanPointModal:we,directLan:te,editIpModalData:Me,editableSettingsText:dt,emailFileCounts:Ve,executeRemoteInstallDriver:pt,expandedDriverMenus:fe,expandedDrivers:_e,expandedPrinters:le,fetchCameraFiles:xe,fetchCameraStatus:Ee,fetchRemotePage:K,fetchRemotePageOld:Qe,ftpDetailData:Je,getDestinationStatus:Ge,getDestinationStatusHtml:Te,getLiveQueryTimestamp:Ct,handleAddPrivateFtp:$,handleAddPublicFtp:Dt,handleCloseWebPreview:mt,handleConfirmDeleteScanPoint:xt,handleCopierClick:ut,handleDeleteCamera:gt,handleDeleteCameraFile:yt,handleDeleteDest:Bt,handleEditIP:w,handleFetchEntryDetail:I,handleHistoryBack:z,handleHistoryForward:Q,handleOpenStorageFiles:W,handlePlaySegmentFile:V,handleQueryVideo:H,handleRecord30s:h,handleRefetchAddressBook:E,handleRemoteInstallDriver:ce,handleSaveAuth:U,handleSaveCameraConfig:y,handleSaveEditIP:J,handleTriggerUtilityExec:T,handleSaveSettings:be,handleStartToshibaVnc:ue,handleTestCameraConnection:Fe,handleToggleDirectLan:Ae,handleViewScanPointsJson:Ye,installDriverModal:O,ipInputModal:Ue,isRecording30s:Ce,isSavingSettings:Se,lanSites:N,lanSitesLoading:B,liveAddressBooks:S,lockAspect:at,pollCommandStatus:re,previewBlobUrl:kt,privateFtpData:Gt,privateFtpLoading:vr,publicFtpData:ve,publicFtpLoading:zt,queriedVideoUrl:wr,queryDuration:tr,queryTimestamp:rr,queryVideoLoading:nr,recording30sCountdown:Y,remoteLockPrinter:At,resolveRelativePath:ir,saveAuthLoading:sr,savedLocal:Ht,scaleX:Tr,scaleY:Cr,scanAutoOpenDir:Mr,scanAutoOpenFile:Ze,scanPointsViewerModal:Fr,selectedCamera:Ur,selectedCameraAgentUid:Ot,selectedLan:Pe,selectedLanUid:ot,selectedTargetAgents:jt,selectedUtilityAgent:$t,setActiveLoadingFile:Re,setActiveModal:It,setActiveTab:ar,setAllocatedVncAddr:Le,setCameraFiles:Mt,setCameraForm:Et,setCameraLogs:bt,setCameraStatus:Wt,setCameraTestLoading:de,setCameraTestResult:Vt,setCameras:kr,setCamerasLoading:Ar,setCommandStatus:jr,setConfirmModal:je,setCopierCredentials:Ne,setCustomRecordDuration:or,setCustomRunCommand:Tt,setDeleteScanPointModal:Yr,setDirectLan:Zr,setEditIpModalData:Ir,setEditableSettingsText:Jt,setEmailFileCounts:en,setExpandedDriverMenus:tn,setExpandedDrivers:Er,setExpandedPrinters:Kt,setFtpDetailData:rn,setInstallDriverModal:qt,setIpInputModal:Br,setIsRecording30s:nn,setIsSavingSettings:Xt,setLanSites:Gr,setLanSitesLoading:sn,setLiveAddressBooks:Pr,setLockAspect:St,setPreviewBlobUrl:rt,setPrivateFtpData:an,setPrivateFtpLoading:Qt,setPublicFtpData:on,setPublicFtpLoading:lr,setQueriedVideoUrl:D,setQueryDuration:zr,setQueryTimestamp:Rr,setQueryVideoLoading:Pt,setRecording30sCountdown:ln,setRemoteLockPrinter:cr,setSaveAuthLoading:cn,setScaleX:dn,setScaleY:Hr,setScanAutoOpenDir:nt,setScanAutoOpenFile:pn,setScanPointsViewerModal:ne,setSelectedCamera:dr,setSelectedCameraAgentUid:$r,setSelectedLanUid:ht,setSelectedTargetAgents:ze,setSelectedUtilityAgent:Wr,setSettingsSaveStatus:pr,setShowPreviewDetails:mr,setShowSettings:Lr,setStorageFiles:mn,setStorageLoading:Yt,setStorageModalData:un,setToasts:Rt,setToshibaVncData:gn,setUtilityActionPending:ur,setUtilityCommands:hn,setUtilityCommandsLoading:Ie,setUtilitySettingsLoading:fn,setUtilityStatusMsg:ee,setViewOutputModal:gr,setVncTunnelLoading:Vr,setWebPreviewHistory:Lt,setWebPreviewHistoryIndex:Nr,setWebPreviewLoading:_n,setWebPreviewModal:xn,setWebPreviewTab:De,settingsSaveStatus:it,showPreviewDetails:Zt,showSettings:Jr,storageFiles:yn,storageLoading:Ft,storageModalData:Kr,toasts:lt,toshibaVncData:vt,utilityActionPending:er,utilityCommands:hr,utilityCommandsLoading:Ke,utilitySettingsLoading:Dr,utilityStatusMsg:fr,viewOutputModal:_r,vncTunnelLoading:bn,webPreviewHistory:ft,webPreviewHistoryIndex:q,webPreviewLoading:xr,webPreviewModal:qr,webPreviewTab:Xr}=a;return e.jsx(e.Fragment,{children:e.jsx(st.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:n.tabContent,children:e.jsx(Tn,{children:Pe.agents.filter(ie=>ie.is_agent_active).length===0?e.jsx("div",{style:n.emptyText,children:"Không có Agent nào đang online trong mạng LAN này."}):Pe.agents.filter(ie=>ie.is_agent_active).map(ie=>{const et=ie.is_agent_active;return e.jsxs(Cn,{children:[e.jsxs("div",{style:n.cardHeader,children:[e.jsxs("span",{style:n.cardTitle,children:["💻 ",ie.hostname]}),e.jsx("span",{style:{...n.statusBadge,color:et?"var(--color-status-online)":"var(--color-status-offline)",borderColor:et?"var(--color-status-online)":"var(--color-status-offline)",background:et?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:et?ie.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]}),e.jsxs("div",{style:n.cardDetails,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"UID:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:ie.agent_uid})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...n.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[ie.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async Oe=>{Oe.stopPropagation();try{const qe=await Nt(ie.agent_uid,"get_agent_ip","");if(qe.ok&&qe.command_id){a.showToast&&a.showToast("Đang yêu cầu lấy lại IP cục bộ...","info");const He=qe.command_id,yr=Date.now(),r=setInterval(async()=>{try{if(Date.now()-yr>12e3){clearInterval(r);return}const i=await Ut(He);i.status==="success"?(clearInterval(r),a.fetchLanSitesData&&await a.fetchLanSitesData(!0),a.showToast&&a.showToast("Đã cập nhật IP cục bộ mới nhất!","success")):i.status==="failed"&&(clearInterval(r),a.showToast&&a.showToast("Không thể lấy lại IP cục bộ: "+(i.error||"Thất bại"),"error"))}catch(i){console.error(i),clearInterval(r)}},1e3)}else a.showToast&&a.showToast("Gửi yêu cầu thất bại: "+(qe.error||"Lỗi kết nối"),"error")}catch(qe){a.showToast&&a.showToast("Lỗi: "+qe.message,"error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:Oe=>Oe.currentTarget.style.opacity="1",onMouseLeave:Oe=>Oe.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:n.detailValue,children:ie.local_mac||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:n.detailValue,children:(()=>{const Oe=(ie.ftp_sites||[]).find(l=>(l.name||"").toLowerCase()==="goxprint")||(ie.ftp_sites||[])[0],qe=(Oe==null?void 0:Oe.path)||"",He=vn((Pe==null?void 0:Pe.lan_uid)||""),yr=vn(ie.agent_uid||""),i=`storage/uploads/scans/${vn(ie.lead||"default")}/${He}/${yr}/`,s=Pe?Pe.emails.filter(l=>l.email_type==="private"&&l.pc_name&&l.pc_name.toLowerCase().trim()===ie.agent_uid.toLowerCase().trim()):[],o=s.reduce((l,m)=>l+(Ve[m.email]??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:qe?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:qe?"normal":"italic"},children:qe||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:i})]})]}),s.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[s.map(l=>{const m=Ve[l.email]??0;return e.jsxs("button",{style:{...n.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>W((Pe==null?void 0:Pe.lan_uid)||"",l.email),title:`Xem tệp của ${l.email}`,children:["📁 ",m," tệp"]},l.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[o," tệp"]})]})]}),s.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:n.detailValue,children:ie.ftp_ports||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:n.detailValue,children:e.jsx("button",{onClick:()=>{Wr(ie),It("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:n.detailValue,children:ie.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!ie.ftp_sites||ie.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:ie.ftp_sites.map((Oe,qe)=>{const He=Oe.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${He?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:He?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:He?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:He?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:He?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",Oe.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",He?"Đang chạy":"Đã dừng",")"]})]}),Oe.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",Oe.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:Oe.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:Oe.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:Oe.ftp_password||"goxprint"})]})]})]})]},qe)})})]})]},ie.agent_uid)})})},"agents-tab")})}function Vn(a){var s,o,l,m,p,u,g,P,R,L,b;const{AgentPage:k,activeLoadingFile:j,activeModal:v,activeTab:Z,allocatedVncAddr:X,cameraFiles:ye,cameraForm:ae,cameraLogs:pe,cameraStatus:ke,cameraTestLoading:f,cameraTestResult:me,cameras:oe,camerasLoading:F,commandStatus:ge,confirmModal:he,copierCredentials:Xe,customRecordDuration:G,customRunCommand:C,deleteScanPointModal:we,directLan:te,editIpModalData:Me,editableSettingsText:dt,emailFileCounts:Ve,executeRemoteInstallDriver:pt,expandedDriverMenus:fe,expandedDrivers:_e,expandedPrinters:le,fetchCameraFiles:xe,fetchCameraStatus:Ee,fetchRemotePage:K,fetchRemotePageOld:Qe,formatBytes:Je,formatJsonText:Ge,ftpDetailData:Te,getDestinationStatus:Ct,getDestinationStatusHtml:$,getLiveQueryTimestamp:Dt,handleAddPrivateFtp:mt,handleAddPublicFtp:xt,handleCloseWebPreview:ut,handleConfirmDeleteScanPoint:gt,handleCopierClick:yt,handleDeleteCamera:Bt,handleDeleteCameraFile:w,handleDeleteDest:I,handleEditIP:z,handleEmergencyRestart:Q,handleFetchEntryDetail:W,handleHistoryBack:V,handleHistoryForward:H,handleOpenStorageFiles:h,handlePlaySegmentFile:E,handleQueryVideo:ce,handleRecord30s:U,handleRefetchAddressBook:y,handleRemoteInstallDriver:J,handleSaveAuth:T,handleSaveCameraConfig:be,handleSaveEditIP:ue,handleSaveSettings:Fe,handleStartToshibaVnc:Ae,handleTestCameraConnection:Ye,handleToggleDirectLan:O,handleToggleSetting:Ue,handleTriggerUtility:Ce,handleTriggerUtilityExec:Se,handleViewScanPointsJson:N,installDriverModal:B,ipInputModal:S,isRecording30s:at,isSavingSettings:re,lanSites:kt,lanSitesLoading:Gt,liveAddressBooks:vr,lockAspect:ve,modalContentRef:zt,pollCommandStatus:wr,previewBlobUrl:tr,previewIframeRef:rr,privateFtpData:nr,privateFtpLoading:Y,publicFtpData:At,publicFtpLoading:ir,queriedVideoUrl:sr,queryDuration:Ht,queryTimestamp:Tr,queryVideoLoading:Cr,recording30sCountdown:Mr,remoteLockPrinter:Ze,resolveRelativePath:Fr,saveAuthLoading:Ur,savedLocal:Ot,scaleX:Pe,scaleY:ot,scanAutoOpenDir:jt,scanAutoOpenFile:$t,scanPointsViewerModal:Re,selectedCamera:It,selectedCameraAgentUid:ar,selectedLan:Le,selectedLanUid:Mt,selectedTargetAgents:Et,selectedUtilityAgent:bt,setActiveLoadingFile:Wt,setActiveModal:de,setActiveTab:Vt,setAllocatedVncAddr:kr,setCameraFiles:Ar,setCameraForm:jr,setCameraLogs:je,setCameraStatus:Ne,setCameraTestLoading:or,setCameraTestResult:Tt,setCameras:Yr,setCamerasLoading:Zr,setCommandStatus:Ir,setConfirmModal:Jt,setCopierCredentials:en,setCustomRecordDuration:tn,setCustomRunCommand:Er,setDeleteScanPointModal:Kt,setDirectLan:rn,setEditIpModalData:qt,setEditableSettingsText:Br,setEmailFileCounts:nn,setExpandedDriverMenus:Xt,setExpandedDrivers:Gr,setExpandedPrinters:sn,setFtpDetailData:Pr,setInstallDriverModal:St,setIpInputModal:rt,setIsRecording30s:an,setIsSavingSettings:Qt,setLanSites:on,setLanSitesLoading:lr,setLiveAddressBooks:D,setLockAspect:zr,setPreviewBlobUrl:Rr,setPrivateFtpData:Pt,setPrivateFtpLoading:ln,setPublicFtpData:cr,setPublicFtpLoading:cn,setQueriedVideoUrl:dn,setQueryDuration:Hr,setQueryTimestamp:nt,setQueryVideoLoading:pn,setRecording30sCountdown:ne,setRemoteLockPrinter:dr,setSaveAuthLoading:$r,setScaleX:ht,setScaleY:ze,setScanAutoOpenDir:Wr,setScanAutoOpenFile:pr,setScanPointsViewerModal:mr,setSelectedCamera:Lr,setSelectedCameraAgentUid:mn,setSelectedLanUid:Yt,setSelectedTargetAgents:un,setSelectedUtilityAgent:Rt,setSettingsSaveStatus:gn,setShowPreviewDetails:ur,setShowSettings:hn,setStorageFiles:Ie,setStorageLoading:fn,setStorageModalData:ee,setToasts:gr,setToshibaVncData:Vr,setUtilityActionPending:Lt,setUtilityCommands:Nr,setUtilityCommandsLoading:_n,setUtilitySettingsLoading:xn,setUtilityStatusMsg:De,setViewOutputModal:it,setVncTunnelLoading:Zt,setWebPreviewHistory:Jr,setWebPreviewHistoryIndex:yn,setWebPreviewLoading:Ft,setWebPreviewModal:Kr,setWebPreviewTab:lt,settingsSaveStatus:vt,showPreviewDetails:er,showSettings:hr,showToast:Ke,storageFiles:Dr,storageLoading:fr,storageModalData:_r,toasts:bn,toshibaVncData:ft,utilityActionPending:q,utilityCommands:xr,utilityCommandsLoading:qr,utilitySettingsLoading:Xr,utilityStatusMsg:ie,viewOutputModal:et,vncTunnelLoading:Oe,webPreviewHistory:qe,webPreviewHistoryIndex:He,webPreviewLoading:yr,webPreviewModal:r,webPreviewTab:i}=a;return e.jsxs(e.Fragment,{children:[e.jsx(wt,{children:v&&e.jsx("div",{style:n.modalOverlay,onClick:()=>de(null),children:e.jsxs(st.div,{style:n.modalCard,onClick:t=>t.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[v==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:n.modalSubtitle,children:_r.email})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:fr?e.jsxs("div",{style:n.modalLoading,children:[e.jsx(_t,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):Dr.length===0?e.jsx("div",{style:n.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:n.filesList,children:Dr.map((t,c)=>e.jsxs("div",{style:n.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${t.url}`,target:"_blank",rel:"noreferrer",style:n.fileLinkName,children:t.name}),e.jsxs("div",{style:n.fileMetaDetails,children:["Dung lượng: ",Je(t.size)," · Mtime: ",new Date(t.mtime).toLocaleString("vi-VN")]}),t.upload_completed_at&&e.jsxs("div",{style:n.fileUploadMeta,children:["Tải lên VPS: ",new Date(t.upload_completed_at).toLocaleTimeString("vi-VN"),t.upload_duration!=null?` (${t.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${t.url}`,download:!0,target:"_blank",rel:"noreferrer",style:n.fileDownloadBtn,children:"Tải về"})]},c))})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>h(_r.lanUid,_r.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>de(null),children:"Đóng"})]})]}),v==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:n.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:At.name,onChange:t=>cr(c=>({...c,name:t.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: goxprint@gmail.com",value:At.email,onChange:t=>cr(c=>({...c,email:t.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:n.modalInput,value:At.agentUid,onChange:t=>cr(c=>({...c,agentUid:t.target.value})),children:(Le&&Le.agents||[]).filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:xt,disabled:ir,children:ir?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>de(null),children:"Hủy bỏ"})]})]}),v==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: user.pc1@gmail.com",value:nr.email,onChange:t=>Pt(c=>({...c,email:t.target.value}))}),e.jsxs("span",{style:n.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",nr.agentUid]})]})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:mt,disabled:Y,children:Y?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>de(null),children:"Hủy bỏ"})]})]}),v==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:n.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(s=infoDetailData.details)==null?void 0:s.proto})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Server Host:"}),e.jsx("span",{style:n.detailValue,children:(o=infoDetailData.details)==null?void 0:o.server})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:n.detailValue,children:(l=infoDetailData.details)==null?void 0:l.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace"},children:(m=infoDetailData.details)==null?void 0:m.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>de(null),children:"Đóng cửa sổ"})})]}),v==="ftp_detail"&&Te&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:n.modalSubtitle,children:["Cổng Port: ",Te.port]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{de(null),Pr(null)},children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:Te.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:Te.error?"var(--color-error)":"var(--color-success)"},children:Te.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),Te.error&&e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...n.detailValue,color:"var(--color-error)"},children:Te.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...n.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:Te.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{de(null),Pr(null)},children:"Đóng cửa sổ"})})]}),v==="utilities"&&bt&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:n.modalSubtitle,children:["Máy: ",bt.hostname," · IP: ",bt.local_ip,":",bt.web_port||9173]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{de(null),Rt(null),De(null)},children:"×"})]}),e.jsxs("div",{style:{...n.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[ie&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:ie.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:ie.isError?"#ef4444":"#10b981",border:`1px solid ${ie.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:ie.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:Xr?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(_t,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:$t,onChange:()=>Ue("scan_auto_open_file",$t),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:jt,onChange:()=>Ue("scan_auto_open_dir",jt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500,fontSize:"0.8rem",color:"var(--color-text)"},children:"Lối tắt ngoài Desktop (%TEMP%/GoPrinxAgent/ftp)"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Tạo Shortcut thư mục Scan ra màn hình Desktop cho nhân viên dễ mở"})]}),e.jsx("button",{onClick:()=>{const t=xr.find(c=>c.command==="create_scan_shortcut");t?Se("create_scan_shortcut",t.command_content):Se("create_scan_shortcut",`import os, sys, tempfile, subproce pathlib
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
else: raise RuntimeError(msg)`)},disabled:q!==null,style:{padding:"6px 12px",fontSize:"0.75rem",borderRadius:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-primary)",color:"var(--color-primary)",cursor:q!==null?"not-allowed":"pointer",whiteSpace:"nowrap",fontWeight:600,display:"flex",alignItems:"center",gap:"5px"},children:"🔗 Tạo Shortcut Desktop"})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[qr?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(_t,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsxs(e.Fragment,{children:[xr.length>0?(()=>{const t=xr.filter(_=>_.command!=="dxdiag"&&_.command!=="open_web_setting"),c=t.findIndex(_=>_.command==="sync_all_scanpoints");if(c>-1){const[_]=t.splice(c,1);t.unshift(_)}return t.map(_=>{const x=_.command==="emergency_restart";return e.jsxs("button",{onClick:()=>Se(_.command,_.command_content),disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:x?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:M=>{q===null&&(M.currentTarget.style.borderColor=x?"#ef4444":"var(--color-primary)",M.currentTarget.style.background=x?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:M=>{M.currentTarget.style.borderColor=x?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",M.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q===_.command?e.jsx(_t,{size:"sm"}):_.icon||"🔧"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:x?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:_.label})]},_.command)})})():e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>Ce("printers"),disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="printers"?e.jsx(_t,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>Ce("scan"),disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="scan"?e.jsx(_t,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Thư mục Scan"})]})]}),e.jsxs("button",{onClick:()=>{if(!bt)return;Lt("check_watchdog"),De({text:"⌛ Đang kiểm tra watchdog...",isError:!1}),triggerAgentUtilityExec(bt.agent_uid,"check_watchdog",`import subproce os, sys
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
raise RuntimeError('\\n'.join(lines))`).then(c=>{if(c.ok&&c.command_id){const x=Date.now(),M=setInterval(async()=>{if(Date.now()-x>3e4){clearInterval(M),De({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),Lt(null);return}try{const A=await getCommandStatus(c.command_id);if(A.status==="success"){clearInterval(M);const $e=A.result_payload||A.result||A.error||"Hoàn thành";it({isOpen:!0,title:"🩺 Check Watchdog",content:$e}),De(null),Lt(null)}else if(A.status==="failed"){clearInterval(M);const $e=A.error||A.result_payload||A.result||"Failed";it({isOpen:!0,title:"🩺 Check Watchdog",content:$e}),De(null),Lt(null)}}catch{}},2e3)}else De({text:"❌ "+(c.error||"Không thể gửi lệnh"),isError:!0}),Lt(null)}).catch(c=>{De({text:"❌ "+c.message,isError:!0}),Lt(null)})},disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="check_watchdog"?e.jsx(_t,{size:"sm"}):"🩺"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Check watchdog"})]}),e.jsxs("button",{onClick:Q,disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="#ef4444",t.currentTarget.style.background="rgba(239, 68, 68, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="rgba(239, 68, 68, 0.25)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="emergency_restart"?e.jsx(_t,{size:"sm"}):"🔌"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#ef4444",lineHeight:"1.2",wordBreak:"break-word"},children:"Emergency Kill"})]})]}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:C,onChange:t=>Er(t.target.value),onKeyDown:t=>{t.key==="Enter"&&C.trim()&&Ce("run_command",{command_line:C.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:q!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{C.trim()&&Ce("run_command",{command_line:C.trim()})},disabled:q!==null||!C.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:C.trim()?"var(--color-primary)":"var(--color-surface)",color:C.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:C.trim()&&q===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:q==="run_command"?e.jsx(_t,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(t=>e.jsx("button",{onClick:()=>Er(t.cmd),disabled:q!==null,title:t.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:C===t.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:C===t.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:q!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:t.label},t.cmd))})]})]})]})]}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{de(null),Rt(null),De(null)},children:"Đóng cửa sổ"})})]}),v==="edit_ip"&&Me&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:t=>{const c=t.target.value;c&&qt(_=>{if(!_)return null;const x=_.newPort||"2130";return{..._,newIp:`${c}:${x}`,newPort:x}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((Le==null?void 0:Le.agents)||[]).map((t,c)=>{const _=t.local_ip||t.ip||"",x=t.hostname||t.uid||`Agent ${c+1}`;return e.jsxs("option",{value:_,children:[x," (",_,")"]},c)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:Me.newPort||"",onChange:t=>{const c=t.target.value;qt(_=>{if(!_)return null;let x=_.newIp||"";return x.includes(":")&&(x=x.split(":")[0]),{..._,newPort:c,newIp:c?`${x}:${c}`:x}})},placeholder:"2130",style:n.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:Me.newIp,onChange:t=>{const c=t.target.value;qt(_=>{if(!_)return null;let x=_.newPort||"2130";return c.includes(":")&&(x=c.split(":")[1].trim()||x),{..._,newIp:c,newPort:x}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:n.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",Me.entry.folder||Me.entry.physical_path||Me.entry.folder_path]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>de(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...n.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(Me.newIp||"").trim().includes(":")){Ke("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}ue()},disabled:!Me.newIp.trim(),children:"Lưu lại"})]})]}),v==="remote_lock"&&Ze&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:Ze.name})," (",Ze.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{de(null),Ke(`Đang gửi lệnh khóa máy ${Ze.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ze.ip,action:"lock_machine",agent_uid:Ze.agentUid}).then(t=>{t.ok?Ke(`Đã gửi lệnh khóa máy ${Ze.name} thành công!`,"success"):Ke("Lỗi: "+(t.error||"Failed"),"error")}).catch(t=>{Ke("Lỗi: "+t.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{de(null),Ke(`Đang gửi lệnh mở khóa máy ${Ze.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ze.ip,action:"enable_machine",agent_uid:Ze.agentUid}).then(t=>{t.ok?Ke(`Đã gửi lệnh mở khóa máy ${Ze.name} thành công!`,"success"):Ke("Lỗi: "+(t.error||"Failed"),"error")}).catch(t=>{Ke("Lỗi: "+t.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),v==="toshiba_vnc"&&ft&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["📺 Kết nối VNC - ",ft.printerName]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>de(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:Oe?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:te?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{de(null),window.open(`http://${ft.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):X?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${ft.agentUid}&ip=${ft.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async t=>{const c=t.currentTarget.getBoundingClientRect(),_=t.clientX-c.left,x=t.clientY-c.top,M=_/c.width,A=x/c.height,$e=Math.round(M*1024),tt=Math.round(A*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:ft.agentUid,ip:ft.ip,port:49105,x:$e,y:tt})})}catch(Be){console.error("VNC Click error:",Be)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!te&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:X})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(X),Ke("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),Ke("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${X}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{de(null),K(ft.ip,"","GET",null,!1,ft.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(wt,{children:he.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>Jt(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:n.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["⚠️ ",he.title]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Jt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:he.message})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var t;Jt(c=>({...c,isOpen:!1})),(t=he.onConfirm)==null||t.call(he)},children:"Đồng ý"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Jt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(wt,{children:we.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>Kt(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:{...n.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Kt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((p=we.entry)==null?void 0:p.name)||((u=we.entry)==null?void 0:u.name_1)||((g=we.entry)==null?void 0:g.email_address)||((P=we.entry)==null?void 0:P.folder)||((R=we.entry)==null?void 0:R.registration_no)||"không tên",'"']}),((L=we.entry)==null?void 0:L.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(b=we.entry)==null?void 0:b.registration_no]})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:n.modalInput,value:we.agentUid,onChange:t=>Kt(c=>({...c,agentUid:t.target.value})),children:(Le&&Le.agents||[]).filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))}),e.jsx("span",{style:n.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:gt,children:"Xác nhận xóa"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Kt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(wt,{children:B.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>St(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:n.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>St(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:"0 0 12px 0"},children:["Bạn chuẩn bị cài đặt driver ",e.jsxs("strong",{children:['"',B.driverName,'"']})," từ xa."]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),!(Le!=null&&Le.agents)||Le.agents.filter(t=>t.is_agent_active).length===0?e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-text-secondary)",fontStyle:"italic",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px"},children:"Không có Agent online trong LAN này"}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px",maxHeight:"200px",overflowY:"auto"},children:Le.agents.filter(t=>t.is_agent_active).map(t=>{const c=B.selectedAgentUids.includes(t.agent_uid);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"0.82rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:c,onChange:_=>{St(x=>{const M=x.selectedAgentUids;return _.target.checked?{...x,selectedAgentUids:[...M,t.agent_uid]}:{...x,selectedAgentUids:M.filter(A=>A!==t.agent_uid)}})},style:{width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsxs("span",{children:[t.hostname," (",t.local_ip,")"]})]},t.agent_uid)})})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:B.selectedAgentUids.length===0,onClick:()=>{St(t=>({...t,isOpen:!1})),B.selectedAgentUids.forEach(t=>{pt(B.printerId,B.brand,B.model,B.driverName,B.driverUrl,t)})},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>St(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(wt,{children:S.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:170},onClick:()=>rt(t=>({...t,isOpen:!1,error:""})),children:e.jsxs(st.div,{style:n.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:S.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>rt(t=>({...t,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[S.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:S.value,onChange:t=>rt(c=>({...c,value:t.target.value,error:""})),onKeyDown:t=>{if(t.key==="Enter"){const c=/^(\d{1,3}\.){3}\d{1,3}$/;if(!c.test(S.value.trim())){rt(M=>({...M,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const _=(S.changeAllTo||"").trim();if(_&&!c.test(_)){rt(M=>({...M,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const x=S.onConfirm;rt(M=>({...M,isOpen:!1,error:""})),x(S.value.trim(),_)}t.key==="Escape"&&rt(c=>({...c,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:S.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:t=>{S.error||(t.target.style.borderColor="var(--color-primary)")},onBlur:t=>{S.error||(t.target.style.borderColor="var(--color-surface-light)")}}),S.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:S.changeAllTo||"",onChange:t=>rt(c=>({...c,changeAllTo:t.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:t=>{t.target.style.borderColor="var(--color-primary)"},onBlur:t=>{t.target.style.borderColor="var(--color-surface-light)"}})]}),S.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",S.error]}),S.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:S.scanStatus})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const t=/^(\d{1,3}\.){3}\d{1,3}$/;if(!t.test(S.value.trim())){rt(x=>({...x,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const c=(S.changeAllTo||"").trim();if(c&&!t.test(c)){rt(x=>({...x,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const _=S.onConfirm;rt(x=>({...x,isOpen:!1,error:""})),_(S.value.trim(),c)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>rt(t=>({...t,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(wt,{children:et.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>it(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{style:{...n.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:{...n.modalTitle,fontSize:"0.85rem"},children:et.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>it(t=>({...t,isOpen:!1})),children:"×"})]}),et.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:zt,value:dt,onChange:t=>Br(t.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),vt&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:vt.startsWith("❌")?"rgba(239,68,68,0.1)":vt.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:vt.startsWith("❌")?"#f87171":vt.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${vt.startsWith("❌")?"rgba(239,68,68,0.15)":vt.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:vt})]}):e.jsx("pre",{ref:zt,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:Ge(et.content)}),e.jsxs("div",{style:{...n.modalFooter,marginTop:"10px"},children:[et.title.includes("settings.json")&&e.jsx("button",{disabled:re,style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:re?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:re?"not-allowed":"pointer"},onClick:Fe,children:re?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(et.title.includes("settings.json")?dt:Ge(et.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>it(t=>({...t,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(wt,{children:r&&r.isOpen&&e.jsxs("div",{className:"web-preview-modal-overlay",style:{...n.confirmOverlay,zIndex:190,alignItems:"flex-start",paddingTop:"5vh"},onClick:ut,children:[e.jsx("style",{children:`
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
            `}),(()=>{let t="Trang cấu hình máy in";if(r.html&&r.html!=="LOADING"&&!r.html.startsWith("ERROR:"))if(r.html==="DIRECT_LAN")t="Kết nối trực tiếp LAN";else{const c=r.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);c&&c[1]&&(t=c[1].trim())}return e.jsxs(st.div,{className:"web-preview-modal-card",style:{...n.confirmModalCard,maxWidth:"1200px",width:"95%",height:"85vh",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px"},onClick:c=>c.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:{...n.modalTitle,fontSize:"0.85rem"},children:r.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:ut,children:"×"})]}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",gap:"15px",minHeight:0},children:r.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px"},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"var(--color-text-secondary)",fontWeight:500},children:"Đang đợi phản hồi từ Agent..."}),e.jsx("span",{style:{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",textAlign:"center",maxWidth:"320px"},children:"Agent đang kết nối trực tiếp đến máy in và nạp cấu hình..."})]}):r.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"2.2rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600,textAlign:"center"},children:"Lỗi lấy trang Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.75rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"12px",background:"rgba(239, 68, 68, 0.08)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.15)",width:"100%",boxSizing:"border-box",fontFamily:"monospace"},children:r.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255, 255, 255, 0.03)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"var(--color-text)"},children:e.jsxs("span",{children:["🔌 Kết nối: ",e.jsx("strong",{children:te?"⚡ Trực tiếp LAN":"🌐 Qua Agent"})]})}),e.jsx("button",{onClick:()=>ur(!er),style:{background:"none",border:"none",color:"var(--color-primary)",cursor:"pointer",fontWeight:600,fontSize:"0.72rem",display:"flex",alignItems:"center",gap:"4px"},children:er?"Thu gọn ▲":"Cài đặt & Chi tiết ▼"})]}),er&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",background:"rgba(16, 185, 129, 0.04)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 14px"},children:[e.jsxs("div",{style:{fontSize:"0.74rem",color:"var(--color-text-secondary)"},children:[e.jsx("span",{style:{color:"#10b981",fontWeight:700},children:"🟢 Kết nối Live:"})," ",t," (",e.jsx("span",{style:{fontFamily:"monospace"},children:r.ip}),")"]}),e.jsx("button",{onClick:()=>window.open(`http://${r.ip}/`,"_blank"),style:{padding:"6px 12px",fontSize:"0.72rem",fontWeight:600,background:"#10b981",border:"none",borderRadius:"6px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.15)"},children:"🌐 Mở trực tiếp LAN"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.74rem",fontWeight:600,color:"var(--color-text)"},children:"🔗 Chế độ kết nối:"}),e.jsxs("div",{style:{display:"flex",gap:"6px"},children:[e.jsx("button",{onClick:()=>O(!1),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:te?"rgba(255,255,255,0.05)":"var(--color-primary)",color:te?"var(--color-text-secondary)":"white",border:te?"1px solid var(--color-surface-light)":"1px solid var(--color-primary)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"🔌 Qua Agent (Từ xa)"}),e.jsx("button",{onClick:()=>O(!0),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:te?"#10b981":"rgba(255,255,255,0.05)",color:te?"white":"var(--color-text-secondary)",border:te?"1px solid #10b981":"1px solid var(--color-surface-light)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"⚡ Trực tiếp LAN (Cùng Wifi)"})]})]}),te&&window.location.protocol==="https:"&&e.jsxs("div",{style:{color:"#fbbf24",background:"rgba(251, 191, 36, 0.08)",border:"1px solid rgba(251, 191, 36, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["⚠️ ",e.jsx("strong",{children:"Mixed Content Block:"})," Trình duyệt di động/máy tính sẽ chặn kết nối HTTP trực tiếp đến IP máy in từ trang web bảo mật HTTPS. Để kết nối trực tiếp thành công, hãy mở trang web quản trị qua ",e.jsx("strong",{children:"HTTP"})," hoặc click nút ",e.jsx("strong",{children:"🌐 Mở trực tiếp LAN"})," phía trên để truy cập trong tab mới."]}),te&&e.jsxs("div",{style:{color:"#60a5fa",background:"rgba(96, 165, 250, 0.08)",border:"1px solid rgba(96, 165, 250, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["💡 ",e.jsx("strong",{children:"Chế độ trực tiếp LAN:"})," Thiết bị kết nối trực tiếp đến IP máy in qua mạng Wifi nội bộ.",e.jsxs("ul",{style:{margin:"4px 0 0 16px",padding:0},children:[e.jsx("li",{children:"Thanh địa chỉ và Lịch sử duyệt sẽ không tự động cập nhật."}),e.jsx("li",{children:"Chức năng thu phóng (Ngang/Dọc) trong iframe không áp dụng (vui lòng zoom bằng thao tác vuốt)."})]})]}),!te&&e.jsxs("div",{style:{color:"var(--color-text-secondary)",background:"rgba(255, 255, 255, 0.02)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:[e.jsx("strong",{style:{color:"var(--color-primary)"},children:"🛠️ Nhật ký & Thông số kết nối ngược (SSH Reverse Tunnel):"}),e.jsxs("div",{style:{marginTop:"6px",fontFamily:"monospace",display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy khách (Agent Uid):"})," ",r.agentUid]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Địa chỉ IP Máy in:"})," ",r.ip]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng dịch vụ máy in:"})," 80"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy chủ VPS:"})," 31.97.76.62"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng kết nối trên VPS (Assigned Port):"})," ",r.url?r.url.split(":").pop():"Đang cấp phát..."]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Phương thức xác thực:"})," SSH Key pair (Root User)"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Đường dẫn kết nối:"})," ",e.jsx("span",{style:{color:"var(--color-text)"},children:r.url||"N/A"})]}),r.url&&e.jsxs("div",{style:{color:"#fbbf24",marginTop:"4px"},children:["⚠️ Nếu Iframe hiển thị màn hình trắng / lỗi kết nối, có thể do trình duyệt chặn nội dung Mixed Content (HTTP trên trang HTTPS). Hãy click nút ",e.jsx("strong",{children:"🔗 Mở tab mới ↗"})," ở thanh điều khiển phía dưới để xem trực tiếp."]})]})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 12px"},children:[e.jsx("button",{onClick:V,disabled:He<=0,style:{background:"none",border:"none",color:He<=0?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:He<=0?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Back",children:"◀"}),e.jsx("button",{onClick:H,disabled:He>=qe.length-1,style:{background:"none",border:"none",color:He>=qe.length-1?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:He>=qe.length-1?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Forward",children:"▶"}),e.jsx("button",{onClick:()=>K(r.ip,r.path),style:{background:"none",border:"none",color:"var(--color-text)",cursor:"pointer",padding:"4px",fontSize:"0.8rem",display:"flex",alignItems:"center"},title:"Refresh",children:"🔄"}),e.jsxs("div",{style:{flex:1,background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontFamily:"monospace",color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:["http://",r.ip,r.path||"/"]}),r.url&&e.jsx("a",{href:r.url,target:"_blank",rel:"noreferrer",style:{background:"var(--color-primary)",color:"white",border:"none",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",marginLeft:"8px"},title:"Mở trang quản trị Web Image Monitor trong tab mới",children:"🔗 Mở tab mới ↗"})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid var(--color-surface-light)",gap:"15px",paddingBottom:"4px"},children:[e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:i==="iframe"?600:500,color:i==="iframe"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:i==="iframe"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>lt("iframe"),children:"🌐 Giao diện máy in"}),e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:i==="html"?600:500,color:i==="html"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:i==="html"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>lt("html"),children:"📄 Xem mã HTML (Text)"})]}),i==="html"?e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px",flex:1,minHeight:0},children:te?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"10px",color:"var(--color-text-secondary)",fontSize:"0.76rem",padding:"20px",textAlign:"center"},children:[e.jsx("span",{children:"📄 Chế độ trực tiếp LAN không tải mã nguồn về server."}),e.jsxs("span",{style:{fontSize:"0.70rem",color:"rgba(255,255,255,0.4)"},children:["Hãy chuyển sang chế độ ",e.jsx("strong",{children:"Qua Agent (Từ xa)"})," để phân tích và xem mã nguồn HTML của máy in."]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Mã nguồn HTML gốc từ máy in:"}),e.jsx("button",{style:{border:"none",background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",padding:"4px 10px",borderRadius:"6px",fontSize:"0.72rem",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"},onClick:()=>{navigator.clipboard.writeText(r.html),Ke("Đã copy mã HTML vào clipboard","success")},children:"📋 Copy HTML"})]}),e.jsx("pre",{style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.5,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)"},children:r.html})]})}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↔️ Ngang:"}),e.jsx("button",{onClick:()=>{const c=Math.max(.3,parseFloat((Pe-.05).toFixed(2)));ht(c),ve&&ze(c)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:Pe,onChange:c=>{const _=parseFloat(c.target.value);ht(_),ve&&ze(_)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsx("button",{onClick:()=>{const c=Math.min(2,parseFloat((Pe+.05).toFixed(2)));ht(c),ve&&ze(c)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:"var(--color-text)"},children:[Math.round(Pe*100),"%"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↕️ Dọc:"}),e.jsx("button",{onClick:()=>{const c=Math.max(.3,parseFloat((ot-.05).toFixed(2)));ze(c),ve&&ht(c)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ve,children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:ot,onChange:c=>{const _=parseFloat(c.target.value);ze(_),ve&&ht(_)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)",opacity:ve?.5:1},disabled:ve}),e.jsx("button",{onClick:()=>{const c=Math.min(2,parseFloat((ot+.05).toFixed(2)));ze(c),ve&&ht(c)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ve,children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:ve?"var(--color-text-secondary)":"var(--color-text)"},children:[Math.round(ot*100),"%"]})]}),e.jsx("button",{onClick:()=>{zr(!ve),ve||ze(Pe)},style:{background:ve?"rgba(124, 106, 247, 0.15)":"var(--color-background)",border:ve?"1px solid var(--color-accent, #7c6af7)":"1px solid var(--color-surface-light)",color:ve?"var(--color-accent, #7c6af7)":"var(--color-text-secondary)",padding:"4px 10px",borderRadius:"6px",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",transition:"all 0.2s ease"},title:ve?"Bỏ liên kết tỷ lệ":"Liên kết tỷ lệ Ngang & Dọc",children:ve?"🔗 Đồng bộ":"🔓 Tự do"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("button",{onClick:()=>{ht(.95),ze(.95)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"Mặc định"}),e.jsx("button",{onClick:()=>{ht(1),ze(1)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"100%"}),e.jsx("button",{onClick:()=>{var c;try{const _=rr.current;if(!_)return;const x=_.contentDocument||((c=_.contentWindow)==null?void 0:c.document);if(x&&x.body){const M=x.body.style.width,A=x.body.style.transform;x.body.style.transform="none",x.body.style.width="auto";const $e=x.body.scrollWidth||x.documentElement.scrollWidth||1024,tt=_.clientWidth||800;if(x.body.style.width=M,x.body.style.transform=A,$e>0&&tt>0){let Be=tt/$e;Be=Math.max(.3,Math.min(1.5,Be)),Be=Math.round(Be*20)/20,ht(Be),ve&&ze(Be)}}}catch(_){console.error(_)}},style:{background:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)",color:"#10b981",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:600},children:"📐 Vừa khung"})]})]}),e.jsxs("div",{style:{flex:1,minHeight:0,background:"white",borderRadius:"8px",overflow:"hidden",border:"1px solid var(--color-surface-light)",position:"relative"},children:[e.jsx("iframe",{ref:rr,src:r.url?r.url:te?`http://${r.ip}${r.path||"/"}`:tr,style:{width:"100%",height:"100%",border:"none",background:"white"}}),yr&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang đợi phản hồi từ Agent..."})]})]})]})]})}),e.jsxs("div",{style:{...n.modalFooter,marginTop:"15px",flexShrink:0,borderTop:"1px solid var(--color-surface-light)",paddingTop:"12px"},children:[r.html!=="LOADING"&&!r.html.startsWith("ERROR:")&&e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const c=new Blob([r.html],{type:"text/html;charset=utf-8"}),_=URL.createObjectURL(c);window.open(_,"_blank")},children:"↗️ Xem mã HTML gốc"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)",marginLeft:"8px"},onClick:()=>Kr(c=>c?{...c,isOpen:!1}:null),children:"Đóng"})]})]})})()]})}),e.jsx(wt,{children:Re.isOpen&&e.jsx(st.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>mr(t=>({...t,isOpen:!1})),children:e.jsxs(st.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[Re.copierName," · MAC: ",Re.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>mr(t=>({...t,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:Re.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(Re.jsonData,null,2)),Ke("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(Re.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>mr(t=>({...t,isOpen:!1})),children:"Đóng"})})]})})})]})}const ct="https://agentapi.quanlymay.com",Jn=(a={})=>{const{...k}=a,[j,v]=d.useState([]),[Z,X]=d.useState(()=>localStorage.getItem("goxprint_selected_lan_uid")||""),[ye,ae]=d.useState(!1),[pe,ke]=d.useState(""),[f,me]=d.useState(()=>{const r=localStorage.getItem("goxprint_active_tab");return r==="agents"||r==="copiers"||r==="cameras"?r:"agents"}),[oe,F]=d.useState({}),[ge,he]=d.useState(()=>{try{const r=localStorage.getItem("goxprint_expanded_printers");return r?JSON.parse(r):{}}catch{return{}}}),[Xe,G]=d.useState({}),[C,we]=d.useState({}),[te,Me]=d.useState({}),[dt,Ve]=d.useState({}),[pt,fe]=d.useState({}),[_e,le]=d.useState(()=>{try{const r=sessionStorage.getItem("gox_live_address_books");return r?JSON.parse(r):window._liveAddressBooksCache||{}}catch{return window._liveAddressBooksCache||{}}}),xe=d.useCallback(r=>{le(i=>{const s=typeof r=="function"?r(i):r;try{window._liveAddressBooksCache=s,sessionStorage.setItem("gox_live_address_books",JSON.stringify(s))}catch{}return s})},[]),[Ee,K]=d.useState([]),[Qe,Je]=d.useState(!1),[Ge,Te]=d.useState(null),[Ct,$]=d.useState({id:null,camera_name:"Camera mới",rtsp_url:"",segment_duration:60,prefix:"rec",video_codec:"copy",audio_codec:"copy",no_audio:!0}),[Dt,mt]=d.useState(null),[xt,ut]=d.useState([]),[gt,yt]=d.useState([]),[Bt,w]=d.useState(null),[I,z]=d.useState(!1),[Q,W]=d.useState(""),[V,H]=d.useState(10),[h,E]=d.useState(""),[ce,U]=d.useState(!1),[y,J]=d.useState(!1),[T,be]=d.useState(null),[ue,Fe]=d.useState(!1),[Ae,Ye]=d.useState(30),[O,Ue]=d.useState(30);d.useEffect(()=>{ce||be(null)},[ce]),d.useEffect(()=>{window.fnGetCookie=r=>"",window.fnSetCookie=(r,i)=>{},window.fnGetLocalestring=r=>"",window.fnGetHelp=r=>{}},[]);const[Ce,Se]=d.useState([]),[N,B]=d.useState(null),[S,at]=d.useState(null),[re,kt]=d.useState(null),[Gt,vr]=d.useState(null),[ve,zt]=d.useState(null),[wr,tr]=d.useState(""),[rr,nr]=d.useState(!1),[Y,At]=d.useState(null),[ir,sr]=d.useState(!1),[Ht,Tr]=d.useState(()=>localStorage.getItem("goxprint_direct_lan")==="true");d.useEffect(()=>{localStorage.setItem("goxprint_direct_lan",String(Ht))},[Ht]);const Cr=r=>{const i=(r||"").toLowerCase();return i.includes("ricoh")||i.includes("savin")||i.includes("aficio")||i.includes("gestetner")||i.includes("lanier")||i.includes("infotec")||i.includes("mp ")||i.startsWith("mp")||i.includes("im ")||i.startsWith("im")||i.includes("pro ")||i.startsWith("pro")?"ricoh":i.includes("toshiba")?"toshiba":i.includes("xerox")||i.includes("fujifilm")||i.includes("apeos")||i.includes("workcentre")||i.includes("versalink")||i.includes("altalink")?"xerox":"other"},[Mr,Ze]=d.useState("iframe"),[Fr,Ur]=d.useState(()=>window.innerWidth>=768),[Ot,Pe]=d.useState([]),[ot,jt]=d.useState(-1),[$t,Re]=d.useState(""),[It,ar]=d.useState(.95),[Le,Mt]=d.useState(.95),[Et,bt]=d.useState(!0),Wt=d.useRef(null),de=d.useRef(null),Vt=d.useRef({}),[kr,Ar]=d.useState(null),[jr,je]=d.useState({isOpen:!1,title:"",message:"",onConfirm:()=>{}}),[Ne,or]=d.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[Tt,Yr]=d.useState({isOpen:!1,printerId:"",brand:"",model:"",driverName:"",driverUrl:"",selectedAgentUids:[]}),[Zr,Ir]=d.useState({isOpen:!1,title:"🌐 Đổi địa chỉ IP tĩnh",hint:"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.",value:"",changeAllTo:"",scanStatus:"",error:"",onConfirm:()=>{}}),[Jt,en]=d.useState({lanUid:"",email:""}),[tn,Er]=d.useState([]),[Kt,rn]=d.useState(!1),[qt,Br]=d.useState({printerId:"",name:"",email:"",agentUid:""}),[nn,Xt]=d.useState(!1),[Gr,sn]=d.useState({lanUid:"",agentUid:"",email:""}),[Pr,St]=d.useState(!1),[rt]=d.useState({regNo:"",name:"",details:null}),[an,Qt]=d.useState({isOpen:!1,copierName:"",macId:"",loading:!1,jsonData:null}),on=async r=>{const i=!!(r.agent_uid&&!r.mac_id&&!r.mac_address),s=(r.mac_id||r.mac_address||"").replace(/-/g,":").toUpperCase(),o=r.agent_uid||r.agentUid||"";Qt({isOpen:!0,copierName:r.hostname?`Máy tính: ${r.hostname}`:r.printer_name||r.name||"Máy Photocopy",macId:s||o,loading:!0,jsonData:null});try{const l=i?`${ct}/api/lan-sites/scan-points?agent_uid=${encodeURIComponent(o)}`:`${ct}/api/lan-sites/scan-points?mac_id=${encodeURIComponent(s)}`,p=await(await fetch(l)).json();p.ok&&p.scan_points?Qt(u=>({...u,loading:!1,jsonData:i?p.scan_points:p.scan_points[s]&&Object.keys(p.scan_points[s]).length>0?p.scan_points[s]:Object.keys(p.scan_points).length>0?p.scan_points:r.address_book_sync||{}})):Qt(u=>({...u,loading:!1,jsonData:r.address_book_sync||{message:"Không tìm thấy dữ liệu scan_points.json trên VPS"}}))}catch{Qt(m=>({...m,loading:!1,jsonData:r.address_book_sync||{error:"Lỗi kết nối VPS"}}))}},[lr]=d.useState(()=>localStorage.getItem("goxprint_last_viewed_copier_id")||"");d.useEffect(()=>{localStorage.setItem("goxprint_active_tab",f)},[f]),d.useEffect(()=>{localStorage.setItem("goxprint_expanded_printers",JSON.stringify(ge))},[ge]);const D=d.useCallback((r,i="info",s=5e3)=>{const o=Math.random().toString(36).substring(2,9);Se(l=>[...l,{id:o,message:r,type:i}]),s>0&&setTimeout(()=>{Se(l=>l.filter(m=>m.id!==o))},s)},[]),zr=d.useCallback((r,i,s="info")=>{Se(o=>[...o.filter(l=>l.id!==r),{id:r,message:i,type:s}])},[]),Rr=(r,i)=>{if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:"))try{const p=new URL(r);return p.pathname+p.search}catch{return r}if(r.startsWith("/"))return r;const o=i.split("?")[0].split("/");o.pop();const m=o.join("/")+"/"+r;try{const p=new URL(m,"http://localhost");return p.pathname+p.search}catch{return m}},Pt=async(r,i,s="GET",o,l=!1,m,p=80)=>{const u=m||(Y==null?void 0:Y.agentUid);if(!u){console.error("No agent UID available for remote page fetch"),D("Không tìm thấy Target Agent UID","error");return}if(Ht){window.open(`http://${r}:${p}${i||"/"}`,"_blank");return}const g=(R,L)=>`
      <html>
        <head>
          <title>${R}</title>
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
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${R}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${L}</div>
        </body>
      </html>
    `,P=window.open("about:blank","_blank");P&&P.document.write(g("Đang kết nối tên miền...",`Đang kết nối đến máy in ${r} qua tên miền *.app.goxprint.com...`));try{const L=await(await fetch(`${ct}/api/agents/${u}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:r,printer_port:p})})).json();L.ok?P&&L.url&&(P.location.href=L.url):(P&&P.close(),D("Kết nối lỗi: "+(L.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch(R){P&&P.close(),D("Lỗi hệ thống VPS: "+(R.message||R),"error")}},ln=()=>{if(ot>0&&Y){const r=ot-1;jt(r),Pt(Y.ip,Ot[r],"GET",void 0,!0)}},cr=()=>{if(ot<Ot.length-1&&Y){const r=ot+1;jt(r),Pt(Y.ip,Ot[r],"GET",void 0,!0)}},cn=r=>{Tr(r),Y&&(r?(At(i=>i?{...i,html:"DIRECT_LAN"}:null),sr(!1)):Pt(Y.ip,Y.path,"GET",void 0,!1,Y.agentUid))},dn=()=>{Y&&Y.agentUid&&fetch(`${ct}/api/agents/${Y.agentUid}/tunnel/stop`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:Y.ip})}).catch(console.error),At(null),sr(!1),Pe([]),jt(-1)};d.useEffect(()=>{const r=i=>{const s=i.data;if(!(!s||typeof s!="object")&&!(!Y||!Y.ip)){if(s.type==="iframe_navigate"){const o=Rr(s.href,s.currentPath);Pt(Y.ip,o)}else if(s.type==="iframe_submit"){const o=Rr(s.action,s.currentPath);Pt(Y.ip,o,"POST",s.formData)}}};return window.addEventListener("message",r),()=>window.removeEventListener("message",r)},[Y,Ot,ot]),d.useEffect(()=>{if(Y!=null&&Y.html&&Y.html!=="LOADING"&&!Y.html.startsWith("ERROR:")){const r=new Blob([Y.html],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(r);return Re(i),()=>{URL.revokeObjectURL(i)}}else Re("")},[Y==null?void 0:Y.html]),d.useEffect(()=>{const r=()=>{var s;try{const o=Wt.current;if(!o)return;const l=o.contentDocument||((s=o.contentWindow)==null?void 0:s.document);l&&l.body&&(l.documentElement.style.height="auto",l.body.style.height="auto",l.body.style.minHeight="100%",l.body.style.transform=`scale(${It}, ${Le})`,l.body.style.transformOrigin="top left",l.body.style.width=`${100/It}%`,l.body.style.boxSizing="border-box")}catch(o){console.error("Failed to apply scaling:",o)}};r();const i=Wt.current;if(i)return i.addEventListener("load",r),()=>{i.removeEventListener("load",r)}},[$t,It,Le]);const Hr=d.useRef({}),nt=d.useCallback(async(r=!1)=>{r&&ae(!0);try{const i=await In();v(i),Array.isArray(i)&&i.forEach(s=>{const o=s.agents||s.nodes||[];Array.isArray(o)&&o.forEach(l=>{const m=l.agent_uid||l.uid,p=l.local_ip||l.ip;if(m&&p){const u=Hr.current[m];if(u&&u!==p){const g=`⚠️ Máy tính Agent (${m}) vừa thay đổi địa chỉ IP từ ${u} sang ${p}!`;D(g,"warning");const P=`[JOB LOG - IP CHANGE DETECTED] Vì địa chỉ IP máy PC (${m}) đổi từ ${u} sang ${p}, tất cả điểm scan (address_list.folder chứa ${u}) sẽ được tự động cập nhật sang ${p} bằng lệnh ricoh_change_scan / toshiba_change_scan.`;console.log("📌 "+P);try{fetch(`${ct}/api/jobs/log`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"ip_changed",agent_uid:m,old_ip:u,new_ip:p,log_text:P})}).catch(()=>{})}catch{}const R=s.printers||[],L=b=>{if(!b)return"";let t=b.trim();return t.includes("://")&&(t=t.split("://")[1]),t=t.split("/")[0].split(":")[0].trim(),t};R.forEach(b=>{const t=Cr(b.printer_name||b.name||"");if(t!=="ricoh"&&t!=="toshiba"&&t!=="xerox")return;let c=[];b.address_book_data&&Array.isArray(b.address_book_data.address_list)&&(c=b.address_book_data.address_list),c.filter(x=>{if(!x)return!1;const M=x.folder||x.server_host||x.server||"",A=L(M);return String(x.protocol||"").toUpperCase()==="EMAIL"?!1:A===u}).forEach(x=>{const M=t==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",A=x.registration_no||x.id||"",$e=x.name||x.username||x.display_name||"",tt=b.ip||b.printer_ip||"",Be=b.auth_user||b.username,br=b.auth_password||b.password||"";if(!Be){console.warn(`[AUTO TRIGGER] Skip auto trigger change_ftp for printer ${tt}: No auth user credentials configured.`);return}console.log(`🚀 [AUTO TRIGGER ${M.toUpperCase()}] Printer: ${tt}, Target ID: ${A}, Name: ${$e}, IP: ${u} -> ${p}`);const ei={mac_address:(b==null?void 0:b.mac_id)||(b==null?void 0:b.mac_address)||"",printer_ip:tt,printer_type:(b==null?void 0:b.printer_type)||"",auth_user:Be,auth_password:br};Nt(m,M,"",{printer_ip:tt,auth_user:Be,auth_password:br,target_id:A,target_name:$e,old_ip:u,new_ip:p}).then(Sn=>{console.log(`✅ [AUTO TRIGGER ${M.toUpperCase()} SUCCESS]:`,Sn)}).catch(Sn=>{console.error(`❌ [AUTO TRIGGER ${M.toUpperCase()} ERROR]:`,Sn)})})})}Hr.current[m]=p}})}),i&&i.length>0,i.length>0&&X(s=>{if(s&&i.some(p=>p.lan_uid===s))return s;const l=localStorage.getItem("goxprint_selected_lan_uid");return l&&i.some(p=>p.lan_uid===l)?l:(localStorage.setItem("goxprint_selected_lan_uid",i[0].lan_uid),i[0].lan_uid)})}catch(i){console.error(i),D("Không thể kết nối dữ liệu VPS","error")}finally{r&&ae(!1)}},[D]);d.useEffect(()=>{nt(!0);const r=setInterval(()=>{nt(!1)},5e3);return()=>clearInterval(r)},[nt]),d.useEffect(()=>{const r=setInterval(async()=>{try{const i=await fetch(`${ct}/api/agent-ips`,{headers:{"X-API-Token":"change-me"}});if(!i.ok)return;const s=await i.json();if(s&&s.ok&&Array.isArray(s.data))for(const o of s.data){const l=o.agent_uid,m=o.lan_uid,p=o.agent_name||l,u=o.reference_ip,g=o.current_ip;l&&fetch(`${ct}/api/agents/${l}/utility/exec?lead=default`,{method:"POST",headers:{"Content-Type":"application/json","X-API-Token":"change-me"},body:JSON.stringify({command:"get_agent_ip",command_content:"",is_auto:!0})}).catch(()=>{}),u&&g&&g!==u&&(D(`Cảnh báo: Agent [${p}] đã thay đổi IP từ [${u}] sang [${g}]!`,"warning"),fetch(`${ct}/api/agent-ips/save`,{method:"POST",headers:{"Content-Type":"application/json","X-API-Token":"change-me"},body:JSON.stringify({agent_uid:l,lan_uid:m,agent_name:p,ip:g})}).catch(()=>{}))}}catch(i){console.error("Error in 2s IP polling: ",i)}},2e3);return()=>clearInterval(r)},[D]);const pn=d.useCallback(async r=>{if(r){Je(!0);try{const s=await(await fetch(`${ct}/api/agents/${r}/cameras`)).json();s.ok?K(s.cameras||[]):D("Không tải được danh sách camera: "+s.error,"error")}catch(i){D("Lỗi tải camera: "+i.message,"error")}finally{Je(!1)}}},[D]),ne=d.useMemo(()=>j.find(r=>r.lan_uid===Z),[j,Z]),dr=d.useMemo(()=>((ne==null?void 0:ne.agents)||[]).filter(r=>r.is_agent_active),[ne]),$r=d.useMemo(()=>{var r;return pe&&dr.some(s=>s.agent_uid===pe)?pe:((r=dr[0])==null?void 0:r.agent_uid)||""},[pe,dr]),ht=()=>{const r=new Date,i=new Date(r.getTime()-45*1e3),s=i.getFullYear(),o=String(i.getMonth()+1).padStart(2,"0"),l=String(i.getDate()).padStart(2,"0"),m=String(i.getHours()).padStart(2,"0"),p=String(i.getMinutes()).padStart(2,"0"),u=String(i.getSeconds()).padStart(2,"0");return`${s}-${o}-${l} ${m}:${p}:${u}`};d.useEffect(()=>{Te(null),$({id:null,camera_name:"",rtsp_url:"",segment_duration:60,prefix:"rec",video_codec:"copy",audio_codec:"copy",no_audio:!0})},[$r]);const ze=d.useCallback((r,i,s,o,l="Đang thực hiện lệnh...")=>{F(R=>({...R,[i]:{message:l,isPending:!0}}));const m=18e4,p=2e3,u=Date.now();let g=!1;const P=setInterval(async()=>{try{const R=Date.now()-u;if(R>m){clearInterval(P),F(t=>{const c={...t};return delete c[i],c}),o("Lệnh bị quá thời gian (Timeout 180s)");return}const L=await Ut(r),b=Math.round(R/1e3);L.status==="success"?(clearInterval(P),F(t=>{const c={...t};return delete c[i],c}),s(L)):L.status==="failed"||!L.ok?(clearInterval(P),F(t=>{const c={...t};return delete c[i],c}),o(L.error||"Lệnh thực hiện thất bại từ Agent")):L.received_at?(F(t=>({...t,[i]:{message:`⚡ Agent đã nhận - đang thực thi... (${b}s)`,isPending:!0}})),g||(g=!0,D("Agent đã nhận lệnh và đang truy cập máy photocopy...","info",3e3))):F(t=>({...t,[i]:{message:`⌛ Đang gửi lệnh tới agent... (${b}s)`,isPending:!0}}))}catch(R){clearInterval(P),F(L=>{const b={...L};return delete b[i],b}),o(R.message||"Lệnh thực hiện thất bại từ Agent")}},p)},[D]),Wr=d.useCallback(r=>{if(!r)return;const i=r.lan_uid,s=Date.now();if(!Vt.current[i]||s-Vt.current[i]>180*1e3){Vt.current[i]=s;const o=(r.agents||[]).filter(l=>l.is_agent_active);if(o.length>0){o.sort((m,p)=>{const u=new Date(m.last_seen||m.updated_at||m.last_ping||0).getTime();return new Date(p.last_seen||p.updated_at||p.last_ping||0).getTime()-u});const l=o[0];if(l){D(`⏳ Agent (${l.agent_uid}) đang thực hiện quét ngầm mạng LAN...`,"info",6e3);const m=l,u={command:"force_subnet_scan",command_content:`def force_scan():
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
            open_ports = []
            for port in PORTS_TO_CHECK:
                try:
                    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                        s.settimeout(0.5)
                        if s.connect_ex((ip, port)) == 0: open_ports.append(port)
                except Exception: pass
            
            mac = arp_map.get(ip, "")
            if not open_ports:
                if not mac: return
                if detect_brand("", mac) == "unknown": return

            model_name = ""
            if 80 in open_ports or 443 in open_ports:
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
                        else:
                            # Advanced scraping
                            title = ""
                            m_title = re.search(r'<title>(.*?)</title>', body, re.IGNORECASE | re.DOTALL)
                            if m_title:
                                title = m_title.group(1).strip()
                                title = re.sub(r's+', ' ', title)
                            
                            if not title or title.lower() in ['ews', 'embedded web server', 'document', 'hp']:
                                if re.search(r'CasaOS', body, re.IGNORECASE):
                                    title = 'CasaOS'
                                if not title or title.lower() in ['ews', 'embedded web server', 'document', 'hp']:
                                    m_hp1 = re.search(r'<div[^>]*id="banner-section-title"[^>]*>.*?<h1[^>]*>(.*?)</h1>', body, re.IGNORECASE | re.DOTALL)
                                    if m_hp1: title = m_hp1.group(1).strip()
                                if not title or title.lower() in ['ews', 'embedded web server', 'document', 'hp']:
                                    m_hp2 = re.search(r'<td[^>]*class="mastheadTitle"[^>]*>(.*?)</td>', body, re.IGNORECASE | re.DOTALL)
                                    if m_hp2: title = m_hp2.group(1).strip()
                                if not title or title.lower() in ['ews', 'embedded web server', 'document', 'hp']:
                                    m_efi = re.search(r'<td[^>]*class="name"[^>]*>(.*?)</td>', body, re.IGNORECASE | re.DOTALL)
                                    if m_efi:
                                        title = m_efi.group(1).strip()
                                        if 'fiery' not in title.lower(): title += " (Fiery Controller)"
                            if title and title.lower() not in ['ews', 'embedded web server', 'document', 'hp']:
                                model_name = title
                            elif "hp " in body_low or "laserjet" in body_low:
                                model_name = "HP LaserJet Printer"
                except Exception: pass

            if not mac: return
            
            if not model_name:
                if any(p in open_ports for p in [9100, 515, 631]):
                    model_name = f"Printer ({ip})"
                else:
                    brand = detect_brand("", mac)
                    if brand == "unknown":
                        return
                    else:
                        model_name = f"Printer ({ip})"
            
            brand = detect_brand(model_name, mac)

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
    print(f"[-] LỖI THỰC THI: {err}")`,lead:r.lead};fetch(`${ct}/ui/agents/${m.agent_uid}/utility/exec`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)}).then(g=>g.json()).then(g=>{const P=(g==null?void 0:g.command_id)||(g==null?void 0:g.id);P?ze(Number(P),`scan_lan_${i}`,async R=>{console.log("[DEBUG_LAN_SCAN] pollData received from LAN scan:",R);let L=[];const b=(R==null?void 0:R.result)||(R==null?void 0:R.result_payload)||(R==null?void 0:R.raw);if(Array.isArray(b))L=b;else if(typeof b=="string"){let t=b;if(b.includes("__PRINTERS_JSON_START__"))t=b.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].trim();else{const c=b.match(/\[\s*\{[\s\S]*\}\s*\]|\[\s*\]/);c&&(t=c[0])}try{const c=JSON.parse(t);Array.isArray(c)&&(L=c)}catch{}}L.length>0?(D(`✓ Quét mạng LAN hoàn tất, tìm thấy ${L.length} máy in!`,"success",4e3),v(t=>t.map(c=>c.lan_uid===i?{...c,printers:L.map((_,x)=>({id:_.id||9e4+x,..._}))}:c))):(D("✓ Quét mạng LAN hoàn tất, đang cập nhật danh sách máy photocopy...","success",4e3),await nt(!0))},async R=>{await nt(!0)},"⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN..."):setTimeout(()=>nt(!0),5e3)}).catch(g=>{console.error(g),setTimeout(()=>nt(!0),5e3)})}}}},[D,ze,nt]),pr=d.useCallback(r=>{var m;const i=Number(r),s=(m=ne==null?void 0:ne.printers)==null?void 0:m.find(p=>Number(p.id)===i);if(!s||!ne)return"";const o=(ne.agents||[]).filter(p=>p.is_agent_active),l=pt[i];return l&&o.some(u=>u.agent_uid===l)?l:s.agent_uid&&o.some(u=>u.agent_uid===s.agent_uid)?s.agent_uid:o.length>0?o[0].agent_uid:s.agent_uid||""},[ne,pt]),[mr,Lr]=d.useState({});d.useEffect(()=>{if(!ne||!ne.emails){Lr({});return}let r=!0;return(async()=>{const s={},o=ne.emails.filter(l=>l.email_type==="private");await Promise.all(o.map(async l=>{try{const m=await kn(ne.lan_uid,l.email);r&&(m.ok&&Array.isArray(m.rows)?s[l.email]=m.rows.length:s[l.email]=0)}catch(m){console.error(`Failed to fetch scan files count for ${l.email}`,m),r&&(s[l.email]=0)}})),r&&Lr(s)})(),()=>{r=!1}},[ne]);const[mn,Yt]=d.useState(!0),[un,Rt]=d.useState(!0),[gn,ur]=d.useState(!1),[hn,Ie]=d.useState(null),[fn,ee]=d.useState(null),[gr,Vr]=d.useState([]),[Lt,Nr]=d.useState(!1),[_n,xn]=d.useState(""),[De,it]=d.useState({isOpen:!1,title:"",content:""}),[Zt,Jr]=d.useState("");d.useEffect(()=>{De.isOpen&&de.current&&(de.current.scrollTop=de.current.scrollHeight)},[De.isOpen,De.content,Zt]);const[yn,Ft]=d.useState(!1),[Kr,lt]=d.useState(null),vt=async()=>{if(!S)return;try{JSON.parse(Zt)}catch(s){lt(`❌ Lỗi định dạng JSON: ${s.message}`);return}Ft(!0),lt("⌛ Đang gửi cấu hình mới tới Agent...");const i=`import os, sys, json, base64
new_content = base64.b64decode("${btoa(unescape(encodeURIComponent(Zt)))}").decode("utf-8")
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
`;try{const s=await Nt(S.agent_uid,"save_settings_json",i);if(!s.ok||!s.command_id)throw new Error(s.error||"Không thể tạo lệnh tiện ích");const o=s.command_id,l=6e4,m=Date.now(),p=setInterval(async()=>{try{if(Date.now()-m>l){clearInterval(p),lt("❌ Lưu thất bại: Hết thời gian chờ (60s)"),Ft(!1);return}const g=await Ut(o);g.status==="success"?(clearInterval(p),lt("✔️ Đã lưu cấu hình và tự động reload thành công!"),Ft(!1),it(P=>({...P,content:Zt})),setTimeout(()=>lt(null),3e3)):(g.status==="failed"||!g.ok)&&(clearInterval(p),lt(`❌ Lỗi từ máy trạm: ${g.error||"Lưu thất bại"}`),Ft(!1))}catch(u){console.error("Poll error:",u)}},1e3)}catch(s){lt(`❌ Lỗi kết nối: ${s.message}`),Ft(!1)}},er=r=>{try{let i=r;for(;typeof i=="string";){const s=i.trim();if(s.startsWith("{")&&s.endsWith("}")||s.startsWith("[")&&s.endsWith("]")||s.startsWith('"')&&s.endsWith('"'))i=JSON.parse(i);else break}return typeof i=="object"&&i!==null?JSON.stringify(i,null,2):(typeof i=="string"&&(i=i.replace(/\\n/g,`
`).replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")),String(i))}catch{return r}};d.useEffect(()=>{De.isOpen&&De.title.includes("settings.json")&&(Jr(er(De.content)),lt(null))},[De.isOpen,De.title,De.content]);const hr=async(r,i,s)=>{try{const o=await Fn(void 0,void 0,r);if(o.ok&&o.jobs){const l=o.jobs.filter(m=>m.status==="pending");for(const m of l)if(m.command_type===i)try{const p=JSON.parse(m.command_params);let u=!0;for(const g of Object.keys(s))if(p[g]!==s[g]){u=!1;break}if(u)return!0}catch{if(m.command_params===JSON.stringify(s))return!0}}}catch(o){console.error("Failed to check duplicate pending jobs",o)}return!1},Ke=new Set(["view_settings_json","view_stout","view_sterror","get_public_ip","check_watchdog","open_web_setting"]),Dr={view_settings_json:"⚙️ settings.json",view_stout:"📄 stout.txt — 100 dòng gần nhất",view_sterror:"🔴 sterror.txt — 100 dòng gần nhất",get_public_ip:"🌍 IP Public",check_watchdog:"🩺 Check Watchdog",open_web_setting:"🌐 Web setting"},fr=d.useCallback(async r=>{var i,s;if(r){ur(!0),ee(null);try{const o=await Mn(r.agent_uid);if(o.ok)Yt(!!o.scan_auto_open_file),Rt(!!o.scan_auto_open_dir);else throw new Error(o.error||"Agent không tồn tại trên VPS")}catch(o){console.error("Failed to load agent settings:",o);const l=(i=o.message)!=null&&i.includes("Agent not found")||(s=o.message)!=null&&s.includes("404")?"Agent này chưa được đăng ký trên VPS backend. Vui lòng đảm bảo agent đang chạy và đã kết nối.":`Không thể tải cài đặt từ VPS: ${o.message}`;ee({text:l,isError:!0}),Yt(!0),Rt(!0)}finally{ur(!1)}}},[]),_r=d.useCallback(async(r,i)=>{if(!S)return;const s=!i;r==="scan_auto_open_file"?Yt(s):Rt(s);try{const o=await Un(S.agent_uid,{[r]:s});if(!o.ok)throw new Error(o.error||"Failed to update setting");ee({text:"Đã cập nhật cài đặt thành công.",isError:!1})}catch(o){console.error("Failed to update agent setting:",o),r==="scan_auto_open_file"?Yt(i):Rt(i),ee({text:`Lỗi cập nhật cài đặt: ${o.message}`,isError:!0})}},[S]),bn=d.useCallback(async(r,i)=>{if(!S)return;const s=r==="printers"?"devices_and_printers":r==="scan"?"open_scan_folder":r==="change_ip"?"change_ip":r==="run_command"?"run_command":"dxdiag";if(await hr(S.agent_uid,"trigger_utility",{action:s,...i||{}})){D("Lệnh tiện ích này đang chờ phản hồi từ Agent!","info");return}Ie(r),ee({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const l=await Bn(S.agent_uid,s,i);if(!l.ok||!l.command_id)throw new Error(l.error||"Không thể tạo lệnh tiện ích");const m=l.command_id,p=6e4,u=1e3,g=Date.now(),P=setInterval(async()=>{try{const R=Date.now()-g;if(R>p){clearInterval(P),ee({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Ie(null);return}const L=await Ut(m);if(L.status==="success")clearInterval(P),ee({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),Ie(null);else if(L.status==="failed"||!L.ok)clearInterval(P),ee({text:`❌ Thất bại: ${L.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Ie(null);else{const b=Math.round(R/1e3);L.received_at?ee({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${b}s)`,isError:!1}):ee({text:`⌛ Đang chuyển lệnh tới Agent... (${b}s)`,isError:!1})}}catch(R){console.error("Error polling utility status:",R)}},u)}catch(l){console.error(`Failed to trigger ${r}:`,l),ee({text:`Lỗi kết nối hoặc gửi lệnh: ${l.message}`,isError:!0}),Ie(null)}},[S]),ft=d.useCallback(async(r,i)=>{if(!S)return;if(await hr(S.agent_uid,"trigger_utility",{action:"exec_utility",command:r})){D("Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!","info");return}const o=gr.find(u=>u.command===r),l=(o==null?void 0:o.output_modal)||Ke.has(r),m=(o==null?void 0:o.label)||Dr[r]||r;let p=i;if(r==="change_agent_ip"||r==="check_scan_ip_match"){const u=r==="change_agent_ip",g=(S==null?void 0:S.local_ip)||(S==null?void 0:S.ip)||(S==null?void 0:S.agent_ip)||(S==null?void 0:S.localIp)||"";if(Ir({isOpen:!0,title:u?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:u?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:g,changeAllTo:"",scanStatus:u?"⏳ Loading... Đang quét điểm scan FTP trên máy photo...":"",error:"",onConfirm:(P,R)=>{const L=i.replace("__TARGET_IP__",P);Ie(r),ee({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),Nt(S.agent_uid,r,L,{target_ip:P,ip:P,printer_ip:P,change_all_to:R||""}).then(b=>{if(!b.ok||!b.command_id)throw new Error(b.error||"Không thể tạo lệnh tiện ích");const t=b.command_id,c=6e4,_=Date.now(),x=setInterval(async()=>{try{const M=Date.now()-_;if(M>c){clearInterval(x),ee({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Ie(null);return}const A=await Ut(t);if(A.status==="success")clearInterval(x),l?(it({isOpen:!0,title:m,content:typeof A.result_payload=="object"&&A.result_payload?JSON.stringify(A.result_payload,null,2):A.result_payload||A.error||A.result||"(không có nội dung)"}),ee(null)):ee({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),Ie(null);else if(A.status==="failed"||!A.ok)clearInterval(x),l?(it({isOpen:!0,title:m,content:A.error||(typeof A.result_payload=="object"&&A.result_payload?JSON.stringify(A.result_payload,null,2):A.result_payload||A.result||"(không có nội dung)")}),ee(null)):ee({text:`❌ Thất bại: ${A.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Ie(null);else{const $e=Math.round(M/1e3);ee({text:`⌛ Đang xử lý... (${$e}s)`,isError:!1})}}catch(M){console.error("Poll error:",M)}},1e3)}).catch(b=>{ee({text:`Lỗi: ${b.message}`,isError:!0}),Ie(null)})}}),u&&g){const P=gr.find(R=>R.command==="check_scan_ip_match");if(P&&P.command_content){const R=P.command_content.replace("__TARGET_IP__",g);Nt(S.agent_uid,"check_scan_ip_match",R,{target_ip:g,ip:g,printer_ip:g}).then(L=>{if(L.ok&&L.command_id){const b=Date.now(),t=setInterval(async()=>{if(Date.now()-b>4e4){clearInterval(t);return}try{const _=await Ut(L.command_id);if(_.status==="success"||_.status==="failed"){clearInterval(t);const x=_.result_payload||_.result||_.error||"";Ir(M=>({...M,scanStatus:x?`🔍 ${x}`:""}))}}catch{}},1500)}}).catch(()=>{})}}return}if(p.includes("__TARGET_IP__")){D("Lệnh này yêu cầu địa chỉ IP (__TARGET_IP__). Vui lòng nạp IP vào script thủ công hoặc gửi từ chức năng của thiết bị.","error"),setUtilityStatus({loading:!1,result:"Lỗi: Thiếu địa chỉ IP"});return}if(p.includes("__TARGET_USER__")){D("Lệnh này yêu cầu tài khoản (__TARGET_USER__). Vui lòng nạp tài khoản vào script thủ công hoặc gửi từ chức năng của thiết bị.","error"),setUtilityStatus({loading:!1,result:"Lỗi: Thiếu tài khoản"});return}if(p.includes("__TARGET_PASS__")){D("Lệnh này yêu cầu mật khẩu (__TARGET_PASS__). Vui lòng nạp mật khẩu vào script thủ công hoặc gửi từ chức năng của thiết bị.","error"),setUtilityStatus({loading:!1,result:"Lỗi: Thiếu mật khẩu"});return}if(p.includes("__TARGET_ID__")&&(p=p.replace(/__TARGET_ID__/g,"001")),p.includes("__TARGET_SCAN_USER__")){D("Lệnh này yêu cầu tên điểm scan (__TARGET_SCAN_USER__). Vui lòng nạp tên vào script thủ công hoặc gửi từ chức năng Tạo điểm scan của thiết bị.","error"),setUtilityStatus({loading:!1,result:"Lỗi: Thiếu tên điểm scan"});return}r.includes("toshiba")&&(p=p.replace(/timeout=\d+/g,"timeout=25")),Ie(r),ee({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const u=await Nt(S.agent_uid,r,p);if(!u.ok||!u.command_id)throw new Error(u.error||"Không thể tạo lệnh tiện ích");const g=u.command_id,P=6e4,R=Date.now(),L=setInterval(async()=>{try{const b=Date.now()-R;if(b>P){clearInterval(L),ee({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Ie(null);return}const t=await Ut(g);if(t.status==="success")clearInterval(L),l?(it({isOpen:!0,title:m,content:typeof t.result_payload=="object"&&t.result_payload?JSON.stringify(t.result_payload,null,2):t.result_payload||t.error||t.result||"(không có nội dung)"}),ee(null)):ee({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),Ie(null);else if(t.status==="failed"||!t.ok)clearInterval(L),l?(it({isOpen:!0,title:m,content:t.error||(typeof t.result_payload=="object"&&t.result_payload?JSON.stringify(t.result_payload,null,2):t.result_payload||t.result||"(không có nội dung)")}),ee(null)):ee({text:`❌ Thất bại: ${t.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Ie(null);else{const c=Math.round(b/1e3),_=t.progress_text||`Đang xử lý... (${c}s)`;ee({text:`⌛ ${_}`,isError:!1})}}catch(b){const t=(b==null?void 0:b.message)||String(b||"");l&&(t.startsWith("[PATH]")||t.includes("stout")||t.includes("sterror")||t.includes("settings.json"))?(clearInterval(L),it({isOpen:!0,title:m,content:t}),ee(null),Ie(null)):console.error("Poll error:",b)}},1e3)}catch(u){ee({text:`Lỗi: ${u.message}`,isError:!0}),Ie(null)}},[S,gr]),q=d.useCallback(async()=>{if(!S)return;if(await hr(S.agent_uid,"emergency_restart",{action:"emergency_restart"})){D("Yêu cầu khởi động lại Agent đang chờ phản hồi từ Agent!","info");return}je({isOpen:!0,title:"🚨 Kích hoạt Khởi động khẩn cấp",message:"Lệnh này sẽ đánh dấu yêu cầu thoát khẩn cấp cho Agent này trên server. File watchdog.bat (nếu có trên máy client) sẽ tự động phát hiện và ép đóng printagent.exe rồi mở lại. Việc này giúp thoát khỏi tình trạng treo update. Bạn có chắc chắn muốn thực hiện?",onConfirm:async()=>{Ie("emergency_restart"),ee({text:"⌛ Đang đăng ký cờ khởi động lại khẩn cấp...",isError:!1});try{const i=await Gn(S.agent_uid);if(!i.ok)throw new Error(i.error||"Thất bại");ee({text:"⚡ Đã lưu cờ tắt khẩn cấp trên Server. Chờ Watchdog quét...",isError:!1})}catch(i){ee({text:`❌ Lỗi: ${i.message}`,isError:!0})}finally{Ie(null)}}})},[S]);d.useEffect(()=>{N==="utilities"&&S&&(fr(S),Nr(!0),wn(S.agent_uid).then(r=>{r!=null&&r.ok&&Array.isArray(r.commands)&&Vr(r.commands)}).catch(r=>console.error("Failed to load utility commands:",r)).finally(()=>Nr(!1)))},[N,S,fr]);const xr=d.useMemo(()=>{if(!ne)return[];const r=(ne.printers||[]).filter(i=>{const s=(i.printer_name||"").toLowerCase().trim();return!(s.includes("unknown")||s==="unknown printer"||s.includes("pdf")||s.includes("fax")||s.includes("brother")||s.includes("canon lbp")||s.includes("rustdesk")||i.probed&&!i.is_online)});return lr?[...r].sort((i,s)=>{const o=String(i.id)===lr,l=String(s.id)===lr;return o&&!l?-1:!o&&l?1:0}):r},[ne,lr]),qr=r=>{localStorage.setItem("goxprint_last_viewed_copier_id",r)};d.useEffect(()=>{if(ne){const r={};ne.printers.forEach(i=>{const s=(ne.agents||[]).filter(l=>l.is_agent_active),o=s.find(l=>l.agent_uid===i.agent_uid)||s[0];r[i.id]=o?o.agent_uid:i.agent_uid||""}),fe(i=>({...r,...i})),Me(i=>{const s={...i};return ne.printers.forEach(o=>{const l=o.auth_user||o.user||"",m=o.auth_password||o.password||"",p=(()=>{try{const R=localStorage.getItem(`copier_auth_${o.id}`)||(o.mac_id?localStorage.getItem(`copier_auth_${o.mac_id}`):null);return R?JSON.parse(R):null}catch{return null}})(),u=s[o.id],g=(u==null?void 0:u.user)!==void 0?u.user:l!==""?l:(p==null?void 0:p.user)!==void 0?p.user:"",P=(u==null?void 0:u.pass)!==void 0?u.pass:m!==""?m:(p==null?void 0:p.pass)!==void 0?p.pass:"";s[o.id]={user:g,pass:P}}),s})}},[ne]);const Xr=async r=>{const i=String(typeof r=="object"?r.id:r),s=typeof r=="object"?r.mac_id||r.mac_address||"":i,o=typeof r=="object"&&(r.printer_type||r.type)||"",l=te[i]||{user:"",pass:""};try{localStorage.setItem(`copier_auth_${i}`,JSON.stringify(l)),s&&localStorage.setItem(`copier_auth_${s}`,JSON.stringify(l))}catch{}Ve(m=>({...m,[i]:!0}));try{const m=await En(s||i,l.user,l.pass,s,o);if(m.ok){const p=m.command_id||m.id;p?(D("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),ze(p,i,u=>{const g=u!=null&&u.error?` (${u.error})`:u!=null&&u.result?` (${u.result})`:"";D(`Đã test đăng nhập thành công và lưu vào database!${g}`,"success",5e3),v(P=>P.map(R=>({...R,printers:R.printers.map(L=>String(L.id)===String(i)||s&&L.mac_id===s?{...L,auth_user:l.user,auth_password:l.pass}:L)}))),Ve(P=>({...P,[i]:!1}))},u=>{D(`Lỗi Agent lưu Auth: ${u}`,"error"),Ve(g=>({...g,[i]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(D("Đã lưu tài khoản Web UI máy photocopy thành công","success"),v(u=>u.map(g=>({...g,printers:g.printers.map(P=>String(P.id)===String(i)||s&&P.mac_id===s?{...P,auth_user:l.user,auth_password:l.pass}:P)}))),Ve(u=>({...u,[i]:!1})))}else throw new Error(m.error||"Lưu thất bại")}catch(m){D(`Lỗi lưu Auth: ${m.message}`,"error"),Ve(p=>({...p,[i]:!1}))}},ie=async(r,i,s,o,l)=>{try{const p=await(await fetch(`${ct}/api/scan-points/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:r,address_book_data:i,printer_name:s||"Photocopy",ip:o||"",agent_uid:l||""})})).json();console.log("Saved scan point to DB:",p)}catch(m){console.error("Failed to save scan point to DB:",m)}},et=async r=>{var g,P,R,L,b;const i=(j||[]).flatMap(t=>t.printers||[]),s=typeof r=="object"&&r!==null?r:i.find(t=>String(t.id)===String(r)||t.mac_id===r||t.mac_address===r||t.ip===r)||((g=ne==null?void 0:ne.printers)==null?void 0:g.find(t=>String(t.id)===String(r)||t.mac_id===r||t.mac_address===r||t.ip===r))||{},o=String(s.id||(typeof r=="string"?r:"")),l=s.ip||s.printer_ip||(typeof r=="string"&&r.includes(".")?r:""),m=s.mac_address||s.mac_id||(typeof r=="string"&&r.includes(":")?r:o);if(!l){D("Thiếu thông tin IP máy in hợp lệ. Vui lòng chọn máy in cụ thể.","error");return}const p=pr(o)||pr(l)||pr(m);D("Bắt đầu gửi yêu cầu đồng bộ danh bạ máy in...","info",3e3);const u=m?String(m).toUpperCase().replace(/-/g,":"):"";u&&xe(t=>({...t,[u]:{status:"loading",address_list:[]}}));try{const t=((P=te[o])==null?void 0:P.user)||((R=te[l])==null?void 0:R.user)||s.auth_user||s.user,c=((L=te[o])==null?void 0:L.pass)||((b=te[l])==null?void 0:b.pass)||s.auth_password||s.password||"";if(!t){D(`Chưa cấu hình tài khoản Web cho máy in ${s.printer_name||s.name||"Photocopy"}!`,"error"),u&&xe(A=>({...A,[u]:{status:"error",address_list:[]}}));return}const _={mac_address:m,printer_ip:l,ip:l,printer_type:(s==null?void 0:s.printer_type)||"",auth_user:t,auth_password:c},M=await Pn(l&&l!=="0.0.0.0"?l:m||o,p||void 0,_);if(!M.ok||!M.command_id)throw new Error(M.error||"Không thể tạo lệnh đồng bộ");ze(M.command_id,o,async A=>{const $e=m?String(m).toUpperCase().replace(/-/g,":"):"";let tt=(A==null?void 0:A.address_book_sync)||(A==null?void 0:A.address_book_data);if(!tt&&(A!=null&&A.result||A!=null&&A.result_payload)){const Be=String(A.result||A.result_payload||"");if(Be.includes("__ADDRESS_BOOK_JSON_START__"))try{let br=Be.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();br=br.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),tt=JSON.parse(br)}catch{}}$e&&tt&&(xe(Be=>({...Be,[$e]:tt})),ie($e,tt,s.printer_name||s.name,s.ip||s.printer_ip,p)),await nt(),he(Be=>({...Be,[o]:!0}))},A=>{D(`Đồng bộ thất bại: ${A}`,"error")},"⌛ Đang đồng bộ danh bạ...")}catch(t){D(`Lỗi gửi lệnh đồng bộ: ${t.message}`,"error")}};return{VIEW_COMMANDS:Ke,activeAgentUid:$r,activeLoadingFile:T,activeModal:N,activeTab:f,allocatedVncAddr:wr,autoScanTriggers:Vt,cameraFiles:gt,cameraForm:Ct,cameraLogs:xt,cameraStatus:Dt,cameraTestLoading:I,cameraTestResult:Bt,cameras:Ee,camerasLoading:Qe,commandStatus:oe,confirmModal:jr,copierCredentials:te,customRecordDuration:O,customRunCommand:_n,deleteScanPointModal:Ne,detectBrand:Cr,directLan:Ht,editIpModalData:kr,editableSettingsText:Zt,emailFileCounts:mr,expandedDriverMenus:C,expandedDrivers:Xe,expandedPrinters:ge,fetchCameraFiles:async(r,i)=>{try{const o=await(await fetch(`${ct}/api/agents/${r}/cameras/${i}/files`,{method:"POST"})).json();o.ok&&yt(o.files||[])}catch{}},fetchCameraStatus:async(r,i)=>{try{const o=await(await fetch(`${ct}/api/agents/${r}/cameras/${i}/status`,{method:"POST"})).json();o.ok&&o.status?(mt(o.status),ut(o.status.logs||[])):D("Không lấy được trạng thái camera: "+(o.error||"Lỗi kết nối"),"error")}catch(s){D("Lỗi lấy trạng thái: "+s.message,"error")}},fetchCameras:pn,fetchLanSitesData:nt,fetchRemotePage:Pt,filteredPrinters:xr,formatJsonText:er,ftpDetailData:re,getLiveQueryTimestamp:ht,getTargetAgentUid:pr,handleAddPrivateFtp:async()=>{const{lanUid:r,agentUid:i,email:s}=Gr;if(!s||!s.includes("@")){D("Địa chỉ email không hợp lệ","error");return}St(!0);try{const o=await Ln("default",r,i,s);if(St(!1),B(null),o.ok)D("Đã thêm Private FTP thành công","success"),await nt();else throw new Error(o.error||"Lỗi server")}catch(o){St(!1),D(`Lỗi thêm FTP riêng: ${o.message}`,"error")}},handleAddPublicFtp:async()=>{var l,m,p;const{printerId:r,name:i,email:s,agentUid:o}=qt;if(!i||!i.trim()){D("Vui lòng nhập tên điểm scan","error");return}if(s&&!s.includes("@")){D("Địa chỉ email không hợp lệ","error");return}Xt(!0),D("Đang tạo yêu cầu thêm FTP/Email lên máy in...","info",3e3);try{const g=(j||[]).flatMap(t=>t.printers||[]).find(t=>String(t.id)===String(r)||t.mac_id===r||t.mac_address===r||t.ip===r)||((l=ne==null?void 0:ne.printers)==null?void 0:l.find(t=>String(t.id)===String(r)||t.mac_id===r||t.mac_address===r||t.ip===r)),P=((m=te[r])==null?void 0:m.user)||(g==null?void 0:g.auth_user),R=((p=te[r])==null?void 0:p.pass)||(g==null?void 0:g.auth_password)||"";if(!P){Xt(!1),D(`Chưa cấu hình tài khoản Web cho máy in ${(g==null?void 0:g.printer_name)||(g==null?void 0:g.name)||"Photocopy"}!`,"error");return}const L={mac_address:(g==null?void 0:g.mac_id)||(g==null?void 0:g.mac_address)||r,printer_ip:(g==null?void 0:g.ip)||"",printer_type:(g==null?void 0:g.printer_type)||"",auth_user:P,auth_password:R},b=await Rn(r,i.trim(),s,o||void 0,L);if(Xt(!1),B(null),!b.ok||!b.command_id)throw new Error(b.error||"Lỗi gửi lệnh");ze(b.command_id,r,async t=>{D(`Đã tạo điểm scan "${i.trim()}" thành công!`,"success"),console.log("Finish add public FTP scan point, updating address book state directly");const c=(g==null?void 0:g.mac_address)||(g==null?void 0:g.mac_id)||r,_=c?String(c).toUpperCase().replace(/-/g,":"):"";let x=(t==null?void 0:t.address_book_sync)||(t==null?void 0:t.address_book_data);if(!x&&(t!=null&&t.result||t!=null&&t.result_payload)){const M=String(t.result||t.result_payload||"");if(M.includes("__ADDRESS_BOOK_JSON_START__"))try{let A=M.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();A=A.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),x=JSON.parse(A)}catch{}}_&&x&&xe(M=>({...M,[_]:x})),et(r),await nt()},t=>{D(`Thêm điểm scan thất bại: ${t}`,"error")},`⌛ Đang tạo điểm scan "${i.trim()}"...`)}catch(u){Xt(!1),D(`Lỗi: ${u.message}`,"error")}},handleCloseWebPreview:dn,handleCopierClick:qr,handleEmergencyRestart:q,handleHistoryBack:ln,handleHistoryForward:cr,handleRefetchAddressBook:et,handleSaveAuth:Xr,handleSaveSettings:vt,handleToggleDirectLan:cn,handleToggleSetting:_r,handleTriggerUtility:bn,handleTriggerUtilityExec:ft,handleViewScanPointsJson:on,installDriverModal:Tt,ipInputModal:Zr,isDuplicatePending:hr,isRecording30s:ue,isSavingSettings:yn,lanSites:j,lanSitesLoading:ye,liveAddressBooks:_e,loadUtilitySettings:fr,lockAspect:Et,modalContentRef:de,onlineAgents:dr,pollCommandStatus:ze,previewBlobUrl:$t,previewIframeRef:Wt,privateFtpData:Gr,privateFtpLoading:Pr,publicFtpData:qt,publicFtpLoading:nn,queriedVideoUrl:h,queryDuration:V,queryTimestamp:Q,queryVideoLoading:ce,recording30sCountdown:Ae,remoteLockPrinter:Gt,replaceToast:zr,resolveRelativePath:Rr,saveAuthLoading:dt,saveScanPointToDb:ie,scaleX:It,scaleY:Le,scanAutoOpenDir:un,scanAutoOpenFile:mn,scanPointsViewerModal:an,selectedCamera:Ge,selectedCameraAgentUid:pe,selectedLan:ne,selectedLanUid:Z,selectedTargetAgents:pt,selectedUtilityAgent:S,setActiveLoadingFile:be,setActiveModal:B,setActiveTab:me,setAllocatedVncAddr:tr,setCameraFiles:yt,setCameraForm:$,setCameraLogs:ut,setCameraStatus:mt,setCameraTestLoading:z,setCameraTestResult:w,setCameras:K,setCamerasLoading:Je,setCommandStatus:F,setConfirmModal:je,setCopierCredentials:Me,setCustomRecordDuration:Ue,setCustomRunCommand:xn,setDeleteScanPointModal:or,setDirectLan:Tr,setEditIpModalData:Ar,setEditableSettingsText:Jr,setEmailFileCounts:Lr,setExpandedDriverMenus:we,setExpandedDrivers:G,setExpandedPrinters:he,setFtpDetailData:kt,setInstallDriverModal:Yr,setIpInputModal:Ir,setIsRecording30s:Fe,setIsSavingSettings:Ft,setLanSites:v,setLanSitesLoading:ae,setLiveAddressBooks:xe,setLockAspect:bt,setPreviewBlobUrl:Re,setPrivateFtpData:sn,setPrivateFtpLoading:St,setPublicFtpData:Br,setPublicFtpLoading:Xt,setQueriedVideoUrl:E,setQueryDuration:H,setQueryTimestamp:W,setQueryVideoLoading:U,setRecording30sCountdown:Ye,setRemoteLockPrinter:vr,setSaveAuthLoading:Ve,setScaleX:ar,setScaleY:Mt,setScanAutoOpenDir:Rt,setScanAutoOpenFile:Yt,setScanPointsViewerModal:Qt,setSelectedCamera:Te,setSelectedCameraAgentUid:ke,setSelectedLanUid:X,setSelectedTargetAgents:fe,setSelectedUtilityAgent:at,setSettingsSaveStatus:lt,setShowPreviewDetails:Ur,setShowSettings:J,setStorageFiles:Er,setStorageLoading:rn,setStorageModalData:en,setToasts:Se,setToshibaVncData:zt,setUtilityActionPending:Ie,setUtilityCommands:Vr,setUtilityCommandsLoading:Nr,setUtilitySettingsLoading:ur,setUtilityStatusMsg:ee,setViewOutputModal:it,setVncTunnelLoading:nr,setWebPreviewHistory:Pe,setWebPreviewHistoryIndex:jt,setWebPreviewLoading:sr,setWebPreviewModal:At,setWebPreviewTab:Ze,settingsSaveStatus:Kr,showPreviewDetails:Fr,showSettings:y,showToast:D,storageFiles:tn,storageLoading:Kt,storageModalData:Jt,toasts:Ce,toshibaVncData:ve,triggerLanScan:Wr,utilityActionPending:hn,utilityCommands:gr,utilityCommandsLoading:Lt,utilitySettingsLoading:gn,utilityStatusMsg:fn,viewOutputModal:De,vncTunnelLoading:rr,webPreviewHistory:Ot,webPreviewHistoryIndex:ot,webPreviewLoading:ir,webPreviewModal:Y,webPreviewTab:Mr}},Sr="https://agentapi.quanlymay.com",Kn=(a={})=>{const{cameraForm:k,cameras:j,customRecordDuration:v,directLan:Z,fetchCameraFiles:X,fetchCameraStatus:ye,fetchCameras:ae,isRecording30s:pe,setActiveModal:ke,setAllocatedVncAddr:f,setCameraTestLoading:me,setCameraTestResult:oe,setIsRecording30s:F,setRecording30sCountdown:ge,setSelectedCamera:he,setToshibaVncData:Xe,setVncTunnelLoading:G,showToast:C}=a;return{cameraForm:k,cameras:j,customRecordDuration:v,directLan:Z,fetchCameraFiles:X,fetchCameraStatus:ye,fetchCameras:ae,handleDeleteCamera:async(fe,_e)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{const xe=await(await fetch(`${Sr}/api/agents/${fe}/cameras/${_e}/delete`,{method:"POST"})).json();xe.ok?(C("Đã xóa camera thành công!","success"),ae(fe),he(null)):C("Lỗi xóa camera: "+xe.error,"error")}catch(le){C("Lỗi hệ thống: "+le.message,"error")}},handleDeleteCameraFile:async(fe,_e,le)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${le}`))try{const Ee=await(await fetch(`${Sr}/api/agents/${fe}/cameras/${_e}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:le})})).json();Ee.ok?(C("Đã xóa tệp video thành công!","success"),X(fe,_e)):C("Lỗi xóa tệp: "+Ee.error,"error")}catch(xe){C("Lỗi hệ thống: "+xe.message,"error")}},handleRecord30s:async(fe,_e)=>{if(pe)return;const le=j.find(Qe=>Qe.id===_e),xe=(le==null?void 0:le.mac_address)||"";if(!xe){C("Camera không có thông tin MAC ID để điều khiển!","error");return}F(!0),ge(v);let Ee=v;const K=setInterval(()=>{Ee-=1,ge(Math.max(Ee,0)),Ee<=0&&clearInterval(K)},1e3);try{C(`Đang gửi yêu cầu ghi hình ${v}s...`,"info");const Je=await(await fetch(`${Sr}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:xe,action:"record",duration:v})})).json();clearInterval(K),Je.ok?C(Je.message||`Ghi hình ${v}s hoàn tất!`,"success"):C("Lỗi ghi hình: "+Je.error,"error")}catch(Qe){clearInterval(K),C("Lỗi kết nối ghi hình: "+Qe.message,"error")}finally{F(!1),setTimeout(()=>{ye(fe,_e),X(fe,_e)},1500)}},handleSaveCameraConfig:async fe=>{try{const le=await(await fetch(`${Sr}/api/agents/${fe}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(k)})).json();le.ok?(C("Đã lưu cấu hình camera thành công!","success"),ae(fe),he(null)):C("Lỗi lưu cấu hình: "+le.error,"error")}catch(_e){C("Lỗi hệ thống: "+_e.message,"error")}},handleStartToshibaVnc:async(fe,_e,le)=>{if(Xe({ip:fe,printerName:_e,agentUid:le}),f(""),ke("toshiba_vnc"),Z){f(`${fe}:49105`);return}G(!0);try{const Ee=await(await fetch(`${Sr}/api/agents/${le}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:fe,printer_port:49105})})).json();if(Ee.ok&&Ee.url_port){const K=Ee.url_port.replace("http://","").replace("https://","");f(K)}else C("Không thể mở đường hầm VNC: "+(Ee.error||"Lỗi không xác định"),"error"),ke(null)}catch(xe){C("Lỗi kết nối VPS: "+(xe.message||xe),"error"),ke(null)}finally{G(!1)}},handleTestCameraConnection:async fe=>{me(!0),oe(null);try{const le=await(await fetch(`${Sr}/api/agents/${fe}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:k.rtsp_url})})).json();le.ok&&le.result?oe(le.result):oe({ok:!1,msg:le.error||"Lỗi kiểm tra kết nối"})}catch(_e){oe({ok:!1,msg:"Lỗi: "+_e.message})}finally{me(!1)}},isRecording30s:pe,setActiveModal:ke,setAllocatedVncAddr:f,setCameraTestLoading:me,setCameraTestResult:oe,setIsRecording30s:F,setRecording30sCountdown:ge,setSelectedCamera:he,setToshibaVncData:Xe,setVncTunnelLoading:G,showToast:C}},qn={ricoh_create_scan:`import requests
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
`},Xn="https://agentapi.quanlymay.com";function Qn(a,k,j){const v=a.email_address||a.email||"",Z=a.physical_path||a.folder||a.folder_path||"",X=(v||Z||"").trim();if(!X)return{label:"UNKNOWN",type:"error",title:""};if(a.type==="Email"||v.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const ae=(k||[]).find(f=>(f.email||"").toLowerCase().trim()===X.toLowerCase().trim()),pe=ae?ae.email_number:Number(a.registration_no);if(!pe||isNaN(pe))return{label:"✔ ACTIVE",type:"success",title:""};const ke=(j||[]).find(f=>f.is_master&&f.is_agent_active)||(j||[]).find(f=>f.is_agent_active)||(j||[])[0];if(ke){const f=(ke.ftp_sites||[]).find(me=>Number(me.port)===Number(pe));if(f){const me=("C:/Scangox/"+X).toLowerCase().replace(/\\/g,"/"),F=(f.path||"").toLowerCase().replace(/\\/g,"/")===me;return f.running&&F?{label:"✔ OK",type:"success",title:""}:f.running&&!F?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${f.path} instead of expected: C:/Scangox/${X}`}:f.error&&(f.error.toLowerCase().includes("in use")||f.error.toLowerCase().includes("busy")||f.error.toLowerCase().includes("already bound")||f.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:f.error}:{label:"❌ FAILED",type:"error",title:f.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}const Yn=(a={})=>{const{activeAgentUid:k,cameras:j,copierCredentials:v={},deleteScanPointModal:Z,editIpModalData:X,fetchLanSitesData:ye,getTargetAgentUid:ae,handleRefetchAddressBook:pe,isDuplicatePending:ke,lanSites:f=[],pollCommandStatus:me,queryDuration:oe,queryTimestamp:F,replaceToast:ge,saveScanPointToDb:he,selectedCamera:Xe,selectedLan:G,setActiveModal:C,setDeleteScanPointModal:we,setEditIpModalData:te,setInstallDriverModal:Me,setLiveAddressBooks:dt,setQueriedVideoUrl:Ve,setQueryDuration:pt,setQueryTimestamp:fe,setQueryVideoLoading:_e,setStorageFiles:le,setStorageLoading:xe,setStorageModalData:Ee,showToast:K,utilityCommands:Qe=[],detectBrand:Je}=a,Ge=async(w,I,z,Q)=>{var E;const W=z||F,V=Q||oe;if(!W)return;const H=((E=j.find(ce=>ce.id===I))==null?void 0:E.name)||"";if(await ke(w,"trigger_utility",{action:"query_camera_video",camera_name:H,timestamp:W,duration:V})){K("Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!","info");return}_e(!0),Ve("");try{const U=await(await fetch(`${Xn}/api/agents/${w}/cameras/${I}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:W,duration:V})})).json();if(U.ok){const y=W.replace(/[- :]/g,""),J=y.substring(0,8)+"_"+y.substring(8,14);Ve(`clip_${Xe.camera_name}_${J}.mp4`)}else K("Không truy xuất được video: "+U.error,"error")}catch(ce){K("Lỗi kết nối render: "+ce.message,"error")}finally{_e(!1)}};return{executeRemoteInstallDriver:async(w,I,z,Q,W,V)=>{const H=`driver-install-progress-${V}`;ge(H,`⏳ [${V}] Đang gửi lệnh cài đặt driver...`,"info");try{const h=await On(w,I,z,Q,W,V);if(!h.ok)throw new Error(h.error||"Server trả về lỗi");const E=h.command_id;if(!E){ge(H,`✅ [${V}] Đã gửi lệnh cài đặt driver.`,"success");return}const ce=3e5,U=2e3,y=Date.now();let J="";const T=setInterval(async()=>{try{const be=Date.now()-y;if(be>ce){clearInterval(T),ge(H,`⏰ [${V}] Quá thời gian chờ (5 phút).`,"info");return}const ue=await Ut(E);if(ue.status==="success")clearInterval(T),ge(H,`✅ [${V}] Cài đặt driver thành công!`,"success");else if(ue.status==="failed"||!ue.ok)clearInterval(T),ge(H,`❌ [${V}] Cài driver thất bại: ${ue.error||"Lỗi không xác định"}`,"error");else{const Fe=ue.progress_text||"";if(Fe&&Fe!==J)J=Fe,ge(H,`⏳ [${V}] ${Fe}`,"info");else if(!Fe){const Ae=Math.round(be/1e3);ue.received_at?ge(H,`⚡ [${V}] Đã nhận lệnh - đang cài đặt... (${Ae}s)`,"info"):ge(H,`⌛ [${V}] Đang chuyển lệnh tới Agent... (${Ae}s)`,"info")}}}catch{}},U)}catch(h){ge(H,`❌ Không thể cài driver: ${h.message}`,"error")}},formatBytes:w=>{if(w===0)return"0 Bytes";const I=1024,z=["Bytes","KB","MB","GB"],Q=Math.floor(Math.log(w)/Math.log(I));return parseFloat((w/Math.pow(I,Q)).toFixed(1))+" "+z[Q]},getDestinationStatus:w=>Qn(w,(G==null?void 0:G.emails)||[],(G==null?void 0:G.agents)||[]),handleConfirmDeleteScanPoint:async()=>{var ce;const{printerId:w,entry:I,agentUid:z}=Z;if(!w||!I){K(`Lỗi nội bộ: Không xác định được máy in (ID: ${w}) hoặc điểm scan.`,"error"),we(U=>({...U,isOpen:!1}));return}we(U=>({...U,isOpen:!1}));const Q=I.email_address||I.email||"",W=I.physical_path||I.folder||I.folder_path||"",V=(Q||W||"").trim(),H=String(I.registration_no&&I.registration_no!=="-"?I.registration_no:I.entry_id||"").trim(),E=((G==null?void 0:G.emails)||[]).find(U=>U.email.toLowerCase().trim()===V.toLowerCase().trim());if(E&&E.id){K("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const U=await Dn(E.id);if(U.ok)K("Đã xóa thành công!","success");else throw new Error(U.error||"Không thể xóa")}catch(U){K(`Lỗi xóa: ${U.message}`,"error")}return}K("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const y=(f||[]).flatMap(O=>O.printers||[]).find(O=>String(O.id)===String(w)||O.mac_id===w||O.mac_address===w||O.ip===w)||((ce=G==null?void 0:G.printers)==null?void 0:ce.find(O=>String(O.id)===String(w)||O.mac_id===w||O.mac_address===w||O.ip===w));if(!y){K("Không tìm thấy thông tin máy in để gửi lệnh","error");return}const J=((y==null?void 0:y.printer_type)||(y==null?void 0:y.printer_name)||(y==null?void 0:y.name)||"").toLowerCase(),T=J.includes("toshiba"),be=J.includes("xerox")||J.includes("fuji"),ue=T?"toshiba_delete_scan":be?"xerox_delete_scan":"ricoh_delete_scan",Fe=(Qe||[]).find(O=>O.command===ue),Ae=z||ae(w);let Ye;if(Ae){let O=Fe;if(!O)try{O=(await wn(Ae)||[]).find(Gt=>Gt.command===ue)}catch{}const Ue=(y==null?void 0:y.ip)||(y==null?void 0:y.printer_ip)||(w.includes(".")?w:""),Ce=(y==null?void 0:y.mac_address)||(y==null?void 0:y.mac_id)||"",Se=Ce?String(Ce).toUpperCase().replace(/-/g,":"):"",N=v[Se]||v[w]||{},B=N.user||(y==null?void 0:y.auth_user),S=N.pass||(y==null?void 0:y.auth_password)||"";if(!B){K(`Chưa cấu hình tài khoản Web cho máy in ${(y==null?void 0:y.printer_name)||(y==null?void 0:y.name)||"Photocopy"}!`,"error");return}const at=String((I==null?void 0:I.entry_id)||(I==null?void 0:I.id)||H||"").trim()||"null";let re=(O==null?void 0:O.command_content)||qn[ue]||"";if(!re){K(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${ue}' trên hệ thống VPS!`,"error");return}re=re.replace(/__TARGET_IP__/g,Ue||"null"),re=re.replace(/__TARGET_USER__/g,B||"admin"),re=re.replace(/__TARGET_PASS__/g,S||""),re=re.replace(/__TARGET_ID__/g,at),re=re.replace(/__TARGET_SCAN_USER__/g,(I==null?void 0:I.name)||"null"),ue.includes("toshiba")&&(re=re.replace(/timeout=\d+/g,"timeout=25")),Ye=await Nt(Ae,ue,re,{printer_ip:Ue,ip:Ue,auth_user:B,auth_password:S,target_id:at,entry_id:at,registration_no:H})}else Ye=await zn(w,H,I.entry_id||"",z||void 0);if(!Ye.ok||!Ye.command_id)throw new Error(Ye.error||"Không thể tạo lệnh xóa");me(Ye.command_id,w,async O=>{K(`Đã xóa đăng ký #${H} thành công!`,"success"),console.log("Finish delete scan point, updating address book state directly",O);const Ue=(y==null?void 0:y.mac_address)||(y==null?void 0:y.mac_id)||w,Ce=Ue?String(Ue).toUpperCase().replace(/-/g,":"):"";let Se=(O==null?void 0:O.address_book_sync)||(O==null?void 0:O.address_book_data);if(!Se&&(O!=null&&O.result||O!=null&&O.result_payload)){const N=String(O.result||O.result_payload||"");if(N.includes("__ADDRESS_BOOK_JSON_START__"))try{let B=N.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();B=B.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),Se=JSON.parse(B)}catch{}}Ce&&Se&&dt(N=>({...N,[Ce]:Se})),pe&&pe(w),await ye(!0)},O=>{K(`Lỗi xóa điểm scan: ${O}`,"error")},`⌛ Đang xóa điểm scan #${H}...`)}catch(U){K(`Lỗi gửi lệnh xóa: ${U.message}`,"error")}},handleDeleteDest:(w,I)=>{var Q,W;const z=ae(w)||((W=(Q=G==null?void 0:G.agents)==null?void 0:Q.find(V=>V.is_agent_active))==null?void 0:W.agent_uid)||"";we({isOpen:!0,printerId:w,entry:I,agentUid:z})},handleEditIP:(w,I)=>{const z=I.folder||I.physical_path||I.folder_path||"";let Q="",W="2130";const V=z.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),H=z.match(/^\\\\([^\\]+)(.*)$/);if(V)Q=V[1],W=V[2]||"2130";else if(H)Q=H[1],W="";else{const E=z.match(/^([^:/]+)(?::(\d+))?(.*)$/);E&&!z.startsWith("\\\\")&&(Q=E[1],W=E[2]||"2130")}const h=Q?W?`${Q}:${W}`:Q:"192.168.1.100:2130";te({printerId:w,entry:I,currentIp:Q,newIp:h,newPort:W||"2130"}),C("edit_ip")},handleOpenStorageFiles:async(w,I)=>{Ee({lanUid:w,email:I}),xe(!0),le([]),C("storage");try{const z=await kn(w,I);if(z.ok)le(z.rows||[]);else throw new Error(z.error||"Lỗi server")}catch(z){K(`Không thể lấy tệp đã scan: ${z.message}`,"error")}finally{xe(!1)}},handlePlaySegmentFile:w=>{const I=w.match(/_(\d{8}_\d{6})\.mp4$/);if(I){const z=I[1],Q=`${z.substring(0,4)}-${z.substring(4,6)}-${z.substring(6,8)} ${z.substring(9,11)}:${z.substring(11,13)}:${z.substring(13,15)}`;fe(Q),pt(60),Ge(k,Xe.id,Q,60),setTimeout(()=>{var W;(W=document.getElementById("video-playback-card"))==null||W.scrollIntoView({behavior:"smooth",block:"center"})},100)}else K("Không parse được thời gian từ tên tệp","error")},handleQueryVideo:Ge,handleRemoteInstallDriver:(w,I,z,Q,W)=>{var H,h;const V=ae(w)||((h=(H=G==null?void 0:G.agents)==null?void 0:H.find(E=>E.is_agent_active))==null?void 0:h.agent_uid)||"";Me({isOpen:!0,printerId:w,brand:I,model:z,driverName:Q,driverUrl:W,selectedAgentUids:V?[V]:[]})},handleSaveEditIP:async()=>{var y;if(!X)return;const{printerId:w,entry:I,newIp:z,newPort:Q}=X,W=I.folder||I.physical_path||I.folder_path||"",V=W.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),H=W.match(/^\\\\([^\\]+)(.*)$/);let h=z.trim();if((Q||"2130").trim(),h.includes(":")){const J=h.split(":");h=J[0].trim(),J[1].trim()}if(V)V[3];else if(H)H[2];else{const J=W.match(/^([^:/]+)(?::(\d+))?(.*)$/);J&&!W.startsWith("\\\\")&&J[3]}const E=ae(w),ce=I.registration_no;C(null),K("Gửi yêu cầu thay đổi IP của điểm scan...","info",3e3);let U="";if(V)U=V[1];else if(H)U=H[1];else{const J=W.match(/^([^:/]+)/);J&&!W.startsWith("\\\\")&&(U=J[1])}U||(U=h);try{const T=(f||[]).flatMap(N=>N.printers||[]).find(N=>String(N.id)===String(w)||N.mac_id===w||N.mac_address===w||N.ip===w)||((y=G==null?void 0:G.printers)==null?void 0:y.find(N=>String(N.id)===String(w)||N.mac_id===w||N.mac_address===w||N.ip===w));if(!T)throw new Error("Không tìm thấy thông tin máy in");const be=(T==null?void 0:T.mac_address)||(T==null?void 0:T.mac_id)||"",ue=be?String(be).toUpperCase().replace(/-/g,":"):"",Fe=v[ue]||v[w]||{},Ae=Fe.user||(T==null?void 0:T.auth_user)||(T==null?void 0:T.username),Ye=Fe.pass||(T==null?void 0:T.auth_password)||(T==null?void 0:T.password)||"";if(!Ae)throw new Error(`Chưa cấu hình tài khoản Web cho máy in ${(T==null?void 0:T.printer_name)||(T==null?void 0:T.name)||"Photocopy"}!`);const Ue=(Je?Je((T==null?void 0:T.printer_name)||(T==null?void 0:T.name)||""):"ricoh")==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp";let Ce="";try{const B=(await wn(E)||[]).find(S=>S.command===Ue);B&&(Ce=B.command_content)}catch(N){console.warn("Could not fetch command content for change ftp",N)}Ue.includes("toshiba")&&Ce&&(Ce=Ce.replace(/timeout=\d+/g,"timeout=25"));const Se=await Nt(E,Ue,Ce,{printer_ip:(T==null?void 0:T.ip)||"",auth_user:Ae,auth_password:Ye,target_id:ce,target_name:I.name,old_ip:U,new_ip:h});if(!Se.ok||!Se.command_id)throw new Error(Se.error||"Không thể gửi lệnh thay đổi FTP");me(Se.command_id,w,async N=>{K(`Đã thay đổi IP điểm scan #${ce} thành công!`,"success");const B=(T==null?void 0:T.mac_address)||(T==null?void 0:T.mac_id)||w,S=B?String(B).toUpperCase().replace(/-/g,":"):"";let at=(N==null?void 0:N.address_book_sync)||(N==null?void 0:N.address_book_data);if(!at&&(N!=null&&N.result||N!=null&&N.result_payload)){const re=String(N.result||N.result_payload||"");if(re.includes("__ADDRESS_BOOK_JSON_START__"))try{let kt=re.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();kt=kt.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),at=JSON.parse(kt)}catch{}}S&&at&&dt(re=>({...re,[S]:at})),pe&&pe(w),await ye(!0)},N=>{K(`Lỗi thay đổi IP: ${N}`,"error")},`⌛ Đang cập nhật IP điểm scan #${ce}...`)}catch(J){K(`Lỗi gửi lệnh thay đổi IP: ${J.message}`,"error")}}}};function Zn(){const a=Jn({}),k=Kn(a),j=Yn({...a,...k});return{...a,...k,...j}}function ii(){var oe;const a=Zn(),{toasts:k=[],lanSitesLoading:j,lanSites:v=[],selectedLanUid:Z,setSelectedLanUid:X,activeTab:ye,setActiveTab:ae,selectedLan:pe,triggerLanScan:ke,filteredPrinters:f,fetchLanSitesData:me}=a;return e.jsxs(st.div,{style:n.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:n.toastContainer,children:e.jsx(wt,{children:k.map(F=>e.jsxs(st.div,{style:{...n.toast,borderLeft:`4px solid ${F.type==="success"?"var(--color-success)":F.type==="error"?"var(--color-error)":"var(--color-primary)"}`},initial:{opacity:0,x:50,scale:.9},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:50,scale:.9},children:[e.jsx("span",{style:n.toastIcon,children:F.type==="success"?"✔️":F.type==="error"?"❌":"ℹ️"}),e.jsx("div",{style:{flex:1,fontSize:"0.8rem"},children:F.message})]},F.id))})}),e.jsxs("div",{style:n.fixedHeader,children:[e.jsxs("div",{style:n.header,children:[e.jsx("h1",{style:n.title,children:"🛠️ Quản lý Mạng LAN"}),e.jsx("button",{style:{...n.smallBtn,borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>me(!0),children:"🔄 Làm mới"})]}),e.jsxs("div",{style:n.filterBar,children:[e.jsx("label",{style:n.filterLabel,children:"Mạng LAN hiện tại:"}),j&&v.length===0?e.jsx(_t,{size:"sm"}):e.jsx("select",{value:Z,onChange:F=>{X(F.target.value),localStorage.setItem("goxprint_selected_lan_uid",F.target.value)},style:n.lanSelect,children:v.map(F=>{var ge;return e.jsxs("option",{value:F.lan_uid,children:[F.lan_name||F.lan_uid," (",F.active_agents," Agent - ",((ge=F.printers)==null?void 0:ge.filter(he=>he.is_online).length)??0," máy Photo)"]},F.lan_uid)})})]}),e.jsxs("div",{style:n.tabBar,children:[e.jsxs("button",{style:{...n.tabBtn,color:ye==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:ye==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>ae("agents"),children:["💻 Máy tính (",((oe=pe==null?void 0:pe.agents)==null?void 0:oe.filter(F=>F.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...n.tabBtn,color:ye==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:ye==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{ae("copiers"),ke(pe)},children:["🖨️ Photocopy (",f.length,")"]})]})]}),e.jsxs("div",{style:n.scrollableContent,children:[j&&e.jsx("div",{style:n.loadingWrapper,children:e.jsx(_t,{size:"md"})}),!j&&pe&&e.jsxs(wt,{mode:"wait",children:[ye==="agents"&&e.jsx(Wn,{...a}),ye==="copiers"&&e.jsx($n,{...a})]})]}),e.jsx(Vn,{...a})]})}export{ii as AgentPage,ii as default};
