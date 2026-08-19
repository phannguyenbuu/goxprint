import{j as e,R as Zr,A as jt,m as rt,L as vt,r as d}from"./index-BOnte67t.js";import{A as Sn}from"./AnimatedList-D8rC4ZJC.js";import{G as sr}from"./GlowCard-kVu2ooIB.js";import{f as Cn,t as $t,a as or,b as kn,c as jn,u as An,d as In,e as Pn,h as wn,i as Tn,g as En,s as Rn,j as Ln,k as Dn,l as Nn,m as Mn,n as On,o as Fn}from"./mockAgentApi-BaIg3CQd.js";const r={container:{minHeight:"100vh",paddingBottom:"100px",display:"flex",flexDirection:"column",maxWidth:"428px",marginLeft:"auto",marginRight:"auto",boxSizing:"border-box",position:"relative"},fixedHeader:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"428px",background:"var(--color-bg)",zIndex:100,padding:"16px 14px 8px 14px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"10px",borderBottom:"1px solid var(--color-surface-light)"},scrollableContent:{marginTop:"176px",padding:"12px 14px",display:"flex",flexDirection:"column",gap:"12px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center"},title:{fontSize:"1.25rem",fontWeight:700,color:"var(--color-primary)",margin:0},filterBar:{display:"flex",flexDirection:"column",gap:"4px",padding:"10px 12px",borderRadius:"10px",background:"color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",border:"1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"},filterLabel:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.5px"},lanSelect:{fontSize:"0.82rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",cursor:"pointer",width:"100%"},tabBar:{display:"flex",borderBottom:"1px solid var(--color-surface-light)"},tabBtn:{flex:1,padding:"10px 4px",fontSize:"0.82rem",fontWeight:700,textAlign:"center",background:"none",border:"none",cursor:"pointer",transition:"color var(--anim-fast)"},tabContent:{display:"flex",flexDirection:"column",gap:"12px"},loadingWrapper:{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0"},emptyText:{textAlign:"center",color:"var(--color-text-secondary)",fontSize:"0.8rem",padding:"24px 0",fontStyle:"italic"},cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},cardTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-text)"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},cardDetails:{display:"flex",flexDirection:"column",gap:"4px",background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},detailRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.78rem"},detailLabel:{color:"var(--color-text-secondary)",fontWeight:500},detailValue:{color:"var(--color-text)",fontWeight:600,textAlign:"right"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"},modalCard:{backgroundColor:"var(--color-surface)",borderTop:"1px solid var(--color-surface-light)",borderTopLeftRadius:"16px",borderTopRightRadius:"16px",width:"100%",maxWidth:"428px",maxHeight:"82vh",display:"flex",flexDirection:"column",padding:"16px",boxSizing:"border-box",boxShadow:"0 -4px 24px rgba(0,0,0,0.3)"},modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"},modalTitle:{fontSize:"0.95rem",fontWeight:700,color:"var(--color-text)",margin:0},modalSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:"2px",wordBreak:"break-all"},modalCloseBtn:{fontSize:"1.5rem",lineHeight:1,cursor:"pointer",color:"var(--color-text-secondary)",background:"none",border:"none",padding:"0 4px"},modalBody:{flex:1,overflowY:"auto",marginBottom:"12px"},modalLoading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0"},modalFooter:{display:"flex",gap:"8px",justifyContent:"flex-end"},formGroup:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"12px"},formHelpText:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},modalInput:{fontSize:"0.85rem",padding:"8px 10px",background:"var(--color-bg)",color:"var(--color-text)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",width:"100%"},filesList:{display:"flex",flexDirection:"column",gap:"8px"},fileItemRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--color-inset-bg)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",gap:"8px"},fileLinkName:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-primary)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"},fileMetaDetails:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"2px"},fileUploadMeta:{fontSize:"0.65rem",color:"var(--color-secondary)",marginTop:"1px",fontWeight:500},fileDownloadBtn:{fontSize:"0.72rem",fontWeight:700,color:"var(--color-primary)",padding:"5px 10px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},modalDetailsList:{display:"flex",flexDirection:"column",gap:"6px",padding:"10px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},toastContainer:{position:"fixed",top:"12px",left:"12px",right:"12px",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",maxWidth:"404px",marginLeft:"auto",marginRight:"auto",pointerEvents:"none"},toast:{background:"rgba(18, 18, 26, 0.95)",backdropFilter:"blur(10px)",borderRadius:"8px",padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:"10px",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",pointerEvents:"auto"},toastIcon:{fontSize:"0.9rem",flexShrink:0},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"},confirmOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.85)",zIndex:160,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},confirmModalCard:{backgroundColor:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",width:"90%",maxWidth:"360px",padding:"16px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",margin:"auto"}},le={cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",gap:"8px"},copierTitle:{fontSize:"0.9rem",fontWeight:700,color:"var(--color-primary)",display:"block"},copierSubtitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px",fontFamily:"monospace"},statusBadge:{fontSize:"0.65rem",fontWeight:700,padding:"1px 6px",borderRadius:"4px",border:"1px solid",flexShrink:0},sectionBlock:{marginTop:"8px",padding:"8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},sectionBlockTitle:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"6px"},credsInputRow:{display:"flex",gap:"6px"},credsInput:{fontSize:"0.8rem",padding:"6px 8px",background:"var(--color-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",flex:1,minWidth:0},syncStatusBox:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",border:"1px solid",marginTop:"8px",gap:"8px"},syncStatusTitle:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontWeight:600,display:"block"},destinationsBlock:{marginTop:"10px",padding:"10px 8px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"8px"},destBlockTitle:{fontSize:"0.78rem",fontWeight:700,color:"var(--color-text-secondary)",borderBottom:"1px solid var(--color-surface-light)",paddingBottom:"4px"},destItemCard:{padding:"8px 10px",background:"var(--color-surface)",borderRadius:"6px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},expandSubBtn:{fontSize:"0.72rem",color:"var(--color-primary)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"block"},suggestedDriverBlock:{padding:"8px",background:"var(--color-inset-bg)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",display:"flex",flexDirection:"column",gap:"6px"},driverSuggestionItem:{background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden"},driverModelHeader:{padding:"6px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255,255,255,0.02)"},driverOptionsList:{padding:"6px",borderTop:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",gap:"4px"},driverFileRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",background:"var(--color-inset-bg)",borderRadius:"4px",gap:"6px"},driverFileName:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},driverFileUrl:{fontSize:"0.62rem",color:"var(--color-text-secondary)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},driverDownloadBtn:{fontSize:"0.7rem",fontWeight:700,color:"var(--color-primary)",padding:"4px 8px",borderRadius:"4px",background:"rgba(0, 212, 255, 0.08)",border:"1px solid rgba(0, 212, 255, 0.2)",whiteSpace:"nowrap"},emptySubText:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",textAlign:"center",padding:"8px 0"},smallBtn:{background:"transparent",color:"var(--color-primary)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 10px",fontSize:"0.75rem",fontWeight:500,cursor:"pointer",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}};function Un({hasAddressList:c,sync:W,p:F,commandStatus:R,getDestinationStatus:De,selectedLan:fe,handleOpenStorageFiles:be,handleDeleteDest:ue,handleChangeFtp:L,handleEditIP:je}){return e.jsxs("div",{style:le.destinationsBlock,children:[e.jsx("span",{style:le.destBlockTitle,children:"📂 Danh sách điểm scan:"}),c?W.address_list.filter(f=>{if(!f||typeof f!="object"||f.type==="Summary")return!1;const se=(f.name||"").trim();return se==="Summary"||se==="Total"||se.startsWith("Users:")?!1:!!(se||f.entry_id||f.registration_no&&f.registration_no!=="-"||f.email_address||f.email||f.folder||f.physical_path)}).map((f,se)=>{var Ie,ne;const Q=f.email_address||f.email||"",de=f.physical_path||f.folder||f.folder_path||"",N=(Q||de||"").trim();let xe="Folder";de.startsWith("ftp://")?xe="FTP":de.startsWith("\\\\")?xe="SMB":(Q||Q.includes("@"))&&(xe="Email"),De(f);const We=f.registration_no&&f.registration_no!=="-"?f.registration_no:f.entry_id||se+1,B=`${F.id}-${We}`,v=((Ie=R[B])==null?void 0:Ie.isPending)||!1;return(ne=R[B])!=null&&ne.message,e.jsxs("div",{style:{...le.destItemCard,flexDirection:"row",alignItems:"center",gap:"12px",flexWrap:"nowrap",overflow:"hidden"},children:[e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",fontWeight:600,minWidth:"max-content"},children:["#",We]}),e.jsxs("span",{style:{fontWeight:600,fontSize:"0.9rem",color:"var(--color-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,display:"inline-flex",alignItems:"center",gap:"4px"},children:[f.name,(f.warning||f.error)&&e.jsx("span",{style:{color:"#fbbf24",cursor:"help"},title:f.warning||f.error,children:"⚠️"})]}),typeof f.file_count=="number"&&e.jsxs("span",{onClick:()=>be(fe.lan_uid,N),style:{color:"var(--color-primary)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",textDecoration:"underline",display:"inline-flex",alignItems:"center",gap:"3px",whiteSpace:"nowrap"},title:"Xem danh sách tệp tin đã scan trên VPS",children:["📁 ",f.file_count," files"]}),f.entry_id&&e.jsxs("span",{style:{fontSize:"0.8rem",color:"var(--color-text-secondary)",whiteSpace:"nowrap"},children:["ID: ",e.jsx("strong",{children:f.entry_id})]}),L&&(xe==="FTP"||xe==="Folder")&&e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-primary)",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:"4px",cursor:v?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:v?.5:1,minWidth:"24px"},onClick:()=>je&&je(F.id,f),disabled:v,title:"Thay đổi FTP (Cập nhật IP)",children:"✏️"}),e.jsx("button",{style:{padding:"4px",fontSize:"0.9rem",color:"var(--color-error)",background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"4px",cursor:v?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",opacity:v?.5:1,minWidth:"24px"},onClick:()=>ue(F.id,f),disabled:v,title:"Xóa",children:"🗑️"})]},se)}):e.jsx("div",{style:le.emptySubText,children:W.status==="error"?"Không thể tải danh sách (Lỗi đồng bộ)":"Đang tải hoặc danh sách trống. Nhấn đồng bộ để lấy trực tiếp."})]})}function Bn({p:c,selectedLan:W,activeAgentUid:F,selectedAgentUid:R,copierCredentials:De,setCopierCredentials:fe,saveAuthLoading:be,handleSaveAuth:ue,isExpanded:L,handleCopierClick:je,onlineAgents:f,detectBrand:se,showToast:Q,fetchRemotePage:de,setRemoteLockPrinter:N,setActiveModal:xe,hasAddressList:We,sync:B,commandStatus:v,getDestinationStatus:Ie,handleOpenStorageFiles:ne,handleEditIP:ze,handleDeleteDest:pt,handleRefetchAddressBook:$e,expandedDrivers:mt,setExpandedDrivers:ve,expandedDriverMenus:Se,setExpandedDriverMenus:ce,handleRemoteInstallDriver:we,setPublicFtpData:Pe}){var U,Y,z,ge,V;const[J,Je]=Zr.useState(null),Ke=Zr.useRef(!1),Ve=Zr.useCallback(async()=>{try{const _=await Cn(`/api/lan-sites?t=${Date.now()}`);if(_&&_.ok&&Array.isArray(_.rows)){const T=(c.mac_id||c.mac_address||"").toUpperCase().replace(/-/g,":");for(const Z of _.rows)for(const M of Z.printers||[]){const b=(M.mac_id||M.mac_address||"").toUpperCase().replace(/-/g,":");T&&b&&T===b&&M.address_book_sync&&(M.address_book_sync.address_list||M.address_book_sync.result)&&Je(M.address_book_sync)}}}catch{}},[c.mac_id,c.mac_address]),Ee=((U=v[c.id])==null?void 0:U.isPending)||!1,Et=((Y=v[c.id])==null?void 0:Y.message)||"";Zr.useEffect(()=>{if(Ee&&Je(null),Ke.current&&!Ee){Ve();const _=setTimeout(Ve,1500),T=setTimeout(Ve,3500);return()=>{clearTimeout(_),clearTimeout(T)}}Ke.current=Ee},[Ee,Ve]);const G=J||B,At=c.drivers&&Object.keys(c.drivers).length>0,ut=mt[c.id],St=(()=>{var T,Z,M,b,y;if(Array.isArray(G==null?void 0:G.address_list)&&G.address_list.length>0)return G.address_list;if(G!=null&&G.address_book_data&&Array.isArray(G.address_book_data.address_list))return G.address_book_data.address_list;const _=[G,G==null?void 0:G.result,G==null?void 0:G.result_payload,G==null?void 0:G.raw,(T=v==null?void 0:v[c.id])==null?void 0:T.result,(Z=v==null?void 0:v[c.id])==null?void 0:Z.result_payload,(M=v==null?void 0:v[c.id])==null?void 0:M.address_list,(y=(b=v==null?void 0:v[c.id])==null?void 0:b.address_book_sync)==null?void 0:y.address_list];for(const ie of _)if(ie){if(Array.isArray(ie))return ie;if(typeof ie=="object"&&Array.isArray(ie.address_list))return ie.address_list;if(typeof ie=="string"){let Ae=ie.trim();if(Ae.includes("__ADDRESS_BOOK_JSON_START__"))try{Ae=Ae.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),Ae=Ae.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{const _e=JSON.parse(Ae);if(_e&&Array.isArray(_e.address_list))return _e.address_list;if(Array.isArray(_e))return _e}catch{}}}return Array.isArray(G==null?void 0:G.address_list)?G.address_list:[]})(),gt=St.filter(_=>{if(!_||typeof _!="object"||_.type==="Summary")return!1;const T=(_.name||"").trim();return T==="Summary"||T==="Total"||T.startsWith("Users:")?!1:!!(T||_.entry_id||_.registration_no&&_.registration_no!=="-"||_.email_address||_.email||_.folder||_.physical_path)}),ht={...G,address_list:St,status:St.length>0?"success":(G==null?void 0:G.status)||"none",timestamp:((z=v==null?void 0:v[c.id])==null?void 0:z.timestamp)||(G==null?void 0:G.timestamp)||new Date().toISOString()},wt=gt.length>0||We,Ut=gt.length,A=ht.timestamp?new Date(ht.timestamp).toLocaleTimeString("vi-VN"):"",k=Zr.useCallback(async(_,T)=>{var Xe,he;const Z=se(_.printer_name||_.name||"");if(Z!=="ricoh"&&Z!=="toshiba"){Q("Thiết bị không hỗ trợ thay đổi FTP","error");return}const M=Z==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",b=((Xe=W==null?void 0:W.agents)==null?void 0:Xe.find(u=>u.is_agent_active))||((he=W==null?void 0:W.agents)==null?void 0:he[0]),y=(b==null?void 0:b.local_ip)||(b==null?void 0:b.ip)||"";if(!y){Q("Không tìm thấy IP của Agent để cập nhật","error");return}const ie=T.folder||T.physical_path||T.folder_path||"",Ae=ie.match(/ftp:\/\/([^:/]+)/),_e=ie.match(/^\\\\([^\\]+)/),Ce=ie.match(/^([^:/]+):/);let E="";Ae?E=Ae[1]:_e?E=_e[1]:Ce&&(E=Ce[1]),E||(E=y);const nt=T.registration_no||T.id||"",qe=T.name||T.username||T.display_name||"",Ne=_.ip||_.printer_ip||"",$=_.auth_user||_.username||"admin",ye=_.auth_password||_.password||"";Q(`Đang gửi lệnh cập nhật FTP cho ${T.name}...`,"info");try{const u=await $t(R,M,"",{printer_ip:Ne,auth_user:$,auth_password:ye,target_id:nt,target_name:qe,old_ip:E,new_ip:y});u&&u.ok?Q(`Cập nhật FTP cho ${T.name} thành công!`,"success"):Q(`Lỗi: ${(u==null?void 0:u.error)||"Không thể chạy lệnh"}`,"error")}catch(u){Q(`Lỗi gửi lệnh: ${(u==null?void 0:u.message)||u}`,"error")}},[R,W,se,Q]);return e.jsx("div",{id:`copier-card-${c.id}`,onClick:()=>je(String(c.id)),style:{width:"100%"},children:e.jsxs(sr,{children:[e.jsxs("div",{style:le.cardHeader,children:[e.jsxs("div",{children:[e.jsxs("span",{style:le.copierTitle,children:["🖨️ ",(()=>{if(c.printer_name&&c.printer_name.trim())return c.printer_name.trim();const _=(c.mac_id||"").replace(/-/g,":").toUpperCase();return _.startsWith("58:38:79")||_.startsWith("00:26:73")?"Thiết bị Ricoh (Đang thám dò...)":_.startsWith("00:80:91")?"Thiết bị Toshiba (Đang thám dò...)":_.startsWith("00:11:22")?"Thiết bị HP (Đang thám dò...)":"Thiết bị Photocopy (Đang thám dò...)"})()]}),e.jsxs("div",{style:le.copierSubtitle,children:["IP: ",c.ip," · MAC: ",c.mac_id||"—",c.agent_uid&&e.jsxs("span",{style:{marginLeft:"12px",color:"#38bdf8",fontSize:"0.78rem",fontWeight:600},children:["📡 Agent: ",e.jsx("strong",{children:c.agent_uid})]})]})]}),e.jsx("span",{style:{...le.statusBadge,color:c.probed?c.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",borderColor:c.probed?c.is_online?"var(--color-status-online)":"var(--color-status-offline)":"#ffa502",background:c.probed?c.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)":"rgba(255, 165, 2, 0.08)"},children:c.probed?c.is_online?"ONLINE":"OFFLINE":"⏳ ĐANG XÁC ĐỊNH..."})]}),e.jsxs("div",{style:le.sectionBlock,children:[e.jsx("span",{style:le.sectionBlockTitle,children:"🔐 Tài khoản Web máy in:"}),e.jsxs("div",{style:le.credsInputRow,children:[e.jsx("input",{type:"text",style:le.credsInput,placeholder:"admin",autoComplete:"new-password",name:`printer_user_${c.id}`,value:((ge=De[c.id])==null?void 0:ge.user)||"",onChange:_=>fe(T=>({...T,[c.id]:{...T[c.id],user:_.target.value}}))}),e.jsx("input",{type:"password",style:le.credsInput,placeholder:"mật khẩu",autoComplete:"new-password",name:`printer_pass_${c.id}`,value:((V=De[c.id])==null?void 0:V.pass)||"",onChange:_=>fe(T=>({...T,[c.id]:{...T[c.id],pass:_.target.value}}))}),e.jsx("button",{style:{...le.smallBtn,padding:"8px 12px",fontSize:"0.8rem",whiteSpace:"nowrap"},onClick:()=>ue(c),disabled:be[c.id],children:be[c.id]?"Lưu...":"Lưu Auth"})]})]}),e.jsxs("div",{style:{...le.syncStatusBox,flexDirection:"column",alignItems:"stretch",gap:"10px",background:B.status==="success"?"rgba(0, 255, 136, 0.05)":B.status==="error"?"rgba(255, 68, 102, 0.05)":"var(--color-inset-bg)",borderColor:B.status==="success"?"rgba(0, 255, 136, 0.15)":B.status==="error"?"rgba(255, 68, 102, 0.15)":"var(--color-surface-light)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("span",{style:le.syncStatusTitle,children:"Trạng thái đồng bộ danh bạ:"}),Ee?e.jsx("span",{style:{color:"var(--color-warning)",fontWeight:600},children:Et}):wt?e.jsxs("span",{style:{color:"var(--color-success)",fontWeight:600},children:["✔ Đồng bộ OK (",Ut," mục) ",A?` • ${A}`:""]}):B.status==="error"?e.jsxs("span",{style:{color:"var(--color-error)"},children:["❌ Lỗi: ",B.error," ",A?`(${A})`:""]}):e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Chưa có thông tin danh bạ"})]}),e.jsx("div",{style:{display:"flex",gap:"6px"},children:e.jsxs("button",{style:{...le.smallBtn,padding:"6px 10px",fontSize:"0.75rem",height:"auto"},onClick:async()=>{$e(c),setTimeout(Ve,2e3),setTimeout(Ve,4500)},disabled:Ee||f.length===0,children:["🔄 ",ht.status==="success"?"Cập nhật":"Đồng bộ"]})})]}),wt&&e.jsx("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.08)",paddingTop:"10px"},children:e.jsx(Un,{hasAddressList:wt,sync:ht,p:c,commandStatus:v,getDestinationStatus:Ie,selectedLan:W,handleOpenStorageFiles:ne,handleEditIP:ze,handleDeleteDest:pt,handleChangeFtp:k})})]}),At&&e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("button",{style:le.expandSubBtn,onClick:()=>ve(_=>({..._,[c.id]:!ut})),children:ut?"▲ Ẩn driver đề xuất":"▼ Xem driver đề xuất từ catalog"}),e.jsx(jt,{children:ut&&e.jsx(rt.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},style:{overflow:"hidden",marginTop:"6px"},children:e.jsx("div",{style:le.suggestedDriverBlock,children:c.suggested_drivers.map((_,T)=>{const Z=_.brand==="ricoh"?"var(--color-primary)":_.brand==="toshiba"?"var(--color-error)":"var(--color-success)",M=`${c.id}-${T}`,b=Se[M]||!1;return e.jsxs("div",{style:le.driverSuggestionItem,children:[e.jsxs("div",{style:le.driverModelHeader,onClick:()=>ce(y=>({...y,[M]:!b})),children:[e.jsxs("span",{style:{fontSize:"0.8rem",fontWeight:600},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:Z,marginRight:"6px"}}),_.brand.toUpperCase()," - ",_.model]}),e.jsx("span",{style:{fontSize:"0.75rem",color:"var(--color-primary)"},children:b?"▲":"▼"})]}),b&&e.jsx("div",{style:le.driverOptionsList,children:_.drivers&&_.drivers.length>0?_.drivers.map((y,ie)=>e.jsxs("div",{style:le.driverFileRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:le.driverFileName,children:y.name}),e.jsx("div",{style:le.driverFileUrl,title:y.url,children:y.url.split("/").pop()})]}),e.jsxs("div",{style:{display:"flex",gap:"4px"},children:[e.jsx("a",{href:y.url,target:"_blank",rel:"noreferrer",style:le.driverDownloadBtn,children:"Tải về"}),e.jsx("button",{style:{...le.smallBtn,padding:"4px 8px",fontSize:"0.7rem"},onClick:()=>we(c.id,_.brand,_.model,y.name,y.url),disabled:f.length===0,children:"Cài đặt"})]})]},ie)):e.jsx("div",{style:le.emptySubText,children:"Không tìm thấy driver nào."})})]},T)})})})})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"10px"},children:[e.jsx("button",{style:{...le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center"},onClick:()=>{Pe({printerId:c.id,name:"",email:"",agentUid:R}),xe("public_ftp")},disabled:f.length===0,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:{...le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#3b82f6",color:"#3b82f6"},onClick:()=>{var T,Z;const _=R||c.agent_uid||F||((Z=(T=W==null?void 0:W.agents)==null?void 0:T[0])==null?void 0:Z.agent_uid)||"";if(!_){Q("Không tìm thấy Agent nào trong dải mạng LAN này","error");return}de(c.ip,"","GET",null,!1,_,80)},disabled:!W||!W.agents||W.agents.length===0,title:"Xem trực tiếp trang quản trị Web Setting (Port 80)",children:"🌐 Web setting"}),e.jsx("button",{style:{...le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#ef4444",color:"#ef4444"},onClick:()=>{N({ip:c.ip,name:c.name||c.printer_name||c.ip,id:c.id,agentUid:R}),xe("remote_lock")},disabled:f.length===0,children:"🔒 Khóa máy từ xa"}),se(c.name||c.printer_name||c.ip)==="ricoh"&&(c.name||c.printer_name||"").toLowerCase().includes("6503")&&e.jsx("button",{style:{...le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#34d399",color:"#34d399",opacity:.5,cursor:"not-allowed"},onClick:()=>Q("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 Remote Panel"}),se(c.name||c.printer_name||c.ip)==="toshiba"&&e.jsx("button",{style:{...le.smallBtn,flex:1,justifyContent:"center",fontSize:"0.8rem",padding:"8px 12px",display:"flex",alignItems:"center",borderColor:"#a78bfa",color:"#a78bfa",opacity:.5,cursor:"not-allowed"},onClick:()=>Q("Tính năng này đang được khóa","info"),disabled:!0,title:"Tính năng đang khóa",children:"🔒 VNC Remote"})]})]})},c.id)}function Gn(c){const{setCopierCredentials:W,activeAgentUid:F,activeLoadingFile:R,activeModal:De,activeTab:fe,addCameraLoading:be,addressBookModal:ue,agentUid:L,agents:je,cameraAgentUid:f,cameraFileFilter:se,cameras:Q,camerasLoading:de,canNavigateNext:N,canNavigatePrev:xe,commandStatus:We,copierCredentials:B,deleteCameraLoading:v,deleteScanPointModal:Ie,destToDelete:ne,detectBrand:ze,editIpData:pt,editIpModal:$e,editIpNewIp:mt,editIpSaving:ve,expandedCopierId:Se,expandedDriverMenus:ce,expandedDrivers:we,expandedPrinters:Pe,fetchLanSitesData:J,fetchRemotePage:Je,fileTypeFilter:Ke,filteredPrinters:Ve,getDestinationStatus:Ee,getTargetAgentUid:Et,handleCopierClick:G,handleDeleteDest:At,handleEditIP:ut,handleOpenStorageFiles:St,handleRefetchAddressBook:gt,handleRemoteInstallDriver:ht,handleSaveAuth:wt,infoDetailModal:Ut,installDriverModal:A,installDriverSaving:k,installedCount:U,isAllInstalled:Y,lanSites:z,lanSitesLoading:ge,liveAddressBooks:V,mockAgentApi:_,newCamIp:T,newCamName:Z,newCamPass:M,newCamPort:b,newCamRtsp:y,newCamUser:ie,onlineAgents:Ae,pendingScanPoints:_e,printers:Ce,publicFtpData:E,publicFtpModal:nt,publicFtpSaving:qe,record30sLoading:Ne,remoteLockModal:$,remoteLockPrinter:ye,saveAuthLoading:Xe,selectedAgentUid:he,selectedCamera:u,selectedCameraAgentUid:Rt,selectedLan:it,selectedLanUid:Bt,setActiveModal:wr,setExpandedDriverMenus:Tr,setExpandedDrivers:ke,setPublicFtpData:Kt,setRemoteLockPrinter:Cr,showToast:ar,storageFilesModal:It,storageFilesModalData:lr,storageFilesModalLoading:ee,storageFilterDate:Qe,submittingScanPoint:Jt,toshibaVncData:dr,utilityActionPending:qt,utilityCommands:kr,utilityCommandsLoading:jr,utilitySettingsLoading:Fr,utilityStatusMsg:Ye,viewOutputModal:Ur,vncTunnelLoading:Br,webPreviewHistory:Gt,webPreviewHistoryIndex:H,webPreviewLoading:lt,webPreviewModal:Lt,webPreviewTab:Xt}=c;return e.jsx(e.Fragment,{children:e.jsxs(rt.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:r.tabContent,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Quản lý danh sách máy photocopy & danh bạ scan"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",padding:"6px 12px",borderRadius:"20px",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",gap:"6px"},children:e.jsx("span",{children:"● Tất cả máy photocopy đều được quản lý tự động qua Agent"})})]}),e.jsx(Sn,{className:"copiers-grid",style:r.gridContainer,children:ge?e.jsxs("div",{style:r.loadingContainer,children:[e.jsx(vt,{}),e.jsx("div",{style:r.loadingText,children:"Đang tải dữ liệu thiết bị..."})]}):Ve.length===0?e.jsxs("div",{style:r.emptyStateContainer,children:[e.jsx("div",{style:r.emptyIcon,children:"🖨️"}),e.jsx("div",{style:r.emptyTitle,children:"Không tìm thấy máy photocopy nào"}),e.jsx("div",{style:r.emptySubtitle,children:'Vui lòng chọn mạng LAN khác hoặc nhấp "Làm mới" để quét lại thiết bị.'})]}):Ve.map(Me=>{const Dt=String(Se)===String(Me.id),zt=Le=>{if(!Le)return null;let Fe=Le;if(typeof Fe=="string"){let Pt=Fe.trim();if(Pt.includes("__ADDRESS_BOOK_JSON_START__"))try{Pt=Pt.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim(),Pt=Pt.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim()}catch{}try{Fe=JSON.parse(Pt)}catch{return null}}if(typeof Fe!="object")return null;let pr=0;for(;Fe&&typeof Fe=="object"&&!Array.isArray(Fe.address_list)&&Fe.address_book_sync&&pr<5;)Fe=Fe.address_book_sync,pr++;return Fe},Oe=(Me.mac_id||Me.mac_address||"").toUpperCase().replace(/-/g,":"),Ht=zt(Oe?V==null?void 0:V[Oe]:null),Nt=zt(Me.address_book_sync),ft=Ht&&Array.isArray(Ht.address_list),Ze=Nt&&Array.isArray(Nt.address_list)&&Nt.address_list.length>0,oe=ft?Ht:Ze?Nt:Ht||Nt||{},Ar=(Array.isArray(oe.address_list)?oe.address_list.filter(Le=>{if(!Le||typeof Le!="object"||Le.type==="Summary")return!1;const Fe=(Le.name||"").trim();return Fe==="Summary"||Fe==="Total"||Fe.startsWith("Users:")?!1:!!(Fe||Le.entry_id||Le.registration_no&&Le.registration_no!=="-"||Le.email_address||Le.email||Le.folder||Le.physical_path)}):[]).length>0,cr=((it==null?void 0:it.agents)||[]).filter(Le=>Le.is_agent_active),Ir=Et?Et(Me.id):he||Me.agent_uid||"";return e.jsx(Bn,{p:Me,selectedLan:it,activeAgentUid:L,selectedAgentUid:Ir,copierCredentials:B||{},setCopierCredentials:W,saveAuthLoading:Xe||{},handleSaveAuth:wt,isExpanded:Dt,handleCopierClick:G,onlineAgents:cr,detectBrand:ze||(()=>"generic"),showToast:ar||(()=>{}),fetchRemotePage:Je||(()=>{}),setRemoteLockPrinter:Cr,setActiveModal:wr,hasAddressList:Ar,sync:oe,commandStatus:We||{},getDestinationStatus:Ee||(()=>({})),handleOpenStorageFiles:St||(()=>{}),handleEditIP:ut||(()=>{}),handleDeleteDest:At||(()=>{}),handleRefetchAddressBook:gt||(()=>{}),expandedDrivers:we||{},setExpandedDrivers:ke,expandedDriverMenus:ce||{},setExpandedDriverMenus:Tr,handleRemoteInstallDriver:ht||(()=>{}),setPublicFtpData:Kt},Me.id)})})]},"copiers-tab")})}function vn(c){const W=(c||"").trim();return W&&W.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._@-]/g,"-").replace(/^[\s\-_.]+|[\s\-_.]+$/g,"")||"unknown"}function zn(c){const{AgentPage:W,activeLoadingFile:F,activeModal:R,activeTab:De,allocatedVncAddr:fe,cameraFiles:be,cameraForm:ue,cameraLogs:L,cameraStatus:je,cameraTestLoading:f,cameraTestResult:se,cameras:Q,camerasLoading:de,commandStatus:N,confirmModal:xe,copierCredentials:We,customRecordDuration:B,customRunCommand:v,deleteScanPointModal:Ie,directLan:ne,editIpModalData:ze,editableSettingsText:pt,emailFileCounts:$e,executeRemoteInstallDriver:mt,expandedDriverMenus:ve,expandedDrivers:Se,expandedPrinters:ce,fetchCameraFiles:we,fetchCameraStatus:Pe,fetchRemotePage:J,fetchRemotePageOld:Je,ftpDetailData:Ke,getDestinationStatus:Ve,getDestinationStatusHtml:Ee,getLiveQueryTimestamp:Et,handleAddPrivateFtp:G,handleAddPublicFtp:At,handleCloseWebPreview:ut,handleConfirmDeleteScanPoint:St,handleCopierClick:gt,handleDeleteCamera:ht,handleDeleteCameraFile:wt,handleDeleteDest:Ut,handleEditIP:A,handleFetchEntryDetail:k,handleHistoryBack:U,handleHistoryForward:Y,handleOpenStorageFiles:z,handlePlaySegmentFile:ge,handleQueryVideo:V,handleRecord30s:_,handleRefetchAddressBook:T,handleRemoteInstallDriver:Z,handleSaveAuth:M,handleSaveCameraConfig:b,handleSaveEditIP:y,handleTriggerUtilityExec:ie,handleSaveSettings:Ae,handleStartToshibaVnc:_e,handleTestCameraConnection:Ce,handleToggleDirectLan:E,handleViewScanPointsJson:nt,installDriverModal:qe,ipInputModal:Ne,isRecording30s:$,isSavingSettings:ye,lanSites:Xe,lanSitesLoading:he,liveAddressBooks:u,lockAspect:Rt,pollCommandStatus:it,previewBlobUrl:Bt,privateFtpData:wr,privateFtpLoading:Tr,publicFtpData:ke,publicFtpLoading:Kt,queriedVideoUrl:Cr,queryDuration:ar,queryTimestamp:It,queryVideoLoading:lr,recording30sCountdown:ee,remoteLockPrinter:Qe,resolveRelativePath:Jt,saveAuthLoading:dr,savedLocal:qt,scaleX:kr,scaleY:jr,scanAutoOpenDir:Fr,scanAutoOpenFile:Ye,scanPointsViewerModal:Ur,selectedCamera:Br,selectedCameraAgentUid:Gt,selectedLan:H,selectedLanUid:lt,selectedTargetAgents:Lt,selectedUtilityAgent:Xt,setActiveLoadingFile:Me,setActiveModal:Dt,setActiveTab:zt,setAllocatedVncAddr:Oe,setCameraFiles:Ht,setCameraForm:Nt,setCameraLogs:ft,setCameraStatus:Ze,setCameraTestLoading:oe,setCameraTestResult:Wt,setCameras:Ar,setCamerasLoading:cr,setCommandStatus:Ir,setConfirmModal:Le,setCopierCredentials:Fe,setCustomRecordDuration:pr,setCustomRunCommand:Pt,setDeleteScanPointModal:Gr,setDirectLan:en,setEditIpModalData:Pr,setEditableSettingsText:Qt,setEmailFileCounts:tn,setExpandedDriverMenus:rn,setExpandedDrivers:Er,setExpandedPrinters:Yt,setFtpDetailData:nn,setInstallDriverModal:Zt,setIpInputModal:zr,setIsRecording30s:sn,setIsSavingSettings:er,setLanSites:Hr,setLanSitesLoading:on,setLiveAddressBooks:Rr,setLockAspect:Tt,setPreviewBlobUrl:st,setPrivateFtpData:an,setPrivateFtpLoading:tr,setPublicFtpData:ln,setPublicFtpLoading:mr,setQueriedVideoUrl:D,setQueryDuration:Wr,setQueryTimestamp:rr,setQueryVideoLoading:Ct,setRecording30sCountdown:Lr,setRemoteLockPrinter:ur,setSaveAuthLoading:dn,setScaleX:cn,setScaleY:Vr,setScanAutoOpenDir:ot,setScanAutoOpenFile:pn,setScanPointsViewerModal:te,setSelectedCamera:gr,setSelectedCameraAgentUid:$r,setSelectedLanUid:et,setSelectedTargetAgents:Ue,setSelectedUtilityAgent:Kr,setSettingsSaveStatus:hr,setShowPreviewDetails:fr,setShowSettings:Dr,setStorageFiles:mn,setStorageLoading:Mt,setStorageModalData:un,setToasts:Ot,setToshibaVncData:gn,setUtilityActionPending:xr,setUtilityCommands:hn,setUtilityCommandsLoading:Te,setUtilitySettingsLoading:fn,setUtilityStatusMsg:re,setViewOutputModal:_r,setVncTunnelLoading:xt,setWebPreviewHistory:Ft,setWebPreviewHistoryIndex:Nr,setWebPreviewLoading:xn,setWebPreviewModal:_n,setWebPreviewTab:Be,settingsSaveStatus:at,showPreviewDetails:nr,showSettings:Jr,storageFiles:yn,storageLoading:dt,storageModalData:qr,toasts:ct,toshibaVncData:kt,utilityActionPending:ir,utilityCommands:yr,utilityCommandsLoading:Ge,utilitySettingsLoading:Mr,utilityStatusMsg:br,viewOutputModal:vr,vncTunnelLoading:Vt,webPreviewHistory:_t,webPreviewHistoryIndex:q,webPreviewLoading:Sr,webPreviewModal:Xr,webPreviewTab:Qr}=c;return e.jsx(e.Fragment,{children:e.jsx(rt.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},exit:{opacity:0,x:10},style:r.tabContent,children:e.jsx(Sn,{children:H.agents.filter(ae=>ae.is_agent_active).length===0?e.jsx("div",{style:r.emptyText,children:"Không có Agent nào đang online trong mạng LAN này."}):H.agents.filter(ae=>ae.is_agent_active).map(ae=>{const tt=ae.is_agent_active;return e.jsxs(sr,{children:[e.jsxs("div",{style:r.cardHeader,children:[e.jsxs("span",{style:r.cardTitle,children:["💻 ",ae.hostname]}),e.jsx("span",{style:{...r.statusBadge,color:tt?"var(--color-status-online)":"var(--color-status-offline)",borderColor:tt?"var(--color-status-online)":"var(--color-status-offline)",background:tt?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:tt?ae.is_master?"★ MASTER":"● ONLINE":"● OFFLINE"})]}),e.jsxs("div",{style:r.cardDetails,children:[e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"UID:"}),e.jsx("span",{style:{...r.detailValue,fontFamily:"monospace",fontSize:"0.75rem"},children:ae.agent_uid})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"IP cục bộ:"}),e.jsxs("span",{style:{...r.detailValue,display:"flex",alignItems:"center",gap:"6px"},children:[ae.local_ip,e.jsx("button",{title:"Làm mới IP cục bộ",onClick:async g=>{g.stopPropagation();try{const pe=await $t(ae.agent_uid,"get_agent_ip","");if(pe.ok&&pe.command_id){c.showToast&&c.showToast("Đang yêu cầu lấy lại IP cục bộ...","info");const X=pe.command_id,yt=Date.now(),n=setInterval(async()=>{try{if(Date.now()-yt>12e3){clearInterval(n);return}const i=await or(X);i.status==="success"?(clearInterval(n),c.fetchLanSitesData&&await c.fetchLanSitesData(!0),c.showToast&&c.showToast("Đã cập nhật IP cục bộ mới nhất!","success")):i.status==="failed"&&(clearInterval(n),c.showToast&&c.showToast("Không thể lấy lại IP cục bộ: "+(i.error||"Thất bại"),"error"))}catch(i){console.error(i),clearInterval(n)}},1e3)}else c.showToast&&c.showToast("Gửi yêu cầu thất bại: "+(pe.error||"Lỗi kết nối"),"error")}catch(pe){c.showToast&&c.showToast("Lỗi: "+pe.message,"error")}},style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",padding:"2px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-primary)",opacity:.8,transition:"opacity 0.2s"},onMouseEnter:g=>g.currentTarget.style.opacity="1",onMouseLeave:g=>g.currentTarget.style.opacity="0.8",children:"🔄"})]})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Địa chỉ MAC:"}),e.jsx("span",{style:r.detailValue,children:ae.local_mac||"—"})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Tệp scan (VPS):"}),e.jsx("span",{style:r.detailValue,children:(()=>{const g=(ae.ftp_sites||[]).find(l=>(l.name||"").toLowerCase()==="goxprint")||(ae.ftp_sites||[])[0],pe=(g==null?void 0:g.path)||"",X=vn((H==null?void 0:H.lan_uid)||""),yt=vn(ae.agent_uid||""),i=`storage/uploads/scans/${vn(ae.lead||"default")}/${X}/${yt}/`,s=H?H.emails.filter(l=>l.email_type==="private"&&l.pc_name&&l.pc_name.toLowerCase().trim()===ae.agent_uid.toLowerCase().trim()):[],o=s.reduce((l,h)=>l+($e[h.email]??0),0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",background:"var(--color-inset-bg)",borderRadius:"6px",padding:"6px 8px",fontSize:"0.65rem"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Máy: "}),e.jsx("code",{style:{fontFamily:"monospace",color:pe?"var(--color-primary)":"var(--color-text-secondary)",fontStyle:pe?"normal":"italic"},children:pe||"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp"})]}),e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"☁ VPS: "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-accent, #7c6af7)"},children:i})]})]}),s.length>0&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[s.map(l=>{const h=$e[l.email]??0;return e.jsxs("button",{style:{...r.linkButton,textAlign:"left",fontSize:"0.68rem"},onClick:()=>z((H==null?void 0:H.lan_uid)||"",l.email),title:`Xem tệp của ${l.email}`,children:["📁 ",h," tệp"]},l.email)}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["Tổng: ",e.jsxs("strong",{style:{color:"var(--color-text)"},children:[o," tệp"]})]})]}),s.length===0&&e.jsx("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có email riêng trên máy này"})]})})()})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"FTP Ports:"}),e.jsx("span",{style:r.detailValue,children:ae.ftp_ports||"—"})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Tiện ích:"}),e.jsx("span",{style:r.detailValue,children:e.jsx("button",{onClick:()=>{Kr(ae),Dt("utilities")},style:{color:"var(--color-primary)",fontWeight:700,border:"1px solid var(--color-primary)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.68rem",background:"rgba(59, 130, 246, 0.05)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px"},children:"🛠️ Mở trang Tiện ích"})})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Cập nhật lúc:"}),e.jsx("span",{style:r.detailValue,children:ae.updated_at||"—"})]})]}),e.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid var(--color-surface-light)"},children:[e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",display:"block",marginBottom:"8px"},children:"📂 Dịch vụ FTP đang chạy:"}),!ae.ftp_sites||ae.ftp_sites.length===0?e.jsx("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",fontStyle:"italic",padding:"6px"},children:"Không có FTP site nào hoạt động."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:ae.ftp_sites.map((g,pe)=>{const X=g.running;return e.jsxs("div",{style:{background:"var(--color-inset-bg)",border:`1px solid ${X?"var(--color-surface-light)":"rgba(255, 68, 102, 0.4)"}`,borderRadius:"8px",padding:"10px 12px",fontSize:"0.72rem",color:"var(--color-text)",boxShadow:X?"none":"0 0 8px rgba(255, 68, 102, 0.15)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",backgroundColor:X?"var(--color-status-online)":"var(--color-status-offline)",boxShadow:X?"0 0 6px var(--color-status-online)":"none"}}),e.jsxs("strong",{style:{color:X?"var(--color-text)":"var(--color-error)"},children:["Cổng Port: ",g.port]}),e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:["(",X?"Đang chạy":"Đã dừng",")"]})]}),g.error&&e.jsxs("span",{style:{fontSize:"0.65rem",color:"var(--color-error)"},children:["Lỗi: ",g.error]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",paddingLeft:"12px"},children:[e.jsxs("div",{style:{wordBreak:"break-all"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"🖥 Thư mục (máy): "}),e.jsx("code",{style:{fontFamily:"monospace",color:"var(--color-primary)"},children:g.path})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"User: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:g.ftp_user||"goxprint"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"var(--color-text-secondary)"},children:"Pass: "}),e.jsx("strong",{style:{color:"var(--color-text)"},children:g.ftp_password||"goxprint"})]})]})]})]},pe)})})]})]},ae.agent_uid)})})},"agents-tab")})}function Hn(c){const{AgentPage:W,activeAgentUid:F,activeLoadingFile:R,activeModal:De,activeTab:fe,allocatedVncAddr:be,cameraFiles:ue,cameraForm:L,cameraLogs:je,cameraStatus:f,cameraTestLoading:se,cameraTestResult:Q,cameras:de,camerasLoading:N,commandStatus:xe,confirmModal:We,copierCredentials:B,customRecordDuration:v,customRunCommand:Ie,deleteScanPointModal:ne,directLan:ze,editIpModalData:pt,editableSettingsText:$e,emailFileCounts:mt,executeRemoteInstallDriver:ve,expandedDriverMenus:Se,expandedDrivers:ce,expandedPrinters:we,fetchCameraFiles:Pe,fetchCameraStatus:J,fetchCameras:Je,fetchRemotePage:Ke,fetchRemotePageOld:Ve,ftpDetailData:Ee,getDestinationStatus:Et,getDestinationStatusHtml:G,getLiveQueryTimestamp:At,handleAddPrivateFtp:ut,handleAddPublicFtp:St,handleCloseWebPreview:gt,handleConfirmDeleteScanPoint:ht,handleCopierClick:wt,handleDeleteCamera:Ut,handleDeleteCameraFile:A,handleDeleteDest:k,handleEditIP:U,handleFetchEntryDetail:Y,handleHistoryBack:z,handleHistoryForward:ge,handleOpenStorageFiles:V,handlePlaySegmentFile:_,handleQueryVideo:T,handleRecord30s:Z,handleRefetchAddressBook:M,handleRemoteInstallDriver:b,handleSaveAuth:y,handleSaveCameraConfig:ie,handleSaveEditIP:Ae,handleSaveSettings:_e,handleStartToshibaVnc:Ce,handleTestCameraConnection:E,handleToggleDirectLan:nt,handleViewScanPointsJson:qe,installDriverModal:Ne,ipInputModal:$,isRecording30s:ye,isSavingSettings:Xe,lanSites:he,lanSitesLoading:u,liveAddressBooks:Rt,lockAspect:it,onlineAgents:Bt,pollCommandStatus:wr,previewBlobUrl:Tr,privateFtpData:ke,privateFtpLoading:Kt,publicFtpData:Cr,publicFtpLoading:ar,queriedVideoUrl:It,queryDuration:lr,queryTimestamp:ee,queryVideoLoading:Qe,recording30sCountdown:Jt,remoteLockPrinter:dr,resolveRelativePath:qt,saveAuthLoading:kr,savedLocal:jr,scaleX:Fr,scaleY:Ye,scanAutoOpenDir:Ur,scanAutoOpenFile:Br,scanPointsViewerModal:Gt,selectedCamera:H,selectedCameraAgentUid:lt,selectedLan:Lt,selectedLanUid:Xt,selectedTargetAgents:Me,selectedUtilityAgent:Dt,setActiveLoadingFile:zt,setActiveModal:Oe,setActiveTab:Ht,setAllocatedVncAddr:Nt,setCameraFiles:ft,setCameraForm:Ze,setCameraLogs:oe,setCameraStatus:Wt,setCameraTestLoading:Ar,setCameraTestResult:cr,setCameras:Ir,setCamerasLoading:Le,setCommandStatus:Fe,setConfirmModal:pr,setCopierCredentials:Pt,setCustomRecordDuration:Gr,setCustomRunCommand:en,setDeleteScanPointModal:Pr,setDirectLan:Qt,setEditIpModalData:tn,setEditableSettingsText:rn,setEmailFileCounts:Er,setExpandedDriverMenus:Yt,setExpandedDrivers:nn,setExpandedPrinters:Zt,setFtpDetailData:zr,setInstallDriverModal:sn,setIpInputModal:er,setIsRecording30s:Hr,setIsSavingSettings:on,setLanSites:Rr,setLanSitesLoading:Tt,setLiveAddressBooks:st,setLockAspect:an,setPreviewBlobUrl:tr,setPrivateFtpData:ln,setPrivateFtpLoading:mr,setPublicFtpData:D,setPublicFtpLoading:Wr,setQueriedVideoUrl:rr,setQueryDuration:Ct,setQueryTimestamp:Lr,setQueryVideoLoading:ur,setRecording30sCountdown:dn,setRemoteLockPrinter:cn,setSaveAuthLoading:Vr,setScaleX:ot,setScaleY:pn,setScanAutoOpenDir:te,setScanAutoOpenFile:gr,setScanPointsViewerModal:$r,setSelectedCamera:et,setSelectedCameraAgentUid:Ue,setSelectedLanUid:Kr,setSelectedTargetAgents:hr,setSelectedUtilityAgent:fr,setSettingsSaveStatus:Dr,setShowPreviewDetails:mn,setShowSettings:Mt,setStorageFiles:un,setStorageLoading:Ot,setStorageModalData:gn,setToasts:xr,setToshibaVncData:hn,setUtilityActionPending:Te,setUtilityCommands:fn,setUtilityCommandsLoading:re,setUtilitySettingsLoading:_r,setUtilityStatusMsg:xt,setViewOutputModal:Ft,setVncTunnelLoading:Nr,setWebPreviewHistory:xn,setWebPreviewHistoryIndex:_n,setWebPreviewLoading:Be,setWebPreviewModal:at,setWebPreviewTab:nr,settingsSaveStatus:Jr,showPreviewDetails:yn,showSettings:dt,storageFiles:qr,storageLoading:ct,storageModalData:kt,toasts:ir,toshibaVncData:yr,utilityActionPending:Ge,utilityCommands:Mr,utilityCommandsLoading:br,utilitySettingsLoading:vr,utilityStatusMsg:Vt,viewOutputModal:_t,vncTunnelLoading:q,webPreviewHistory:Sr,webPreviewHistoryIndex:Xr,webPreviewLoading:Qr,webPreviewModal:ae,webPreviewTab:tt}=c;return e.jsx(e.Fragment,{children:e.jsx(rt.div,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},exit:{opacity:0,x:-10},style:r.tabContent,children:F?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs(sr,{children:[e.jsxs("div",{style:r.cardHeader,children:[e.jsx("h4",{style:r.cardTitle,children:"📹 Danh sách Camera"}),e.jsx("button",{onClick:async()=>{if(F){Te("scan_cameras"),xt({text:"⌛ Đang yêu cầu Agent quét camera real-time...",isError:!1});try{const g=await triggerAgentUtility(F,"scan_cameras");if(!g.ok||!g.command_id)throw new Error(g.error||"Không thể tạo lệnh tiện ích");const pe=g.command_id,X=6e4,yt=1e3,n=Date.now(),i=setInterval(async()=>{try{const s=Date.now()-n;if(s>X){clearInterval(i),xt({text:"Quét camera quá thời gian chờ (60s)",isError:!0}),Te(null);return}const o=await getCommandStatus(pe);if(o.status==="success")clearInterval(i),xt({text:"⚡ Quét camera thành công!",isError:!1}),Te(null),Je(F);else if(o.status==="failed"||!o.ok)clearInterval(i),xt({text:`❌ Thất bại: ${o.error||"Lệnh quét thất bại từ Agent"}`,isError:!0}),Te(null);else{const l=Math.round(s/1e3);xt({text:`⌛ Đang quét camera... (${l}s)`,isError:!1})}}catch(s){clearInterval(i),xt({text:`❌ Lỗi kiểm tra trạng thái: ${s.message}`,isError:!0}),Te(null)}},yt)}catch(g){xt({text:`❌ Lỗi: ${g.message}`,isError:!0}),Te(null)}}},disabled:Ge!==null,className:"btn-glow",style:{padding:"6px 12px",fontSize:"0.8rem",fontWeight:600,borderRadius:"6px",background:"var(--color-primary)",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},children:Ge==="scan_cameras"?"⌛ Đang quét...":"⚡ Quét Camera"})]}),Vt&&Ge==="scan_cameras"&&e.jsxs("div",{style:{padding:"10px 12px",margin:"10px 0",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:Vt.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:Vt.isError?"#ef4444":"#10b981",border:`1px solid ${Vt.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{children:Vt.text}),e.jsx("button",{onClick:()=>xt(null),style:{background:"transparent",border:"none",color:"inherit",cursor:"pointer",fontWeight:"bold",fontSize:"1rem",padding:"0 4px"},children:"×"})]}),N?e.jsx("div",{style:r.loadingWrapper,children:"Đang tải..."}):de.length===0?e.jsx("div",{style:r.emptyText,children:"Chưa cấu hình camera nào."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",marginTop:"10px"},children:de.map(g=>{const pe=(H==null?void 0:H.id)===g.id;return e.jsxs("div",{onClick:()=>{const X=g.agent_uid||F;et(g),Ue(X),Ze(g),cr(null),Wt(null),oe([]),ft([]),rr(""),Mt(!1),zt(null),Pe(X,g.id),J(X,g.id);const yt=At();Lr(yt),Ct(30),T(X,g.id,yt,30)},style:{padding:"10px 12px",borderRadius:"8px",background:pe?"var(--color-surface-light)":"var(--color-inset-bg)",border:pe?"1px solid var(--color-primary)":"1px solid var(--color-surface-light)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:600},children:g.camera_name}),e.jsxs("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"2px"},children:["IP: ",g.ip||"—"," · MAC: ",g.mac_address||"—"]}),e.jsxs("div",{style:{fontSize:"0.72rem",color:"var(--color-text-secondary)",marginTop:"1px"},children:["Hãng: ",g.manufacturer||"Generic"," · Dòng máy: ",g.model||"Camera IP"]}),e.jsx("div",{style:{fontSize:"0.7rem",color:"var(--color-text-secondary)",marginTop:"2px",wordBreak:"break-all",fontFamily:"monospace"},children:g.rtsp_url})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"},children:[e.jsx("span",{style:{fontSize:"0.65rem",fontWeight:700,padding:"2px 6px",borderRadius:"4px",border:"1px solid",color:g.is_online?"var(--color-status-online)":"var(--color-status-offline)",borderColor:g.is_online?"var(--color-status-online)":"var(--color-status-offline)",background:g.is_online?"rgba(0, 255, 136, 0.08)":"rgba(255, 68, 102, 0.08)"},children:g.is_online?"ONLINE":"OFFLINE"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("span",{style:{fontSize:"0.65rem",color:"var(--color-text-secondary)"},children:g.is_recording?"Đang ghi":"Chờ"}),g.is_recording?e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"50%",background:"#ff4757",boxShadow:"0 0 6px #ff4757"}}):e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"50%",background:"var(--color-text-secondary)"}})]})]})]},g.id)})})]}),e.jsx(jt,{children:H&&e.jsx("div",{style:r.modalOverlay,onClick:()=>et(null),children:e.jsxs(rt.div,{style:{...r.modalCard,maxHeight:"90vh",width:"95%",maxWidth:"480px"},onClick:g=>g.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:r.modalTitle,children:"📹 Quản lý Camera"}),e.jsx("div",{style:r.modalSubtitle,children:H.camera_name})]}),e.jsxs("button",{style:{...r.smallBtn,background:dt?"var(--color-primary)":"var(--color-surface-light)",color:dt?"#fff":"var(--color-text)",border:"1px solid var(--color-surface-border)",padding:"4px 8px",fontSize:"0.72rem",height:"24px",marginLeft:"12px"},onClick:()=>Mt(!dt),children:["⚙️ ",dt?"Ẩn Cài đặt":"Cấu hình"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.5rem",cursor:"pointer",padding:"0 4px",lineHeight:"1"},onClick:()=>et(null),children:"×"})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:"14px",paddingRight:"4px"},children:[e.jsx("style",{children:`
                                .segment-item-row {
                                  display: flex;
                                  justify-content: space-between;
                                  align-items: center;
                                  padding: 10px 14px;
                                  border-radius: 8px;
                                  background: var(--color-inset-bg);
                                  border: 1px solid var(--color-surface-light);
                                  cursor: pointer;
                                  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                                }
                                .segment-item-row:hover {
                                  background: var(--color-surface-light) !important;
                                  border-color: var(--color-primary) !important;
                                  transform: translateX(4px);
                                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                                }
                              `}),(Bt&&Bt.length>0||H&&H.agent_uid)&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",background:"var(--color-surface-card)",padding:"10px 14px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",boxShadow:"var(--shadow-subtle)"},children:[e.jsx("span",{style:{fontSize:"0.78rem",fontWeight:600,color:"var(--color-text)"},children:"💻 Lưu tại Máy tính (Agent):"}),e.jsxs("select",{value:F,onChange:g=>{const pe=g.target.value;if(Ue(pe),H){J(pe,H.id),Pe(pe,H.id);const X=At();Lr(X),Ct(30),T(pe,H.id,X,30)}},style:{background:"var(--color-surface-light)",color:"var(--color-text)",border:"1px solid var(--color-surface-border)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.78rem",fontWeight:500,outline:"none",cursor:"pointer",flex:1},children:[Bt.map(g=>e.jsxs("option",{value:g.agent_uid,children:[g.hostname," (",g.agent_uid,")"]},g.agent_uid)),H&&H.agent_uid&&!Bt.some(g=>g.agent_uid===H.agent_uid)&&e.jsxs("option",{value:H.agent_uid,children:["⚠️ Offline: ",H.agent_uid]},H.agent_uid)]})]}),e.jsx(sr,{children:e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center",width:"100%"},children:[e.jsxs("select",{style:{background:"var(--color-surface-light)",color:"var(--color-text)",border:"1px solid var(--color-surface-border)",borderRadius:"6px",padding:"4px 8px",fontSize:"0.75rem",outline:"none",cursor:"pointer",height:"28px",flex:1},value:v,onChange:g=>Gr(Number(g.target.value)),disabled:ye,children:[e.jsx("option",{value:5,children:"5s"}),e.jsx("option",{value:10,children:"10s"}),e.jsx("option",{value:15,children:"15s"}),e.jsx("option",{value:20,children:"20s"}),e.jsx("option",{value:25,children:"25s"}),e.jsx("option",{value:30,children:"30s"}),e.jsx("option",{value:45,children:"45s"}),e.jsx("option",{value:60,children:"60s"})]}),e.jsx("button",{style:{...r.smallBtn,background:ye?"var(--color-danger)":"var(--color-warning)",color:ye?"#fff":"#000",fontWeight:600,border:"1px solid var(--color-surface-border)",height:"28px",flex:2,justifyContent:"center"},onClick:()=>Z(F,H.id),disabled:ye,children:ye?`🔴 Ghi (${Jt}s)`:`⏱️ Ghi hình ${v}s`})]})})}),(It||Qe&&R)&&e.jsxs(sr,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[e.jsx("h4",{style:{...r.cardTitle,fontSize:"0.85rem"},children:"🎬 Trình phát Video"}),It&&e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-danger)",cursor:"pointer",fontSize:"0.78rem"},onClick:()=>rr(""),children:"Đóng phát"})]}),Qe&&e.jsxs("div",{style:{minHeight:"160px",background:"var(--color-inset-bg)",borderRadius:"8px",border:"1px solid var(--color-surface-light)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"10px"},children:[e.jsx(vt,{size:"md"}),e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"0 20px"},children:["Đang cắt phân đoạn và tải clip từ máy trạm lên VPS...",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.7rem",opacity:.8},children:"(Thời gian tối đa 65 giây)"})]})]}),It&&!Qe&&e.jsx("video",{controls:!0,autoPlay:!0,src:`${BASE_URL}/api/agents/${F}/cameras/clips/${It}`,style:{width:"100%",borderRadius:"8px",outline:"none",border:"1px solid var(--color-surface-light)"}})]}),dt&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"},children:[e.jsxs("div",{style:{background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",textAlign:"center",border:"1px solid var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:700,color:"var(--color-primary)"},children:(f==null?void 0:f.segment_count)??0}),e.jsx("div",{style:{fontSize:"0.62rem",color:"var(--color-text-secondary)",textTransform:"uppercase",fontWeight:600},children:"Phân đoạn"})]}),e.jsxs("div",{style:{background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",textAlign:"center",border:"1px solid var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:700,color:"var(--color-primary)",fontFamily:"monospace"},children:f!=null&&f.elapsed_seconds?`${Math.floor(f.elapsed_seconds/60)}m ${f.elapsed_seconds%60}s`:"--"}),e.jsx("div",{style:{fontSize:"0.62rem",color:"var(--color-text-secondary)",textTransform:"uppercase",fontWeight:600},children:"Thời gian"})]}),e.jsxs("div",{style:{background:"var(--color-inset-bg)",padding:"8px 10px",borderRadius:"8px",textAlign:"center",border:"1px solid var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:700,color:"var(--color-primary)"},children:ue.length}),e.jsx("div",{style:{fontSize:"0.62rem",color:"var(--color-text-secondary)",textTransform:"uppercase",fontWeight:600},children:"File MP4"})]})]}),e.jsxs(sr,{children:[e.jsx("h4",{style:{...r.cardTitle,marginBottom:"10px",fontSize:"0.85rem"},children:"⚙️ Cấu hình Camera"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Tên Camera"}),e.jsx("input",{type:"text",style:{...r.modalInput,fontSize:"0.78rem",padding:"5px 8px"},value:L.camera_name,onChange:g=>Ze({...L,camera_name:g.target.value})})]}),e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"RTSP URL"}),e.jsx("input",{type:"text",style:{...r.modalInput,fontSize:"0.78rem",padding:"5px 8px",fontFamily:"monospace"},placeholder:"rtsp://admin:pass@ip:port/h264",value:L.rtsp_url,onChange:g=>Ze({...L,rtsp_url:g.target.value})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"},children:[e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Độ dài segment (s)"}),e.jsx("input",{type:"number",style:{...r.modalInput,fontSize:"0.78rem",padding:"5px 8px"},value:L.segment_duration,onChange:g=>Ze({...L,segment_duration:parseInt(g.target.value)||60})})]}),e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Tiền tố file"}),e.jsx("input",{type:"text",style:{...r.modalInput,fontSize:"0.78rem",padding:"5px 8px"},value:L.prefix,onChange:g=>Ze({...L,prefix:g.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"},children:[e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Video Codec"}),e.jsxs("select",{style:{background:"var(--color-surface-light)",color:"var(--color-text)",border:"1px solid var(--color-surface-border)",borderRadius:"6px",padding:"5px 8px",fontSize:"0.78rem",outline:"none",cursor:"pointer"},value:L.video_codec,onChange:g=>Ze({...L,video_codec:g.target.value}),children:[e.jsx("option",{value:"copy",children:"copy (Gốc)"}),e.jsx("option",{value:"libx264",children:"libx264 (H.264)"})]})]}),e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Audio Codec"}),e.jsxs("select",{style:{background:"var(--color-surface-light)",color:"var(--color-text)",border:"1px solid var(--color-surface-border)",borderRadius:"6px",padding:"5px 8px",fontSize:"0.78rem",outline:"none",cursor:"pointer"},value:L.audio_codec,onChange:g=>Ze({...L,audio_codec:g.target.value}),children:[e.jsx("option",{value:"copy",children:"copy"}),e.jsx("option",{value:"aac",children:"aac"})]})]})]}),e.jsxs("div",{style:{...r.formGroup,flexDirection:"row",alignItems:"center",gap:"8px",marginTop:"4px"},children:[e.jsx("input",{type:"checkbox",id:"modal-no-audio",checked:L.no_audio,onChange:g=>Ze({...L,no_audio:g.target.checked})}),e.jsx("label",{htmlFor:"modal-no-audio",style:{fontSize:"0.75rem",fontWeight:600,color:"var(--color-text)",cursor:"pointer"},children:"Tắt âm thanh (No Audio)"})]}),Q&&e.jsx("div",{style:{padding:"6px 8px",borderRadius:"6px",fontSize:"0.72rem",background:Q.ok?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",border:Q.ok?"1px solid rgba(16,185,129,0.2)":"1px solid rgba(239,68,68,0.2)",color:Q.ok?"#6ee7b7":"#fca5a5"},children:Q.msg}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginTop:"4px"},children:[e.jsx("button",{style:{...r.smallBtn,flex:1,background:"var(--color-surface-light)",color:"var(--color-text)",border:"1px solid var(--color-surface-border)"},onClick:()=>E(F),disabled:se||!L.rtsp_url,children:se?"⏳ Test...":"🔌 Test Connection"}),e.jsx("button",{style:{...r.smallBtn,flex:1,background:"var(--color-success)"},onClick:()=>ie(F),disabled:!L.rtsp_url,children:"💾 Lưu cấu hình"}),L.id&&e.jsx("button",{style:{...r.smallBtn,background:"var(--color-danger)"},onClick:()=>Ut(F,L.id),children:"🗑️ Xoá"})]})]})]}),e.jsxs(sr,{children:[e.jsx("div",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-secondary)",marginBottom:"6px"},children:"📋 NHẬT KÝ GHI HÌNH (AGENT LOGS)"}),e.jsx("div",{style:{background:"#070b14",border:"1px solid var(--color-surface-light)",borderRadius:"8px",height:"110px",overflowY:"auto",padding:"8px 12px",fontFamily:"monospace",fontSize:"0.72rem",lineHeight:1.5},children:je.length===0?e.jsx("div",{style:{color:"var(--color-text-secondary)",fontStyle:"italic"},children:"Chưa có log. Khởi động ghi để xem hoạt động..."}):je.map((g,pe)=>{let X="var(--color-text)";return g.level==="success"&&(X="#10b981"),g.level==="error"&&(X="#ef4444"),g.level==="warn"&&(X="#f59e0b"),e.jsxs("div",{style:{display:"flex",gap:"8px",padding:"1px 0",color:X},children:[e.jsxs("span",{style:{color:"var(--color-text-secondary)"},children:["[",g.time,"]"]}),e.jsx("span",{children:g.msg})]},pe)})})]})]}),e.jsxs(sr,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:e.jsx("h4",{style:{...r.cardTitle,fontSize:"0.85rem",marginBottom:0},children:"🎥 Các phân đoạn video đã ghi (Click để xem)"})}),e.jsx("div",{style:{maxHeight:"280px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px",paddingRight:"4px"},children:ue.length===0?e.jsx("div",{style:r.emptyText,children:"Chưa ghi nhận phân đoạn video nào từ Agent."}):ue.map((g,pe)=>{const X=R===g.name&&Qe,yt=n=>{const i=n.match(/_(\d{8})_(\d{6})\.mp4$/);if(i){const s=i[1],o=i[2],l=`${s.substring(6,8)}/${s.substring(4,6)}/${s.substring(0,4)}`;return`${`${o.substring(0,2)}:${o.substring(2,4)}:${o.substring(4,6)}`} ngày ${l}`}return n};return e.jsxs("div",{onClick:()=>{Qe||(zt(g.name),_(g.name))},style:{opacity:Qe&&!X?.6:1,cursor:Qe?"not-allowed":"pointer",border:X?"1px solid var(--color-primary)":"1px solid var(--color-surface-light)"},className:"segment-item-row",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.78rem"},children:[e.jsx("span",{children:"🎬"}),e.jsx("span",{style:{fontWeight:600},children:yt(g.name)}),e.jsxs("span",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:["(",g.size_mb," MB)"]})]}),e.jsx("div",{children:X?e.jsx("span",{style:{fontSize:"0.72rem",color:"var(--color-primary)",fontWeight:600},children:"⏳ Đang tải..."}):e.jsx("button",{onClick:n=>{n.stopPropagation(),A(F,H.id,g.name)},style:{background:"none",border:"none",color:"var(--color-danger)",cursor:"pointer",fontSize:"1.2rem",padding:"0 4px",lineHeight:1},title:"Xoá phân đoạn này",children:"×"})})]},pe)})})]})]})]})})})]}):e.jsx("div",{style:r.emptyText,children:"Không tìm thấy Máy tính nào hoạt động trong dải LAN này để quản lý camera."})},"cameras-tab")})}function Wn(c){var s,o,l,h,m,p,j,I,C,P,S;const{AgentPage:W,activeLoadingFile:F,activeModal:R,activeTab:De,allocatedVncAddr:fe,cameraFiles:be,cameraForm:ue,cameraLogs:L,cameraStatus:je,cameraTestLoading:f,cameraTestResult:se,cameras:Q,camerasLoading:de,commandStatus:N,confirmModal:xe,copierCredentials:We,customRecordDuration:B,customRunCommand:v,deleteScanPointModal:Ie,directLan:ne,editIpModalData:ze,editableSettingsText:pt,emailFileCounts:$e,executeRemoteInstallDriver:mt,expandedDriverMenus:ve,expandedDrivers:Se,expandedPrinters:ce,fetchCameraFiles:we,fetchCameraStatus:Pe,fetchRemotePage:J,fetchRemotePageOld:Je,formatBytes:Ke,formatJsonText:Ve,ftpDetailData:Ee,getDestinationStatus:Et,getDestinationStatusHtml:G,getLiveQueryTimestamp:At,handleAddPrivateFtp:ut,handleAddPublicFtp:St,handleCloseWebPreview:gt,handleConfirmDeleteScanPoint:ht,handleCopierClick:wt,handleDeleteCamera:Ut,handleDeleteCameraFile:A,handleDeleteDest:k,handleEditIP:U,handleEmergencyRestart:Y,handleFetchEntryDetail:z,handleHistoryBack:ge,handleHistoryForward:V,handleOpenStorageFiles:_,handlePlaySegmentFile:T,handleQueryVideo:Z,handleRecord30s:M,handleRefetchAddressBook:b,handleRemoteInstallDriver:y,handleSaveAuth:ie,handleSaveCameraConfig:Ae,handleSaveEditIP:_e,handleSaveSettings:Ce,handleStartToshibaVnc:E,handleTestCameraConnection:nt,handleToggleDirectLan:qe,handleToggleSetting:Ne,handleTriggerUtility:$,handleTriggerUtilityExec:ye,handleViewScanPointsJson:Xe,installDriverModal:he,ipInputModal:u,isRecording30s:Rt,isSavingSettings:it,lanSites:Bt,lanSitesLoading:wr,liveAddressBooks:Tr,lockAspect:ke,modalContentRef:Kt,pollCommandStatus:Cr,previewBlobUrl:ar,previewIframeRef:It,privateFtpData:lr,privateFtpLoading:ee,publicFtpData:Qe,publicFtpLoading:Jt,queriedVideoUrl:dr,queryDuration:qt,queryTimestamp:kr,queryVideoLoading:jr,recording30sCountdown:Fr,remoteLockPrinter:Ye,resolveRelativePath:Ur,saveAuthLoading:Br,savedLocal:Gt,scaleX:H,scaleY:lt,scanAutoOpenDir:Lt,scanAutoOpenFile:Xt,scanPointsViewerModal:Me,selectedCamera:Dt,selectedCameraAgentUid:zt,selectedLan:Oe,selectedLanUid:Ht,selectedTargetAgents:Nt,selectedUtilityAgent:ft,setActiveLoadingFile:Ze,setActiveModal:oe,setActiveTab:Wt,setAllocatedVncAddr:Ar,setCameraFiles:cr,setCameraForm:Ir,setCameraLogs:Le,setCameraStatus:Fe,setCameraTestLoading:pr,setCameraTestResult:Pt,setCameras:Gr,setCamerasLoading:en,setCommandStatus:Pr,setConfirmModal:Qt,setCopierCredentials:tn,setCustomRecordDuration:rn,setCustomRunCommand:Er,setDeleteScanPointModal:Yt,setDirectLan:nn,setEditIpModalData:Zt,setEditableSettingsText:zr,setEmailFileCounts:sn,setExpandedDriverMenus:er,setExpandedDrivers:Hr,setExpandedPrinters:on,setFtpDetailData:Rr,setInstallDriverModal:Tt,setIpInputModal:st,setIsRecording30s:an,setIsSavingSettings:tr,setLanSites:ln,setLanSitesLoading:mr,setLiveAddressBooks:D,setLockAspect:Wr,setPreviewBlobUrl:rr,setPrivateFtpData:Ct,setPrivateFtpLoading:Lr,setPublicFtpData:ur,setPublicFtpLoading:dn,setQueriedVideoUrl:cn,setQueryDuration:Vr,setQueryTimestamp:ot,setQueryVideoLoading:pn,setRecording30sCountdown:te,setRemoteLockPrinter:gr,setSaveAuthLoading:$r,setScaleX:et,setScaleY:Ue,setScanAutoOpenDir:Kr,setScanAutoOpenFile:hr,setScanPointsViewerModal:fr,setSelectedCamera:Dr,setSelectedCameraAgentUid:mn,setSelectedLanUid:Mt,setSelectedTargetAgents:un,setSelectedUtilityAgent:Ot,setSettingsSaveStatus:gn,setShowPreviewDetails:xr,setShowSettings:hn,setStorageFiles:Te,setStorageLoading:fn,setStorageModalData:re,setToasts:_r,setToshibaVncData:xt,setUtilityActionPending:Ft,setUtilityCommands:Nr,setUtilityCommandsLoading:xn,setUtilitySettingsLoading:_n,setUtilityStatusMsg:Be,setViewOutputModal:at,setVncTunnelLoading:nr,setWebPreviewHistory:Jr,setWebPreviewHistoryIndex:yn,setWebPreviewLoading:dt,setWebPreviewModal:qr,setWebPreviewTab:ct,settingsSaveStatus:kt,showPreviewDetails:ir,showSettings:yr,showToast:Ge,storageFiles:Mr,storageLoading:br,storageModalData:vr,toasts:Vt,toshibaVncData:_t,utilityActionPending:q,utilityCommands:Sr,utilityCommandsLoading:Xr,utilitySettingsLoading:Qr,utilityStatusMsg:ae,viewOutputModal:tt,vncTunnelLoading:g,webPreviewHistory:pe,webPreviewHistoryIndex:X,webPreviewLoading:yt,webPreviewModal:n,webPreviewTab:i}=c;return e.jsxs(e.Fragment,{children:[e.jsx(jt,{children:R&&e.jsx("div",{style:r.modalOverlay,onClick:()=>oe(null),children:e.jsxs(rt.div,{style:r.modalCard,onClick:t=>t.stopPropagation(),initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},children:[R==="storage"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:r.modalTitle,children:"📁 Kho tệp tin đã scan"}),e.jsx("div",{style:r.modalSubtitle,children:vr.email})]}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsx("div",{style:r.modalBody,children:br?e.jsxs("div",{style:r.modalLoading,children:[e.jsx(vt,{size:"md"}),e.jsx("span",{style:{marginTop:"8px",fontSize:"0.82rem"},children:"Đang tải danh sách tệp tin từ VPS..."})]}):Mr.length===0?e.jsx("div",{style:r.emptySubText,children:"Không tìm thấy tệp tin đã scan nào trong thư mục này."}):e.jsx("div",{style:r.filesList,children:Mr.map((t,a)=>e.jsxs("div",{style:r.fileItemRow,children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("a",{href:`${BASE_URL}${t.url}`,target:"_blank",rel:"noreferrer",style:r.fileLinkName,children:t.name}),e.jsxs("div",{style:r.fileMetaDetails,children:["Dung lượng: ",Ke(t.size)," · Mtime: ",new Date(t.mtime).toLocaleString("vi-VN")]}),t.upload_completed_at&&e.jsxs("div",{style:r.fileUploadMeta,children:["Tải lên VPS: ",new Date(t.upload_completed_at).toLocaleTimeString("vi-VN"),t.upload_duration!=null?` (${t.upload_duration}s)`:""]})]}),e.jsx("a",{href:`${BASE_URL}${t.url}`,download:!0,target:"_blank",rel:"noreferrer",style:r.fileDownloadBtn,children:"Tải về"})]},a))})}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>_(vr.lanUid,vr.email),children:"Làm mới danh sách"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>oe(null),children:"Đóng"})]})]}),R==="public_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:"➕ Tạo điểm scan"}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsxs("div",{style:r.modalBody,children:[e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:r.formLabel,children:"Tên điểm scan *"}),e.jsx("input",{type:"text",style:r.modalInput,placeholder:"VD: scan, scan-tang1, van-phong...",value:Qe.name,onChange:t=>ur(a=>({...a,name:t.target.value}))}),e.jsx("span",{style:r.formHelpText,children:"Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP."})]}),e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:r.formLabel,children:"Địa chỉ Email"}),e.jsx("input",{type:"email",style:r.modalInput,placeholder:"VD: goxprint@gmail.com",value:Qe.email,onChange:t=>ur(a=>({...a,email:t.target.value}))}),e.jsx("span",{style:r.formHelpText,children:"Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc)."})]}),e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:r.formLabel,children:"Relay Agent *"}),e.jsx("select",{style:r.modalInput,value:Qe.agentUid,onChange:t=>ur(a=>({...a,agentUid:t.target.value})),children:(Oe&&Oe.agents||[]).filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))})]})]}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:St,disabled:Jt,children:Jt?"Đang tạo...":"Tạo điểm scan"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>oe(null),children:"Hủy bỏ"})]})]}),R==="private_ftp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:"➕ Thêm Private FTP"}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsx("div",{style:r.modalBody,children:e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:r.formLabel,children:"Địa chỉ Email riêng *"}),e.jsx("input",{type:"email",style:r.modalInput,placeholder:"VD: user.pc1@gmail.com",value:lr.email,onChange:t=>Ct(a=>({...a,email:t.target.value}))}),e.jsxs("span",{style:r.formHelpText,children:["Cấu hình FTP riêng cho máy tính ",lr.agentUid]})]})}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:ut,disabled:ee,children:ee?"Đang tạo...":"Tạo FTP riêng"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>oe(null),children:"Hủy bỏ"})]})]}),R==="info_detail"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:r.modalTitle,children:"ℹ Chi tiết đăng ký điểm scan"}),e.jsxs("div",{style:r.modalSubtitle,children:["Đăng ký: #",infoDetailData.regNo," · ",infoDetailData.name]})]}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsx("div",{style:r.modalBody,children:infoDetailData.error?e.jsx("div",{style:{color:"var(--color-error)",fontSize:"0.85rem"},children:infoDetailData.error}):e.jsxs("div",{style:r.modalDetailsList,children:[e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Giao thức:"}),e.jsx("span",{style:{...r.detailValue,fontWeight:700,color:"var(--color-primary)"},children:(s=infoDetailData.details)==null?void 0:s.proto})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Server Host:"}),e.jsx("span",{style:r.detailValue,children:(o=infoDetailData.details)==null?void 0:o.server})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:r.detailValue,children:(l=infoDetailData.details)==null?void 0:l.port})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Đường dẫn tệp:"}),e.jsx("span",{style:{...r.detailValue,fontFamily:"monospace"},children:(h=infoDetailData.details)==null?void 0:h.path})]})]})}),e.jsx("div",{style:r.modalFooter,children:e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>oe(null),children:"Đóng cửa sổ"})})]}),R==="ftp_detail"&&Ee&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:r.modalTitle,children:"📂 Chi tiết dịch vụ FTP"}),e.jsxs("div",{style:r.modalSubtitle,children:["Cổng Port: ",Ee.port]})]}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>{oe(null),Rr(null)},children:"×"})]}),e.jsx("div",{style:r.modalBody,children:e.jsxs("div",{style:r.modalDetailsList,children:[e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Cổng Port:"}),e.jsx("span",{style:{...r.detailValue,fontWeight:700,color:"var(--color-primary)"},children:Ee.port})]}),e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Trạng thái:"}),e.jsx("span",{style:{...r.detailValue,fontWeight:700,color:Ee.error?"var(--color-error)":"var(--color-success)"},children:Ee.error?"Lỗi khởi chạy (ERROR)":"Đang hoạt động (RUNNING)"})]}),Ee.error&&e.jsxs("div",{style:r.detailRow,children:[e.jsx("span",{style:r.detailLabel,children:"Chi tiết lỗi:"}),e.jsx("span",{style:{...r.detailValue,color:"var(--color-error)"},children:Ee.error})]}),e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("span",{style:{...r.detailLabel,display:"block",marginBottom:"4px"},children:"Thư mục lưu trữ:"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.72rem",color:"var(--color-text)",background:"var(--color-inset-bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--color-surface-light)",wordBreak:"break-all",lineHeight:1.4},children:Ee.path})]})]})}),e.jsx("div",{style:r.modalFooter,children:e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{oe(null),Rr(null)},children:"Đóng cửa sổ"})})]}),R==="utilities"&&ft&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("div",{children:[e.jsx("h3",{style:r.modalTitle,children:"🛠️ Công cụ & Tiện ích Agent"}),e.jsxs("div",{style:r.modalSubtitle,children:["Máy: ",ft.hostname," · IP: ",ft.local_ip,":",ft.web_port||9173]})]}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>{oe(null),Ot(null),Be(null)},children:"×"})]}),e.jsxs("div",{style:{...r.modalBody,gap:"16px",display:"flex",flexDirection:"column"},children:[ae&&e.jsx("div",{style:{padding:"10px 12px",borderRadius:"8px",fontSize:"0.78rem",lineHeight:1.4,background:ae.isError?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",color:ae.isError?"#ef4444":"#10b981",border:`1px solid ${ae.isError?"rgba(239, 68, 68, 0.2)":"rgba(16, 185, 129, 0.2)"}`},children:ae.text}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"⚙️ Cài đặt tự động mở tệp scan"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",background:"var(--color-inset-bg)",padding:"12px",borderRadius:"8px",border:"1px solid var(--color-surface-light)"},children:Qr?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)"},children:[e.jsx(vt,{size:"sm"})," Đang tải cấu hình cài đặt..."]}):e.jsxs(e.Fragment,{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Xt,onChange:()=>Ne("scan_auto_open_file",Xt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở file khi có scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở trực tiếp file vừa scan bằng ứng dụng mặc định"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",fontSize:"0.8rem",color:"var(--color-text)"},children:[e.jsx("input",{type:"checkbox",checked:Lt,onChange:()=>Ne("scan_auto_open_dir",Lt),style:{width:"16px",height:"16px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:"Tự động mở thư mục scan mới"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)"})]})]}),e.jsx("hr",{style:{border:0,borderTop:"1px solid var(--color-surface-light)",margin:"4px 0"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500,fontSize:"0.8rem",color:"var(--color-text)"},children:"Lối tắt ngoài Desktop (%TEMP%/GoPrinxAgent/ftp)"}),e.jsx("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)"},children:"Tạo Shortcut thư mục Scan ra màn hình Desktop cho nhân viên dễ mở"})]}),e.jsx("button",{onClick:()=>{const t=Sr.find(a=>a.command==="create_scan_shortcut");t?ye("create_scan_shortcut",t.command_content):ye("create_scan_shortcut",`import os, sys, tempfile, subproce pathlib
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
else: raise RuntimeError(msg)`)},disabled:q!==null,style:{padding:"6px 12px",fontSize:"0.75rem",borderRadius:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-primary)",color:"var(--color-primary)",cursor:q!==null?"not-allowed":"pointer",whiteSpace:"nowrap",fontWeight:600,display:"flex",alignItems:"center",gap:"5px"},children:"🔗 Tạo Shortcut Desktop"})]})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsx("h4",{style:{margin:0,fontSize:"0.8rem",fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"🖥️ Công cụ hệ thống Windows"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"10px"},children:[Xr?e.jsxs("div",{style:{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.75rem",color:"var(--color-text-secondary)",padding:"8px 0",justifyContent:"center"},children:[e.jsx(vt,{size:"sm"})," Đang tải danh sách lệnh..."]}):e.jsxs(e.Fragment,{children:[Sr.length>0?Sr.filter(t=>t.command!=="dxdiag"&&t.command!=="open_web_setting").map(t=>{const a=t.command==="emergency_restart";return e.jsxs("button",{onClick:()=>ye(t.command,t.command_content),disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:a?"1px solid rgba(239, 68, 68, 0.25)":"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:x=>{q===null&&(x.currentTarget.style.borderColor=a?"#ef4444":"var(--color-primary)",x.currentTarget.style.background=a?"rgba(239, 68, 68, 0.05)":"rgba(59, 130, 246, 0.05)")},onMouseLeave:x=>{x.currentTarget.style.borderColor=a?"rgba(239, 68, 68, 0.25)":"var(--color-surface-light)",x.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q===t.command?e.jsx(vt,{size:"sm"}):t.icon||"🔧"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:a?"#ef4444":"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:t.label})]},t.command)}):e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>$("printers"),disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="printers"?e.jsx(vt,{size:"sm"}):"🖨️"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Danh sách Máy in"})]}),e.jsxs("button",{onClick:()=>$("scan"),disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="scan"?e.jsx(vt,{size:"sm"}):"📂"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Thư mục Scan"})]})]}),e.jsxs("button",{onClick:()=>{if(!ft)return;Ft("check_watchdog"),Be({text:"⌛ Đang kiểm tra watchdog...",isError:!1}),triggerAgentUtilityExec(ft.agent_uid,"check_watchdog",`import subproce os, sys
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
raise RuntimeError('\\n'.join(lines))`).then(a=>{if(a.ok&&a.command_id){const w=Date.now(),K=setInterval(async()=>{if(Date.now()-w>3e4){clearInterval(K),Be({text:"⏱️ Timeout chờ kết quả (30s)",isError:!0}),Ft(null);return}try{const O=await getCommandStatus(a.command_id);if(O.status==="success"){clearInterval(K);const Re=O.result_payload||O.result||O.error||"Hoàn thành";at({isOpen:!0,title:"🩺 Check Watchdog",content:Re}),Be(null),Ft(null)}else if(O.status==="failed"){clearInterval(K);const Re=O.error||O.result_payload||O.result||"Failed";at({isOpen:!0,title:"🩺 Check Watchdog",content:Re}),Be(null),Ft(null)}}catch{}},2e3)}else Be({text:"❌ "+(a.error||"Không thể gửi lệnh"),isError:!0}),Ft(null)}).catch(a=>{Be({text:"❌ "+a.message,isError:!0}),Ft(null)})},disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="var(--color-primary)",t.currentTarget.style.background="rgba(59, 130, 246, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="var(--color-surface-light)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="check_watchdog"?e.jsx(vt,{size:"sm"}):"🩺"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text)",lineHeight:"1.2",wordBreak:"break-word"},children:"Check watchdog"})]}),e.jsxs("button",{onClick:Y,disabled:q!==null,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",background:"var(--color-surface-light)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"12px",padding:"16px 8px",cursor:q!==null?"not-allowed":"pointer",textAlign:"center",width:"100%",transition:"all 0.2s",opacity:q!==null?.6:1,minHeight:"108px",boxSizing:"border-box"},onMouseEnter:t=>{q===null&&(t.currentTarget.style.borderColor="#ef4444",t.currentTarget.style.background="rgba(239, 68, 68, 0.05)")},onMouseLeave:t=>{t.currentTarget.style.borderColor="rgba(239, 68, 68, 0.25)",t.currentTarget.style.background="var(--color-surface-light)"},children:[e.jsx("div",{style:{fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center"},children:q==="emergency_restart"?e.jsx(vt,{size:"sm"}):"🔌"}),e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#ef4444",lineHeight:"1.2",wordBreak:"break-word"},children:"Emergency Kill"})]})]}),e.jsxs("div",{style:{background:"var(--color-surface-light)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 12px",gridColumn:"1 / -1"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"💻"}),e.jsx("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"var(--color-text)"},children:"Thực hiện lệnh Run"})]}),e.jsxs("div",{style:{display:"flex",gap:"6px",marginBottom:"8px"},children:[e.jsx("input",{type:"text",value:v,onChange:t=>Er(t.target.value),onKeyDown:t=>{t.key==="Enter"&&v.trim()&&$("run_command",{command_line:v.trim()})},placeholder:"Nhập lệnh cần chạy...",disabled:q!==null,style:{flex:1,padding:"6px 10px",borderRadius:"6px",border:"1px solid var(--color-border)",background:"var(--color-surface)",color:"var(--color-text)",fontSize:"0.78rem",outline:"none",fontFamily:"monospace"}}),e.jsx("button",{onClick:()=>{v.trim()&&$("run_command",{command_line:v.trim()})},disabled:q!==null||!v.trim(),style:{padding:"6px 14px",borderRadius:"6px",border:"none",background:v.trim()?"var(--color-primary)":"var(--color-surface)",color:v.trim()?"#fff":"var(--color-text-secondary)",fontSize:"0.75rem",fontWeight:600,cursor:v.trim()&&q===null?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px"},children:q==="run_command"?e.jsx(vt,{size:"sm"}):"▶ Run"})]}),e.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[{label:"dxdiag",cmd:"dxdiag",desc:"Cấu hình phần cứng"},{label:"msconfig",cmd:"msconfig",desc:"Cấu hình hệ thống"},{label:"ping",cmd:"ping google.com",desc:"Kiểm tra mạng"}].map(t=>e.jsx("button",{onClick:()=>Er(t.cmd),disabled:q!==null,title:t.desc,style:{padding:"3px 10px",borderRadius:"12px",border:"1px solid var(--color-border)",background:v===t.cmd?"rgba(59, 130, 246, 0.15)":"var(--color-surface)",color:v===t.cmd?"var(--color-primary)":"var(--color-text-secondary)",fontSize:"0.68rem",cursor:q!==null?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"monospace"},children:t.label},t.cmd))})]})]})]})]}),e.jsx("div",{style:r.modalFooter,children:e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.85rem"},onClick:()=>{oe(null),Ot(null),Be(null)},children:"Đóng cửa sổ"})})]}),R==="edit_ip"&&ze&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:" Thay đổi IP / Cấu hình FTP"}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsxs("div",{style:r.modalBody,children:[e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"14px"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Chọn nhanh IP từ danh sách Agent:"}),e.jsxs("select",{style:{width:"100%",padding:"10px 12px",background:"var(--color-surface)",color:"var(--color-text)",border:"1px solid var(--color-border)",borderRadius:"6px",fontSize:"0.85rem",cursor:"pointer"},value:"",onChange:t=>{const a=t.target.value;a&&Zt(x=>{if(!x)return null;const w=x.newPort||"2130";return{...x,newIp:`${a}:${w}`,newPort:w}})},children:[e.jsx("option",{value:"",children:"-- Chọn Agent --"}),((Oe==null?void 0:Oe.agents)||[]).map((t,a)=>{const x=t.local_ip||t.ip||"",w=t.hostname||t.uid||`Agent ${a+1}`;return e.jsxs("option",{value:x,children:[w," (",x,")"]},a)})]})]}),e.jsxs("div",{style:{width:"100px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Cổng FTP:"}),e.jsx("input",{type:"text",value:ze.newPort||"",onChange:t=>{const a=t.target.value;Zt(x=>{if(!x)return null;let w=x.newIp||"";return w.includes(":")&&(w=w.split(":")[0]),{...x,newPort:a,newIp:a?`${w}:${a}`:w}})},placeholder:"2130",style:r.modalInput})]})]}),e.jsxs("div",{style:{marginBottom:"14px"},children:[e.jsx("label",{style:{display:"block",fontSize:"0.75rem",color:"var(--color-text-secondary)",marginBottom:"6px",fontWeight:600},children:"Địa chỉ FTP (IP:PORT):"}),e.jsx("input",{type:"text",value:ze.newIp,onChange:t=>{const a=t.target.value;Zt(x=>{if(!x)return null;let w=x.newPort||"2130";return a.includes(":")&&(w=a.split(":")[1].trim()||w),{...x,newIp:a,newPort:w}})},placeholder:"Ví dụ: 192.168.1.100:2130",style:r.modalInput})]}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"var(--color-text-secondary)",marginTop:"8px",fontStyle:"italic"},children:["Đường dẫn hiện tại trên máy in: ",ze.entry.folder||ze.entry.physical_path||ze.entry.folder_path]})]}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,background:"none",border:"1px solid var(--color-border)",color:"var(--color-text-secondary)",padding:"8px 16px"},onClick:()=>oe(null),children:"Hủy bỏ"}),e.jsx("button",{style:{...r.smallBtn,background:"var(--color-primary)",border:"none",color:"#fff",padding:"8px 16px",fontWeight:"bold"},onClick:()=>{if(!(ze.newIp||"").trim().includes(":")){Ge("Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)","error");return}_e()},disabled:!ze.newIp.trim(),children:"Lưu lại"})]})]}),R==="remote_lock"&&Ye&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:"🔒 Khóa / Mở khóa máy từ xa"}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsxs("div",{style:r.modalBody,children:[e.jsxs("p",{style:{margin:"0 0 16px 0",fontSize:"0.95rem",color:"var(--color-text)"},children:["Máy: ",e.jsx("strong",{children:Ye.name})," (",Ye.ip,")"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#fee2e2",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{oe(null),Ge(`Đang gửi lệnh khóa máy ${Ye.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ye.ip,action:"lock_machine",agent_uid:Ye.agentUid}).then(t=>{t.ok?Ge(`Đã gửi lệnh khóa máy ${Ye.name} thành công!`,"success"):Ge("Lỗi: "+(t.error||"Failed"),"error")}).catch(t=>{Ge("Lỗi: "+t.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔒"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#dc2626"},children:"Khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#7f1d1d"},children:"Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy"})]})]}),e.jsxs("button",{style:{display:"flex",alignItems:"center",gap:"12px",background:"#dcfce7",border:"1px solid #22c55e",borderRadius:"8px",padding:"12px 14px",cursor:"pointer",textAlign:"left"},onClick:()=>{oe(null),Ge(`Đang gửi lệnh mở khóa máy ${Ye.name}...`,"info",3e3),modifyDeviceAddressss({ip:Ye.ip,action:"enable_machine",agent_uid:Ye.agentUid}).then(t=>{t.ok?Ge(`Đã gửi lệnh mở khóa máy ${Ye.name} thành công!`,"success"):Ge("Lỗi: "+(t.error||"Failed"),"error")}).catch(t=>{Ge("Lỗi: "+t.message,"error")})},children:[e.jsx("div",{style:{fontSize:"1.4rem"},children:"🔓"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#16a34a"},children:"Mở khóa máy"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#14532d"},children:"Tắt xác thực User Code, cho phép sử dụng máy tự do"})]})]})]})]})]}),R==="toshiba_vnc"&&_t&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("h3",{style:r.modalTitle,children:["📺 Kết nối VNC - ",_t.printerName]}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>oe(null),children:"×"})]}),e.jsx("div",{style:r.modalBody,children:g?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 0",gap:"16px"},children:[e.jsx("div",{style:{border:"4px solid rgba(255,255,255,0.1)",width:"36px",height:"36px",borderRadius:"50%",borderLeftColor:"#10b981",animation:"spin 1s linear infinite"}}),e.jsx("div",{style:{fontSize:"0.9rem",color:"var(--color-text-secondary)"},children:"Đang khởi tạo đường hầm VNC bảo mật qua Agent..."})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("div",{style:{border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"14px",background:"rgba(0,0,0,0.2)"},children:ne?e.jsxs("div",{style:{textAlign:"center",padding:"20px 10px"},children:[e.jsx("p",{style:{color:"#34d399",fontWeight:600,fontSize:"0.85rem",marginBottom:"14px"},children:"🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:"}),e.jsx("button",{onClick:()=>{oe(null),window.open(`http://${_t.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`,"_blank")},style:{background:"#3b82f6",border:"none",borderRadius:"6px",padding:"10px 20px",color:"white",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(59, 130, 246, 0.3)"},children:"🌐 Mở Web VNC Nội Mạng"})]}):fe?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{position:"relative",border:"1px solid var(--color-surface-light)",borderRadius:"6px",overflow:"hidden",width:"100%",maxWidth:"800px",background:"#000",cursor:"crosshair",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"},children:e.jsx("img",{id:"vnc-live-viewport",src:`${BASE_URL}/api/vnc/stream?agent_uid=${_t.agentUid}&ip=${_t.ip}&port=49105&t=${Date.now()}`,alt:"Màn hình Live VNC",onClick:async t=>{const a=t.currentTarget.getBoundingClientRect(),x=t.clientX-a.left,w=t.clientY-a.top,K=x/a.width,O=w/a.height,Re=Math.round(K*1024),me=Math.round(O*600);try{await fetch(`${BASE_URL}/api/vnc/click`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_uid:_t.agentUid,ip:_t.ip,port:49105,x:Re,y:me})})}catch(He){console.error("VNC Click error:",He)}},style:{display:"block",width:"100%",height:"auto",pointerEvents:"auto"}})}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#a78bfa",fontWeight:500},children:"⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)"})]}):e.jsx("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",textAlign:"center",padding:"10px"},children:"Đang kết nối luồng hình ảnh..."})}),!ne&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Địa chỉ VPS: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:fe})," (Pass: ",e.jsx("strong",{style:{color:"white",fontFamily:"monospace"},children:"d9kvgn"}),")"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(fe),Ge("Đã sao chép địa chỉ VNC","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép IP"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText("d9kvgn"),Ge("Đã sao chép mật khẩu","success")},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"4px",padding:"4px 8px",color:"white",fontSize:"0.7rem",cursor:"pointer"},children:"Sao chép Pass"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"4px"},children:[e.jsx("a",{href:`vnc://${fe}`,style:{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",textDecoration:"none",background:"rgba(16, 185, 129, 0.1)",border:"1px solid #10b981",borderRadius:"6px",padding:"8px 12px",color:"#10b981",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🚀 Mở bằng VNC App ngoài"}),e.jsx("button",{onClick:()=>{oe(null),J(_t.ip,"","GET",null,!1,_t.agentUid,49106)},style:{flex:1,background:"rgba(59, 130, 246, 0.1)",border:"1px solid #3b82f6",borderRadius:"6px",padding:"8px 12px",color:"#3b82f6",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},children:"🌐 Thử mở Web noVNC"})]})]})]})})]})]})})}),e.jsx(jt,{children:xe.isOpen&&e.jsx("div",{style:r.confirmOverlay,onClick:()=>Qt(t=>({...t,isOpen:!1})),children:e.jsxs(rt.div,{style:r.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsxs("h3",{style:r.modalTitle,children:["⚠️ ",xe.title]}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>Qt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsx("div",{style:r.modalBody,children:e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:0,whiteSpace:"pre-line"},children:xe.message})}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:()=>{var t;Qt(a=>({...a,isOpen:!1})),(t=xe.onConfirm)==null||t.call(xe)},children:"Đồng ý"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Qt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(jt,{children:Ie.isOpen&&e.jsx("div",{style:r.confirmOverlay,onClick:()=>Yt(t=>({...t,isOpen:!1})),children:e.jsxs(rt.div,{style:{...r.confirmModalCard,maxWidth:"440px",width:"90%"},onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:"⚠️ Xác nhận xóa điểm scan"}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>Yt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:r.modalBody,children:[e.jsxs("div",{style:{marginBottom:"14px",color:"var(--color-text)",fontSize:"0.85rem",lineHeight:1.5},children:["Tên điểm scan: ",e.jsxs("strong",{children:['"',((m=Ie.entry)==null?void 0:m.name)||((p=Ie.entry)==null?void 0:p.name_1)||((j=Ie.entry)==null?void 0:j.email_address)||((I=Ie.entry)==null?void 0:I.folder)||((C=Ie.entry)==null?void 0:C.registration_no)||"không tên",'"']}),((P=Ie.entry)==null?void 0:P.registration_no)&&e.jsxs("span",{style:{display:"block",color:"var(--color-muted)",fontSize:"0.78rem",marginTop:"2px"},children:["Mã đăng ký: #",(S=Ie.entry)==null?void 0:S.registration_no]})]}),e.jsxs("div",{style:r.formGroup,children:[e.jsx("label",{style:r.formLabel,children:"Relay Agent thực thi *"}),e.jsx("select",{style:r.modalInput,value:Ie.agentUid,onChange:t=>Yt(a=>({...a,agentUid:t.target.value})),children:(Oe&&Oe.agents||[]).filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))}),e.jsx("span",{style:r.formHelpText,children:"Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy."})]})]}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-error)",borderColor:"var(--color-error)",color:"white"},onClick:ht,children:"Xác nhận xóa"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Yt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(jt,{children:he.isOpen&&e.jsx("div",{style:r.confirmOverlay,onClick:()=>Tt(t=>({...t,isOpen:!1})),children:e.jsxs(rt.div,{style:r.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:"📦 Cài đặt Driver từ xa"}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>Tt(t=>({...t,isOpen:!1})),children:"×"})]}),e.jsxs("div",{style:r.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.82rem",color:"var(--color-text)",lineHeight:1.4,margin:"0 0 12px 0"},children:["Bạn chuẩn bị cài đặt driver ",e.jsxs("strong",{children:['"',he.driverName,'"']})," từ xa."]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",fontWeight:600},children:"Chọn Máy đại diện (Agent) để thực hiện cài đặt:"}),e.jsx("select",{style:{width:"100%",padding:"10px",borderRadius:"6px",background:"var(--color-input-bg)",border:"1px solid var(--color-border)",color:"var(--color-text)",fontSize:"0.82rem"},value:he.selectedAgentUid,onChange:t=>Tt(a=>({...a,selectedAgentUid:t.target.value})),children:!(Oe!=null&&Oe.agents)||Oe.agents.filter(t=>t.is_agent_active).length===0?e.jsx("option",{value:"",children:"(Không có Agent online trong LAN này)"}):Oe.agents.filter(t=>t.is_agent_active).map(t=>e.jsxs("option",{value:t.agent_uid,children:[t.hostname," (",t.local_ip,")"]},t.agent_uid))})]})]}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},disabled:!he.selectedAgentUid,onClick:()=>{Tt(t=>({...t,isOpen:!1})),mt(he.printerId,he.brand,he.model,he.driverName,he.driverUrl,he.selectedAgentUid)},children:"Bắt đầu cài đặt"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Tt(t=>({...t,isOpen:!1})),children:"Hủy bỏ"})]})]})})}),e.jsx(jt,{children:u.isOpen&&e.jsx("div",{style:{...r.confirmOverlay,zIndex:170},onClick:()=>st(t=>({...t,isOpen:!1,error:""})),children:e.jsxs(rt.div,{style:r.confirmModalCard,onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:r.modalTitle,children:u.title}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>st(t=>({...t,isOpen:!1,error:""})),children:"×"})]}),e.jsxs("div",{style:r.modalBody,children:[e.jsxs("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 10px 0",lineHeight:1.5},children:[u.hint," Ví dụ: ",e.jsx("code",{style:{background:"var(--color-surface-light)",padding:"1px 5px",borderRadius:4},children:"192.168.1.15"})]}),e.jsx("input",{autoFocus:!0,type:"text",value:u.value,onChange:t=>st(a=>({...a,value:t.target.value,error:""})),onKeyDown:t=>{if(t.key==="Enter"){const a=/^(\d{1,3}\.){3}\d{1,3}$/;if(!a.test(u.value.trim())){st(K=>({...K,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const x=(u.changeAllTo||"").trim();if(x&&!a.test(x)){st(K=>({...K,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const w=u.onConfirm;st(K=>({...K,isOpen:!1,error:""})),w(u.value.trim(),x)}t.key==="Escape"&&st(a=>({...a,isOpen:!1,error:""}))},placeholder:"192.168.1.x",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:u.error?"1.5px solid var(--color-error)":"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:t=>{u.error||(t.target.style.borderColor="var(--color-primary)")},onBlur:t=>{u.error||(t.target.style.borderColor="var(--color-surface-light)")}}),u.title.includes("Kiểm tra")&&e.jsxs("div",{style:{marginTop:"12px"},children:[e.jsx("p",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",margin:"0 0 6px 0",lineHeight:1.5},children:"Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):"}),e.jsx("input",{type:"text",value:u.changeAllTo||"",onChange:t=>st(a=>({...a,changeAllTo:t.target.value,error:""})),placeholder:"Ví dụ: 192.168.1.43",style:{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid var(--color-surface-light)",background:"var(--color-background)",color:"var(--color-text)",fontSize:"0.9rem",fontFamily:"monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"},onFocus:t=>{t.target.style.borderColor="var(--color-primary)"},onBlur:t=>{t.target.style.borderColor="var(--color-surface-light)"}})]}),u.error&&e.jsxs("p",{style:{margin:"6px 0 0 0",fontSize:"0.72rem",color:"var(--color-error)"},children:["⚠️ ",u.error]}),u.scanStatus&&e.jsx("div",{style:{marginTop:"10px",padding:"8px 10px",borderRadius:"6px",background:"var(--color-surface-light)",fontSize:"0.74rem",color:"var(--color-text-secondary)",lineHeight:1.4,whiteSpace:"pre-wrap",border:"1px solid var(--color-surface-border)"},children:u.scanStatus})]}),e.jsxs("div",{style:r.modalFooter,children:[e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const t=/^(\d{1,3}\.){3}\d{1,3}$/;if(!t.test(u.value.trim())){st(w=>({...w,error:"IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x"}));return}const a=(u.changeAllTo||"").trim();if(a&&!t.test(a)){st(w=>({...w,error:"IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống."}));return}const x=u.onConfirm;st(w=>({...w,isOpen:!1,error:""})),x(u.value.trim(),a)},children:"✅ Xác nhận"}),e.jsx("button",{style:{...r.smallBtn,padding:"10px 16px",fontSize:"0.82rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>st(t=>({...t,isOpen:!1,error:""})),children:"Hủy"})]})]})})}),e.jsx(jt,{children:tt.isOpen&&e.jsx("div",{style:{...r.confirmOverlay,zIndex:180,alignItems:"flex-start",paddingTop:"5vh"},onClick:()=>at(t=>({...t,isOpen:!1})),children:e.jsxs(rt.div,{style:{...r.confirmModalCard,maxWidth:"680px",width:"95%",maxHeight:"88vh",display:"flex",flexDirection:"column"},onClick:t=>t.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:{...r.modalTitle,fontSize:"0.85rem"},children:tt.title}),e.jsx("button",{style:r.modalCloseBtn,onClick:()=>at(t=>({...t,isOpen:!1})),children:"×"})]}),tt.title.includes("settings.json")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:[e.jsx("textarea",{ref:Kt,value:pt,onChange:t=>zr(t.target.value),style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.72rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",color:"var(--color-text)",minHeight:"380px",outline:"none",resize:"none"}}),kt&&e.jsx("div",{style:{marginTop:8,fontSize:11,padding:"6px 10px",borderRadius:6,background:kt.startsWith("❌")?"rgba(239,68,68,0.1)":kt.startsWith("✔️")?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",color:kt.startsWith("❌")?"#f87171":kt.startsWith("✔️")?"#4ade80":"var(--color-warning)",border:`1px solid ${kt.startsWith("❌")?"rgba(239,68,68,0.15)":kt.startsWith("✔️")?"rgba(34,197,94,0.15)":"rgba(234,179,8,0.15)"}`},children:kt})]}):e.jsx("pre",{ref:Kt,style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.55,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)",minHeight:0},children:Ve(tt.content)}),e.jsxs("div",{style:{...r.modalFooter,marginTop:"10px"},children:[tt.title.includes("settings.json")&&e.jsx("button",{disabled:it,style:{...r.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:it?"rgba(99,102,241,0.6)":"var(--color-primary)",borderColor:"var(--color-primary)",color:"#fff",cursor:it?"not-allowed":"pointer"},onClick:Ce,children:it?"⌛ Đang lưu...":"💾 Lưu cấu hình"}),e.jsx("button",{style:{...r.smallBtn,padding:"8px 14px",fontSize:"0.78rem"},onClick:()=>{navigator.clipboard.writeText(tt.title.includes("settings.json")?pt:Ve(tt.content)).catch(()=>{})},children:"📋 Copy"}),e.jsx("button",{style:{...r.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>at(t=>({...t,isOpen:!1})),children:"Đóng"})]})]})})}),e.jsx(jt,{children:n&&n.isOpen&&e.jsxs("div",{className:"web-preview-modal-overlay",style:{...r.confirmOverlay,zIndex:190,alignItems:"flex-start",paddingTop:"5vh"},onClick:gt,children:[e.jsx("style",{children:`
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
            `}),(()=>{let t="Trang cấu hình máy in";if(n.html&&n.html!=="LOADING"&&!n.html.startsWith("ERROR:"))if(n.html==="DIRECT_LAN")t="Kết nối trực tiếp LAN";else{const a=n.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);a&&a[1]&&(t=a[1].trim())}return e.jsxs(rt.div,{className:"web-preview-modal-card",style:{...r.confirmModalCard,maxWidth:"1200px",width:"95%",height:"85vh",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px"},onClick:a=>a.stopPropagation(),initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs("div",{style:r.modalHeader,children:[e.jsx("h3",{style:{...r.modalTitle,fontSize:"0.85rem"},children:n.title}),e.jsx("button",{style:r.modalCloseBtn,onClick:gt,children:"×"})]}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",gap:"15px",minHeight:0},children:n.html==="LOADING"?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px"},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"var(--color-text-secondary)",fontWeight:500},children:"Đang đợi phản hồi từ Agent..."}),e.jsx("span",{style:{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",textAlign:"center",maxWidth:"320px"},children:"Agent đang kết nối trực tiếp đến máy in và nạp cấu hình..."})]}):n.html.startsWith("ERROR:")?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"300px",gap:"12px",padding:"20px",color:"var(--color-error)"},children:[e.jsx("span",{style:{fontSize:"2.2rem"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600,textAlign:"center"},children:"Lỗi lấy trang Web Setting từ Agent"}),e.jsx("pre",{style:{fontSize:"0.75rem",whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0,padding:"12px",background:"rgba(239, 68, 68, 0.08)",borderRadius:"8px",border:"1px solid rgba(239, 68, 68, 0.15)",width:"100%",boxSizing:"border-box",fontFamily:"monospace"},children:n.html.replace("ERROR:","").trim()})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255, 255, 255, 0.03)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"var(--color-text)"},children:e.jsxs("span",{children:["🔌 Kết nối: ",e.jsx("strong",{children:ne?"⚡ Trực tiếp LAN":"🌐 Qua Agent"})]})}),e.jsx("button",{onClick:()=>xr(!ir),style:{background:"none",border:"none",color:"var(--color-primary)",cursor:"pointer",fontWeight:600,fontSize:"0.72rem",display:"flex",alignItems:"center",gap:"4px"},children:ir?"Thu gọn ▲":"Cài đặt & Chi tiết ▼"})]}),ir&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",background:"rgba(16, 185, 129, 0.04)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 14px"},children:[e.jsxs("div",{style:{fontSize:"0.74rem",color:"var(--color-text-secondary)"},children:[e.jsx("span",{style:{color:"#10b981",fontWeight:700},children:"🟢 Kết nối Live:"})," ",t," (",e.jsx("span",{style:{fontFamily:"monospace"},children:n.ip}),")"]}),e.jsx("button",{onClick:()=>window.open(`http://${n.ip}/`,"_blank"),style:{padding:"6px 12px",fontSize:"0.72rem",fontWeight:600,background:"#10b981",border:"none",borderRadius:"6px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.15)"},children:"🌐 Mở trực tiếp LAN"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"8px 12px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.74rem",fontWeight:600,color:"var(--color-text)"},children:"🔗 Chế độ kết nối:"}),e.jsxs("div",{style:{display:"flex",gap:"6px"},children:[e.jsx("button",{onClick:()=>qe(!1),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:ne?"rgba(255,255,255,0.05)":"var(--color-primary)",color:ne?"var(--color-text-secondary)":"white",border:ne?"1px solid var(--color-surface-light)":"1px solid var(--color-primary)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"🔌 Qua Agent (Từ xa)"}),e.jsx("button",{onClick:()=>qe(!0),style:{padding:"4px 10px",fontSize:"0.70rem",fontWeight:600,background:ne?"#10b981":"rgba(255,255,255,0.05)",color:ne?"white":"var(--color-text-secondary)",border:ne?"1px solid #10b981":"1px solid var(--color-surface-light)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease"},children:"⚡ Trực tiếp LAN (Cùng Wifi)"})]})]}),ne&&window.location.protocol==="https:"&&e.jsxs("div",{style:{color:"#fbbf24",background:"rgba(251, 191, 36, 0.08)",border:"1px solid rgba(251, 191, 36, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["⚠️ ",e.jsx("strong",{children:"Mixed Content Block:"})," Trình duyệt di động/máy tính sẽ chặn kết nối HTTP trực tiếp đến IP máy in từ trang web bảo mật HTTPS. Để kết nối trực tiếp thành công, hãy mở trang web quản trị qua ",e.jsx("strong",{children:"HTTP"})," hoặc click nút ",e.jsx("strong",{children:"🌐 Mở trực tiếp LAN"})," phía trên để truy cập trong tab mới."]}),ne&&e.jsxs("div",{style:{color:"#60a5fa",background:"rgba(96, 165, 250, 0.08)",border:"1px solid rgba(96, 165, 250, 0.25)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:["💡 ",e.jsx("strong",{children:"Chế độ trực tiếp LAN:"})," Thiết bị kết nối trực tiếp đến IP máy in qua mạng Wifi nội bộ.",e.jsxs("ul",{style:{margin:"4px 0 0 16px",padding:0},children:[e.jsx("li",{children:"Thanh địa chỉ và Lịch sử duyệt sẽ không tự động cập nhật."}),e.jsx("li",{children:"Chức năng thu phóng (Ngang/Dọc) trong iframe không áp dụng (vui lòng zoom bằng thao tác vuốt)."})]})]}),!ne&&e.jsxs("div",{style:{color:"var(--color-text-secondary)",background:"rgba(255, 255, 255, 0.02)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.72rem",lineHeight:1.4},children:[e.jsx("strong",{style:{color:"var(--color-primary)"},children:"🛠️ Nhật ký & Thông số kết nối ngược (SSH Reverse Tunnel):"}),e.jsxs("div",{style:{marginTop:"6px",fontFamily:"monospace",display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy khách (Agent Uid):"})," ",n.agentUid]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Địa chỉ IP Máy in:"})," ",n.ip]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng dịch vụ máy in:"})," 80"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Máy chủ VPS:"})," 31.97.76.62"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Cổng kết nối trên VPS (Assigned Port):"})," ",n.url?n.url.split(":").pop():"Đang cấp phát..."]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Phương thức xác thực:"})," SSH Key pair (Root User)"]}),e.jsxs("div",{children:["• ",e.jsx("strong",{children:"Đường dẫn kết nối:"})," ",e.jsx("span",{style:{color:"var(--color-text)"},children:n.url||"N/A"})]}),n.url&&e.jsxs("div",{style:{color:"#fbbf24",marginTop:"4px"},children:["⚠️ Nếu Iframe hiển thị màn hình trắng / lỗi kết nối, có thể do trình duyệt chặn nội dung Mixed Content (HTTP trên trang HTTPS). Hãy click nút ",e.jsx("strong",{children:"🔗 Mở tab mới ↗"})," ở thanh điều khiển phía dưới để xem trực tiếp."]})]})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"6px 12px"},children:[e.jsx("button",{onClick:ge,disabled:X<=0,style:{background:"none",border:"none",color:X<=0?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:X<=0?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Back",children:"◀"}),e.jsx("button",{onClick:V,disabled:X>=pe.length-1,style:{background:"none",border:"none",color:X>=pe.length-1?"rgba(255,255,255,0.15)":"var(--color-text)",cursor:X>=pe.length-1?"not-allowed":"pointer",padding:"4px",fontSize:"0.8rem"},title:"Forward",children:"▶"}),e.jsx("button",{onClick:()=>J(n.ip,n.path),style:{background:"none",border:"none",color:"var(--color-text)",cursor:"pointer",padding:"4px",fontSize:"0.8rem",display:"flex",alignItems:"center"},title:"Refresh",children:"🔄"}),e.jsxs("div",{style:{flex:1,background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontFamily:"monospace",color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:["http://",n.ip,n.path||"/"]}),n.url&&e.jsx("a",{href:n.url,target:"_blank",rel:"noreferrer",style:{background:"var(--color-primary)",color:"white",border:"none",borderRadius:"4px",padding:"4px 10px",fontSize:"0.72rem",fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",marginLeft:"8px"},title:"Mở trang quản trị Web Image Monitor trong tab mới",children:"🔗 Mở tab mới ↗"})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"1px solid var(--color-surface-light)",gap:"15px",paddingBottom:"4px"},children:[e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:i==="iframe"?600:500,color:i==="iframe"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:i==="iframe"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>ct("iframe"),children:"🌐 Giao diện máy in"}),e.jsx("button",{style:{background:"none",border:"none",padding:"8px 12px",fontSize:"0.78rem",fontWeight:i==="html"?600:500,color:i==="html"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:i==="html"?"2px solid var(--color-primary)":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},onClick:()=>ct("html"),children:"📄 Xem mã HTML (Text)"})]}),i==="html"?e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px",flex:1,minHeight:0},children:ne?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"10px",color:"var(--color-text-secondary)",fontSize:"0.76rem",padding:"20px",textAlign:"center"},children:[e.jsx("span",{children:"📄 Chế độ trực tiếp LAN không tải mã nguồn về server."}),e.jsxs("span",{style:{fontSize:"0.70rem",color:"rgba(255,255,255,0.4)"},children:["Hãy chuyển sang chế độ ",e.jsx("strong",{children:"Qua Agent (Từ xa)"})," để phân tích và xem mã nguồn HTML của máy in."]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.72rem",fontWeight:600,color:"var(--color-text-secondary)"},children:"Mã nguồn HTML gốc từ máy in:"}),e.jsx("button",{style:{border:"none",background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",padding:"4px 10px",borderRadius:"6px",fontSize:"0.72rem",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"},onClick:()=>{navigator.clipboard.writeText(n.html),Ge("Đã copy mã HTML vào clipboard","success")},children:"📋 Copy HTML"})]}),e.jsx("pre",{style:{flex:1,overflow:"auto",margin:0,padding:"12px",background:"var(--color-background)",border:"1px solid var(--color-surface-light)",borderRadius:"8px",fontSize:"0.68rem",lineHeight:1.5,fontFamily:"'Consolas', 'Monaco', monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--color-text)"},children:n.html})]})}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1,minHeight:0},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"var(--color-surface)",border:"1px solid var(--color-surface-light)",borderRadius:"6px",padding:"8px 12px",fontSize:"0.74rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↔️ Ngang:"}),e.jsx("button",{onClick:()=>{const a=Math.max(.3,parseFloat((H-.05).toFixed(2)));et(a),ke&&Ue(a)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:H,onChange:a=>{const x=parseFloat(a.target.value);et(x),ke&&Ue(x)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)"}}),e.jsx("button",{onClick:()=>{const a=Math.min(2,parseFloat((H+.05).toFixed(2)));et(a),ke&&Ue(a)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:"var(--color-text)"},children:[Math.round(H*100),"%"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{color:"var(--color-text-secondary)",fontWeight:600},children:"↕️ Dọc:"}),e.jsx("button",{onClick:()=>{const a=Math.max(.3,parseFloat((lt-.05).toFixed(2)));Ue(a),ke&&et(a)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ke,children:"-"}),e.jsx("input",{type:"range",min:"0.3",max:"2.0",step:"0.05",value:lt,onChange:a=>{const x=parseFloat(a.target.value);Ue(x),ke&&et(x)},style:{width:"80px",cursor:"pointer",accentColor:"var(--color-primary)",opacity:ke?.5:1},disabled:ke}),e.jsx("button",{onClick:()=>{const a=Math.min(2,parseFloat((lt+.05).toFixed(2)));Ue(a),ke&&et(a)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"2px 6px",borderRadius:"4px",cursor:"pointer"},disabled:ke,children:"+"}),e.jsxs("span",{style:{minWidth:"35px",textAlign:"right",fontWeight:600,color:ke?"var(--color-text-secondary)":"var(--color-text)"},children:[Math.round(lt*100),"%"]})]}),e.jsx("button",{onClick:()=>{Wr(!ke),ke||Ue(H)},style:{background:ke?"rgba(124, 106, 247, 0.15)":"var(--color-background)",border:ke?"1px solid var(--color-accent, #7c6af7)":"1px solid var(--color-surface-light)",color:ke?"var(--color-accent, #7c6af7)":"var(--color-text-secondary)",padding:"4px 10px",borderRadius:"6px",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",transition:"all 0.2s ease"},title:ke?"Bỏ liên kết tỷ lệ":"Liên kết tỷ lệ Ngang & Dọc",children:ke?"🔗 Đồng bộ":"🔓 Tự do"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("button",{onClick:()=>{et(.95),Ue(.95)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"Mặc định"}),e.jsx("button",{onClick:()=>{et(1),Ue(1)},style:{background:"var(--color-background)",border:"1px solid var(--color-surface-light)",color:"var(--color-text)",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:500},children:"100%"}),e.jsx("button",{onClick:()=>{var a;try{const x=It.current;if(!x)return;const w=x.contentDocument||((a=x.contentWindow)==null?void 0:a.document);if(w&&w.body){const K=w.body.style.width,O=w.body.style.transform;w.body.style.transform="none",w.body.style.width="auto";const Re=w.body.scrollWidth||w.documentElement.scrollWidth||1024,me=x.clientWidth||800;if(w.body.style.width=K,w.body.style.transform=O,Re>0&&me>0){let He=me/Re;He=Math.max(.3,Math.min(1.5,He)),He=Math.round(He*20)/20,et(He),ke&&Ue(He)}}}catch(x){console.error(x)}},style:{background:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)",color:"#10b981",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",fontWeight:600},children:"📐 Vừa khung"})]})]}),e.jsxs("div",{style:{flex:1,minHeight:0,background:"white",borderRadius:"8px",overflow:"hidden",border:"1px solid var(--color-surface-light)",position:"relative"},children:[e.jsx("iframe",{ref:It,src:n.url?n.url:ne?`http://${n.ip}${n.path||"/"}`:ar,style:{width:"100%",height:"100%",border:"none",background:"white"}}),yt&&e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px",zIndex:10},children:[e.jsxs("svg",{style:{width:"36px",height:"36px",color:"var(--color-primary)",animation:"spin 1s linear infinite"},xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{style:{opacity:.25},cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{style:{opacity:.75},fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{style:{fontSize:"0.85rem",color:"white",fontWeight:600},children:"Đang đợi phản hồi từ Agent..."})]})]})]})]})}),e.jsxs("div",{style:{...r.modalFooter,marginTop:"15px",flexShrink:0,borderTop:"1px solid var(--color-surface-light)",paddingTop:"12px"},children:[n.html!=="LOADING"&&!n.html.startsWith("ERROR:")&&e.jsx("button",{style:{...r.smallBtn,padding:"8px 14px",fontSize:"0.78rem",background:"var(--color-primary)",borderColor:"var(--color-primary)",color:"white"},onClick:()=>{const a=new Blob([n.html],{type:"text/html;charset=utf-8"}),x=URL.createObjectURL(a);window.open(x,"_blank")},children:"↗️ Xem mã HTML gốc"}),e.jsx("button",{style:{...r.smallBtn,padding:"8px 14px",fontSize:"0.78rem",borderColor:"var(--color-secondary)",color:"var(--color-secondary)",marginLeft:"8px"},onClick:()=>qr(a=>a?{...a,isOpen:!1}:null),children:"Đóng"})]})]})})()]})}),e.jsx(jt,{children:Me.isOpen&&e.jsx(rt.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"},onClick:()=>fr(t=>({...t,isOpen:!1})),children:e.jsxs(rt.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},style:{background:"#121826",border:"1px solid rgba(0, 204, 255, 0.3)",borderRadius:"16px",width:"100%",maxWidth:"680px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 50px rgba(0,0,0,0.6)",overflow:"hidden"},onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{style:{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 204, 255, 0.05)"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.05rem",color:"#00ccff",display:"flex",alignItems:"center",gap:"8px"},children:"📋 Tệp dữ liệu scan_points.json"}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)",marginTop:"4px"},children:[Me.copierName," · MAC: ",Me.macId||"N/A"]})]}),e.jsx("button",{style:{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:"1.3rem",cursor:"pointer"},onClick:()=>fr(t=>({...t,isOpen:!1})),children:"✕"})]}),e.jsx("div",{style:{padding:"16px 20px",overflowY:"auto",flex:1},children:Me.loading?e.jsx("div",{style:{textAlign:"center",padding:"40px 0",color:"#00ccff"},children:"⏳ Đang tải nội dung tệp scan_points.json..."}):e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--color-text-secondary)"},children:["Local Agent path: ",e.jsx("code",{style:{color:"#00ccff"},children:".../GoPrinxAgent/scan_points.json"})]}),e.jsx("button",{style:{background:"rgba(0, 255, 136, 0.15)",border:"1px solid rgba(0, 255, 136, 0.3)",color:"#00ff88",padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",cursor:"pointer",fontWeight:600},onClick:()=>{navigator.clipboard.writeText(JSON.stringify(Me.jsonData,null,2)),Ge("Đã sao chép nội dung scan_points.json!","success")},children:"📋 Copy JSON"})]}),e.jsx("pre",{style:{background:"#0a0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"14px",color:"#a0aec0",fontSize:"0.8rem",fontFamily:"Consolas, Monaco, monospace",overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,maxHeight:"450px"},children:JSON.stringify(Me.jsonData,null,2)})]})}),e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"flex-end",background:"rgba(0,0,0,0.2)"},children:e.jsx("button",{style:{background:"var(--color-surface-light)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"8px 18px",borderRadius:"8px",fontSize:"0.82rem",cursor:"pointer"},onClick:()=>fr(t=>({...t,isOpen:!1})),children:"Đóng"})})]})})})]})}const bt="https://agentapi.quanlymay.com",Vn=(c={})=>{const{...W}=c,[F,R]=d.useState([]),[De,fe]=d.useState(()=>localStorage.getItem("goxprint_selected_lan_uid")||""),[be,ue]=d.useState(!1),[L,je]=d.useState(""),[f,se]=d.useState(()=>{const n=localStorage.getItem("goxprint_active_tab");return n==="agents"||n==="copiers"||n==="cameras"?n:"agents"}),[Q,de]=d.useState({}),[N,xe]=d.useState(()=>{try{const n=localStorage.getItem("goxprint_expanded_printers");return n?JSON.parse(n):{}}catch{return{}}}),[We,B]=d.useState({}),[v,Ie]=d.useState({}),[ne,ze]=d.useState({}),[pt,$e]=d.useState({}),[mt,ve]=d.useState({}),[Se,ce]=d.useState(()=>{try{const n=sessionStorage.getItem("gox_live_address_books");return n?JSON.parse(n):window._liveAddressBooksCache||{}}catch{return window._liveAddressBooksCache||{}}}),we=d.useCallback(n=>{ce(i=>{const s=typeof n=="function"?n(i):n;try{window._liveAddressBooksCache=s,sessionStorage.setItem("gox_live_address_books",JSON.stringify(s))}catch{}return s})},[]),[Pe,J]=d.useState([]),[Je,Ke]=d.useState(!1),[Ve,Ee]=d.useState(null),[Et,G]=d.useState({id:null,camera_name:"Camera mới",rtsp_url:"",segment_duration:60,prefix:"rec",video_codec:"copy",audio_codec:"copy",no_audio:!0}),[At,ut]=d.useState(null),[St,gt]=d.useState([]),[ht,wt]=d.useState([]),[Ut,A]=d.useState(null),[k,U]=d.useState(!1),[Y,z]=d.useState(""),[ge,V]=d.useState(10),[_,T]=d.useState(""),[Z,M]=d.useState(!1),[b,y]=d.useState(!1),[ie,Ae]=d.useState(null),[_e,Ce]=d.useState(!1),[E,nt]=d.useState(30),[qe,Ne]=d.useState(30);d.useEffect(()=>{Z||Ae(null)},[Z]),d.useEffect(()=>{window.fnGetCookie=n=>"",window.fnSetCookie=(n,i)=>{},window.fnGetLocalestring=n=>"",window.fnGetHelp=n=>{}},[]);const[$,ye]=d.useState([]),[Xe,he]=d.useState(null),[u,Rt]=d.useState(null),[it,Bt]=d.useState(null),[wr,Tr]=d.useState(null),[ke,Kt]=d.useState(null),[Cr,ar]=d.useState(""),[It,lr]=d.useState(!1),[ee,Qe]=d.useState(null),[Jt,dr]=d.useState(!1),[qt,kr]=d.useState(()=>localStorage.getItem("goxprint_direct_lan")==="true");d.useEffect(()=>{localStorage.setItem("goxprint_direct_lan",String(qt))},[qt]);const jr=n=>{const i=(n||"").toLowerCase();return i.includes("ricoh")||i.includes("savin")||i.includes("aficio")||i.includes("gestetner")||i.includes("lanier")||i.includes("infotec")||i.includes("mp ")||i.startsWith("mp")||i.includes("im ")||i.startsWith("im")||i.includes("pro ")||i.startsWith("pro")?"ricoh":i.includes("toshiba")?"toshiba":"other"},[Fr,Ye]=d.useState("iframe"),[Ur,Br]=d.useState(()=>window.innerWidth>=768),[Gt,H]=d.useState([]),[lt,Lt]=d.useState(-1),[Xt,Me]=d.useState(""),[Dt,zt]=d.useState(.95),[Oe,Ht]=d.useState(.95),[Nt,ft]=d.useState(!0),Ze=d.useRef(null),oe=d.useRef(null),Wt=d.useRef({}),[Ar,cr]=d.useState(null),[Ir,Le]=d.useState({isOpen:!1,title:"",message:"",onConfirm:()=>{}}),[Fe,pr]=d.useState({isOpen:!1,printerId:"",entry:null,agentUid:""}),[Pt,Gr]=d.useState({isOpen:!1,printerId:"",brand:"",model:"",driverName:"",driverUrl:"",selectedAgentUid:""}),[en,Pr]=d.useState({isOpen:!1,title:"🌐 Đổi địa chỉ IP tĩnh",hint:"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.",value:"",changeAllTo:"",scanStatus:"",error:"",onConfirm:()=>{}}),[Qt,tn]=d.useState({lanUid:"",email:""}),[rn,Er]=d.useState([]),[Yt,nn]=d.useState(!1),[Zt,zr]=d.useState({printerId:"",name:"",email:"",agentUid:""}),[sn,er]=d.useState(!1),[Hr,on]=d.useState({lanUid:"",agentUid:"",email:""}),[Rr,Tt]=d.useState(!1),[st]=d.useState({regNo:"",name:"",details:null}),[an,tr]=d.useState({isOpen:!1,copierName:"",macId:"",loading:!1,jsonData:null}),ln=async n=>{const i=!!(n.agent_uid&&!n.mac_id&&!n.mac_address),s=(n.mac_id||n.mac_address||"").replace(/-/g,":").toUpperCase(),o=n.agent_uid||n.agentUid||"";tr({isOpen:!0,copierName:n.hostname?`Máy tính: ${n.hostname}`:n.printer_name||n.name||"Máy Photocopy",macId:s||o,loading:!0,jsonData:null});try{const l=i?`${bt}/api/lan-sites/scan-points?agent_uid=${encodeURIComponent(o)}`:`${bt}/api/lan-sites/scan-points?mac_id=${encodeURIComponent(s)}`,m=await(await fetch(l)).json();m.ok&&m.scan_points?tr(p=>({...p,loading:!1,jsonData:i?m.scan_points:m.scan_points[s]&&Object.keys(m.scan_points[s]).length>0?m.scan_points[s]:Object.keys(m.scan_points).length>0?m.scan_points:n.address_book_sync||{}})):tr(p=>({...p,loading:!1,jsonData:n.address_book_sync||{message:"Không tìm thấy dữ liệu scan_points.json trên VPS"}}))}catch{tr(h=>({...h,loading:!1,jsonData:n.address_book_sync||{error:"Lỗi kết nối VPS"}}))}},[mr]=d.useState(()=>localStorage.getItem("goxprint_last_viewed_copier_id")||"");d.useEffect(()=>{localStorage.setItem("goxprint_active_tab",f)},[f]),d.useEffect(()=>{localStorage.setItem("goxprint_expanded_printers",JSON.stringify(N))},[N]);const D=d.useCallback((n,i="info",s=5e3)=>{const o=Math.random().toString(36).substring(2,9);ye(l=>[...l,{id:o,message:n,type:i}]),s>0&&setTimeout(()=>{ye(l=>l.filter(h=>h.id!==o))},s)},[]),Wr=d.useCallback((n,i,s="info")=>{ye(o=>[...o.filter(l=>l.id!==n),{id:n,message:i,type:s}])},[]),rr=(n,i)=>{if(n.startsWith("http://")||n.startsWith("https://")||n.startsWith("data:"))try{const m=new URL(n);return m.pathname+m.search}catch{return n}if(n.startsWith("/"))return n;const o=i.split("?")[0].split("/");o.pop();const h=o.join("/")+"/"+n;try{const m=new URL(h,"http://localhost");return m.pathname+m.search}catch{return h}},Ct=async(n,i,s="GET",o,l=!1,h,m=80)=>{const p=h||(ee==null?void 0:ee.agentUid);if(!p){console.error("No agent UID available for remote page fetch"),D("Không tìm thấy Target Agent UID","error");return}if(qt){window.open(`http://${n}:${m}${i||"/"}`,"_blank");return}const j=(C,P)=>`
      <html>
        <head>
          <title>${C}</title>
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
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${C}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${P}</div>
        </body>
      </html>
    `,I=window.open("about:blank","_blank");I&&I.document.write(j("Đang kết nối tên miền...",`Đang kết nối đến máy in ${n} qua tên miền *.app.goxprint.com...`));try{const P=await(await fetch(`${bt}/api/agents/${p}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:n,printer_port:m})})).json();P.ok?I&&P.url&&(I.location.href=P.url):(I&&I.close(),D("Kết nối lỗi: "+(P.error||"Không thể khởi động đường hầm SSH ngược trên Agent"),"error"))}catch(C){I&&I.close(),D("Lỗi hệ thống VPS: "+(C.message||C),"error")}},Lr=()=>{if(lt>0&&ee){const n=lt-1;Lt(n),Ct(ee.ip,Gt[n],"GET",void 0,!0)}},ur=()=>{if(lt<Gt.length-1&&ee){const n=lt+1;Lt(n),Ct(ee.ip,Gt[n],"GET",void 0,!0)}},dn=n=>{kr(n),ee&&(n?(Qe(i=>i?{...i,html:"DIRECT_LAN"}:null),dr(!1)):Ct(ee.ip,ee.path,"GET",void 0,!1,ee.agentUid))},cn=()=>{ee&&ee.agentUid&&fetch(`${bt}/api/agents/${ee.agentUid}/tunnel/stop`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:ee.ip})}).catch(console.error),Qe(null),dr(!1),H([]),Lt(-1)};d.useEffect(()=>{const n=i=>{const s=i.data;if(!(!s||typeof s!="object")&&!(!ee||!ee.ip)){if(s.type==="iframe_navigate"){const o=rr(s.href,s.currentPath);Ct(ee.ip,o)}else if(s.type==="iframe_submit"){const o=rr(s.action,s.currentPath);Ct(ee.ip,o,"POST",s.formData)}}};return window.addEventListener("message",n),()=>window.removeEventListener("message",n)},[ee,Gt,lt]),d.useEffect(()=>{if(ee!=null&&ee.html&&ee.html!=="LOADING"&&!ee.html.startsWith("ERROR:")){const n=new Blob([ee.html],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(n);return Me(i),()=>{URL.revokeObjectURL(i)}}else Me("")},[ee==null?void 0:ee.html]),d.useEffect(()=>{const n=()=>{var s;try{const o=Ze.current;if(!o)return;const l=o.contentDocument||((s=o.contentWindow)==null?void 0:s.document);l&&l.body&&(l.documentElement.style.height="auto",l.body.style.height="auto",l.body.style.minHeight="100%",l.body.style.transform=`scale(${Dt}, ${Oe})`,l.body.style.transformOrigin="top left",l.body.style.width=`${100/Dt}%`,l.body.style.boxSizing="border-box")}catch(o){console.error("Failed to apply scaling:",o)}};n();const i=Ze.current;if(i)return i.addEventListener("load",n),()=>{i.removeEventListener("load",n)}},[Xt,Dt,Oe]);const Vr=d.useRef({}),ot=d.useCallback(async(n=!1)=>{n&&ue(!0);try{const i=await kn();R(i),Array.isArray(i)&&i.forEach(s=>{const o=s.agents||s.nodes||[];Array.isArray(o)&&o.forEach(l=>{const h=l.agent_uid||l.uid,m=l.local_ip||l.ip;if(h&&m){const p=Vr.current[h];if(p&&p!==m){const j=`⚠️ Máy tính Agent (${h}) vừa thay đổi địa chỉ IP từ ${p} sang ${m}!`;D(j,"warning");const I=`[JOB LOG - IP CHANGE DETECTED] Vì địa chỉ IP máy PC (${h}) đổi từ ${p} sang ${m}, tất cả điểm scan (address_list.folder chứa ${p}) sẽ được tự động cập nhật sang ${m} bằng lệnh ricoh_change_scan / toshiba_change_scan.`;console.log("📌 "+I);try{fetch(`${bt}/api/jobs/log`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"ip_changed",agent_uid:h,old_ip:p,new_ip:m,log_text:I})}).catch(()=>{})}catch{}const C=s.printers||[],P=S=>{if(!S)return"";let t=S.trim();return t.includes("://")&&(t=t.split("://")[1]),t=t.split("/")[0].split(":")[0].trim(),t};C.forEach(S=>{const t=jr(S.printer_name||S.name||"");if(t!=="ricoh"&&t!=="toshiba")return;let a=[];S.address_book_data&&Array.isArray(S.address_book_data.address_list)&&(a=S.address_book_data.address_list),a.filter(w=>{if(!w)return!1;const K=w.folder||w.server_host||w.server||"",O=P(K);return String(w.protocol||"").toUpperCase()==="EMAIL"?!1:O===p}).forEach(w=>{const K=t==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",O=w.registration_no||w.id||"",Re=w.name||w.username||w.display_name||"",me=S.ip||S.printer_ip||"",He=S.auth_user||S.username,Yr=S.auth_password||S.password||"";if(!He){console.warn(`[AUTO TRIGGER] Skip auto trigger change_ftp for printer ${me}: No auth user credentials configured.`);return}console.log(`🚀 [AUTO TRIGGER ${K.toUpperCase()}] Printer: ${me}, Target ID: ${O}, Name: ${Re}, IP: ${p} -> ${m}`),$t(h,K,"",{printer_ip:me,auth_user:He,auth_password:Yr,target_id:O,target_name:Re,old_ip:p,new_ip:m}).then(bn=>{console.log(`✅ [AUTO TRIGGER ${K.toUpperCase()} SUCCESS]:`,bn)}).catch(bn=>{console.error(`❌ [AUTO TRIGGER ${K.toUpperCase()} ERROR]:`,bn)})})})}Vr.current[h]=m}})}),i&&i.length>0,i.length>0&&fe(s=>{if(s&&i.some(m=>m.lan_uid===s))return s;const l=localStorage.getItem("goxprint_selected_lan_uid");return l&&i.some(m=>m.lan_uid===l)?l:(localStorage.setItem("goxprint_selected_lan_uid",i[0].lan_uid),i[0].lan_uid)})}catch(i){console.error(i),D("Không thể kết nối dữ liệu VPS","error")}finally{n&&ue(!1)}},[D]);d.useEffect(()=>{ot(!0);const n=setInterval(()=>{ot(!1)},5e3);return()=>clearInterval(n)},[ot]),d.useEffect(()=>{const n=setInterval(async()=>{try{const i=await fetch(`${bt}/api/agent-ips`,{headers:{"X-API-Token":"change-me"}});if(!i.ok)return;const s=await i.json();if(s&&s.ok&&Array.isArray(s.data))for(const o of s.data){const l=o.agent_uid,h=o.lan_uid,m=o.agent_name||l,p=o.reference_ip,j=o.current_ip;l&&fetch(`${bt}/api/agents/${l}/utility/exec?lead=default`,{method:"POST",headers:{"Content-Type":"application/json","X-API-Token":"change-me"},body:JSON.stringify({command:"get_agent_ip",command_content:"",is_auto:!0})}).catch(()=>{}),p&&j&&j!==p&&(D(`Cảnh báo: Agent [${m}] đã thay đổi IP từ [${p}] sang [${j}]!`,"warning"),fetch(`${bt}/api/agent-ips/save`,{method:"POST",headers:{"Content-Type":"application/json","X-API-Token":"change-me"},body:JSON.stringify({agent_uid:l,lan_uid:h,agent_name:m,ip:j})}).catch(()=>{}))}}catch(i){console.error("Error in 2s IP polling: ",i)}},2e3);return()=>clearInterval(n)},[D]);const pn=d.useCallback(async n=>{if(n){Ke(!0);try{const s=await(await fetch(`${bt}/api/agents/${n}/cameras`)).json();s.ok?J(s.cameras||[]):D("Không tải được danh sách camera: "+s.error,"error")}catch(i){D("Lỗi tải camera: "+i.message,"error")}finally{Ke(!1)}}},[D]),te=d.useMemo(()=>F.find(n=>n.lan_uid===De),[F,De]),gr=d.useMemo(()=>((te==null?void 0:te.agents)||[]).filter(n=>n.is_agent_active),[te]),$r=d.useMemo(()=>{var n;return L&&gr.some(s=>s.agent_uid===L)?L:((n=gr[0])==null?void 0:n.agent_uid)||""},[L,gr]),et=()=>{const n=new Date,i=new Date(n.getTime()-45*1e3),s=i.getFullYear(),o=String(i.getMonth()+1).padStart(2,"0"),l=String(i.getDate()).padStart(2,"0"),h=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0"),p=String(i.getSeconds()).padStart(2,"0");return`${s}-${o}-${l} ${h}:${m}:${p}`};d.useEffect(()=>{Ee(null),G({id:null,camera_name:"",rtsp_url:"",segment_duration:60,prefix:"rec",video_codec:"copy",audio_codec:"copy",no_audio:!0})},[$r]);const Ue=d.useCallback((n,i,s,o,l="Đang thực hiện lệnh...")=>{de(C=>({...C,[i]:{message:l,isPending:!0}}));const h=18e4,m=2e3,p=Date.now();let j=!1;const I=setInterval(async()=>{try{const C=Date.now()-p;if(C>h){clearInterval(I),de(t=>{const a={...t};return delete a[i],a}),o("Lệnh bị quá thời gian (Timeout 180s)");return}const P=await or(n),S=Math.round(C/1e3);P.status==="success"?(clearInterval(I),de(t=>{const a={...t};return delete a[i],a}),s(P)):P.status==="failed"||!P.ok?(clearInterval(I),de(t=>{const a={...t};return delete a[i],a}),o(P.error||"Lệnh thực hiện thất bại từ Agent")):P.received_at?(de(t=>({...t,[i]:{message:`⚡ Agent đã nhận - đang thực thi... (${S}s)`,isPending:!0}})),j||(j=!0,D("Agent đã nhận lệnh và đang truy cập máy photocopy...","info",3e3))):de(t=>({...t,[i]:{message:`⌛ Đang gửi lệnh tới agent... (${S}s)`,isPending:!0}}))}catch(C){clearInterval(I),de(P=>{const S={...P};return delete S[i],S}),o(C.message||"Lệnh thực hiện thất bại từ Agent")}},m)},[D]),Kr=d.useCallback(n=>{if(!n)return;const i=n.lan_uid,s=Date.now();if(!Wt.current[i]||s-Wt.current[i]>180*1e3){Wt.current[i]=s;const o=(n.agents||[]).filter(l=>l.is_agent_active);if(o.length>0){o.sort((h,m)=>{const p=new Date(h.last_seen||h.updated_at||h.last_ping||0).getTime();return new Date(m.last_seen||m.updated_at||m.last_ping||0).getTime()-p});const l=o[0];if(l){D(`⏳ Agent (${l.agent_uid}) đang thực hiện quét ngầm mạng LAN...`,"info",6e3);const h=l,p={command:"force_subnet_scan",command_content:`def force_scan():
    import logging, threading, sys, os, json, socket, time, subprocess, re, tempfile
    from datetime import datetime
    LOGGER = logging.getLogger(__name__)
    
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    
    if bridge_obj:
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
            if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre")) or clean_mac.startswith(("00:10:A4", "00:00:AA")): return "xerox"
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
            if not has_open: return

            model_name = ""
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

            mac = arp_map.get(ip, "")
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

try:
    force_scan()
except Exception as err:
    print(f"[-] LỖI THỰC THI: {err}")`,lead:n.lead};fetch(`${bt}/ui/agents/${h.agent_uid}/utility/exec`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)}).then(j=>j.json()).then(j=>{const I=(j==null?void 0:j.command_id)||(j==null?void 0:j.id);I?Ue(Number(I),`scan_lan_${i}`,async C=>{console.log("[DEBUG_LAN_SCAN] pollData received from LAN scan:",C);let P=[];const S=(C==null?void 0:C.result)||(C==null?void 0:C.result_payload)||(C==null?void 0:C.raw);if(Array.isArray(S))P=S;else if(typeof S=="string")try{const t=JSON.parse(S);Array.isArray(t)&&(P=t)}catch{}P.length>0?(D(`✓ Quét mạng LAN hoàn tất, tìm thấy ${P.length} máy in!`,"success",4e3),R(t=>t.map(a=>a.lan_uid===i?{...a,printers:P.map((x,w)=>({id:x.id||9e4+w,...x}))}:a))):(D("✓ Quét mạng LAN hoàn tất, đang cập nhật danh sách máy photocopy...","success",4e3),await ot(!0))},async C=>{await ot(!0)},"⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN..."):setTimeout(()=>ot(!0),5e3)}).catch(j=>{console.error(j),setTimeout(()=>ot(!0),5e3)})}}}},[D,Ue,ot]),hr=d.useCallback(n=>{var h;const i=Number(n),s=(h=te==null?void 0:te.printers)==null?void 0:h.find(m=>Number(m.id)===i);if(!s||!te)return"";const o=(te.agents||[]).filter(m=>m.is_agent_active),l=mt[i];return l&&o.some(p=>p.agent_uid===l)?l:s.agent_uid&&o.some(p=>p.agent_uid===s.agent_uid)?s.agent_uid:o.length>0?o[0].agent_uid:s.agent_uid||""},[te,mt]),[fr,Dr]=d.useState({});d.useEffect(()=>{if(!te||!te.emails){Dr({});return}let n=!0;return(async()=>{const s={},o=te.emails.filter(l=>l.email_type==="private");await Promise.all(o.map(async l=>{try{const h=await Tn(te.lan_uid,l.email);n&&(h.ok&&Array.isArray(h.rows)?s[l.email]=h.rows.length:s[l.email]=0)}catch(h){console.error(`Failed to fetch scan files count for ${l.email}`,h),n&&(s[l.email]=0)}})),n&&Dr(s)})(),()=>{n=!1}},[te]);const[mn,Mt]=d.useState(!0),[un,Ot]=d.useState(!0),[gn,xr]=d.useState(!1),[hn,Te]=d.useState(null),[fn,re]=d.useState(null),[_r,xt]=d.useState([]),[Ft,Nr]=d.useState(!1),[xn,_n]=d.useState(""),[Be,at]=d.useState({isOpen:!1,title:"",content:""}),[nr,Jr]=d.useState("");d.useEffect(()=>{Be.isOpen&&oe.current&&(oe.current.scrollTop=oe.current.scrollHeight)},[Be.isOpen,Be.content,nr]);const[yn,dt]=d.useState(!1),[qr,ct]=d.useState(null),kt=async()=>{if(!u)return;try{JSON.parse(nr)}catch(s){ct(`❌ Lỗi định dạng JSON: ${s.message}`);return}dt(!0),ct("⌛ Đang gửi cấu hình mới tới Agent...");const i=`import os, sys, json, base64
new_content = base64.b64decode("${btoa(unescape(encodeURIComponent(nr)))}").decode("utf-8")
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
`;try{const s=await $t(u.agent_uid,"save_settings_json",i);if(!s.ok||!s.command_id)throw new Error(s.error||"Không thể tạo lệnh tiện ích");const o=s.command_id,l=6e4,h=Date.now(),m=setInterval(async()=>{try{if(Date.now()-h>l){clearInterval(m),ct("❌ Lưu thất bại: Hết thời gian chờ (60s)"),dt(!1);return}const j=await or(o);j.status==="success"?(clearInterval(m),ct("✔️ Đã lưu cấu hình và tự động reload thành công!"),dt(!1),at(I=>({...I,content:nr})),setTimeout(()=>ct(null),3e3)):(j.status==="failed"||!j.ok)&&(clearInterval(m),ct(`❌ Lỗi từ máy trạm: ${j.error||"Lưu thất bại"}`),dt(!1))}catch(p){console.error("Poll error:",p)}},1e3)}catch(s){ct(`❌ Lỗi kết nối: ${s.message}`),dt(!1)}},ir=n=>{try{let i=n;for(;typeof i=="string";){const s=i.trim();if(s.startsWith("{")&&s.endsWith("}")||s.startsWith("[")&&s.endsWith("]")||s.startsWith('"')&&s.endsWith('"'))i=JSON.parse(i);else break}return typeof i=="object"&&i!==null?JSON.stringify(i,null,2):(typeof i=="string"&&(i=i.replace(/\\n/g,`
`).replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")),String(i))}catch{return n}};d.useEffect(()=>{Be.isOpen&&Be.title.includes("settings.json")&&(Jr(ir(Be.content)),ct(null))},[Be.isOpen,Be.title,Be.content]);const yr=async(n,i,s)=>{try{const o=await En(void 0,void 0,n);if(o.ok&&o.jobs){const l=o.jobs.filter(h=>h.status==="pending");for(const h of l)if(h.command_type===i)try{const m=JSON.parse(h.command_params);let p=!0;for(const j of Object.keys(s))if(m[j]!==s[j]){p=!1;break}if(p)return!0}catch{if(h.command_params===JSON.stringify(s))return!0}}}catch(o){console.error("Failed to check duplicate pending jobs",o)}return!1},Ge=new Set(["view_settings_json","view_stout","view_sterror","get_public_ip","check_watchdog","open_web_setting"]),Mr={view_settings_json:"⚙️ settings.json",view_stout:"📄 stout.txt — 100 dòng gần nhất",view_sterror:"🔴 sterror.txt — 100 dòng gần nhất",get_public_ip:"🌍 IP Public",check_watchdog:"🩺 Check Watchdog",open_web_setting:"🌐 Web setting"},br=d.useCallback(async n=>{var i,s;if(n){xr(!0),re(null);try{const o=await jn(n.agent_uid);if(o.ok)Mt(!!o.scan_auto_open_file),Ot(!!o.scan_auto_open_dir);else throw new Error(o.error||"Agent không tồn tại trên VPS")}catch(o){console.error("Failed to load agent settings:",o);const l=(i=o.message)!=null&&i.includes("Agent not found")||(s=o.message)!=null&&s.includes("404")?"Agent này chưa được đăng ký trên VPS backend. Vui lòng đảm bảo agent đang chạy và đã kết nối.":`Không thể tải cài đặt từ VPS: ${o.message}`;re({text:l,isError:!0}),Mt(!0),Ot(!0)}finally{xr(!1)}}},[]),vr=d.useCallback(async(n,i)=>{if(!u)return;const s=!i;n==="scan_auto_open_file"?Mt(s):Ot(s);try{const o=await An(u.agent_uid,{[n]:s});if(!o.ok)throw new Error(o.error||"Failed to update setting");re({text:"Đã cập nhật cài đặt thành công.",isError:!1})}catch(o){console.error("Failed to update agent setting:",o),n==="scan_auto_open_file"?Mt(i):Ot(i),re({text:`Lỗi cập nhật cài đặt: ${o.message}`,isError:!0})}},[u]),Vt=d.useCallback(async(n,i)=>{if(!u)return;const s=n==="printers"?"devices_and_printers":n==="scan"?"open_scan_folder":n==="change_ip"?"change_ip":n==="run_command"?"run_command":"dxdiag";if(await yr(u.agent_uid,"trigger_utility",{action:s,...i||{}})){D("Lệnh tiện ích này đang chờ phản hồi từ Agent!","info");return}Te(n),re({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const l=await In(u.agent_uid,s,i);if(!l.ok||!l.command_id)throw new Error(l.error||"Không thể tạo lệnh tiện ích");const h=l.command_id,m=6e4,p=1e3,j=Date.now(),I=setInterval(async()=>{try{const C=Date.now()-j;if(C>m){clearInterval(I),re({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Te(null);return}const P=await or(h);if(P.status==="success")clearInterval(I),re({text:"⚡ Thực hiện lệnh tiện ích thành công!",isError:!1}),Te(null);else if(P.status==="failed"||!P.ok)clearInterval(I),re({text:`❌ Thất bại: ${P.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Te(null);else{const S=Math.round(C/1e3);P.received_at?re({text:`⚡ Agent đã nhận lệnh - đang mở tiện ích... (${S}s)`,isError:!1}):re({text:`⌛ Đang chuyển lệnh tới Agent... (${S}s)`,isError:!1})}}catch(C){console.error("Error polling utility status:",C)}},p)}catch(l){console.error(`Failed to trigger ${n}:`,l),re({text:`Lỗi kết nối hoặc gửi lệnh: ${l.message}`,isError:!0}),Te(null)}},[u]),_t=d.useCallback(async(n,i)=>{var j;if(!u)return;if(await yr(u.agent_uid,"trigger_utility",{action:"exec_utility",command:n})){D("Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!","info");return}const o=_r.find(I=>I.command===n),l=(o==null?void 0:o.output_modal)||Ge.has(n),h=(o==null?void 0:o.label)||Mr[n]||n;let m=i;if(n==="change_agent_ip"||n==="check_scan_ip_match"){const I=n==="change_agent_ip",C=(u==null?void 0:u.local_ip)||(u==null?void 0:u.ip)||(u==null?void 0:u.agent_ip)||(u==null?void 0:u.localIp)||"";if(Pr({isOpen:!0,title:I?"🌐 Đổi địa chỉ IP tĩnh":"🔍 Kiểm tra IP khớp Copier",hint:I?"Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.":"Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.",value:C,changeAllTo:"",scanStatus:I?"⏳ Loading... Đang quét điểm scan FTP trên máy photo...":"",error:"",onConfirm:(P,S)=>{const t=i.replace("__TARGET_IP__",P);Te(n),re({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1}),$t(u.agent_uid,n,t,{target_ip:P,ip:P,printer_ip:P,change_all_to:S||""}).then(a=>{if(!a.ok||!a.command_id)throw new Error(a.error||"Không thể tạo lệnh tiện ích");const x=a.command_id,w=6e4,K=Date.now(),O=setInterval(async()=>{try{const Re=Date.now()-K;if(Re>w){clearInterval(O),re({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Te(null);return}const me=await or(x);if(me.status==="success")clearInterval(O),l?(at({isOpen:!0,title:h,content:typeof me.result_payload=="object"&&me.result_payload?JSON.stringify(me.result_payload,null,2):me.result_payload||me.error||me.result||"(không có nội dung)"}),re(null)):re({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),Te(null);else if(me.status==="failed"||!me.ok)clearInterval(O),l?(at({isOpen:!0,title:h,content:me.error||(typeof me.result_payload=="object"&&me.result_payload?JSON.stringify(me.result_payload,null,2):me.result_payload||me.result||"(không có nội dung)")}),re(null)):re({text:`❌ Thất bại: ${me.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Te(null);else{const He=Math.round(Re/1e3);re({text:`⌛ Đang xử lý... (${He}s)`,isError:!1})}}catch(Re){console.error("Poll error:",Re)}},1e3)}).catch(a=>{re({text:`Lỗi: ${a.message}`,isError:!0}),Te(null)})}}),I&&C){const P=_r.find(S=>S.command==="check_scan_ip_match");if(P&&P.command_content){const S=P.command_content.replace("__TARGET_IP__",C);$t(u.agent_uid,"check_scan_ip_match",S,{target_ip:C,ip:C,printer_ip:C}).then(t=>{if(t.ok&&t.command_id){const a=Date.now(),x=setInterval(async()=>{if(Date.now()-a>4e4){clearInterval(x);return}try{const K=await or(t.command_id);if(K.status==="success"||K.status==="failed"){clearInterval(x);const O=K.result_payload||K.result||K.error||"";Pr(Re=>({...Re,scanStatus:O?`🔍 ${O}`:""}))}}catch{}},1500)}}).catch(()=>{})}}return}const p=(j=te==null?void 0:te.printers)==null?void 0:j[0];m.includes("__TARGET_IP__")&&(m=m.replace(/__TARGET_IP__/g,(p==null?void 0:p.ip)||"192.168.1.155")),m.includes("__TARGET_USER__")&&(m=m.replace(/__TARGET_USER__/g,(p==null?void 0:p.auth_user)||(p==null?void 0:p.user)||"admin")),m.includes("__TARGET_PASS__")&&(m=m.replace(/__TARGET_PASS__/g,(p==null?void 0:p.auth_password)||(p==null?void 0:p.password)||"")),m.includes("__TARGET_ID__")&&(m=m.replace(/__TARGET_ID__/g,"001")),m.includes("__TARGET_SCAN_USER__")&&(m=m.replace(/__TARGET_SCAN_USER__/g,"scan")),Te(n),re({text:"⌛ Đang gửi lệnh tới Agent...",isError:!1});try{const I=await $t(u.agent_uid,n,m);if(!I.ok||!I.command_id)throw new Error(I.error||"Không thể tạo lệnh tiện ích");const C=I.command_id,P=6e4,S=Date.now(),t=setInterval(async()=>{try{const a=Date.now()-S;if(a>P){clearInterval(t),re({text:"Yêu cầu quá thời gian chờ (60s)",isError:!0}),Te(null);return}const x=await or(C);if(x.status==="success")clearInterval(t),l?(at({isOpen:!0,title:h,content:typeof x.result_payload=="object"&&x.result_payload?JSON.stringify(x.result_payload,null,2):x.result_payload||x.error||x.result||"(không có nội dung)"}),re(null)):re({text:"⚡ Thực hiện lệnh thành công!",isError:!1}),Te(null);else if(x.status==="failed"||!x.ok)clearInterval(t),l?(at({isOpen:!0,title:h,content:x.error||(typeof x.result_payload=="object"&&x.result_payload?JSON.stringify(x.result_payload,null,2):x.result_payload||x.result||"(không có nội dung)")}),re(null)):re({text:`❌ Thất bại: ${x.error||"Lệnh thất bại từ Agent"}`,isError:!0}),Te(null);else{const w=Math.round(a/1e3);re({text:`⌛ Đang xử lý... (${w}s)`,isError:!1})}}catch(a){const x=(a==null?void 0:a.message)||String(a||"");l&&(x.startsWith("[PATH]")||x.includes("stout")||x.includes("sterror")||x.includes("settings.json"))?(clearInterval(t),at({isOpen:!0,title:h,content:x}),re(null),Te(null)):console.error("Poll error:",a)}},1e3)}catch(I){re({text:`Lỗi: ${I.message}`,isError:!0}),Te(null)}},[u,_r]),q=d.useCallback(async()=>{if(!u)return;if(await yr(u.agent_uid,"emergency_restart",{action:"emergency_restart"})){D("Yêu cầu khởi động lại Agent đang chờ phản hồi từ Agent!","info");return}Le({isOpen:!0,title:"🚨 Kích hoạt Khởi động khẩn cấp",message:"Lệnh này sẽ đánh dấu yêu cầu thoát khẩn cấp cho Agent này trên server. File watchdog.bat (nếu có trên máy client) sẽ tự động phát hiện và ép đóng printagent.exe rồi mở lại. Việc này giúp thoát khỏi tình trạng treo update. Bạn có chắc chắn muốn thực hiện?",onConfirm:async()=>{Te("emergency_restart"),re({text:"⌛ Đang đăng ký cờ khởi động lại khẩn cấp...",isError:!1});try{const i=await Pn(u.agent_uid);if(!i.ok)throw new Error(i.error||"Thất bại");re({text:"⚡ Đã lưu cờ tắt khẩn cấp trên Server. Chờ Watchdog quét...",isError:!1})}catch(i){re({text:`❌ Lỗi: ${i.message}`,isError:!0})}finally{Te(null)}}})},[u]);d.useEffect(()=>{Xe==="utilities"&&u&&(br(u),Nr(!0),wn(u.agent_uid).then(n=>{n!=null&&n.ok&&Array.isArray(n.commands)&&xt(n.commands)}).catch(n=>console.error("Failed to load utility commands:",n)).finally(()=>Nr(!1)))},[Xe,u,br]);const Sr=d.useMemo(()=>{if(!te)return[];const n=(te.printers||[]).filter(i=>{const s=(i.printer_name||"").toLowerCase().trim();return!(s.includes("unknown")||s==="unknown printer"||s.includes("pdf")||s.includes("fax")||s.includes("brother")||s.includes("canon lbp")||s.includes("rustdesk")||i.probed&&!i.is_online)});return mr?[...n].sort((i,s)=>{const o=String(i.id)===mr,l=String(s.id)===mr;return o&&!l?-1:!o&&l?1:0}):n},[te,mr]),Xr=n=>{localStorage.setItem("goxprint_last_viewed_copier_id",n)};d.useEffect(()=>{if(te){const n={};te.printers.forEach(i=>{const s=(te.agents||[]).filter(l=>l.is_agent_active),o=s.find(l=>l.agent_uid===i.agent_uid)||s[0];n[i.id]=o?o.agent_uid:i.agent_uid||""}),ve(i=>({...n,...i})),ze(i=>{const s={...i};return te.printers.forEach(o=>{const l=o.auth_user||o.user||"",h=o.auth_password||o.password||"",m=(()=>{try{const C=localStorage.getItem(`copier_auth_${o.id}`)||(o.mac_id?localStorage.getItem(`copier_auth_${o.mac_id}`):null);return C?JSON.parse(C):null}catch{return null}})(),p=s[o.id],j=(p==null?void 0:p.user)!==void 0?p.user:l!==""?l:(m==null?void 0:m.user)!==void 0?m.user:"",I=(p==null?void 0:p.pass)!==void 0?p.pass:h!==""?h:(m==null?void 0:m.pass)!==void 0?m.pass:"";s[o.id]={user:j,pass:I}}),s})}},[te]);const Qr=async n=>{const i=String(typeof n=="object"?n.id:n),s=typeof n=="object"?n.mac_id||n.mac_address||"":i,o=ne[i]||{user:"",pass:""};try{localStorage.setItem(`copier_auth_${i}`,JSON.stringify(o)),s&&localStorage.setItem(`copier_auth_${s}`,JSON.stringify(o))}catch{}$e(l=>({...l,[i]:!0}));try{const l=await Rn(s||i,o.user,o.pass,s);if(l.ok){const h=l.command_id||l.id;h?(D("Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...","info",3e3),Ue(h,i,m=>{const p=m!=null&&m.error?` (${m.error})`:m!=null&&m.result?` (${m.result})`:"";D(`Đã test đăng nhập thành công và lưu vào database!${p}`,"success",5e3),R(j=>j.map(I=>({...I,printers:I.printers.map(C=>String(C.id)===String(i)||s&&C.mac_id===s?{...C,auth_user:o.user,auth_password:o.pass}:C)}))),$e(j=>({...j,[i]:!1}))},m=>{D(`Lỗi Agent lưu Auth: ${m}`,"error"),$e(p=>({...p,[i]:!1}))},"Đang thực thi lưu tài khoản vào tệp printers.json...")):(D("Đã lưu tài khoản Web UI máy photocopy thành công","success"),R(m=>m.map(p=>({...p,printers:p.printers.map(j=>String(j.id)===String(i)||s&&j.mac_id===s?{...j,auth_user:o.user,auth_password:o.pass}:j)}))),$e(m=>({...m,[i]:!1})))}else throw new Error(l.error||"Lưu thất bại")}catch(l){D(`Lỗi lưu Auth: ${l.message}`,"error"),$e(h=>({...h,[i]:!1}))}},ae=async(n,i,s,o,l)=>{try{const m=await(await fetch(`${bt}/api/scan-points/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:n,address_book_data:i,printer_name:s||"Photocopy",ip:o||"",agent_uid:l||""})})).json();console.log("Saved scan point to DB:",m)}catch(h){console.error("Failed to save scan point to DB:",h)}},tt=async n=>{var j,I,C,P,S;const i=(F||[]).flatMap(t=>t.printers||[]),s=typeof n=="object"&&n!==null?n:i.find(t=>String(t.id)===String(n)||t.mac_id===n||t.mac_address===n||t.ip===n)||((j=te==null?void 0:te.printers)==null?void 0:j.find(t=>String(t.id)===String(n)||t.mac_id===n||t.mac_address===n||t.ip===n))||{},o=String(s.id||(typeof n=="string"?n:"")),l=s.ip||s.printer_ip||(typeof n=="string"&&n.includes(".")?n:""),h=s.mac_address||s.mac_id||(typeof n=="string"&&n.includes(":")?n:o);if(!l){D("Thiếu thông tin IP máy in hợp lệ. Vui lòng chọn máy in cụ thể.","error");return}const m=hr(o)||hr(l)||hr(h);D("Bắt đầu gửi yêu cầu đồng bộ danh bạ máy in...","info",3e3);const p=h?String(h).toUpperCase().replace(/-/g,":"):"";p&&we(t=>({...t,[p]:{status:"loading",address_list:[]}}));try{const t=((I=ne[o])==null?void 0:I.user)||((C=ne[l])==null?void 0:C.user)||s.auth_user||s.user,a=((P=ne[o])==null?void 0:P.pass)||((S=ne[l])==null?void 0:S.pass)||s.auth_password||s.password||"";if(!t){D(`Chưa cấu hình tài khoản Web cho máy in ${s.printer_name||s.name||"Photocopy"}!`,"error"),p&&we(O=>({...O,[p]:{status:"error",address_list:[]}}));return}const K=await Ln(l&&l!=="0.0.0.0"?l:h||o,m||void 0,{mac_address:h,printer_ip:l,ip:l,auth_user:t,auth_password:a});if(!K.ok||!K.command_id)throw new Error(K.error||"Không thể tạo lệnh đồng bộ");Ue(K.command_id,o,async O=>{const Re=h?String(h).toUpperCase().replace(/-/g,":"):"";let me=(O==null?void 0:O.address_book_sync)||(O==null?void 0:O.address_book_data);if(!me&&(O!=null&&O.result||O!=null&&O.result_payload)){const He=String(O.result||O.result_payload||"");if(He.includes("__ADDRESS_BOOK_JSON_START__"))try{let Yr=He.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();Yr=Yr.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),me=JSON.parse(Yr)}catch{}}Re&&me&&(we(He=>({...He,[Re]:me})),ae(Re,me,s.printer_name||s.name,s.ip||s.printer_ip,m)),await ot(),xe(He=>({...He,[o]:!0}))},O=>{D(`Đồng bộ thất bại: ${O}`,"error")},"⌛ Đang đồng bộ danh bạ...")}catch(t){D(`Lỗi gửi lệnh đồng bộ: ${t.message}`,"error")}};return{VIEW_COMMANDS:Ge,activeAgentUid:$r,activeLoadingFile:ie,activeModal:Xe,activeTab:f,allocatedVncAddr:Cr,autoScanTriggers:Wt,cameraFiles:ht,cameraForm:Et,cameraLogs:St,cameraStatus:At,cameraTestLoading:k,cameraTestResult:Ut,cameras:Pe,camerasLoading:Je,commandStatus:Q,confirmModal:Ir,copierCredentials:ne,customRecordDuration:qe,customRunCommand:xn,deleteScanPointModal:Fe,detectBrand:jr,directLan:qt,editIpModalData:Ar,editableSettingsText:nr,emailFileCounts:fr,expandedDriverMenus:v,expandedDrivers:We,expandedPrinters:N,fetchCameraFiles:async(n,i)=>{try{const o=await(await fetch(`${bt}/api/agents/${n}/cameras/${i}/files`,{method:"POST"})).json();o.ok&&wt(o.files||[])}catch{}},fetchCameraStatus:async(n,i)=>{try{const o=await(await fetch(`${bt}/api/agents/${n}/cameras/${i}/status`,{method:"POST"})).json();o.ok&&o.status?(ut(o.status),gt(o.status.logs||[])):D("Không lấy được trạng thái camera: "+(o.error||"Lỗi kết nối"),"error")}catch(s){D("Lỗi lấy trạng thái: "+s.message,"error")}},fetchCameras:pn,fetchLanSitesData:ot,fetchRemotePage:Ct,filteredPrinters:Sr,formatJsonText:ir,ftpDetailData:it,getLiveQueryTimestamp:et,getTargetAgentUid:hr,handleAddPrivateFtp:async()=>{const{lanUid:n,agentUid:i,email:s}=Hr;if(!s||!s.includes("@")){D("Địa chỉ email không hợp lệ","error");return}Tt(!0);try{const o=await Nn("default",n,i,s);if(Tt(!1),he(null),o.ok)D("Đã thêm Private FTP thành công","success"),await ot();else throw new Error(o.error||"Lỗi server")}catch(o){Tt(!1),D(`Lỗi thêm FTP riêng: ${o.message}`,"error")}},handleAddPublicFtp:async()=>{var l,h,m;const{printerId:n,name:i,email:s,agentUid:o}=Zt;if(!i||!i.trim()){D("Vui lòng nhập tên điểm scan","error");return}if(s&&!s.includes("@")){D("Địa chỉ email không hợp lệ","error");return}er(!0),D("Đang tạo yêu cầu thêm FTP/Email lên máy in...","info",3e3);try{const p=(l=te==null?void 0:te.printers)==null?void 0:l.find(S=>String(S.id)===String(n)||S.mac_id===n),j=((h=ne[n])==null?void 0:h.user)||(p==null?void 0:p.auth_user),I=((m=ne[n])==null?void 0:m.pass)||(p==null?void 0:p.auth_password)||"";if(!j){er(!1),D(`Chưa cấu hình tài khoản Web cho máy in ${(p==null?void 0:p.printer_name)||(p==null?void 0:p.name)||"Photocopy"}!`,"error");return}const C={mac_address:(p==null?void 0:p.mac_id)||(p==null?void 0:p.mac_address)||n,printer_ip:(p==null?void 0:p.ip)||"",auth_user:j,auth_password:I},P=await Dn(n,i.trim(),s,o||void 0,C);if(er(!1),he(null),!P.ok||!P.command_id)throw new Error(P.error||"Lỗi gửi lệnh");Ue(P.command_id,n,async S=>{D(`Đã tạo điểm scan "${i.trim()}" thành công!`,"success"),console.log("Finish add public FTP scan point, updating address book state directly");const t=(p==null?void 0:p.mac_address)||(p==null?void 0:p.mac_id)||n,a=t?String(t).toUpperCase().replace(/-/g,":"):"";let x=(S==null?void 0:S.address_book_sync)||(S==null?void 0:S.address_book_data);if(!x&&(S!=null&&S.result||S!=null&&S.result_payload)){const w=String(S.result||S.result_payload||"");if(w.includes("__ADDRESS_BOOK_JSON_START__"))try{let K=w.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();K=K.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),x=JSON.parse(K)}catch{}}a&&x&&we(w=>({...w,[a]:x})),tt(n),await ot()},S=>{D(`Thêm điểm scan thất bại: ${S}`,"error")},`⌛ Đang tạo điểm scan "${i.trim()}"...`)}catch(p){er(!1),D(`Lỗi: ${p.message}`,"error")}},handleCloseWebPreview:cn,handleCopierClick:Xr,handleEmergencyRestart:q,handleHistoryBack:Lr,handleHistoryForward:ur,handleRefetchAddressBook:tt,handleSaveAuth:Qr,handleSaveSettings:kt,handleToggleDirectLan:dn,handleToggleSetting:vr,handleTriggerUtility:Vt,handleTriggerUtilityExec:_t,handleViewScanPointsJson:ln,installDriverModal:Pt,ipInputModal:en,isDuplicatePending:yr,isRecording30s:_e,isSavingSettings:yn,lanSites:F,lanSitesLoading:be,liveAddressBooks:Se,loadUtilitySettings:br,lockAspect:Nt,modalContentRef:oe,onlineAgents:gr,pollCommandStatus:Ue,previewBlobUrl:Xt,previewIframeRef:Ze,privateFtpData:Hr,privateFtpLoading:Rr,publicFtpData:Zt,publicFtpLoading:sn,queriedVideoUrl:_,queryDuration:ge,queryTimestamp:Y,queryVideoLoading:Z,recording30sCountdown:E,remoteLockPrinter:wr,replaceToast:Wr,resolveRelativePath:rr,saveAuthLoading:pt,saveScanPointToDb:ae,scaleX:Dt,scaleY:Oe,scanAutoOpenDir:un,scanAutoOpenFile:mn,scanPointsViewerModal:an,selectedCamera:Ve,selectedCameraAgentUid:L,selectedLan:te,selectedLanUid:De,selectedTargetAgents:mt,selectedUtilityAgent:u,setActiveLoadingFile:Ae,setActiveModal:he,setActiveTab:se,setAllocatedVncAddr:ar,setCameraFiles:wt,setCameraForm:G,setCameraLogs:gt,setCameraStatus:ut,setCameraTestLoading:U,setCameraTestResult:A,setCameras:J,setCamerasLoading:Ke,setCommandStatus:de,setConfirmModal:Le,setCopierCredentials:ze,setCustomRecordDuration:Ne,setCustomRunCommand:_n,setDeleteScanPointModal:pr,setDirectLan:kr,setEditIpModalData:cr,setEditableSettingsText:Jr,setEmailFileCounts:Dr,setExpandedDriverMenus:Ie,setExpandedDrivers:B,setExpandedPrinters:xe,setFtpDetailData:Bt,setInstallDriverModal:Gr,setIpInputModal:Pr,setIsRecording30s:Ce,setIsSavingSettings:dt,setLanSites:R,setLanSitesLoading:ue,setLiveAddressBooks:we,setLockAspect:ft,setPreviewBlobUrl:Me,setPrivateFtpData:on,setPrivateFtpLoading:Tt,setPublicFtpData:zr,setPublicFtpLoading:er,setQueriedVideoUrl:T,setQueryDuration:V,setQueryTimestamp:z,setQueryVideoLoading:M,setRecording30sCountdown:nt,setRemoteLockPrinter:Tr,setSaveAuthLoading:$e,setScaleX:zt,setScaleY:Ht,setScanAutoOpenDir:Ot,setScanAutoOpenFile:Mt,setScanPointsViewerModal:tr,setSelectedCamera:Ee,setSelectedCameraAgentUid:je,setSelectedLanUid:fe,setSelectedTargetAgents:ve,setSelectedUtilityAgent:Rt,setSettingsSaveStatus:ct,setShowPreviewDetails:Br,setShowSettings:y,setStorageFiles:Er,setStorageLoading:nn,setStorageModalData:tn,setToasts:ye,setToshibaVncData:Kt,setUtilityActionPending:Te,setUtilityCommands:xt,setUtilityCommandsLoading:Nr,setUtilitySettingsLoading:xr,setUtilityStatusMsg:re,setViewOutputModal:at,setVncTunnelLoading:lr,setWebPreviewHistory:H,setWebPreviewHistoryIndex:Lt,setWebPreviewLoading:dr,setWebPreviewModal:Qe,setWebPreviewTab:Ye,settingsSaveStatus:qr,showPreviewDetails:Ur,showSettings:b,showToast:D,storageFiles:rn,storageLoading:Yt,storageModalData:Qt,toasts:$,toshibaVncData:ke,triggerLanScan:Kr,utilityActionPending:hn,utilityCommands:_r,utilityCommandsLoading:Ft,utilitySettingsLoading:gn,utilityStatusMsg:fn,viewOutputModal:Be,vncTunnelLoading:It,webPreviewHistory:Gt,webPreviewHistoryIndex:lt,webPreviewLoading:Jt,webPreviewModal:ee,webPreviewTab:Fr}},Or="https://agentapi.quanlymay.com",$n=(c={})=>{const{cameraForm:W,cameras:F,customRecordDuration:R,directLan:De,fetchCameraFiles:fe,fetchCameraStatus:be,fetchCameras:ue,isRecording30s:L,setActiveModal:je,setAllocatedVncAddr:f,setCameraTestLoading:se,setCameraTestResult:Q,setIsRecording30s:de,setRecording30sCountdown:N,setSelectedCamera:xe,setToshibaVncData:We,setVncTunnelLoading:B,showToast:v}=c;return{cameraForm:W,cameras:F,customRecordDuration:R,directLan:De,fetchCameraFiles:fe,fetchCameraStatus:be,fetchCameras:ue,handleDeleteCamera:async(ve,Se)=>{if(window.confirm("Bạn có chắc chắn muốn xóa cấu hình camera này?"))try{const we=await(await fetch(`${Or}/api/agents/${ve}/cameras/${Se}/delete`,{method:"POST"})).json();we.ok?(v("Đã xóa camera thành công!","success"),ue(ve),xe(null)):v("Lỗi xóa camera: "+we.error,"error")}catch(ce){v("Lỗi hệ thống: "+ce.message,"error")}},handleDeleteCameraFile:async(ve,Se,ce)=>{if(window.confirm(`Bạn có chắc chắn muốn xóa tệp video này khỏi máy trạm?
File: ${ce}`))try{const Pe=await(await fetch(`${Or}/api/agents/${ve}/cameras/${Se}/delete-file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:ce})})).json();Pe.ok?(v("Đã xóa tệp video thành công!","success"),fe(ve,Se)):v("Lỗi xóa tệp: "+Pe.error,"error")}catch(we){v("Lỗi hệ thống: "+we.message,"error")}},handleRecord30s:async(ve,Se)=>{if(L)return;const ce=F.find(Je=>Je.id===Se),we=(ce==null?void 0:ce.mac_address)||"";if(!we){v("Camera không có thông tin MAC ID để điều khiển!","error");return}de(!0),N(R);let Pe=R;const J=setInterval(()=>{Pe-=1,N(Math.max(Pe,0)),Pe<=0&&clearInterval(J)},1e3);try{v(`Đang gửi yêu cầu ghi hình ${R}s...`,"info");const Ke=await(await fetch(`${Or}/api/cameras/record-control`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mac_id:we,action:"record",duration:R})})).json();clearInterval(J),Ke.ok?v(Ke.message||`Ghi hình ${R}s hoàn tất!`,"success"):v("Lỗi ghi hình: "+Ke.error,"error")}catch(Je){clearInterval(J),v("Lỗi kết nối ghi hình: "+Je.message,"error")}finally{de(!1),setTimeout(()=>{be(ve,Se),fe(ve,Se)},1500)}},handleSaveCameraConfig:async ve=>{try{const ce=await(await fetch(`${Or}/api/agents/${ve}/cameras`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(W)})).json();ce.ok?(v("Đã lưu cấu hình camera thành công!","success"),ue(ve),xe(null)):v("Lỗi lưu cấu hình: "+ce.error,"error")}catch(Se){v("Lỗi hệ thống: "+Se.message,"error")}},handleStartToshibaVnc:async(ve,Se,ce)=>{if(We({ip:ve,printerName:Se,agentUid:ce}),f(""),je("toshiba_vnc"),De){f(`${ve}:49105`);return}B(!0);try{const Pe=await(await fetch(`${Or}/api/agents/${ce}/tunnel/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printer_ip:ve,printer_port:49105})})).json();if(Pe.ok&&Pe.url_port){const J=Pe.url_port.replace("http://","").replace("https://","");f(J)}else v("Không thể mở đường hầm VNC: "+(Pe.error||"Lỗi không xác định"),"error"),je(null)}catch(we){v("Lỗi kết nối VPS: "+(we.message||we),"error"),je(null)}finally{B(!1)}},handleTestCameraConnection:async ve=>{se(!0),Q(null);try{const ce=await(await fetch(`${Or}/api/agents/${ve}/cameras/0/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rtsp_url:W.rtsp_url})})).json();ce.ok&&ce.result?Q(ce.result):Q({ok:!1,msg:ce.error||"Lỗi kiểm tra kết nối"})}catch(Se){Q({ok:!1,msg:"Lỗi: "+Se.message})}finally{se(!1)}},isRecording30s:L,setActiveModal:je,setAllocatedVncAddr:f,setCameraTestLoading:se,setCameraTestResult:Q,setIsRecording30s:de,setRecording30sCountdown:N,setSelectedCamera:xe,setToshibaVncData:We,setVncTunnelLoading:B,showToast:v}},Kn={ricoh_create_scan:`import requests
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
`},Jn="https://agentapi.quanlymay.com";function qn(c,W,F){const R=c.email_address||c.email||"",De=c.physical_path||c.folder||c.folder_path||"",fe=(R||De||"").trim();if(!fe)return{label:"UNKNOWN",type:"error",title:""};if(c.type==="Email"||R.includes("@"))return{label:"✔ ACTIVE",type:"success",title:""};const ue=(W||[]).find(f=>(f.email||"").toLowerCase().trim()===fe.toLowerCase().trim()),L=ue?ue.email_number:Number(c.registration_no);if(!L||isNaN(L))return{label:"✔ ACTIVE",type:"success",title:""};const je=(F||[]).find(f=>f.is_master&&f.is_agent_active)||(F||[]).find(f=>f.is_agent_active)||(F||[])[0];if(je){const f=(je.ftp_sites||[]).find(se=>Number(se.port)===Number(L));if(f){const se=("C:/Scangox/"+fe).toLowerCase().replace(/\\/g,"/"),de=(f.path||"").toLowerCase().replace(/\\/g,"/")===se;return f.running&&de?{label:"✔ OK",type:"success",title:""}:f.running&&!de?{label:"⚠ CONFLICT",type:"warning",title:`FTP site uses folder: ${f.path} instead of expected: C:/Scangox/${fe}`}:f.error&&(f.error.toLowerCase().includes("in use")||f.error.toLowerCase().includes("busy")||f.error.toLowerCase().includes("already bound")||f.error.toLowerCase().includes("already in use"))?{label:"❌ PORT BUSY",type:"error",title:f.error}:{label:"❌ FAILED",type:"error",title:f.error||"FTP site failed to start"}}else return{label:"PENDING SETUP",type:"warning",title:""}}else return{label:"OFFLINE",type:"neutral",title:""}}const Xn=(c={})=>{const{activeAgentUid:W,cameras:F,copierCredentials:R={},deleteScanPointModal:De,editIpModalData:fe,fetchLanSitesData:be,getTargetAgentUid:ue,handleRefetchAddressBook:L,isDuplicatePending:je,lanSites:f=[],pollCommandStatus:se,queryDuration:Q,queryTimestamp:de,replaceToast:N,saveScanPointToDb:xe,selectedCamera:We,selectedLan:B,setActiveModal:v,setDeleteScanPointModal:Ie,setEditIpModalData:ne,setInstallDriverModal:ze,setLiveAddressBooks:pt,setQueriedVideoUrl:$e,setQueryDuration:mt,setQueryTimestamp:ve,setQueryVideoLoading:Se,setStorageFiles:ce,setStorageLoading:we,setStorageModalData:Pe,showToast:J,utilityCommands:Je=[],detectBrand:Ke}=c,Ve=async(A,k,U,Y)=>{var T;const z=U||de,ge=Y||Q;if(!z)return;const V=((T=F.find(Z=>Z.id===k))==null?void 0:T.name)||"";if(await je(A,"trigger_utility",{action:"query_camera_video",camera_name:V,timestamp:z,duration:ge})){J("Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!","info");return}Se(!0),$e("");try{const M=await(await fetch(`${Jn}/api/agents/${A}/cameras/${k}/query-video`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({timestamp:z,duration:ge})})).json();if(M.ok){const b=z.replace(/[- :]/g,""),y=b.substring(0,8)+"_"+b.substring(8,14);$e(`clip_${We.camera_name}_${y}.mp4`)}else J("Không truy xuất được video: "+M.error,"error")}catch(Z){J("Lỗi kết nối render: "+Z.message,"error")}finally{Se(!1)}};return{executeRemoteInstallDriver:async(A,k,U,Y,z,ge)=>{const V="driver-install-progress";N(V,"⏳ Đang gửi lệnh cài đặt driver tới Agent...","info");try{const _=await Fn(A,k,U,Y,z,ge);if(!_.ok)throw new Error(_.error||"Server trả về lỗi");const T=_.command_id;if(!T){N(V,"✅ Đã gửi lệnh cài đặt driver.","success");return}const Z=3e5,M=2e3,b=Date.now();let y="";const ie=setInterval(async()=>{try{const Ae=Date.now()-b;if(Ae>Z){clearInterval(ie),N(V,"⏰ Quá thời gian chờ (5 phút). Kiểm tra trên PC đại diện.","info");return}const _e=await or(T);if(_e.status==="success")clearInterval(ie),N(V,"✅ Cài đặt driver thành công!","success");else if(_e.status==="failed"||!_e.ok)clearInterval(ie),N(V,`❌ Cài driver thất bại: ${_e.error||"Lỗi không xác định"}`,"error");else{const Ce=_e.progress_text||"";if(Ce&&Ce!==y)y=Ce,N(V,Ce,"info");else if(!Ce){const E=Math.round(Ae/1e3);_e.received_at?N(V,`⚡ Agent đã nhận lệnh - đang cài đặt driver... (${E}s)`,"info"):N(V,`⌛ Đang chuyển lệnh tới Agent... (${E}s)`,"info")}}}catch{}},M)}catch(_){N(V,`❌ Không thể cài driver: ${_.message}`,"error")}},formatBytes:A=>{if(A===0)return"0 Bytes";const k=1024,U=["Bytes","KB","MB","GB"],Y=Math.floor(Math.log(A)/Math.log(k));return parseFloat((A/Math.pow(k,Y)).toFixed(1))+" "+U[Y]},getDestinationStatus:A=>qn(A,(B==null?void 0:B.emails)||[],(B==null?void 0:B.agents)||[]),handleConfirmDeleteScanPoint:async()=>{var Z;const{printerId:A,entry:k,agentUid:U}=De;if(!A||!k)return;Ie(M=>({...M,isOpen:!1}));const Y=k.email_address||k.email||"",z=k.physical_path||k.folder||k.folder_path||"",ge=(Y||z||"").trim(),V=String(k.registration_no&&k.registration_no!=="-"?k.registration_no:k.entry_id||"").trim(),T=((B==null?void 0:B.emails)||[]).find(M=>M.email.toLowerCase().trim()===ge.toLowerCase().trim());if(T&&T.id){J("Đang xóa điểm scan private khỏi LAN...","info",3e3);try{const M=await Mn(T.id);if(M.ok)J("Đã xóa thành công!","success"),await be();else throw new Error(M.error||"Không thể xóa")}catch(M){J(`Lỗi xóa: ${M.message}`,"error")}return}J("Gửi lệnh xóa điểm scan trên máy photocopy...","info",3e3);try{const b=(f||[]).flatMap(E=>E.printers||[]).find(E=>String(E.id)===String(A)||E.mac_id===A||E.ip===A)||((Z=B==null?void 0:B.printers)==null?void 0:Z[0]),ie=((b==null?void 0:b.printer_type)||(b==null?void 0:b.printer_name)||"").toLowerCase().includes("toshiba")?"toshiba_delete_scan":"ricoh_delete_scan",Ae=(Je||[]).find(E=>E.command===ie),_e=U||ue(A);let Ce;if(_e){let E=Ae;if(!E)try{E=(await wn(_e)||[]).find(it=>it.command===ie)}catch{}const nt=(b==null?void 0:b.ip)||(b==null?void 0:b.printer_ip)||(A.includes(".")?A:""),qe=(b==null?void 0:b.mac_address)||(b==null?void 0:b.mac_id)||"",Ne=qe?String(qe).toUpperCase().replace(/-/g,":"):"",$=R[Ne]||R[A]||{},ye=$.user||(b==null?void 0:b.auth_user),Xe=$.pass||(b==null?void 0:b.auth_password)||"";if(!ye){J(`Chưa cấu hình tài khoản Web cho máy in ${(b==null?void 0:b.printer_name)||(b==null?void 0:b.name)||"Photocopy"}!`,"error");return}const he=String((k==null?void 0:k.entry_id)||(k==null?void 0:k.id)||V||"").trim()||"null";let u=(E==null?void 0:E.command_content)||Kn[ie]||"";if(!u){J(`Lỗi: Không tìm thấy mẫu lệnh thực thi '${ie}' trên hệ thống VPS!`,"error");return}u=u.replace(/__TARGET_IP__/g,nt||"null"),u=u.replace(/__TARGET_USER__/g,ye||"admin"),u=u.replace(/__TARGET_PASS__/g,Xe||""),u=u.replace(/__TARGET_ID__/g,he),u=u.replace(/__TARGET_SCAN_USER__/g,(k==null?void 0:k.name)||"null"),Ce=await $t(_e,ie,u,{printer_ip:nt,ip:nt,auth_user:ye,auth_password:Xe,target_id:he,entry_id:he,registration_no:V})}else Ce=await On(A,V,k.entry_id||"",U||void 0);if(!Ce.ok||!Ce.command_id)throw new Error(Ce.error||"Không thể tạo lệnh xóa");se(Ce.command_id,A,async E=>{J(`Đã xóa đăng ký #${V} thành công!`,"success"),console.log("Finish delete scan point, updating address book state directly",E);const nt=(b==null?void 0:b.mac_address)||(b==null?void 0:b.mac_id)||A,qe=nt?String(nt).toUpperCase().replace(/-/g,":"):"";let Ne=(E==null?void 0:E.address_book_sync)||(E==null?void 0:E.address_book_data);if(!Ne&&(E!=null&&E.result||E!=null&&E.result_payload)){const $=String(E.result||E.result_payload||"");if($.includes("__ADDRESS_BOOK_JSON_START__"))try{let ye=$.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();ye=ye.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),Ne=JSON.parse(ye)}catch{}}qe&&Ne&&pt($=>({...$,[qe]:Ne})),L&&L(A),await be(!0)},E=>{J(`Lỗi xóa điểm scan: ${E}`,"error")},`⌛ Đang xóa điểm scan #${V}...`)}catch(M){J(`Lỗi gửi lệnh xóa: ${M.message}`,"error")}},handleDeleteDest:(A,k)=>{var Y,z;const U=ue(A)||((z=(Y=B==null?void 0:B.agents)==null?void 0:Y.find(ge=>ge.is_agent_active))==null?void 0:z.agent_uid)||"";Ie({isOpen:!0,printerId:A,entry:k,agentUid:U})},handleEditIP:(A,k)=>{const U=k.folder||k.physical_path||k.folder_path||"";let Y="",z="2130";const ge=U.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),V=U.match(/^\\\\([^\\]+)(.*)$/);if(ge)Y=ge[1],z=ge[2]||"2130";else if(V)Y=V[1],z="";else{const T=U.match(/^([^:/]+)(?::(\d+))?(.*)$/);T&&!U.startsWith("\\\\")&&(Y=T[1],z=T[2]||"2130")}const _=Y?z?`${Y}:${z}`:Y:"192.168.1.100:2130";ne({printerId:A,entry:k,currentIp:Y,newIp:_,newPort:z||"2130"}),v("edit_ip")},handleOpenStorageFiles:async(A,k)=>{Pe({lanUid:A,email:k}),we(!0),ce([]),v("storage");try{const U=await Tn(A,k);if(U.ok)ce(U.rows||[]);else throw new Error(U.error||"Lỗi server")}catch(U){J(`Không thể lấy tệp đã scan: ${U.message}`,"error")}finally{we(!1)}},handlePlaySegmentFile:A=>{const k=A.match(/_(\d{8}_\d{6})\.mp4$/);if(k){const U=k[1],Y=`${U.substring(0,4)}-${U.substring(4,6)}-${U.substring(6,8)} ${U.substring(9,11)}:${U.substring(11,13)}:${U.substring(13,15)}`;ve(Y),mt(60),Ve(W,We.id,Y,60),setTimeout(()=>{var z;(z=document.getElementById("video-playback-card"))==null||z.scrollIntoView({behavior:"smooth",block:"center"})},100)}else J("Không parse được thời gian từ tên tệp","error")},handleQueryVideo:Ve,handleRemoteInstallDriver:(A,k,U,Y,z)=>{const ge=ue(A);ze({isOpen:!0,printerId:A,brand:k,model:U,driverName:Y,driverUrl:z,selectedAgentUid:ge})},handleSaveEditIP:async()=>{var b;if(!fe)return;const{printerId:A,entry:k,newIp:U,newPort:Y}=fe,z=k.folder||k.physical_path||k.folder_path||"",ge=z.match(/^ftp:\/\/([^:/]+)(?::(\d+))?(.*)$/i),V=z.match(/^\\\\([^\\]+)(.*)$/);let _=U.trim();if((Y||"2130").trim(),_.includes(":")){const y=_.split(":");_=y[0].trim(),y[1].trim()}if(ge)ge[3];else if(V)V[2];else{const y=z.match(/^([^:/]+)(?::(\d+))?(.*)$/);y&&!z.startsWith("\\\\")&&y[3]}const T=ue(A),Z=k.registration_no;v(null),J("Gửi yêu cầu thay đổi IP của điểm scan...","info",3e3);let M="";if(ge)M=ge[1];else if(V)M=V[1];else{const y=z.match(/^([^:/]+)/);y&&!z.startsWith("\\\\")&&(M=y[1])}M||(M=_);try{const y=(b=B==null?void 0:B.printers)==null?void 0:b.find($=>$.id===Number(A)),ie=(y==null?void 0:y.mac_address)||(y==null?void 0:y.mac_id)||"",Ae=ie?String(ie).toUpperCase().replace(/-/g,":"):"",_e=R[Ae]||R[A]||{},Ce=_e.user||(y==null?void 0:y.auth_user)||(y==null?void 0:y.username),E=_e.pass||(y==null?void 0:y.auth_password)||(y==null?void 0:y.password)||"";if(!Ce)throw new Error(`Chưa cấu hình tài khoản Web cho máy in ${(y==null?void 0:y.printer_name)||(y==null?void 0:y.name)||"Photocopy"}!`);const qe=(Ke?Ke((y==null?void 0:y.printer_name)||(y==null?void 0:y.name)||""):"ricoh")==="ricoh"?"ricoh_change_ftp":"toshiba_change_ftp",Ne=await $t(T,qe,"",{printer_ip:(y==null?void 0:y.ip)||"",auth_user:Ce,auth_password:E,target_id:Z,target_name:k.name,old_ip:M,new_ip:_});if(!Ne.ok||!Ne.command_id)throw new Error(Ne.error||"Không thể gửi lệnh thay đổi FTP");se(Ne.command_id,A,async $=>{J(`Đã thay đổi IP điểm scan #${Z} thành công!`,"success");const ye=(y==null?void 0:y.mac_address)||(y==null?void 0:y.mac_id)||A,Xe=ye?String(ye).toUpperCase().replace(/-/g,":"):"";let he=($==null?void 0:$.address_book_sync)||($==null?void 0:$.address_book_data);if(!he&&($!=null&&$.result||$!=null&&$.result_payload)){const u=String($.result||$.result_payload||"");if(u.includes("__ADDRESS_BOOK_JSON_START__"))try{let Rt=u.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].trim();Rt=Rt.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g,"").trim(),he=JSON.parse(Rt)}catch{}}Xe&&he&&pt(u=>({...u,[Xe]:he})),L&&L(A),await be(!0)},$=>{J(`Lỗi thay đổi IP: ${$}`,"error")},`⌛ Đang cập nhật IP điểm scan #${Z}...`)}catch(y){J(`Lỗi gửi lệnh thay đổi IP: ${y.message}`,"error")}}}};function Qn(){const c=Vn({}),W=$n(c),F=Xn({...c,...W});return{...c,...W,...F}}function ri(){var de;const c=Qn(),{toasts:W=[],lanSitesLoading:F,lanSites:R=[],selectedLanUid:De,setSelectedLanUid:fe,activeTab:be,setActiveTab:ue,selectedLan:L,triggerLanScan:je,filteredPrinters:f,cameras:se,fetchLanSitesData:Q}=c;return e.jsxs(rt.div,{style:r.container,initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.3},children:[e.jsx("div",{style:r.toastContainer,children:e.jsx(jt,{children:W.map(N=>e.jsxs(rt.div,{style:{...r.toast,borderLeft:`4px solid ${N.type==="success"?"var(--color-success)":N.type==="error"?"var(--color-error)":"var(--color-primary)"}`},initial:{opacity:0,x:50,scale:.9},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:50,scale:.9},children:[e.jsx("span",{style:r.toastIcon,children:N.type==="success"?"✔️":N.type==="error"?"❌":"ℹ️"}),e.jsx("div",{style:{flex:1,fontSize:"0.8rem"},children:N.message})]},N.id))})}),e.jsxs("div",{style:r.fixedHeader,children:[e.jsxs("div",{style:r.header,children:[e.jsx("h1",{style:r.title,children:"🛠️ Quản lý Mạng LAN"}),e.jsx("button",{style:{...r.smallBtn,borderColor:"var(--color-secondary)",color:"var(--color-secondary)"},onClick:()=>Q(!0),children:"🔄 Làm mới"})]}),e.jsxs("div",{style:r.filterBar,children:[e.jsx("label",{style:r.filterLabel,children:"Mạng LAN hiện tại:"}),F&&R.length===0?e.jsx(vt,{size:"sm"}):e.jsx("select",{value:De,onChange:N=>{fe(N.target.value),localStorage.setItem("goxprint_selected_lan_uid",N.target.value)},style:r.lanSelect,children:R.map(N=>{var xe;return e.jsxs("option",{value:N.lan_uid,children:[N.lan_name||N.lan_uid," (",N.active_agents," Agent - ",((xe=N.printers)==null?void 0:xe.filter(We=>We.is_online).length)??0," máy Photo)"]},N.lan_uid)})})]}),e.jsxs("div",{style:r.tabBar,children:[e.jsxs("button",{style:{...r.tabBtn,color:be==="agents"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:be==="agents"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>ue("agents"),children:["💻 Máy tính (",((de=L==null?void 0:L.agents)==null?void 0:de.filter(N=>N.is_agent_active).length)??0,")"]}),e.jsxs("button",{style:{...r.tabBtn,color:be==="copiers"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:be==="copiers"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>{ue("copiers"),je(L)},children:["🖨️ Photocopy (",f.length,")"]}),e.jsxs("button",{style:{...r.tabBtn,color:be==="cameras"?"var(--color-primary)":"var(--color-text-secondary)",borderBottom:be==="cameras"?"2px solid var(--color-primary)":"2px solid transparent"},onClick:()=>ue("cameras"),children:["📷 Camera (",se.length,")"]})]})]}),e.jsxs("div",{style:r.scrollableContent,children:[F&&e.jsx("div",{style:r.loadingWrapper,children:e.jsx(vt,{size:"md"})}),!F&&L&&e.jsxs(jt,{mode:"wait",children:[be==="agents"&&e.jsx(zn,{...c}),be==="copiers"&&e.jsx(Gn,{...c}),be==="cameras"&&e.jsx(Hn,{...c})]})]}),e.jsx(Wn,{...c})]})}export{ri as AgentPage,ri as default};
