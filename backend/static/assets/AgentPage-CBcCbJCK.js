import{j as e,R as We,A as et,m as Ve,L as nt,r as C}from"./index-FibDGBZd.js";import{A as Dr}from"./AnimatedList-DikUlnqm.js";import{G as Mr}from"./GlowCard-BwEcV_iC.js";const n={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"176px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",left:"12px",right:"12px",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",maxWidth:"404px",marginLeft:"auto",marginRight:"auto",pointerEvents:"none"},toast:{background:"rgba(18, 18, 26, 0.95)",backdropFilter:"blur(10px)",borderRadius:"8px",padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:"10px",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",pointerEvents:"auto"},toastIcon:{fontSize:"0.9rem",flexShrink:0},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},Le={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},credsInputRow:{display:"flex",gap:"6px"},credsInput:{fontSize:"0.8rem",padding:"6px 8px",background:"var(--color-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",flex:1,minWidth:0},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function zn({hasAddressList:t,sync:o,p:u,commandStatus:f,getDestinationStatus:P,selectedLan:N,handleOpenStorageFiles:E,handleDeleteDest:G,handleChangeFtp:te,handleEditIP:J}){const k=Array.isArray(o==null?void 0:o.address_list)?o.address_list.filter(g=>{if(!g||typeof g!="object"||g.type==="Summary")return!1;const z=(g.name||"").trim();return z==="Summary"||z==="Total"||z.startsWith("Users:")?!1:!!(z||g.entry_id||g.registration_no&&g.registration_no!=="-"||g.email_address||g.email||g.folder||g.physical_path)}):[];return e.jsxs("div",{style:Le.destinationsBlock,children:[e.jsx("span",{style:Le.destBlockTitle,children:"📂 Danh sách điểm scan:"}),k.length>0?k.map((g,z)=>{var Q;const j=g.email_address||g.email||"",Z=g.physical_path||g.folder||g.folder_path||"",K=(j||Z||"").trim();let m="Folder";Z.startsWith("ftp://")?m="FTP":Z.startsWith("\\\\")?m="SMB":(j||j.includes("@"))&&(m="Email"),typeof P=="function"&&P(g);const R=g.registration_no&&g.registration_no!=="-"?g.registration_no:g.entry_id||z+1,_=`${u.id}-${R}`,S=((Q=f[_])==null?void 0:Q.isPending)||!1;return e.jsxs("div",{style:{...Le.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",R]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[g.name,(g.warning||g.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:g.warning||g.error,children:"⚠️"})]}),typeof g.file_count=="number"&&e.jsxs("span",{onClick:()=>E(N.lan_uid,K),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",g.file_count," files"]}),g.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:g.entry_id})]}),te&&(m==="FTP"||m==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:S?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:S?.5:1,minWidth:"24px"},onClick:()=>J&&J(u.id,g),disabled:S,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:S?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:S?.5:1,minWidth:"24px"},onClick:()=>G(u.id||u.mac_id||u.mac_address||u.ip||"0",g),disabled:S,title:"Xóa",children:"🗑️"})]},z)}):e.jsx("div",{style:Le.emptySubText,children:o.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Chưa có điểm scan nào trên máy in."})]})}const $n="https://agentapi.quanlymay.com",Wt=new Map;async function Re(t,o={}){const u=`${o.method||"GET"}:${t}:${o.body||""}`;if(Wt.has(u))return Wt.get(u);const f=(async()=>{try{const P=await fetch(`${$n}${t}`,{...o,headers:{"Content-Type":"application/json","X-API-Token":"change-me",...o.headers}});if(!P.ok){const N=await P.json().catch(()=>({}));throw new Error(N.error||`HTTP error! status: ${P.status}`)}return await P.json()}finally{Wt.delete(u)}})();return Wt.set(u,f),f}async function Wn(){try{const t=(localStorage.getItem("goxprint_selected_public_ip")||localStorage.getItem("gox_connect_public_ip")||"").trim(),o=t?`&public_ip=${encodeURIComponent(t)}`:"";return await Re(`/api/new-lan-sites?lead=default${o}`)||{rows:[]}}catch(t){return console.error("Failed to fetch LAN sites:",t),{rows:[]}}}async function Hn(t,o,u,f,P){return Re(`/api/devices/${encodeURIComponent(t)}/credentials`,{method:"PATCH",body:JSON.stringify({auth_user:o,auth_password:u,mac_id:f||t,printer_type:P})})}async function Vn(t,o,u){const f=o?`/api/devices/${t}/fetch-address-book?agent_uid=${o}`:`/api/devices/${t}/fetch-address-book`;return Re(f,{method:"POST",body:JSON.stringify(u||{})})}async function Ct(t){return Re(`/api/commands/${t}/status`)}async function Kn(t,o,u,f,P){const N=f?`/api/devices/${t}/add-email-dest?agent_uid=${f}`:`/api/devices/${t}/add-email-dest`;return Re(N,{method:"POST",body:JSON.stringify({name:o,email:u,...P||{}})})}async function Jn(t,o,u,f){return Re("/api/lan-emails",{method:"POST",body:JSON.stringify({lead:t,lan_uid:o,email:f,email_type:"private",pc_name:u})})}async function qn(t,o,u,f){return Re(`/api/devices/${t}/delete-email-dest`,{method:"POST",body:JSON.stringify({registration_no:o,entry_id:u,agent_uid:f})})}async function Xn(t){return Re(`/api/lan-emails/${t}`,{method:"DELETE"})}async function Or(t,o){return Re(`/api/scans/files?lan_uid=${encodeURIComponent(t)}&email=${encodeURIComponent(o)}`)}async function Fr(t,o,u,f,P,N,E,G){return Re(`/api/devices/${encodeURIComponent(t)}/install-driver`,{method:"POST",body:JSON.stringify({brand:o,model:u,driver_name:f,driver_url:P,agent_uid:N,printer_ip:E,mac_id:G})})}async function Qn(t,o,u,f=1,P=50,N,E){const G=new URLSearchParams;return t&&G.append("lead",t),G.append("lan_uid",o),f&&G.append("page",f.toString()),P&&G.append("limit",P.toString()),G.append("t",Date.now().toString()),Re(`/api/jobs?${G.toString()}`)}async function Yn(t,o,u){return Re(`/api/agents/${t}/utility/${o}?lead=default`,{method:"POST",body:u?JSON.stringify(u):void 0})}async function Ur(t){return Re(`/api/agents/${t}/utility-commands?lead=default&t=${Date.now()}`)}async function it(t,o,u,f){return Re(`/api/agents/${t}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify({command:o,command_content:u,...f||{}})})}async function Zn(t){return Re(`/api/agents/${t}/emergency-restart?lead=default`,{method:"POST",body:"{}"})}const ei=qn;function ti({p:t,selectedLan:o,activeAgentUid:u,selectedAgentUid:f,copierCredentials:P,setCopierCredentials:N,saveAuthLoading:E,handleSaveAuth:G,isExpanded:te,handleCopierClick:J,onlineAgents:k,detectBrand:g,showToast:z,fetchRemotePage:j,setRemoteLockPrinter:Z,setActiveModal:K,hasAddressList:m,sync:R,commandStatus:_,getDestinationStatus:S,handleOpenStorageFiles:Q,handleEditIP:X,handleDeleteDest:ge,handleRefetchAddressBook:Se,expandedDrivers:Ne,setExpandedDrivers:me,expandedDriverMenus:ie,setExpandedDriverMenus:ee,handleRemoteInstallDriver:ce,setPublicFtpData:x}){var B,q,V,Y,D;const[W,$]=We.useState(!1),[T,H]=We.useState("");We.useEffect(()=>{var F;const d=(t==null?void 0:t.agent_uid)||u||f||k&&((F=k[0])==null?void 0:F.agent_uid)||"";H(d)},[t,u,f,k]);const oe=((B=_[t.id])==null?void 0:B.isPending)||!1,se=((q=_[t.id])==null?void 0:q.message)||"",_e=t.mac_address||"",ve=t.ip||"",xe=String(t.id!==void 0&&t.id!==null?t.id:""),le=_e&&(_==null?void 0:_[_e])||ve&&(_==null?void 0:_[ve])||xe&&(_==null?void 0:_[xe]),y=d=>d&&(Array.isArray(d.address_list)||d.address_book_data&&Array.isArray(d.address_book_data.address_list)),p=(y(le==null?void 0:le.address_book_sync)?le.address_book_sync:null)||(y(le)?le:null)||(y(R)?R:null)||(le==null?void 0:le.address_book_sync)||le||R||{};g(t.name||t.printer_name||t.ip||"generic"),t.name||t.printer_name;const h=t.suggested_drivers&&Array.isArray(t.suggested_drivers)?t.suggested_drivers:[],I=String(t.id!==void 0&&t.id!==null?t.id:t.mac_id||t.mac_address||t.ip||"copier"),O=!!(Ne[I]||t.id!==void 0&&Ne[t.id]||t.mac_id&&Ne[t.mac_id]||t.mac_address&&Ne[t.mac_address]||t.ip&&Ne[t.ip]),L=(()=>{var F;if(Array.isArray(p==null?void 0:p.address_list)&&p.address_list.length>0)return p.address_list;if(p!=null&&p.address_book_data&&Array.isArray(p.address_book_data.address_list))return p.address_book_data.address_list;const d=[p,p==null?void 0:p.result,p==null?void 0:p.result_payload,p==null?void 0:p.raw,le==null?void 0:le.result,le==null?void 0:le.result_payload,le==null?void 0:le.address_list,(F=le==null?void 0:le.address_book_sync)==null?void 0:F.address_list];for(const a of d)if(a){if(Array.isArray(a))return a;if(typeof a=="object"&&Array.isArray(a.address_list))return a.address_list;if(typeof a=="string"){let he=a.trim();if(he.includes("__ADDRESS_BOOK_JSON_START__"))try{he=he.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),he=he.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const re=JSON.parse(he);if(re&&Array.isArray(re.address_list))return re.address_list;if(Array.isArray(re))return re}catch{}}}return Array.isArray(p==null?void 0:p.address_list)?p.address_list:[]})(),b=L.filter(d=>{if(!d||typeof d!="object"||d.type==="Summary")return!1;const F=(d.name||"").trim();return F==="Summary"||F==="Total"||F.startsWith("Users:")?!1:!!(F||d.entry_id||d.registration_no&&d.registration_no!=="-"||d.email_address||d.email||d.folder||d.physical_path)}),r={...p,address_list:L,status:L.length>0?"success":(p==null?void 0:p.status)||"none",timestamp:((V=_==null?void 0:_[t.id])==null?void 0:V.timestamp)||(p==null?void 0:p.timestamp)||new Date().toISOString()},c=b.length>0||m,l=b.length,s=r.timestamp?new Date(r.timestamp).toLocaleTimeString("vi-VN"):"",v=We.useCallback(async(d,F)=>{var fe,at;const a=g(d.printer_name||d.name||"");if(a!=="ricoh"&&a!=="toshiba"){z("Thiết bị không hỗ trợ thay đổi FTP","error");return}const he=a==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",re=((fe=o==null?void 0:o.agents)==null?void 0:fe.find(ue=>ue.is_agent_active))||((at=o==null?void 0:o.agents)==null?void 0:at[0]),we=(re==null?void 0:re.local_ip)||(re==null?void 0:re.ip)||"";if(!we){z("Không tìm thấy IP của Agent để cập nhật","error");return}const Te=F.folder||F.physical_path||F.folder_path||"",Ke=Te.match(/ftp:\/\/([^:/]+)/),tt=Te.match(/^\\\\([^\\]+)/),Be=Te.match(/^([^:/]+):/);let Ie="";Ke?Ie=Ke[1]:tt?Ie=tt[1]:Be&&(Ie=Be[1]),Ie||(Ie=we);const A=F.registration_no||F.id||"",U=F.name||F.username||F.display_name||"",de=d.ip||d.printer_ip||"";z(`Đang truy vấn tài khoản VPS cho ${F.name}...`,"info");let Ae=d.auth_user||d.username||"",Ee=d.auth_password||d.password||"";try{const ue=await Re(`/api/devices/credentials-map?t=${Date.now()}`);if(ue&&ue.ok&&ue.credentials){const Ge=(d.mac_id||d.mac_address||"").toUpperCase().replace(/[^0-9A-F:]/g,""),Ye=Ge.replace(/[:-]/g,""),_t=de,ot=Ge&&ue.credentials[Ge]||Ye&&ue.credentials[Ye]||_t&&ue.credentials[_t];ot&&(Ae=ot.user||ot.auth_user||Ae,Ee=ot.password||ot.auth_password||Ee)}}catch{}if(!Ae){z("⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS!","error");return}try{const ue=await it(f,he,"",{printer_ip:de,auth_user:Ae,auth_password:Ee,target_id:A,target_name:U,old_ip:Ie,new_ip:we});ue&&ue.ok?z(`Cập nhật FTP cho ${F.name} thành công!`,"success"):z(`Lỗi: ${(ue==null?void 0:ue.error)||"Không thể chạy lệnh"}`,"error")}catch(ue){z(`Lỗi gửi lệnh: ${(ue==null?void 0:ue.message)||ue}`,"error")}},[f,o,g,z]);return e.jsxs("div",{id:`copier-card-${t.id}`,onClick:()=>J(String(t.id)),style:{width:"100%"},children:[e.jsxs(Mr,{children:[e.jsxs("div",{style:Le.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:Le.copierTitle,children:["🖨️ ",t.printer_name&&t.printer_name.trim()||t.name||t.ip||"Thiết bị Photocopy"]}),e.jsxs("div",{style:Le.copierSubtitle,children:["IP: ",t.ip," · MAC: ",t.mac_id||"—",t.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:t.agent_uid})]})]})]}),e.jsx("span",{style:{...Le.statusBadge,color:t.probed?t.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:t.probed?t.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:t.probed?t.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:t.probed?t.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsxs("div",{style:Le.sectionBlock,children:[e.jsx("span",{style:Le.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsxs("div",{style:Le.credsInputRow,children:[e.jsx("input",{type:"text",style:Le.credsInput,placeholder:"admin",autoComplete:"new-password",name:`printer_user_${t.id}`,value:((Y=P[t.id])==null?void 0:Y.user)||"",onChange:d=>N(F=>({...F,[t.id]:{...F[t.id],user:d.target.value}}))}),e.jsx("input",{type:"password",style:Le.credsInput,placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${t.id}`,value:((D=P[t.id])==null?void 0:D.pass)||"",onChange:d=>N(F=>({...F,[t.id]:{...F[t.id],pass:d.target.value}}))}),e.jsx("button",{style:{...Le.smallBtn,padding:"8px 12px",fontSize:"0.8rem",whiteSpace:"nowrap"},onClick:()=>G(t),disabled:E[t.id],children:E[t.id]?"Lưu...":"Lưu Auth"})]})]}),e.jsxs("div",{style:{...Le.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:R.status==="success"?"rgba(0, 255, 136, 0.05)":R.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:R.status==="success"?"rgba(0, 255, 136, 0.15)":R.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:Le.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),oe?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:se}):c?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",l," mục) ",s?` • ${s}`:""]}):R.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",R.error," ",s?`(${s})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...Le.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:d=>{d.preventDefault(),d.stopPropagation(),$(!0)},disabled:oe||k.length===0,children:["🔄 ",r.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),c&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(zn,{hasAddressList:c,sync:r,p:t,commandStatus:_,getDestinationStatus:S,selectedLan:o,handleOpenStorageFiles:Q,handleEditIP:X,handleDeleteDest:ge,handleChangeFtp:v})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...Le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{x({printerId:t.id,name:"",email:"",agentUid:f}),K("public_ftp")},disabled:k.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...Le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{var F,a;const d=f||t.agent_uid||u||((a=(F=o==null?void 0:o.agents)==null?void 0:F[0])==null?void 0:a.agent_uid)||"";if(!d){z("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}j(d,t.ip,"/")},disabled:!o||!o.agents||o.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...Le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#60a5fa",color:"#60a5fa"},onClick:()=>{var d,F,a,he;if(me&&me(re=>({...re,[I]:!O,[t.id]:!O,[t.ip]:!O})),h&&h.length>0&&ee&&ee(re=>{const we={...re};return h.forEach((Te,Ke)=>{we[`${I}-${Ke}`]=!0,we[`${t.id}-${Ke}`]=!0}),we}),ce){const re=(F=(d=h[0])==null?void 0:d.drivers)==null?void 0:F[0];ce(t.mac_id||t.mac_address||t.ip||t.id,((a=h[0])==null?void 0:a.brand)||t.printer_type||"Ricoh",((he=h[0])==null?void 0:he.model)||t.name||t.printer_name||"Photocopy",(re==null?void 0:re.name)||"",(re==null?void 0:re.url)||"",h||[],t.ip||"",t.mac_id||t.mac_address||"")}},title:"Xem và cài đặt Driver máy in tự động cho các máy tính trong mạng LAN",children:"💻 Cài driver"}),g(t.name||t.printer_name||t.ip)==="ricoh"&&(t.name||t.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...Le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>z("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),g(t.name||t.printer_name||t.ip)==="toshiba"&&e.jsx("button",{style:{...Le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>z("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]}),e.jsx(et,{children:W&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.75)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",backdropFilter:"blur(4px)"},onClick:d=>{d.preventDefault(),d.stopPropagation()},children:e.jsxs(Ve.div,{initial:{opacity:0,scale:.95,y:10},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:10},style:{background:"#121827",border:"1px solid rgba(255, 255, 255, 0.15)",borderRadius:"16px",padding:"24px",maxWidth:"480px",width:"100%",boxShadow:"0 20px 50px rgba(0,0,0,0.6)"},onClick:d=>d.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:700,color:"#fff"},children:"📖 Chọn Agent thực thi Cập nhật danh bạ"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:["Máy photo: ",e.jsx("strong",{style:{color:"#60a5fa"},children:t.printer_name||t.name||t.ip})," (",t.ip,")"]})]}),e.jsx("button",{style:{background:"transparent",border:"none",color:"#999",fontSize:"1.4rem",cursor:"pointer",padding:"4px 8px"},onClick:()=>$(!1),children:"×"})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px",maxHeight:"280px",overflowY:"auto",marginBottom:"20px",paddingRight:"4px"},children:k.length===0?e.jsx("div",{style:{padding:"16px",textAlign:"center",color:"#ef4444",fontSize:"0.85rem"},children:"⚠️ Không có Agent nào đang Online để thực thi lệnh."}):k.map(d=>{var re;const a=(T||((re=k[0])==null?void 0:re.agent_uid)||"")===d.agent_uid,he=d.agent_uid===t.agent_uid;return e.jsxs("div",{onClick:()=>H(d.agent_uid),style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderRadius:"10px",border:a?"2px solid #3b82f6":"1px solid rgba(255, 255, 255, 0.08)",background:a?"rgba(59, 130, 246, 0.12)":"rgba(255, 255, 255, 0.03)",cursor:"pointer",transition:"all 0.2s"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",border:a?"5px solid #3b82f6":"2px solid #666",background:"#fff",boxSizing:"border-box"}}),e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.88rem",fontWeight:600,color:"#fff"},children:["🖥️ ",d.hostname||d.agent_uid]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#aaa",marginTop:"2px"},children:["IP: ",d.local_ip||"127.0.0.1"," · Port: ",d.web_port||9173]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"},children:[e.jsx("span",{style:{fontSize:"0.7rem",padding:"2px 8px",borderRadius:"12px",background:"rgba(16, 185, 129, 0.2)",color:"#10b981",fontWeight:600},children:"Online"}),he&&e.jsx("span",{style:{fontSize:"0.65rem",color:"#60a5fa",fontWeight:600},children:"(Gợi ý mặc định)"})]})]},d.agent_uid||d.id)})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[e.jsx("button",{style:{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(255, 255, 255, 0.15)",background:"transparent",color:"#ccc",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>$(!1),children:"Hủy"}),e.jsx("button",{style:{padding:"8px 18px",borderRadius:"8px",border:"none",background:"#3b82f6",color:"#fff",fontSize:"0.82rem",fontWeight:600,cursor:k.length===0?"not-allowed":"pointer",opacity:k.length===0?.5:1},disabled:k.length===0,onClick:()=>{$(!1),Se(t,T)},children:"🚀 Thực thi Cập nhật"})]})]})})})]},t.id)}function ri(t){const{setCopierCredentials:o,activeAgentUid:u,activeLoadingFile:f,activeModal:P,activeTab:N,addCameraLoading:E,addressBookModal:G,agentUid:te,agents:J,cameraAgentUid:k,cameraFileFilter:g,cameras:z,camerasLoading:j,canNavigateNext:Z,canNavigatePrev:K,commandStatus:m,copierCredentials:R,deleteCameraLoading:_,deleteScanPointModal:S,destToDelete:Q,detectBrand:X,editIpData:ge,editIpModal:Se,editIpNewIp:Ne,editIpSaving:me,expandedCopierId:ie,expandedDriverMenus:ee,expandedDrivers:ce,expandedPrinters:x,fetchLanSitesData:W,fetchRemotePage:$,fileTypeFilter:T,filteredPrinters:H,getDestinationStatus:oe=()=>({label:"✔ ACTIVE",type:"success",title:""}),getTargetAgentUid:se,handleCopierClick:_e,handleDeleteDest:ve,handleEditIP:xe,handleOpenStorageFiles:le,handleRefetchAddressBook:y,handleRemoteInstallDriver:p,handleSaveAuth:h,infoDetailModal:I,installDriverModal:O,installDriverSaving:L,installedCount:b,isAllInstalled:r,lanSites:c,lanSitesLoading:l,liveAddressBooks:s,mockAgentApi:v,newCamIp:B,newCamName:q,newCamPass:V,newCamPort:Y,newCamRtsp:D,newCamUser:d,onlineAgents:F,pendingScanPoints:a,printers:he,publicFtpData:re,publicFtpModal:we,publicFtpSaving:Te,record30sLoading:Ke,remoteLockModal:tt,remoteLockPrinter:Be,saveAuthLoading:Ie,selectedAgentUid:A,selectedCamera:U,selectedCameraAgentUid:de,selectedLan:Ae,selectedLanUid:Ee,setActiveModal:fe,setExpandedDriverMenus:at,setExpandedDrivers:ue,setPublicFtpData:Ge,setRemoteLockPrinter:Ye,showToast:_t,storageFilesModal:ot,storageFilesModalData:Ht,storageFilesModalLoading:kt,storageFilterDate:Et,submittingScanPoint:Pt,toshibaVncData:jt,utilityActionPending:Lt,utilityCommands:ar,utilityCommandsLoading:or,utilitySettingsLoading:sr,utilityStatusMsg:lr,viewOutputModal:Je,vncTunnelLoading:cr,webPreviewHistory:dr,webPreviewHistoryIndex:qe,webPreviewLoading:pr,webPreviewModal:mr,webPreviewTab:Rt}=t;return e.jsx(e.Fragment,{children:e.jsxs(Ve.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:n.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(Dr,{className:"copiers-grid",style:n.gridContainer,children:l||Lt==="force_subnet_scan"||Object.entries(m||{}).some(([De,Oe])=>(Oe==null?void 0:Oe.isPending)&&De.startsWith("scan_lan_"))?e.jsxs("div",{style:n.loadingContainer,children:[e.jsx(nt,{}),e.jsx("div",{style:n.loadingText,children:Lt==="force_subnet_scan"||Object.entries(m||{}).some(([De,Oe])=>(Oe==null?void 0:Oe.isPending)&&De.startsWith("scan_lan_"))?"⏳ Đang dò quét mạng LAN tìm máy in & photocopy...":"Đang tải dữ liệu thiết bị..."})]}):H.length===0?e.jsxs("div",{style:n.emptyStateContainer,children:[e.jsx("div",{style:n.emptyIcon,children:"🖨️"}),e.jsx("div",{style:n.emptyTitle,children:"Chưa có danh sách máy in, hãy nhấn nút khởi tạo"}),e.jsx("div",{style:n.emptySubtitle,children:"Vui lòng chọn mạng LAN khác hoặc nhấp nút khởi tạo / Dò quét mạng LAN để tìm kiếm thiết bị."})]}):H.map(De=>{const Oe=String(ie)===String(De.id),Nt=Fe=>{if(!Fe)return null;let Ue=Fe;if(typeof Ue=="string"){let ut=Ue.trim();if(ut.includes("__ADDRESS_BOOK_JSON_START__"))try{ut=ut.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),ut=ut.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{Ue=JSON.parse(ut)}catch{return null}}if(typeof Ue!="object")return null;let Ft=0;for(;Ue&&typeof Ue=="object"&&!Array.isArray(Ue.address_list)&&Ue.address_book_sync&&Ft<5;)Ue=Ue.address_book_sync,Ft++;return Ue},Dt=(De.mac_address||De.mac_id||"").toUpperCase().replace(/-/g,":"),ze=De.id!==void 0&&De.id!==null?String(De.id):"",Mt=De.ip||"",xt=Nt(Dt&&(s==null?void 0:s[Dt])||ze&&(s==null?void 0:s[ze])||Mt&&(s==null?void 0:s[Mt])||null),ye=Nt(De.address_book_sync),mt=!!(xt&&Array.isArray(xt.address_list)),Ot=!!(ye&&Array.isArray(ye.address_list)),Ce=mt?xt:Ot?ye:xt||ye||{};Array.isArray(Ce.address_list)&&Ce.address_list.filter(Fe=>{if(!Fe||typeof Fe!="object"||Fe.type==="Summary")return!1;const Ue=(Fe.name||"").trim();return Ue==="Summary"||Ue==="Total"||Ue.startsWith("Users:")?!1:!!(Ue||Fe.entry_id||Fe.registration_no&&Fe.registration_no!=="-"||Fe.email_address||Fe.email||Fe.folder||Fe.physical_path)});const Vt=!!(mt||Ot),Kt=((Ae==null?void 0:Ae.agents)||[]).filter(Fe=>Fe.is_agent_active),Jt=se?se(De.id):A||De.agent_uid||"";return e.jsx(ti,{p:De,selectedLan:Ae,activeAgentUid:te,selectedAgentUid:Jt,copierCredentials:R||{},setCopierCredentials:o,saveAuthLoading:Ie||{},handleSaveAuth:h,isExpanded:Oe,handleCopierClick:_e,onlineAgents:Kt,detectBrand:X||(()=>"generic"),showToast:_t||(()=>{}),fetchRemotePage:$||(()=>{}),setRemoteLockPrinter:Ye,setActiveModal:fe,hasAddressList:Vt,sync:Ce,commandStatus:m||{},getDestinationStatus:oe||(()=>({})),handleOpenStorageFiles:le||(()=>{}),handleEditIP:xe||(()=>{}),handleDeleteDest:ve||(()=>{}),handleRefetchAddressBook:y||(()=>{}),expandedDrivers:ce||{},setExpandedDrivers:ue,expandedDriverMenus:ee||{},setExpandedDriverMenus:at,handleRemoteInstallDriver:p||(()=>{}),setPublicFtpData:Ge},De.id)})})]},"copiers-tab")})}function ir(t){const o=(t||"").trim();return o&&o.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function ni(t){const{AgentPage:o,activeLoadingFile:u,activeModal:f,activeTab:P,allocatedVncAddr:N,cameraFiles:E,cameraForm:G,cameraLogs:te,cameraStatus:J,cameraTestLoading:k,cameraTestResult:g,cameras:z,camerasLoading:j,commandStatus:Z,confirmModal:K,copierCredentials:m,customRecordDuration:R,customRunCommand:_,deleteScanPointModal:S,directLan:Q,editIpModalData:X,editableSettingsText:ge,emailFileCounts:Se,executeRemoteInstallDriver:Ne,expandedDriverMenus:me,expandedDrivers:ie,expandedPrinters:ee,fetchCameraFiles:ce,fetchCameraStatus:x,fetchRemotePage:W,fetchRemotePageOld:$,ftpDetailData:T,getDestinationStatus:H=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:oe=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:se,handleAddPrivateFtp:_e,handleAddPublicFtp:ve,handleCloseWebPreview:xe,handleConfirmDeleteScanPoint:le,handleCopierClick:y,handleDeleteCamera:p,handleDeleteCameraFile:h,handleDeleteDest:I,handleEditIP:O,handleFetchEntryDetail:L,handleHistoryBack:b,handleHistoryForward:r,handleOpenStorageFiles:c,handlePlaySegmentFile:l,handleQueryVideo:s,handleRecord30s:v,handleRefetchAddressBook:B,handleRemoteInstallDriver:q,handleSaveAuth:V,handleSaveCameraConfig:Y,handleSaveEditIP:D,handleTriggerUtilityExec:d,handleSaveSettings:F,handleStartToshibaVnc:a,handleTestCameraConnection:he,handleToggleDirectLan:re,handleViewScanPointsJson:we,installDriverModal:Te,ipInputModal:Ke,isRecording30s:tt,isSavingSettings:Be,lanSites:Ie,lanSitesLoading:A,liveAddressBooks:U,lockAspect:de,pollCommandStatus:Ae,previewBlobUrl:Ee,privateFtpData:fe,privateFtpLoading:at,publicFtpData:ue,publicFtpLoading:Ge,queriedVideoUrl:Ye,queryDuration:_t,queryTimestamp:ot,queryVideoLoading:Ht,recording30sCountdown:kt,remoteLockPrinter:Et,resolveRelativePath:Pt,saveAuthLoading:jt,savedLocal:Lt,scaleX:ar,scaleY:or,scanAutoOpenDir:sr,scanAutoOpenFile:lr,scanPointsViewerModal:Je,selectedCamera:cr,selectedCameraAgentUid:dr,selectedLan:qe,selectedLanUid:pr,selectedTargetAgents:mr,selectedUtilityAgent:Rt,setActiveLoadingFile:De,setActiveModal:Oe,setActiveTab:Nt,setAllocatedVncAddr:Dt,setCameraFiles:ze,setCameraForm:Mt,setCameraLogs:xt,setCameraStatus:ye,setCameraTestLoading:mt,setCameraTestResult:Ot,setCameras:Ce,setCamerasLoading:Vt,setCommandStatus:Kt,setConfirmModal:Jt,setCopierCredentials:Fe,setCustomRecordDuration:Ue,setCustomRunCommand:Ft,setDeleteScanPointModal:ut,setDirectLan:Br,setEditIpModalData:Gr,setEditableSettingsText:zr,setEmailFileCounts:$r,setExpandedDriverMenus:It,setExpandedDrivers:Wr,setExpandedPrinters:Hr,setFtpDetailData:qt,setInstallDriverModal:At,setIpInputModal:Vr,setIsRecording30s:Ut,setIsSavingSettings:ur,setLanSites:Kr,setLanSitesLoading:Jr,setLiveAddressBooks:qr,setLockAspect:Xr,setPreviewBlobUrl:Xt,setPrivateFtpData:st,setPrivateFtpLoading:Xe,setPublicFtpData:Qr,setPublicFtpLoading:Yr,setQueriedVideoUrl:Zr,setQueryDuration:en,setQueryTimestamp:tn,setQueryVideoLoading:rn,setRecording30sCountdown:nn,setRemoteLockPrinter:gr,setSaveAuthLoading:an,setScaleX:Bt,setScaleY:on,setScanAutoOpenDir:sn,setScanAutoOpenFile:ln,setScanPointsViewerModal:cn,setSelectedCamera:dn,setSelectedCameraAgentUid:pn,setSelectedLanUid:mn,setSelectedTargetAgents:un,setSelectedUtilityAgent:hr,setSettingsSaveStatus:gn,setShowPreviewDetails:hn,setShowSettings:fn,setStorageFiles:Gt,setStorageLoading:_n,setStorageModalData:xn,setToasts:yn,setToshibaVncData:bn,setUtilityActionPending:Qt,setUtilityCommands:Sn,setUtilityCommandsLoading:vn,setUtilitySettingsLoading:wn,setUtilityStatusMsg:Tn,setViewOutputModal:Cn,setVncTunnelLoading:Pn,setWebPreviewHistory:In,setWebPreviewHistoryIndex:An,setWebPreviewLoading:ft,setWebPreviewModal:kn,setWebPreviewTab:En,settingsSaveStatus:jn,showPreviewDetails:lt,showSettings:yt,storageFiles:Ln,storageLoading:Rn,storageModalData:Nn,toasts:Dn,toshibaVncData:bt,utilityActionPending:Mn,utilityCommands:ct,utilityCommandsLoading:On,utilitySettingsLoading:Fn,utilityStatusMsg:Qe,viewOutputModal:Yt,vncTunnelLoading:fr,webPreviewHistory:zt,webPreviewHistoryIndex:Un,webPreviewLoading:rt,webPreviewModal:je,webPreviewTab:Zt}=t;return e.jsx(e.Fragment,{children:e.jsx(Ve.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:n.tabContent,children:e.jsx(Dr,{children:!qe||(qe.agents||[]).filter(Pe=>Pe.is_agent_active).length===0?e.jsx("div",{style:n.emptyText,children:"⚠️ Không tìm thấy Agent (máy tính) nào đang kết nối khớp với IP Public này."}):(qe.agents||[]).filter(Pe=>Pe.is_agent_active).map(Pe=>{const St=Pe.is_agent_active;return e.jsxs(Mr,{children:[e.jsxs("div",{style:n.cardHeader,children:[e.jsxs("span",{style:n.cardTitle,children:["💻 ",Pe.hostname]}),e.jsx("span",{style:{...n.statusBadge,color:St?"var(--color-status-online)":"var(--color-status-offline)",borderColor:St?"var(--color-status-online)":"var(--color-status-offline)",background:St?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:St?Pe.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]}),e.jsxs("div",{style:n.cardDetails,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"UID:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:Pe.agent_uid})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...n.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[Pe.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async ke=>{ke.stopPropagation();try{const pe=await it(Pe.agent_uid,"get_agent_ip","");if(pe.ok&&pe.command_id){t.showToast&&t.showToast("Đang yêu cầu lấy lại IP cục bộ...","info");const Ze=pe.command_id,$t=Date.now(),vt=setInterval(async()=>{try{if(Date.now()-$t>12e3){clearInterval(vt);return}const dt=await Ct(Ze);dt.status==="success"?(clearInterval(vt),t.fetchLanSitesData&&await t.fetchLanSitesData(!0),t.showToast&&t.showToast("Đã cập nhật IP cục bộ mới nhất!","success")):dt.status==="failed"&&(clearInterval(vt),t.showToast&&t.showToast("Không thể lấy lại IP cục bộ: "+(dt.error||"Thất bại"),"error"))}catch(dt){console.error(dt),clearInterval(vt)}},1e3)}else t.showToast&&t.showToast("Gửi yêu cầu thất bại: "+(pe.error||"Lỗi kết nối"),"error")}catch(pe){t.showToast&&t.showToast("Lỗi: "+pe.message,"error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:ke=>ke.currentTarget.style.opacity="1",onMouseLeave:ke=>ke.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:n.detailValue,children:Pe.local_mac||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:n.detailValue,children:(()=>{const ke=(Pe.ftp_sites||[]).find($e=>($e.name||"").toLowerCase()==="goxprint")||(Pe.ftp_sites||[])[0],pe=(ke==null?void 0:ke.path)||"",Ze=ir((qe==null?void 0:qe.lan_uid)||""),$t=ir(Pe.agent_uid||""),dt=`storage/uploads/scans/${ir(Pe.lead||"default")}/${Ze}/${$t}/`,gt=qe?qe.emails.filter($e=>$e.email_type==="private"&&$e.pc_name&&$e.pc_name.toLowerCase().trim()===Pe.agent_uid.toLowerCase().trim()):[],_r=gt.reduce(($e,wt)=>$e+(Se[wt.email]??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:pe?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:pe?"normal":"italic"},children:pe||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:dt})]})]}),gt.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[gt.map($e=>{const wt=Se[$e.email]??0;return e.jsxs("button",{style:{...n.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>c((qe==null?void 0:qe.lan_uid)||"",$e.email),title:`Xem tệp của ${$e.email}`,children:["📁 ",wt," tệp"]},$e.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[_r," tệp"]})]})]}),gt.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:n.detailValue,children:Pe.ftp_ports||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:n.detailValue,children:e.jsx("button",{onClick:()=>{hr(Pe),Oe("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:n.detailValue,children:Pe.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!Pe.ftp_sites||Pe.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:Pe.ftp_sites.map((ke,pe)=>{const Ze=ke.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${Ze?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:Ze?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:Ze?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:Ze?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:Ze?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",ke.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",Ze?"Đang chạy":"Đã dừng",")"]})]}),ke.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",ke.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:ke.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:ke.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:ke.ftp_password||"goxprint"})]})]})]})]},pe)})})]})]},Pe.agent_uid)})})},"agents-tab")})}const ii=t=>{if(t==null)return"";if(typeof t=="object")try{return JSON.stringify(t,null,2)}catch{return String(t)}if(typeof t=="string"){const o=t.trim();if(o.startsWith("{")&&o.endsWith("}")||o.startsWith("[")&&o.endsWith("]"))try{const u=JSON.parse(o);return JSON.stringify(u,null,2)}catch{return t}}return String(t)};function ai({src:t,alt:o}){const[u,f]=We.useState(1),[P,N]=We.useState({x:0,y:0}),[E,G]=We.useState(!1),[te,J]=We.useState({x:0,y:0}),k=()=>f(_=>Math.min(_+.25,5)),g=()=>{f(_=>{const S=Math.max(_-.25,1);return S===1&&N({x:0,y:0}),S})},z=()=>{f(1),N({x:0,y:0})},j=_=>{_.preventDefault();const S=_.deltaY<0?.15:-.15;f(Q=>{const X=Math.min(Math.max(Q+S,1),5);return X===1&&N({x:0,y:0}),X})},Z=_=>{u<=1||(_.preventDefault(),G(!0),J({x:_.clientX-P.x,y:_.clientY-P.y}))},K=_=>{E&&N({x:_.clientX-te.x,y:_.clientY-te.y})},m=()=>G(!1),R=()=>{u>1?z():f(2.5)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,minHeight:0,width:"100%",position:"relative",background:"#090d16",borderRadius:"8px",border:"1px solid var(--color-surface-light)",overflow:"hidden",userSelect:"none"},onWheel:j,children:[e.jsxs("div",{style:{position:"absolute",top:"10px",right:"10px",zIndex:10,display:"flex",alignItems:"center",gap:"6px",background:"rgba(18, 18, 26, 0.85)",backdropFilter:"blur(8px)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"4px 8px",boxShadow:"0 4px 12px rgba(0,0,0,0.4)"},children:[e.jsx("button",{type:"button",onClick:g,disabled:u<=1,style:{background:"none",border:"none",color:u<=1?"var(--color-text-secondary)":"var(--color-text)",cursor:u<=1?"not-allowed":"pointer",fontSize:"0.85rem",padding:"2px 6px",borderRadius:"4px"},title:"Thu nhỏ (-)",children:"🔍-"}),e.jsxs("span",{style:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-primary)",minWidth:"42px",textAlign:"center"},children:[Math.round(u*100),"%"]}),e.jsx("button",{type:"button",onClick:k,disabled:u>=5,style:{background:"none",border:"none",color:u>=5?"var(--color-text-secondary)":"var(--color-text)",cursor:u>=5?"not-allowed":"pointer",fontSize:"0.85rem",padding:"2px 6px",borderRadius:"4px"},title:"Phóng to (+)",children:"🔍+"}),e.jsx("button",{type:"button",onClick:z,style:{background:"none",border:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:"0.85rem",padding:"2px 6px",borderRadius:"4px"},title:"Đặt lại (Reset)",children:"🔄"})]}),e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:u>1?E?"grabbing":"grab":"default"},onMouseDown:Z,onMouseMove:K,onMouseUp:m,onMouseLeave:m,onDoubleClick:R,children:e.jsx("img",{src:t,alt:o||"Screenshot",style:{maxWidth:"100%",maxHeight:"70vh",borderRadius:"6px",objectFit:"contain",boxShadow:"0 4px 24px rgba(0,0,0,0.6)",transform:`translate(${P.x}px, ${P.y}px) scale(${u})`,transition:E?"none":"transform 0.15s ease-out",transformOrigin:"center center"},draggable:!1})})]})}function oi({webPreviewModal:t,handleCloseWebPreview:o,directLan:u,webPreviewLoading:f,previewIframeRef:P,previewBlobUrl:N}){const[E,G]=We.useState(1),te=t.url?t.url:u?`http://${t.ip}${t.path||"/"}`:N,J=()=>G(j=>Math.min(j+.25,4)),k=()=>G(j=>Math.max(j-.25,1)),g=()=>G(1),z=j=>{if(j.ctrlKey||E>1){j.preventDefault();const Z=j.deltaY<0?.15:-.15;G(K=>Math.min(Math.max(K+Z,1),4))}};return e.jsxs("div",{className:"web-preview-modal-overlay",style:{position:"fixed",inset:0,zIndex:250,background:"#090d16",display:"flex",flexDirection:"column",width:"100vw",height:"100vh",overflow:"hidden"},onClick:j=>j.stopPropagation(),children:[e.jsx("style",{children:`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}),e.jsxs("div",{style:{position:"absolute",top:"12px",right:"16px",zIndex:999,display:"flex",alignItems:"center",gap:"8px",background:"rgba(15, 23, 42, 0.92)",backdropFilter:"blur(12px)",border:"1px solid rgba(255, 255, 255, 0.18)",borderRadius:"10px",padding:"6px 12px",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.6)",userSelect:"none"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.78rem",color:"var(--color-text)",fontWeight:600,paddingRight:"4px"},children:[e.jsx("span",{style:{color:"#10b981"},children:"🟢"}),e.jsx("span",{children:t.title||"WIM"}),e.jsxs("span",{style:{fontSize:"0.7rem",color:"var(--color-text-secondary)",fontFamily:"monospace"},children:["(",t.ip,")"]})]}),e.jsx("div",{style:{width:"1px",height:"18px",background:"rgba(255,255,255,0.15)",margin:"0 2px"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("button",{type:"button",onClick:k,disabled:E<=1,style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:E<=1?"rgba(255,255,255,0.3)":"white",cursor:E<=1?"not-allowed":"pointer",fontSize:"0.85rem",padding:"3px 8px",borderRadius:"6px"},title:"Thu nhỏ (-)",children:"🔍-"}),e.jsxs("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-primary)",minWidth:"42px",textAlign:"center"},children:[Math.round(E*100),"%"]}),e.jsx("button",{type:"button",onClick:J,disabled:E>=4,style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:E>=4?"rgba(255,255,255,0.3)":"white",cursor:E>=4?"not-allowed":"pointer",fontSize:"0.85rem",padding:"3px 8px",borderRadius:"6px"},title:"Phóng to (+)",children:"🔍+"}),e.jsx("button",{type:"button",onClick:g,style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:"0.85rem",padding:"3px 8px",borderRadius:"6px"},title:"Đặt lại (Reset Zoom)",children:"🔄"})]}),e.jsx("div",{style:{width:"1px",height:"18px",background:"rgba(255,255,255,0.15)",margin:"0 2px"}}),e.jsx("button",{type:"button",onClick:()=>{if(P&&P.current){const Z=P.current.src.split("#")[0].replace(/([?&])_t=\d+/,""),K=Z.includes("?")?"&":"?";P.current.src=Z+K+`_t=${Date.now()}`}},style:{background:"rgba(16, 185, 129, 0.2)",border:"1px solid rgba(16, 185, 129, 0.4)",color:"#34d399",cursor:"pointer",fontSize:"0.76rem",fontWeight:600,padding:"4px 10px",borderRadius:"6px",display:"flex",alignItems:"center",gap:"4px"},title:"Bắt buộc nạp lại trang WIM từ máy in qua Tunnel",children:"⚡ Nạp lại (Tunnel)"}),e.jsx("button",{type:"button",onClick:()=>window.open(t.url||`http://${t.ip}/`,"_blank"),style:{background:"rgba(59, 130, 246, 0.2)",border:"1px solid rgba(59, 130, 246, 0.4)",color:"#60a5fa",cursor:"pointer",fontSize:"0.76rem",fontWeight:600,padding:"4px 10px",borderRadius:"6px",display:"flex",alignItems:"center",gap:"4px"},title:"Mở sang tab trình duyệt mới",children:"↗️ Tab mới"}),e.jsx("button",{type:"button",onClick:o,style:{background:"#ef4444",border:"none",color:"white",cursor:"pointer",fontSize:"0.82rem",fontWeight:700,padding:"4px 12px",borderRadius:"6px",display:"flex",alignItems:"center",gap:"4px",boxShadow:"0 2px 8px rgba(239,68,68,0.4)"},title:"Đóng modal WIM",children:"✕ Đóng"})]}),e.jsx("div",{style:{flex:1,width:"100vw",height:"100vh",overflow:E>1?"auto":"hidden",background:"white",position:"relative"},onWheel:z,children:t.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",gap:"14px",background:"#090d16",color:"white"},children:[e.jsxs("svg",{style:{width:"42px",height:"42px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsxs("span",{style:{fontSize:"0.95rem",fontWeight:600},children:["Đang kết nối đến WIM (",t.ip,")..."]})]}):t.html&&t.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",gap:"14px",padding:"24px",background:"#090d16",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"3rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"1rem",fontWeight:700},children:"Lỗi kết nối Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.8rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"16px",background:"rgba(239, 68, 68, 0.1)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.2)",maxWidth:"600px",width:"100%",fontFamily:"monospace"},children:t.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{width:E>1?`${100*E}%`:"100%",height:E>1?`${100*E}%`:"100%",transform:E>1?`scale(${E})`:"none",transformOrigin:"top left",transition:"transform 0.15s ease-out",position:"relative"},children:[e.jsx("iframe",{ref:P,src:te,style:{width:"100%",height:"100%",border:"none",background:"white"}}),f&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang nạp dữ liệu trang..."})]})]})})]})}function si(t){var Sr,vr,wr,Tr,Cr,Pr,Ir,Ar,kr,Er,jr;const{AgentPage:o,activeLoadingFile:u,activeModal:f,activeTab:P,allocatedVncAddr:N,cameraFiles:E,cameraForm:G,cameraLogs:te,cameraStatus:J,cameraTestLoading:k,cameraTestResult:g,cameras:z,camerasLoading:j,commandStatus:Z,confirmModal:K={isOpen:!1},accessDeniedState:m={isOpen:!1,ip:""},copierCredentials:R,customRecordDuration:_,customRunCommand:S,deleteScanPointModal:Q={isOpen:!1},directLan:X,editIpModalData:ge={isOpen:!1},editableSettingsText:Se,emailFileCounts:Ne,executeRemoteInstallDriver:me,expandedDriverMenus:ie,expandedDrivers:ee,expandedPrinters:ce,fetchCameraFiles:x,fetchCameraStatus:W,fetchRemotePage:$,fetchRemotePageOld:T,formatBytes:H,formatJsonText:oe,ftpDetailData:se,getDestinationStatus:_e=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:ve=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:xe,handleAddPrivateFtp:le,handleAddPublicFtp:y,handleCloseWebPreview:p,handleConfirmDeleteScanPoint:h,handleCopierClick:I,handleDeleteCamera:O,handleDeleteCameraFile:L,handleDeleteDest:b,handleEditIP:r,handleEmergencyRestart:c,handleFetchEntryDetail:l,handleHistoryBack:s,handleHistoryForward:v,handleOpenStorageFiles:B,handlePlaySegmentFile:q,handleQueryVideo:V,handleRecord30s:Y,handleRefetchAddressBook:D,handleRemoteInstallDriver:d,handleSaveAuth:F,handleSaveCameraConfig:a,handleSaveEditIP:he,handleSaveSettings:re,handleStartToshibaVnc:we,handleTestCameraConnection:Te,handleToggleDirectLan:Ke,handleToggleSetting:tt,handleTriggerUtility:Be,handleTriggerUtilityExec:Ie,handleViewScanPointsJson:A,installDriverModal:U={isOpen:!1},ipInputModal:de={isOpen:!1},isRecording30s:Ae,isSavingSettings:Ee,lanSites:fe,lanSitesLoading:at,liveAddressBooks:ue,lockAspect:Ge,modalContentRef:Ye,pollCommandStatus:_t,previewBlobUrl:ot,previewIframeRef:Ht,privateFtpData:kt,privateFtpLoading:Et,publicFtpData:Pt,publicFtpLoading:jt,queriedVideoUrl:Lt,queryDuration:ar,queryTimestamp:or,queryVideoLoading:sr,recording30sCountdown:lr,remoteLockPrinter:Je,resolveRelativePath:cr,saveAuthLoading:dr,savedLocal:qe,scaleX:pr,scaleY:mr,scanAutoOpenDir:Rt,scanAutoOpenFile:De,scanPointsViewerModal:Oe={isOpen:!1},selectedCamera:Nt,selectedCameraAgentUid:Dt,selectedLan:ze,selectedLanUid:Mt,selectedTargetAgents:xt,selectedUtilityAgent:ye,setAccessDeniedState:mt,setActiveLoadingFile:Ot,setActiveModal:Ce,setActiveTab:Vt,setAllocatedVncAddr:Kt,setCameraFiles:Jt,setCameraForm:Fe,setCameraLogs:Ue,setCameraStatus:Ft,setCameraTestLoading:ut,setCameraTestResult:Br,setCameras:Gr,setCamerasLoading:zr,setCommandStatus:$r,setConfirmModal:It,setCopierCredentials:Wr,setCustomRecordDuration:Hr,setCustomRunCommand:qt,setDeleteScanPointModal:At,setDirectLan:Vr,setEditIpModalData:Ut,setEditableSettingsText:ur,setEmailFileCounts:Kr,setExpandedDriverMenus:Jr,setExpandedDrivers:qr,setExpandedPrinters:Xr,setFtpDetailData:Xt,setInstallDriverModal:st,setIpInputModal:Xe,setIsRecording30s:Qr,setIsSavingSettings:Yr,setLanSites:Zr,setLanSitesLoading:en,setLiveAddressBooks:tn,setLockAspect:rn,setPreviewBlobUrl:nn,setPrivateFtpData:gr,setPrivateFtpLoading:an,setPublicFtpData:Bt,setPublicFtpLoading:on,setQueriedVideoUrl:sn,setQueryDuration:ln,setQueryTimestamp:cn,setQueryVideoLoading:dn,setRecording30sCountdown:pn,setRemoteLockPrinter:mn,setSaveAuthLoading:un,setScaleX:hr,setScaleY:gn,setScanAutoOpenDir:hn,setScanAutoOpenFile:fn,setScanPointsViewerModal:Gt,setSelectedCamera:_n,setSelectedCameraAgentUid:xn,setSelectedLanUid:yn,setSelectedTargetAgents:bn,setSelectedUtilityAgent:Qt,setSettingsSaveStatus:Sn,setShowPreviewDetails:vn,setShowSettings:wn,setStorageFiles:Tn,setStorageLoading:Cn,setStorageModalData:Pn,setToasts:In,setToshibaVncData:An,setUtilityActionPending:ft,setUtilityCommands:kn,setUtilityCommandsLoading:En,setUtilitySettingsLoading:jn,setUtilityStatusMsg:lt,setViewOutputModal:yt,setVncTunnelLoading:Ln,setWebPreviewHistory:Rn,setWebPreviewHistoryIndex:Nn,setWebPreviewLoading:Dn,setWebPreviewModal:bt,setWebPreviewTab:Mn,settingsSaveStatus:ct,showPreviewDetails:On,showSettings:Fn,showToast:Qe,storageFiles:Yt,storageLoading:fr,storageModalData:zt={isOpen:!1},toasts:Un,toshibaVncData:rt,utilityActionPending:je,utilityCommands:Zt,utilityCommandsLoading:Pe,utilitySettingsLoading:St,utilityStatusMsg:ke,viewOutputModal:pe={isOpen:!1},vncTunnelLoading:Ze,webPreviewHistory:$t,webPreviewHistoryIndex:vt,webPreviewLoading:dt,webPreviewModal:gt={isOpen:!1},webPreviewTab:_r}=t,[$e,wt]=We.useState(""),[er,xr]=We.useState(!1),[yr,tr]=We.useState(""),br=typeof oe=="function"?oe:ii;We.useEffect(()=>{pe!=null&&pe.isOpen&&setTimeout(()=>{Ye&&Ye.current&&(Ye.current.scrollTop=Ye.current.scrollHeight)},100)},[pe==null?void 0:pe.isOpen,pe==null?void 0:pe.content]),We.useEffect(()=>{if(U!=null&&U.isOpen&&(!U.suggestedDrivers||U.suggestedDrivers.length===0)&&typeof st=="function"){const M=U.model||U.brand||U.printerId||"";M&&Re(`/api/v1/match-drivers?name=${encodeURIComponent(M)}`).then(ae=>{var w;if(ae&&ae.matches&&Array.isArray(ae.matches)&&ae.matches.length>0){const ne=ae.matches[0],be=(w=ne==null?void 0:ne.drivers)==null?void 0:w[0];st(Me=>({...Me,suggestedDrivers:ae.matches,brand:Me.brand||(ne==null?void 0:ne.brand)||"ricoh",model:Me.model||(ne==null?void 0:ne.model)||"Photocopy",driverName:Me.driverName||(be==null?void 0:be.name)||"",driverUrl:Me.driverUrl||(be==null?void 0:be.url)||""}))}}).catch(()=>{})}},[U==null?void 0:U.isOpen,U==null?void 0:U.printerId,U==null?void 0:U.model,U==null?void 0:U.brand]),We.useEffect(()=>{if(m!=null&&m.isOpen){const i=localStorage.getItem("gox_connect_public_ip")||"";wt(i||m.ip||""),tr("")}},[m==null?void 0:m.isOpen,m==null?void 0:m.ip]);const Bn=async i=>{const M=($e||(m==null?void 0:m.ip)||"").trim();if(!M){tr("Vui lòng nhập Public IP hợp lệ");return}xr(!0),tr("");try{localStorage.setItem("gox_connect_public_ip",M),await Re("/api/public-ips",{method:"POST",body:JSON.stringify({ip_address:M,description:"Allowed from App-Gox Modal",enabled:!0})}).catch(ae=>console.log("Allowed IP API response:",ae)),mt&&mt({isOpen:!1,ip:""}),t.fetchLanSitesData&&await t.fetchLanSitesData(!0)}catch(ae){console.error("Error connecting public IP:",ae),localStorage.setItem("gox_connect_public_ip",M),mt&&mt({isOpen:!1,ip:""}),t.fetchLanSitesData&&await t.fetchLanSitesData(!0)}finally{xr(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx(et,{children:f&&e.jsx("div",{style:n.modalOverlay,onClick:()=>Ce(null),children:e.jsxs(Ve.div,{style:n.modalCard,onClick:i=>i.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[f==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:n.modalSubtitle,children:zt.email})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:fr?e.jsxs("div",{style:n.modalLoading,children:[e.jsx(nt,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):Yt.length===0?e.jsx("div",{style:n.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:n.filesList,children:Yt.map((i,M)=>e.jsxs("div",{style:n.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${i.url}`,target:"_blank",rel:"noreferrer",style:n.fileLinkName,children:i.name}),e.jsxs("div",{style:n.fileMetaDetails,children:["Dung lượng: ",H(i.size)," · Mtime: ",new Date(i.mtime).toLocaleString("vi-VN")]}),i.upload_completed_at&&e.jsxs("div",{style:n.fileUploadMeta,children:["Tải lên VPS: ",new Date(i.upload_completed_at).toLocaleTimeString("vi-VN"),i.upload_duration!=null?` (${i.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${i.url}`,download:!0,target:"_blank",rel:"noreferrer",style:n.fileDownloadBtn,children:"Tải về"})]},M))})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>B(zt.lanUid,zt.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Ce(null),children:"Đóng"})]})]}),f==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:n.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:Pt.name,onChange:i=>Bt(M=>({...M,name:i.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: goxprint@gmail.com",value:Pt.email,onChange:i=>Bt(M=>({...M,email:i.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:n.modalInput,value:Pt.agentUid,onChange:i=>Bt(M=>({...M,agentUid:i.target.value})),children:(ze&&ze.agents||[]).filter(i=>i.is_agent_active).map(i=>e.jsxs("option",{value:i.agent_uid,children:[i.hostname," (",i.local_ip,")"]},i.agent_uid))})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:y,disabled:jt,children:jt?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Ce(null),children:"Hủy bỏ"})]})]}),f==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: user.pc1@gmail.com",value:kt.email,onChange:i=>gr(M=>({...M,email:i.target.value}))}),e.jsxs("span",{style:n.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",kt.agentUid]})]})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:le,disabled:Et,children:Et?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Ce(null),children:"Hủy bỏ"})]})]}),f==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:n.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(Sr=infoDetailData.details)==null?void 0:Sr.proto})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Server Host:"}),e.jsx("span",{style:n.detailValue,children:(vr=infoDetailData.details)==null?void 0:vr.server})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:n.detailValue,children:(wr=infoDetailData.details)==null?void 0:wr.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace"},children:(Tr=infoDetailData.details)==null?void 0:Tr.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>Ce(null),children:"Đóng cửa sổ"})})]}),f==="ftp_detail"&&se&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:n.modalSubtitle,children:["Cổng Port: ",se.port]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{Ce(null),Xt(null)},children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:se.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:se.error?"var(--color-error)":"var(--color-success)"},children:se.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),se.error&&e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...n.detailValue,color:"var(--color-error)"},children:se.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...n.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:se.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Ce(null),Xt(null)},children:"Đóng cửa sổ"})})]}),f==="utilities"&&ye&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:n.modalSubtitle,children:["Máy: ",ye.hostname," · IP: ",ye.local_ip,":",ye.web_port||9173]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{Ce(null),Qt(null),lt(null)},children:"×"})]}),e.jsxs("div",{style:{...n.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[ke&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:ke.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:ke.isError?"#ef4444":"#10b981",border:`1px solid ${ke.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:ke.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:St?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(nt,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:De,onChange:()=>tt("scan_auto_open_file",De),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Rt,onChange:()=>tt("scan_auto_open_dir",Rt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[Pe?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(nt,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsx(e.Fragment,{children:Zt.length>0?(()=>{const i=Zt.filter(w=>w.command!=="dxdiag"&&w.is_visible!==!1),M=i.findIndex(w=>w.command==="sync_all_scanpoints");if(M>-1){const[w]=i.splice(M,1);i.unshift(w)}const ae=async()=>{const w=ye==null?void 0:ye.agent_uid;if(w){Ie("open_printagentx_wim",`import webbrowser
webbrowser.open("http://localhost:9173")`);try{const Me=await(await fetch(`https://agentapi.quanlymay.com/api/agents/${encodeURIComponent(w)}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:"127.0.0.1",printer_port:9173})})).json(),pt=(Me==null?void 0:Me.url)||(Me==null?void 0:Me.url_port)||"";bt&&bt({isOpen:!0,title:`🌐 WIM PrintAgentX — Agent ${(ye==null?void 0:ye.hostname)||w}`,ip:(ye==null?void 0:ye.local_ip)||"127.0.0.1",path:"/",html:"DIRECT_LAN",url:pt?`https://printagentx.com/?tunnel_url=${encodeURIComponent(pt)}`:"https://printagentx.com",agentUid:w})}catch(ne){console.error("Failed to start agent web tunnel:",ne),bt&&bt({isOpen:!0,title:`🌐 WIM PrintAgentX — Agent ${(ye==null?void 0:ye.hostname)||w}`,ip:(ye==null?void 0:ye.local_ip)||"127.0.0.1",path:"/",html:"DIRECT_LAN",url:"https://printagentx.com",agentUid:w})}}};return i.map(w=>{const ne=w.command==="emergency_restart";let be=w.label,Me=w.icon||"🔧",pt=()=>Ie(w.command,w.command_content);return w.command==="open_web_setting"?(be="Mở WIM",Me=w.icon||"🌐",pt=ae):w.command==="create_scan_shortcut"?(be="Tạo shortcut Desktop",Me=w.icon||"🔗"):w.command==="emergency_restart"?(be="Emergency Kill",Me=w.icon||"🔌",pt=c):w.command==="check_watchdog"&&(be="Check watchdog",Me=w.icon||"🩺",pt=()=>{ye&&(ft("check_watchdog"),lt({text:"⌛ Đang kiểm tra watchdog...",isError:!1}),triggerAgentUtilityExec(ye.agent_uid,"check_watchdog",w.command_content||"").then(He=>{if(He.ok&&He.command_id){const Gn=Date.now(),rr=setInterval(async()=>{if(Date.now()-Gn>3e4){clearInterval(rr),lt({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),ft(null);return}try{const ht=await getCommandStatus(He.command_id);if(ht.status==="success"){clearInterval(rr);const nr=ht.result_payload||ht.result||ht.error||"Hoàn thành";yt({isOpen:!0,title:"🩺 Check Watchdog",content:nr}),lt(null),ft(null)}else if(ht.status==="failed"){clearInterval(rr);const nr=ht.error||ht.result_payload||ht.result||"Failed";yt({isOpen:!0,title:"🩺 Check Watchdog",content:nr}),lt(null),ft(null)}}catch{}},2e3)}else lt({text:"❌ "+(He.error||"Không thể gửi lệnh"),isError:!0}),ft(null)}).catch(He=>{lt({text:"❌ "+He.message,isError:!0}),ft(null)}))}),e.jsxs("button",{onClick:pt,disabled:je!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:ne?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:je!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:je!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:He=>{je===null&&(He.currentTarget.style.borderColor=ne?"#ef4444":"var(--color-primary)",He.currentTarget.style.background=ne?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:He=>{He.currentTarget.style.borderColor=ne?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",He.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:je===w.command?e.jsx(nt,{size:"sm"}):Me}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:ne?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"word-break"},children:be})]},w.command)})})():e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>Be("printers"),disabled:je!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:je!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:je!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:i=>{je===null&&(i.currentTarget.style.borderColor="var(--color-primary)",i.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:i=>{i.currentTarget.style.borderColor="var(--color-surface-light)",i.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:je==="printers"?e.jsx(nt,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"word-break"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>Be("scan"),disabled:je!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:je!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:je!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:i=>{je===null&&(i.currentTarget.style.borderColor="var(--color-primary)",i.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:i=>{i.currentTarget.style.borderColor="var(--color-surface-light)",i.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:je==="scan"?e.jsx(nt,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"word-break"},children:"Thư mục Scan"})]})]})}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:S,onChange:i=>qt(i.target.value),onKeyDown:i=>{i.key==="Enter"&&S.trim()&&Be("run_command",{command_line:S.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:je!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{S.trim()&&Be("run_command",{command_line:S.trim()})},disabled:je!==null||!S.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:S.trim()?"var(--color-primary)":"var(--color-surface)",color:S.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:S.trim()&&je===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:je==="run_command"?e.jsx(nt,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(i=>e.jsx("button",{onClick:()=>qt(i.cmd),disabled:je!==null,title:i.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:S===i.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:S===i.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:je!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:i.label},i.cmd))})]})]})]})]}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Ce(null),Qt(null),lt(null)},children:"Đóng cửa sổ"})})]}),f==="edit_ip"&&ge&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:i=>{const M=i.target.value;M&&Ut(ae=>{if(!ae)return null;const w=ae.newPort||"2130";return{...ae,newIp:`${M}:${w}`,newPort:w}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((ze==null?void 0:ze.agents)||[]).map((i,M)=>{const ae=i.local_ip||i.ip||"",w=i.hostname||i.uid||`Agent ${M+1}`;return e.jsxs("option",{value:ae,children:[w," (",ae,")"]},M)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:ge.newPort||"",onChange:i=>{const M=i.target.value;Ut(ae=>{if(!ae)return null;let w=ae.newIp||"";return w.includes(":")&&(w=w.split(":")[0]),{...ae,newPort:M,newIp:M?`${w}:${M}`:w}})},placeholder:"2130",style:n.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:ge.newIp,onChange:i=>{const M=i.target.value;Ut(ae=>{if(!ae)return null;let w=ae.newPort||"2130";return M.includes(":")&&(w=M.split(":")[1].trim()||w),{...ae,newIp:M,newPort:w}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:n.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",ge.entry.folder||ge.entry.physical_path||ge.entry.folder_path]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>Ce(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...n.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(ge.newIp||"").trim().includes(":")){Qe("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}he()},disabled:!ge.newIp.trim(),children:"Lưu lại"})]})]}),f==="remote_lock"&&Je&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:Je.name})," (",Je.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Ce(null),Qe(`Đang gửi lệnh khóa máy ${Je.name}...`,"info",3e3),modifyDeviceAddressss({ip:Je.ip,action:"lock_machine",agent_uid:Je.agentUid}).then(i=>{i.ok?Qe(`Đã gửi lệnh khóa máy ${Je.name} thành công!`,"success"):Qe("Lỗi: "+(i.error||"Failed"),"error")}).catch(i=>{Qe("Lỗi: "+i.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Ce(null),Qe(`Đang gửi lệnh mở khóa máy ${Je.name}...`,"info",3e3),modifyDeviceAddressss({ip:Je.ip,action:"enable_machine",agent_uid:Je.agentUid}).then(i=>{i.ok?Qe(`Đã gửi lệnh mở khóa máy ${Je.name} thành công!`,"success"):Qe("Lỗi: "+(i.error||"Failed"),"error")}).catch(i=>{Qe("Lỗi: "+i.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),f==="toshiba_vnc"&&rt&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["📺 Kết nối VNC - ",rt.printerName]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Ce(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:Ze?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:X?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{Ce(null),window.open(`http://${rt.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):N?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${rt.agentUid}&ip=${rt.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async i=>{const M=i.currentTarget.getBoundingClientRect(),ae=i.clientX-M.left,w=i.clientY-M.top,ne=ae/M.width,be=w/M.height,Me=Math.round(ne*1024),pt=Math.round(be*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:rt.agentUid,ip:rt.ip,port:49105,x:Me,y:pt})})}catch(He){console.error("VNC Click error:",He)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!X&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:N})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(N),Qe("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),Qe("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${N}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{Ce(null),$(rt.ip,"","GET",null,!1,rt.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(et,{children:K.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>It(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:n.confirmModalCard,onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["⚠️ ",K.title]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>It(i=>({...i,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:K.message})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var i;It(M=>({...M,isOpen:!1})),(i=K.onConfirm)==null||i.call(K)},children:"Đồng ý"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>It(i=>({...i,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:m.isOpen&&e.jsx("div",{style:n.confirmOverlay,children:e.jsxs(Ve.div,{style:{...n.confirmModalCard,maxWidth:"460px",width:"90%",textAlign:"center",border:"1px solid rgba(239, 68, 68, 0.4)",background:"rgba(24, 24, 32, 0.98)",padding:"28px 24px",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.6)"},onClick:i=>i.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[e.jsx("div",{style:{fontSize:"2.8rem",marginBottom:"10px"},children:"🌐"}),e.jsx("h3",{style:{fontSize:"1.15rem",fontWeight:700,color:"#f87171",margin:"0 0 8px 0"},children:"Cảnh báo Public IP / Cho phép kết nối"}),e.jsxs("p",{style:{fontSize:"0.86rem",color:"#9ca3af",lineHeight:1.5,margin:"0 0 16px 0"},children:["Public IP hiện tại của trình duyệt (",e.jsx("strong",{children:m.ip||"Chưa xác định"}),") chưa có trong danh sách được kết nối với Agent."]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"16px"},children:[e.jsx("label",{style:{fontSize:"0.8rem",fontWeight:600,color:"#e5e7eb",display:"block",marginBottom:"6px"},children:"Nhập Public IP muốn kết nối với Agent:"}),e.jsx("div",{style:{position:"relative"},children:e.jsx("input",{type:"text",value:$e,onChange:i=>wt(i.target.value),placeholder:"Ví dụ: 116.98.0.59 hoặc *",style:{width:"100%",padding:"10px 14px",fontSize:"0.9rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.4)",color:"#fff",outline:"none",boxSizing:"border-box"}})}),yr&&e.jsxs("div",{style:{fontSize:"0.78rem",color:"#ef4444",marginTop:"6px"},children:["⚠️ ",yr]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("button",{onClick:()=>Bn(),disabled:er,style:{width:"100%",padding:"11px 16px",fontSize:"0.9rem",fontWeight:700,background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",border:"none",borderRadius:"8px",cursor:er?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 4px 12px rgba(16, 185, 129, 0.3)"},children:er?e.jsx(nt,{size:"sm"}):"Kết nối Public IP"}),e.jsx("button",{onClick:()=>{window.location.href="/dashboard"},style:{width:"100%",padding:"9px 16px",fontSize:"0.82rem",fontWeight:600,background:"transparent",color:"#9ca3af",border:"1px solid rgba(255, 255, 255, 0.1)",borderRadius:"8px",cursor:"pointer"},children:"Quay về Dashboard ↗"})]})]})})}),e.jsx(et,{children:Q.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>At(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:{...n.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>At(i=>({...i,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((Cr=Q.entry)==null?void 0:Cr.name)||((Pr=Q.entry)==null?void 0:Pr.name_1)||((Ir=Q.entry)==null?void 0:Ir.email_address)||((Ar=Q.entry)==null?void 0:Ar.folder)||((kr=Q.entry)==null?void 0:kr.registration_no)||"không tên",'"']}),((Er=Q.entry)==null?void 0:Er.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(jr=Q.entry)==null?void 0:jr.registration_no]})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:n.modalInput,value:Q.agentUid,onChange:i=>At(M=>({...M,agentUid:i.target.value})),children:(ze&&ze.agents||[]).filter(i=>i.is_agent_active).map(i=>e.jsxs("option",{value:i.agent_uid,children:[i.hostname," (",i.local_ip,")"]},i.agent_uid))}),e.jsx("span",{style:n.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:h,children:"Xác nhận xóa"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>At(i=>({...i,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:U.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>st(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:n.confirmModalCard,onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>st(i=>({...i,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"14px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"📂 chọn phiên bản Driver cần cài đặt (khớp từ Storage catalog):"}),(()=>{var ae;const i=[];if(U.suggestedDrivers&&Array.isArray(U.suggestedDrivers)&&U.suggestedDrivers.length>0&&U.suggestedDrivers.forEach(w=>{w.drivers&&Array.isArray(w.drivers)&&w.drivers.forEach(ne=>{i.push({name:ne.name,url:ne.url,brand:w.brand||U.brand,model:w.model||U.model,label:`[${String(w.brand||U.brand||"").toUpperCase()} ${w.model||U.model}] ${ne.name}`})})}),i.length===0&&U.driverName&&U.driverUrl&&i.push({name:U.driverName,url:U.driverUrl,brand:U.brand||"Ricoh",model:U.model||"Photocopy",label:`[${String(U.brand||"RICOH").toUpperCase()} ${U.model||""}] ${U.driverName}`}),i.length===0)return e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-error)",fontStyle:"italic",background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"6px"},children:"⚠️ Không tìm thấy phiên bản driver nào phù hợp trong Storage catalog."});const M=U.driverUrl||((ae=i[0])==null?void 0:ae.url)||"";return e.jsx("select",{value:M,onChange:w=>{const ne=i.find(be=>be.url===w.target.value);ne&&st(be=>({...be,driverName:ne.name,driverUrl:ne.url,brand:ne.brand||be.brand,model:ne.model||be.model}))},style:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%",cursor:"pointer",fontWeight:600},children:i.map((w,ne)=>e.jsx("option",{value:w.url,children:w.label},ne))})})()]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"💻 Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),!(ze!=null&&ze.agents)||ze.agents.filter(i=>i.is_agent_active).length===0?e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-text-secondary)",fontStyle:"italic",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px"},children:"Không có Agent online trong LAN này"}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px",maxHeight:"200px",overflowY:"auto"},children:ze.agents.filter(i=>i.is_agent_active).map(i=>{const M=U.selectedAgentUids.includes(i.agent_uid);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"0.82rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:M,onChange:ae=>{st(w=>{const ne=w.selectedAgentUids;return ae.target.checked?{...w,selectedAgentUids:[...ne,i.agent_uid]}:{...w,selectedAgentUids:ne.filter(be=>be!==i.agent_uid)}})},style:{width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsxs("span",{children:[i.hostname," (",i.local_ip,")"]})]},i.agent_uid)})})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:U.selectedAgentUids.length===0,onClick:()=>{const i=U;st(be=>({...be,isOpen:!1}));const M=i.driverUrl||"",ae=i.driverName||i.model||"Driver",w=i.brand||"Ricoh",ne=i.model||"Photocopy";i.selectedAgentUids.forEach(be=>{me(i.printerId,w,ne,ae,M,be,i.printerIp,i.macId)})},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>st(i=>({...i,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:de.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:170},onClick:()=>Xe(i=>({...i,isOpen:!1,error:""})),children:e.jsxs(Ve.div,{style:n.confirmModalCard,onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:de.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Xe(i=>({...i,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[de.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:de.value,onChange:i=>Xe(M=>({...M,value:i.target.value,error:""})),onKeyDown:i=>{if(i.key==="Enter"){const M=/^(\d{1,3}\.){3}\d{1,3}$/;if(!M.test(de.value.trim())){Xe(ne=>({...ne,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const ae=(de.changeAllTo||"").trim();if(ae&&!M.test(ae)){Xe(ne=>({...ne,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const w=de.onConfirm;Xe(ne=>({...ne,isOpen:!1,error:""})),w(de.value.trim(),ae)}i.key==="Escape"&&Xe(M=>({...M,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:de.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:i=>{de.error||(i.target.style.borderColor="var(--color-primary)")},onBlur:i=>{de.error||(i.target.style.borderColor="var(--color-surface-light)")}}),de.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:de.changeAllTo||"",onChange:i=>Xe(M=>({...M,changeAllTo:i.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:i=>{i.target.style.borderColor="var(--color-primary)"},onBlur:i=>{i.target.style.borderColor="var(--color-surface-light)"}})]}),de.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",de.error]}),de.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:de.scanStatus})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const i=/^(\d{1,3}\.){3}\d{1,3}$/;if(!i.test(de.value.trim())){Xe(w=>({...w,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const M=(de.changeAllTo||"").trim();if(M&&!i.test(M)){Xe(w=>({...w,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const ae=de.onConfirm;Xe(w=>({...w,isOpen:!1,error:""})),ae(de.value.trim(),M)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Xe(i=>({...i,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(et,{children:pe.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>yt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:{...n.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:{...n.modalTitle,fontSize:"0.85rem"},children:pe.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>yt(i=>({...i,isOpen:!1})),children:"×"})]}),pe.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:Ye,value:Se,onChange:i=>ur(i.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),ct&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:ct.startsWith("❌")?"rgba(239,68,68,0.1)":ct.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:ct.startsWith("❌")?"#f87171":ct.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${ct.startsWith("❌")?"rgba(239,68,68,0.15)":ct.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:ct})]}):pe.content&&typeof pe.content=="string"&&(pe.content.trim().startsWith("data:image/")||pe.content.trim().startsWith("iVBORw0KGgo"))?e.jsx(ai,{src:pe.content.trim().startsWith("data:image/")?pe.content.trim():`data:image/png;base64,${pe.content.trim()}`,alt:pe.title||"Desktop Screenshot"}):e.jsx("pre",{ref:Ye,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:br(pe.content)}),e.jsxs("div",{style:{...n.modalFooter,marginTop:"10px"},children:[pe.title.includes("settings.json")&&e.jsx("button",{disabled:Ee,style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:Ee?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:Ee?"not-allowed":"pointer"},onClick:re,children:Ee?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(pe.title.includes("settings.json")?Se:br(pe.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>yt(i=>({...i,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(et,{children:gt&&gt.isOpen&&e.jsx(oi,{webPreviewModal:gt,handleCloseWebPreview:p,directLan:X,webPreviewLoading:dt,previewIframeRef:Ht,previewBlobUrl:ot,setWebPreviewModal:bt})}),e.jsx(et,{children:Oe.isOpen&&e.jsx(Ve.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>Gt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:i=>i.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[Oe.copierName," · MAC: ",Oe.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>Gt(i=>({...i,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:Oe.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(Oe.jsonData,null,2)),Qe("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(Oe.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>Gt(i=>({...i,isOpen:!1})),children:"Đóng"})})]})})})]})}const li=(t={})=>{const{showToast:o,pollCommandStatus:u,utilityCommands:f}=t,[P,N]=C.useState([]),[E,G]=C.useState(()=>localStorage.getItem("goxprint_selected_public_ip")||localStorage.getItem("gox_connect_public_ip")||""),[te,J]=C.useState(()=>localStorage.getItem("goxprint_selected_lan_uid")||""),[k,g]=C.useState(!1),[z,j]=C.useState(()=>{try{const y=localStorage.getItem("goxprint_expanded_printers");return y?JSON.parse(y):{}}catch{return{}}}),[Z,K]=C.useState({}),[m,R]=C.useState({}),[_,S]=C.useState({}),[Q,X]=C.useState({}),[ge,Se]=C.useState({isOpen:!1,copier:null,oldIp:"",newIp:"",targetAgentUid:"",status:"",error:""}),[Ne,me]=C.useState({isOpen:!1,ip:""}),[ie,ee]=C.useState(""),ce=C.useRef({}),x=C.useMemo(()=>localStorage.getItem("goxprint_last_viewed_copier_id"),[]),W=C.useCallback(async(y=!1)=>{y&&g(!0);try{const p=await Wn(),h=(p==null?void 0:p.rows)||(Array.isArray(p)?p:[]);N(h);try{const I=((p==null?void 0:p.client_ip)||"").trim();I&&ee(I);const O=!!(p!=null&&p.is_allowed),L=(p==null?void 0:p.active_public_ips)||[],b=(localStorage.getItem("gox_connect_public_ip")||"").trim(),r=b||I,c=[];h.forEach(v=>{(v.agents||[]).forEach(B=>{const q=(B.public_ip||B.wan_ip||B.ip||"").trim(),V=(B.local_ip||"").trim();r&&(q&&q===r||V&&V===r)&&c.push(B)})});const l=c.length>0,s=!!b||O||l;if(console.log("=================================================="),console.log("🌐 [PUBLIC IP ACCESS CONTROL CHECK]"),console.log("📌 IP Public hiện tại của trình duyệt:",I),b&&console.log("⚡ IP Public do người dùng chỉ định kết nối:",b),console.log("🛡️ Danh sách Public IP đang Active trên Server:",L),console.log("✅ Quyền truy cập toàn bộ LAN (Is Whitelisted/Allowed):",O||b?"CÓ (FULL ACCESS)":"KHÔNG (LIMITED BY AGENT PUBLIC IP)"),console.log("💻 Danh sách Agent có cùng Public IP:",c.length>0?c:s?"Đang mở Full LAN (Tất cả Agent)":"Không tìm thấy Agent cùng IP"),console.log("=================================================="),!s&&I){console.warn(`[ACCESS DENIED] Public IP ${I} is not allowed and not in the same network.`),me({isOpen:!0,ip:I});return}console.log("[FRONTEND SCANPOINTS VPS] DANH SÁCH DANH BẠ TỪ SCANPOINTS VPS (< 3 NGÀY):"),h.forEach(v=>{(v.printers||[]).forEach(B=>{var D;const q=B.address_book_sync||{},V=Array.isArray(q.address_list)?q.address_list:((D=q.address_book_data)==null?void 0:D.address_list)||[],Y=B.mac_address||B.mac_id||"—";V.length>0&&console.log(`📌 Máy in [${B.printer_name||B.name}] - IP: ${B.ip} | MAC: ${Y} (${V.length} điểm scan trong ScanPoints VPS):`,V)})}),console.log("==================================================")}catch(I){console.error("Console log error:",I)}h.length>0&&J(I=>{const O=(E||localStorage.getItem("goxprint_selected_public_ip")||localStorage.getItem("gox_connect_public_ip")||"").trim();if(O){const r=h.find(c=>(c.public_ip||c.wan_ip||"").trim()===O?!0:(c.agents||[]).some(s=>(s.public_ip||s.wan_ip||s.ip||"").trim()===O));if(r)return localStorage.setItem("goxprint_selected_lan_uid",r.lan_uid),r.lan_uid}if(I){const r=h.find(c=>c.lan_uid===I);if(r&&(r.printers&&r.printers.length>0||r.agents&&r.agents.length>0))return I}const L=h.find(r=>r.printers&&r.printers.length>0||r.agents&&r.agents.length>0),b=L?L.lan_uid:h[0].lan_uid;return localStorage.setItem("goxprint_selected_lan_uid",b),b}),y&&o("Đã cập nhật danh sách mạng LAN","success")}catch(p){console.error("Failed to fetch LAN sites:",p),y&&o(`Không thể tải dữ liệu LAN: ${p.message}`,"error")}finally{g(!1)}},[o]);C.useEffect(()=>{W()},[W]);const $=C.useMemo(()=>{if(!P||P.length===0)return[];const y=(E||localStorage.getItem("goxprint_selected_public_ip")||localStorage.getItem("gox_connect_public_ip")||"").trim();return y?P.filter(p=>(p.public_ip||p.wan_ip||"").trim()===y?!0:(p.agents||[]).some(I=>(I.public_ip||I.wan_ip||I.ip||"").trim()===y)):P},[P,E]),T=C.useMemo(()=>{if(!P||P.length===0)return null;const y=(E||localStorage.getItem("goxprint_selected_public_ip")||localStorage.getItem("gox_connect_public_ip")||"").trim();if(y){const h=P.find(I=>(I.public_ip||I.wan_ip||"").trim()===y?!0:(I.agents||[]).some(L=>(L.public_ip||L.wan_ip||L.ip||"").trim()===y));if(h)return h}if(te){const h=P.find(I=>I.lan_uid===te);if(h&&(h.printers&&h.printers.length>0||h.agents&&h.agents.length>0))return h}return P.find(h=>h.printers&&h.printers.length>0||h.agents&&h.agents.length>0)||P[0]},[P,te,E]),H=C.useCallback((y,p=!0)=>{var O;if(!y)return;const h=y.lan_uid,I=Date.now();if(p||!ce.current[h]||I-ce.current[h]>30*1e3){ce.current[h]=I;const L=(y.agents||[]).filter(b=>b.is_agent_active);if(L.length>0){L.sort((r,c)=>{const l=new Date(r.last_seen||r.updated_at||r.last_ping||0).getTime();return new Date(c.last_seen||c.updated_at||c.last_ping||0).getTime()-l});const b=L[0];if(b&&u){o(`⏳ Agent (${b.agent_uid}) đang thực hiện quét ngầm mạng LAN...`,"info",6e3),(O=t.setCommandStatus)==null||O.call(t,l=>({...l,[`scan_lan_${h}`]:{message:"⏳ Agent đang quét ngầm mạng LAN...",isPending:!0}}));const r=b,c={command:"force_subnet_scan",lead:y.lead};Re(`/api/agents/${r.agent_uid}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify(c)}).then(l=>{const s=(l==null?void 0:l.command_id)||(l==null?void 0:l.id);s&&u(Number(s),`scan_lan_${h}`,async v=>{console.log("🔍 [PRINTAGENT RESULT] Kết quả force_subnet_scan:",v);let B=[];const q=(v==null?void 0:v.result)||(v==null?void 0:v.result_payload)||(v==null?void 0:v.output)||(v==null?void 0:v.error_message)||(v==null?void 0:v.raw)||"";if(Array.isArray(q))B=q;else if(typeof q=="string"&&q.trim()){try{const V=JSON.parse(q.trim());Array.isArray(V)&&(B=V)}catch{}if(B.length===0)try{let V="";if(q.includes("__PRINTERS_JSON_START__"))V=q.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].trim();else{const Y=q.match(/(\[\s*\{[\s\S]*\}\s*\])/);Y&&(V=Y[1])}if(V){const Y=JSON.parse(V);Array.isArray(Y)&&(B=Y)}}catch(V){console.error("🔍 [Frontend] Lỗi parse JSON máy in:",V)}}if(B.length>0){o(`✓ Quét mạng LAN hoàn tất, tìm thấy ${B.length} máy in!`,"success",4e3);try{await Re("/api/new-devices",{method:"POST",body:JSON.stringify({lan_uid:h||"default",devices:B})})}catch{}W()}else o("✓ Quét mạng LAN hoàn tất","success",4e3)},async v=>{o("[-] Quét mạng LAN có lỗi","error",4e3)},"⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN...")}).catch(l=>{console.error(l)})}}}},[o,u,f]),oe=C.useMemo(()=>{if(!T)return[];const y=(T.printers||[]).filter(p=>{const h=(p.printer_name||p.name||"").toLowerCase().trim();return(p.ip||"").trim(),(p.mac_address||p.mac_id||"").toUpperCase().replace(/-/g,":"),!(h.includes("unknown")||h==="unknown printer"||h.includes("pdf")||h.includes("fax")||h.includes("brother")||h.includes("canon lbp")||h.includes("rustdesk"))});return x?[...y].sort((p,h)=>{const I=String(p.id)===x,O=String(h.id)===x;return I&&!O?-1:!I&&O?1:0}):y},[T,x]),se=C.useCallback(y=>{var c;const p=Number(y),h=(c=T==null?void 0:T.printers)==null?void 0:c.find(l=>Number(l.id)===p||l.id===y||l.mac_id===y||l.ip===y);if(!T)return"";const I=(T.agents||[]).filter(l=>l.is_agent_active),O=_[p];if(O&&I.some(s=>s.agent_uid===O))return O;const L=T.public_ip||T.wan_ip,b=I.find(l=>l.public_ip&&l.public_ip===L||l.wan_ip&&l.wan_ip===L),r=(h!=null&&h.agent_uid?I.find(l=>l.agent_uid===h.agent_uid):null)||b;return r?r.agent_uid:(h==null?void 0:h.agent_uid)||""},[T,_]),_e=y=>{localStorage.setItem("goxprint_last_viewed_copier_id",y)};return C.useEffect(()=>{if(T){const y={};T.printers.forEach(p=>{const h=(T.agents||[]).filter(b=>b.is_agent_active),I=T.public_ip||T.wan_ip,O=h.find(b=>b.public_ip&&b.public_ip===I||b.wan_ip&&b.wan_ip===I),L=(p.agent_uid?h.find(b=>b.agent_uid===p.agent_uid):null)||O;y[p.id]=L?L.agent_uid:p.agent_uid||""}),S(p=>({...y,...p})),K(p=>{const h={...p};return T.printers.forEach(I=>{const O=I.auth_user||I.user||"",L=I.auth_password||I.password||"",b=(()=>{try{const s=localStorage.getItem(`copier_auth_${I.id}`)||(I.mac_id?localStorage.getItem(`copier_auth_${I.mac_id}`):null);return s?JSON.parse(s):null}catch{return null}})(),r=h[I.id],c=(r==null?void 0:r.user)!==void 0?r.user:O!==""?O:(b==null?void 0:b.user)!==void 0?b.user:"",l=(r==null?void 0:r.pass)!==void 0?r.pass:L!==""?L:(b==null?void 0:b.pass)!==void 0?b.pass:"";h[I.id]={user:c,pass:l}}),h})}},[T]),{lanSites:P,setLanSites:N,selectedPublicIp:E,setSelectedPublicIp:G,filteredLanSites:$,selectedLanUid:te,setSelectedLanUid:J,selectedLan:T,lanSitesLoading:k,setLanSitesLoading:g,fetchLanSitesData:W,triggerLanScan:H,filteredPrinters:oe,copierCredentials:Z,setCopierCredentials:K,saveAuthLoading:m,setSaveAuthLoading:R,handleSaveAuth:async y=>{const p=String(typeof y=="object"?y.id:y),h=typeof y=="object"?y.mac_id||y.mac_address||"":p,I=typeof y=="object"&&(y.printer_type||y.type)||"",O=Z[p]||{user:"",pass:""};try{localStorage.setItem(`copier_auth_${p}`,JSON.stringify(O)),h&&localStorage.setItem(`copier_auth_${h}`,JSON.stringify(O))}catch{}R(L=>({...L,[p]:!0}));try{const L=await Hn(h||p,O.user,O.pass,h,I);if(L.ok){const b=L.command_id||L.id;b&&u?(o("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),u(b,p,r=>{const c=r!=null&&r.error?` (${r.error})`:r!=null&&r.result?` (${r.result})`:"";o(`Đã test đăng nhập thành công và lưu vào database!${c}`,"success",5e3),N(l=>l.map(s=>({...s,printers:s.printers.map(v=>String(v.id)===String(p)||h&&v.mac_id===h?{...v,auth_user:O.user,auth_password:O.pass}:v)}))),R(l=>({...l,[p]:!1}))},r=>{o(`Lỗi Agent lưu Auth: ${r}`,"error"),R(c=>({...c,[p]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(o("Đã lưu tài khoản Web UI máy photocopy thành công","success"),N(r=>r.map(c=>({...c,printers:c.printers.map(l=>String(l.id)===String(p)||h&&l.mac_id===h?{...l,auth_user:O.user,auth_password:O.pass}:l)}))),R(r=>({...r,[p]:!1})))}else throw new Error(L.error||"Lỗi lưu thông tin đăng nhập")}catch(L){o(`Lỗi lưu Auth: ${L.message}`,"error"),R(b=>({...b,[p]:!1}))}},editIpModalData:ge,setEditIpModalData:Se,handleEditIP:y=>{const p=se(y.id);Se({isOpen:!0,copier:y,oldIp:y.ip||"",newIp:y.ip||"",targetAgentUid:p,status:"",error:""})},handleSaveEditIP:async()=>{if(!ge.copier||!ge.newIp)return;const y=ge.copier,p=ge.oldIp,h=ge.newIp.trim(),I=ge.targetAgentUid;if(!h){Se(O=>({...O,error:"Vui lòng nhập địa chỉ IP mới!"}));return}Se(O=>({...O,status:"⌛ Đang gửi lệnh đổi IP tới Agent...",error:""})),o(`Đang gửi lệnh đổi IP từ ${p} ➔ ${h}...`,"info",3e3);try{const L=(y.printer_type||y.printer_name||"").toLowerCase().includes("toshiba")?"toshiba_change_ftp":"ricoh_change_ftp",b=await it(I,L,"",{old_ip:p,new_ip:h,printer_ip:p,target_ip:p});if(!b.ok||!b.command_id)throw new Error(b.error||"Không thể tạo lệnh đổi IP");Se(r=>({...r,status:"⌛ Agent đang kết nối máy in để thực hiện đổi IP..."})),u&&u(b.command_id,`edit_ip_${y.id}`,r=>{o(`✓ Đã đổi IP thành công từ ${p} ➔ ${h}!`,"success",5e3),N(c=>c.map(l=>({...l,printers:l.printers.map(s=>String(s.id)===String(y.id)||s.mac_id===y.mac_id?{...s,ip:h}:s)}))),Se(c=>({...c,isOpen:!1,status:"",error:""}))},r=>{o(`[-] Lỗi đổi IP: ${r}`,"error"),Se(c=>({...c,status:"",error:r}))},"⏳ Agent đang cập nhật địa chỉ IP trên máy photo...")}catch(O){Se(L=>({...L,status:"",error:O.message||"Lỗi không xác định"})),o(`Lỗi gửi lệnh đổi IP: ${O.message}`,"error")}},expandedPrinters:z,setExpandedPrinters:j,selectedTargetAgents:_,setSelectedTargetAgents:S,getTargetAgentUid:se,handleCopierClick:_e,accessDeniedState:Ne,setAccessDeniedState:me,liveAddressBooks:Q,setLiveAddressBooks:X,myClientIp:ie}},Lr=new Set(["get_agent_ip","get_public_ip","view_settings_json","view_printers_json","view_scan_points_json","view_agent_loader_debug","view_stout","view_sterror","dxdiag","printers","clean_temp","scan","ricoh_list_scan","toshiba_list_scan"]),Rr={get_agent_ip:"Địa chỉ IP Local của Agent",get_public_ip:"Địa chỉ IP Public (Internet)",view_settings_json:"Nội dung tệp settings.json",view_printers_json:"Nội dung tệp printers.json",view_scan_points_json:"Nội dung tệp scan_points.json",view_agent_loader_debug:"Nội dung tệp agent_loader_debug.txt",view_stout:"Nội dung tệp stout.txt (1000 dòng cuối)",view_sterror:"Nội dung tệp sterror.txt (1000 dòng cuối)",dxdiag:"Kết quả kiểm tra cấu hình hệ thống (DxDiag)",printers:"Danh sách máy in hệ thống",clean_temp:"Kết quả dọn dẹp thư mục tạm & Driver",scan:"Nội dung thư mục Scan gốc (%TEMP%/GoPrinxAgent/ftp)",ricoh_list_scan:"Danh bạ Scan trên máy photo Ricoh",toshiba_list_scan:"Danh bạ Scan trên máy photo Toshiba"},ci=(t={})=>{const{showToast:o,setViewOutputModal:u,setIpInputModal:f}=t,[P,N]=C.useState([]),[E,G]=C.useState(!1),[te,J]=C.useState(!1),[k,g]=C.useState(null),[z,j]=C.useState(null),[Z,K]=C.useState(null);C.useEffect(()=>{let W=!0;const $=(Z==null?void 0:Z.agent_uid)||"default";return G(!0),Ur($).then(T=>{if(!W)return;const H=Array.isArray(T)?T:(T==null?void 0:T.commands)||(T==null?void 0:T.rows)||[];N(H)}).catch(T=>{console.error("Failed to load utility commands:",T)}).finally(()=>{W&&G(!1)}),()=>{W=!1}},[Z]);const[m,R]=C.useState(""),[_,S]=C.useState(!1),[Q,X]=C.useState(""),[ge,Se]=C.useState("ping 8.8.8.8"),Ne=C.useCallback((W,$,T,H,oe)=>{var le;(le=t.setCommandStatus)==null||le.call(t,y=>({...y,[$]:{message:oe||"Đang thực thi lệnh...",isPending:!0}}));const se=1500,_e=6e4,ve=Date.now(),xe=setInterval(async()=>{var p,h,I,O,L;const y=Date.now()-ve;if(y>_e){clearInterval(xe),(p=t.setCommandStatus)==null||p.call(t,b=>({...b,[$]:{message:"Lỗi: Quá thời gian chờ (Timeout 60s)",isPending:!1}})),H&&H("Quá thời gian chờ (Timeout 60s)");return}try{const b=await Ct(W);if(b.ok&&b.status==="success"){clearInterval(xe);const r=b.result?` (${b.result})`:"";(h=t.setCommandStatus)==null||h.call(t,c=>({...c,[$]:{message:`Đã hoàn tất thành công!${r}`,isPending:!1}})),T(b)}else if(b.ok&&b.status==="failed"){clearInterval(xe);const r=b.error||b.error_message||b.result||"Thực thi thất bại";(I=t.setCommandStatus)==null||I.call(t,c=>({...c,[$]:{message:`Lỗi: ${r}`,isPending:!1}})),H&&H(r)}else{const r=b.received_at?`Agent đã nhận lệnh (${Math.round(y/1e3)}s)...`:`Đang gửi lệnh tới Agent (${Math.round(y/1e3)}s)...`;(O=t.setCommandStatus)==null||O.call(t,c=>({...c,[$]:{message:r,isPending:!0}}))}}catch(b){clearInterval(xe),(L=t.setCommandStatus)==null||L.call(t,r=>({...r,[$]:{message:`Lỗi kết nối: ${b.message||"Lỗi polling"}`,isPending:!1}})),H&&H(b.message||"Lệnh thực hiện thất bại từ Agent")}},se)},[t]),me=async(W,$,T)=>{try{const H=await Qn(W,10),se=(H.jobs||H.commands||[]).filter(_e=>_e.status==="pending"&&_e.command_type===$);return T?se.some(_e=>{const ve=_e.command_params||{};return Object.keys(T).every(xe=>String(ve[xe])===String(T[xe]))}):se.length>0}catch{return!1}},ie=C.useCallback(async W=>{J(!0),X("");try{const $=await it(W,"view_settings_json","");if(!$.ok||!$.command_id)throw new Error($.error||"Không thể gửi lệnh xem settings.json");Ne($.command_id,"view_settings",T=>{const H=typeof T.result_payload=="object"&&T.result_payload?JSON.stringify(T.result_payload,null,2):T.result_payload||T.result||"";R(H),J(!1)},T=>{X(`❌ Không thể nạp settings.json: ${T}`),J(!1)},"⌛ Đang nạp settings.json từ Agent...")}catch($){X(`❌ Lỗi nạp cấu hình: ${$.message}`),J(!1)}},[Ne]),ee=async W=>{if(!W||!m)return;try{JSON.parse(m)}catch(T){X(`❌ Lỗi định dạng JSON: ${T.message}`);return}S(!0),X("⌛ Đang gửi cấu hình mới tới Agent...");const $=btoa(unescape(encodeURIComponent(m)));try{const T=(P||[]).find(_e=>_e.command==="save_settings_json"),H=(T==null?void 0:T.command_content)||"",oe=await it(W,"save_settings_json",H,{base64_content:$});if(!oe.ok||!oe.command_id)throw new Error(oe.error||"Không thể tạo lệnh tiện ích");const se=oe.command_id;Ne(se,"save_settings",()=>{X("✅ Đã lưu và nạp lại cấu hình settings.json thành công!"),S(!1),o&&o("Đã lưu cấu hình Agent thành công","success")},_e=>{X(`❌ Lỗi lưu cấu hình: ${_e}`),S(!1)},"⌛ Agent đang ghi đè tệp settings.json...")}catch(T){X(`❌ Lỗi gửi lệnh: ${T.message}`),S(!1)}},ce=C.useCallback(async(W,$,T,H={})=>{let oe=Z,se="",_e="",ve={};if(typeof W=="string"?(se=W,_e=$||se,ve=T||{}):(oe=W||Z,se=$||"",_e=T||se,ve=H||{}),!!oe){j(se),g({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const xe=await Yn(oe.agent_uid,_e,ve);if(!xe.ok||!xe.command_id)throw new Error(xe.error||"Không thể tạo lệnh tiện ích");const le=xe.command_id,y=6e4,p=1e3,h=Date.now(),I=setInterval(async()=>{try{const O=Date.now()-h;if(O>y){clearInterval(I),g({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),j(null);return}const L=await Ct(le);if(L.status==="success")clearInterval(I),g({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),j(null);else if(L.status==="failed"||!L.ok)clearInterval(I),g({text:`❌ Thất bại: ${L.error||"Lệnh thất bại từ Agent"}`,isError:!0}),j(null);else{const b=Math.round(O/1e3);L.received_at?g({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${b}s)`,isError:!1}):g({text:`⌛ Đang chuyển lệnh tới Agent... (${b}s)`,isError:!1})}}catch(O){console.error("Error polling utility status:",O)}},p)}catch(xe){console.error(`Failed to trigger ${se}:`,xe),g({text:`Lỗi kết nối hoặc gửi lệnh: ${xe.message}`,isError:!0}),j(null)}}},[Z]),x=C.useCallback(async(W,$,T)=>{let H=Z,oe="",se="";if(typeof W=="string"?(oe=W,se=$||""):(H=W||Z,oe=$||"",se=T||""),!H)return;if(await me(H.agent_uid,"trigger_utility",{action:"exec_utility",command:oe})){o&&o("Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!","info");return}const ve=P.find(y=>y.command===oe),xe=(ve==null?void 0:ve.output_modal)||Lr.has(oe),le=(ve==null?void 0:ve.label)||Rr[oe]||oe;if(oe==="change_agent_ip"||oe==="check_scan_ip_match"){const y=oe==="change_agent_ip",p=(H==null?void 0:H.local_ip)||(H==null?void 0:H.ip)||(H==null?void 0:H.agent_ip)||(H==null?void 0:H.localIp)||"";f&&f({isOpen:!0,title:y?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:y?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:p,changeAllTo:"",scanStatus:"",error:"",onConfirm:(h,I)=>{const O=se.replace("__TARGET_IP__",h);j(oe),g({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),it(H.agent_uid,oe,O,{target_ip:h,ip:h,printer_ip:h,change_all_to:I||""}).then(L=>{if(!L.ok||!L.command_id)throw new Error(L.error||"Không thể tạo lệnh tiện ích");const b=L.command_id,r=6e4,c=Date.now(),l=setInterval(async()=>{try{const s=Date.now()-c;if(s>r){clearInterval(l),g({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),j(null);return}const v=await Ct(b);if(v.status==="success")clearInterval(l),xe&&u?u({isOpen:!0,title:le,content:typeof v.result_payload=="object"&&v.result_payload?JSON.stringify(v.result_payload,null,2):v.result_payload||v.error||v.result||"(không có nội dung)",rawPayload:v.result_payload||v.result||""}):g({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),j(null),t.fetchLanSitesData&&(t.fetchLanSitesData(!0),setTimeout(()=>t.fetchLanSitesData&&t.fetchLanSitesData(!0),2e3),setTimeout(()=>t.fetchLanSitesData&&t.fetchLanSitesData(!0),5e3));else if(v.status==="failed"||!v.ok)clearInterval(l),g({text:`❌ Thất bại: ${v.error||"Lệnh thất bại từ Agent"}`,isError:!0}),j(null);else{const B=Math.round(s/1e3);g({text:`⌛ Agent đang thực hiện lệnh... (${B}s)`,isError:!1})}}catch(s){console.error("Error polling status:",s)}},1e3)}).catch(L=>{g({text:`Lỗi gửi lệnh: ${L.message}`,isError:!0}),j(null)})}});return}j(oe),g({text:"⌛ Đang gửi lệnh thực thi tới Agent...",isError:!1});try{const y=await it(H.agent_uid,oe,se);if(!y.ok||!y.command_id)throw new Error(y.error||"Không thể tạo lệnh tiện ích");const p=y.command_id,h=6e4,I=1e3,O=Date.now(),L=setInterval(async()=>{try{const b=Date.now()-O;if(b>h){clearInterval(L),g({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),j(null);return}const r=await Ct(p);if(r.status==="success")clearInterval(L),xe&&u?u({isOpen:!0,title:le,content:typeof r.result_payload=="object"&&r.result_payload?JSON.stringify(r.result_payload,null,2):r.result_payload||r.error||r.result||"(không có nội dung)",rawPayload:r.result_payload||r.result||""}):g({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),j(null),t.fetchLanSitesData&&(t.fetchLanSitesData(!0),setTimeout(()=>t.fetchLanSitesData&&t.fetchLanSitesData(!0),2e3));else if(r.status==="failed"||!r.ok)clearInterval(L),xe&&u?u({isOpen:!0,title:le,content:r.error||typeof r.result_payload=="object"&&r.result_payload?JSON.stringify(r.result_payload,null,2):r.result_payload||r.result||"(không có nội dung)",rawPayload:r.result_payload||r.result||""}):g({text:`❌ Thất bại: ${r.error||"Lệnh thất bại từ Agent"}`,isError:!0}),j(null);else{const c=Math.round(b/1e3),l=r.progress_text||`Đang xử lý... (${c}s)`;g({text:`⌛ ${l}`,isError:!1})}}catch(b){const r=(b==null?void 0:b.message)||String(b||"");xe&&u&&(r.startsWith("[PATH]")||r.includes("stout")||r.includes("sterror")||r.includes("settings.json"))?(clearInterval(L),u({isOpen:!0,title:le,content:r,rawPayload:r}),g(null),j(null)):r.includes("502")||r.includes("404")||r.includes("xóa")||elapsed>15e3?(clearInterval(L),j(null),g({text:"❌ Lệnh đã dừng hoặc bị xóa",isError:!0})):console.error("Poll error:",b)}},I)}catch(y){g({text:`Lỗi: ${y.message}`,isError:!0}),j(null)}},[Z,P,o,f,u]);return{VIEW_COMMANDS:Lr,VIEW_COMMAND_TITLES:Rr,utilityCommands:P,setUtilityCommands:N,utilityCommandsLoading:E,setUtilityCommandsLoading:G,utilitySettingsLoading:te,setUtilitySettingsLoading:J,utilityStatusMsg:k,setUtilityStatusMsg:g,utilityActionPending:z,setUtilityActionPending:j,selectedUtilityAgent:Z,setSelectedUtilityAgent:K,editableSettingsText:m,setEditableSettingsText:R,isSavingSettings:_,setIsSavingSettings:S,settingsSaveStatus:Q,setSettingsSaveStatus:X,customRunCommand:ge,setCustomRunCommand:Se,pollCommandStatus:Ne,loadUtilitySettings:ie,handleSaveSettings:ee,handleTriggerUtility:ce,handleTriggerUtilityExec:x}},di=(t={})=>{const{showToast:o,pollCommandStatus:u}=t,[f,P]=C.useState({isOpen:!1,copier:null,url:"",tunnelUrl:"",directUrl:"",auth:{user:"",pass:""}}),[N,E]=C.useState("tunnel"),[G,te]=C.useState(!1),[J,k]=C.useState([]),[g,z]=C.useState(-1),[j,Z]=C.useState(!1),[K,m]=C.useState(null),R=C.useRef(null),[_,S]=C.useState({isOpen:!1,printerId:"",copier:null,targetAgentUid:"",status:"",error:""}),Q=C.useCallback(()=>{K&&(URL.revokeObjectURL(K),m(null)),P(ie=>({...ie,isOpen:!1}))},[K]),X=C.useCallback(async(ie,ee,ce="/")=>{if(!ie){o&&o("Không tìm thấy Agent UID","error");return}const x=($,T)=>`
      <html>
        <head>
          <title>${$}</title>
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
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${$}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${T}</div>
        </body>
      </html>
    `,W=window.open("about:blank","_blank");W&&W.document.write(x("Đang kết nối tên miền...",`Đang kết nối đến máy in ${ee} qua tên miền *.app.goxprint.com...`)),te(!0);try{const H=await(await fetch(`https://agentapi.quanlymay.com/api/agents/${ie}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:ee,printer_port:80})})).json();H.ok&&H.url?W&&(W.location.href=H.url):(W&&W.close(),o&&o("Kết nối lỗi: "+(H.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch($){W&&W.close(),o&&o("Lỗi hệ thống VPS: "+($.message||$),"error")}finally{te(!1)}},[o]),ge=C.useCallback(()=>{if(g>0){const ie=J[g-1];z(g-1),f.copier&&X(f.copier.agent_uid,f.copier.ip,ie)}},[g,J,f,X]),Se=C.useCallback(()=>{if(g<J.length-1){const ie=J[g+1];z(g+1),f.copier&&X(f.copier.agent_uid,f.copier.ip,ie)}},[g,J,f,X]);return{webPreviewModal:f,setWebPreviewModal:P,webPreviewTab:N,setWebPreviewTab:E,webPreviewLoading:G,setWebPreviewLoading:te,webPreviewHistory:J,setWebPreviewHistory:k,webPreviewHistoryIndex:g,setWebPreviewHistoryIndex:z,showPreviewDetails:j,setShowPreviewDetails:Z,previewBlobUrl:K,setPreviewBlobUrl:m,previewIframeRef:R,handleCloseWebPreview:Q,fetchRemotePage:X,handleHistoryBack:ge,handleHistoryForward:Se,installDriverModal:_,setInstallDriverModal:S,handleRemoteInstallDriver:(ie,ee,ce)=>{S({isOpen:!0,printerId:String(ie),copier:ee,targetAgentUid:ce,status:"",error:""})},executeRemoteInstallDriver:async()=>{if(!_.copier||!_.targetAgentUid)return;const{printerId:ie,copier:ee,targetAgentUid:ce}=_;S(x=>({...x,status:"⌛ Đang gửi lệnh cài đặt Driver tới Agent...",error:""})),o&&o("Đang tạo lệnh tải và cài đặt Driver máy in tự động...","info",3e3);try{const x=await Fr(ce,ee.ip,ee.printer_name||ee.name||"Printer",ee.printer_type||ee.brand||"");if(!x.ok||!x.command_id)throw new Error(x.error||"Không thể tạo lệnh cài driver");S(W=>({...W,status:"⌛ Agent đang tải gói Driver và tiến hành Silent Install..."})),u&&u(x.command_id,`install_driver_${ie}`,W=>{o&&o("✓ Đã cài đặt Driver máy in thành công lên máy Agent!","success",5e3),S($=>({...$,isOpen:!1,status:"",error:""}))},W=>{o&&o(`[-] Lỗi cài đặt Driver: ${W}`,"error"),S($=>({...$,status:"",error:W}))},"⏳ Agent đang cài đặt Driver vào hệ thống Windows...")}catch(x){S(W=>({...W,status:"",error:x.message||"Lỗi không xác định"})),o&&o(`Lỗi cài đặt Driver: ${x.message}`,"error")}}}},pi=(t={})=>{const{showToast:o,pollCommandStatus:u,setViewOutputModal:f}=t,[P,N]=C.useState({isOpen:!1,agentUid:"",agentName:"",currentPath:"",items:[],loading:!1,error:""}),[E,G]=C.useState([]),[te,J]=C.useState(!1),[k,g]=C.useState({isOpen:!1,printer:null,data:null,rawJson:""}),z=(K,m)=>{if(!m||m===".")return K;if(m===".."){const R=K.split("/").filter(Boolean);return R.pop(),R.join("/")||""}return K?`${K}/${m}`:m},j=C.useCallback(async(K,m,R="")=>{N({isOpen:!0,agentUid:K,agentName:m,currentPath:R,items:[],loading:!0,error:""});try{const _=await Or(K,R);if(_.ok)N(S=>({...S,items:_.items||_.files||[],loading:!1}));else throw new Error(_.error||"Không thể tải danh sách tệp")}catch(_){N(S=>({...S,loading:!1,error:_.message||"Lỗi kết nối tới Agent"})),o&&o(`Không thể mở thư mục lưu trữ: ${_.message}`,"error")}},[o]),Z=C.useCallback(async(K,m)=>{if(K){o&&o("⌛ Đang tải file scan_points.json từ Agent...","info",3e3);try{const R=await it(K,"view_scan_points_json","");if(!R.ok||!R.command_id)throw new Error(R.error||"Không thể tạo lệnh xem file scan_points.json");u&&u(R.command_id,`view_scan_points_${(m==null?void 0:m.id)||"json"}`,_=>{const S=_.result_payload||_.result||"";let Q=null;if(typeof S=="object"&&S!==null)Q=S;else if(typeof S=="string")try{Q=JSON.parse(S)}catch{Q=null}const X=Q?JSON.stringify(Q,null,2):String(S);g({isOpen:!0,printer:m,data:Q,rawJson:X}),f&&f({isOpen:!0,title:`📋 Danh bạ Scan (${(m==null?void 0:m.printer_name)||(m==null?void 0:m.name)||"Copier"})`,content:X,rawPayload:S})},_=>{o&&o(`Lỗi xem scan_points.json: ${_}`,"error")},"⏳ Agent đang đọc file scan_points.json...")}catch(R){o&&o(`Lỗi đọc file scan_points.json: ${R.message}`,"error")}}},[o,u,f]);return{storageModalData:P,setStorageModalData:N,storageFiles:E,setStorageFiles:G,storageLoading:te,setStorageLoading:J,handleOpenStorageFiles:j,resolveRelativePath:z,scanPointsViewerModal:k,setScanPointsViewerModal:g,handleViewScanPointsJson:Z}},mi=(t={})=>{const[o,u]=C.useState([]),f=C.useCallback((T,H="info",oe=3e3)=>{const se=Date.now().toString()+Math.random().toString().slice(2,6);u(_e=>[..._e,{id:se,message:T,type:H}]),setTimeout(()=>{u(_e=>_e.filter(ve=>ve.id!==se))},oe)},[]),[P,N]=C.useState("copiers"),[E,G]=C.useState({}),[te,J]=C.useState(null),[k,g]=C.useState({isOpen:!1,title:"",message:""}),[z,j]=C.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[Z,K]=C.useState({isOpen:!1,title:"",content:"",rawPayload:null}),[m,R]=C.useState({isOpen:!1,title:"",hint:"",value:"",changeAllTo:"",scanStatus:"",error:""}),[_,S]=C.useState({printerId:"",name:"",email:"",agentUid:""}),[Q,X]=C.useState(!1),[ge,Se]=C.useState({lanUid:"",agentUid:"",email:""}),[Ne,me]=C.useState(!1),[ie,ee]=C.useState(null),ce=ci({showToast:f,setViewOutputModal:K,setIpInputModal:R,setCommandStatus:G,fetchLanSitesData:lanSites.fetchLanSitesData}),x=li({showToast:f,pollCommandStatus:ce.pollCommandStatus,utilityCommands:ce.utilityCommands}),W=di({showToast:f,pollCommandStatus:ce.pollCommandStatus}),$=pi({showToast:f,pollCommandStatus:ce.pollCommandStatus,setViewOutputModal:K});return{toasts:o,showToast:f,activeTab:P,setActiveTab:N,commandStatus:E,setCommandStatus:G,activeModal:te,setActiveModal:J,confirmModal:k,setConfirmModal:g,deleteScanPointModal:z,setDeleteScanPointModal:j,viewOutputModal:Z,setViewOutputModal:K,ipInputModal:m,setIpInputModal:R,publicFtpData:_,setPublicFtpData:S,publicFtpLoading:Q,setPublicFtpLoading:X,privateFtpData:ge,setPrivateFtpData:Se,privateFtpLoading:Ne,setPrivateFtpLoading:me,getDestinationStatus:()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:()=>({label:"✔ ACTIVE",type:"success",title:""}),...x,...ce,...W,...$}},Tt="https://agentapi.quanlymay.com",ui=(t={})=>{const{cameraForm:o,cameras:u,customRecordDuration:f,directLan:P,fetchCameraFiles:N,fetchCameraStatus:E,fetchCameras:G,isRecording30s:te,setActiveModal:J,setAllocatedVncAddr:k,setCameraTestLoading:g,setCameraTestResult:z,setIsRecording30s:j,setRecording30sCountdown:Z,setSelectedCamera:K,setToshibaVncData:m,setVncTunnelLoading:R,showToast:_}=t;return{cameraForm:o,cameras:u,customRecordDuration:f,directLan:P,fetchCameraFiles:N,fetchCameraStatus:E,fetchCameras:G,handleDeleteCamera:async(me,ie)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{const ce=await(await fetch(`${Tt}/api/agents/${me}/cameras/${ie}/delete`,{method:"POST"})).json();ce.ok?(_("Đã xóa camera thành công!","success"),G(me),K(null)):_("Lỗi xóa camera: "+ce.error,"error")}catch(ee){_("Lỗi hệ thống: "+ee.message,"error")}},handleDeleteCameraFile:async(me,ie,ee)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${ee}`))try{const x=await(await fetch(`${Tt}/api/agents/${me}/cameras/${ie}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:ee})})).json();x.ok?(_("Đã xóa tệp video thành công!","success"),N(me,ie)):_("Lỗi xóa tệp: "+x.error,"error")}catch(ce){_("Lỗi hệ thống: "+ce.message,"error")}},handleRecord30s:async(me,ie)=>{if(te)return;const ee=u.find($=>$.id===ie),ce=(ee==null?void 0:ee.mac_address)||"";if(!ce){_("Camera không có thông tin MAC ID để điều khiển!","error");return}j(!0),Z(f);let x=f;const W=setInterval(()=>{x-=1,Z(Math.max(x,0)),x<=0&&clearInterval(W)},1e3);try{_(`Đang gửi yêu cầu ghi hình ${f}s...`,"info");const T=await(await fetch(`${Tt}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:ce,action:"record",duration:f})})).json();clearInterval(W),T.ok?_(T.message||`Ghi hình ${f}s hoàn tất!`,"success"):_("Lỗi ghi hình: "+T.error,"error")}catch($){clearInterval(W),_("Lỗi kết nối ghi hình: "+$.message,"error")}finally{j(!1),setTimeout(()=>{E(me,ie),N(me,ie)},1500)}},handleSaveCameraConfig:async me=>{try{const ee=await(await fetch(`${Tt}/api/agents/${me}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json();ee.ok?(_("Đã lưu cấu hình camera thành công!","success"),G(me),K(null)):_("Lỗi lưu cấu hình: "+ee.error,"error")}catch(ie){_("Lỗi hệ thống: "+ie.message,"error")}},handleStartToshibaVnc:async(me,ie,ee)=>{if(m({ip:me,printerName:ie,agentUid:ee}),k(""),J("toshiba_vnc"),P){k(`${me}:49105`);return}R(!0);try{const x=await(await fetch(`${Tt}/api/agents/${ee}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:me,printer_port:49105})})).json();if(x.ok&&x.url_port){const W=x.url_port.replace("http://","").replace("https://","");k(W)}else _("Không thể mở đường hầm VNC: "+(x.error||"Lỗi không xác định"),"error"),J(null)}catch(ce){_("Lỗi kết nối VPS: "+(ce.message||ce),"error"),J(null)}finally{R(!1)}},handleTestCameraConnection:async me=>{g(!0),z(null);try{const ee=await(await fetch(`${Tt}/api/agents/${me}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:o.rtsp_url})})).json();ee.ok&&ee.result?z(ee.result):z({ok:!1,msg:ee.error||"Lỗi kiểm tra kết nối"})}catch(ie){z({ok:!1,msg:"Lỗi: "+ie.message})}finally{g(!1)}},isRecording30s:te,setActiveModal:J,setAllocatedVncAddr:k,setCameraTestLoading:g,setCameraTestResult:z,setIsRecording30s:j,setRecording30sCountdown:Z,setSelectedCamera:K,setToshibaVncData:m,setVncTunnelLoading:R,showToast:_}},gi={ricoh_create_scan:`import requests
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
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    })
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

