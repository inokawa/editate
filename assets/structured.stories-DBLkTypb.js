import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-B9GY5xHG.js";import{t as r}from"./react-dom-yhdWM0L_.js";import{t as i}from"./jsx-runtime-O9QVJvLM.js";import{A as a,E as o,I as s,N as c,T as l,a as u,d,f,g as p,h as m,j as h,l as g,s as _,t as v,v as y}from"./src-C4k-hfcv.js";function b(e){return!e&&!I?re:{lang:e?.lang??I?.lang,message:e?.message,abortEarly:e?.abortEarly??I?.abortEarly,abortPipeEarly:e?.abortPipeEarly??I?.abortPipeEarly}}function x(e){return ie?.get(e)}function S(e){return ae?.get(e)}function C(e,t){return oe?.get(e)?.get(t)}function w(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function T(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??w(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??C(e.reference,c.lang)??(l?S(c.lang):null)??r.message??x(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function E(e){let t=L.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},b())}},L.set(e,t)),t}function D(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function ee(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function te(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function O(e,t){return{kind:`schema`,type:`array`,reference:O,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return E(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else T(this,`type`,e,t);return e}}}function k(e){return{kind:`schema`,type:`boolean`,reference:k,expects:`boolean`,async:!1,message:e,get"~standard"(){return E(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:T(this,`type`,e,t),e}}}function A(e,t){return{kind:`schema`,type:`literal`,reference:A,expects:w(e),async:!1,literal:e,message:t,get"~standard"(){return E(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:T(this,`type`,e,t),e}}}function j(e,t){return{kind:`schema`,type:`optional`,reference:j,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return E(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=te(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function M(e,t){return{kind:`schema`,type:`picklist`,reference:M,expects:D(e.map(w),`|`),async:!1,options:e,message:t,get"~standard"(){return E(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:T(this,`type`,e,t),e}}}function N(e,t){return{kind:`schema`,type:`strict_object`,reference:N,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return E(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:te(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=ee(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(T(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){T(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else T(this,`type`,e,t);return e}}}function P(e){return{kind:`schema`,type:`string`,reference:P,expects:`string`,async:!1,message:e,get"~standard"(){return E(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:T(this,`type`,e,t),e}}}function ne(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function F(e,t){return{kind:`schema`,type:`union`,reference:F,expects:D(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return E(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];T(this,`type`,e,t,{issues:ne(r)}),e.typed=!0}else if(i?.length===1)return i[0];else T(this,`type`,e,t,{issues:ne(i)});return e}}}var I,re,ie,ae,oe,L,se=t((()=>{re={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},L=new WeakMap})),R,z,B,V,H,U,W,G,K,q,J,Y,ce,le,X,ue,de,Z,fe,Q,pe,$,me;t((()=>{R=e(n()),v(),se(),z=e(r()),B=i(),V={component:y},H=N({children:O(N({children:O(N({text:P()}))}))}),U={render:()=>{let e=(0,R.useRef)(null),[t,n]=(0,R.useState)({children:[{children:[{text:`Hello world.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=(0,R.useMemo)(()=>{let e=y({doc:t,schema:H}).exec(d).exec(m);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,R.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,B.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,B.jsx)(`div`,{children:e.children.map((e,t)=>(0,B.jsx)(`span`,{children:e.text||(0,B.jsx)(`br`,{})},t))},t))})}},W=N({text:P(),bold:j(k()),italic:j(k()),underline:j(k()),strike:j(k())}),G=N({children:O(N({align:j(M([`left`,`right`])),children:O(W)}))}),K=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,B.jsx)(t,{style:n,children:e.text||(0,B.jsx)(`br`,{})})},q={render:()=>{let e=(0,R.useRef)(null),[t,n]=(0,R.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),[r,i]=(0,R.useState)(null),[o,s]=(0,R.useState)(!1),[l,u]=(0,R.useState)(!1),[f,p]=(0,R.useState)(!1),[v,b]=(0,R.useState)(!1),x=()=>{E.exec(h,`bold`)},S=()=>{E.exec(h,`italic`)},C=()=>{E.exec(h,`underline`)},w=()=>{E.exec(h,`strike`)},T=()=>{E.exec(a,`align`,`right`,void 0)},E=(0,R.useMemo)(()=>{let e=()=>{let e=!1,t=!1,n=!1,r=!1;for(let i of E.exec(c))i.bold&&(e=!0),i.italic&&(t=!0),i.underline&&(n=!0),i.strike&&(r=!0);s(e),u(t),p(n),b(r)},r=y({doc:t,schema:G}).exec(g,{"Mod+B":x,"Mod+I":S,"Mod+U":C,"Mod+S":w}).exec(_,e=>{E.selection[0]===E.selection[1]?i(null):i(t=>{let n=e();return t&&t.top===n.top&&t.left===n.left?t:{top:n.top,left:n.left}})}).exec(d).exec(m);return r.on(`change`,()=>{n(r.doc),e()}),r.on(`selectionchange`,()=>{e()}),r},[]);return(0,R.useEffect)(()=>{if(e.current)return E.input(e.current)},[]),(0,B.jsxs)(`div`,{children:[(0,B.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4,padding:4},children:[(0,B.jsxs)(`div`,{children:[(0,B.jsx)(`button`,{style:{fontWeight:o?`bold`:void 0},onClick:x,children:`bold`}),(0,B.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:S,children:`italic`}),(0,B.jsx)(`button`,{style:{fontWeight:f?`bold`:void 0},onClick:C,children:`underline`}),(0,B.jsx)(`button`,{style:{fontWeight:v?`bold`:void 0},onClick:w,children:`strike`})]}),(0,B.jsx)(`div`,{children:(0,B.jsx)(`button`,{onClick:T,children:`align`})})]}),(0,B.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,B.jsx)(`div`,{style:{textAlign:e.align},children:e.children.map((e,t)=>(0,B.jsx)(K,{node:e},t))},t))}),r?(0,B.jsxs)(`div`,{style:{position:`fixed`,top:r.top-30,left:r.left,whiteSpace:`nowrap`},children:[(0,B.jsx)(`button`,{style:{fontWeight:o?`bold`:void 0},onClick:x,children:`bold`}),(0,B.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:S,children:`italic`}),(0,B.jsx)(`button`,{style:{fontWeight:f?`bold`:void 0},onClick:C,children:`underline`}),(0,B.jsx)(`button`,{style:{fontWeight:v?`bold`:void 0},onClick:w,children:`strike`})]}):null]})}},J=N({children:O(F([N({text:P()}),N({type:A(`tag`),label:P(),value:P()})]))}),Y={render:()=>{let e=(0,R.useRef)(null),[t,n]=(0,R.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,R.useMemo)(()=>{let e=y({doc:t,schema:J}).exec(d).exec(m,{voidToString:e=>e.label}).exec(u);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,R.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,R.useRef)(null),a=(0,R.useRef)(null);return(0,B.jsxs)(`div`,{children:[(0,B.jsxs)(`div`,{children:[(0,B.jsxs)(`label`,{children:[`label:`,(0,B.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,B.jsxs)(`label`,{children:[`value:`,(0,B.jsx)(`input`,{ref:a,defaultValue:`123`})]}),(0,B.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=a.current?.value;!e||!t||r.exec(o,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,B.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>`text`in e?e.text||(0,B.jsx)(`br`,{}):(0,B.jsx)(`span`,{contentEditable:!1,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},ce=`Aayla Secura,Adi Gallia,Admiral Dodd Rancit,Admiral Firmus Piett,Admiral Gial Ackbar,Admiral Ozzel,Admiral Raddus,Admiral Terrinald Screed,Admiral Trench,Admiral U.O. Statura,Agen Kolar,Agent Kallus,Aiolin and Morit Astarte,Aks Moe,Almec,Alton Kastle,Amee,AP-5,Armitage Hux,Artoo,Arvel Crynyd,Asajj Ventress,Aurra Sing,AZI-3,Bala-Tik,Barada,Bargwill Tomder,Baron Papanoida,Barriss Offee,Baze Malbus,Bazine Netal,BB-8,BB-9E,Ben Quadinaros,Berch Teller,Beru Lars,Bib Fortuna,Biggs Darklighter,Black Krrsantan,Bo-Katan Kryze,Boba Fett,Bobbajo,Bodhi Rook,Borvo the Hutt,Boss Nass,Bossk,Breha Antilles-Organa,Bren Derlin,Brendol Hux,BT-1,C-3PO,C1-10P,Cad Bane,Caluan Ematt,Captain Gregor,Captain Phasma,Captain Quarsh Panaka,Captain Rex,Carlist Rieekan,Casca Panzoro,Cassian Andor,Cassio Tagge,Cham Syndulla,Che Amanwe Papanoida,Chewbacca,Chi Eekway Papanoida,Chief Chirpa,Chirrut Îmwe,Ciena Ree,Cin Drallig,Clegg Holdfast,Cliegg Lars,Coleman Kcaj,Coleman Trebor,Colonel Kaplan,Commander Bly,Commander Cody (CC-2224),Commander Fil (CC-3714),Commander Fox,Commander Gree,Commander Jet,Commander Wolffe,Conan Antonio Motti,Conder Kyl,Constable Zuvio,Cordé,Cpatain Typho,Crix Madine,Cut Lawquane,Dak Ralter,Dapp,Darth Bane,Darth Maul,Darth Tyranus,Daultay Dofine,Del Meeko,Delian Mors,Dengar,Depa Billaba,Derek Klivian,Dexter Jettster,Dineé Ellberger,DJ,Doctor Aphra,Doctor Evazan,Dogma,Dormé,Dr. Cylo,Droidbait,Droopy McCool,Dryden Vos,Dud Bolt,Ebe E. Endocott,Echuu Shen-Jon,Eeth Koth,Eighth Brother,Eirtaé,Eli Vanto,Ellé,Ello Asty,Embo,Eneb Ray,Enfys Nest,EV-9D9,Evaan Verlaine,Even Piell,Ezra Bridger,Faro Argyus,Feral,Fifth Brother,Finis Valorum,Finn,Fives,FN-1824,FN-2003,Fodesinbeed Annodue,Fulcrum,FX-7,GA-97,Galen Erso,Gallius Rax,Garazeb "Zeb" Orrelios,Gardulla the Hutt,Garrick Versio,Garven Dreis,Gavyn Sykes,Gideon Hask,Gizor Dellso,Gonk droid,Grand Inquisitor,Greeata Jendowanian,Greedo,Greer Sonnel,Grievous,Grummgar,Gungi,Hammerhead,Han Solo,Harter Kalonia,Has Obbit,Hera Syndulla,Hevy,Hondo Ohnaka,Huyang,Iden Versio,IG-88,Ima-Gun Di,Inquisitors,Inspector Thanoth,Jabba,Jacen Syndulla,Jan Dodonna,Jango Fett,Janus Greejatus,Jar Jar Binks,Jas Emari,Jaxxon,Jek Tono Porkins,Jeremoch Colton,Jira,Jobal Naberrie,Jocasta Nu,Joclad Danva,Joh Yowza,Jom Barell,Joph Seastriker,Jova Tarkin,Jubnuk,Jyn Erso,K-2SO,Kanan Jarrus,Karbin,Karina the Great,Kes Dameron,Ketsu Onyo,Ki-Adi-Mundi,King Katuunko,Kit Fisto,Kitster Banai,Klaatu,Klik-Klak,Korr Sella,Kylo Ren,L3-37,Lama Su,Lando Calrissian,Lanever Villecham,Leia Organa,Letta Turmond,Lieutenant Kaydel Ko Connix,Lieutenant Thire,Lobot,Logray,Lok Durd,Longo Two-Guns,Lor San Tekka,Lorth Needa,Lott Dod,Luke Skywalker,Lumat,Luminara Unduli,Lux Bonteri,Lyn Me,Lyra Erso,Mace Windu,Malakili,Mama the Hutt,Mars Guo,Mas Amedda,Mawhonic,Max Rebo,Maximilian Veers,Maz Kanata,ME-8D9,Meena Tills,Mercurial Swift,Mina Bonteri,Miraj Scintel,Mister Bones,Mod Terrik,Moden Canady,Mon Mothma,Moradmin Bast,Moralo Eval,Morley,Mother Talzin,Nahdar Vebb,Nahdonnis Praji,Nien Nunb,Niima the Hutt,Nines,Norra Wexley,Nute Gunray,Nuvo Vindi,Obi-Wan Kenobi,Odd Ball,Ody Mandrell,Omi,Onaconda Farr,Oola,OOM-9,Oppo Rancisis,Orn Free Taa,Oro Dassyne,Orrimarko,Osi Sobeck,Owen Lars,Pablo-Jill,Padmé Amidala,Pagetti Rook,Paige Tico,Paploo,Petty Officer Thanisson,Pharl McQuarrie,Plo Koon,Po Nudo,Poe Dameron,Poggle the Lesser,Pong Krell,Pooja Naberrie,PZ-4CO,Quarrie,Quay Tolsite,Queen Apailana,Queen Jamillia,Queen Neeyutnee,Qui-Gon Jinn,Quiggold,Quinlan Vos,R2-D2,R2-KT,R3-S6,R4-P17,R5-D4,RA-7,Rabé,Rako Hardeen,Ransolm Casterfo,Rappertunie,Ratts Tyerell,Raymus Antilles,Ree-Yees,Reeve Panzoro,Rey,Ric Olié,Riff Tamson,Riley,Rinnriyin Di,Rio Durant,Rogue Squadron,Romba,Roos Tarpals,Rose Tico,Rotta the Hutt,Rukh,Rune Haako,Rush Clovis,Ruwee Naberrie,Ryoo Naberrie,Sabé,Sabine Wren,Saché,Saelt-Marae,Saesee Tiin,Salacious B. Crumb,San Hill,Sana Starros,Sarco Plank,Sarkli,Satine Kryze,Savage Opress,Sebulba,Senator Organa,Sergeant Kreel,Seventh Sister,Shaak Ti,Shara Bey,Shmi Skywalker,Shu Mai,Sidon Ithano,Sifo-Dyas,Sim Aloo,Siniir Rath Velus,Sio Bibble,Sixth Brother,Slowen Lo,Sly Moore,Snaggletooth,Snap Wexley,Snoke,Sola Naberrie,Sora Bulq,Strono Tuggs,Sy Snootles,Tallissan Lintra,Tarfful,Tasu Leech,Taun We,TC-14,Tee Watt Kaa,Teebo,Teedo,Teemto Pagalies,Temiri Blagg,Tessek,Tey How,Thane Kyrell,The Bendu,The Smuggler,Thrawn,Tiaan Jerjerrod,Tion Medon,Tobias Beckett,Tulon Voidgazer,Tup,U9-C4,Unkar Plutt,Val Beckett,Vanden Willard,Vice Admiral Amilyn Holdo,Vober Dand,WAC-47,Wag Too,Wald,Walrus Man,Warok,Wat Tambor,Watto,Wedge Antilles,Wes Janson,Wicket W. Warrick,Wilhuff Tarkin,Wollivan,Wuher,Wullf Yularen,Xamuel Lennox,Yaddle,Yarael Poof,Yoda,Zam Wesell,Zev Senesca,Ziro the Hutt,Zuckuss`.split(`,`),le=8,X=/\B@([\-+\w]*)$/,ue=({chars:e,index:t,top:n,left:r,complete:i})=>(0,B.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,fontSize:`12px`,border:`solid 1px gray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,B.jsx)(`div`,{style:{padding:`4px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),de=N({children:O(N({children:O(F([N({text:P()}),N({type:A(`mention`),name:P()})]))}))}),Z={render:()=>{let e=(0,R.useRef)(null),[t,n]=(0,R.useState)({children:[{children:[{text:`Hi, `},{type:`mention`,name:`Captain Gregor`},{text:` and `},{type:`mention`,name:`Jaxxon`},{text:` . Please enter @ to show suggestions.`}]},{children:[{text:``}]}]}),[r,i]=(0,R.useState)(null),[a,c]=(0,R.useState)(0),u=(r&&s(t,0,r.caret).match(X))?.[1]??``,d=(0,R.useMemo)(()=>ce.filter(e=>e.toLowerCase().startsWith(u.toLowerCase())).slice(0,le),[u]),f=t=>{if(!e.current||!r)return;let n=d[t],a=r.caret-u.length-1,s=r.caret;b.exec(l,[a,s]).exec(o,{type:`mention`,name:n},a),i(null),c(0)},p=(0,R.useEffectEvent)(()=>{if(!r||!d.length)return!1;c(e=>e<=0?d.length-1:e-1)}),m=(0,R.useEffectEvent)(()=>{if(!r||!d.length)return!1;c(e=>e>=d.length-1?0:e+1)}),h=(0,R.useEffectEvent)(()=>{if(!r||!d.length)return!1;f(a)}),v=(0,R.useEffectEvent)(()=>{if(!r||!d.length)return!1;i(null),c(0)}),b=(0,R.useMemo)(()=>{let e=y({doc:t,schema:de}).exec(g,{ArrowUp:p,ArrowDown:m,Enter:h,Escape:v}).exec(_,e=>{let t=Math.min(...b.selection);if(X.test(s(b.doc,0,t))){let n=e();i({top:n.top+n.height,left:n.left,caret:t})}else i(null);c(0)});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,R.useEffect)(()=>{if(e.current)return b.input(e.current)},[]),(0,B.jsxs)(`div`,{children:[(0,B.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,B.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,B.jsx)(`br`,{}):(0,B.jsxs)(`span`,{contentEditable:!1,style:{background:`#EAF5F9`,color:`#4276AA`,borderRadius:`3px`},children:[`@`,e.name]},t))},t))}),r&&(0,z.createPortal)((0,B.jsx)(ue,{top:r.top,left:r.left,chars:d,index:a,complete:f}),document.body)]})}},fe=N({children:O(N({children:O(F([N({text:P()}),N({type:A(`image`),src:P()}),N({type:A(`video`),src:P()}),N({type:A(`youtube`),id:P()})]))}))}),Q={render:()=>{let e=(0,R.useRef)(null),[t,n]=(0,R.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]},{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]},{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,R.useMemo)(()=>{let e=y({doc:t,schema:fe}).exec(d).exec(p,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(f,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src}),video:e=>({type:`video`,src:e.childNodes[0].src}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(m);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,R.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,B.jsxs)(`div`,{children:[(0,B.jsxs)(`div`,{style:{display:`flex`,padding:4,gap:4},children:[(0,B.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(o,{type:`image`,src:e})},children:`insert image`}),(0,B.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(o,{type:`video`,src:e})},children:`insert video`}),(0,B.jsx)(`button`,{onClick:()=>{let e=window.prompt(`id:`);e&&r.exec(o,{type:`youtube`,id:e})},children:`insert youtube`})]}),(0,B.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,B.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,B.jsx)(`br`,{}):e.type===`image`?(0,B.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t):e.type===`video`?(0,B.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,B.jsx)(`source`,{src:e.src})},t):e.type===`youtube`?(0,B.jsx)(`iframe`,{"data-youtube-id":e.id,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e.id,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}):null)},t))})]})}},pe=N({children:O(N({children:O(F([N({text:P()}),N({type:A(`ruby`),ruby:P(),value:P()})]))}))}),$={render:()=>{let e=(0,R.useRef)(null),[t,n]=(0,R.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,R.useMemo)(()=>{let e=y({doc:t,schema:pe}).exec(m,{voidToString:e=>e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,R.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,B.jsx)(`div`,{children:(0,B.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,B.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,B.jsx)(`br`,{}):(0,B.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,B.jsx)(`rp`,{children:`(`}),(0,B.jsx)(`rt`,{children:e.ruby}),(0,B.jsx)(`rp`,{children:`)`})]},t))},t))})})}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof basicSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hello world."
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
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: basicSchema
      }).exec(internalTranferPlugin).exec(plainTransferPlugin);
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
        {doc.children.map((b, i) => <div key={i}>
            {b.children.map((n, j) => <span key={j}>{n.text || <br />}</span>)}
          </div>)}
      </div>;
  }
}`,...U.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof richSchema>;
    const [doc, setDoc] = useState<Doc>({
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
    const [rect, setRect] = useState<{
      top: number;
      left: number;
    } | null>(null);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [strike, setStrike] = useState(false);
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
    const toggleAlign = () => {
      editor.exec(ToggleBlockAttr, "align", "right", undefined);
    };
    const editor = useMemo(() => {
      const updateMenu = () => {
        let hasBold = false;
        let hasItalic = false;
        let hasUnderline = false;
        let hasStrike = false;
        for (const leaf of editor.exec(LeafsInRange)) {
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
        setBold(hasBold);
        setItalic(hasItalic);
        setUnderline(hasUnderline);
        setStrike(hasStrike);
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
          setRect(prev => {
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
          setRect(null);
        }
      }).exec(internalTranferPlugin).exec(plainTransferPlugin);
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
        padding: 4
      }}>
          <div>
            <button style={{
            fontWeight: bold ? "bold" : undefined
          }} onClick={toggleBold}>
              bold
            </button>
            <button style={{
            fontWeight: italic ? "bold" : undefined
          }} onClick={toggleItalic}>
              italic
            </button>
            <button style={{
            fontWeight: underline ? "bold" : undefined
          }} onClick={toggleUnderline}>
              underline
            </button>
            <button style={{
            fontWeight: strike ? "bold" : undefined
          }} onClick={toggleStrike}>
              strike
            </button>
          </div>
          <div>
            <button onClick={toggleAlign}>align</button>
          </div>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8
      }}>
          {doc.children.map((b, i) => <div key={i} style={{
          textAlign: b.align
        }}>
              {b.children.map((n, j) => <Text key={j} node={n} />)}
            </div>)}
        </div>
        {rect ? <div style={{
        position: "fixed",
        top: rect.top - 30,
        left: rect.left,
        whiteSpace: "nowrap"
      }}>
            <button style={{
          fontWeight: bold ? "bold" : undefined
        }} onClick={toggleBold}>
              bold
            </button>
            <button style={{
          fontWeight: italic ? "bold" : undefined
        }} onClick={toggleItalic}>
              italic
            </button>
            <button style={{
          fontWeight: underline ? "bold" : undefined
        }} onClick={toggleUnderline}>
              underline
            </button>
            <button style={{
          fontWeight: strike ? "bold" : undefined
        }} onClick={toggleStrike}>
              strike
            </button>
          </div> : null}
      </div>;
  }
}`,...q.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
      }).exec(internalTranferPlugin).exec(plainTransferPlugin, {
        voidToString: node => node.label
      }).exec(singlelinePlugin);
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
          {doc.children.map((t, j) => "text" in t ? t.text || <br /> : <span key={j} contentEditable={false} style={{
          background: "slategray",
          color: "white",
          fontSize: 12,
          padding: 4,
          borderRadius: 8
        }}>
                {t.label}
              </span>)}
        </div>
      </div>;
  }
}`,...Y.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof mentionSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hi, "
        }, {
          type: "mention",
          name: "Captain Gregor"
        }, {
          text: " and "
        }, {
          type: "mention",
          name: "Jaxxon"
        }, {
          text: " . Please enter @ to show suggestions."
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
      }, start);
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
      });
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
          {doc.children.map((r, i) => <div key={i}>
              {r.children.map((n, j) => "text" in n ? n.text || <br /> : <span key={j} contentEditable={false} style={{
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
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof mediaSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hello "
        }, {
          type: "image",
          src: "https://loremflickr.com/320/240/cats?lock=1"
        }, {
          text: " world "
        }, {
          type: "image",
          src: "https://loremflickr.com/320/240/cats?lock=2"
        }]
      }, {
        children: [{
          text: "Hello "
        }, {
          type: "video",
          src: "https://download.samplelib.com/mp4/sample-5s.mp4"
        }, {
          text: " world "
        }]
      }, {
        children: [{
          text: "Hello "
        }, {
          type: "youtube",
          id: "IqKz0SfHaqI"
        }, {
          text: " Youtube"
        }]
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: mediaSchema
      }).exec(internalTranferPlugin).exec(fileTransferPlugin, {
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
          },
          iframe: e => {
            return {
              type: "youtube",
              id: e.dataset.youtubeId!
            };
          }
        }
      }).exec(plainTransferPlugin);
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
          <button onClick={() => {
          const value = window.prompt("id:");
          if (!value) return;
          editor.exec(InsertNode, {
            type: "youtube",
            id: value
          });
        }}>
            insert youtube
          </button>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        padding: 8
      }}>
          {doc.children.map((b, i) => <div key={i}>
              {b.children.map((t, j) => "text" in t ? t.text || <br /> : t.type === "image" ? <img key={j} src={t.src} style={{
            maxWidth: 200
          }} /> : t.type === "video" ?
          // safari needs contentEditable="false"
          <video key={j} width={400} controls contentEditable="false" suppressContentEditableWarning>
                    <source src={t.src} />
                  </video> : t.type === "youtube" ? <iframe data-youtube-id={t.id} width="560" height="315" src={"https://www.youtube.com/embed/" + t.id} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" /> : null)}
            </div>)}
        </div>
      </div>;
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
      });
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
          {doc.children.map((b, i) => <div key={i}>
              {b.children.map((t, j) => "text" in t ? t.text || <br /> : <ruby key={j} contentEditable={false}>
                    {t.value}
                    <rp>(</rp>
                    <rt>{t.ruby}</rt>
                    <rp>)</rp>
                  </ruby>)}
            </div>)}
        </div>
      </div>;
  }
}`,...$.parameters?.docs?.source}}},me=[`Basic`,`RichText`,`Tag`,`Mention`,`Media`,`Ruby`]}))();export{U as Basic,Q as Media,Z as Mention,q as RichText,$ as Ruby,Y as Tag,me as __namedExportsOrder,V as default};