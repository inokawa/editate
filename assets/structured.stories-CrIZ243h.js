import{n as e,o as t}from"./rolldown-runtime-BCiCTKAo.js";import{f as n}from"./iframe-Gxe-Ep5M.js";import{t as r}from"./react-dom-CeOCcyZK.js";import{t as i}from"./jsx-runtime-BB9-612F.js";import{a,c as o,i as s,l as c,n as l,o as u,r as d,s as f,t as p,u as m}from"./dist-BEhlLfzv.js";import{B as h,C as g,F as _,L as v,M as y,N as b,O as ee,P as x,S as te,U as ne,V as re,b as ie,g as ae,h as oe,i as se,j as S,m as ce,n as C,r as w,t as le,y as ue}from"./plainTransfer-Bf2AeWMS.js";import{c as de,d as fe,f as pe,i as me,l as T,n as E,p as he,r as D,s as ge,t as O,u as _e}from"./commands-B-_Ss264.js";import{n as k,t as ve}from"./internalTransfer-BpEqxVDt.js";import{i as A,n as ye,r as be,t as xe}from"./selectionRect-CXs0lqOY.js";import{n as Se,r as j,t as M}from"./nodeId-DIVrdNSb.js";import{n as N,t as Ce}from"./singleline-CIuP6O5-.js";var P;function we(){return(we=e((()=>{P=(e,t)=>{e.hook(`paste`,e=>{for(let n of e.items)if(n.kind===`file`){let e=t[n.type];if(e){let t=n.getAsFile();if(t)return[{children:[e(t)]}]}}return null})}})))()}function Te(e,t){e.hook(`mount`,(n,r)=>{let i=e.hook(`copy`,e=>{let t=document.createElement(`div`);t.appendChild(oe(ce(n),n).cloneContents()),e.setData(`text/html`,t.innerHTML)}),a=e.hook(`paste`,e=>{let n=e.getData(`text/html`);return n?Ee(n,r,t.serializers):null});return()=>{i(),a()}})}var Ee;function De(){return(De=e((()=>{ae(),ue(),Ee=(e,t,n)=>{let r=n.text,i=e=>{let t=n[e.tagName.toLowerCase()];if(t){let n=t(e);if(n)return n}},a=new DOMParser().parseFromString(e,`text/html`).body,o=!1;for(let e of[...a.childNodes])ie(e)?e.data===`StartFragment`?(o=!0,a=new DocumentFragment):e.data===`EndFragment`&&(o=!1):o&&a.appendChild(e);return t(({_next:e,_domNode:t})=>{let n,a=null,o=``,s=!1,c=[],l=()=>{o&&=(a||=[],a.push(r(o)),``)},u=()=>{l(),!a&&s&&(a=[]),a&&c.push({children:a}),a=null,s=!1};for(;n=e();)if(n===4)u();else if(s=!0,n===1)o+=t().data;else if(n===2){l();let e=i(t());e&&a.push(e)}else n===3&&u();return u(),c.length||c.push({children:[]}),c},a)}})))()}function Oe(e,t){let n=t.isLocked,r=t=>{for(let[r]of h(e.doc,t))if(n(r))return!0;return!1},i=t=>{if(t.type!==`format`)return r(t.type===`delete`?S(t.range):[t.at,t.at]);let i=e.doc,a=t.depth===0?[0,_(i)]:S(t.range),o=h(te(i,e.selection,t)[0],a);for(let[e]of h(i,a)){let t=o.next().value?.[0];if(t&&e!==t&&n(e)&&n(t))return!0}return!1};e.hook(`apply`,(e,t)=>{t(i(e)?null:e)}),e.set(Oe,{locked:r})}function ke(){return(ke=e((()=>{v(),g(),ee()})))()}function Ae(e){let t=[];for(let[n,r]of e.exec(fe)){let e=n.indent??0,i=r+_(n),a=t[t.length-1];a&&a[0]===e?a[2]=i:t.push([e,r,i])}for(let[n,r,i]of t)e.apply({type:`format`,range:[r,i],key:`indent`,value:n+1,depth:-2})}function je(e){let t=[];for(let[n,r]of e.exec(fe)){let e=n.indent??0,i=r+_(n),a=t[t.length-1];a&&a[0]===e?a[2]=i:t.push([e,r,i])}for(let[n,r,i]of t)e.apply({type:`format`,range:[r,i],key:`indent`,value:Math.max(n-1,0),depth:-2})}var F,Me,I,Ne,Pe,L,Fe,Ie,R,Le,z,B,Re,V,H,ze,U,W,G,Be,K,Ve,He,q,J,Y,Ue,X,We,Z,Ge,Q,Ke;function $(){return($=e((()=>{F=t(n()),se(),_e(),Ce(),be(),ve(),De(),le(),we(),xe(),v(),he(),ke(),Se(),d(),Me=r(),I=i(),Ne={component:w},Pe=o({children:p(o({children:p(o({text:c()}))}))}),L={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:``}]}]}),r=(0,F.useMemo)(()=>{let e=w({doc:t,schema:Pe}).exec(k).exec(C).exec(j);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map(e=>(0,I.jsx)(`div`,{children:e.children.map(e=>(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},M(r,e)))},M(r,e)))})}},Fe=o({text:c(),fontSize:u(a()),bold:u(l()),italic:u(l()),underline:u(l()),strike:u(l())}),Ie=o({children:p(o({align:u(f([`left`,`right`])),indent:u(a()),children:p(Fe)}))}),R=10,Le=({node:e})=>{let t=e.bold?`strong`:`span`,n={fontSize:`${e.fontSize??R}pt`};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,I.jsx)(t,{style:n,children:e.text||(0,I.jsx)(`br`,{})})},z={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),[r,i]=(0,F.useState)(null),[a,o]=(0,F.useState)(),[s,c]=(0,F.useState)(!1),[l,u]=(0,F.useState)(!1),[d,f]=(0,F.useState)(!1),[p,m]=(0,F.useState)(!1),h=e=>{b.exec(E,`fontSize`,e)},g=()=>{b.exec(T,`bold`)},_=()=>{b.exec(T,`italic`)},v=()=>{b.exec(T,`underline`)},y=()=>{b.exec(T,`strike`)},b=(0,F.useMemo)(()=>{let e=()=>{let e=new Set,t=!1,n=!1,r=!1,i=!1;for(let a of b.exec(pe))a.fontSize?e.add(a.fontSize):e.add(R),a.bold&&(t=!0),a.italic&&(n=!0),a.underline&&(r=!0),a.strike&&(i=!0);o(e.size===1?e.values().next().value:void 0),c(t),u(n),f(r),m(i)},r=w({doc:t,schema:Ie}).exec(A,{"Mod+B":g,"Mod+I":_,"Mod+U":v,"Mod+S":y}).exec(ye,e=>{b.selection[0]===b.selection[1]?i(null):i(t=>{let n=e();return t&&t.top===n.top&&t.left===n.left?t:{top:n.top,left:n.left}})}).exec(k).exec(C).exec(j);return r.on(`change`,()=>{n(r.doc),e()}),r.on(`selectionchange`,()=>{e()}),r},[]);return(0,F.useEffect)(()=>{if(e.current)return b.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4,padding:4,paddingBottom:8},children:[(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`select`,{value:a??`--`,onChange:e=>{e.preventDefault();let t=Number(e.target.value);Number.isNaN(t)||h(t)},children:[(0,I.jsx)(`option`,{value:`--`,children:`--`}),(0,I.jsx)(`option`,{value:`8`,children:`8`}),(0,I.jsx)(`option`,{value:`10`,children:`10`}),(0,I.jsx)(`option`,{value:`12`,children:`12`}),(0,I.jsx)(`option`,{value:`14`,children:`14`}),(0,I.jsx)(`option`,{value:`16`,children:`16`}),(0,I.jsx)(`option`,{value:`18`,children:`18`}),(0,I.jsx)(`option`,{value:`20`,children:`20`})]}),(0,I.jsx)(`button`,{style:{fontWeight:s?`bold`:void 0},onClick:g,children:`bold`}),(0,I.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:_,children:`italic`}),(0,I.jsx)(`button`,{style:{fontWeight:d?`bold`:void 0},onClick:v,children:`underline`}),(0,I.jsx)(`button`,{style:{fontWeight:p?`bold`:void 0},onClick:y,children:`strike`})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`button`,{onClick:()=>{b.exec(de,`align`,`right`,void 0)},children:`align`}),(0,I.jsx)(`button`,{onClick:()=>{b.exec(Ae)},children:`indent`}),(0,I.jsx)(`button`,{onClick:()=>{b.exec(je)},children:`outdent`})]})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map(e=>(0,I.jsx)(`div`,{style:{textAlign:e.align,textIndent:e.indent?`${e.indent}em`:void 0},children:e.children.map(e=>(0,I.jsx)(Le,{node:e},M(b,e)))},M(b,e)))}),r?(0,I.jsxs)(`div`,{style:{position:`fixed`,top:r.top-30,left:r.left,whiteSpace:`nowrap`},children:[(0,I.jsx)(`button`,{style:{fontWeight:s?`bold`:void 0},onClick:g,children:`bold`}),(0,I.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:_,children:`italic`}),(0,I.jsx)(`button`,{style:{fontWeight:d?`bold`:void 0},onClick:v,children:`underline`}),(0,I.jsx)(`button`,{style:{fontWeight:p?`bold`:void 0},onClick:y,children:`strike`})]}):null]})}},B=o({children:p(m([o({text:c()}),o({type:s(`tag`),label:c(),value:c()})]))}),Re=({onClick:e})=>{let[t,n]=(0,F.useState)(!1);return(0,I.jsx)(`span`,{onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),onClick:e,style:{display:`inline-flex`,alignItems:`center`,justifyContent:`center`,width:14,height:14,borderRadius:`50%`,background:t?`#999`:`#c4c4c4`,color:`white`,fontSize:9,lineHeight:1,cursor:`pointer`},children:`✕`})},V=({label:e,onLabelClick:t,onRemove:n})=>(0,I.jsxs)(`span`,{contentEditable:!1,style:{display:`inline-flex`,alignItems:`center`,gap:4,background:`#f0f0f0`,color:`#444`,border:`solid 1px #ccc`,fontSize:12,lineHeight:1.5,padding:`1px 4px 1px 8px`,borderRadius:999,margin:`0 2px`},children:[(0,I.jsx)(`span`,{style:{cursor:t?`pointer`:void 0},onClick:t,children:e}),(0,I.jsx)(Re,{onClick:n})]}),H={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,F.useMemo)(()=>{let e=w({doc:t,schema:B}).exec(k).exec(C,{voidToString:e=>e.label}).exec(N).exec(j);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,F.useRef)(null),a=(0,F.useRef)(null);return(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`label`,{children:[`label:`,(0,I.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,I.jsxs)(`label`,{children:[`value:`,(0,I.jsx)(`input`,{ref:a,defaultValue:`123`})]}),(0,I.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=a.current?.value;e&&t&&r.exec(D,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map(e=>`text`in e?e.text||(0,I.jsx)(`br`,{}):(0,I.jsx)(V,{label:e.label,onLabelClick:n=>{n.preventDefault();let i=x(t,e);if(i==null)return;let a=window.prompt(`label:`,e.label);a&&r.exec(ge,`label`,a,i+_(e))},onRemove:n=>{n.preventDefault();let i=x(t,e);i!=null&&r.exec(O,[i,i+_(e)])}},M(r,e)))})]})}},ze=({items:e,index:t,selected:n,onSelect:r})=>{let i=(0,F.useRef)(null);return(0,F.useEffect)(()=>{t!==-1&&i.current?.children[t]?.scrollIntoView({block:`nearest`})},[t]),(0,I.jsx)(`ul`,{ref:i,style:{position:`absolute`,zIndex:1,top:`100%`,left:0,right:0,maxHeight:200,overflowY:`auto`,margin:`2px 0 0`,padding:0,listStyleType:`none`,fontSize:12,background:`white`,border:`solid 1px #ccc`,borderRadius:4,cursor:`pointer`},children:e.length?e.map((e,i)=>(0,I.jsxs)(`li`,{style:{display:`flex`,alignItems:`center`,gap:6,padding:`3px 8px`,...t===i&&{color:`white`,background:`#2A6AD3`}},onMouseDown:t=>{t.preventDefault(),r(e)},children:[(0,I.jsx)(`span`,{style:{width:10},children:n.has(e)?`✓`:``}),e]},e)):(0,I.jsx)(`li`,{style:{padding:`3px 8px`,color:`#999`},children:`No results`})})},U=(e,t)=>{let n=y(e,t,!0);return n&&`text`in n[0]?n[0].text.slice(0,n[1]):``},W={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{type:`tag`,label:`Luke Skywalker`,value:`Luke Skywalker`}]}),[r,i]=(0,F.useState)(0),[a,o]=(0,F.useState)(!1),[s,c]=(0,F.useState)(-1),l=(0,F.useMemo)(()=>new Set(t.children.flatMap(e=>`text`in e?[]:[e.value])),[t]),u=(0,F.useMemo)(()=>U(t,r),[t,r]),d=(0,F.useMemo)(()=>{let e=u.trim().toLowerCase();return e?G.filter(t=>t.toLowerCase().includes(e)):G},[u]);s>d.length-1&&c(-1);let f=e=>{let n=t.children.find(t=>!(`text`in t)&&t.value===e),i=n&&x(t,n);if(n&&i!=null)v.exec(O,[i,i+_(n)]);else{let t=r-u.length;u&&v.exec(O,[t,r]),v.exec(D,{type:`tag`,label:e,value:e},t)}o(!1),c(-1)},p=(0,F.useEffectEvent)(()=>{if(!a||!d.length)return!1;c(e=>e<=0?d.length-1:e-1)}),m=(0,F.useEffectEvent)(()=>{if(!a||!d.length)return!1;c(e=>e>=d.length-1?0:e+1)}),h=(0,F.useEffectEvent)(()=>{if(!a||s===-1)return!1;f(d[s])}),g=(0,F.useEffectEvent)(()=>{if(!a)return!1;o(!1),c(-1)}),v=(0,F.useMemo)(()=>{let e=w({doc:t,schema:B}).exec(k).exec(C,{voidToString:e=>e.label}).exec(N).exec(A,{ArrowUp:p,ArrowDown:m,Enter:h,Escape:g}).exec(j);return e.on(`change`,()=>{let t=Math.min(...e.selection);n(e.doc),i(t),o(!!U(e.doc,t).trim()),c(-1)}),e.on(`selectionchange`,()=>{i(Math.min(...e.selection))}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return v.input(e.current)},[]),(0,I.jsxs)(`div`,{style:{position:`relative`,width:320,fontSize:13},onBlur:()=>{o(!1),c(-1)},children:[(0,I.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,background:`white`,border:`solid 1px darkgray`,borderRadius:4},children:[(0,I.jsx)(`div`,{ref:e,style:{flex:1,minWidth:0,padding:6,lineHeight:2},children:t.children.map(e=>`text`in e?e.text||(0,I.jsx)(`br`,{}):(0,I.jsx)(V,{label:e.label,onRemove:t=>{t.preventDefault(),f(e.value)}},M(v,e)))}),(0,I.jsx)(`button`,{style:{alignSelf:`stretch`,padding:`0 6px`,border:`none`,borderLeft:`solid 1px #ddd`,background:`transparent`,cursor:`pointer`},onMouseDown:e=>{e.preventDefault()},onClick:()=>{e.current?.focus(),o(e=>!e),c(-1)},children:`▾`})]}),a&&(0,I.jsx)(ze,{items:d,index:s,selected:l,onSelect:f})]})}},G=`Aayla Secura,Adi Gallia,Admiral Dodd Rancit,Admiral Firmus Piett,Admiral Gial Ackbar,Admiral Ozzel,Admiral Raddus,Admiral Terrinald Screed,Admiral Trench,Admiral U.O. Statura,Agen Kolar,Agent Kallus,Aiolin and Morit Astarte,Aks Moe,Almec,Alton Kastle,Amee,AP-5,Armitage Hux,Artoo,Arvel Crynyd,Asajj Ventress,Aurra Sing,AZI-3,Bala-Tik,Barada,Bargwill Tomder,Baron Papanoida,Barriss Offee,Baze Malbus,Bazine Netal,BB-8,BB-9E,Ben Quadinaros,Berch Teller,Beru Lars,Bib Fortuna,Biggs Darklighter,Black Krrsantan,Bo-Katan Kryze,Boba Fett,Bobbajo,Bodhi Rook,Borvo the Hutt,Boss Nass,Bossk,Breha Antilles-Organa,Bren Derlin,Brendol Hux,BT-1,C-3PO,C1-10P,Cad Bane,Caluan Ematt,Captain Gregor,Captain Phasma,Captain Quarsh Panaka,Captain Rex,Carlist Rieekan,Casca Panzoro,Cassian Andor,Cassio Tagge,Cham Syndulla,Che Amanwe Papanoida,Chewbacca,Chi Eekway Papanoida,Chief Chirpa,Chirrut Îmwe,Ciena Ree,Cin Drallig,Clegg Holdfast,Cliegg Lars,Coleman Kcaj,Coleman Trebor,Colonel Kaplan,Commander Bly,Commander Cody (CC-2224),Commander Fil (CC-3714),Commander Fox,Commander Gree,Commander Jet,Commander Wolffe,Conan Antonio Motti,Conder Kyl,Constable Zuvio,Cordé,Cpatain Typho,Crix Madine,Cut Lawquane,Dak Ralter,Dapp,Darth Bane,Darth Maul,Darth Tyranus,Daultay Dofine,Del Meeko,Delian Mors,Dengar,Depa Billaba,Derek Klivian,Dexter Jettster,Dineé Ellberger,DJ,Doctor Aphra,Doctor Evazan,Dogma,Dormé,Dr. Cylo,Droidbait,Droopy McCool,Dryden Vos,Dud Bolt,Ebe E. Endocott,Echuu Shen-Jon,Eeth Koth,Eighth Brother,Eirtaé,Eli Vanto,Ellé,Ello Asty,Embo,Eneb Ray,Enfys Nest,EV-9D9,Evaan Verlaine,Even Piell,Ezra Bridger,Faro Argyus,Feral,Fifth Brother,Finis Valorum,Finn,Fives,FN-1824,FN-2003,Fodesinbeed Annodue,Fulcrum,FX-7,GA-97,Galen Erso,Gallius Rax,Garazeb "Zeb" Orrelios,Gardulla the Hutt,Garrick Versio,Garven Dreis,Gavyn Sykes,Gideon Hask,Gizor Dellso,Gonk droid,Grand Inquisitor,Greeata Jendowanian,Greedo,Greer Sonnel,Grievous,Grummgar,Gungi,Hammerhead,Han Solo,Harter Kalonia,Has Obbit,Hera Syndulla,Hevy,Hondo Ohnaka,Huyang,Iden Versio,IG-88,Ima-Gun Di,Inquisitors,Inspector Thanoth,Jabba,Jacen Syndulla,Jan Dodonna,Jango Fett,Janus Greejatus,Jar Jar Binks,Jas Emari,Jaxxon,Jek Tono Porkins,Jeremoch Colton,Jira,Jobal Naberrie,Jocasta Nu,Joclad Danva,Joh Yowza,Jom Barell,Joph Seastriker,Jova Tarkin,Jubnuk,Jyn Erso,K-2SO,Kanan Jarrus,Karbin,Karina the Great,Kes Dameron,Ketsu Onyo,Ki-Adi-Mundi,King Katuunko,Kit Fisto,Kitster Banai,Klaatu,Klik-Klak,Korr Sella,Kylo Ren,L3-37,Lama Su,Lando Calrissian,Lanever Villecham,Leia Organa,Letta Turmond,Lieutenant Kaydel Ko Connix,Lieutenant Thire,Lobot,Logray,Lok Durd,Longo Two-Guns,Lor San Tekka,Lorth Needa,Lott Dod,Luke Skywalker,Lumat,Luminara Unduli,Lux Bonteri,Lyn Me,Lyra Erso,Mace Windu,Malakili,Mama the Hutt,Mars Guo,Mas Amedda,Mawhonic,Max Rebo,Maximilian Veers,Maz Kanata,ME-8D9,Meena Tills,Mercurial Swift,Mina Bonteri,Miraj Scintel,Mister Bones,Mod Terrik,Moden Canady,Mon Mothma,Moradmin Bast,Moralo Eval,Morley,Mother Talzin,Nahdar Vebb,Nahdonnis Praji,Nien Nunb,Niima the Hutt,Nines,Norra Wexley,Nute Gunray,Nuvo Vindi,Obi-Wan Kenobi,Odd Ball,Ody Mandrell,Omi,Onaconda Farr,Oola,OOM-9,Oppo Rancisis,Orn Free Taa,Oro Dassyne,Orrimarko,Osi Sobeck,Owen Lars,Pablo-Jill,Padmé Amidala,Pagetti Rook,Paige Tico,Paploo,Petty Officer Thanisson,Pharl McQuarrie,Plo Koon,Po Nudo,Poe Dameron,Poggle the Lesser,Pong Krell,Pooja Naberrie,PZ-4CO,Quarrie,Quay Tolsite,Queen Apailana,Queen Jamillia,Queen Neeyutnee,Qui-Gon Jinn,Quiggold,Quinlan Vos,R2-D2,R2-KT,R3-S6,R4-P17,R5-D4,RA-7,Rabé,Rako Hardeen,Ransolm Casterfo,Rappertunie,Ratts Tyerell,Raymus Antilles,Ree-Yees,Reeve Panzoro,Rey,Ric Olié,Riff Tamson,Riley,Rinnriyin Di,Rio Durant,Rogue Squadron,Romba,Roos Tarpals,Rose Tico,Rotta the Hutt,Rukh,Rune Haako,Rush Clovis,Ruwee Naberrie,Ryoo Naberrie,Sabé,Sabine Wren,Saché,Saelt-Marae,Saesee Tiin,Salacious B. Crumb,San Hill,Sana Starros,Sarco Plank,Sarkli,Satine Kryze,Savage Opress,Sebulba,Senator Organa,Sergeant Kreel,Seventh Sister,Shaak Ti,Shara Bey,Shmi Skywalker,Shu Mai,Sidon Ithano,Sifo-Dyas,Sim Aloo,Siniir Rath Velus,Sio Bibble,Sixth Brother,Slowen Lo,Sly Moore,Snaggletooth,Snap Wexley,Snoke,Sola Naberrie,Sora Bulq,Strono Tuggs,Sy Snootles,Tallissan Lintra,Tarfful,Tasu Leech,Taun We,TC-14,Tee Watt Kaa,Teebo,Teedo,Teemto Pagalies,Temiri Blagg,Tessek,Tey How,Thane Kyrell,The Bendu,The Smuggler,Thrawn,Tiaan Jerjerrod,Tion Medon,Tobias Beckett,Tulon Voidgazer,Tup,U9-C4,Unkar Plutt,Val Beckett,Vanden Willard,Vice Admiral Amilyn Holdo,Vober Dand,WAC-47,Wag Too,Wald,Walrus Man,Warok,Wat Tambor,Watto,Wedge Antilles,Wes Janson,Wicket W. Warrick,Wilhuff Tarkin,Wollivan,Wuher,Wullf Yularen,Xamuel Lennox,Yaddle,Yarael Poof,Yoda,Zam Wesell,Zev Senesca,Ziro the Hutt,Zuckuss`.split(`,`),Be=8,K=/\B@([\-+\w]*)$/,Ve=({chars:e,index:t,top:n,left:r,complete:i})=>(0,I.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,fontSize:`12px`,border:`solid 1px gray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,I.jsx)(`div`,{style:{padding:`4px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),He=o({children:p(o({children:p(m([o({text:c()}),o({type:s(`mention`),name:c()})]))}))}),q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hi `},{type:`mention`,name:`Luke Skywalker`},{text:` and `},{type:`mention`,name:`Leia Organa`},{text:`, could you check this out? Type @ to mention someone.`}]},{children:[{text:``}]}]}),[r,i]=(0,F.useState)(null),[a,o]=(0,F.useState)(0),s=(r&&ne(t,0,r.caret).match(K))?.[1]??``,c=(0,F.useMemo)(()=>G.filter(e=>e.toLowerCase().startsWith(s.toLowerCase())).slice(0,Be),[s]),l=t=>{if(!e.current||!r)return;let n=c[t],a=r.caret-s.length-1,l=r.caret;m.exec(O,[a,l]).exec(D,{type:`mention`,name:n},a).exec(me,` `),i(null),o(0)},u=(0,F.useEffectEvent)(()=>{if(!r||!c.length)return!1;o(e=>e<=0?c.length-1:e-1)}),d=(0,F.useEffectEvent)(()=>{if(!r||!c.length)return!1;o(e=>e>=c.length-1?0:e+1)}),f=(0,F.useEffectEvent)(()=>{if(!r||!c.length)return!1;l(a)}),p=(0,F.useEffectEvent)(()=>{if(!r||!c.length)return!1;i(null),o(0)}),m=(0,F.useMemo)(()=>{let e=w({doc:t,schema:He}).exec(C,{voidToString:e=>`@${e.name}`}).exec(A,{ArrowUp:u,ArrowDown:d,Enter:f,Escape:p}).exec(ye,e=>{let t=Math.min(...m.selection);if(K.test(ne(m.doc,0,t))){let n=e();i({top:n.top+n.height,left:n.left,caret:t})}else i(null);o(0)}).exec(j);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return m.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map(e=>(0,I.jsx)(`div`,{children:e.children.map(e=>`text`in e?e.text||(0,I.jsx)(`br`,{}):(0,I.jsxs)(`span`,{contentEditable:!1,style:{background:`#EAF5F9`,color:`#4276AA`,borderRadius:`3px`},children:[`@`,e.name]},M(m,e)))},M(m,e)))}),r&&(0,Me.createPortal)((0,I.jsx)(Ve,{top:r.top,left:r.left,chars:c,index:a,complete:l}),document.body)]})}},J=o({children:p(o({children:p(o({text:c(),comment:u(c())}))}))}),Y={render:()=>{let e=(0,F.useRef)(null),t=(0,F.useRef)(0),[n,r]=(0,F.useState)([{id:`0`,text:`This is comment.`}]),[i,a]=(0,F.useState)(null),[o,s]=(0,F.useState)(!1),[c,l]=(0,F.useState)({children:[{children:[{text:`Hello `},{text:` world`,comment:`0`},{text:`.`}]},{children:[{text:`Select text and add comments.`}]}]}),u=(0,F.useMemo)(()=>{let e=w({doc:c,schema:J}).exec(k).exec(C).exec(j);return e.on(`change`,()=>{l(e.doc);let t=new Set;for(let[n]of re(e.doc,[0,_(e.doc)]))n.comment&&t.add(n.comment);r(e=>e.filter(e=>t.has(e.id)))}),e.on(`selectionchange`,()=>{s(e.selection[0]!==e.selection[1]);let t=null;for(let n of e.exec(pe))if(n.comment){t=n.comment;break}a(t)}),e},[]);(0,F.useEffect)(()=>{if(e.current)return u.input(e.current)},[]);let d=(0,F.useRef)(null);return(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`textarea`,{ref:d,placeholder:`Select text and write comment`}),(0,I.jsx)(`button`,{disabled:!o,onClick:()=>{let e=d.current;if(!e)return;let n=e.value;if(!n)return;let i=String(++t.current);u.exec(E,`comment`,i),r(e=>[...e,{id:i,text:n}]),a(i),e.value=``},children:`Add comment`})]}),(0,I.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`},children:[(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8,flex:1,minHeight:120},children:c.children.map(e=>(0,I.jsx)(`div`,{children:e.children.map(e=>(0,I.jsx)(`span`,{style:{backgroundColor:e.comment?e.comment===i?`gold`:`khaki`:void 0},children:e.text||(0,I.jsx)(`br`,{})},M(u,e)))},M(u,e)))}),(0,I.jsx)(`div`,{style:{width:200,background:`#f5f5f5`,padding:8,display:`flex`,flexDirection:`column`,gap:8},children:n.map(e=>(0,I.jsxs)(`div`,{style:{padding:8,background:`white`,border:e.id===i?`solid 1px orange`:`solid 1px #e0e0e0`,borderRadius:6,cursor:`pointer`,fontSize:13},onClick:()=>{a(e.id)},children:[(0,I.jsx)(`div`,{children:e.text}),(0,I.jsx)(`button`,{style:{marginTop:6,fontSize:11},onClick:t=>{t.stopPropagation();let n=[];for(let[t,r]of re(u.doc,[0,_(u.doc)]))t.comment===e.id&&n.push([r,r+_(t)]);for(let e of n)u.exec(E,`comment`,void 0,e)},children:`delete`})]},e.id))})]})]})}},Ue=o({children:p(o({children:p(m([o({text:c()}),o({type:s(`image`),src:c()}),o({type:s(`video`),src:c()})]))}))}),X={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://picsum.photos/seed/1/320/240`},{text:` world `},{type:`image`,src:`https://picsum.photos/seed/2/320/240`}]},{children:[{text:`Hello `},{type:`video`,src:`https://mdn.github.io/shared-assets/videos/flower.mp4`},{text:` world `}]}]}),r=(0,F.useMemo)(()=>{let e=w({doc:t,schema:Ue}).exec(k).exec(P,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(Te,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src}),video:e=>({type:`video`,src:e.childNodes[0].src})}}).exec(C).exec(j);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{style:{display:`flex`,padding:4,gap:4},children:[(0,I.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(D,{type:`image`,src:e})},children:`insert image`}),(0,I.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(D,{type:`video`,src:e})},children:`insert video`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:16},children:t.children.map(e=>(0,I.jsx)(`div`,{children:e.children.map(e=>`text`in e?e.text||(0,I.jsx)(`br`,{}):e.type===`image`?(0,I.jsx)(`img`,{src:e.src,style:{maxWidth:240,borderRadius:4,verticalAlign:`middle`}},M(r,e)):e.type===`video`?(0,I.jsx)(`video`,{width:320,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,style:{borderRadius:4,verticalAlign:`middle`},children:(0,I.jsx)(`source`,{src:e.src})},M(r,e)):null)},M(r,e)))})]})}},We=o({children:p(o({locked:u(l()),children:p(o({text:c()}))}))}),Z={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`You can edit this paragraph.`}]},{locked:!0,children:[{text:`This paragraph is locked. You can select and copy it, but can't edit it.`}]},{children:[{text:`You can edit this paragraph too.`}]}]}),[r,i]=(0,F.useState)(null),a=(0,F.useMemo)(()=>{let e=w({doc:t,schema:We}).exec(k).exec(C).exec(Oe,{isLocked:e=>!!e.locked}).exec(j);return e.on(`change`,()=>{n(e.doc)}),e.on(`selectionchange`,()=>{i(b(e.doc,e.selection[0])[2][0]??null)}),e},[]);(0,F.useEffect)(()=>{if(e.current)return a.input(e.current)},[]);let o=r!=null&&!!t.children[r]?.locked;return(0,I.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`26px 1fr`,columnGap:6,rowGap:8,maxWidth:640,fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,fontSize:14,color:`#1e1e1e`,background:`#fff`,border:`1px solid #ddd`,borderRadius:4,padding:16,boxShadow:`0 1px 2px rgba(0, 0, 0, 0.05)`},children:[(0,I.jsx)(`style`,{children:`
          .lock-toggle:not([aria-pressed="true"]):hover { border-color: #757575; }
        `}),r!=null&&(0,I.jsx)(`button`,{className:`lock-toggle`,style:{gridColumn:1,gridRow:r+1,display:`flex`,alignItems:`center`,justifyContent:`center`,width:26,height:26,marginTop:2,padding:0,fontSize:13,background:o?`#757575`:`#fff`,border:`1px solid ${o?`#757575`:`#ccc`}`,borderRadius:2,cursor:`pointer`},title:o?`Unlock this block`:`Lock this block`,"aria-pressed":o,onMouseDown:e=>{e.preventDefault()},onClick:()=>{a.exec(de,`locked`,!0,void 0)},children:`🔒`}),(0,I.jsx)(`div`,{ref:e,style:{gridColumn:2,gridRow:`1 / span ${t.children.length}`,display:`grid`,gridTemplateRows:`subgrid`,outline:`none`},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{style:{padding:`4px 8px`,borderRadius:2,lineHeight:1.6,...e.locked&&{background:`#f6f7f7`,boxShadow:`inset 0 0 0 1px #ddd`},...t===r&&{outline:`1.5px solid #007cba`,outlineOffset:1}},children:e.children.map(e=>(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},M(a,e)))},M(a,e)))})]})}},Ge=o({children:p(o({children:p(m([o({text:c()}),o({type:s(`ruby`),ruby:c(),value:c()})]))}))}),Q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,F.useMemo)(()=>{let e=w({doc:t,schema:Ge}).exec(C,{voidToString:e=>e.value}).exec(j);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsx)(`div`,{children:(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map(e=>(0,I.jsx)(`div`,{children:e.children.map(e=>`text`in e?e.text||(0,I.jsx)(`br`,{}):(0,I.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,I.jsx)(`rp`,{children:`(`}),(0,I.jsx)(`rt`,{children:e.ruby}),(0,I.jsx)(`rp`,{children:`)`})]},M(r,e)))},M(r,e)))})})}},Ke=[`Empty`,`RichText`,`Tag`,`Combobox`,`Mention`,`Comment`,`Media`,`BlockLock`,`Ruby`],L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof basicSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: ""
        }]
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: basicSchema
      }).exec(internalTransferPlugin).exec(plainTransferPlugin).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div ref={ref} style={{
      backgroundColor: "white",
      border: "solid 1px darkgray",
      padding: 8
    }}>
        {doc.children.map(b => <div key={NodeId(editor, b)}>
            {b.children.map(n => <span key={NodeId(editor, n)}>{n.text || <br />}</span>)}
          </div>)}
      </div>;
  }
}`,...L.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [doc, setDoc] = useState<RichDoc>({
      children: [{
        children: [{
          text: "Hello",
          bold: true
        }, {
          text: " "
        }, {
          text: "World",
          italic: true
        }, {
          text: "."
        }]
      }, {
        children: [{
          text: "こんにちは。"
        }]
      }, {
        children: [{
          text: "👍❤️🧑‍🧑‍🧒"
        }]
      }]
    });
    const [menuRect, setMenuRect] = useState<{
      top: number;
      left: number;
    } | null>(null);
    const [currentFontSize, setCurrentFontSize] = useState<number | undefined>();
    const [currentBold, setCurrentBold] = useState(false);
    const [currentItalic, setCurrentItalic] = useState(false);
    const [currentUnderline, setCurrentUnderline] = useState(false);
    const [currentStrike, setCurrentStrike] = useState(false);
    const setFontSize = (value: number) => {
      editor.exec(Format, "fontSize", value);
    };
    const toggleBold = () => {
      editor.exec(ToggleFormat, "bold");
    };
    const toggleItalic = () => {
      editor.exec(ToggleFormat, "italic");
    };
    const toggleUnderline = () => {
      editor.exec(ToggleFormat, "underline");
    };
    const toggleStrike = () => {
      editor.exec(ToggleFormat, "strike");
    };
    const editor = useMemo(() => {
      const updateMenu = () => {
        let fontSizes = new Set<number>();
        let hasBold = false;
        let hasItalic = false;
        let hasUnderline = false;
        let hasStrike = false;
        for (const leaf of editor.exec(LeavesInRange)) {
          if (leaf.fontSize) {
            fontSizes.add(leaf.fontSize);
          } else {
            fontSizes.add(defaultFontSize);
          }
          if (leaf.bold) {
            hasBold = true;
          }
          if (leaf.italic) {
            hasItalic = true;
          }
          if (leaf.underline) {
            hasUnderline = true;
          }
          if (leaf.strike) {
            hasStrike = true;
          }
        }
        setCurrentFontSize(fontSizes.size === 1 ? fontSizes.values().next().value : undefined);
        setCurrentBold(hasBold);
        setCurrentItalic(hasItalic);
        setCurrentUnderline(hasUnderline);
        setCurrentStrike(hasStrike);
      };
      const e = createEditor({
        doc: doc,
        schema: richSchema
      }).exec(keymapPlugin, {
        "Mod+B": toggleBold,
        "Mod+I": toggleItalic,
        "Mod+U": toggleUnderline,
        "Mod+S": toggleStrike
      }).exec(selectionRectPlugin, getRect => {
        if (editor.selection[0] !== editor.selection[1]) {
          setMenuRect(prev => {
            const rect = getRect();
            if (prev && prev.top === rect.top && prev.left === rect.left) {
              return prev;
            } else {
              return {
                top: rect.top,
                left: rect.left
              };
            }
          });
        } else {
          setMenuRect(null);
        }
      }).exec(internalTransferPlugin).exec(plainTransferPlugin).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
        updateMenu();
      });
      e.on("selectionchange", () => {
        updateMenu();
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 4,
        paddingBottom: 8
      }}>
          <div>
            <select value={currentFontSize ?? "--"} onChange={e => {
            e.preventDefault();
            const value = Number(e.target.value);
            if (Number.isNaN(value)) return;
            setFontSize(value);
          }}>
              <option value="--">--</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
            </select>
            <button style={{
            fontWeight: currentBold ? "bold" : undefined
          }} onClick={toggleBold}>
              bold
            </button>
            <button style={{
            fontWeight: currentItalic ? "bold" : undefined
          }} onClick={toggleItalic}>
              italic
            </button>
            <button style={{
            fontWeight: currentUnderline ? "bold" : undefined
          }} onClick={toggleUnderline}>
              underline
            </button>
            <button style={{
            fontWeight: currentStrike ? "bold" : undefined
          }} onClick={toggleStrike}>
              strike
            </button>
          </div>
          <div>
            <button onClick={() => {
            editor.exec(ToggleBlockAttr, "align", "right", undefined);
          }}>
              align
            </button>
            <button onClick={() => {
            editor.exec(Indent);
          }}>
              indent
            </button>
            <button onClick={() => {
            editor.exec(Outdent);
          }}>
              outdent
            </button>
          </div>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8
      }}>
          {doc.children.map(b => <div key={NodeId(editor, b)} style={{
          textAlign: b.align,
          textIndent: b.indent ? \`\${b.indent}em\` : undefined
        }}>
              {b.children.map(n => <Text key={NodeId(editor, n)} node={n} />)}
            </div>)}
        </div>
        {menuRect ? <div style={{
        position: "fixed",
        top: menuRect.top - 30,
        left: menuRect.left,
        whiteSpace: "nowrap"
      }}>
            <button style={{
          fontWeight: currentBold ? "bold" : undefined
        }} onClick={toggleBold}>
              bold
            </button>
            <button style={{
          fontWeight: currentItalic ? "bold" : undefined
        }} onClick={toggleItalic}>
              italic
            </button>
            <button style={{
          fontWeight: currentUnderline ? "bold" : undefined
        }} onClick={toggleUnderline}>
              underline
            </button>
            <button style={{
          fontWeight: currentStrike ? "bold" : undefined
        }} onClick={toggleStrike}>
              strike
            </button>
          </div> : null}
      </div>;
  }
}`,...z.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        text: "Hello "
      }, {
        type: "tag",
        label: "Apple",
        value: "1"
      }, {
        text: " world "
      }, {
        type: "tag",
        label: "Orange",
        value: "2"
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: tagSchema
      }).exec(internalTransferPlugin).exec(plainTransferPlugin, {
        voidToString: node => node.label
      }).exec(singlelinePlugin).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(editor.doc);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    const labelRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    return <div>
        <div>
          <label>
            label:
            <input ref={labelRef} defaultValue="Grape" />
          </label>
          <label>
            value:
            <input ref={valueRef} defaultValue="123" />
          </label>
          <button onClick={() => {
          const label = labelRef.current?.value;
          const value = valueRef.current?.value;
          if (!label || !value) return;
          editor.exec(InsertNode, {
            type: "tag",
            value,
            label
          });
        }}>
            insert
          </button>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        padding: 8
      }}>
          {doc.children.map(t => "text" in t ? t.text || <br /> : <TagChip key={NodeId(editor, t)} label={t.label} onLabelClick={e => {
          e.preventDefault();
          const start = getNodeOffset(doc, t);
          if (start == null) return;
          const value = window.prompt("label:", t.label);
          if (!value) return;
          editor.exec(SetVoidAttr, "label", value, start + getNodeSize(t));
        }} onRemove={e => {
          e.preventDefault();
          const start = getNodeOffset(doc, t);
          if (start == null) return;
          editor.exec(Delete, [start, start + getNodeSize(t)]);
        }} />)}
        </div>
      </div>;
  }
}`,...H.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        type: "tag",
        label: "Luke Skywalker",
        value: "Luke Skywalker"
      }]
    });
    const [caret, setCaret] = useState(0);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const selected = useMemo((): ReadonlySet<string> => new Set(doc.children.flatMap(n => "text" in n ? [] : [n.value])), [doc]);
    const query = useMemo(() => getQuery(doc, caret), [doc, caret]);
    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return q ? CHARACTERS.filter(c => c.toLowerCase().includes(q)) : CHARACTERS;
    }, [query]);
    if (index > filtered.length - 1) {
      setIndex(-1);
    }
    const toggle = (item: string) => {
      const tag = doc.children.find(n => !("text" in n) && n.value === item);
      const start = tag && getNodeOffset(doc, tag);
      if (tag && start != null) {
        // remove the tag if it's already inserted
        editor.exec(Delete, [start, start + getNodeSize(tag)]);
      } else {
        // replace the query with the tag
        const start = caret - query.length;
        if (query) {
          editor.exec(Delete, [start, caret]);
        }
        editor.exec(InsertNode, {
          type: "tag",
          label: item,
          value: item
        }, start);
      }
      setOpen(false);
      setIndex(-1);
    };
    const onPrev = useEffectEvent(() => {
      if (!open || !filtered.length) return false;
      setIndex(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
    });
    const onNext = useEffectEvent(() => {
      if (!open || !filtered.length) return false;
      setIndex(prev => prev >= filtered.length - 1 ? 0 : prev + 1);
    });
    const onComplete = useEffectEvent(() => {
      if (!open || index === -1) return false;
      toggle(filtered[index]!);
    });
    const onClose = useEffectEvent(() => {
      if (!open) return false;
      setOpen(false);
      setIndex(-1);
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: tagSchema
      }).exec(internalTransferPlugin).exec(plainTransferPlugin, {
        voidToString: node => node.label
      }).exec(singlelinePlugin).exec(keymapPlugin, {
        ArrowUp: onPrev,
        ArrowDown: onNext,
        Enter: onComplete,
        Escape: onClose
      }).exec(nodeIdPlugin);
      e.on("change", () => {
        const at = Math.min(...e.selection);
        setDoc(e.doc);
        setCaret(at);
        setOpen(!!getQuery(e.doc, at).trim());
        setIndex(-1);
      });
      e.on("selectionchange", () => {
        setCaret(Math.min(...e.selection));
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div style={{
      position: "relative",
      width: 320,
      fontSize: 13
    }} onBlur={() => {
      setOpen(false);
      setIndex(-1);
    }}>
        <div style={{
        display: "flex",
        alignItems: "flex-start",
        background: "white",
        border: "solid 1px darkgray",
        borderRadius: 4
      }}>
          <div ref={ref} style={{
          flex: 1,
          minWidth: 0,
          padding: 6,
          lineHeight: 2
        }}>
            {doc.children.map(t => "text" in t ? t.text || <br /> : <TagChip key={NodeId(editor, t)} label={t.label} onRemove={e => {
            e.preventDefault();
            toggle(t.value);
          }} />)}
          </div>
          <button style={{
          alignSelf: "stretch",
          padding: "0 6px",
          border: "none",
          borderLeft: "solid 1px #ddd",
          background: "transparent",
          cursor: "pointer"
        }} onMouseDown={e => {
          // keep focus in the editor not to close the menu
          e.preventDefault();
        }} onClick={() => {
          ref.current?.focus();
          setOpen(prev => !prev);
          setIndex(-1);
        }}>
            ▾
          </button>
        </div>
        {open && <ComboboxMenu items={filtered} index={index} selected={selected} onSelect={toggle} />}
      </div>;
  }
}`,...W.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof mentionSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hi "
        }, {
          type: "mention",
          name: "Luke Skywalker"
        }, {
          text: " and "
        }, {
          type: "mention",
          name: "Leia Organa"
        }, {
          text: ", could you check this out? Type @ to mention someone."
        }]
      }, {
        children: [{
          text: ""
        }]
      }]
    });
    const [pos, setPos] = useState<{
      top: number;
      left: number;
      caret: number;
    } | null>(null);
    const [index, setIndex] = useState<number>(0);
    const match = pos && sliceText(doc, 0, pos.caret).match(MENTION_REG);
    const name = match?.[1] ?? "";
    const filtered = useMemo(() => CHARACTERS.filter(c => c.toLowerCase().startsWith(name.toLowerCase())).slice(0, MAX_LIST_LENGTH), [name]);
    const complete = (i: number) => {
      if (!ref.current || !pos) return;
      const selected = filtered[i];
      const start = pos.caret - name.length - 1;
      const end = pos.caret;
      editor.exec(Delete, [start, end]).exec(InsertNode, {
        type: "mention",
        name: selected
      }, start).exec(InsertText, " ");
      setPos(null);
      setIndex(0);
    };
    const onUp = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setIndex(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
    });
    const onDown = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setIndex(prev => prev >= filtered.length - 1 ? 0 : prev + 1);
    });
    const onComplete = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      complete(index);
    });
    const onClose = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setPos(null);
      setIndex(0);
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc,
        schema: mentionSchema
      }).exec(plainTransferPlugin, {
        voidToString: n => \`@\${n.name}\`
      }).exec(keymapPlugin, {
        ArrowUp: onUp,
        ArrowDown: onDown,
        Enter: onComplete,
        Escape: onClose
      }).exec(selectionRectPlugin, getRect => {
        const selectionStart = Math.min(...editor.selection);
        if (MENTION_REG.test(sliceText(editor.doc, 0, selectionStart))) {
          const r = getRect();
          setPos({
            top: r.top + r.height,
            left: r.left,
            caret: selectionStart
          });
        } else {
          setPos(null);
        }
        setIndex(0);
      }).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8
      }}>
          {doc.children.map(r => <div key={NodeId(editor, r)}>
              {r.children.map(n => "text" in n ? n.text || <br /> : <span key={NodeId(editor, n)} contentEditable={false} style={{
            background: "#EAF5F9",
            color: "#4276AA",
            borderRadius: "3px"
          }}>
                    @{n.name}
                  </span>)}
            </div>)}
        </div>
        {pos && createPortal(<Menu top={pos.top} left={pos.left} chars={filtered} index={index} complete={complete} />, document.body)}
      </div>;
  }
}`,...q.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const commentIdRef = useRef(0);
    const [comments, setComments] = useState([{
      id: "0",
      text: "This is comment."
    }]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [hasSelection, setHasSelection] = useState(false);
    type Doc = v.InferOutput<typeof commentSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hello "
        }, {
          text: " world",
          comment: "0"
        }, {
          text: "."
        }]
      }, {
        children: [{
          text: "Select text and add comments."
        }]
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: commentSchema
      }).exec(internalTransferPlugin).exec(plainTransferPlugin).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
        const ids = new Set<string>();
        for (const [leaf] of iterLeaves(e.doc, [0, getNodeSize(e.doc)])) {
          if (leaf.comment) {
            ids.add(leaf.comment);
          }
        }
        setComments(prev => prev.filter(c => ids.has(c.id)));
      });
      e.on("selectionchange", () => {
        setHasSelection(e.selection[0] !== e.selection[1]);
        let active: string | null = null;
        for (const leaf of e.exec(LeavesInRange)) {
          if (leaf.comment) {
            active = leaf.comment;
            break;
          }
        }
        setActiveId(active);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    return <div>
        <div>
          <textarea ref={inputRef} placeholder="Select text and write comment" />
          <button disabled={!hasSelection} onClick={() => {
          const input = inputRef.current;
          if (!input) return;
          const value = input.value;
          if (!value) return;
          const id = String(++commentIdRef.current);
          editor.exec(Format, "comment", id);
          setComments(prev => [...prev, {
            id,
            text: value
          }]);
          setActiveId(id);
          input.value = "";
        }}>
            Add comment
          </button>
        </div>
        <div style={{
        display: "flex",
        alignItems: "flex-start"
      }}>
          <div ref={ref} style={{
          backgroundColor: "white",
          padding: 8,
          flex: 1,
          minHeight: 120
        }}>
            {doc.children.map(b => <div key={NodeId(editor, b)}>
                {b.children.map(t => <span key={NodeId(editor, t)} style={{
              backgroundColor: t.comment ? t.comment === activeId ? "gold" : "khaki" : undefined
            }}>
                    {t.text || <br />}
                  </span>)}
              </div>)}
          </div>
          <div style={{
          width: 200,
          background: "#f5f5f5",
          padding: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}>
            {comments.map(c => <div key={c.id} style={{
            padding: 8,
            background: "white",
            border: c.id === activeId ? "solid 1px orange" : "solid 1px #e0e0e0",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13
          }} onClick={() => {
            setActiveId(c.id);
          }}>
                <div>{c.text}</div>
                <button style={{
              marginTop: 6,
              fontSize: 11
            }} onClick={e => {
              e.stopPropagation();
              const ranges: [number, number][] = [];
              for (const [leaf, offset] of iterLeaves(editor.doc, [0, getNodeSize(editor.doc)])) {
                if (leaf.comment === c.id) {
                  ranges.push([offset, offset + getNodeSize(leaf)]);
                }
              }
              for (const range of ranges) {
                editor.exec(Format, "comment", undefined, range);
              }
            }}>
                  delete
                </button>
              </div>)}
          </div>
        </div>
      </div>;
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof mediaSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hello "
        }, {
          type: "image",
          src: "https://picsum.photos/seed/1/320/240"
        }, {
          text: " world "
        }, {
          type: "image",
          src: "https://picsum.photos/seed/2/320/240"
        }]
      }, {
        children: [{
          text: "Hello "
        }, {
          type: "video",
          src: "https://mdn.github.io/shared-assets/videos/flower.mp4"
        }, {
          text: " world "
        }]
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: mediaSchema
      }).exec(internalTransferPlugin).exec(fileTransferPlugin, {
        "image/png": file => ({
          type: "image",
          src: URL.createObjectURL(file)
        })
      }).exec(htmlTransferPlugin, {
        serializers: {
          text: text => ({
            text
          }),
          img: e => {
            return {
              type: "image",
              src: e.src
            };
          },
          video: e => {
            return {
              type: "video",
              src: (e.childNodes[0] as HTMLSourceElement).src
            };
          }
        }
      }).exec(plainTransferPlugin).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div>
        <div style={{
        display: "flex",
        padding: 4,
        gap: 4
      }}>
          <button onClick={() => {
          const value = window.prompt("url:");
          if (!value) return;
          editor.exec(InsertNode, {
            type: "image",
            src: value
          });
        }}>
            insert image
          </button>
          <button onClick={() => {
          const value = window.prompt("url:");
          if (!value) return;
          editor.exec(InsertNode, {
            type: "video",
            src: value
          });
        }}>
            insert video
          </button>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        padding: 16
      }}>
          {doc.children.map(b => <div key={NodeId(editor, b)}>
              {b.children.map(t => "text" in t ? t.text || <br /> : t.type === "image" ? <img key={NodeId(editor, t)} src={t.src} style={{
            maxWidth: 240,
            borderRadius: 4,
            verticalAlign: "middle"
          }} /> : t.type === "video" ?
          // safari needs contentEditable="false"
          <video key={NodeId(editor, t)} width={320} controls contentEditable="false" suppressContentEditableWarning style={{
            borderRadius: 4,
            verticalAlign: "middle"
          }}>
                    <source src={t.src} />
                  </video> : null)}
            </div>)}
        </div>
      </div>;
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof lockSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "You can edit this paragraph."
        }]
      }, {
        locked: true,
        children: [{
          text: "This paragraph is locked. You can select and copy it, but can't edit it."
        }]
      }, {
        children: [{
          text: "You can edit this paragraph too."
        }]
      }]
    });
    const [blockIndex, setBlockIndex] = useState<number | null>(null);
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: lockSchema
      }).exec(internalTransferPlugin).exec(plainTransferPlugin).exec(blockLockPlugin, {
        isLocked: b => !!b.locked
      }).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      e.on("selectionchange", () => {
        setBlockIndex(getLeafBlockAt(e.doc, e.selection[0])[2][0] ?? null);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    const locked = blockIndex != null && !!doc.children[blockIndex]?.locked;
    return <div style={{
      display: "grid",
      gridTemplateColumns: "26px 1fr",
      columnGap: 6,
      rowGap: 8,
      maxWidth: 640,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 14,
      color: "#1e1e1e",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 4,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    }}>
        <style>{\`
          .lock-toggle:not([aria-pressed="true"]):hover { border-color: #757575; }
        \`}</style>
        {blockIndex != null && <button className="lock-toggle" style={{
        gridColumn: 1,
        gridRow: blockIndex + 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        marginTop: 2,
        padding: 0,
        fontSize: 13,
        background: locked ? "#757575" : "#fff",
        border: \`1px solid \${locked ? "#757575" : "#ccc"}\`,
        borderRadius: 2,
        cursor: "pointer"
      }} title={locked ? "Unlock this block" : "Lock this block"} aria-pressed={locked} onMouseDown={e => {
        e.preventDefault();
      }} onClick={() => {
        editor.exec(ToggleBlockAttr, "locked", true, undefined);
      }}>
            🔒
          </button>}
        <div ref={ref} style={{
        gridColumn: 2,
        gridRow: \`1 / span \${doc.children.length}\`,
        display: "grid",
        gridTemplateRows: "subgrid",
        outline: "none"
      }}>
          {doc.children.map((b, i) => <div key={NodeId(editor, b)} style={{
          padding: "4px 8px",
          borderRadius: 2,
          lineHeight: 1.6,
          ...(b.locked && {
            background: "#f6f7f7",
            boxShadow: "inset 0 0 0 1px #ddd"
          }),
          ...(i === blockIndex && {
            outline: "1.5px solid #007cba",
            outlineOffset: 1
          })
        }}>
              {b.children.map(n => <span key={NodeId(editor, n)}>{n.text || <br />}</span>)}
            </div>)}
        </div>
      </div>;
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof rubySchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "また"
        }, {
          type: "ruby",
          ruby: "あした",
          value: "明日"
        }, {
          text: "お"
        }, {
          type: "ruby",
          ruby: "あ",
          value: "会"
        }, {
          text: "いしましょう。"
        }]
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: rubySchema
      }).exec(plainTransferPlugin, {
        voidToString: n => n.value
      }).exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div>
        <div ref={ref} style={{
        backgroundColor: "white",
        padding: 8
      }}>
          {doc.children.map(b => <div key={NodeId(editor, b)}>
              {b.children.map(t => "text" in t ? t.text || <br /> : <ruby key={NodeId(editor, t)} contentEditable={false}>
                    {t.value}
                    <rp>(</rp>
                    <rt>{t.ruby}</rt>
                    <rp>)</rp>
                  </ruby>)}
            </div>)}
        </div>
      </div>;
  }
}`,...Q.parameters?.docs?.source}}}})))()}$();export{Z as BlockLock,W as Combobox,Y as Comment,L as Empty,X as Media,q as Mention,z as RichText,Q as Ruby,H as Tag,Ke as __namedExportsOrder,Ne as default};