try:
    fetch_list()
    print("  [✓] Đã hoàn tất thành công.")
except Exception as err:
    print(f"
[-] LỖI THỰC THI QUÉT DANH BẠ: {err}")
    raise err
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
        raise RuntimeError(f"Kết nối tới máy in Toshiba thất bại: {e}")
    
    csrf = session.cookies.get("Session") or ""
    if not csrf:
        print("[-] Không lấy được Session cookie!")
        raise RuntimeError("Không lấy được Session cookie từ máy in Toshiba TopAccess!")
    headers = {"Content-Type": "text/plain; charset=utf-8", "csrfpId": csrf}

    # Login
    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><SetValue><Authentication><UserCredential><userName>{admin_user}</userName><passwd>{admin_password}</passwd><ipaddress>{local_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue><Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command></DeviceInformationModel>"""
    r = session.post(cgi, data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
    if "STATUS_OK" not in r.text and "Success" not in r.text:
        print(f"[-] Login thất bại: {r.text[:200]}")
        raise RuntimeError(f"Đăng nhập Toshiba thất bại: {r.text[:200]}")
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
            raise RuntimeError("Không tìm được Group slot trống trên máy in Toshiba!")

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
        raise RuntimeError("Không tạo được Template FTP scan trên máy in Toshiba!")

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
    user_pw = password if password is not None else ""

    session = requests.Session()
    try:
        session.mount("https://", ToshibaSSLAdapter())
    except Exception:
        pass

    working_base_url = f"http://{ip}"
    landing_url = f"{working_base_url}/?MAIN=TOPACCESS"

    print("")
    print(f"[2/4] Dang nhap Toshiba TopAccess ({ip})...")
    try:
        r_boot = session.get(landing_url, verify=False, timeout=5)
        print(f"  -> GET Landing {landing_url}: status={r_boot.status_code}")
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

    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue>
    <Authentication>
        <UserCredential>
            <userName>{user_name}</userName>
            <passwd>{user_pw}</passwd>
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

    user_token_id = ""
    login_success = False
    try:
        r_log = session.post(f"{working_base_url}/contentwebserver", data=login_xml.encode('utf-8'), headers=headers, verify=False, timeout=8)
        resp_text = r_log.text.strip()
        print(f"  -> Login response code: {r_log.status_code}")

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
            print(f"  [OK] DANG NHAP TOPACCESS THANH CONG!")
        else:
            print(f"  [!] Login response failed: {resp_text[:200]}")
    except Exception as log_exc:
        print(f"  [!] Login exception: {log_exc}")

    if not login_success:
        raise RuntimeError(f"DANG NHAP THAT BAI: May in Toshiba {ip} tu choi dang nhap TopAccess voi user='{user_name}' & password='{'*' * len(user_pw)}'.")

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
        raise RuntimeError(f"LỖI KẾT NỐI MÁY IN {IP}: {e}")

    csrf_token = session.cookies.get("Session") or ""
    if not csrf_token:
        print("  [!] LỖI: Không trích xuất được Session/CSRF cookie từ landing page!")
        raise RuntimeError("Không trích xuất được Session/CSRF cookie từ landing page!")
    print(f"  [✓] CSRF Token Extracted: {csrf_token}")

    headers = {
        "Content-Type": "text/plain; charset=utf-8",
        "csrfpId": csrf_token
    }

    # STEP 3: LOGIN TOPACCESS
    print(f"
[STEP 3] ĐĂNG NHẬP (LOGIN) VÀO TOSHIBA TOPACCESS VỚI USER '{USER}'...")
    local_client_ip = get_local_ip(IP)
    login_xml = (
        f"<?xml version="1.0" encoding="UTF-8"?>"
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
            raise RuntimeError(f"ĐĂNG NHẬP THẤT BẠI: {r_login.text[:200]}")
        print(f"  [✓] ĐĂNG NHẬP THÀNH CÔNG (LOGIN OK)!")
    except Exception as login_exc:
        print(f"  [!] LỖI TRONG QUÁ TRÌNH LOGIN: {login_exc}")
        raise RuntimeError(f"LỖI TRONG QUÁ TRÌNH LOGIN: {login_exc}")

    # Refresh CSRF
    csrf_token = session.cookies.get("Session") or csrf_token
    headers["csrfpId"] = csrf_token

    # STEP 4: PREPARE AND BUILD CHANGE XML
    print(f"
[STEP 4] CẬP NHẬT CẤU HÌNH TEMPLATE {target_slot} (ĐỔI SANG IP MỚI '{NEW_IP}')...")
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
    print(f"  -> Target Folder Path  : \\\\{NEW_IP}\\{NAME}\\")

    # STEP 5: SUBMIT REGISTER / CHANGE TEMPLATE POST
    print(f"
[STEP 5] GỬI LỆNH CẬP NHẬT (POST REGISTER TEMPLATE) TỚI TOSHIBA TOPACCESS...")
    operation_success = False
    try:
        r_update = session.post(cgi, data=update_xml.encode("utf-8"), headers=headers, verify=False, timeout=12)
        print(f"  -> HTTP Response Code: {r_update.status_code}")
        print(f"  -> Response Payload  : {r_update.text[:400].strip()}")

        if "STATUS_OK" in r_update.text or "Success" in r_update.text:
            operation_success = True
            print(f"  [✓] CẬP NHẬT THÀNH CÔNG (UPDATE SUCCESSFUL)!")
            print(f"      Đã đổi đường dẫn Scan cho ID {target_slot} từ \\\\{OLD_IP}\\{NAME}\\ ➔ \\\\{NEW_IP}\\{NAME}\\")
        else:
            m = re.search(r'<statusOfOperation>([^<]+)</statusOfOperation>', r_update.text)
            err_msg = m.group(1) if m else r_update.text[:200]
            print(f"  [!] LỖI CẬP NHẬT TEMPLATE: {err_msg}")
    except Exception as update_exc:
        print(f"  [!] LỖI GỬI LỆNH UPDATE: {update_exc}")

    # STEP 6: LOGOUT TOPACCESS
    print(f"
[STEP 6] ĐĂNG XUẤT (LOGOUT) KHỎI TOSHIBA TOPACCESS...")
    logout_xml = (
        f"<?xml version="1.0" encoding="UTF-8"?>"
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
`},hi="https://agentapi.quanlymay.com";function Nr(t,o,u){const f=t.email_address||t.email||"",P=t.physical_path||t.folder||t.folder_path||"",N=(f||P||"").trim();if(!N)return{label:"UNKNOWN",type:"error",title:""};if(t.type==="Email"||f.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const G=(o||[]).find(k=>(k.email||"").toLowerCase().trim()===N.toLowerCase().trim()),te=G?G.email_number:Number(t.registration_no);if(!te||isNaN(te))return{label:"✔ ACTIVE",type:"success",title:""};const J=(u||[]).find(k=>k.is_master&&k.is_agent_active)||(u||[]).find(k=>k.is_agent_active)||(u||[])[0];if(J){const k=(J.ftp_sites||[]).find(g=>Number(g.port)===Number(te));if(k){const g=("C:/Scangox/"+N).toLowerCase().replace(/\\/g,"/"),j=(k.path||"").toLowerCase().replace(/\\/g,"/")===g;return k.running&&j?{label:"✔ OK",type:"success",title:""}:k.running&&!j?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${k.path} instead of expected: C:/Scangox/${N}`}:k.error&&(k.error.toLowerCase().includes("in use")||k.error.toLowerCase().includes("busy")||k.error.toLowerCase().includes("already bound")||k.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:k.error}:{label:"❌ FAILED",type:"error",title:k.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}const fi=(t={})=>{const{activeAgentUid:o,cameras:u,copierCredentials:f={},deleteScanPointModal:P,editIpModalData:N,fetchLanSitesData:E,getTargetAgentUid:G,isDuplicatePending:te,lanSites:J=[],pollCommandStatus:k,queryDuration:g,queryTimestamp:z,replaceToast:j,saveScanPointToDb:Z,selectedCamera:K,selectedLan:m,setActiveModal:R,setDeleteScanPointModal:_,setEditIpModalData:S,setInstallDriverModal:Q,setLiveAddressBooks:X,setQueriedVideoUrl:ge,setQueryDuration:Se,setQueryTimestamp:Ne,setQueryVideoLoading:me,setStorageFiles:ie,setStorageLoading:ee,setStorageModalData:ce,showToast:x,utilityCommands:W=[],detectBrand:$}=t,T=async r=>{const c=String((r==null?void 0:r.mac_address)||(r==null?void 0:r.mac_id)||(r==null?void 0:r.mac)||"").trim(),l=String((r==null?void 0:r.ip)||(r==null?void 0:r.printer_ip)||(typeof r=="string"?r:"")||(r==null?void 0:r.id)||"").trim(),s=c.toUpperCase().replace(/[^0-9A-F:]/g,""),v=s.replace(/[:-]/g,"");let B="",q="";try{const V=await Re(`/api/devices/credentials-map?t=${Date.now()}`);if(V&&V.ok&&V.credentials){const Y=V.credentials,D=s&&Y[s]||v&&Y[v]||s&&Y[s.replace(/:/g,"-")]||l&&Y[l];D&&(B=String(D.user||D.auth_user||"").trim(),q=String(D.password||D.auth_password||D.pass||"").trim())}}catch(V){throw new Error(`❌ Lỗi kết nối VPS khi tải tài khoản máy in: ${V.message||"Lỗi mạng"}`)}if(!B){const V=s||l||"chưa xác định";throw new Error(`⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS cho thiết bị (MAC/IP: ${V}). Vui lòng nhập User/Pass và bấm "Lưu Auth" trước!`)}return{user:B,pass:q,mac:s||l}},H=async(r,c,l,s)=>{var Y;const v=l||z,B=s||g;if(!v)return;const q=((Y=u.find(D=>D.id===c))==null?void 0:Y.name)||"";if(await te(r,"trigger_utility",{action:"query_camera_video",camera_name:q,timestamp:v,duration:B})){x("Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!","info");return}me(!0),ge("");try{const d=await(await fetch(`${hi}/api/agents/${r}/cameras/${c}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:v,duration:B})})).json();if(d.ok){const F=v.replace(/[- :]/g,""),a=F.substring(0,8)+"_"+F.substring(8,14);ge(`clip_${K.camera_name}_${a}.mp4`)}else x("Không truy xuất được video: "+d.error,"error")}catch(D){x("Lỗi kết nối render: "+D.message,"error")}finally{me(!1)}},oe=r=>{const c=r.match(/_(\d{8}_\d{6})\.mp4$/);if(c){const l=c[1],s=`${l.substring(0,4)}-${l.substring(4,6)}-${l.substring(6,8)} ${l.substring(9,11)}:${l.substring(11,13)}:${l.substring(13,15)}`;Ne(s),Se(60),H(o,K.id,s,60),setTimeout(()=>{var v;(v=document.getElementById("video-playback-card"))==null||v.scrollIntoView({behavior:"smooth",block:"center"})},100)}else x("Không parse được thời gian từ tên tệp","error")},se=(r,c)=>{var V,Y;const s=(J||[]).flatMap(D=>D.printers||[]).find(D=>String(D.id)===String(r)||D.mac_id===r||D.ip===r)||((V=m==null?void 0:m.printers)==null?void 0:V[0]),v=(m==null?void 0:m.public_ip)||(m==null?void 0:m.wan_ip),B=(Y=((m==null?void 0:m.agents)||[]).find(D=>D.is_agent_active&&(D.public_ip&&D.public_ip===v||D.wan_ip&&D.wan_ip===v)))==null?void 0:Y.agent_uid,q=G(r)||(s==null?void 0:s.agent_uid)||B||"";_({isOpen:!0,printerId:r,entry:c,agentUid:q})},_e=async()=>{var D;const{printerId:r,entry:c,agentUid:l}=P;if(!c)return;_(d=>({...d,isOpen:!1}));const s=c.email_address||c.email||"",v=c.physical_path||c.folder||c.folder_path||"",B=(s||v||"").trim(),q=String(c.registration_no&&c.registration_no!=="-"?c.registration_no:c.entry_id||"").trim(),Y=((m==null?void 0:m.emails)||[]).find(d=>d.email.toLowerCase().trim()===B.toLowerCase().trim());if(Y&&Y.id){x("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const d=await Xn(Y.id);if(d.ok)x("Đã xóa thành công!","success"),await E();else throw new Error(d.error||"Không thể xóa")}catch(d){x(`Lỗi xóa: ${d.message}`,"error")}return}x("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const d=(J||[]).flatMap(A=>A.printers||[]),F=String(r||"").toUpperCase().replace(/[:-]/g,""),a=d.find(A=>{const U=String(A.id||""),de=String(A.ip||A.printer_ip||""),Ae=String(A.mac_address||A.mac_id||A.mac||"").toUpperCase().replace(/[:-]/g,"");return U===String(r)||de===r||F&&Ae===F})||d.find(A=>{const U=(A.printer_name||A.name||A.brand||"").toLowerCase();return U.includes("ricoh")||U.includes("toshiba")})||d[0],he=((a==null?void 0:a.mac_address)||(a==null?void 0:a.mac_id)||String(r)||"").toUpperCase().replace(/-/g,":"),re=((a==null?void 0:a.printer_type)||(a==null?void 0:a.printer_name)||(a==null?void 0:a.brand)||"").toLowerCase().includes("toshiba")||he.startsWith("00:80:91"),we=re?"toshiba_delete_scan":"ricoh_delete_scan",Te=(W||[]).find(A=>A.command===we),Ke=(m==null?void 0:m.public_ip)||(m==null?void 0:m.wan_ip),tt=(D=((m==null?void 0:m.agents)||[]).find(A=>A.is_agent_active&&(A.public_ip&&A.public_ip===Ke||A.wan_ip&&A.wan_ip===Ke)))==null?void 0:D.agent_uid,Be=l||G(r)||(a==null?void 0:a.agent_uid)||tt||"";let Ie;if(Be){let A=Te;if(!A)try{A=(await Ur(Be)||[]).find(ue=>ue.command===we)}catch{}const U=(a==null?void 0:a.ip)||(a==null?void 0:a.printer_ip)||(r.includes(".")?r:""),{user:de,pass:Ae}=await T(a),Ee=String((c==null?void 0:c.entry_id)||(c==null?void 0:c.id)||q||"").trim()||"null";let fe=(A==null?void 0:A.command_content)||gi[we]||"";if(!fe){x(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${we}' trên hệ thống VPS!`,"error");return}fe=fe.replace(/__TARGET_IP__/g,U||"null"),fe=fe.replace(/__TARGET_USER__/g,de||"admin"),fe=fe.replace(/__TARGET_PASS__/g,Ae||""),fe=fe.replace(/__TARGET_ID__/g,Ee),fe=fe.replace(/__TARGET_SCAN_USER__/g,(c==null?void 0:c.name)||"null"),Ie=await it(Be,we,fe,{printer_ip:U,ip:U,auth_user:de,auth_password:Ae,target_id:Ee,entry_id:Ee,registration_no:q})}else Ie=await ei(r,q,c.entry_id||"",l||void 0);if(!Ie.ok||!Ie.command_id)throw new Error(Ie.error||"Không thể tạo lệnh xóa");k(Ie.command_id,r,async A=>{x(`Đã xóa đăng ký #${q} thành công!`,"success"),console.log("Finish delete scan point, updating address book state directly",A);const U=(a==null?void 0:a.mac_address)||(a==null?void 0:a.mac_id)||(typeof r=="string"&&r.includes(":")?r:""),de=U?String(U).toUpperCase().replace(/-/g,":"):"",Ae=a!=null&&a.id?String(a.id):String(r),Ee=(a==null?void 0:a.ip)||(a==null?void 0:a.printer_ip)||(typeof r=="string"&&r.includes(".")?r:"");let fe=(A==null?void 0:A.address_book_sync)||(A==null?void 0:A.address_book_data);if(!fe&&(A!=null&&A.result||A!=null&&A.result_payload)){const ue=String(A.result||A.result_payload||"").trim();if(ue.includes("__ADDRESS_BOOK_JSON_START__"))try{let Ge=ue.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();Ge=Ge.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),fe=JSON.parse(Ge)}catch{}else if(ue.startsWith("{")&&ue.includes('"address_list"'))try{fe=JSON.parse(ue)}catch{}}fe&&typeof X=="function"&&X(ue=>{const Ge={...ue};return de&&(Ge[de]=fe),Ae&&(Ge[Ae]=fe),Ee&&(Ge[Ee]=fe),Ge});const at={...a||{},id:r,ip:(a==null?void 0:a.ip)||(typeof r=="string"&&r.includes(".")?r:""),mac_address:(a==null?void 0:a.mac_address)||(typeof r=="string"&&r.includes(":")?r:""),printer_type:re?"toshiba":"ricoh",brand:re?"toshiba":"ricoh",agent_uid:Be||(a==null?void 0:a.agent_uid)||l||o||""};h(at)},A=>{x(`Lỗi xóa điểm scan: ${A}`,"error")},`⌛ Đang xóa điểm scan #${q}...`)}catch(d){x(`Lỗi gửi lệnh xóa: ${d.message}`,"error")}},ve=(r,c)=>{const l=c.folder||c.physical_path||c.folder_path||"";let s="",v="2130";const B=l.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),q=l.match(/^\\\\([^\\]+)(.*)$/);if(B)s=B[1],v=B[2]||"2130";else if(q)s=q[1],v="";else{const Y=l.match(/^([^:/]+)(?::(\d+))?(.*)$/);Y&&!l.startsWith("\\\\")&&(s=Y[1],v=Y[2]||"2130")}const V=s?v?`${s}:${v}`:s:"192.168.1.100:2130";S({printerId:r,entry:c,currentIp:s,newIp:V,newPort:v||"2130"}),R("edit_ip")},xe=async()=>{var F;if(!N)return;const{printerId:r,entry:c,newIp:l,newPort:s}=N,v=c.folder||c.physical_path||c.folder_path||"",B=v.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),q=v.match(/^\\\\([^\\]+)(.*)$/);let V=l.trim();if((s||"2130").trim(),V.includes(":")){const a=V.split(":");V=a[0].trim(),a[1].trim()}if(B)B[3];else if(q)q[2];else{const a=v.match(/^([^:/]+)(?::(\d+))?(.*)$/);a&&!v.startsWith("\\\\")&&a[3]}const Y=G(r),D=c.registration_no;R(null),x("Gửi yêu cầu thay đổi IP của điểm scan...","info",3e3);let d="";if(B)d=B[1];else if(q)d=q[1];else{const a=v.match(/^([^:/]+)/);a&&!v.startsWith("\\\\")&&(d=a[1])}d||(d=V);try{const a=(F=m==null?void 0:m.printers)==null?void 0:F.find(A=>A.id===Number(r)),he=(a==null?void 0:a.mac_address)||(a==null?void 0:a.mac_id)||"",re=he?String(he).toUpperCase().replace(/-/g,":"):"",we=f[re]||f[r]||{},Te=we.user||(a==null?void 0:a.auth_user)||(a==null?void 0:a.username),Ke=we.pass||(a==null?void 0:a.auth_password)||(a==null?void 0:a.password)||"";if(!Te)throw new Error(`Chưa cấu hình tài khoản Web cho máy in ${(a==null?void 0:a.printer_name)||(a==null?void 0:a.name)||"Photocopy"}!`);const Be=($?$((a==null?void 0:a.printer_name)||(a==null?void 0:a.name)||""):"ricoh")==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",Ie=await it(Y,Be,"",{printer_ip:(a==null?void 0:a.ip)||"",auth_user:Te,auth_password:Ke,target_id:D,target_name:c.name,old_ip:d,new_ip:V});if(!Ie.ok||!Ie.command_id)throw new Error(Ie.error||"Không thể gửi lệnh thay đổi FTP");k(Ie.command_id,r,async A=>{x(`Đã thay đổi IP điểm scan #${D} thành công!`,"success");const U=(a==null?void 0:a.mac_address)||(a==null?void 0:a.mac_id)||r,de=U?String(U).toUpperCase().replace(/-/g,":"):"";let Ae=(A==null?void 0:A.address_book_sync)||(A==null?void 0:A.address_book_data);if(!Ae&&(A!=null&&A.result||A!=null&&A.result_payload)){const Ee=String(A.result||A.result_payload||"");if(Ee.includes("__ADDRESS_BOOK_JSON_START__"))try{let fe=Ee.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();fe=fe.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),Ae=JSON.parse(fe)}catch{}}de&&Ae&&typeof X=="function"&&X(Ee=>({...Ee,[de]:Ae})),h&&h(r)},A=>{x(`Lỗi thay đổi IP: ${A}`,"error")},`⌛ Đang cập nhật IP điểm scan #${D}...`)}catch(a){x(`Lỗi gửi lệnh thay đổi IP: ${a.message}`,"error")}},le=async(r,c)=>{ce({lanUid:r,email:c}),ee(!0),ie([]),R("storage");try{const l=await Or(r,c);if(l.ok)ie(l.rows||[]);else throw new Error(l.error||"Lỗi server")}catch(l){x(`Không thể lấy tệp đã scan: ${l.message}`,"error")}finally{ee(!1)}},y=(r,c,l,s,v,B,q,V)=>{let Y=s,D=v,d=c,F=l;const a=B&&Array.isArray(B)?B:[];if((!D||!Y)&&a.length>0){const Te=a[0];Te&&Te.drivers&&Te.drivers.length>0&&(Y=Te.drivers[0].name,D=Te.drivers[0].url,d=Te.brand||c,F=Te.model||l)}const he=((m==null?void 0:m.agents)||[]).filter(Te=>Te.is_agent_active),re=G(r);let we=[];re&&he.some(Te=>Te.agent_uid===re)?we=[re]:he.length>0&&(we=he.map(Te=>Te.agent_uid)),Q({isOpen:!0,printerId:r,printerIp:q||(r.includes(".")?r:""),macId:V||(r.includes(":")?r:""),brand:d,model:F,driverName:Y,driverUrl:D,suggestedDrivers:a,selectedAgentUids:we})},p=r=>{if(r===0)return"0 Bytes";const c=1024,l=["Bytes","KB","MB","GB"],s=Math.floor(Math.log(r)/Math.log(c));return parseFloat((r/Math.pow(c,s)).toFixed(1))+" "+l[s]},h=async(r,c)=>{let l=String(typeof r=="object"?r.id||r.ip||r.mac_address||r.mac_id:r);(!l||l==="0"||l==="undefined"||l.toLowerCase()==="none")&&typeof r=="object"&&(l=r.ip||r.mac_address||r.mac_id||"0");const s=typeof r=="object"?r:null,v=c||(s==null?void 0:s.agent_uid)||(s!=null&&s.id&&G?G(s.id):"")||(G?G(l):"")||agentUid||o||"";x&&x("⌛ Đang yêu cầu Agent đọc trực tiếp danh bạ từ máy photocopy...","info",3e3);try{const{user:B,pass:q}=await T(s||{ip:l,mac_address:l}),V={auth_user:B,auth_password:q};s&&(s.ip&&(V.printer_ip=s.ip),(s.name||s.printer_name)&&(V.printer_name=s.name||s.printer_name),(s.mac_address||s.mac_id)&&(V.mac_id=s.mac_address||s.mac_id),(s.printer_type||s.brand)&&(V.printer_type=s.printer_type||s.brand,V.brand=s.printer_type||s.brand));const Y=await Vn(l,v||void 0,V);if(!Y.ok||!Y.command_id)throw new Error(Y.error||"Không thể tạo lệnh đọc danh bạ");k&&k(Y.command_id,l,async D=>{let d=(D==null?void 0:D.address_book_sync)||(D==null?void 0:D.address_book_data)||(D==null?void 0:D.result);if(!d&&typeof(D==null?void 0:D.result_payload)=="string"){const F=D.result_payload;if(F.includes("__ADDRESS_BOOK_JSON_START__"))try{const a=F.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();d=JSON.parse(a)}catch{}if(!d){const a=F.match(/(\{\s*"status"[\s\S]*"address_list"[\s\S]*\})/);if(a)try{d=JSON.parse(a[1])}catch{}}}if(console.log("=================================================="),console.log(`[FRONTEND] KẾT QUẢ ĐỒNG BỘ DANH BẠ MÁY IN (Command ID #${Y.command_id}):`,D),console.log(`[FRONTEND] CHI TIẾT DANH BẠ (Count: ${(d==null?void 0:d.count)||0}):`,(d==null?void 0:d.address_list)||d),console.log("=================================================="),(d==null?void 0:d.status)==="error"){x&&x(`❌ Lỗi đọc danh bạ máy in: ${d.error||"Đăng nhập thất bại"}`,"error");return}if(x&&x("✓ Đã cập nhật danh bạ máy in thành công!","success"),d){X&&X(a=>{const he={...a};l&&(he[l]=d);const re=((s==null?void 0:s.mac_address)||(s==null?void 0:s.mac_id)||(typeof l=="string"&&l.includes(":")?l:"")).toUpperCase().replace(/-/g,":"),we=(s==null?void 0:s.ip)||(typeof l=="string"&&l.includes(".")?l:"");return re&&(he[re]=d),we&&(he[we]=d),he});const F=((s==null?void 0:s.mac_address)||(s==null?void 0:s.mac_id)||(typeof l=="string"&&l.includes(":")?l:"")).toUpperCase().replace(/-/g,":");F&&Re("/api/scan-points/save",{method:"POST",body:JSON.stringify({mac_id:F,printer_name:(s==null?void 0:s.printer_name)||(s==null?void 0:s.name)||"Photocopy",ip:(s==null?void 0:s.ip)||"",agent_uid:v||agentUid||o||"",address_book_data:d})}).catch(a=>console.error("Failed to post scan points to VPS DB:",a)),t.setCommandStatus&&t.setCommandStatus(a=>({...a,[l]:{...a[l]||{},address_book_sync:d,isPending:!1}}))}},D=>{console.error(`[FRONTEND LỖI ĐỒNG BỘ DANH BẠ] Command ID #${Y.command_id}:`,D),x&&x(`Lỗi đọc danh bạ: ${D}`,"error")},"⌛ Agent đang đọc danh bạ máy in...")}catch(B){x&&x(`Lỗi gửi lệnh đọc danh bạ: ${B.message}`,"error")}},I=async()=>{var v;const{printerId:r,name:c,email:l,agentUid:s}=t.publicFtpData||{};if(!c||!c.trim()){x&&x("Vui lòng nhập tên điểm scan","error");return}t.setPublicFtpLoading&&t.setPublicFtpLoading(!0);try{const q=(J||[]).flatMap(a=>a.printers||[]).find(a=>String(a.id)===String(r)||a.mac_id===r||a.ip===r)||((v=m==null?void 0:m.printers)==null?void 0:v[0]),{user:V,pass:Y,mac:D}=await T(q||{id:r,mac_address:r}),d={mac_address:D,printer_ip:(q==null?void 0:q.ip)||"",auth_user:V,auth_password:Y},F=await Kn(r,c.trim(),l,s||void 0,d);if(t.setPublicFtpLoading&&t.setPublicFtpLoading(!1),R&&R(null),!F.ok||!F.command_id)throw new Error(F.error||"Lỗi gửi lệnh");k&&k(F.command_id,r,async a=>{x&&x(`Đã tạo điểm scan "${c.trim()}" thành công!`,"success"),h(r),E&&await E()},a=>{x&&x(`Thêm điểm scan thất bại: ${a}`,"error")},`⌛ Đang tạo điểm scan "${c.trim()}"...`)}catch(B){t.setPublicFtpLoading&&t.setPublicFtpLoading(!1),x&&x(`Lỗi: ${B.message}`,"error")}},O=async()=>{const{lanUid:r,agentUid:c,email:l}=t.privateFtpData||{};if(!l||!l.includes("@")){x&&x("Địa chỉ email không hợp lệ","error");return}t.setPrivateFtpLoading&&t.setPrivateFtpLoading(!0);try{const s=await Jn("default",r,c,l);if(t.setPrivateFtpLoading&&t.setPrivateFtpLoading(!1),R&&R(null),s.ok)x&&x("Đã thêm Private FTP thành công","success"),E&&await E();else throw new Error(s.error||"Lỗi server")}catch(s){t.setPrivateFtpLoading&&t.setPrivateFtpLoading(!1),x&&x(`Lỗi thêm FTP riêng: ${s.message}`,"error")}},L=async()=>{if(!o){x&&x("Chưa chọn Agent để khởi động lại","error");return}x&&x(`Đang gửi lệnh khởi động lại Agent (${o})...`,"info",4e3);try{const r=await Zn(o);if(r.ok)x&&x("Đã gửi lệnh khởi động lại Agent khẩn cấp!","success"),R&&R(null);else throw new Error(r.error||"Thất bại")}catch(r){x&&x(`Lỗi khởi động lại: ${r.message}`,"error")}},b=C.useCallback(r=>Nr(r,(m==null?void 0:m.emails)||[],(m==null?void 0:m.agents)||[]),[m]);return{formatBytes:p,getDestinationStatus:b,getDestinationStatusHtml:Nr,handleAddPrivateFtp:O,handleAddPublicFtp:I,handleConfirmDeleteScanPoint:_e,handleDeleteDest:se,handleEditIP:ve,handleEmergencyRestart:L,handleOpenStorageFiles:le,handlePlaySegmentFile:oe,handleQueryVideo:H,handleRefetchAddressBook:h,handleRemoteInstallDriver:y,handleSaveEditIP:xe}};function _i({showToast:t,replaceToast:o}={}){const u=C.useCallback((P,N="info")=>{if(typeof o=="function")try{o("driver-install-progress",P,N);return}catch{}typeof t=="function"&&t(P,N,5e3)},[t,o]);return{executeRemoteInstallDriver:C.useCallback(async(P,N,E,G,te,J,k,g)=>{u(`⏳ [${J}] Đang gửi lệnh cài đặt driver (${G||E})...`,"info");try{const z=await Fr(P,N,E,G,te,J,k,g);if(!z.ok)throw new Error(z.error||"Server trả về lỗi");const j=z.command_id;if(!j){u(`✅ [${J}] Đã gửi lệnh cài đặt driver thành công.`,"success");return}const Z=3e5,K=2e3,m=Date.now();let R="";const _=setInterval(async()=>{try{const S=Date.now()-m;if(S>Z){clearInterval(_),u(`⏰ [${J}] Quá thời gian chờ (5 phút).`,"info");return}const Q=await Ct(j);if(Q.status==="success")clearInterval(_),u(`✅ [${J}] Cài đặt driver thành công!`,"success");else if(Q.status==="failed"||!Q.ok)clearInterval(_),u(`❌ [${J}] Cài driver thất bại: ${Q.error||"Lỗi không xác định"}`,"error");else{const X=Q.progress_text||"";if(X&&X!==R)R=X,u(`⏳ [${J}] ${X}`,"info");else if(!X){const ge=Math.round(S/1e3);u(`⚡ [${J}] Đang tiến hành cài đặt... (${ge}s)`,"info")}}}catch{}},K)}catch(z){u(`❌ Lỗi cài đặt driver: ${z.message||z}`,"error")}},[u])}}function xi(){const t=mi({}),o=ui(t),u=fi({...t,...o}),f=_i({showToast:t.showToast,replaceToast:t.replaceToast});return{...t,...o,...u,...f}}function wi(){var _;const t=xi(),{toasts:o=[],lanSitesLoading:u,selectedPublicIp:f,setSelectedPublicIp:P,setSelectedLanUid:N,activeTab:E,setActiveTab:G,selectedLan:te,triggerLanScan:J,filteredPrinters:k,fetchLanSitesData:g,myClientIp:z}=t,[j,Z]=C.useState(()=>f||""),K=C.useRef(null);C.useEffect(()=>{Z(f||"")},[f]);const m=async S=>{const Q=(S||"").trim();P(Q),localStorage.removeItem("goxprint_selected_lan_uid"),N&&N(""),Q?(localStorage.setItem("goxprint_selected_public_ip",Q),localStorage.setItem("gox_connect_public_ip",Q)):(localStorage.removeItem("goxprint_selected_public_ip"),localStorage.removeItem("gox_connect_public_ip")),g&&await g(!0)},R=z?`IP Public máy này: ${z}`:"Nhập IP Public kết nối (VD: 116.98.0.59)...";return e.jsxs(Ve.div,{style:n.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:n.toastContainer,children:e.jsx(et,{children:o.map(S=>e.jsxs(Ve.div,{style:{...n.toast,borderLeft:`4px solid ${S.type==="success"?"var(--color-success)":S.type==="error"?"var(--color-error)":"var(--color-primary)"}`},initial:{opacity:0,x:50,scale:.9},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:50,scale:.9},children:[e.jsx("span",{style:n.toastIcon,children:S.type==="success"?"✔️":S.type==="error"?"❌":"ℹ️"}),e.jsx("div",{style:{flex:1,fontSize:"0.8rem"},children:S.message})]},S.id))})}),e.jsxs("div",{style:n.fixedHeader,children:[e.jsx("div",{style:n.header,children:e.jsx("h1",{style:n.title,children:"🛠️ Quản lý Mạng LAN"})}),e.jsxs("div",{style:n.filterBar,children:[e.jsx("label",{style:n.filterLabel,children:"🌐 IP Public LAN:"}),e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"8px",flex:1,maxWidth:"420px"},children:e.jsxs("div",{style:{position:"relative",flex:1,display:"flex",alignItems:"center"},children:[e.jsx("input",{ref:K,type:"text",value:j,onChange:S=>Z(S.target.value),onKeyDown:S=>{S.key==="Enter"&&m(j)},placeholder:R,style:{width:"100%",padding:f||j?"8px 74px 8px 12px":"8px 42px 8px 12px",fontSize:"0.88rem",borderRadius:"8px",border:"1px solid rgba(255, 255, 255, 0.2)",background:"rgba(0, 0, 0, 0.4)",color:"#fff",outline:"none",boxSizing:"border-box",transition:"padding 0.2s"}}),(f||j)&&e.jsx("button",{onClick:()=>{var S;Z(""),m(""),(S=K.current)==null||S.focus()},title:"Xóa IP Public",style:{position:"absolute",right:"40px",background:"transparent",color:"#ef4444",border:"none",boxShadow:"none",width:"24px",height:"24px",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,transition:"all 0.2s"},children:"✕"}),e.jsx("button",{onClick:async()=>{j&&await m(j),te?J(te,!0):g&&g(!0)},title:"Gửi & Kết nối IP Public (Enter)",style:{position:"absolute",right:"4px",background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(16, 185, 129, 0.3)"},children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 2L11 13"}),e.jsx("path",{d:"M22 2l-7 20-4-9-9-4 20-7z"})]})})]})})]}),e.jsxs("div",{style:n.tabBar,children:[e.jsxs("button",{style:{...n.tabBtn,color:E==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:E==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>G("agents"),children:["💻 Máy tính (",((_=te==null?void 0:te.agents)==null?void 0:_.filter(S=>S.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...n.tabBtn,color:E==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:E==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{G("copiers")},children:["🖨️ Photocopy (",k.length,")"]})]})]}),e.jsxs("div",{style:n.scrollableContent,children:[u&&e.jsx("div",{style:n.loadingWrapper,children:e.jsx(nt,{size:"md"})}),!u&&te&&e.jsxs(et,{mode:"wait",children:[E==="agents"&&e.jsx(ni,{...t}),E==="copiers"&&e.jsx(ri,{...t})]})]}),e.jsx(si,{...t})]})}export{wi as AgentPage,wi as default};
