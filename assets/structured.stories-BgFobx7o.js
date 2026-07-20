import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-DG1UdfcB.js";import{t as r}from"./react-dom-BHmGgqwD.js";import{t as i}from"./jsx-runtime-O9QVJvLM.js";import{D as a,E as o,I as s,M as c,P as l,R as u,T as ee,a as d,d as f,f as p,g as m,h,j as g,l as te,s as _,t as v,v as y}from"./src-Sjgyaypa.js";function b(e){return!e&&!I?L:{lang:e?.lang??I?.lang,message:e?.message,abortEarly:e?.abortEarly??I?.abortEarly,abortPipeEarly:e?.abortPipeEarly??I?.abortPipeEarly}}function ne(e){return oe?.get(e)}function re(e){return se?.get(e)}function x(e,t){return ce?.get(e)?.get(t)}function S(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function C(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??S(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??x(e.reference,c.lang)??(l?re(c.lang):null)??r.message??ne(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function w(e){let t=R.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},b())}},R.set(e,t)),t}function T(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function ie(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function E(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function D(e,t){return{kind:`schema`,type:`array`,reference:D,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return w(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else C(this,`type`,e,t);return e}}}function O(e){return{kind:`schema`,type:`boolean`,reference:O,expects:`boolean`,async:!1,message:e,get"~standard"(){return w(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:C(this,`type`,e,t),e}}}function k(e,t){return{kind:`schema`,type:`literal`,reference:k,expects:S(e),async:!1,literal:e,message:t,get"~standard"(){return w(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:C(this,`type`,e,t),e}}}function A(e){return{kind:`schema`,type:`number`,reference:A,expects:`number`,async:!1,message:e,get"~standard"(){return w(this)},"~run"(e,t){return typeof e.value==`number`&&!isNaN(e.value)?e.typed=!0:C(this,`type`,e,t),e}}}function j(e,t){return{kind:`schema`,type:`optional`,reference:j,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return w(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=E(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function ae(e,t){return{kind:`schema`,type:`picklist`,reference:ae,expects:T(e.map(S),`|`),async:!1,options:e,message:t,get"~standard"(){return w(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:C(this,`type`,e,t),e}}}function M(e,t){return{kind:`schema`,type:`strict_object`,reference:M,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return w(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:E(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=ie(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(C(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){C(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else C(this,`type`,e,t);return e}}}function N(e){return{kind:`schema`,type:`string`,reference:N,expects:`string`,async:!1,message:e,get"~standard"(){return w(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:C(this,`type`,e,t),e}}}function P(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function F(e,t){return{kind:`schema`,type:`union`,reference:F,expects:T(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return w(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];C(this,`type`,e,t,{issues:P(r)}),e.typed=!0}else if(i?.length===1)return i[0];else C(this,`type`,e,t,{issues:P(i)});return e}}}var I,L,oe,se,ce,R,le=t((()=>{L={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},R=new WeakMap}));function ue(e,t=e.selection[0]){let[n,,r]=s(e.doc,t);e.apply({type:`patch_node`,path:r,key:`indent`,value:(n.indent??0)+1})}function de(e,t=e.selection[0]){let[n,,r]=s(e.doc,t);e.apply({type:`patch_node`,path:r,key:`indent`,value:Math.max((n.indent??0)-1,0)})}var z,B,V,H,U,W,G,K,fe,q,pe,J,me,Y,he,ge,X,_e,ve,Z,ye,Q,be,$,xe;t((()=>{z=e(n()),v(),le(),B=e(r()),V=i(),H={component:y},U=M({children:D(M({children:D(M({text:N()}))}))}),W={render:()=>{let e=(0,z.useRef)(null),[t,n]=(0,z.useState)({children:[{children:[{text:``}]}]}),r=(0,z.useMemo)(()=>{let e=y({doc:t,schema:U}).exec(f).exec(h);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,z.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,V.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,V.jsx)(`div`,{children:e.children.map((e,t)=>(0,V.jsx)(`span`,{children:e.text||(0,V.jsx)(`br`,{})},t))},t))})}},G=M({text:N(),fontSize:j(A()),bold:j(O()),italic:j(O()),underline:j(O()),strike:j(O())}),K=M({align:j(ae([`left`,`right`])),indent:j(A()),children:D(G)}),fe=M({children:D(K)}),q=10,pe=({node:e})=>{let t=e.bold?`strong`:`span`,n={fontSize:`${e.fontSize??q}pt`};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,V.jsx)(t,{style:n,children:e.text||(0,V.jsx)(`br`,{})})},J={render:()=>{let e=(0,z.useRef)(null),[t,n]=(0,z.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),[r,i]=(0,z.useState)(null),[a,s]=(0,z.useState)(),[u,ee]=(0,z.useState)(!1),[d,p]=(0,z.useState)(!1),[m,v]=(0,z.useState)(!1),[b,ne]=(0,z.useState)(!1),re=e=>{T.exec(o,`fontSize`,e)},x=()=>{T.exec(c,`bold`)},S=()=>{T.exec(c,`italic`)},C=()=>{T.exec(c,`underline`)},w=()=>{T.exec(c,`strike`)},T=(0,z.useMemo)(()=>{let e=()=>{let e=new Set,t=!1,n=!1,r=!1,i=!1;for(let a of T.exec(l))a.fontSize?e.add(a.fontSize):e.add(q),a.bold&&(t=!0),a.italic&&(n=!0),a.underline&&(r=!0),a.strike&&(i=!0);s(e.size===1?e.values().next().value:void 0),ee(t),p(n),v(r),ne(i)},r=y({doc:t,schema:fe}).exec(te,{"Mod+B":x,"Mod+I":S,"Mod+U":C,"Mod+S":w}).exec(_,e=>{T.selection[0]===T.selection[1]?i(null):i(t=>{let n=e();return t&&t.top===n.top&&t.left===n.left?t:{top:n.top,left:n.left}})}).exec(f).exec(h);return r.on(`change`,()=>{n(r.doc),e()}),r.on(`selectionchange`,()=>{e()}),r},[]);return(0,z.useEffect)(()=>{if(e.current)return T.input(e.current)},[]),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4,padding:4,paddingBottom:8},children:[(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`select`,{value:a??`--`,onChange:e=>{e.preventDefault();let t=Number(e.target.value);Number.isNaN(t)||re(t)},children:[(0,V.jsx)(`option`,{value:`--`,children:`--`}),(0,V.jsx)(`option`,{value:`8`,children:`8`}),(0,V.jsx)(`option`,{value:`10`,children:`10`}),(0,V.jsx)(`option`,{value:`12`,children:`12`}),(0,V.jsx)(`option`,{value:`14`,children:`14`}),(0,V.jsx)(`option`,{value:`16`,children:`16`}),(0,V.jsx)(`option`,{value:`18`,children:`18`}),(0,V.jsx)(`option`,{value:`20`,children:`20`})]}),(0,V.jsx)(`button`,{style:{fontWeight:u?`bold`:void 0},onClick:x,children:`bold`}),(0,V.jsx)(`button`,{style:{fontWeight:d?`bold`:void 0},onClick:S,children:`italic`}),(0,V.jsx)(`button`,{style:{fontWeight:m?`bold`:void 0},onClick:C,children:`underline`}),(0,V.jsx)(`button`,{style:{fontWeight:b?`bold`:void 0},onClick:w,children:`strike`})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`button`,{onClick:()=>{T.exec(g,`align`,`right`,void 0)},children:`align`}),(0,V.jsx)(`button`,{onClick:()=>{T.exec(ue)},children:`indent`}),(0,V.jsx)(`button`,{onClick:()=>{T.exec(de)},children:`outdent`})]})]}),(0,V.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,V.jsx)(`div`,{style:{textAlign:e.align,textIndent:e.indent?`${e.indent}em`:void 0},children:e.children.map((e,t)=>(0,V.jsx)(pe,{node:e},t))},t))}),r?(0,V.jsxs)(`div`,{style:{position:`fixed`,top:r.top-30,left:r.left,whiteSpace:`nowrap`},children:[(0,V.jsx)(`button`,{style:{fontWeight:u?`bold`:void 0},onClick:x,children:`bold`}),(0,V.jsx)(`button`,{style:{fontWeight:d?`bold`:void 0},onClick:S,children:`italic`}),(0,V.jsx)(`button`,{style:{fontWeight:m?`bold`:void 0},onClick:C,children:`underline`}),(0,V.jsx)(`button`,{style:{fontWeight:b?`bold`:void 0},onClick:w,children:`strike`})]}):null]})}},me=M({children:D(F([M({text:N()}),M({type:k(`tag`),label:N(),value:N()})]))}),Y={render:()=>{let e=(0,z.useRef)(null),[t,n]=(0,z.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,z.useMemo)(()=>{let e=y({doc:t,schema:me}).exec(f).exec(h,{voidToString:e=>e.label}).exec(d);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,z.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,z.useRef)(null),o=(0,z.useRef)(null);return(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`label`,{children:[`label:`,(0,V.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,V.jsxs)(`label`,{children:[`value:`,(0,V.jsx)(`input`,{ref:o,defaultValue:`123`})]}),(0,V.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=o.current?.value;!e||!t||r.exec(a,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,V.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>`text`in e?e.text||(0,V.jsx)(`br`,{}):(0,V.jsx)(`span`,{contentEditable:!1,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},he=`Aayla Secura,Adi Gallia,Admiral Dodd Rancit,Admiral Firmus Piett,Admiral Gial Ackbar,Admiral Ozzel,Admiral Raddus,Admiral Terrinald Screed,Admiral Trench,Admiral U.O. Statura,Agen Kolar,Agent Kallus,Aiolin and Morit Astarte,Aks Moe,Almec,Alton Kastle,Amee,AP-5,Armitage Hux,Artoo,Arvel Crynyd,Asajj Ventress,Aurra Sing,AZI-3,Bala-Tik,Barada,Bargwill Tomder,Baron Papanoida,Barriss Offee,Baze Malbus,Bazine Netal,BB-8,BB-9E,Ben Quadinaros,Berch Teller,Beru Lars,Bib Fortuna,Biggs Darklighter,Black Krrsantan,Bo-Katan Kryze,Boba Fett,Bobbajo,Bodhi Rook,Borvo the Hutt,Boss Nass,Bossk,Breha Antilles-Organa,Bren Derlin,Brendol Hux,BT-1,C-3PO,C1-10P,Cad Bane,Caluan Ematt,Captain Gregor,Captain Phasma,Captain Quarsh Panaka,Captain Rex,Carlist Rieekan,Casca Panzoro,Cassian Andor,Cassio Tagge,Cham Syndulla,Che Amanwe Papanoida,Chewbacca,Chi Eekway Papanoida,Chief Chirpa,Chirrut Îmwe,Ciena Ree,Cin Drallig,Clegg Holdfast,Cliegg Lars,Coleman Kcaj,Coleman Trebor,Colonel Kaplan,Commander Bly,Commander Cody (CC-2224),Commander Fil (CC-3714),Commander Fox,Commander Gree,Commander Jet,Commander Wolffe,Conan Antonio Motti,Conder Kyl,Constable Zuvio,Cordé,Cpatain Typho,Crix Madine,Cut Lawquane,Dak Ralter,Dapp,Darth Bane,Darth Maul,Darth Tyranus,Daultay Dofine,Del Meeko,Delian Mors,Dengar,Depa Billaba,Derek Klivian,Dexter Jettster,Dineé Ellberger,DJ,Doctor Aphra,Doctor Evazan,Dogma,Dormé,Dr. Cylo,Droidbait,Droopy McCool,Dryden Vos,Dud Bolt,Ebe E. Endocott,Echuu Shen-Jon,Eeth Koth,Eighth Brother,Eirtaé,Eli Vanto,Ellé,Ello Asty,Embo,Eneb Ray,Enfys Nest,EV-9D9,Evaan Verlaine,Even Piell,Ezra Bridger,Faro Argyus,Feral,Fifth Brother,Finis Valorum,Finn,Fives,FN-1824,FN-2003,Fodesinbeed Annodue,Fulcrum,FX-7,GA-97,Galen Erso,Gallius Rax,Garazeb "Zeb" Orrelios,Gardulla the Hutt,Garrick Versio,Garven Dreis,Gavyn Sykes,Gideon Hask,Gizor Dellso,Gonk droid,Grand Inquisitor,Greeata Jendowanian,Greedo,Greer Sonnel,Grievous,Grummgar,Gungi,Hammerhead,Han Solo,Harter Kalonia,Has Obbit,Hera Syndulla,Hevy,Hondo Ohnaka,Huyang,Iden Versio,IG-88,Ima-Gun Di,Inquisitors,Inspector Thanoth,Jabba,Jacen Syndulla,Jan Dodonna,Jango Fett,Janus Greejatus,Jar Jar Binks,Jas Emari,Jaxxon,Jek Tono Porkins,Jeremoch Colton,Jira,Jobal Naberrie,Jocasta Nu,Joclad Danva,Joh Yowza,Jom Barell,Joph Seastriker,Jova Tarkin,Jubnuk,Jyn Erso,K-2SO,Kanan Jarrus,Karbin,Karina the Great,Kes Dameron,Ketsu Onyo,Ki-Adi-Mundi,King Katuunko,Kit Fisto,Kitster Banai,Klaatu,Klik-Klak,Korr Sella,Kylo Ren,L3-37,Lama Su,Lando Calrissian,Lanever Villecham,Leia Organa,Letta Turmond,Lieutenant Kaydel Ko Connix,Lieutenant Thire,Lobot,Logray,Lok Durd,Longo Two-Guns,Lor San Tekka,Lorth Needa,Lott Dod,Luke Skywalker,Lumat,Luminara Unduli,Lux Bonteri,Lyn Me,Lyra Erso,Mace Windu,Malakili,Mama the Hutt,Mars Guo,Mas Amedda,Mawhonic,Max Rebo,Maximilian Veers,Maz Kanata,ME-8D9,Meena Tills,Mercurial Swift,Mina Bonteri,Miraj Scintel,Mister Bones,Mod Terrik,Moden Canady,Mon Mothma,Moradmin Bast,Moralo Eval,Morley,Mother Talzin,Nahdar Vebb,Nahdonnis Praji,Nien Nunb,Niima the Hutt,Nines,Norra Wexley,Nute Gunray,Nuvo Vindi,Obi-Wan Kenobi,Odd Ball,Ody Mandrell,Omi,Onaconda Farr,Oola,OOM-9,Oppo Rancisis,Orn Free Taa,Oro Dassyne,Orrimarko,Osi Sobeck,Owen Lars,Pablo-Jill,Padmé Amidala,Pagetti Rook,Paige Tico,Paploo,Petty Officer Thanisson,Pharl McQuarrie,Plo Koon,Po Nudo,Poe Dameron,Poggle the Lesser,Pong Krell,Pooja Naberrie,PZ-4CO,Quarrie,Quay Tolsite,Queen Apailana,Queen Jamillia,Queen Neeyutnee,Qui-Gon Jinn,Quiggold,Quinlan Vos,R2-D2,R2-KT,R3-S6,R4-P17,R5-D4,RA-7,Rabé,Rako Hardeen,Ransolm Casterfo,Rappertunie,Ratts Tyerell,Raymus Antilles,Ree-Yees,Reeve Panzoro,Rey,Ric Olié,Riff Tamson,Riley,Rinnriyin Di,Rio Durant,Rogue Squadron,Romba,Roos Tarpals,Rose Tico,Rotta the Hutt,Rukh,Rune Haako,Rush Clovis,Ruwee Naberrie,Ryoo Naberrie,Sabé,Sabine Wren,Saché,Saelt-Marae,Saesee Tiin,Salacious B. Crumb,San Hill,Sana Starros,Sarco Plank,Sarkli,Satine Kryze,Savage Opress,Sebulba,Senator Organa,Sergeant Kreel,Seventh Sister,Shaak Ti,Shara Bey,Shmi Skywalker,Shu Mai,Sidon Ithano,Sifo-Dyas,Sim Aloo,Siniir Rath Velus,Sio Bibble,Sixth Brother,Slowen Lo,Sly Moore,Snaggletooth,Snap Wexley,Snoke,Sola Naberrie,Sora Bulq,Strono Tuggs,Sy Snootles,Tallissan Lintra,Tarfful,Tasu Leech,Taun We,TC-14,Tee Watt Kaa,Teebo,Teedo,Teemto Pagalies,Temiri Blagg,Tessek,Tey How,Thane Kyrell,The Bendu,The Smuggler,Thrawn,Tiaan Jerjerrod,Tion Medon,Tobias Beckett,Tulon Voidgazer,Tup,U9-C4,Unkar Plutt,Val Beckett,Vanden Willard,Vice Admiral Amilyn Holdo,Vober Dand,WAC-47,Wag Too,Wald,Walrus Man,Warok,Wat Tambor,Watto,Wedge Antilles,Wes Janson,Wicket W. Warrick,Wilhuff Tarkin,Wollivan,Wuher,Wullf Yularen,Xamuel Lennox,Yaddle,Yarael Poof,Yoda,Zam Wesell,Zev Senesca,Ziro the Hutt,Zuckuss`.split(`,`),ge=8,X=/\B@([\-+\w]*)$/,_e=({chars:e,index:t,top:n,left:r,complete:i})=>(0,V.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,fontSize:`12px`,border:`solid 1px gray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,V.jsx)(`div`,{style:{padding:`4px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),ve=M({children:D(M({children:D(F([M({text:N()}),M({type:k(`mention`),name:N()})]))}))}),Z={render:()=>{let e=(0,z.useRef)(null),[t,n]=(0,z.useState)({children:[{children:[{text:`Hi, `},{type:`mention`,name:`Captain Gregor`},{text:` and `},{type:`mention`,name:`Jaxxon`},{text:` . Please enter @ to show suggestions.`}]},{children:[{text:``}]}]}),[r,i]=(0,z.useState)(null),[o,s]=(0,z.useState)(0),c=(r&&u(t,0,r.caret).match(X))?.[1]??``,l=(0,z.useMemo)(()=>he.filter(e=>e.toLowerCase().startsWith(c.toLowerCase())).slice(0,ge),[c]),d=t=>{if(!e.current||!r)return;let n=l[t],o=r.caret-c.length-1,u=r.caret;g.exec(ee,[o,u]).exec(a,{type:`mention`,name:n},o),i(null),s(0)},f=(0,z.useEffectEvent)(()=>{if(!r||!l.length)return!1;s(e=>e<=0?l.length-1:e-1)}),p=(0,z.useEffectEvent)(()=>{if(!r||!l.length)return!1;s(e=>e>=l.length-1?0:e+1)}),m=(0,z.useEffectEvent)(()=>{if(!r||!l.length)return!1;d(o)}),h=(0,z.useEffectEvent)(()=>{if(!r||!l.length)return!1;i(null),s(0)}),g=(0,z.useMemo)(()=>{let e=y({doc:t,schema:ve}).exec(te,{ArrowUp:f,ArrowDown:p,Enter:m,Escape:h}).exec(_,e=>{let t=Math.min(...g.selection);if(X.test(u(g.doc,0,t))){let n=e();i({top:n.top+n.height,left:n.left,caret:t})}else i(null);s(0)});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,z.useEffect)(()=>{if(e.current)return g.input(e.current)},[]),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,V.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,V.jsx)(`br`,{}):(0,V.jsxs)(`span`,{contentEditable:!1,style:{background:`#EAF5F9`,color:`#4276AA`,borderRadius:`3px`},children:[`@`,e.name]},t))},t))}),r&&(0,B.createPortal)((0,V.jsx)(_e,{top:r.top,left:r.left,chars:l,index:o,complete:d}),document.body)]})}},ye=M({children:D(M({children:D(F([M({text:N()}),M({type:k(`image`),src:N()}),M({type:k(`video`),src:N()}),M({type:k(`youtube`),id:N()})]))}))}),Q={render:()=>{let e=(0,z.useRef)(null),[t,n]=(0,z.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]},{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]},{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,z.useMemo)(()=>{let e=y({doc:t,schema:ye}).exec(f).exec(m,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(p,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src}),video:e=>({type:`video`,src:e.childNodes[0].src}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(h);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,z.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`div`,{style:{display:`flex`,padding:4,gap:4},children:[(0,V.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(a,{type:`image`,src:e})},children:`insert image`}),(0,V.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(a,{type:`video`,src:e})},children:`insert video`}),(0,V.jsx)(`button`,{onClick:()=>{let e=window.prompt(`id:`);e&&r.exec(a,{type:`youtube`,id:e})},children:`insert youtube`})]}),(0,V.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,V.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,V.jsx)(`br`,{}):e.type===`image`?(0,V.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t):e.type===`video`?(0,V.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,V.jsx)(`source`,{src:e.src})},t):e.type===`youtube`?(0,V.jsx)(`iframe`,{"data-youtube-id":e.id,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e.id,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}):null)},t))})]})}},be=M({children:D(M({children:D(F([M({text:N()}),M({type:k(`ruby`),ruby:N(),value:N()})]))}))}),$={render:()=>{let e=(0,z.useRef)(null),[t,n]=(0,z.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,z.useMemo)(()=>{let e=y({doc:t,schema:be}).exec(h,{voidToString:e=>e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,z.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,V.jsx)(`div`,{children:(0,V.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,V.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,V.jsx)(`br`,{}):(0,V.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,V.jsx)(`rp`,{children:`(`}),(0,V.jsx)(`rt`,{children:e.ruby}),(0,V.jsx)(`rp`,{children:`)`})]},t))},t))})})}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
        for (const leaf of editor.exec(LeafsInRange)) {
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
          {doc.children.map((b, i) => <div key={i} style={{
          textAlign: b.align,
          textIndent: b.indent ? \`\${b.indent}em\` : undefined
        }}>
              {b.children.map((n, j) => <Text key={j} node={n} />)}
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
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}},xe=[`Empty`,`RichText`,`Tag`,`Mention`,`Media`,`Ruby`]}))();export{W as Empty,Q as Media,Z as Mention,J as RichText,$ as Ruby,Y as Tag,xe as __namedExportsOrder,H as default};