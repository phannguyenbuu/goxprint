import{j as e,R as We,A as et,m as Ve,r as y,L as lt}from"./index-DRfamXxs.js";import{A as Or}from"./AnimatedList-DbHfeQSy.js";import{G as Fr}from"./GlowCard-CAaShPHT.js";const n={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"230px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",right:"12px",left:"auto",zIndex:9999,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px",width:"auto",maxWidth:"min(48vw, 240px)",pointerEvents:"none"},toast:{background:"transparent",backdropFilter:"blur(4px)",borderRadius:"4px",padding:"3px 8px",display:"inline-flex",alignItems:"center",gap:"5px",border:"1px solid rgba(255, 255, 255, 0.15)",color:"var(--color-text)",pointerEvents:"auto",fontSize:"0.72rem",lineHeight:1.2,width:"auto",maxWidth:"100%",wordBreak:"break-word"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},Oe={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function Wn({hasAddressList:t,sync:s,p:a,commandStatus:g,getDestinationStatus:f,selectedLan:P,handleOpenStorageFiles:N,handleDeleteDest:K,handleChangeFtp:_e,handleEditIP:X}){const U=Array.isArray(s==null?void 0:s.address_list)?s.address_list.filter(v=>{if(!v||typeof v!="object"||v.type==="Summary")return!1;const Q=(v.name||"").trim();return Q==="Summary"||Q==="Total"||Q.startsWith("Users:")?!1:!!(Q||v.entry_id||v.registration_no&&v.registration_no!=="-"||v.email_address||v.email||v.folder||v.physical_path)}):[],E=String((a==null?void 0:a.mac_address)||(a==null?void 0:a.mac_id)||"").toUpperCase().replace(/-/g,":"),le=String((a==null?void 0:a.ip)||(a==null?void 0:a.printer_ip)||"").trim(),$=E||le||String((a==null?void 0:a.id)||"0");return e.jsxs("div",{style:Oe.destinationsBlock,children:[e.jsx("span",{style:Oe.destBlockTitle,children:"📂 Danh sách điểm scan:"}),U.length>0?U.map((v,Q)=>{var Te,ve,te;const m=v.email_address||v.email||"",A=v.physical_path||v.folder||v.folder_path||"",O=(m||A||"").trim();let j="Folder";A.startsWith("ftp://")?j="FTP":A.startsWith("\\\\")?j="SMB":(m||m.includes("@"))&&(j="Email"),typeof f=="function"&&f(v);const ee=v.registration_no&&v.registration_no!=="-"?v.registration_no:v.entry_id||Q+1,Z=`${$}-${ee}`,xe=!!((Te=g[Z])!=null&&Te.isPending||a!=null&&a.id&&((ve=g[`${a.id}-${ee}`])!=null&&ve.isPending)||E&&((te=g[`${E}-${ee}`])!=null&&te.isPending));return e.jsxs("div",{style:{...Oe.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",ee]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[v.name,(v.warning||v.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:v.warning||v.error,children:"⚠️"})]}),typeof v.file_count=="number"&&e.jsxs("span",{onClick:()=>N(P.lan_uid,O),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",v.file_count," files"]}),v.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:v.entry_id})]}),_e&&(j==="FTP"||j==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:xe?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:xe?.5:1,minWidth:"24px"},onClick:()=>X&&X(a,v),disabled:xe,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:xe?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:xe?.5:1,minWidth:"24px"},onClick:()=>K(a,v),disabled:xe,title:"Xóa",children:"🗑️"})]},Q)}):e.jsx("div",{style:Oe.emptySubText,children:s.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Chưa có điểm scan nào trên máy in."})]})}const $n="https://agentapi.quanlymay.com";async function Ee(t,s={}){const a=(s.method||"GET").toUpperCase(),g=t.includes("?")?"&":"?",f=a==="GET"?`${t}${g}_t=${Date.now()}`:t,P=await fetch(`${$n}${f}`,{...s,headers:{"Content-Type":"application/json","Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0","X-API-Token":"change-me",...s.headers},cache:"no-store"});if(!P.ok){const N=await P.json().catch(()=>({}));throw new Error(N.error||`HTTP error! status: ${P.status}`)}return await P.json()}async function Hn(t){try{const s=t?`&public_ip=${encodeURIComponent(t)}`:"";return await Ee(`/api/lan-sites?lead=default${s}`)||{rows:[]}}catch(s){return console.error("Failed to fetch LAN sites:",s),{rows:[]}}}async function Vn(t,s,a,g,f){return Ee(`/api/devices/${encodeURIComponent(t)}/credentials`,{method:"PATCH",body:JSON.stringify({auth_user:s,auth_password:a,mac_id:g||t,printer_type:f})})}async function Kn(t,s,a){const g=s?`/api/devices/${t}/fetch-address-book?agent_uid=${s}`:`/api/devices/${t}/fetch-address-book`;return Ee(g,{method:"POST",body:JSON.stringify(a||{})})}async function Jn(t){const s=t.trim().toUpperCase().replace(/-/g,":");return Ee(`/api/scan-points/${encodeURIComponent(s)}`,{method:"DELETE"})}async function Ur(t){return Ee(`/api/lan-sites/${encodeURIComponent(t)}/printers`,{method:"DELETE"})}async function Nt(t){return Ee(`/api/commands/${t}/status`)}async function qn(t,s,a,g,f){const P=g?`/api/devices/${t}/add-email-dest?agent_uid=${g}`:`/api/devices/${t}/add-email-dest`;return Ee(P,{method:"POST",body:JSON.stringify({name:s,email:a,...f||{}})})}async function Xn(t,s,a,g){return Ee("/api/lan-emails",{method:"POST",body:JSON.stringify({lead:t,lan_uid:s,email:g,email_type:"private",pc_name:a})})}async function Qn(t,s,a,g,f){return Ee(`/api/devices/${t}/delete-email-dest`,{method:"POST",body:JSON.stringify({registration_no:s,entry_id:a,agent_uid:g,...f||{}})})}async function Yn(t){return Ee(`/api/lan-emails/${t}`,{method:"DELETE"})}async function Br(t,s){return Ee(`/api/scans/files?lan_uid=${encodeURIComponent(t)}&email=${encodeURIComponent(s)}`)}async function Gr(t,s,a,g,f,P,N,K){return Ee(`/api/devices/${encodeURIComponent(t)}/install-driver`,{method:"POST",body:JSON.stringify({brand:s,model:a,driver_name:g,driver_url:f,agent_uid:P,printer_ip:N,mac_id:K})})}async function Zn(t,s,a,g=1,f=50,P,N){const K=new URLSearchParams;return t&&K.append("lead",t),K.append("lan_uid",s),g&&K.append("page",g.toString()),f&&K.append("limit",f.toString()),K.append("t",Date.now().toString()),Ee(`/api/jobs?${K.toString()}`)}async function ei(t,s,a){return Ee(`/api/agents/${t}/utility/${s}?lead=default`,{method:"POST",body:a?JSON.stringify(a):void 0})}async function zr(t){return Ee(`/api/agents/${t}/utility-commands?lead=default&t=${Date.now()}`)}async function ot(t,s,a,g){return Ee(`/api/agents/${t}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify({command:s,command_content:a,...g||{}})})}async function ti(t){return Ee(`/api/agents/${t}/emergency-restart?lead=default`,{method:"POST",body:"{}"})}const ri=Qn;function ni({p:t,selectedLan:s,activeAgentUid:a,selectedAgentUid:g,copierCredentials:f,setCopierCredentials:P,saveAuthLoading:N,handleSaveAuth:K,isExpanded:_e,handleCopierClick:X,onlineAgents:U,showToast:E,fetchRemotePage:le,setRemoteLockPrinter:$,setActiveModal:v,hasAddressList:Q,sync:m,commandStatus:A,getDestinationStatus:O,handleOpenStorageFiles:j,handleEditIP:ee,handleDeleteDest:Z,handleRefetchAddressBook:xe,onClearCache:Te,expandedDrivers:ve,setExpandedDrivers:te,expandedDriverMenus:ce,setExpandedDriverMenus:re,handleRemoteInstallDriver:Se,setPublicFtpData:b}){var l,Y,z,pe,me,Ke,tt,rt;const[q,H]=We.useState(!1),[F,D]=We.useState(!1),[oe,w]=We.useState("");We.useEffect(()=>{const I=(t==null?void 0:t.agent_uid)||a||g||"";w(I)},[t,a,g,U]);const S=(t.mac_address||t.mac_id||"").toUpperCase().replace(/-/g,":"),se=t.ip||"",ae=String(t.id!==void 0&&t.id!==null?t.id:""),ue=S&&(A==null?void 0:A[S])||se&&(A==null?void 0:A[se])||ae&&(A==null?void 0:A[ae]),he=!!(ue!=null&&ue.isPending||t.id&&((l=A[t.id])!=null&&l.isPending)||S&&((Y=A[S])!=null&&Y.isPending)),de=(ue==null?void 0:ue.message)||t.id&&((z=A[t.id])==null?void 0:z.message)||"",J=I=>I&&(Array.isArray(I.address_list)||I.address_book_data&&Array.isArray(I.address_book_data.address_list)),h=I=>{if(!I)return 0;const ne=I.timestamp||I.updated_at||I.last_seen||0,B=new Date(ne).getTime();return isNaN(B)?0:B},x=J(m)?m:null,_=J(ue==null?void 0:ue.address_book_sync)?ue.address_book_sync:J(ue)?ue:null,r=x&&_?h(_)>=h(x)?_:x:_||x||{},d=String(t.printer_type||t.type||t.name||t.printer_name||"").toLowerCase();d.includes("ricoh")||d.includes("toshiba")||d.includes("fujifilm"),t.name||t.printer_name;const p=t.suggested_drivers&&Array.isArray(t.suggested_drivers)?t.suggested_drivers:[],o=S||se||ae||"copier",u=!!(ve[o]||t.id!==void 0&&ve[t.id]||t.mac_id&&ve[t.mac_id]||t.mac_address&&ve[t.mac_address]||t.ip&&ve[t.ip]),c=(()=>{if(Array.isArray(r==null?void 0:r.address_list)&&r.address_list.length>0)return r.address_list;if(r!=null&&r.address_book_data&&Array.isArray(r.address_book_data.address_list))return r.address_book_data.address_list;if(Array.isArray(m==null?void 0:m.address_list)&&m.address_list.length>0)return m.address_list;if(m!=null&&m.address_book_data&&Array.isArray(m.address_book_data.address_list))return m.address_book_data.address_list;const I=[r==null?void 0:r.result,r==null?void 0:r.result_payload,r==null?void 0:r.raw];for(const ne of I)if(ne){if(Array.isArray(ne))return ne;if(typeof ne=="object"&&Array.isArray(ne.address_list))return ne.address_list;if(typeof ne=="string"){let B=ne.trim();if(B.includes("__ADDRESS_BOOK_JSON_START__"))try{B=B.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),B=B.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const G=JSON.parse(B);if(G&&Array.isArray(G.address_list))return G.address_list;if(Array.isArray(G))return G}catch{}}}return[]})(),C=c.filter(I=>{if(!I||typeof I!="object"||I.type==="Summary")return!1;const ne=(I.name||"").trim();return ne==="Summary"||ne==="Total"||ne.startsWith("Users:")?!1:!!(ne||I.entry_id||I.registration_no&&I.registration_no!=="-"||I.email_address||I.email||I.folder||I.physical_path)}),k={...r,address_list:c,status:c.length>0?"success":(r==null?void 0:r.status)||"none",timestamp:((pe=A==null?void 0:A[t.id])==null?void 0:pe.timestamp)||(r==null?void 0:r.timestamp)||new Date().toISOString()},T=C.length>0||Q,R=C.length,M=k.timestamp?new Date(k.timestamp).toLocaleTimeString("vi-VN"):"",ie=We.useCallback(async(I,ne)=>{var wt;const B=String(I.printer_type||I.type||I.printer_name||I.name||"").toLowerCase(),G=B.includes("ricoh"),W=B.includes("toshiba");if(!G&&!W){E("Thiết bị không hỗ trợ thay đổi FTP","error");return}const Ie=W?"toshiba_change_ftp":"ricoh_change_ftp",be=(wt=s==null?void 0:s.agents)==null?void 0:wt.find(Ue=>Ue.is_agent_active);if(!be){E("Không có Agent online để thực thi lệnh","error");return}const je=(be==null?void 0:be.local_ip)||(be==null?void 0:be.ip)||"";if(!je){E("Không tìm thấy IP của Agent để cập nhật","error");return}const Ge=ne.folder||ne.physical_path||ne.folder_path||"",Fe=Ge.match(/ftp:\/\/([^:/]+)/),$e=Ge.match(/^\\\\([^\\]+)/),nt=Ge.match(/^([^:/]+):/);let st="";Fe?st=Fe[1]:$e?st=$e[1]:nt&&(st=nt[1]),st||(st=je);const Dt=ne.registration_no||ne.id||"",Mt=ne.name||ne.username||ne.display_name||"",vt=I.ip||I.printer_ip||"";E("Cập nhật FTP...","info");let ct=I.auth_user||I.username||"",dt=I.auth_password||I.password||"";try{const Ue=await Ee(`/api/devices/credentials-map?t=${Date.now()}`);if(Ue&&Ue.ok&&Ue.credentials){const Pt=(I.mac_id||I.mac_address||"").toUpperCase().replace(/[^0-9A-F:]/g,""),Ot=Pt.replace(/[:-]/g,""),Ft=vt,ht=Pt&&Ue.credentials[Pt]||Ot&&Ue.credentials[Ot]||Ft&&Ue.credentials[Ft];ht&&(ct=ht.user||ht.auth_user||ct,dt=ht.password||ht.auth_password||dt)}}catch{}if(!ct){E("Chưa có tài khoản Web Admin máy in","error");return}try{const Ue=await ot(g,Ie,"",{printer_ip:vt,auth_user:ct,auth_password:dt,target_id:Dt,target_name:Mt,old_ip:st,new_ip:je});Ue&&Ue.ok?E("Cập nhật FTP","success"):E("Cập nhật FTP thất bại","error")}catch{E("Cập nhật FTP thất bại","error")}},[g,s,E]);return e.jsxs("div",{id:`copier-card-${S||t.id}`,onClick:()=>X(S||String(t.id)),style:{width:"100%"},children:[e.jsxs(Fr,{children:[e.jsxs("div",{style:Oe.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:Oe.copierTitle,children:["🖨️ ",t.printer_name&&t.printer_name.trim()||t.name||t.ip||"Thiết bị Photocopy"]}),e.jsxs("div",{style:Oe.copierSubtitle,children:["IP: ",t.ip," · MAC: ",t.mac_id||"—",t.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:t.agent_uid})]})]})]}),e.jsx("span",{style:{...Oe.statusBadge,color:t.probed?t.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:t.probed?t.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:t.probed?t.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:t.probed?t.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsx("div",{style:Oe.sectionBlock,children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:Oe.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsx("button",{style:{...Oe.smallBtn,padding:"6px 12px",fontSize:"0.78rem",fontWeight:600,borderColor:"#3b82f6",color:"#3b82f6",background:"rgba(59, 130, 246, 0.08)",cursor:"pointer"},onClick:I=>{I.stopPropagation(),D(!0)},children:"🔑 Nhập & Lưu Auth"})]})}),e.jsxs("div",{style:{...Oe.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:m.status==="success"?"rgba(0, 255, 136, 0.05)":m.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:m.status==="success"?"rgba(0, 255, 136, 0.15)":m.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:Oe.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),he?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:de}):T?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",R," mục) ",M?` • ${M}`:""]}):m.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",m.error," ",M?`(${M})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...Oe.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:I=>{I.preventDefault(),I.stopPropagation(),Te==null||Te(),H(!0)},disabled:he||U.length===0,children:["🔄 ",k.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),T&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(Wn,{hasAddressList:T,sync:k,p:t,commandStatus:A,getDestinationStatus:O,selectedLan:s,handleOpenStorageFiles:j,handleEditIP:ee,handleDeleteDest:Z,handleChangeFtp:ie})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...Oe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{b({printerId:t.mac_id||t.mac_address,printerObj:t,name:"",email:"",agentUid:g}),v("public_ftp")},disabled:U.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...Oe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{var ne,B;const I=g||t.agent_uid||a||((B=(ne=s==null?void 0:s.agents)==null?void 0:ne[0])==null?void 0:B.agent_uid)||"";if(!I){E("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}le(I,t.ip,"/")},disabled:!s||!s.agents||s.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...Oe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#60a5fa",color:"#60a5fa"},onClick:()=>{var I,ne,B,G;if(te&&te(W=>({...W,[o]:!u,[t.id]:!u,[t.ip]:!u})),p&&p.length>0&&re&&re(W=>{const Ie={...W};return p.forEach((be,je)=>{Ie[`${o}-${je}`]=!0,Ie[`${t.id}-${je}`]=!0}),Ie}),Se){const W=(ne=(I=p[0])==null?void 0:I.drivers)==null?void 0:ne[0];Se(t.mac_id||t.mac_address||t.ip||t.id,((B=p[0])==null?void 0:B.brand)||t.printer_type||"Ricoh",((G=p[0])==null?void 0:G.model)||t.name||t.printer_name||"Photocopy",(W==null?void 0:W.name)||"",(W==null?void 0:W.url)||"",p||[],t.ip||"",t.mac_id||t.mac_address||"")}},title:"Xem và cài đặt Driver máy in tự động cho các máy tính trong mạng LAN",children:"💻 Cài driver"}),d.includes("ricoh")&&(t.name||t.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...Oe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>E("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),d.includes("toshiba")&&e.jsx("button",{style:{...Oe.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>E("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]}),e.jsxs(et,{children:[q&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.75)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",backdropFilter:"blur(4px)"},onClick:I=>{I.preventDefault(),I.stopPropagation()},children:e.jsxs(Ve.div,{initial:{opacity:0,scale:.95,y:10},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:10},style:{background:"#121827",border:"1px solid rgba(255, 255, 255, 0.15)",borderRadius:"16px",padding:"24px",maxWidth:"480px",width:"100%",boxShadow:"0 20px 50px rgba(0,0,0,0.6)"},onClick:I=>I.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:700,color:"#fff"},children:"📖 Chọn Agent thực thi Cập nhật danh bạ"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:["Máy photo: ",e.jsx("strong",{style:{color:"#60a5fa"},children:t.printer_name||t.name||t.ip})," (",t.ip,")"]})]}),e.jsx("button",{style:{background:"transparent",border:"none",color:"#999",fontSize:"1.4rem",cursor:"pointer",padding:"4px 8px"},onClick:()=>H(!1),children:"×"})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px",maxHeight:"280px",overflowY:"auto",marginBottom:"20px",paddingRight:"4px"},children:U.length===0?e.jsx("div",{style:{padding:"16px",textAlign:"center",color:"#ef4444",fontSize:"0.85rem"},children:"⚠️ Không có Agent nào đang Online để thực thi lệnh."}):U.map(I=>{var W;const B=(oe||((W=U[0])==null?void 0:W.agent_uid)||"")===I.agent_uid,G=I.agent_uid===t.agent_uid;return e.jsxs("div",{onClick:()=>w(I.agent_uid),style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderRadius:"10px",border:B?"2px solid #3b82f6":"1px solid rgba(255, 255, 255, 0.08)",background:B?"rgba(59, 130, 246, 0.12)":"rgba(255, 255, 255, 0.03)",cursor:"pointer",transition:"all 0.2s"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",border:B?"5px solid #3b82f6":"2px solid #666",background:"#fff",boxSizing:"border-box"}}),e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.88rem",fontWeight:600,color:"#fff"},children:["🖥️ ",I.hostname||I.agent_uid]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#aaa",marginTop:"2px"},children:["IP: ",I.local_ip||"127.0.0.1"," · Port: ",I.web_port||9173]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"},children:[e.jsx("span",{style:{fontSize:"0.7rem",padding:"2px 8px",borderRadius:"12px",background:"rgba(16, 185, 129, 0.2)",color:"#10b981",fontWeight:600},children:"Online"}),G&&e.jsx("span",{style:{fontSize:"0.65rem",color:"#60a5fa",fontWeight:600},children:"(Gợi ý mặc định)"})]})]},I.agent_uid||I.id)})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[e.jsx("button",{style:{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(255, 255, 255, 0.15)",background:"transparent",color:"#ccc",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>H(!1),children:"Hủy"}),e.jsx("button",{style:{padding:"8px 18px",borderRadius:"8px",border:"none",background:"#3b82f6",color:"#fff",fontSize:"0.82rem",fontWeight:600,cursor:U.length===0?"not-allowed":"pointer",opacity:U.length===0?.5:1},disabled:U.length===0,onClick:()=>{H(!1),xe(t,oe)},children:"🚀 Thực thi Cập nhật"})]})]})}),F&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0, 0, 0, 0.75)",backdropFilter:"blur(4px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:I=>{I.stopPropagation(),D(!1)},children:e.jsxs(Ve.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},style:{background:"#1e293b",border:"1px solid rgba(255, 255, 255, 0.15)",borderRadius:"16px",width:"100%",maxWidth:"420px",padding:"20px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 20px 50px rgba(0,0,0,0.5)",color:"#f8fafc"},onClick:I=>I.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",fontWeight:700,color:"#38bdf8"},children:"🔐 Tài khoản Web Admin Máy In"}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#94a3b8",marginTop:"4px",fontFamily:"monospace"},children:["IP: ",t.ip," · MAC: ",t.mac_id||t.mac_address||"—"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"#94a3b8",fontSize:"1.4rem",cursor:"pointer",lineHeight:1},onClick:()=>D(!1),children:"×"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",fontWeight:600,color:"#cbd5e1"},children:"Tên đăng nhập Web Admin:"}),e.jsx("input",{type:"text",style:{fontSize:"0.85rem",padding:"10px 12px",background:"#0f172a",color:"#f8fafc",border:"1px solid #334155",borderRadius:"8px",width:"100%",boxSizing:"border-box"},placeholder:"admin",autoComplete:"new-password",name:`printer_user_${S||t.id}`,value:S&&((me=f[S])==null?void 0:me.user)||((Ke=f[t.id])==null?void 0:Ke.user)||"",onChange:I=>{const ne=I.target.value;P(B=>({...B,...S?{[S]:{...B[S],user:ne}}:{},[t.id]:{...B[t.id],user:ne}}))}})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",fontWeight:600,color:"#cbd5e1"},children:"Mật khẩu Web Admin:"}),e.jsx("input",{type:"password",style:{fontSize:"0.85rem",padding:"10px 12px",background:"#0f172a",color:"#f8fafc",border:"1px solid #334155",borderRadius:"8px",width:"100%",boxSizing:"border-box"},placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${S||t.id}`,value:S&&((tt=f[S])==null?void 0:tt.pass)||((rt=f[t.id])==null?void 0:rt.pass)||"",onChange:I=>{const ne=I.target.value;P(B=>({...B,...S?{[S]:{...B[S],pass:ne}}:{},[t.id]:{...B[t.id],pass:ne}}))}})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"8px"},children:[e.jsx("button",{style:{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(255, 255, 255, 0.15)",background:"transparent",color:"#ccc",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>D(!1),children:"Hủy"}),e.jsx("button",{style:{padding:"8px 18px",borderRadius:"8px",border:"none",background:"#3b82f6",color:"#fff",fontSize:"0.82rem",fontWeight:600,cursor:S&&N[S]||N[t.id]?"not-allowed":"pointer",opacity:S&&N[S]||N[t.id]?.6:1},disabled:!!(S&&N[S]||N[t.id]),onClick:()=>{K(t),D(!1)},children:S&&N[S]||N[t.id]?"Đang lưu...":"💾 Lưu Auth"})]})]})})]})]},S||t.id)}function ii(t){const{setCopierCredentials:s,activeAgentUid:a,activeLoadingFile:g,activeModal:f,activeTab:P,addCameraLoading:N,addressBookModal:K,agentUid:_e,agents:X,cameraAgentUid:U,cameraFileFilter:E,cameras:le,camerasLoading:$,canNavigateNext:v,canNavigatePrev:Q,commandStatus:m,copierCredentials:A,deleteCameraLoading:O,deleteScanPointModal:j,destToDelete:ee,editIpData:Z,editIpModal:xe,editIpNewIp:Te,editIpSaving:ve,expandedCopierId:te,expandedDriverMenus:ce,expandedDrivers:re,expandedPrinters:Se,fetchLanSitesData:b,fetchRemotePage:q,fileTypeFilter:H,filteredPrinters:F=[],targetInternalIp:D="",getDestinationStatus:oe=()=>({label:"✔ ACTIVE",type:"success",title:""}),getTargetAgentUid:w,handleCopierClick:S,handleDeleteDest:se,handleEditIP:ae,handleOpenStorageFiles:ue,handleRefetchAddressBook:he,handleRemoteInstallDriver:de,handleSaveAuth:J,infoDetailModal:h,installDriverModal:x,installDriverSaving:_,installedCount:r,isAllInstalled:d,lanSites:p,lanSitesLoading:o,liveAddressBooks:u,mockAgentApi:c,newCamIp:C,newCamName:k,newCamPass:T,newCamPort:R,newCamRtsp:M,newCamUser:ie,onlineAgents:l,pendingScanPoints:Y,printers:z,publicFtpData:pe,publicFtpModal:me,publicFtpSaving:Ke,record30sLoading:tt,remoteLockModal:rt,remoteLockPrinter:I,saveAuthLoading:ne,selectedAgentUid:B,selectedCamera:G,selectedCameraAgentUid:W,selectedLan:Ie,selectedLanUid:be,setActiveModal:je,setExpandedDriverMenus:Ge,setExpandedDrivers:Fe,setPublicFtpData:$e,setRemoteLockPrinter:nt,showToast:st,storageFilesModal:Dt,storageFilesModalData:Mt,storageFilesModalLoading:vt,storageFilterDate:ct,submittingScanPoint:dt,toshibaVncData:wt,utilityActionPending:Ue,utilityCommands:Pt,utilityCommandsLoading:Ot,utilitySettingsLoading:Ft,utilityStatusMsg:ht,viewOutputModal:pt,vncTunnelLoading:dr,webPreviewHistory:pr,webPreviewHistoryIndex:qe,webPreviewLoading:mr,webPreviewModal:ur,webPreviewTab:zt}=t,[Tt,it]=y.useState(new Set),Wt=y.useRef({});return y.useEffect(()=>{const Be=Wt.current,ye=Object.keys(u||{}).filter(ze=>!Be[ze]&&u[ze]);ye.length>0&&it(ze=>{if(ye.some(Ye=>ze.has(Ye))){const Ye=new Set(ze);return ye.forEach(Ae=>Ye.delete(Ae)),Ye}return ze}),Wt.current=u||{}},[u]),e.jsx(e.Fragment,{children:e.jsxs(Ve.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:n.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(Or,{className:"copiers-grid",style:n.gridContainer,children:o||Ue==="force_subnet_scan"||Object.entries(m||{}).some(([Be,ye])=>(ye==null?void 0:ye.isPending)&&Be.startsWith("scan_lan_"))?e.jsxs("div",{style:n.loadingContainer,children:[e.jsx(lt,{}),e.jsx("div",{style:n.loadingText,children:Ue==="force_subnet_scan"||Object.entries(m||{}).some(([Be,ye])=>(ye==null?void 0:ye.isPending)&&Be.startsWith("scan_lan_"))?"⏳ Đang dò quét mạng LAN tìm máy in & photocopy...":"Đang tải dữ liệu thiết bị..."})]}):F.length===0?e.jsxs("div",{style:n.emptyStateContainer,children:[e.jsx("div",{style:n.emptyIcon,children:"🖨️"}),e.jsx("div",{style:n.emptyTitle,children:D?`Không tìm thấy máy photo có IP: ${D}`:"Chưa có danh sách máy in, hãy nhấn nút khởi tạo"}),e.jsx("div",{style:n.emptySubtitle,children:D?`Không tìm thấy thiết bị nào khớp với IP nội bộ ${D} trong mạng LAN này.`:"Vui lòng chọn mạng LAN khác hoặc nhấp nút khởi tạo / Dò quét mạng LAN để tìm kiếm thiết bị."})]},`empty_${D||"all"}`):F.map(Be=>{const ye=(Be.mac_address||Be.mac_id||"").toUpperCase().replace(/-/g,":"),ze=Be.id!==void 0&&Be.id!==null?String(Be.id):"",Ye=Be.ip||"",Ae=!!(ye&&String(te)===String(ye)||ze&&String(te)===String(ze)),Ct=De=>{if(!De)return null;let Re=De;if(typeof Re=="string"){let _t=Re.trim();if(_t.includes("__ADDRESS_BOOK_JSON_START__"))try{_t=_t.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),_t=_t.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{Re=JSON.parse(_t)}catch{return null}}if(typeof Re!="object")return null;let Ht=0;for(;Re&&typeof Re=="object"&&!Array.isArray(Re.address_list)&&Re.address_book_sync&&Ht<5;)Re=Re.address_book_sync,Ht++;return Re},Pe=Tt.has(ye)||Tt.has(ze)||Tt.has(Ye)?null:Ct(ye&&(u==null?void 0:u[ye])||ze&&(u==null?void 0:u[ze])||Ye&&(u==null?void 0:u[Ye])||null),$t=!!(Pe&&Array.isArray(Pe.address_list)),Ut=$t?Pe:Pe||{};Array.isArray(Ut.address_list)&&Ut.address_list.filter(De=>{if(!De||typeof De!="object"||De.type==="Summary")return!1;const Re=(De.name||"").trim();return Re==="Summary"||Re==="Total"||Re.startsWith("Users:")?!1:!!(Re||De.entry_id||De.registration_no&&De.registration_no!=="-"||De.email_address||De.email||De.folder||De.physical_path)});const Qt=$t,Yt=((Ie==null?void 0:Ie.agents)||[]).filter(De=>De.is_agent_active),Zt=w?w(ye||Be.id):B||Be.agent_uid||"";return e.jsx(ni,{p:Be,selectedLan:Ie,activeAgentUid:_e,selectedAgentUid:Zt,copierCredentials:A||{},setCopierCredentials:s,saveAuthLoading:ne||{},handleSaveAuth:J,isExpanded:Ae,handleCopierClick:S,onlineAgents:Yt,showToast:st||(()=>{}),fetchRemotePage:q||(()=>{}),setRemoteLockPrinter:nt,setActiveModal:je,hasAddressList:Qt,sync:Ut,commandStatus:m||{},getDestinationStatus:oe||(()=>({})),handleOpenStorageFiles:ue||(()=>{}),handleEditIP:ae||(()=>{}),handleDeleteDest:se||(()=>{}),handleRefetchAddressBook:he||(()=>{}),onClearCache:()=>{it(De=>{const Re=new Set(De);return ye&&Re.add(ye),ze&&Re.add(ze),Ye&&Re.add(Ye),Re})},expandedDrivers:re||{},setExpandedDrivers:Fe,expandedDriverMenus:ce||{},setExpandedDriverMenus:Ge,handleRemoteInstallDriver:de||(()=>{}),setPublicFtpData:$e},ye||Be.id)})},`copiers_list_${(Ie==null?void 0:Ie.lan_uid)||"default"}_${D||"all"}_${F.length}`)]},"copiers-tab")})}function cr(t){const s=(t||"").trim();if(!s)return"unknown";if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(s))try{return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}catch{return"unknown"}const a=s.match(/^pub_(\d{1,3})_(\d{1,3})_(\d{1,3})_(\d{1,3})$/);if(a){const f=`${a[1]}.${a[2]}.${a[3]}.${a[4]}`;try{return btoa(f).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}catch{return"unknown"}}return s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function oi(t){const{AgentPage:s,activeLoadingFile:a,activeModal:g,activeTab:f,allocatedVncAddr:P,cameraFiles:N,cameraForm:K,cameraLogs:_e,cameraStatus:X,cameraTestLoading:U,cameraTestResult:E,cameras:le,camerasLoading:$,commandStatus:v,confirmModal:Q,copierCredentials:m,customRecordDuration:A,customRunCommand:O,deleteScanPointModal:j,directLan:ee,editIpModalData:Z,editableSettingsText:xe,emailFileCounts:Te={},executeRemoteInstallDriver:ve,expandedDriverMenus:te,expandedDrivers:ce,expandedPrinters:re,fetchCameraFiles:Se,fetchCameraStatus:b,fetchRemotePage:q,fetchRemotePageOld:H,ftpDetailData:F,getDestinationStatus:D=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:oe=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:w,handleAddPrivateFtp:S,handleAddPublicFtp:se,handleCloseWebPreview:ae,handleConfirmDeleteScanPoint:ue,handleCopierClick:he,handleDeleteCamera:de,handleDeleteCameraFile:J,handleDeleteDest:h,handleEditIP:x,handleFetchEntryDetail:_,handleHistoryBack:r,handleHistoryForward:d,handleOpenStorageFiles:p,handlePlaySegmentFile:o,handleQueryVideo:u,handleRecord30s:c,handleRefetchAddressBook:C,handleRemoteInstallDriver:k,handleSaveAuth:T,handleSaveCameraConfig:R,handleSaveEditIP:M,handleTriggerUtilityExec:ie,handleSaveSettings:l,handleStartToshibaVnc:Y,handleTestCameraConnection:z,handleToggleDirectLan:pe,handleViewScanPointsJson:me,installDriverModal:Ke,ipInputModal:tt,isRecording30s:rt,isSavingSettings:I,lanSites:ne,lanSitesLoading:B,liveAddressBooks:G,lockAspect:W,pollCommandStatus:Ie,previewBlobUrl:be,privateFtpData:je,privateFtpLoading:Ge,publicFtpData:Fe,publicFtpLoading:$e,queriedVideoUrl:nt,queryDuration:st,queryTimestamp:Dt,queryVideoLoading:Mt,recording30sCountdown:vt,remoteLockPrinter:ct,resolveRelativePath:dt,saveAuthLoading:wt,savedLocal:Ue,scaleX:Pt,scaleY:Ot,scanAutoOpenDir:Ft,scanAutoOpenFile:ht,scanPointsViewerModal:pt,selectedCamera:dr,selectedCameraAgentUid:pr,selectedLan:qe,selectedLanUid:mr,selectedTargetAgents:ur,selectedUtilityAgent:zt,setActiveLoadingFile:Tt,setActiveModal:it,setActiveTab:Wt,setAllocatedVncAddr:Be,setCameraFiles:ye,setCameraForm:ze,setCameraLogs:Ye,setCameraStatus:Ae,setCameraTestLoading:Ct,setCameraTestResult:gr,setCameras:Pe,setCamerasLoading:$t,setCommandStatus:Ut,setConfirmModal:Qt,setCopierCredentials:Yt,setCustomRecordDuration:Zt,setCustomRunCommand:De,setDeleteScanPointModal:Re,setDirectLan:Ht,setEditIpModalData:_t,setEditableSettingsText:Wr,setEmailFileCounts:$r=()=>{},setExpandedDriverMenus:Bt,setExpandedDrivers:Hr,setExpandedPrinters:Vr,setFtpDetailData:er,setInstallDriverModal:Gt,setIpInputModal:Kr,setIsRecording30s:Vt,setIsSavingSettings:fr,setLanSites:Jr,setLanSitesLoading:qr,setLiveAddressBooks:Xr,setLockAspect:Qr,setPreviewBlobUrl:tr,setPrivateFtpData:mt,setPrivateFtpLoading:Xe,setPublicFtpData:Yr,setPublicFtpLoading:Zr,setQueriedVideoUrl:en,setQueryDuration:tn,setQueryTimestamp:rn,setQueryVideoLoading:nn,setRecording30sCountdown:on,setRemoteLockPrinter:hr,setSaveAuthLoading:sn,setScaleX:Kt,setScaleY:an,setScanAutoOpenDir:ln,setScanAutoOpenFile:cn,setScanPointsViewerModal:dn,setSelectedCamera:pn,setSelectedCameraAgentUid:mn,setSelectedLanUid:un,setSelectedTargetAgents:gn,setSelectedUtilityAgent:_r,setSettingsSaveStatus:fn,setShowPreviewDetails:hn,setShowSettings:_n,setStorageFiles:Jt,setStorageLoading:xn,setStorageModalData:yn,setToasts:bn,setToshibaVncData:Sn,setUtilityActionPending:rr,setUtilityCommands:vn,setUtilityCommandsLoading:wn,setUtilitySettingsLoading:Tn,setUtilityStatusMsg:Cn,setViewOutputModal:In,setVncTunnelLoading:Pn,setWebPreviewHistory:kn,setWebPreviewHistoryIndex:An,setWebPreviewLoading:It,setWebPreviewModal:En,setWebPreviewTab:jn,settingsSaveStatus:Rn,showPreviewDetails:ut,showSettings:kt,storageFiles:Ln,storageLoading:Nn,storageModalData:Dn,toasts:Mn,toshibaVncData:At,utilityActionPending:On,utilityCommands:gt,utilityCommandsLoading:Fn,utilitySettingsLoading:Un,utilityStatusMsg:Qe,viewOutputModal:nr,vncTunnelLoading:xr,webPreviewHistory:qt,webPreviewHistoryIndex:Bn,webPreviewLoading:at,webPreviewModal:Ne,webPreviewTab:ir}=t;return e.jsx(e.Fragment,{children:e.jsx(Ve.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:n.tabContent,children:e.jsx(Or,{children:!qe||(qe.agents||[]).filter(Ce=>Ce.is_agent_active).length===0?e.jsx("div",{style:n.emptyText,children:"⚠️ Không tìm thấy Agent (máy tính) nào đang kết nối khớp với IP Public này."}):(qe.agents||[]).filter(Ce=>Ce.is_agent_active).map(Ce=>{const Et=Ce.is_agent_active;return e.jsxs(Fr,{children:[e.jsxs("div",{style:n.cardHeader,children:[e.jsxs("span",{style:n.cardTitle,children:["💻 ",Ce.hostname]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[Ce.app_version&&e.jsxs("span",{style:{fontSize:"0.72rem",fontFamily:"monospace",fontWeight:600,padding:"2px 6px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.25)",color:"var(--color-primary)"},children:["v",Ce.app_version]}),e.jsx("span",{style:{...n.statusBadge,color:Et?"var(--color-status-online)":"var(--color-status-offline)",borderColor:Et?"var(--color-status-online)":"var(--color-status-offline)",background:Et?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:Et?Ce.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]})]}),e.jsxs("div",{style:n.cardDetails,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Phiên bản:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace",fontWeight:600,color:Ce.app_version?"var(--color-primary)":"var(--color-text-secondary)"},children:Ce.app_version?`v${Ce.app_version}`:"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"UID:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:Ce.agent_uid})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...n.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[Ce.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async Le=>{Le.stopPropagation();try{const we=await ot(Ce.agent_uid,"get_agent_ip","");if(we.ok&&we.command_id){t.showToast&&t.showToast("Lấy IP cục bộ...","info");const Ze=we.command_id,Xt=Date.now(),jt=setInterval(async()=>{try{if(Date.now()-Xt>12e3){clearInterval(jt);return}const xt=await Nt(Ze);xt.status==="success"?(clearInterval(jt),t.fetchLanSitesData&&await t.fetchLanSitesData(!0),t.showToast&&t.showToast("Lấy IP cục bộ","success")):xt.status==="failed"&&(clearInterval(jt),t.showToast&&t.showToast("Lấy IP thất bại","error"))}catch(xt){console.error(xt),clearInterval(jt)}},1e3)}else t.showToast&&t.showToast("Lấy IP thất bại","error")}catch{t.showToast&&t.showToast("Lấy IP thất bại","error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:Le=>Le.currentTarget.style.opacity="1",onMouseLeave:Le=>Le.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:n.detailValue,children:Ce.local_mac||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:n.detailValue,children:(()=>{const Le=(Ce.ftp_sites||[]).find(He=>(He.name||"").toLowerCase()==="goxprint")||(Ce.ftp_sites||[])[0],we=(Le==null?void 0:Le.path)||"",Ze=cr((qe==null?void 0:qe.lan_uid)||""),Xt=cr(Ce.agent_uid||""),xt=`storage/uploads/scans/${cr(Ce.lead||"default")}/${Ze}/${Xt}/`,yt=qe?qe.emails.filter(He=>He.email_type==="private"&&He.pc_name&&He.pc_name.toLowerCase().trim()===Ce.agent_uid.toLowerCase().trim()):[],yr=yt.reduce((He,Rt)=>He+((Te==null?void 0:Te[Rt.email])??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:we?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:we?"normal":"italic"},children:we||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:xt})]})]}),yt.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[yt.map(He=>{const Rt=(Te==null?void 0:Te[He.email])??0;return e.jsxs("button",{style:{...n.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>p((qe==null?void 0:qe.lan_uid)||"",He.email),title:`Xem tệp của ${He.email}`,children:["📁 ",Rt," tệp"]},He.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[yr," tệp"]})]})]}),yt.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:n.detailValue,children:Ce.ftp_ports||"—"})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:n.detailValue,children:e.jsx("button",{onClick:()=>{_r(Ce),it("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:n.detailValue,children:Ce.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!Ce.ftp_sites||Ce.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:Ce.ftp_sites.map((Le,we)=>{const Ze=Le.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${Ze?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:Ze?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:Ze?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:Ze?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:Ze?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",Le.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",Ze?"Đang chạy":"Đã dừng",")"]})]}),Le.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",Le.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:Le.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:Le.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:Le.ftp_password||"goxprint"})]})]})]})]},we)})})]})]},Ce.agent_uid)})})},"agents-tab")})}const si=t=>{if(t==null)return"";if(typeof t=="object")try{return JSON.stringify(t,null,2)}catch{return String(t)}if(typeof t=="string"){const s=t.trim();if(s.startsWith("{")&&s.endsWith("}")||s.startsWith("[")&&s.endsWith("]"))try{const a=JSON.parse(s);return JSON.stringify(a,null,2)}catch{return t}}return String(t)};function ai({src:t,alt:s}){const[a,g]=We.useState(1),[f,P]=We.useState({x:0,y:0}),[N,K]=We.useState(!1),[_e,X]=We.useState({x:0,y:0}),U=()=>g(O=>Math.min(O+.25,5)),E=()=>{g(O=>{const j=Math.max(O-.25,1);return j===1&&P({x:0,y:0}),j})},le=()=>{g(1),P({x:0,y:0})},$=O=>{O.preventDefault();const j=O.deltaY<0?.15:-.15;g(ee=>{const Z=Math.min(Math.max(ee+j,1),5);return Z===1&&P({x:0,y:0}),Z})},v=O=>{a<=1||(O.preventDefault(),K(!0),X({x:O.clientX-f.x,y:O.clientY-f.y}))},Q=O=>{N&&P({x:O.clientX-_e.x,y:O.clientY-_e.y})},m=()=>K(!1),A=()=>{a>1?le():g(2.5)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,minHeight:0,width:"100%",position:"relative",background:"#090d16",borderRadius:"8px",border:"1px solid var(--color-surface-light)",overflow:"hidden",userSelect:"none"},onWheel:$,children:[e.jsxs("div",{style:{position:"absolute",top:"10px",right:"10px",zIndex:10,display:"flex",alignItems:"center",gap:"6px",background:"rgba(18, 18, 26, 0.85)",backdropFilter:"blur(8px)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"4px 8px",boxShadow:"0 4px 12px rgba(0,0,0,0.4)"},children:[e.jsx("button",{type:"button",onClick:E,disabled:a<=1,style:{background:"none",border:"none",color:a<=1?"var(--color-text-secondary)":"var(--color-text)",cursor:a<=1?"not-allowed":"pointer",fontSize:"0.85rem",padding:"2px 6px",borderRadius:"4px"},title:"Thu nhỏ (-)",children:"🔍-"}),e.jsxs("span",{style:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-primary)",minWidth:"42px",textAlign:"center"},children:[Math.round(a*100),"%"]}),e.jsx("button",{type:"button",onClick:U,disabled:a>=5,style:{background:"none",border:"none",color:a>=5?"var(--color-text-secondary)":"var(--color-text)",cursor:a>=5?"not-allowed":"pointer",fontSize:"0.85rem",padding:"2px 6px",borderRadius:"4px"},title:"Phóng to (+)",children:"🔍+"}),e.jsx("button",{type:"button",onClick:le,style:{background:"none",border:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:"0.85rem",padding:"2px 6px",borderRadius:"4px"},title:"Đặt lại (Reset)",children:"🔄"})]}),e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:a>1?N?"grabbing":"grab":"default"},onMouseDown:v,onMouseMove:Q,onMouseUp:m,onMouseLeave:m,onDoubleClick:A,children:e.jsx("img",{src:t,alt:s||"Screenshot",style:{maxWidth:"100%",maxHeight:"70vh",borderRadius:"6px",objectFit:"contain",boxShadow:"0 4px 24px rgba(0,0,0,0.6)",transform:`translate(${f.x}px, ${f.y}px) scale(${a})`,transition:N?"none":"transform 0.15s ease-out",transformOrigin:"center center"},draggable:!1})})]})}function li({webPreviewModal:t,handleCloseWebPreview:s,directLan:a,webPreviewLoading:g,previewIframeRef:f,previewBlobUrl:P}){const[N,K]=We.useState(1),_e=t.url?t.url:a?`http://${t.ip}${t.path||"/"}`:P,X=()=>K($=>Math.min($+.25,4)),U=()=>K($=>Math.max($-.25,1)),E=()=>K(1),le=$=>{if($.ctrlKey||N>1){$.preventDefault();const v=$.deltaY<0?.15:-.15;K(Q=>Math.min(Math.max(Q+v,1),4))}};return e.jsxs("div",{className:"web-preview-modal-overlay",style:{position:"fixed",inset:0,zIndex:250,background:"#090d16",display:"flex",flexDirection:"column",width:"100vw",height:"100vh",overflow:"hidden"},onClick:$=>$.stopPropagation(),children:[e.jsx("style",{children:`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}),e.jsxs("div",{style:{position:"absolute",top:"12px",right:"16px",zIndex:999,display:"flex",alignItems:"center",gap:"8px",background:"rgba(15, 23, 42, 0.92)",backdropFilter:"blur(12px)",border:"1px solid rgba(255, 255, 255, 0.18)",borderRadius:"10px",padding:"6px 12px",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.6)",userSelect:"none"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.78rem",color:"var(--color-text)",fontWeight:600,paddingRight:"4px"},children:[e.jsx("span",{style:{color:"#10b981"},children:"🟢"}),e.jsx("span",{children:t.title||"WIM"}),e.jsxs("span",{style:{fontSize:"0.7rem",color:"var(--color-text-secondary)",fontFamily:"monospace"},children:["(",t.ip,")"]})]}),e.jsx("div",{style:{width:"1px",height:"18px",background:"rgba(255,255,255,0.15)",margin:"0 2px"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("button",{type:"button",onClick:U,disabled:N<=1,style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:N<=1?"rgba(255,255,255,0.3)":"white",cursor:N<=1?"not-allowed":"pointer",fontSize:"0.85rem",padding:"3px 8px",borderRadius:"6px"},title:"Thu nhỏ (-)",children:"🔍-"}),e.jsxs("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-primary)",minWidth:"42px",textAlign:"center"},children:[Math.round(N*100),"%"]}),e.jsx("button",{type:"button",onClick:X,disabled:N>=4,style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:N>=4?"rgba(255,255,255,0.3)":"white",cursor:N>=4?"not-allowed":"pointer",fontSize:"0.85rem",padding:"3px 8px",borderRadius:"6px"},title:"Phóng to (+)",children:"🔍+"}),e.jsx("button",{type:"button",onClick:E,style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:"0.85rem",padding:"3px 8px",borderRadius:"6px"},title:"Đặt lại (Reset Zoom)",children:"🔄"})]}),e.jsx("div",{style:{width:"1px",height:"18px",background:"rgba(255,255,255,0.15)",margin:"0 2px"}}),e.jsx("button",{type:"button",onClick:()=>{if(f&&f.current){const v=f.current.src.split("#")[0].replace(/([?&])_t=\d+/,""),Q=v.includes("?")?"&":"?";f.current.src=v+Q+`_t=${Date.now()}`}},style:{background:"rgba(16, 185, 129, 0.2)",border:"1px solid rgba(16, 185, 129, 0.4)",color:"#34d399",cursor:"pointer",fontSize:"0.76rem",fontWeight:600,padding:"4px 10px",borderRadius:"6px",display:"flex",alignItems:"center",gap:"4px"},title:"Bắt buộc nạp lại trang WIM từ máy in qua Tunnel",children:"⚡ Nạp lại (Tunnel)"}),e.jsx("button",{type:"button",onClick:()=>window.open(t.url||`http://${t.ip}/`,"_blank"),style:{background:"rgba(59, 130, 246, 0.2)",border:"1px solid rgba(59, 130, 246, 0.4)",color:"#60a5fa",cursor:"pointer",fontSize:"0.76rem",fontWeight:600,padding:"4px 10px",borderRadius:"6px",display:"flex",alignItems:"center",gap:"4px"},title:"Mở sang tab trình duyệt mới",children:"↗️ Tab mới"}),e.jsx("button",{type:"button",onClick:s,style:{background:"#ef4444",border:"none",color:"white",cursor:"pointer",fontSize:"0.82rem",fontWeight:700,padding:"4px 12px",borderRadius:"6px",display:"flex",alignItems:"center",gap:"4px",boxShadow:"0 2px 8px rgba(239,68,68,0.4)"},title:"Đóng modal WIM",children:"✕ Đóng"})]}),e.jsx("div",{style:{flex:1,width:"100vw",height:"100vh",overflow:N>1?"auto":"hidden",background:"white",position:"relative"},onWheel:le,children:t.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",gap:"14px",background:"#090d16",color:"white"},children:[e.jsxs("svg",{style:{width:"42px",height:"42px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsxs("span",{style:{fontSize:"0.95rem",fontWeight:600},children:["Đang kết nối đến WIM (",t.ip,")..."]})]}):t.html&&t.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",gap:"14px",padding:"24px",background:"#090d16",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"3rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"1rem",fontWeight:700},children:"Lỗi kết nối Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.8rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"16px",background:"rgba(239, 68, 68, 0.1)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.2)",maxWidth:"600px",width:"100%",fontFamily:"monospace"},children:t.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{width:N>1?`${100*N}%`:"100%",height:N>1?`${100*N}%`:"100%",transform:N>1?`scale(${N})`:"none",transformOrigin:"top left",transition:"transform 0.15s ease-out",position:"relative"},children:[e.jsx("iframe",{ref:f,src:_e,style:{width:"100%",height:"100%",border:"none",background:"white"}}),g&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang nạp dữ liệu trang..."})]})]})})]})}function ci(t){var wr,Tr,Cr,Ir,Pr,kr,Ar,Er,jr,Rr,Lr;const{AgentPage:s,activeLoadingFile:a,activeModal:g,activeTab:f,allocatedVncAddr:P,cameraFiles:N,cameraForm:K,cameraLogs:_e,cameraStatus:X,cameraTestLoading:U,cameraTestResult:E,cameras:le,camerasLoading:$,commandStatus:v,confirmModal:Q={isOpen:!1},accessDeniedState:m={isOpen:!1,ip:""},copierCredentials:A,customRecordDuration:O,customRunCommand:j,deleteScanPointModal:ee={isOpen:!1},directLan:Z,editIpModalData:xe={isOpen:!1},editableSettingsText:Te,emailFileCounts:ve={},executeRemoteInstallDriver:te,expandedDriverMenus:ce,expandedDrivers:re,expandedPrinters:Se,fetchCameraFiles:b,fetchCameraStatus:q,fetchRemotePage:H,fetchRemotePageOld:F,formatBytes:D,formatJsonText:oe,ftpDetailData:w,getDestinationStatus:S=()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:se=()=>({label:"✔ ACTIVE",type:"success",title:""}),getLiveQueryTimestamp:ae,handleAddPrivateFtp:ue,handleAddPublicFtp:he,handleCloseWebPreview:de,handleConfirmDeleteScanPoint:J,handleCopierClick:h,handleDeleteCamera:x,handleDeleteCameraFile:_,handleDeleteDest:r,handleEditIP:d,handleEmergencyRestart:p,handleFetchEntryDetail:o,handleHistoryBack:u,handleHistoryForward:c,handleOpenStorageFiles:C,handlePlaySegmentFile:k,handleQueryVideo:T,handleRecord30s:R,handleRefetchAddressBook:M,handleRemoteInstallDriver:ie,handleSaveAuth:l,handleSaveCameraConfig:Y,handleSaveEditIP:z,handleSaveSettings:pe,handleStartToshibaVnc:me,handleTestCameraConnection:Ke,handleToggleDirectLan:tt,handleToggleSetting:rt,handleTriggerUtility:I,handleTriggerUtilityExec:ne,handleViewScanPointsJson:B,installDriverModal:G={isOpen:!1},ipInputModal:W={isOpen:!1},isRecording30s:Ie,isSavingSettings:be,lanSites:je,lanSitesLoading:Ge,liveAddressBooks:Fe,lockAspect:$e,modalContentRef:nt,pollCommandStatus:st,previewBlobUrl:Dt,previewIframeRef:Mt,privateFtpData:vt,privateFtpLoading:ct,publicFtpData:dt,publicFtpLoading:wt,queriedVideoUrl:Ue,queryDuration:Pt,queryTimestamp:Ot,queryVideoLoading:Ft,recording30sCountdown:ht,remoteLockPrinter:pt,resolveRelativePath:dr,saveAuthLoading:pr,savedLocal:qe,scaleX:mr,scaleY:ur,scanAutoOpenDir:zt,scanAutoOpenFile:Tt,scanPointsViewerModal:it={isOpen:!1},selectedCamera:Wt,selectedCameraAgentUid:Be,selectedLan:ye,selectedLanUid:ze,selectedTargetAgents:Ye,selectedUtilityAgent:Ae,setAccessDeniedState:Ct,setActiveLoadingFile:gr,setActiveModal:Pe,setActiveTab:$t,setAllocatedVncAddr:Ut,setCameraFiles:Qt,setCameraForm:Yt,setCameraLogs:Zt,setCameraStatus:De,setCameraTestLoading:Re,setCameraTestResult:Ht,setCameras:_t,setCamerasLoading:Wr,setCommandStatus:$r,setConfirmModal:Bt,setCopierCredentials:Hr,setCustomRecordDuration:Vr,setCustomRunCommand:er,setDeleteScanPointModal:Gt,setDirectLan:Kr,setEditIpModalData:Vt,setEditableSettingsText:fr,setEmailFileCounts:Jr=()=>{},setExpandedDriverMenus:qr,setExpandedDrivers:Xr,setExpandedPrinters:Qr,setFtpDetailData:tr,setInstallDriverModal:mt,setIpInputModal:Xe,setIsRecording30s:Yr,setIsSavingSettings:Zr,setLanSites:en,setLanSitesLoading:tn,setLiveAddressBooks:rn,setLockAspect:nn,setPreviewBlobUrl:on,setPrivateFtpData:hr,setPrivateFtpLoading:sn,setPublicFtpData:Kt,setPublicFtpLoading:an,setQueriedVideoUrl:ln,setQueryDuration:cn,setQueryTimestamp:dn,setQueryVideoLoading:pn,setRecording30sCountdown:mn,setRemoteLockPrinter:un,setSaveAuthLoading:gn,setScaleX:_r,setScaleY:fn,setScanAutoOpenDir:hn,setScanAutoOpenFile:_n,setScanPointsViewerModal:Jt,setSelectedCamera:xn,setSelectedCameraAgentUid:yn,setSelectedLanUid:bn,setSelectedTargetAgents:Sn,setSelectedUtilityAgent:rr,setSettingsSaveStatus:vn,setShowPreviewDetails:wn,setShowSettings:Tn,setStorageFiles:Cn,setStorageLoading:In,setStorageModalData:Pn,setToasts:kn,setToshibaVncData:An,setUtilityActionPending:It,setUtilityCommands:En,setUtilityCommandsLoading:jn,setUtilitySettingsLoading:Rn,setUtilityStatusMsg:ut,setViewOutputModal:kt,setVncTunnelLoading:Ln,setWebPreviewHistory:Nn,setWebPreviewHistoryIndex:Dn,setWebPreviewLoading:Mn,setWebPreviewModal:At,setWebPreviewTab:On,settingsSaveStatus:gt,showPreviewDetails:Fn,showSettings:Un,showToast:Qe,storageFiles:nr,storageLoading:xr,storageModalData:qt={isOpen:!1},toasts:Bn,toshibaVncData:at,utilityActionPending:Ne,utilityCommands:ir,utilityCommandsLoading:Ce,utilitySettingsLoading:Et,utilityStatusMsg:Le,viewOutputModal:we={isOpen:!1},vncTunnelLoading:Ze,webPreviewHistory:Xt,webPreviewHistoryIndex:jt,webPreviewLoading:xt,webPreviewModal:yt={isOpen:!1},webPreviewTab:yr}=t,[He,Rt]=We.useState(""),[or,br]=We.useState(!1),[Sr,sr]=We.useState(""),vr=typeof oe=="function"?oe:si;We.useEffect(()=>{we!=null&&we.isOpen&&setTimeout(()=>{nt&&nt.current&&(nt.current.scrollTop=0)},100)},[we==null?void 0:we.isOpen]),We.useEffect(()=>{if(G!=null&&G.isOpen&&(!G.suggestedDrivers||G.suggestedDrivers.length===0)&&typeof mt=="function"){const V=G.model||G.brand||G.printerId||"";V&&Ee(`/api/v1/match-drivers?name=${encodeURIComponent(V)}`).then(fe=>{var L;if(fe&&fe.matches&&Array.isArray(fe.matches)&&fe.matches.length>0){const ge=fe.matches[0],ke=(L=ge==null?void 0:ge.drivers)==null?void 0:L[0];mt(Me=>({...Me,suggestedDrivers:fe.matches,brand:Me.brand||(ge==null?void 0:ge.brand)||"ricoh",model:Me.model||(ge==null?void 0:ge.model)||"Photocopy",driverName:Me.driverName||(ke==null?void 0:ke.name)||"",driverUrl:Me.driverUrl||(ke==null?void 0:ke.url)||""}))}}).catch(()=>{})}},[G==null?void 0:G.isOpen,G==null?void 0:G.printerId,G==null?void 0:G.model,G==null?void 0:G.brand]),We.useEffect(()=>{if(m!=null&&m.isOpen){const i=localStorage.getItem("gox_connect_public_ip")||"";Rt(i||m.ip||""),sr("")}},[m==null?void 0:m.isOpen,m==null?void 0:m.ip]);const Gn=async i=>{const V=(He||(m==null?void 0:m.ip)||"").trim();if(!V){sr("Vui lòng nhập Public IP hợp lệ");return}br(!0),sr("");try{localStorage.setItem("gox_connect_public_ip",V),await Ee("/api/public-ips",{method:"POST",body:JSON.stringify({ip_address:V,description:"Allowed from App-Gox Modal",enabled:!0})}).catch(fe=>console.log("Allowed IP API response:",fe)),Ct&&Ct({isOpen:!1,ip:""}),t.fetchLanSitesData&&await t.fetchLanSitesData(!0)}catch(fe){console.error("Error connecting public IP:",fe),localStorage.setItem("gox_connect_public_ip",V),Ct&&Ct({isOpen:!1,ip:""}),t.fetchLanSitesData&&await t.fetchLanSitesData(!0)}finally{br(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx(et,{children:g&&e.jsx("div",{style:n.modalOverlay,onClick:()=>Pe(null),children:e.jsxs(Ve.div,{style:n.modalCard,onClick:i=>i.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[g==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:n.modalSubtitle,children:qt.email})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:xr?e.jsxs("div",{style:n.modalLoading,children:[e.jsx(lt,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):nr.length===0?e.jsx("div",{style:n.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:n.filesList,children:nr.map((i,V)=>e.jsxs("div",{style:n.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${i.url}`,target:"_blank",rel:"noreferrer",style:n.fileLinkName,children:i.name}),e.jsxs("div",{style:n.fileMetaDetails,children:["Dung lượng: ",D(i.size)," · Mtime: ",new Date(i.mtime).toLocaleString("vi-VN")]}),i.upload_completed_at&&e.jsxs("div",{style:n.fileUploadMeta,children:["Tải lên VPS: ",new Date(i.upload_completed_at).toLocaleTimeString("vi-VN"),i.upload_duration!=null?` (${i.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${i.url}`,download:!0,target:"_blank",rel:"noreferrer",style:n.fileDownloadBtn,children:"Tải về"})]},V))})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>C(qt.lanUid,qt.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Pe(null),children:"Đóng"})]})]}),g==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:n.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:dt.name,onChange:i=>Kt(V=>({...V,name:i.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: goxprint@gmail.com",value:dt.email,onChange:i=>Kt(V=>({...V,email:i.target.value}))}),e.jsx("span",{style:n.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:n.modalInput,value:dt.agentUid,onChange:i=>Kt(V=>({...V,agentUid:i.target.value})),children:(ye&&ye.agents||[]).filter(i=>i.is_agent_active).map(i=>e.jsxs("option",{value:i.agent_uid,children:[i.hostname," (",i.local_ip,")"]},i.agent_uid))})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:he,disabled:wt,children:wt?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Pe(null),children:"Hủy bỏ"})]})]}),g==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:n.modalInput,placeholder:"VD: user.pc1@gmail.com",value:vt.email,onChange:i=>hr(V=>({...V,email:i.target.value}))}),e.jsxs("span",{style:n.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",vt.agentUid]})]})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:ue,disabled:ct,children:ct?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Pe(null),children:"Hủy bỏ"})]})]}),g==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:n.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(wr=infoDetailData.details)==null?void 0:wr.proto})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Server Host:"}),e.jsx("span",{style:n.detailValue,children:(Tr=infoDetailData.details)==null?void 0:Tr.server})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:n.detailValue,children:(Cr=infoDetailData.details)==null?void 0:Cr.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...n.detailValue,fontFamily:"monospace"},children:(Ir=infoDetailData.details)==null?void 0:Ir.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>Pe(null),children:"Đóng cửa sổ"})})]}),g==="ftp_detail"&&w&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:n.modalSubtitle,children:["Cổng Port: ",w.port]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{Pe(null),tr(null)},children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsxs("div",{style:n.modalDetailsList,children:[e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:"var(--color-primary)"},children:w.port})]}),e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...n.detailValue,fontWeight:700,color:w.error?"var(--color-error)":"var(--color-success)"},children:w.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),w.error&&e.jsxs("div",{style:n.detailRow,children:[e.jsx("span",{style:n.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...n.detailValue,color:"var(--color-error)"},children:w.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...n.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:w.path})]})]})}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Pe(null),tr(null)},children:"Đóng cửa sổ"})})]}),g==="utilities"&&Ae&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:n.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:n.modalSubtitle,children:["Máy: ",Ae.hostname," · IP: ",Ae.local_ip,":",Ae.web_port||9173]})]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>{Pe(null),rr(null),ut(null)},children:"×"})]}),e.jsxs("div",{style:{...n.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[Le&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:Le.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:Le.isError?"#ef4444":"#10b981",border:`1px solid ${Le.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:Le.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:Et?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(lt,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Tt,onChange:()=>rt("scan_auto_open_file",Tt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:zt,onChange:()=>rt("scan_auto_open_dir",zt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[Ce?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(lt,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsx(e.Fragment,{children:ir.length>0?(()=>{const i=ir.filter(L=>L.command!=="dxdiag"&&L.is_visible!==!1),V=i.findIndex(L=>L.command==="sync_all_scanpoints");if(V>-1){const[L]=i.splice(V,1);i.unshift(L)}const fe=async()=>{const L=Ae==null?void 0:Ae.agent_uid;if(L){ne("open_printagentx_wim",`import webbrowser
webbrowser.open("http://localhost:9173")`);try{const Me=await(await fetch(`https://agentapi.quanlymay.com/api/agents/${encodeURIComponent(L)}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:"127.0.0.1",printer_port:9173})})).json(),ft=(Me==null?void 0:Me.url)||(Me==null?void 0:Me.url_port)||"";At&&At({isOpen:!0,title:`🌐 WIM PrintAgentX — Agent ${(Ae==null?void 0:Ae.hostname)||L}`,ip:(Ae==null?void 0:Ae.local_ip)||"127.0.0.1",path:"/",html:"DIRECT_LAN",url:ft?`https://printagentx.com/?tunnel_url=${encodeURIComponent(ft)}`:"https://printagentx.com",agentUid:L})}catch(ge){console.error("Failed to start agent web tunnel:",ge),At&&At({isOpen:!0,title:`🌐 WIM PrintAgentX — Agent ${(Ae==null?void 0:Ae.hostname)||L}`,ip:(Ae==null?void 0:Ae.local_ip)||"127.0.0.1",path:"/",html:"DIRECT_LAN",url:"https://printagentx.com",agentUid:L})}}};return i.map(L=>{const ge=L.command==="emergency_restart";let ke=L.label,Me=L.icon||"🔧",ft=()=>ne(L.command,L.command_content);return L.command==="open_web_setting"?(ke="Mở WIM",Me=L.icon||"🌐",ft=fe):L.command==="create_scan_shortcut"?(ke="Tạo shortcut Desktop",Me=L.icon||"🔗"):L.command==="emergency_restart"?(ke="Emergency Kill",Me=L.icon||"🔌",ft=p):L.command==="check_watchdog"&&(ke="Check watchdog",Me=L.icon||"🩺",ft=()=>{Ae&&(It("check_watchdog"),ut({text:"⌛ Đang kiểm tra watchdog...",isError:!1}),triggerAgentUtilityExec(Ae.agent_uid,"check_watchdog",L.command_content||"").then(Je=>{if(Je.ok&&Je.command_id){const zn=Date.now(),ar=setInterval(async()=>{if(Date.now()-zn>3e4){clearInterval(ar),ut({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),It(null);return}try{const bt=await getCommandStatus(Je.command_id);if(bt.status==="success"){clearInterval(ar);const lr=bt.result_payload||bt.result||bt.error||"Hoàn thành";kt({isOpen:!0,title:"🩺 Check Watchdog",content:lr}),ut(null),It(null)}else if(bt.status==="failed"){clearInterval(ar);const lr=bt.error||bt.result_payload||bt.result||"Failed";kt({isOpen:!0,title:"🩺 Check Watchdog",content:lr}),ut(null),It(null)}}catch{}},2e3)}else ut({text:"❌ "+(Je.error||"Không thể gửi lệnh"),isError:!0}),It(null)}).catch(Je=>{ut({text:"❌ "+Je.message,isError:!0}),It(null)}))}),e.jsxs("button",{onClick:ft,disabled:Ne!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:ge?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:Ne!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:Ne!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:Je=>{Ne===null&&(Je.currentTarget.style.borderColor=ge?"#ef4444":"var(--color-primary)",Je.currentTarget.style.background=ge?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:Je=>{Je.currentTarget.style.borderColor=ge?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",Je.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:Ne===L.command?e.jsx(lt,{size:"sm"}):Me}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:ge?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"word-break"},children:ke})]},L.command)})})():e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>I("printers"),disabled:Ne!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:Ne!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:Ne!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:i=>{Ne===null&&(i.currentTarget.style.borderColor="var(--color-primary)",i.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:i=>{i.currentTarget.style.borderColor="var(--color-surface-light)",i.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:Ne==="printers"?e.jsx(lt,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"word-break"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>I("scan"),disabled:Ne!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:Ne!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:Ne!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:i=>{Ne===null&&(i.currentTarget.style.borderColor="var(--color-primary)",i.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:i=>{i.currentTarget.style.borderColor="var(--color-surface-light)",i.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:Ne==="scan"?e.jsx(lt,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"word-break"},children:"Thư mục Scan"})]})]})}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:j,onChange:i=>er(i.target.value),onKeyDown:i=>{i.key==="Enter"&&j.trim()&&I("run_command",{command_line:j.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:Ne!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{j.trim()&&I("run_command",{command_line:j.trim()})},disabled:Ne!==null||!j.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:j.trim()?"var(--color-primary)":"var(--color-surface)",color:j.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:j.trim()&&Ne===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:Ne==="run_command"?e.jsx(lt,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(i=>e.jsx("button",{onClick:()=>er(i.cmd),disabled:Ne!==null,title:i.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:j===i.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:j===i.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:Ne!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:i.label},i.cmd))})]})]})]})]}),e.jsx("div",{style:n.modalFooter,children:e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{Pe(null),rr(null),ut(null)},children:"Đóng cửa sổ"})})]}),g==="edit_ip"&&xe&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:i=>{const V=i.target.value;V&&Vt(fe=>{if(!fe)return null;const L=fe.newPort||"2130";return{...fe,newIp:`${V}:${L}`,newPort:L}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((ye==null?void 0:ye.agents)||[]).map((i,V)=>{const fe=i.local_ip||i.ip||"",L=i.hostname||i.uid||`Agent ${V+1}`;return e.jsxs("option",{value:fe,children:[L," (",fe,")"]},V)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:xe.newPort||"",onChange:i=>{const V=i.target.value;Vt(fe=>{if(!fe)return null;let L=fe.newIp||"";return L.includes(":")&&(L=L.split(":")[0]),{...fe,newPort:V,newIp:V?`${L}:${V}`:L}})},placeholder:"2130",style:n.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:xe.newIp,onChange:i=>{const V=i.target.value;Vt(fe=>{if(!fe)return null;let L=fe.newPort||"2130";return V.includes(":")&&(L=V.split(":")[1].trim()||L),{...fe,newIp:V,newPort:L}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:n.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",xe.entry.folder||xe.entry.physical_path||xe.entry.folder_path]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>Pe(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...n.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(xe.newIp||"").trim().includes(":")){Qe("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}z()},disabled:!xe.newIp.trim(),children:"Lưu lại"})]})]}),g==="remote_lock"&&pt&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:pt.name})," (",pt.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Pe(null),Qe("Khóa máy...","info",2e3),modifyDeviceAddressss({ip:pt.ip,action:"lock_machine",agent_uid:pt.agentUid}).then(i=>{i.ok?Qe("Khóa máy","success"):Qe("Khóa máy thất bại","error")}).catch(i=>{Qe("Khóa máy thất bại","error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{Pe(null),Qe("Mở khóa máy...","info",2e3),modifyDeviceAddressss({ip:pt.ip,action:"enable_machine",agent_uid:pt.agentUid}).then(i=>{i.ok?Qe("Mở khóa máy","success"):Qe("Mở khóa thất bại","error")}).catch(i=>{Qe("Mở khóa thất bại","error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),g==="toshiba_vnc"&&at&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["📺 Kết nối VNC - ",at.printerName]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Pe(null),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:Ze?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:Z?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{Pe(null),window.open(`http://${at.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):P?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${at.agentUid}&ip=${at.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async i=>{const V=i.currentTarget.getBoundingClientRect(),fe=i.clientX-V.left,L=i.clientY-V.top,ge=fe/V.width,ke=L/V.height,Me=Math.round(ge*1024),ft=Math.round(ke*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:at.agentUid,ip:at.ip,port:49105,x:Me,y:ft})})}catch(Je){console.error("VNC Click error:",Je)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!Z&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:P})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(P),Qe("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),Qe("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${P}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{Pe(null),H(at.ip,"","GET",null,!1,at.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(et,{children:Q.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>Bt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:n.confirmModalCard,onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsxs("h3",{style:n.modalTitle,children:["⚠️ ",Q.title]}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Bt(i=>({...i,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:n.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:Q.message})}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var i;Bt(V=>({...V,isOpen:!1})),(i=Q.onConfirm)==null||i.call(Q)},children:"Đồng ý"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Bt(i=>({...i,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:m.isOpen&&e.jsx("div",{style:n.confirmOverlay,children:e.jsxs(Ve.div,{style:{...n.confirmModalCard,maxWidth:"460px",width:"90%",textAlign:"center",border:"1px solid rgba(239, 68, 68, 0.4)",background:"rgba(24, 24, 32, 0.98)",padding:"28px 24px",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.6)"},onClick:i=>i.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[e.jsx("div",{style:{fontSize:"2.8rem",marginBottom:"10px"},children:"🌐"}),e.jsx("h3",{style:{fontSize:"1.15rem",fontWeight:700,color:"#f87171",margin:"0 0 8px 0"},children:"Cảnh báo Public IP / Cho phép kết nối"}),e.jsxs("p",{style:{fontSize:"0.86rem",color:"#9ca3af",lineHeight:1.5,margin:"0 0 16px 0"},children:["Public IP hiện tại của trình duyệt (",e.jsx("strong",{children:m.ip||"Chưa xác định"}),") chưa có trong danh sách được kết nối với Agent."]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"16px"},children:[e.jsx("label",{style:{fontSize:"0.8rem",fontWeight:600,color:"#e5e7eb",display:"block",marginBottom:"6px"},children:"Nhập Public IP muốn kết nối với Agent:"}),e.jsx("div",{style:{position:"relative"},children:e.jsx("input",{type:"text",value:He,onChange:i=>Rt(i.target.value),placeholder:"Ví dụ: 116.98.0.59 hoặc *",style:{width:"100%",padding:"10px 14px",fontSize:"0.9rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.4)",color:"#fff",outline:"none",boxSizing:"border-box"}})}),Sr&&e.jsxs("div",{style:{fontSize:"0.78rem",color:"#ef4444",marginTop:"6px"},children:["⚠️ ",Sr]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("button",{onClick:()=>Gn(),disabled:or,style:{width:"100%",padding:"11px 16px",fontSize:"0.9rem",fontWeight:700,background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",border:"none",borderRadius:"8px",cursor:or?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 4px 12px rgba(16, 185, 129, 0.3)"},children:or?e.jsx(lt,{size:"sm"}):"Kết nối Public IP"}),e.jsx("button",{onClick:()=>{window.location.href="/dashboard"},style:{width:"100%",padding:"9px 16px",fontSize:"0.82rem",fontWeight:600,background:"transparent",color:"#9ca3af",border:"1px solid rgba(255, 255, 255, 0.1)",borderRadius:"8px",cursor:"pointer"},children:"Quay về Dashboard ↗"})]})]})})}),e.jsx(et,{children:ee.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>Gt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:{...n.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Gt(i=>({...i,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((Pr=ee.entry)==null?void 0:Pr.name)||((kr=ee.entry)==null?void 0:kr.name_1)||((Ar=ee.entry)==null?void 0:Ar.email_address)||((Er=ee.entry)==null?void 0:Er.folder)||((jr=ee.entry)==null?void 0:jr.registration_no)||"không tên",'"']}),((Rr=ee.entry)==null?void 0:Rr.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(Lr=ee.entry)==null?void 0:Lr.registration_no]})]}),e.jsxs("div",{style:n.formGroup,children:[e.jsx("label",{style:n.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:n.modalInput,value:ee.agentUid,onChange:i=>Gt(V=>({...V,agentUid:i.target.value})),children:(ye&&ye.agents||[]).filter(i=>i.is_agent_active).map(i=>e.jsxs("option",{value:i.agent_uid,children:[i.hostname," (",i.local_ip,")"]},i.agent_uid))}),e.jsx("span",{style:n.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:J,children:"Xác nhận xóa"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Gt(i=>({...i,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:G.isOpen&&e.jsx("div",{style:n.confirmOverlay,onClick:()=>mt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:n.confirmModalCard,onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>mt(i=>({...i,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"14px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"📂 chọn phiên bản Driver cần cài đặt (khớp từ Storage catalog):"}),(()=>{var fe;const i=[];if(G.suggestedDrivers&&Array.isArray(G.suggestedDrivers)&&G.suggestedDrivers.length>0&&G.suggestedDrivers.forEach(L=>{L.drivers&&Array.isArray(L.drivers)&&L.drivers.forEach(ge=>{i.push({name:ge.name,url:ge.url,brand:L.brand||G.brand,model:L.model||G.model,label:`[${String(L.brand||G.brand||"").toUpperCase()} ${L.model||G.model}] ${ge.name}`})})}),i.length===0&&G.driverName&&G.driverUrl&&i.push({name:G.driverName,url:G.driverUrl,brand:G.brand||"Ricoh",model:G.model||"Photocopy",label:`[${String(G.brand||"RICOH").toUpperCase()} ${G.model||""}] ${G.driverName}`}),i.length===0)return e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-error)",fontStyle:"italic",background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"6px"},children:"⚠️ Không tìm thấy phiên bản driver nào phù hợp trong Storage catalog."});const V=G.driverUrl||((fe=i[0])==null?void 0:fe.url)||"";return e.jsx("select",{value:V,onChange:L=>{const ge=i.find(ke=>ke.url===L.target.value);ge&&mt(ke=>({...ke,driverName:ge.name,driverUrl:ge.url,brand:ge.brand||ke.brand,model:ge.model||ke.model}))},style:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%",cursor:"pointer",fontWeight:600},children:i.map((L,ge)=>e.jsx("option",{value:L.url,children:L.label},ge))})})()]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"💻 Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),!(ye!=null&&ye.agents)||ye.agents.filter(i=>i.is_agent_active).length===0?e.jsx("div",{style:{padding:"10px",fontSize:"0.82rem",color:"var(--color-text-secondary)",fontStyle:"italic",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px"},children:"Không có Agent online trong LAN này"}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",borderRadius:"6px",maxHeight:"200px",overflowY:"auto"},children:ye.agents.filter(i=>i.is_agent_active).map(i=>{const V=G.selectedAgentUids.includes(i.agent_uid);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"0.82rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:V,onChange:fe=>{mt(L=>{const ge=L.selectedAgentUids;return fe.target.checked?{...L,selectedAgentUids:[...ge,i.agent_uid]}:{...L,selectedAgentUids:ge.filter(ke=>ke!==i.agent_uid)}})},style:{width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsxs("span",{children:[i.hostname," (",i.local_ip,")"]})]},i.agent_uid)})})]})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:G.selectedAgentUids.length===0,onClick:()=>{const i=G;mt(ke=>({...ke,isOpen:!1}));const V=i.driverUrl||"",fe=i.driverName||i.model||"Driver",L=i.brand||"Ricoh",ge=i.model||"Photocopy";i.selectedAgentUids.forEach(ke=>{te(i.printerId,L,ge,fe,V,ke,i.printerIp,i.macId)})},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>mt(i=>({...i,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(et,{children:W.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:170},onClick:()=>Xe(i=>({...i,isOpen:!1,error:""})),children:e.jsxs(Ve.div,{style:n.confirmModalCard,onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:n.modalTitle,children:W.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>Xe(i=>({...i,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:n.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[W.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:W.value,onChange:i=>Xe(V=>({...V,value:i.target.value,error:""})),onKeyDown:i=>{if(i.key==="Enter"){const V=/^(\d{1,3}\.){3}\d{1,3}$/;if(!V.test(W.value.trim())){Xe(ge=>({...ge,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const fe=(W.changeAllTo||"").trim();if(fe&&!V.test(fe)){Xe(ge=>({...ge,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const L=W.onConfirm;Xe(ge=>({...ge,isOpen:!1,error:""})),L(W.value.trim(),fe)}i.key==="Escape"&&Xe(V=>({...V,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:W.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:i=>{W.error||(i.target.style.borderColor="var(--color-primary)")},onBlur:i=>{W.error||(i.target.style.borderColor="var(--color-surface-light)")}}),W.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:W.changeAllTo||"",onChange:i=>Xe(V=>({...V,changeAllTo:i.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:i=>{i.target.style.borderColor="var(--color-primary)"},onBlur:i=>{i.target.style.borderColor="var(--color-surface-light)"}})]}),W.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",W.error]}),W.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:W.scanStatus})]}),e.jsxs("div",{style:n.modalFooter,children:[e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const i=/^(\d{1,3}\.){3}\d{1,3}$/;if(!i.test(W.value.trim())){Xe(L=>({...L,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const V=(W.changeAllTo||"").trim();if(V&&!i.test(V)){Xe(L=>({...L,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const fe=W.onConfirm;Xe(L=>({...L,isOpen:!1,error:""})),fe(W.value.trim(),V)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...n.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Xe(i=>({...i,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(et,{children:we.isOpen&&e.jsx("div",{style:{...n.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>kt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{style:{...n.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:i=>i.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:n.modalHeader,children:[e.jsx("h3",{style:{...n.modalTitle,fontSize:"0.85rem"},children:we.title}),e.jsx("button",{style:n.modalCloseBtn,onClick:()=>kt(i=>({...i,isOpen:!1})),children:"×"})]}),we.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:nt,value:Te,onChange:i=>fr(i.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),gt&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:gt.startsWith("❌")?"rgba(239,68,68,0.1)":gt.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:gt.startsWith("❌")?"#f87171":gt.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${gt.startsWith("❌")?"rgba(239,68,68,0.15)":gt.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:gt})]}):we.content&&typeof we.content=="string"&&(we.content.trim().startsWith("data:image/")||we.content.trim().startsWith("iVBORw0KGgo"))?e.jsx(ai,{src:we.content.trim().startsWith("data:image/")?we.content.trim():`data:image/png;base64,${we.content.trim()}`,alt:we.title||"Desktop Screenshot"}):e.jsx("pre",{ref:nt,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:vr(we.content)}),e.jsxs("div",{style:{...n.modalFooter,marginTop:"10px"},children:[we.title.includes("settings.json")&&e.jsx("button",{disabled:be,style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:be?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:be?"not-allowed":"pointer"},onClick:pe,children:be?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(we.title.includes("settings.json")?Te:vr(we.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...n.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>kt(i=>({...i,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(et,{children:yt&&yt.isOpen&&e.jsx(li,{webPreviewModal:yt,handleCloseWebPreview:de,directLan:Z,webPreviewLoading:xt,previewIframeRef:Mt,previewBlobUrl:Dt,setWebPreviewModal:At})}),e.jsx(et,{children:it.isOpen&&e.jsx(Ve.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>Jt(i=>({...i,isOpen:!1})),children:e.jsxs(Ve.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:i=>i.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[it.copierName," · MAC: ",it.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>Jt(i=>({...i,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:it.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(it.jsonData,null,2)),Qe("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(it.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>Jt(i=>({...i,isOpen:!1})),children:"Đóng"})})]})})})]})}const di=(t={})=>{const{showToast:s,pollCommandStatus:a,utilityCommands:g}=t,[f,P]=y.useState([]),[N,K]=y.useState(()=>localStorage.getItem("goxprint_selected_public_ip")||localStorage.getItem("gox_connect_public_ip")||""),[_e,X]=y.useState(""),[U,E]=y.useState(()=>localStorage.getItem("goxprint_target_internal_ip")||""),[le,$]=y.useState(!1),[v,Q]=y.useState(()=>{try{const h=localStorage.getItem("goxprint_expanded_printers");return h?JSON.parse(h):{}}catch{return{}}}),[m,A]=y.useState({}),[O,j]=y.useState({}),[ee,Z]=y.useState({}),[xe,Te]=y.useState({}),[ve,te]=y.useState({isOpen:!1,copier:null,oldIp:"",newIp:"",targetAgentUid:"",status:"",error:""}),[ce,re]=y.useState({isOpen:!1,ip:""}),[Se,b]=y.useState(""),q=y.useRef({}),[H]=y.useState(()=>localStorage.getItem("goxprint_last_viewed_copier_id")),F=y.useRef(N);y.useEffect(()=>{F.current=N},[N]);const D=y.useCallback(async(h=!1)=>{h&&$(!0);try{const x=await Hn(F.current||void 0),_=(x==null?void 0:x.rows)||(Array.isArray(x)?x:[]);P(_);try{const r=((x==null?void 0:x.client_ip)||"").trim();r&&b(r);const d=!!(x!=null&&x.is_allowed),p=(x==null?void 0:x.active_public_ips)||[],o=F.current||r,u=[];_.forEach(k=>{(k.agents||[]).forEach(T=>{const R=(T.public_ip||T.wan_ip||T.ip||"").trim(),M=(T.local_ip||"").trim();o&&(R&&R===o||M&&M===o)&&u.push(T)})});const c=u.length>0,C=!!F.current||d||c;if(console.log("=================================================="),console.log("🌐 [PUBLIC IP ACCESS CONTROL CHECK]"),console.log("📌 IP Public hiện tại của trình duyệt:",r),F.current&&console.log("⚡ IP Public do người dùng chỉ định kết nối:",F.current),console.log("🛡️ Danh sách Public IP đang Active trên Server:",p),console.log("✅ Quyền truy cập toàn bộ LAN (Is Whitelisted/Allowed):",d||F.current?"CÓ (FULL ACCESS)":"KHÔNG (LIMITED BY AGENT PUBLIC IP)"),console.log("💻 Danh sách Agent có cùng Public IP:",u.length>0?u:C?"Đang mở Full LAN (Tất cả Agent)":"Không tìm thấy Agent cùng IP"),console.log("=================================================="),!C&&r){console.warn(`[ACCESS DENIED] Public IP ${r} is not allowed and not in the same network.`),re({isOpen:!0,ip:r});return}console.log("[FRONTEND SCANPOINTS VPS] DANH SÁCH DANH BẠ TỪ SCANPOINTS VPS (< 3 NGÀY):"),_.forEach(k=>{(k.printers||[]).forEach(T=>{var l;const R=T.address_book_sync||{},M=Array.isArray(R.address_list)?R.address_list:((l=R.address_book_data)==null?void 0:l.address_list)||[],ie=T.mac_address||T.mac_id||"—";M.length>0&&console.log(`📌 Máy in [${T.printer_name||T.name}] - IP: ${T.ip} | MAC: ${ie} (${M.length} điểm scan trong ScanPoints VPS):`,M)})}),console.log("==================================================")}catch(r){console.error("Console log error:",r)}_.length>0&&X(()=>{const r=F.current.trim();if(r){const o=_.find(u=>(u.public_ip||u.wan_ip||"").trim()===r?!0:(u.agents||[]).some(C=>(C.public_ip||C.wan_ip||C.ip||"").trim()===r));return o?(localStorage.setItem("goxprint_selected_lan_uid",o.lan_uid),o.lan_uid):r}if(_.length===1)return localStorage.setItem("goxprint_selected_lan_uid",_[0].lan_uid),_[0].lan_uid;const d=_.find(o=>o.printers&&o.printers.length>0||o.agents&&o.agents.length>0),p=d?d.lan_uid:_[0].lan_uid;return localStorage.setItem("goxprint_selected_lan_uid",p),p}),h&&s("Tải mạng LAN","success")}catch(x){console.error("Failed to fetch LAN sites:",x),h&&s("Tải mạng LAN thất bại","error")}finally{$(!1)}},[s]);y.useEffect(()=>{D()},[D]),y.useEffect(()=>{const h=setInterval(()=>{D()},6e4);return()=>clearInterval(h)},[D]);const oe=y.useMemo(()=>{if(!f||f.length===0)return[];const h=N.trim();if(h){const x=f.filter(_=>(_.public_ip||_.wan_ip||"").trim()===h?!0:(_.agents||[]).some(d=>(d.public_ip||d.wan_ip||d.ip||"").trim()===h));return x.length>0?x:[]}return f},[f,N]),w=y.useMemo(()=>{const h=N.trim();if(h){if(f&&f.length>0){const _=f.find(r=>(r.public_ip||r.wan_ip||r.lan_uid||"").trim()===h?!0:(r.agents||[]).some(p=>(p.public_ip||p.wan_ip||p.ip||"").trim()===h));if(_)return _}return{lead:"default",lan_uid:h,lan_name:`IP Public ${h}`,public_ip:h,wan_ip:h,active_agents:0,agents:[],emails:[],printers:[]}}if(!f||f.length===0)return null;if(_e){const _=f.find(r=>r.lan_uid===_e);if(_)return _}const x=f.find(_=>_.printers&&_.printers.length>0||_.agents&&_.agents.length>0);return f.length===1?x||f[0]:x||null},[f,N,_e]),S=y.useCallback((h,x=!0)=>{var c,C,k;if(!h)return;const _=h.lan_uid,r=Date.now();if((C=(c=t.commandStatus)==null?void 0:c[`scan_lan_${_}`])==null?void 0:C.isPending){s("Đang quét mạng LAN, vui lòng chờ lệnh hiện tại hoàn tất...","warning",3e3);return}const p=q.current[_]||0;if(x&&r-p<10*1e3){s("Vui lòng chờ ít nhất 10 giây giữa các lần quét mạng LAN.","warning",2500);return}if(!x&&r-p<30*1e3)return;q.current[_]=r;const o=(h.agents||[]).filter(T=>T.is_agent_active);if(!o||o.length===0){s(`Không có Agent nào trực thuộc mạng LAN ${_} đang hoạt động để thực hiện quét!`,"error",4e3);return}Ur(_).catch(T=>console.warn("[triggerLanScan] purgeLanPrinters error (non-fatal):",T)),o.sort((T,R)=>{const M=new Date(T.last_seen||T.updated_at||T.last_ping||0).getTime();return new Date(R.last_seen||R.updated_at||R.last_ping||0).getTime()-M});const u=o[0];if(u&&a){s("Quét mạng LAN...","info",3e3),(k=t.setCommandStatus)==null||k.call(t,M=>({...M,[`scan_lan_${_}`]:{message:"⏳ Quét mạng LAN...",isPending:!0}}));const T=u,R={command:"force_subnet_scan",lead:h.lead};Ee(`/api/agents/${T.agent_uid}/utility/exec?lead=default`,{method:"POST",body:JSON.stringify(R)}).then(M=>{const ie=(M==null?void 0:M.command_id)||(M==null?void 0:M.id);ie&&(M!=null&&M.skipped&&s(M.message||"Lệnh quét mạng đang được Agent thực thi...","info",3e3),a(Number(ie),`scan_lan_${_}`,async l=>{console.log("🔍 [PRINTAGENT RESULT] Kết quả force_subnet_scan:",l);let Y=[];const z=(l==null?void 0:l.result)||(l==null?void 0:l.result_payload)||(l==null?void 0:l.output)||(l==null?void 0:l.error_message)||(l==null?void 0:l.raw)||"";if(Array.isArray(z))Y=z;else if(typeof z=="string"&&z.trim()){try{const pe=JSON.parse(z.trim());Array.isArray(pe)&&(Y=pe)}catch{}if(Y.length===0)try{let pe="";if(z.includes("__PRINTERS_JSON_START__"))pe=z.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].trim();else{const me=z.match(/(?:^|\n)\s*(\[\s*\{[\s\S]*\}\s*\])/);if(me)pe=me[1];else{const Ke=z.match(/(\[\s*\{[\s\S]*\}\s*\])/);Ke&&(pe=Ke[1])}}if(pe){const me=JSON.parse(pe);Array.isArray(me)&&(Y=me)}}catch(pe){console.error("🔍 [Frontend] Lỗi parse JSON máy in:",pe)}}if(Y.length>0){s("Lan scan done!","success",4e3);try{await Ee("/api/new-devices",{method:"POST",body:JSON.stringify({lan_uid:_||"default",devices:Y})})}catch{}D()}else s("Lan scan done!","success",4e3)},async l=>{s("Quét mạng LAN thất bại","error",4e3)},"⏳ Quét mạng LAN..."))}).catch(M=>{console.error(M)})}},[s,a,g]),se=y.useMemo(()=>{if(!w)return[];const h=(U||"").trim().toLowerCase(),x=(w.printers||[]).filter(_=>{const r=(_.printer_name||_.name||"").toLowerCase().trim(),d=(_.ip||_.printer_ip||"").toLowerCase().trim();return!(r.includes("unknown")||r==="unknown printer"||r.includes("pdf")||r.includes("fax")||r.includes("brother")||r.includes("canon lbp")||r.includes("rustdesk")||h&&!(d===h||d.includes(h)||h.includes(".")&&d.endsWith(h)))});return H?[...x].sort((_,r)=>{const d=String(_.id)===H,p=String(r.id)===H;return d&&!p?-1:!d&&p?1:0}):x},[w,U,H]),ae=y.useCallback(h=>{var k;if(!w)return"";const x=String(h||"").trim(),_=x.toUpperCase().replace(/[:-]/g,""),r=(k=w==null?void 0:w.printers)==null?void 0:k.find(T=>{const R=String((T==null?void 0:T.mac_address)||(T==null?void 0:T.mac_id)||(T==null?void 0:T.mac)||"").toUpperCase().replace(/[:-]/g,"");return _&&R===_||T.ip===x||String(T.id)===x}),d=(w.agents||[]).filter(T=>T.is_agent_active),p=((r==null?void 0:r.mac_address)||(r==null?void 0:r.mac_id)||(x.includes(":")?x:"")).toUpperCase().replace(/-/g,":"),o=p&&ee[p]||ee[x]||(r==null?void 0:r.id)&&ee[r.id]||(r==null?void 0:r.ip)&&ee[r.ip];if(o&&d.some(R=>R.agent_uid===o))return o;const u=w.public_ip||w.wan_ip,c=d.find(T=>T.public_ip&&T.public_ip===u||T.wan_ip&&T.wan_ip===u),C=(r!=null&&r.agent_uid?d.find(T=>T.agent_uid===r.agent_uid):null)||c;return C?C.agent_uid:(r==null?void 0:r.agent_uid)||""},[w,ee]),ue=h=>{localStorage.setItem("goxprint_last_viewed_copier_id",h)};return y.useEffect(()=>{if(w){const h={};w.printers.forEach(x=>{const _=(w.agents||[]).filter(c=>c.is_agent_active),r=w.public_ip||w.wan_ip,d=_.find(c=>c.public_ip&&c.public_ip===r||c.wan_ip&&c.wan_ip===r),p=(x.agent_uid?_.find(c=>c.agent_uid===x.agent_uid):null)||d,o=p?p.agent_uid:x.agent_uid||"",u=(x.mac_address||x.mac_id||"").toUpperCase().replace(/-/g,":");u&&(h[u]=o),x.ip&&(h[x.ip]=o),x.id!==void 0&&x.id!==null&&(h[x.id]=o)}),Z(x=>({...h,...x})),A(x=>{const _={...x};return w.printers.forEach(r=>{const d=r.auth_user||r.user||"",p=r.auth_password||r.password||"",o=(r.mac_address||r.mac_id||"").toUpperCase().replace(/-/g,":"),u=o&&_[o]||_[r.id]||r.ip&&_[r.ip],c=(u==null?void 0:u.user)!==void 0?u.user:d,C=(u==null?void 0:u.pass)!==void 0?u.pass:p;o&&(_[o]={user:c,pass:C}),r.ip&&(_[r.ip]={user:c,pass:C}),r.id!==void 0&&r.id!==null&&(_[r.id]={user:c,pass:C})}),_})}},[w]),{lanSites:f,setLanSites:P,selectedPublicIp:N,setSelectedPublicIp:K,filteredLanSites:oe,targetInternalIp:U,setTargetInternalIp:E,selectedLanUid:_e,setSelectedLanUid:X,selectedLan:w,lanSitesLoading:le,setLanSitesLoading:$,fetchLanSitesData:D,triggerLanScan:S,filteredPrinters:se,copierCredentials:m,setCopierCredentials:A,saveAuthLoading:O,setSaveAuthLoading:j,handleSaveAuth:async h=>{const x=String(typeof h=="object"?h.id:h),_=typeof h=="object"&&(h.mac_id||h.mac_address)||"",r=_?_.toUpperCase().replace(/-/g,":"):"",d=typeof h=="object"&&(h.printer_type||h.type)||"",p=r&&m[r]||m[x]||{user:"",pass:""};j(o=>({...o,[x]:!0,...r?{[r]:!0}:{}}));try{const o=await Vn(r||x,p.user,p.pass,r||x,d);if(o.ok){const u=o.command_id||o.id;u&&a?(s("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),a(u,x,c=>{const C=c!=null&&c.error?` (${c.error})`:c!=null&&c.result?` (${c.result})`:"";s(`Đã test đăng nhập thành công và lưu vào database!${C}`,"success",5e3),P(k=>k.map(T=>({...T,printers:T.printers.map(R=>String(R.id)===String(x)||macId&&R.mac_id===macId?{...R,auth_user:p.user,auth_password:p.pass}:R)}))),j(k=>({...k,[x]:!1}))},c=>{s(`Lỗi Agent lưu Auth: ${c}`,"error"),j(C=>({...C,[x]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(s("Đã lưu tài khoản Web UI máy photocopy thành công","success"),P(c=>c.map(C=>({...C,printers:C.printers.map(k=>String(k.id)===String(x)||macId&&k.mac_id===macId?{...k,auth_user:p.user,auth_password:p.pass}:k)}))),j(c=>({...c,[x]:!1})))}else throw new Error(o.error||"Lỗi lưu thông tin đăng nhập")}catch{s("Lưu tài khoản thất bại","error"),j(u=>({...u,[x]:!1}))}},editIpModalData:ve,setEditIpModalData:te,handleEditIP:h=>{const x=ae(h.mac_id||h.mac_address||h.ip||h.id);te({isOpen:!0,copier:h,oldIp:h.ip||"",newIp:h.ip||"",targetAgentUid:x,status:"",error:""})},handleSaveEditIP:async()=>{if(!ve.copier||!ve.newIp)return;const h=ve.copier,x=ve.oldIp,_=ve.newIp.trim(),r=ve.targetAgentUid;if(!_){te(d=>({...d,error:"Vui lòng nhập địa chỉ IP mới!"}));return}te(d=>({...d,status:"⌛ Đang gửi lệnh đổi IP tới Agent...",error:""})),s("Đổi IP...","info",2e3);try{const p=(h.printer_type||h.printer_name||"").toLowerCase().includes("toshiba")?"toshiba_change_ftp":"ricoh_change_ftp",o=await ot(r,p,"",{old_ip:x,new_ip:_,printer_ip:x,target_ip:x});if(!o.ok||!o.command_id)throw new Error(o.error||"Không thể tạo lệnh đổi IP");te(u=>({...u,status:"⌛ Agent đang kết nối máy in để thực hiện đổi IP..."})),a&&a(o.command_id,`edit_ip_${h.id}`,u=>{s("Đổi IP","success",3e3),P(c=>c.map(C=>({...C,printers:C.printers.map(k=>String(k.id)===String(h.id)||k.mac_id===h.mac_id?{...k,ip:_}:k)}))),te(c=>({...c,isOpen:!1,status:"",error:""}))},u=>{s("Đổi IP thất bại","error"),te(c=>({...c,status:"",error:u}))},"⏳ Đang cập nhật IP...")}catch(d){te(p=>({...p,status:"",error:d.message||"Lỗi không xác định"})),s("Đổi IP thất bại","error")}},expandedPrinters:v,setExpandedPrinters:Q,selectedTargetAgents:ee,setSelectedTargetAgents:Z,getTargetAgentUid:ae,handleCopierClick:ue,accessDeniedState:ce,setAccessDeniedState:re,liveAddressBooks:xe,setLiveAddressBooks:Te,myClientIp:Se}},Nr=new Set(["get_agent_ip","get_public_ip","view_settings_json","view_printers_json","view_scan_points_json","view_agent_loader_debug","view_stout","view_sterror","dxdiag","printers","clean_temp","scan","ricoh_list_scan","toshiba_list_scan"]),Dr={get_agent_ip:"Địa chỉ IP Local của Agent",get_public_ip:"Địa chỉ IP Public (Internet)",view_settings_json:"Nội dung tệp settings.json",view_printers_json:"Nội dung tệp printers.json",view_scan_points_json:"Nội dung tệp scan_points.json",view_agent_loader_debug:"Nội dung tệp agent_loader_debug.txt",view_stout:"Nội dung tệp stout.txt (1000 dòng cuối)",view_sterror:"Nội dung tệp sterror.txt (1000 dòng cuối)",dxdiag:"Kết quả kiểm tra cấu hình hệ thống (DxDiag)",printers:"Danh sách máy in hệ thống",clean_temp:"Kết quả dọn dẹp thư mục tạm & Driver",scan:"Nội dung thư mục Scan gốc (%TEMP%/GoPrinxAgent/ftp)",ricoh_list_scan:"Danh bạ Scan trên máy photo Ricoh",toshiba_list_scan:"Danh bạ Scan trên máy photo Toshiba"},pi=(t={})=>{const{showToast:s,setViewOutputModal:a,setIpInputModal:g}=t,[f,P]=y.useState([]),[N,K]=y.useState(!1),[_e,X]=y.useState(!1),[U,E]=y.useState(null),[le,$]=y.useState(null),[v,Q]=y.useState(null);y.useEffect(()=>{let q=!0;const H=(v==null?void 0:v.agent_uid)||"default";return K(!0),zr(H).then(F=>{if(!q)return;const D=Array.isArray(F)?F:(F==null?void 0:F.commands)||(F==null?void 0:F.rows)||[];P(D)}).catch(F=>{console.error("Failed to load utility commands:",F)}).finally(()=>{q&&K(!1)}),()=>{q=!1}},[v]);const[m,A]=y.useState(""),[O,j]=y.useState(!1),[ee,Z]=y.useState(""),[xe,Te]=y.useState("ping 8.8.8.8"),ve=y.useCallback((q,H,F,D,oe)=>{var ue;(ue=t.setCommandStatus)==null||ue.call(t,he=>({...he,[H]:{message:oe||"Đang thực thi lệnh...",isPending:!0}}));const w=1500,S=6e4,se=Date.now(),ae=setInterval(async()=>{var de,J,h,x,_;const he=Date.now()-se;if(he>S){clearInterval(ae),(de=t.setCommandStatus)==null||de.call(t,r=>({...r,[H]:{message:"Lỗi: Quá thời gian chờ (Timeout 60s)",isPending:!1}})),D&&D("Quá thời gian chờ (Timeout 60s)");return}try{const r=await Nt(q);if(r.ok&&r.status==="success"){clearInterval(ae);const d=r.result?` (${r.result})`:"";(J=t.setCommandStatus)==null||J.call(t,p=>({...p,[H]:{message:`Đã hoàn tất thành công!${d}`,isPending:!1}})),F(r)}else if(r.ok&&r.status==="failed"){clearInterval(ae);const d=r.error||r.error_message||r.result||"Thực thi thất bại";(h=t.setCommandStatus)==null||h.call(t,p=>({...p,[H]:{message:`Lỗi: ${d}`,isPending:!1}})),D&&D(d)}else{const d=r.received_at?`Agent đã nhận lệnh (${Math.round(he/1e3)}s)...`:`Đang gửi lệnh tới Agent (${Math.round(he/1e3)}s)...`;(x=t.setCommandStatus)==null||x.call(t,p=>({...p,[H]:{message:d,isPending:!0}}))}}catch(r){clearInterval(ae),(_=t.setCommandStatus)==null||_.call(t,d=>({...d,[H]:{message:`Lỗi kết nối: ${r.message||"Lỗi polling"}`,isPending:!1}})),D&&D(r.message||"Lệnh thực hiện thất bại từ Agent")}},w)},[t]),te=async(q,H,F)=>{try{const D=await Zn(q,10),w=(D.jobs||D.commands||[]).filter(S=>S.status==="pending"&&S.command_type===H);return F?w.some(S=>{const se=S.command_params||{};return Object.keys(F).every(ae=>String(se[ae])===String(F[ae]))}):w.length>0}catch{return!1}},ce=y.useCallback(async q=>{X(!0),Z("");try{const H=await ot(q,"view_settings_json","");if(!H.ok||!H.command_id)throw new Error(H.error||"Không thể gửi lệnh xem settings.json");ve(H.command_id,"view_settings",F=>{const D=typeof F.result_payload=="object"&&F.result_payload?JSON.stringify(F.result_payload,null,2):F.result_payload||F.result||"";A(D),X(!1)},F=>{Z(`❌ Không thể nạp settings.json: ${F}`),X(!1)},"⌛ Đang nạp settings.json từ Agent...")}catch(H){Z(`❌ Lỗi nạp cấu hình: ${H.message}`),X(!1)}},[ve]),re=async q=>{if(!q||!m)return;try{JSON.parse(m)}catch(F){Z(`❌ Lỗi định dạng JSON: ${F.message}`);return}j(!0),Z("⌛ Đang gửi cấu hình mới tới Agent...");const H=btoa(unescape(encodeURIComponent(m)));try{const F=(f||[]).find(S=>S.command==="save_settings_json"),D=(F==null?void 0:F.command_content)||"",oe=await ot(q,"save_settings_json",D,{base64_content:H});if(!oe.ok||!oe.command_id)throw new Error(oe.error||"Không thể tạo lệnh tiện ích");const w=oe.command_id;ve(w,"save_settings",()=>{Z("✅ Đã lưu và nạp lại cấu hình settings.json thành công!"),j(!1),s&&s("Lưu cấu hình","success")},S=>{Z(`❌ Lỗi lưu cấu hình: ${S}`),j(!1)},"⌛ Agent đang ghi đè tệp settings.json...")}catch(F){Z(`❌ Lỗi gửi lệnh: ${F.message}`),j(!1)}},Se=y.useCallback(async(q,H,F,D={})=>{let oe=v,w="",S="",se={};if(typeof q=="string"?(w=q,S=H||w,se=F||{}):(oe=q||v,w=H||"",S=F||w,se=D||{}),!!oe){$(w),E({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const ae=await ei(oe.agent_uid,S,se);if(!ae.ok||!ae.command_id)throw new Error(ae.error||"Không thể tạo lệnh tiện ích");const ue=ae.command_id,he=6e4,de=1e3,J=Date.now(),h=setInterval(async()=>{try{const x=Date.now()-J;if(x>he){clearInterval(h),E({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),$(null);return}const _=await Nt(ue);if(_.status==="success")clearInterval(h),E({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),$(null);else if(_.status==="failed"||!_.ok)clearInterval(h),E({text:`❌ Thất bại: ${_.error||"Lệnh thất bại từ Agent"}`,isError:!0}),$(null);else{const r=Math.round(x/1e3);_.received_at?E({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${r}s)`,isError:!1}):E({text:`⌛ Đang chuyển lệnh tới Agent... (${r}s)`,isError:!1})}}catch(x){console.error("Error polling utility status:",x)}},de)}catch(ae){console.error(`Failed to trigger ${w}:`,ae),E({text:`Lỗi kết nối hoặc gửi lệnh: ${ae.message}`,isError:!0}),$(null)}}},[v]),b=y.useCallback(async(q,H,F)=>{let D=v,oe="",w="";if(typeof q=="string"?(oe=q,w=H||""):(D=q||v,oe=H||"",w=F||""),!D)return;if(await te(D.agent_uid,"trigger_utility",{action:"exec_utility",command:oe})){s&&s("Lệnh đang chờ xử lý...","info");return}const se=f.find(he=>he.command===oe),ae=(se==null?void 0:se.output_modal)!==!1||Nr.has(oe),ue=(se==null?void 0:se.label)||Dr[oe]||oe;if(oe==="change_agent_ip"||oe==="check_scan_ip_match"){const he=oe==="change_agent_ip",de=(D==null?void 0:D.local_ip)||(D==null?void 0:D.ip)||(D==null?void 0:D.agent_ip)||(D==null?void 0:D.localIp)||"";g&&g({isOpen:!0,title:he?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:he?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:de,changeAllTo:"",scanStatus:"",error:"",onConfirm:(J,h)=>{const x=w.replace("__TARGET_IP__",J);$(oe),E({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),ot(D.agent_uid,oe,x,{target_ip:J,ip:J,printer_ip:J,change_all_to:h||""}).then(_=>{if(!_.ok||!_.command_id)throw new Error(_.error||"Không thể tạo lệnh tiện ích");const r=_.command_id,d=6e4,p=Date.now(),o=setInterval(async()=>{try{const u=Date.now()-p;if(u>d){clearInterval(o),E({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),$(null);return}const c=await Nt(r);if(c.status==="success"){if(clearInterval(o),ae&&a){const C=typeof c.result_payload=="object"&&c.result_payload?JSON.stringify(c.result_payload,null,2):c.result_payload||c.output||c.error_message||c.error||c.result||"(không có nội dung)";a({isOpen:!0,title:ue,content:C,rawPayload:c.result_payload||c.output||c.error_message||c.result||""})}else E({text:"⚡ Thực hiện lệnh thành công!",isError:!1});$(null),t.fetchLanSitesData&&(t.fetchLanSitesData(!0),setTimeout(()=>t.fetchLanSitesData&&t.fetchLanSitesData(!0),2e3),setTimeout(()=>t.fetchLanSitesData&&t.fetchLanSitesData(!0),5e3))}else if(c.status==="failed"||!c.ok){if(clearInterval(o),a){const C=c.error||typeof c.result_payload=="object"&&c.result_payload?JSON.stringify(c.result_payload,null,2):c.result_payload||c.output||c.error_message||c.result||"(không có nội dung)";a({isOpen:!0,title:ue,content:C,rawPayload:c.result_payload||c.output||c.error_message||c.result||""})}else E({text:`❌ Thất bại: ${c.error||"Lệnh thất bại từ Agent"}`,isError:!0});$(null)}else{const C=Math.round(u/1e3);E({text:`⌛ Agent đang thực hiện lệnh... (${C}s)`,isError:!1})}}catch(u){console.error("Error polling status:",u)}},1e3)}).catch(_=>{E({text:`Lỗi gửi lệnh: ${_.message}`,isError:!0}),$(null)})}});return}if($(oe),E({text:"⌛ Đang gửi lệnh thực thi tới Agent...",isError:!1}),oe==="force_subnet_scan"){const he=(D==null?void 0:D.lan_uid)||(v==null?void 0:v.lan_uid)||"default";Ur(he).catch(de=>console.warn("[handleTriggerUtilityExec] purgeLanPrinters error (non-fatal):",de))}try{const he=await ot(D.agent_uid,oe,w);if(!he.ok||!he.command_id)throw new Error(he.error||"Không thể tạo lệnh tiện ích");const de=he.command_id,J=6e4,h=1e3,x=Date.now(),_=setInterval(async()=>{try{const r=Date.now()-x;if(r>J){clearInterval(_),E({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),$(null);return}const d=await Nt(de);if(d.status==="success"){if(clearInterval(_),ae&&a){const p=typeof d.result_payload=="object"&&d.result_payload?JSON.stringify(d.result_payload,null,2):d.result_payload||d.output||d.error_message||d.error||d.result||"(không có nội dung)";a({isOpen:!0,title:ue,content:p,rawPayload:d.result_payload||d.output||d.error_message||d.result||""})}else E({text:"⚡ Thực hiện lệnh thành công!",isError:!1});$(null),t.fetchLanSitesData&&(t.fetchLanSitesData(!0),setTimeout(()=>t.fetchLanSitesData&&t.fetchLanSitesData(!0),2e3))}else if(d.status==="failed"||!d.ok){if(clearInterval(_),ae&&a){const p=d.error||typeof d.result_payload=="object"&&d.result_payload?JSON.stringify(d.result_payload,null,2):d.result_payload||d.output||d.error_message||d.result||"(không có nội dung)";a({isOpen:!0,title:ue,content:p,rawPayload:d.result_payload||d.output||d.error_message||d.result||""})}else E({text:`❌ Thất bại: ${d.error||d.error_message||"Lệnh thất bại từ Agent"}`,isError:!0});$(null)}else{const p=Math.round(r/1e3),o=d.progress_text||`Đang xử lý... (${p}s)`;E({text:`⌛ ${o}`,isError:!1})}}catch(r){const d=(r==null?void 0:r.message)||String(r||"");ae&&a&&(d.startsWith("[PATH]")||d.includes("stout")||d.includes("sterror")||d.includes("settings.json"))?(clearInterval(_),a({isOpen:!0,title:ue,content:d,rawPayload:d}),E(null),$(null)):d.includes("502")||d.includes("404")||d.includes("xóa")||elapsed>15e3?(clearInterval(_),$(null),E({text:"❌ Lệnh đã dừng hoặc bị xóa",isError:!0})):console.error("Poll error:",r)}},h)}catch(he){E({text:`Lỗi: ${he.message}`,isError:!0}),$(null)}},[v,f,s,g,a]);return{VIEW_COMMANDS:Nr,VIEW_COMMAND_TITLES:Dr,utilityCommands:f,setUtilityCommands:P,utilityCommandsLoading:N,setUtilityCommandsLoading:K,utilitySettingsLoading:_e,setUtilitySettingsLoading:X,utilityStatusMsg:U,setUtilityStatusMsg:E,utilityActionPending:le,setUtilityActionPending:$,selectedUtilityAgent:v,setSelectedUtilityAgent:Q,editableSettingsText:m,setEditableSettingsText:A,isSavingSettings:O,setIsSavingSettings:j,settingsSaveStatus:ee,setSettingsSaveStatus:Z,customRunCommand:xe,setCustomRunCommand:Te,pollCommandStatus:ve,loadUtilitySettings:ce,handleSaveSettings:re,handleTriggerUtility:Se,handleTriggerUtilityExec:b}},mi=(t={})=>{const{showToast:s,pollCommandStatus:a}=t,[g,f]=y.useState({isOpen:!1,copier:null,url:"",tunnelUrl:"",directUrl:"",auth:{user:"",pass:""}}),[P,N]=y.useState("tunnel"),[K,_e]=y.useState(!1),[X,U]=y.useState([]),[E,le]=y.useState(-1),[$,v]=y.useState(!1),[Q,m]=y.useState(null),A=y.useRef(null),[O,j]=y.useState({isOpen:!1,printerId:"",copier:null,targetAgentUid:"",status:"",error:""}),ee=y.useCallback(()=>{Q&&(URL.revokeObjectURL(Q),m(null)),f(ce=>({...ce,isOpen:!1}))},[Q]),Z=y.useCallback(async(ce,re,Se="/")=>{if(!ce){s&&s("Không tìm thấy Agent UID","error");return}const b=(H,F)=>`
      <html>
        <head>
          <title>${H}</title>
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
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${H}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${F}</div>
        </body>
      </html>
    `,q=window.open("about:blank","_blank");q&&q.document.write(b("Đang kết nối tên miền...",`Đang kết nối đến máy in ${re} qua tên miền *.app.goxprint.com...`)),_e(!0);try{const D=await(await fetch(`https://agentapi.quanlymay.com/api/agents/${ce}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:re,printer_port:80})})).json();D.ok&&D.url?q&&(q.location.href=D.url):(q&&q.close(),s&&s("Kết nối lỗi: "+(D.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch(H){q&&q.close(),s&&s("Lỗi hệ thống VPS: "+(H.message||H),"error")}finally{_e(!1)}},[s]),xe=y.useCallback(()=>{if(E>0){const ce=X[E-1];le(E-1),g.copier&&Z(g.copier.agent_uid,g.copier.ip,ce)}},[E,X,g,Z]),Te=y.useCallback(()=>{if(E<X.length-1){const ce=X[E+1];le(E+1),g.copier&&Z(g.copier.agent_uid,g.copier.ip,ce)}},[E,X,g,Z]);return{webPreviewModal:g,setWebPreviewModal:f,webPreviewTab:P,setWebPreviewTab:N,webPreviewLoading:K,setWebPreviewLoading:_e,webPreviewHistory:X,setWebPreviewHistory:U,webPreviewHistoryIndex:E,setWebPreviewHistoryIndex:le,showPreviewDetails:$,setShowPreviewDetails:v,previewBlobUrl:Q,setPreviewBlobUrl:m,previewIframeRef:A,handleCloseWebPreview:ee,fetchRemotePage:Z,handleHistoryBack:xe,handleHistoryForward:Te,installDriverModal:O,setInstallDriverModal:j,handleRemoteInstallDriver:(ce,re,Se)=>{j({isOpen:!0,printerId:String(ce),copier:re,targetAgentUid:Se,status:"",error:""})},executeRemoteInstallDriver:async()=>{if(!O.copier||!O.targetAgentUid)return;const{printerId:ce,copier:re,targetAgentUid:Se}=O;j(b=>({...b,status:"⌛ Đang gửi lệnh cài đặt Driver tới Agent...",error:""})),s&&s("Đang tạo lệnh tải và cài đặt Driver máy in tự động...","info",3e3);try{const b=await Gr(Se,re.ip,re.printer_name||re.name||"Printer",re.printer_type||re.brand||"");if(!b.ok||!b.command_id)throw new Error(b.error||"Không thể tạo lệnh cài driver");j(q=>({...q,status:"⌛ Agent đang tải gói Driver và tiến hành Silent Install..."})),a&&a(b.command_id,`install_driver_${ce}`,q=>{s&&s("✓ Đã cài đặt Driver máy in thành công lên máy Agent!","success",5e3),j(H=>({...H,isOpen:!1,status:"",error:""}))},q=>{s&&s(`[-] Lỗi cài đặt Driver: ${q}`,"error"),j(H=>({...H,status:"",error:q}))},"⏳ Agent đang cài đặt Driver vào hệ thống Windows...")}catch(b){j(q=>({...q,status:"",error:b.message||"Lỗi không xác định"})),s&&s(`Lỗi cài đặt Driver: ${b.message}`,"error")}}}},ui=(t={})=>{const{showToast:s,pollCommandStatus:a,setViewOutputModal:g}=t,[f,P]=y.useState({isOpen:!1,agentUid:"",agentName:"",currentPath:"",items:[],loading:!1,error:""}),[N,K]=y.useState([]),[_e,X]=y.useState(!1),[U,E]=y.useState({isOpen:!1,printer:null,data:null,rawJson:""}),le=(Q,m)=>{if(!m||m===".")return Q;if(m===".."){const A=Q.split("/").filter(Boolean);return A.pop(),A.join("/")||""}return Q?`${Q}/${m}`:m},$=y.useCallback(async(Q,m,A="")=>{P({isOpen:!0,agentUid:Q,agentName:m,currentPath:A,items:[],loading:!0,error:""});try{const O=await Br(Q,A);if(O.ok)P(j=>({...j,items:O.items||O.files||[],loading:!1}));else throw new Error(O.error||"Không thể tải danh sách tệp")}catch(O){P(j=>({...j,loading:!1,error:O.message||"Lỗi kết nối tới Agent"})),s&&s(`Không thể mở thư mục lưu trữ: ${O.message}`,"error")}},[s]),v=y.useCallback(async(Q,m)=>{if(Q){s&&s("⌛ Đang tải file scan_points.json từ Agent...","info",3e3);try{const A=await ot(Q,"view_scan_points_json","");if(!A.ok||!A.command_id)throw new Error(A.error||"Không thể tạo lệnh xem file scan_points.json");a&&a(A.command_id,`view_scan_points_${(m==null?void 0:m.id)||"json"}`,O=>{const j=O.result_payload||O.result||"";let ee=null;if(typeof j=="object"&&j!==null)ee=j;else if(typeof j=="string")try{ee=JSON.parse(j)}catch{ee=null}const Z=ee?JSON.stringify(ee,null,2):String(j);E({isOpen:!0,printer:m,data:ee,rawJson:Z}),g&&g({isOpen:!0,title:`📋 Danh bạ Scan (${(m==null?void 0:m.printer_name)||(m==null?void 0:m.name)||"Copier"})`,content:Z,rawPayload:j})},O=>{s&&s(`Lỗi xem scan_points.json: ${O}`,"error")},"⏳ Agent đang đọc file scan_points.json...")}catch(A){s&&s(`Lỗi đọc file scan_points.json: ${A.message}`,"error")}}},[s,a,g]);return{storageModalData:f,setStorageModalData:P,storageFiles:N,setStorageFiles:K,storageLoading:_e,setStorageLoading:X,handleOpenStorageFiles:$,resolveRelativePath:le,scanPointsViewerModal:U,setScanPointsViewerModal:E,handleViewScanPointsJson:v}},gi=(t={})=>{const[s,a]=y.useState([]),g=se=>{const ae=String(se||"").trim().split(/\s+/);return ae.length>15?ae.slice(0,15).join(" ")+"…":String(se||"").trim()},f=y.useCallback((se,ae="info",ue=3e3)=>{const he=Date.now().toString()+Math.random().toString().slice(2,6),de=g(se);a(J=>[...J,{id:he,message:de,type:ae}]),setTimeout(()=>{a(J=>J.filter(h=>h.id!==he))},ue)},[]),P=y.useCallback((se,ae,ue="info",he=5e3)=>{const de=g(ae);a(J=>{const h=J.findIndex(x=>x.id===se);if(h!==-1){const x=[...J];return x[h]={id:se,message:de,type:ue},x}return[...J,{id:se,message:de,type:ue}]}),setTimeout(()=>{a(J=>J.filter(h=>h.id!==se))},he)},[]),[N,K]=y.useState("copiers"),[_e,X]=y.useState({}),[U,E]=y.useState(null),[le,$]=y.useState({isOpen:!1,title:"",message:""}),[v,Q]=y.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[m,A]=y.useState({isOpen:!1,title:"",content:"",rawPayload:null}),[O,j]=y.useState({isOpen:!1,title:"",hint:"",value:"",changeAllTo:"",scanStatus:"",error:""}),[ee,Z]=y.useState({printerId:"",name:"",email:"",agentUid:""}),[xe,Te]=y.useState(!1),[ve,te]=y.useState({lanUid:"",agentUid:"",email:""}),[ce,re]=y.useState(!1),[Se,b]=y.useState(null),[q,H]=y.useState({}),F=y.useRef(null),D=di({showToast:f,pollCommandStatus:(...se)=>{var ae;return(ae=F.current)==null?void 0:ae.call(F,...se)},utilityCommands:[],activeTab:N}),oe=pi({showToast:f,setViewOutputModal:A,setIpInputModal:j,setCommandStatus:X,fetchLanSitesData:D.fetchLanSitesData});F.current=oe.pollCommandStatus;const w=mi({showToast:f,pollCommandStatus:oe.pollCommandStatus}),S=ui({showToast:f,pollCommandStatus:oe.pollCommandStatus,setViewOutputModal:A});return{toasts:s,setToasts:a,showToast:f,replaceToast:P,activeTab:N,setActiveTab:K,commandStatus:_e,setCommandStatus:X,activeModal:U,setActiveModal:E,confirmModal:le,setConfirmModal:$,deleteScanPointModal:v,setDeleteScanPointModal:Q,viewOutputModal:m,setViewOutputModal:A,ipInputModal:O,setIpInputModal:j,publicFtpData:ee,setPublicFtpData:Z,publicFtpLoading:xe,setPublicFtpLoading:Te,privateFtpData:ve,setPrivateFtpData:te,privateFtpLoading:ce,setPrivateFtpLoading:re,emailFileCounts:q,setEmailFileCounts:H,getDestinationStatus:()=>({label:"✔ ACTIVE",type:"success",title:""}),getDestinationStatusHtml:()=>({label:"✔ ACTIVE",type:"success",title:""}),...D,...oe,...w,...S}},Lt="https://agentapi.quanlymay.com",fi=(t={})=>{const{cameraForm:s,cameras:a,customRecordDuration:g,directLan:f,fetchCameraFiles:P,fetchCameraStatus:N,fetchCameras:K,isRecording30s:_e,setActiveModal:X,setAllocatedVncAddr:U,setCameraTestLoading:E,setCameraTestResult:le,setIsRecording30s:$,setRecording30sCountdown:v,setSelectedCamera:Q,setToshibaVncData:m,setVncTunnelLoading:A,showToast:O}=t;return{cameraForm:s,cameras:a,customRecordDuration:g,directLan:f,fetchCameraFiles:P,fetchCameraStatus:N,fetchCameras:K,handleDeleteCamera:async(te,ce)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{(await(await fetch(`${Lt}/api/agents/${te}/cameras/${ce}/delete`,{method:"POST"})).json()).ok?(O("Xóa camera","success"),K(te),Q(null)):O("Xóa camera thất bại","error")}catch{O("Xóa camera thất bại","error")}},handleDeleteCameraFile:async(te,ce,re)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${re}`))try{const b=await(await fetch(`${Lt}/api/agents/${te}/cameras/${ce}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:re})})).json();b.ok?(O("Đã xóa tệp video thành công!","success"),P(te,ce)):O("Lỗi xóa tệp: "+b.error,"error")}catch(Se){O("Lỗi hệ thống: "+Se.message,"error")}},handleRecord30s:async(te,ce)=>{if(_e)return;const re=a.find(H=>H.id===ce),Se=(re==null?void 0:re.mac_address)||"";if(!Se){O("Không có MAC ID","error");return}$(!0),v(g);let b=g;const q=setInterval(()=>{b-=1,v(Math.max(b,0)),b<=0&&clearInterval(q)},1e3);try{O(`Ghi hình ${g}s...`,"info",2e3);const F=await(await fetch(`${Lt}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:Se,action:"record",duration:g})})).json();clearInterval(q),F.ok?O(`Ghi hình ${g}s`,"success"):O("Ghi hình thất bại","error")}catch{clearInterval(q),O("Ghi hình thất bại","error")}finally{$(!1),setTimeout(()=>{N(te,ce),P(te,ce)},1500)}},handleSaveCameraConfig:async te=>{try{(await(await fetch(`${Lt}/api/agents/${te}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json()).ok?(O("Lưu camera","success"),K(te),Q(null)):O("Lưu camera thất bại","error")}catch{O("Lưu camera thất bại","error")}},handleStartToshibaVnc:async(te,ce,re)=>{if(m({ip:te,printerName:ce,agentUid:re}),U(""),X("toshiba_vnc"),f){U(`${te}:49105`);return}A(!0);try{const b=await(await fetch(`${Lt}/api/agents/${re}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:te,printer_port:49105})})).json();if(b.ok&&b.url_port){const q=b.url_port.replace("http://","").replace("https://","");U(q)}else O("Không thể mở đường hầm VNC: "+(b.error||"Lỗi không xác định"),"error"),X(null)}catch(Se){O("Lỗi kết nối VPS: "+(Se.message||Se),"error"),X(null)}finally{A(!1)}},handleTestCameraConnection:async te=>{E(!0),le(null);try{const re=await(await fetch(`${Lt}/api/agents/${te}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:s.rtsp_url})})).json();re.ok&&re.result?le(re.result):le({ok:!1,msg:re.error||"Lỗi kiểm tra kết nối"})}catch(ce){le({ok:!1,msg:"Lỗi: "+ce.message})}finally{E(!1)}},isRecording30s:_e,setActiveModal:X,setAllocatedVncAddr:U,setCameraTestLoading:E,setCameraTestResult:le,setIsRecording30s:$,setRecording30sCountdown:v,setSelectedCamera:Q,setToshibaVncData:m,setVncTunnelLoading:A,showToast:O}},hi={ricoh_create_scan:`import requests
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

                    if hasattr(bridge_obj, '_post_address_book_sync_data'):
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

                    if hasattr(bridge_obj, '_post_address_book_sync_data'):
                        bridge_obj._post_address_book_sync_data(p, final_result)
                        print(f"  [✓] TỰ ĐỘNG ĐỒNG BỘ DANH BẠ MỚI NHẤT ({len(entries)} GROUPS) VỀ SERVER THANH CONG!")
                except Exception as sync_err:
                    print(f"  [!] Sync post warning: {sync_err}")

            res_str = json.dumps(final_result, ensure_ascii=False)
            print("__ADDRESS_BOOK_JSON_START__")
            print(res_str)
            print("__ADDRESS_BOOK_JSON_END__")
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
`},_i="https://agentapi.quanlymay.com";function Mr(t,s,a){const g=t.email_address||t.email||"",f=t.physical_path||t.folder||t.folder_path||"",P=(g||f||"").trim();if(!P)return{label:"UNKNOWN",type:"error",title:""};if(t.type==="Email"||g.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const K=(s||[]).find(U=>(U.email||"").toLowerCase().trim()===P.toLowerCase().trim()),_e=K?K.email_number:Number(t.registration_no);if(!_e||isNaN(_e))return{label:"✔ ACTIVE",type:"success",title:""};const X=(a||[]).find(U=>U.is_master&&U.is_agent_active)||(a||[]).find(U=>U.is_agent_active)||(a||[])[0];if(X){const U=(X.ftp_sites||[]).find(E=>Number(E.port)===Number(_e));if(U){const E=("C:/Scangox/"+P).toLowerCase().replace(/\\/g,"/"),$=(U.path||"").toLowerCase().replace(/\\/g,"/")===E;return U.running&&$?{label:"✔ OK",type:"success",title:""}:U.running&&!$?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${U.path} instead of expected: C:/Scangox/${P}`}:U.error&&(U.error.toLowerCase().includes("in use")||U.error.toLowerCase().includes("busy")||U.error.toLowerCase().includes("already bound")||U.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:U.error}:{label:"❌ FAILED",type:"error",title:U.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}function St(t,s){if(!Array.isArray(t)||!s)return;const a=String(typeof s=="object"?s.mac_id||s.mac_address||s.mac||s.ip||s.id:s).trim(),g=a.toUpperCase().replace(/[:-]/g,"");if(g.length===12&&/^[0-9A-F]{12}$/.test(g)){const f=t.find(P=>String((P==null?void 0:P.mac_address)||(P==null?void 0:P.mac_id)||(P==null?void 0:P.mac)||"").toUpperCase().replace(/[:-]/g,"")===g);if(f)return f}if(a.includes(".")){const f=t.find(P=>String((P==null?void 0:P.ip)||(P==null?void 0:P.printer_ip)||"")===a);if(f)return f}return t.find(f=>String(f==null?void 0:f.id)===a||String((f==null?void 0:f.mac_id)||"").toUpperCase()===a.toUpperCase()||String((f==null?void 0:f.mac_address)||"").toUpperCase()===a.toUpperCase()||String((f==null?void 0:f.ip)||"")===a)}const xi=(t={})=>{const{activeAgentUid:s,cameras:a,copierCredentials:g={},deleteScanPointModal:f,editIpModalData:P,fetchLanSitesData:N,getTargetAgentUid:K,isDuplicatePending:_e,lanSites:X=[],pollCommandStatus:U,queryDuration:E,queryTimestamp:le,replaceToast:$,saveScanPointToDb:v,selectedCamera:Q,selectedLan:m,setActiveModal:A,setDeleteScanPointModal:O,setEditIpModalData:j,setInstallDriverModal:ee,setLiveAddressBooks:Z,setQueriedVideoUrl:xe,setQueryDuration:Te,setQueryTimestamp:ve,setQueryVideoLoading:te,setStorageFiles:ce,setStorageLoading:re,setStorageModalData:Se,showToast:b,utilityCommands:q=[]}=t,H=async r=>{const d=String((r==null?void 0:r.mac_address)||(r==null?void 0:r.mac_id)||(r==null?void 0:r.mac)||"").trim(),p=String((r==null?void 0:r.ip)||(r==null?void 0:r.printer_ip)||(typeof r=="string"?r:"")||"").trim(),o=d.toUpperCase().replace(/[^0-9A-F:]/g,""),u=o.replace(/[:-]/g,"");let c="",C="";try{const k=await Ee(`/api/devices/credentials-map?t=${Date.now()}`);if(k&&k.ok&&k.credentials){const T=k.credentials,R=o&&T[o]||u&&T[u]||o&&T[o.replace(/:/g,"-")]||p&&T[p];R&&(c=String(R.user||R.auth_user||"").trim(),C=String(R.password||R.auth_password||R.pass||"").trim())}}catch(k){throw new Error(`❌ Lỗi kết nối VPS khi tải tài khoản máy in: ${k.message||"Lỗi mạng"}`)}if(!c){const k=o||p||"chưa xác định";throw new Error(`⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS cho thiết bị (MAC/IP: ${k}). Vui lòng nhập User/Pass và bấm "Lưu Auth" trước!`)}return{user:c,pass:C,mac:o||p}},F=async(r,d,p,o)=>{var T;const u=p||le,c=o||E;if(!u)return;const C=((T=a.find(R=>R.id===d))==null?void 0:T.name)||"";if(await _e(r,"trigger_utility",{action:"query_camera_video",camera_name:C,timestamp:u,duration:c})){b("Đang chờ video...","info");return}te(!0),xe("");try{if((await(await fetch(`${_i}/api/agents/${r}/cameras/${d}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:u,duration:c})})).json()).ok){const ie=u.replace(/[- :]/g,""),l=ie.substring(0,8)+"_"+ie.substring(8,14);xe(`clip_${Q.camera_name}_${l}.mp4`)}else b("Truy xuất thất bại","error")}catch{b("Truy xuất thất bại","error")}finally{te(!1)}},D=r=>{const d=r.match(/_(\d{8}_\d{6})\.mp4$/);if(d){const p=d[1],o=`${p.substring(0,4)}-${p.substring(4,6)}-${p.substring(6,8)} ${p.substring(9,11)}:${p.substring(11,13)}:${p.substring(13,15)}`;ve(o),Te(60),F(s,Q.id,o,60),setTimeout(()=>{var u;(u=document.getElementById("video-playback-card"))==null||u.scrollIntoView({behavior:"smooth",block:"center"})},100)}else b("Không parse được thời gian từ tên tệp","error")},oe=(r,d)=>{var R;const p=(X||[]).flatMap(M=>M.printers||[]),o=typeof r=="object"&&r!==null?r:St(p,r),u=((o==null?void 0:o.mac_address)||(o==null?void 0:o.mac_id)||(typeof r=="string"&&(r.includes(":")||r.includes("-"))?r:"")).toUpperCase().replace(/-/g,":"),c=((o==null?void 0:o.ip)||(o==null?void 0:o.printer_ip)||(typeof r=="string"&&r.includes(".")?r:"")).trim();if(!c||c==="0.0.0.0"){b(`Không tìm thấy IP hợp lệ của máy in (${u||(typeof r=="string"?r:"")})!`,"error");return}const C=(m==null?void 0:m.public_ip)||(m==null?void 0:m.wan_ip),k=(R=((m==null?void 0:m.agents)||[]).find(M=>M.is_agent_active&&(M.public_ip&&M.public_ip===C||M.wan_ip&&M.wan_ip===C)))==null?void 0:R.agent_uid,T=K(u||(typeof r=="string"?r:""))||(o==null?void 0:o.agent_uid)||k||"";O({isOpen:!0,printerId:u||(typeof r=="string"?r:(o==null?void 0:o.id)||""),printerObj:o,entry:d,agentUid:T})},w=async()=>{var M;const{printerId:r,printerObj:d,entry:p,agentUid:o}=f;if(!p)return;O(ie=>({...ie,isOpen:!1}));const u=p.email_address||p.email||"",c=p.physical_path||p.folder||p.folder_path||"",C=(u||c||"").trim(),k=String(p.registration_no&&p.registration_no!=="-"?p.registration_no:p.entry_id||"").trim(),R=((m==null?void 0:m.emails)||[]).find(ie=>ie.email.toLowerCase().trim()===C.toLowerCase().trim());if(R&&R.id){b("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const ie=await Yn(R.id);if(ie.ok)b("Đã xóa thành công!","success"),await N();else throw new Error(ie.error||"Không thể xóa")}catch(ie){b(`Lỗi xóa: ${ie.message}`,"error")}return}b("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const ie=(X||[]).flatMap(B=>B.printers||[]),l=d||St(ie,r),Y=((l==null?void 0:l.mac_address)||(l==null?void 0:l.mac_id)||(r.includes(":")||r.includes("-")?r:"")).toUpperCase().replace(/-/g,":"),z=((l==null?void 0:l.ip)||(l==null?void 0:l.printer_ip)||(r.includes(".")?r:"")).trim();if(!z||z==="0.0.0.0"){b(`Không tìm thấy IP hợp lệ của máy in ${Y||r}!`,"error");return}const pe=((l==null?void 0:l.printer_type)||(l==null?void 0:l.printer_name)||(l==null?void 0:l.brand)||"").toLowerCase().includes("toshiba")||Y.startsWith("00:80:91"),me=pe?"toshiba_delete_scan":"ricoh_delete_scan",Ke=(q||[]).find(B=>B.command===me),tt=(m==null?void 0:m.public_ip)||(m==null?void 0:m.wan_ip),rt=(M=((m==null?void 0:m.agents)||[]).find(B=>B.is_agent_active&&(B.public_ip&&B.public_ip===tt||B.wan_ip&&B.wan_ip===tt)))==null?void 0:M.agent_uid,I=o||K(Y||r)||(l==null?void 0:l.agent_uid)||rt||"";let ne;if(I){let B=Ke;if(!B)try{B=(await zr(I)||[]).find(Ge=>Ge.command===me)}catch{}const{user:G,pass:W}=await H(l||{mac_address:Y,ip:z});if(!G){b(`Chưa có tài khoản Web Admin của máy in ${Y||z}!`,"error");return}const Ie=String((p==null?void 0:p.entry_id)||(p==null?void 0:p.id)||k||"").trim();if(!Ie||Ie==="null"){b("Không xác định được ID mục danh bạ cần xóa!","error");return}let be=(B==null?void 0:B.command_content)||hi[me]||"";if(!be){b(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${me}' trên hệ thống VPS!`,"error");return}be=be.replace(/__TARGET_IP__/g,z),be=be.replace(/__TARGET_USER__/g,G),be=be.replace(/__TARGET_PASS__/g,W||""),be=be.replace(/__TARGET_ID__/g,Ie),be=be.replace(/__TARGET_SCAN_USER__/g,(p==null?void 0:p.name)||""),ne=await ot(I,me,be,{printer_ip:z,ip:z,mac_id:Y,mac_address:Y,auth_user:G,auth_password:W,target_id:Ie,entry_id:Ie,registration_no:k})}else ne=await ri(Y||z||r,k,p.entry_id||"",o||void 0,{printer_ip:z,ip:z,mac_id:Y,mac_address:Y});if(!ne.ok||!ne.command_id)throw new Error(ne.error||"Không thể tạo lệnh xóa");U(ne.command_id,Y||z||r,async B=>{b("Xóa điểm scan thành công","success"),console.log("Finish delete scan point, updating address book state directly",B);const G=(l==null?void 0:l.mac_address)||(l==null?void 0:l.mac_id)||Y,W=G?String(G).toUpperCase().replace(/-/g,":"):Y,Ie=l!=null&&l.id?String(l.id):String(r),be=z;let je=(B==null?void 0:B.address_book_sync)||(B==null?void 0:B.address_book_data);if(!je&&(B!=null&&B.result||B!=null&&B.result_payload)){const Fe=String(B.result||B.result_payload||"").trim();if(Fe.includes("__ADDRESS_BOOK_JSON_START__"))try{let $e=Fe.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();$e=$e.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),je=JSON.parse($e)}catch{}else if(Fe.startsWith("{")&&Fe.includes('"address_list"'))try{je=JSON.parse(Fe)}catch{}}je&&typeof Z=="function"&&Z(Fe=>{const $e={...Fe};return W&&($e[W]=je),Ie&&($e[Ie]=je),be&&($e[be]=je),$e});const Ge={...l||{},id:r,ip:z,printer_ip:z,mac_address:Y,mac_id:Y,printer_name:(l==null?void 0:l.printer_name)||(l==null?void 0:l.name)||"Photocopy",printer_type:pe?"toshiba":"ricoh",brand:pe?"toshiba":"ricoh",agent_uid:I||(l==null?void 0:l.agent_uid)||o||s||""};de(Ge)},B=>{b(`Xóa điểm scan thất bại: ${B||"Agent không phản hồi"}`,"error")},"⏳ Xóa điểm scan...")}catch(ie){b(`Xóa điểm scan thất bại: ${ie.message||"Lỗi không xác định"}`,"error")}},S=(r,d)=>{const p=(X||[]).flatMap(M=>M.printers||[]),o=typeof r=="object"&&r!==null?r:St(p,r),u=d.folder||d.physical_path||d.folder_path||"";let c="",C="2130";const k=u.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),T=u.match(/^\\\\([^\\]+)(.*)$/);if(k)c=k[1],C=k[2]||"2130";else if(T)c=T[1],C="";else{const M=u.match(/^([^:/]+)(?::(\d+))?(.*)$/);M&&!u.startsWith("\\\\")&&(c=M[1],C=M[2]||"2130")}const R=c?C?`${c}:${C}`:c:"192.168.1.100:2130";j({printerId:(o==null?void 0:o.mac_address)||(o==null?void 0:o.mac_id)||(typeof r=="string"?r:(o==null?void 0:o.id)||""),printerObj:o,entry:d,currentIp:c,newIp:R,newPort:C||"2130"}),A("edit_ip")},se=async()=>{if(!P)return;const{printerId:r,printerObj:d,entry:p,newIp:o,newPort:u}=P,c=p.folder||p.physical_path||p.folder_path||"",C=c.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),k=c.match(/^\\\\([^\\]+)(.*)$/);let T=o.trim();if((u||"2130").trim(),T.includes(":")){const ie=T.split(":");T=ie[0].trim(),ie[1].trim()}if(C)C[3];else if(k)k[2];else{const ie=c.match(/^([^:/]+)(?::(\d+))?(.*)$/);ie&&!c.startsWith("\\\\")&&ie[3]}const R=p.registration_no;A(null),b("Đổi IP điểm scan...","info",2e3);let M="";if(C)M=C[1];else if(k)M=k[1];else{const ie=c.match(/^([^:/]+)/);ie&&!c.startsWith("\\\\")&&(M=ie[1])}M||(M=T);try{const ie=(X||[]).flatMap(W=>W.printers||[]),l=d||St(ie,r)||St((m==null?void 0:m.printers)||[],r),Y=(l==null?void 0:l.mac_address)||(l==null?void 0:l.mac_id)||(r.includes(":")?r:""),z=Y?String(Y).toUpperCase().replace(/-/g,":"):"",pe=((l==null?void 0:l.ip)||(l==null?void 0:l.printer_ip)||(r.includes(".")?r:"")).trim();if(!pe||pe==="0.0.0.0")throw new Error(`Thiếu IP máy in hợp lệ cho ${z||r}!`);const me=K(z||r)||(l==null?void 0:l.agent_uid)||"",Ke=z&&g[z]||g[r]||{},tt=Ke.user||(l==null?void 0:l.auth_user)||(l==null?void 0:l.username),rt=Ke.pass||(l==null?void 0:l.auth_password)||(l==null?void 0:l.password)||"";if(!tt)throw new Error(`Chưa có tài khoản Web Admin của máy in ${z||pe}`);const B=String((l==null?void 0:l.printer_type)||(l==null?void 0:l.type)||(l==null?void 0:l.brand)||"").toLowerCase().includes("toshiba")||z.startsWith("00:80:91")?"toshiba_change_ftp":"ricoh_change_ftp",G=await ot(me,B,"",{printer_ip:pe,ip:pe,mac_id:z,mac_address:z,auth_user:tt,auth_password:rt,target_id:R,target_name:p.name,old_ip:M,new_ip:T});if(!G.ok||!G.command_id)throw new Error(G.error||"Lỗi đổi IP");U(G.command_id,z||r,async W=>{b("Đổi IP điểm scan","success");const Ie=(l==null?void 0:l.mac_address)||(l==null?void 0:l.mac_id)||r,be=Ie?String(Ie).toUpperCase().replace(/-/g,":"):"";let je=(W==null?void 0:W.address_book_sync)||(W==null?void 0:W.address_book_data);if(!je&&(W!=null&&W.result||W!=null&&W.result_payload)){const Ge=String(W.result||W.result_payload||"");if(Ge.includes("__ADDRESS_BOOK_JSON_START__"))try{let Fe=Ge.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();Fe=Fe.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),je=JSON.parse(Fe)}catch{}}be&&je&&typeof Z=="function"&&Z(Ge=>({...Ge,[be]:je})),de&&de(l||r)},W=>{b("Đổi IP thất bại","error")},"⏳ Đổi IP điểm scan...")}catch(ie){b(`Đổi IP thất bại: ${ie.message||""}`,"error")}},ae=async(r,d)=>{Se({lanUid:r,email:d}),re(!0),ce([]),A("storage");try{const p=await Br(r,d);if(p.ok)ce(p.rows||[]);else throw new Error(p.error||"Lỗi server")}catch(p){b(`Không thể lấy tệp đã scan: ${p.message}`,"error")}finally{re(!1)}},ue=(r,d,p,o,u,c,C,k)=>{let T=o,R=u,M=d,ie=p;const l=c&&Array.isArray(c)?c:[];if((!R||!T)&&l.length>0){const me=l[0];me&&me.drivers&&me.drivers.length>0&&(T=me.drivers[0].name,R=me.drivers[0].url,M=me.brand||d,ie=me.model||p)}const Y=((m==null?void 0:m.agents)||[]).filter(me=>me.is_agent_active),z=K(r);let pe=[];z&&Y.some(me=>me.agent_uid===z)?pe=[z]:Y.length>0&&(pe=Y.map(me=>me.agent_uid)),ee({isOpen:!0,printerId:r,printerIp:C||(r.includes(".")?r:""),macId:k||(r.includes(":")?r:""),brand:M,model:ie,driverName:T,driverUrl:R,suggestedDrivers:l,selectedAgentUids:pe})},he=r=>{if(r===0)return"0 Bytes";const d=1024,p=["Bytes","KB","MB","GB"],o=Math.floor(Math.log(r)/Math.log(d));return parseFloat((r/Math.pow(d,o)).toFixed(1))+" "+p[o]},de=async(r,d)=>{const p=(X||[]).flatMap(R=>R.printers||[]),o=typeof r=="object"&&r!==null?r:St(p,r);let u=((o==null?void 0:o.mac_address)||(o==null?void 0:o.mac_id)||(typeof r=="string"&&(r.includes(":")||r.includes("-"))?r:"")).toUpperCase().replace(/-/g,":"),c=((o==null?void 0:o.ip)||(o==null?void 0:o.printer_ip)||(typeof r=="string"&&r.includes(".")?r:"")).trim(),C=(o==null?void 0:o.printer_name)||(o==null?void 0:o.name)||"",k=String((o==null?void 0:o.id)||(typeof r=="string"?r:u||c));if((!c||!u)&&k){const R=St(p,k);R&&(u||(u=(R.mac_address||R.mac_id||"").toUpperCase().replace(/-/g,":")),c||(c=(R.ip||R.printer_ip||"").trim()),C||(C=R.printer_name||R.name||""))}if(!c||c==="0.0.0.0"){const R=`❌ Không thể đọc danh bạ: Không tìm thấy IP hợp lệ cho máy in (${u||k})!`;b&&b(R,"error"),console.error(R,{printerTarget:r,printerObj:o,pMacNorm:u,pIp:c});return}const T=d||(o==null?void 0:o.agent_uid)||(o!=null&&o.id&&K?K(o.id):"")||(K?K(u||k):"")||agentUid||s||"";b&&b("Đọc danh bạ...","info",2e3),typeof Z=="function"&&Z(R=>{const M={...R};return k&&delete M[k],u&&delete M[u],c&&delete M[c],M}),t.setCommandStatus&&t.setCommandStatus(R=>{const M={...R};return k&&delete M[k],u&&delete M[u],c&&delete M[c],M}),u&&Jn(u).catch(R=>console.warn("[handleRefetchAddressBook] clearScanPoint error (non-fatal):",R));try{const{user:R,pass:M}=await H(o||{ip:c,mac_address:u}),ie={auth_user:R,auth_password:M,printer_ip:c,ip:c,mac_id:u,mac_address:u};C&&(ie.printer_name=C,ie.name=C),(o!=null&&o.printer_type||o!=null&&o.brand)&&(ie.printer_type=o.printer_type||o.brand,ie.brand=o.printer_type||o.brand);const l=await Kn(u||c||k,T||void 0,ie);if(!l.ok||!l.command_id)throw new Error(l.error||"Không thể tạo lệnh đọc danh bạ");U&&U(l.command_id,u||c||k,async Y=>{let z=(Y==null?void 0:Y.address_book_sync)||(Y==null?void 0:Y.address_book_data)||(Y==null?void 0:Y.result);if(!z&&typeof(Y==null?void 0:Y.result_payload)=="string"){const pe=Y.result_payload;if(pe.includes("__ADDRESS_BOOK_JSON_START__"))try{const me=pe.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();z=JSON.parse(me)}catch{}if(!z){const me=pe.match(/(\{\s*"status"[\s\S]*"address_list"[\s\S]*\})/);if(me)try{z=JSON.parse(me[1])}catch{}}}if(console.log("=================================================="),console.log(`[FRONTEND] KẾT QUẢ ĐỒNG BỘ DANH BẠ MÁY IN (Command ID #${l.command_id}):`,Y),console.log(`[FRONTEND] CHI TIẾT DANH BẠ (Count: ${(z==null?void 0:z.count)||0}):`,(z==null?void 0:z.address_list)||z),console.log("=================================================="),(z==null?void 0:z.status)==="error"){b&&b("Đọc danh bạ thất bại","error");return}b&&b("Đọc danh bạ","success"),z&&(Z&&Z(pe=>{const me={...pe};return k&&(me[k]=z),u&&(me[u]=z),c&&(me[c]=z),me}),u&&Ee("/api/scan-points/save",{method:"POST",body:JSON.stringify({mac_id:u,printer_name:C||"Photocopy",ip:c,agent_uid:T||agentUid||s||"",address_book_data:z})}).catch(pe=>console.error("Failed to post scan points to VPS DB:",pe)),t.setCommandStatus&&t.setCommandStatus(pe=>({...pe,[k]:{...pe[k]||{},address_book_sync:z,isPending:!1},...u?{[u]:{...pe[u]||{},address_book_sync:z,isPending:!1}}:{}})))},Y=>{console.error(`[FRONTEND LỖI ĐỒNG BỘ DANH BẠ] Command ID #${l.command_id}:`,Y),b&&b(`Lỗi đọc danh bạ: ${Y}`,"error")},"⌛ Agent đang đọc danh bạ máy in...")}catch(R){b&&b(`Lỗi gửi lệnh đọc danh bạ: ${R.message}`,"error")}},J=async()=>{const{printerId:r,printerObj:d,name:p,email:o,agentUid:u}=t.publicFtpData||{};if(!p||!p.trim()){b&&b("Vui lòng nhập tên điểm scan","error");return}t.setPublicFtpLoading&&t.setPublicFtpLoading(!0);try{const c=(X||[]).flatMap(Y=>Y.printers||[]),C=d||St(c,r),k=((C==null?void 0:C.mac_address)||(C==null?void 0:C.mac_id)||(r&&r.includes(":")?r:"")).toUpperCase().replace(/-/g,":"),T=((C==null?void 0:C.ip)||(C==null?void 0:C.printer_ip)||(r&&r.includes(".")?r:"")).trim();if(!T||T==="0.0.0.0")throw new Error(`Thiếu IP máy in hợp lệ cho ${k||r}!`);const{user:R,pass:M}=await H(C||{mac_address:k,ip:T}),ie={mac_address:k,mac_id:k,printer_ip:T,ip:T,auth_user:R,auth_password:M},l=await qn(k||r,p.trim(),o,u||void 0,ie);if(t.setPublicFtpLoading&&t.setPublicFtpLoading(!1),A&&A(null),!l.ok||!l.command_id)throw new Error(l.error||"Lỗi gửi lệnh");U&&U(l.command_id,k||r,async Y=>{b&&b("Tạo điểm scan","success"),de(C||r),N&&await N()},Y=>{b&&b("Tạo điểm scan thất bại","error")},"⏳ Tạo điểm scan...")}catch(c){t.setPublicFtpLoading&&t.setPublicFtpLoading(!1),b&&b(`Tạo điểm scan thất bại: ${c.message||""}`,"error")}},h=async()=>{const{lanUid:r,agentUid:d,email:p}=t.privateFtpData||{};if(!p||!p.includes("@")){b&&b("Email không hợp lệ","error");return}t.setPrivateFtpLoading&&t.setPrivateFtpLoading(!0);try{const o=await Xn("default",r,d,p);if(t.setPrivateFtpLoading&&t.setPrivateFtpLoading(!1),A&&A(null),o.ok)b&&b("Thêm Private FTP","success"),N&&await N();else throw new Error(o.error||"Lỗi server")}catch{t.setPrivateFtpLoading&&t.setPrivateFtpLoading(!1),b&&b("Thêm Private FTP thất bại","error")}},x=async()=>{if(!s){b&&b("Chưa chọn Agent","error");return}b&&b("Khởi động lại Agent...","info",2e3);try{const r=await ti(s);if(r.ok)b&&b("Khởi động lại Agent","success"),A&&A(null);else throw new Error(r.error||"Thất bại")}catch{b&&b("Khởi động lại thất bại","error")}},_=y.useCallback(r=>Mr(r,(m==null?void 0:m.emails)||[],(m==null?void 0:m.agents)||[]),[m]);return{formatBytes:he,getDestinationStatus:_,getDestinationStatusHtml:Mr,handleAddPrivateFtp:h,handleAddPublicFtp:J,handleConfirmDeleteScanPoint:w,handleDeleteDest:oe,handleEditIP:S,handleEmergencyRestart:x,handleOpenStorageFiles:ae,handlePlaySegmentFile:D,handleQueryVideo:F,handleRefetchAddressBook:de,handleRemoteInstallDriver:ue,handleSaveEditIP:se}};function yi({showToast:t,replaceToast:s}={}){const a=y.useCallback((f,P="info")=>{if(typeof s=="function")try{s("driver-install-progress",f,P);return}catch{}typeof t=="function"&&t(f,P,5e3)},[t,s]);return{executeRemoteInstallDriver:y.useCallback(async(f,P,N,K,_e,X,U,E)=>{a("Cài driver...","info");try{const le=await Gr(f,P,N,K,_e,X,U,E);if(!le.ok)throw new Error(le.error||"Lỗi server");const $=le.command_id;if(!$){a("Cài driver","success");return}const v=3e5,Q=2e3,m=Date.now();let A="";const O=setInterval(async()=>{try{const j=Date.now()-m;if(j>v){clearInterval(O),a("Cài driver: Hết giờ","info");return}const ee=await Nt($);if(ee.status==="success")clearInterval(O),a("Cài driver","success");else if(ee.status==="failed"||!ee.ok)clearInterval(O),a(`Cài driver thất bại: ${ee.error||"Lỗi"}`,"error");else{const Z=ee.progress_text||"";if(Z&&Z!==A)A=Z,a(Z,"info");else if(!Z){const xe=Math.round(j/1e3);a(`Cài driver (${xe}s)...`,"info")}}}catch{}},Q)}catch(le){a(`Cài driver thất bại: ${le.message||le}`,"error")}},[a])}}function bi(){const t=gi({}),s=fi(t),a=xi({...t,...s}),g=yi({showToast:t.showToast,replaceToast:t.replaceToast});return{...t,...s,...a,...g}}function Ci(){var oe;const t=bi(),{toasts:s=[],setToasts:a,showToast:g,pollCommandStatus:f,lanSitesLoading:P,setLanSites:N,selectedPublicIp:K,setSelectedPublicIp:_e,targetInternalIp:X,setTargetInternalIp:U,setSelectedLanUid:E,activeTab:le,setActiveTab:$,selectedLan:v,triggerLanScan:Q,filteredPrinters:m,fetchLanSitesData:A,myClientIp:O}=t,[j,ee]=y.useState(()=>K||""),Z=y.useRef(null),xe=y.useRef(null),[Te,ve]=y.useState(230),[te,ce]=y.useState(()=>!!X),[re,Se]=y.useState(()=>X||""),b=y.useRef(null);y.useEffect(()=>{const w=xe.current;if(!w)return;const S=()=>{xe.current&&ve(xe.current.offsetHeight)};S();const se=new ResizeObserver(S);return se.observe(w),window.addEventListener("resize",S),()=>{se.disconnect(),window.removeEventListener("resize",S)}},[te]),y.useEffect(()=>{ee(K||"")},[K]),y.useEffect(()=>{Se(X||""),X&&ce(!0)},[X]);const q=async w=>{const S="".trim();U&&U(S),S?(localStorage.setItem("goxprint_target_internal_ip",S),g&&g(`🔍 Đang lọc hiển thị máy photo IP: ${S}`,"info",3e3)):localStorage.removeItem("goxprint_target_internal_ip"),A&&await A(!0)},H=async w=>{const S=(w||"").trim();if(!S){g&&g("Vui lòng nhập địa chỉ IP nội bộ máy in (VD: 192.168.1.155)","warning");return}U&&U(S),localStorage.setItem("goxprint_target_internal_ip",S),N&&v&&N(de=>de.map(J=>J.lan_uid===v.lan_uid||J.public_ip===v.public_ip?{...J,printers:(J.printers||[]).filter(h=>(h.ip||"").trim()===S||(h.printer_ip||"").trim()===S)}:J));const se=((v==null?void 0:v.agents)||[]).filter(de=>de.is_agent_active);if(se.length===0){g&&g(`⚠️ Đã làm sạch dữ liệu cũ & cài đặt IP ${S}, nhưng không có Agent nào đang online trong mạng LAN này để gửi lệnh probing trực tiếp!`,"warning",5e3),A&&await A(!0),$("copiers");return}const ue=se[0].agent_uid;g&&g(`⚡ Đã làm sạch dữ liệu cũ. Đang gửi lệnh probe trực tiếp IP ${S} tới Agent (${ue})...`,"info",6e3);const he=`import sys, os, socket, subprocess, re, json

target_ip = "${S}".strip()
print(f"=== PROBING SINGLE PRINTER DIRECTLY: {target_ip} ===")

if not target_ip or target_ip == "__TARGET_IP__":
    print("Error: Target IP not specified")
    sys.exit(1)

def check_tcp(ip, port, timeout=1.5):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        res = s.connect_ex((ip, port))
        s.close()
        return res == 0
    except Exception:
        return False

open_ports = []
for p in [80, 443, 9100, 161, 515, 631]:
    if check_tcp(target_ip, p):
        open_ports.append(p)

print(f"Target IP {target_ip} open ports: {open_ports}")

mac_address = ""
try:
    arp_out = subprocess.getoutput(f"arp -a {target_ip}")
    mac_match = re.search(r"([0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0-9a-fA-F]{2})", arp_out)
    if mac_match:
        mac_address = mac_match.group(1).upper().replace('-', ':')
except Exception as e:
    print(f"ARP lookup error: {e}")

print(f"MAC Address: {mac_address or 'Unknown'}")

printer_name = f"Printer ({target_ip})"
printer_type = "generic"

try:
    import urllib.request
    url = f"http://{target_ip}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=3) as resp:
        html = resp.read().decode('utf-8', errors='ignore').lower()
        if "ricoh" in html:
            printer_type = "ricoh"
            printer_name = f"Ricoh Photocopy ({target_ip})"
        elif "toshiba" in html:
            printer_type = "toshiba"
            printer_name = f"Toshiba Photocopy ({target_ip})"
        elif "fuji" in html or "xerox" in html:
            printer_type = "fujifilm"
            printer_name = f"Fuji Xerox ({target_ip})"
        elif "canon" in html:
            printer_type = "canon"
            printer_name = f"Canon Printer ({target_ip})"
        elif "epson" in html:
            printer_type = "epson"
            printer_name = f"Epson Printer ({target_ip})"
        elif "hp" in html or "hewlett" in html:
            printer_type = "hp"
            printer_name = f"HP Printer ({target_ip})"
except Exception as http_err:
    print(f"HTTP probe note: {http_err}")

printer_info = {
    "ip": target_ip,
    "mac_address": mac_address,
    "mac_id": mac_address,
    "printer_name": printer_name,
    "printer_type": printer_type,
    "open_ports": open_ports,
    "is_online": len(open_ports) > 0 or bool(mac_address)
}

print("__PRINTER_INFO_JSON_START__")
print(json.dumps(printer_info))
print("__PRINTER_INFO_JSON_END__")
`;try{const de=await ot(ue,"probe_single_printer",he,{target_ip:S,printer_ip:S});if(!de||!de.ok||!de.command_id){g&&g(`❌ Không thể gửi lệnh probe: ${(de==null?void 0:de.error)||"Lỗi không xác định"}`,"error");return}f&&f(de.command_id,`probe_single_${S}`,async J=>{g&&g(`✓ Probe trực tiếp IP ${S} hoàn tất!`,"success",4e3);try{const h=(J==null?void 0:J.result)||(J==null?void 0:J.result_payload)||(J==null?void 0:J.output)||"";if(h&&typeof h=="string"){let x="";if(h.includes("__PRINTER_INFO_JSON_START__")){const _=h.match(/__PRINTER_INFO_JSON_START__([\s\S]*?)__PRINTER_INFO_JSON_END__/);_&&(x=_[1].trim())}if(x){const _=JSON.parse(x);_&&_.ip&&await Ee("/api/new-devices",{method:"POST",body:JSON.stringify({lan_uid:(v==null?void 0:v.lan_uid)||"default",devices:[_]})})}}}catch(h){console.error("Lỗi parse printer info từ probe result:",h)}A&&await A(!0)},J=>{const h=typeof J=="object"?(J==null?void 0:J.error)||(J==null?void 0:J.message):J;g&&g(`[-] Lỗi khi probe trực tiếp IP ${S}: ${h}`,"error")},`⏳ Agent (${ue}) đang kiểm tra & probe trực tiếp IP ${S}...`)}catch(de){g&&g(`❌ Lỗi kết nối gửi lệnh probe: ${de.message}`,"error")}$("copiers")},F=async w=>{const S=(w||"").trim();_e(S),localStorage.removeItem("goxprint_selected_lan_uid"),E&&E(""),S?(localStorage.setItem("goxprint_selected_public_ip",S),localStorage.setItem("gox_connect_public_ip",S)):(localStorage.removeItem("goxprint_selected_public_ip"),localStorage.removeItem("gox_connect_public_ip")),A&&await A(!0)},D=O?`IP Public máy này: ${O}`:"Nhập IP Public kết nối (VD: 116.98.0.59)...";return e.jsxs(Ve.div,{style:n.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:n.toastContainer,children:e.jsx(et,{children:s.map(w=>{const S=w.type==="success",se=w.type==="error",ae=w.type==="warning",ue=S?"var(--color-success, #10b981)":se?"var(--color-error, #ef4444)":ae?"var(--color-warning, #f59e0b)":"var(--color-text-secondary, #94a3b8)",he=S?"rgba(16, 185, 129, 0.4)":se?"rgba(239, 68, 68, 0.4)":ae?"rgba(245, 158, 11, 0.4)":"rgba(255, 255, 255, 0.15)",de=S?"✔":se?"✖":ae?"⚠":"⏳";return e.jsxs(Ve.div,{style:{...n.toast,cursor:"pointer",border:`1px solid ${he}`,color:ue},initial:{opacity:0,x:15,scale:.95},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:15,scale:.95},transition:{duration:.15},onClick:()=>{a&&a(J=>J.filter(h=>h.id!==w.id))},children:[e.jsx("span",{style:{fontSize:"0.75rem",lineHeight:1},children:de}),e.jsx("span",{children:w.message})]},w.id)})})}),e.jsxs("div",{ref:xe,style:n.fixedHeader,children:[e.jsx("div",{style:n.header,children:e.jsx("h1",{style:n.title,children:"🛠️ Quản lý Mạng LAN"})}),e.jsxs("div",{style:n.filterBar,children:[e.jsx("label",{style:n.filterLabel,children:"🌐 IP Public LAN:"}),e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"8px",flex:1,maxWidth:"420px"},children:e.jsxs("div",{style:{position:"relative",flex:1,display:"flex",alignItems:"center"},children:[e.jsx("input",{ref:Z,type:"text",value:j,onChange:w=>ee(w.target.value),onKeyDown:w=>{w.key==="Enter"&&F(j)},placeholder:D,style:{width:"100%",padding:te?K||j?"8px 40px 8px 12px":"8px 12px 8px 12px":K||j?"8px 74px 8px 12px":"8px 42px 8px 12px",fontSize:"0.88rem",borderRadius:"8px",border:"1px solid rgba(255, 255, 255, 0.2)",background:"rgba(0, 0, 0, 0.4)",color:"#fff",outline:"none",boxSizing:"border-box",transition:"padding 0.2s"}}),(K||j)&&e.jsx("button",{onClick:()=>{var w;ee(""),F(""),(w=Z.current)==null||w.focus()},title:"Xóa IP Public",style:{position:"absolute",right:te?"8px":"40px",background:"transparent",color:"#ef4444",border:"none",boxShadow:"none",width:"24px",height:"24px",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,transition:"all 0.2s"},children:"✕"}),!te&&e.jsx("button",{onClick:async()=>{j&&await F(j),v?Q(v,!0):A&&A(!0)},title:"Gửi & Kết nối IP Public (Enter)",style:{position:"absolute",right:"4px",background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(16, 185, 129, 0.3)"},children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 2L11 13"}),e.jsx("path",{d:"M22 2l-7 20-4-9-9-4 20-7z"})]})})]})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"10px",flexWrap:"wrap"},children:[e.jsx("input",{type:"checkbox",id:"enable-direct-ip-checkbox",checked:te,onChange:w=>{const S=w.target.checked;ce(S),localStorage.setItem("goxprint_direct_ip_mode",String(S)),S||(Se(""),q())},style:{cursor:"pointer",width:"16px",height:"16px",accentColor:"var(--color-primary)"}}),e.jsx("label",{htmlFor:"enable-direct-ip-checkbox",style:{fontSize:"0.8rem",color:"var(--color-text)",fontWeight:600,cursor:"pointer",userSelect:"none"},children:"Lựa chọn nhập trực tiếp IP nội bộ máy photo"})]}),te&&e.jsx("div",{style:{marginTop:"8px",display:"flex",flexDirection:"column",gap:"4px"},children:e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"8px",flex:1,maxWidth:"420px"},children:e.jsxs("div",{style:{position:"relative",flex:1,display:"flex",alignItems:"center"},children:[e.jsx("input",{ref:b,type:"text",value:re,onChange:w=>Se(w.target.value),onKeyDown:w=>{w.key==="Enter"&&H(re)},placeholder:"Nhập IP nội bộ photo (VD: 192.168.1.155)...",style:{width:"100%",padding:X||re?"8px 74px 8px 12px":"8px 42px 8px 12px",fontSize:"0.88rem",borderRadius:"8px",border:"1px solid rgba(59, 130, 246, 0.5)",background:"rgba(0, 0, 0, 0.4)",color:"#fff",outline:"none",boxSizing:"border-box",transition:"padding 0.2s"}}),(X||re)&&e.jsx("button",{onClick:()=>{var w;Se(""),q(),(w=b.current)==null||w.focus()},title:"Xóa IP nội bộ",style:{position:"absolute",right:"40px",background:"transparent",color:"#ef4444",border:"none",boxShadow:"none",width:"24px",height:"24px",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,transition:"all 0.2s"},children:"✕"}),e.jsx("button",{onClick:()=>{H(re)},title:"Gửi lệnh Probe trực tiếp IP nội bộ máy in này (Enter)",style:{position:"absolute",right:"4px",background:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",color:"white",border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(59, 130, 246, 0.3)"},children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 2L11 13"}),e.jsx("path",{d:"M22 2l-7 20-4-9-9-4 20-7z"})]})})]})})})]}),e.jsxs("div",{style:n.tabBar,children:[e.jsxs("button",{style:{...n.tabBtn,color:le==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:le==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>$("agents"),children:["💻 Máy tính (",((oe=v==null?void 0:v.agents)==null?void 0:oe.filter(w=>w.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...n.tabBtn,color:le==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:le==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{$("copiers")},children:["🖨️ Photocopy (",m.length,")"]})]})]}),e.jsxs("div",{style:{...n.scrollableContent,marginTop:`${Te+12}px`},children:[P&&e.jsx("div",{style:n.loadingWrapper,children:e.jsx(lt,{size:"md"})}),!P&&v&&e.jsxs(et,{mode:"wait",children:[le==="agents"&&e.jsx(oi,{...t}),le==="copiers"&&e.jsx(ii,{...t})]})]}),e.jsx(ci,{...t})]})}export{Ci as AgentPage,Ci as default};
