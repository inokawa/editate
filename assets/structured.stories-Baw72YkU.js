import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-ByCfNOBF.js";import{t as r}from"./react-dom-CtpbAp5V.js";import{t as i}from"./jsx-runtime-O9QVJvLM.js";import{B as a,D as o,E as s,F as c,L as l,M as u,N as d,R as f,T as p,a as m,d as h,f as g,g as _,h as v,j as y,l as b,s as ee,t as te,v as x}from"./src-Df-8v4jC.js";function S(e){return!e&&!B?ie:{lang:e?.lang??B?.lang,message:e?.message,abortEarly:e?.abortEarly??B?.abortEarly,abortPipeEarly:e?.abortPipeEarly??B?.abortPipeEarly}}function C(e){return ae?.get(e)}function w(e){return oe?.get(e)}function T(e,t){return se?.get(e)?.get(t)}function E(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function D(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??E(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??T(e.reference,c.lang)??(l?w(c.lang):null)??r.message??C(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function O(e){let t=V.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},S())}},V.set(e,t)),t}function k(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function ne(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function A(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function j(e,t){return{kind:`schema`,type:`array`,reference:j,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return O(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else D(this,`type`,e,t);return e}}}function M(e){return{kind:`schema`,type:`boolean`,reference:M,expects:`boolean`,async:!1,message:e,get"~standard"(){return O(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:D(this,`type`,e,t),e}}}function N(e,t){return{kind:`schema`,type:`literal`,reference:N,expects:E(e),async:!1,literal:e,message:t,get"~standard"(){return O(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:D(this,`type`,e,t),e}}}function P(e){return{kind:`schema`,type:`number`,reference:P,expects:`number`,async:!1,message:e,get"~standard"(){return O(this)},"~run"(e,t){return typeof e.value==`number`&&!isNaN(e.value)?e.typed=!0:D(this,`type`,e,t),e}}}function F(e,t){return{kind:`schema`,type:`optional`,reference:F,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return O(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=A(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function re(e,t){return{kind:`schema`,type:`picklist`,reference:re,expects:k(e.map(E),`|`),async:!1,options:e,message:t,get"~standard"(){return O(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:D(this,`type`,e,t),e}}}function I(e,t){return{kind:`schema`,type:`strict_object`,reference:I,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return O(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:A(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=ne(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(D(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){D(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else D(this,`type`,e,t);return e}}}function L(e){return{kind:`schema`,type:`string`,reference:L,expects:`string`,async:!1,message:e,get"~standard"(){return O(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:D(this,`type`,e,t),e}}}function R(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function z(e,t){return{kind:`schema`,type:`union`,reference:z,expects:k(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return O(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];D(this,`type`,e,t,{issues:R(r)}),e.typed=!0}else if(i?.length===1)return i[0];else D(this,`type`,e,t,{issues:R(i)});return e}}}var B,ie,ae,oe,se,V,ce=t((()=>{ie={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},V=new WeakMap}));function le(e,t=e.selection[0]){let[n,,r]=l(e.doc,t);e.apply({type:`patch_node`,path:r,key:`indent`,value:(n.indent??0)+1})}function ue(e,t=e.selection[0]){let[n,,r]=l(e.doc,t);e.apply({type:`patch_node`,path:r,key:`indent`,value:Math.max((n.indent??0)-1,0)})}var H,U,W,G,de,K,fe,pe,q,me,J,he,Y,ge,_e,X,ve,ye,Z,be,Q,xe,$,Se;t((()=>{H=e(n()),te(),ce(),U=e(r()),W=i(),G={component:x},de=I({children:j(I({children:j(I({text:L()}))}))}),K={render:()=>{let e=(0,H.useRef)(null),[t,n]=(0,H.useState)({children:[{children:[{text:``}]}]}),r=(0,H.useMemo)(()=>{let e=x({doc:t,schema:de}).exec(h).exec(v);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,H.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,W.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,W.jsx)(`div`,{children:e.children.map((e,t)=>(0,W.jsx)(`span`,{children:e.text||(0,W.jsx)(`br`,{})},t))},t))})}},fe=I({text:L(),fontSize:F(P()),bold:F(M()),italic:F(M()),underline:F(M()),strike:F(M())}),pe=I({children:j(I({align:F(re([`left`,`right`])),indent:F(P()),children:j(fe)}))}),q=10,me=({node:e})=>{let t=e.bold?`strong`:`span`,n={fontSize:`${e.fontSize??q}pt`};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,W.jsx)(t,{style:n,children:e.text||(0,W.jsx)(`br`,{})})},J={render:()=>{let e=(0,H.useRef)(null),[t,n]=(0,H.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),[r,i]=(0,H.useState)(null),[a,o]=(0,H.useState)(),[l,f]=(0,H.useState)(!1),[p,m]=(0,H.useState)(!1),[g,_]=(0,H.useState)(!1),[y,te]=(0,H.useState)(!1),S=e=>{D.exec(s,`fontSize`,e)},C=()=>{D.exec(d,`bold`)},w=()=>{D.exec(d,`italic`)},T=()=>{D.exec(d,`underline`)},E=()=>{D.exec(d,`strike`)},D=(0,H.useMemo)(()=>{let e=()=>{let e=new Set,t=!1,n=!1,r=!1,i=!1;for(let a of D.exec(c))a.fontSize?e.add(a.fontSize):e.add(q),a.bold&&(t=!0),a.italic&&(n=!0),a.underline&&(r=!0),a.strike&&(i=!0);o(e.size===1?e.values().next().value:void 0),f(t),m(n),_(r),te(i)},r=x({doc:t,schema:pe}).exec(b,{"Mod+B":C,"Mod+I":w,"Mod+U":T,"Mod+S":E}).exec(ee,e=>{D.selection[0]===D.selection[1]?i(null):i(t=>{let n=e();return t&&t.top===n.top&&t.left===n.left?t:{top:n.top,left:n.left}})}).exec(h).exec(v);return r.on(`change`,()=>{n(r.doc),e()}),r.on(`selectionchange`,()=>{e()}),r},[]);return(0,H.useEffect)(()=>{if(e.current)return D.input(e.current)},[]),(0,W.jsxs)(`div`,{children:[(0,W.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4,padding:4,paddingBottom:8},children:[(0,W.jsxs)(`div`,{children:[(0,W.jsxs)(`select`,{value:a??`--`,onChange:e=>{e.preventDefault();let t=Number(e.target.value);Number.isNaN(t)||S(t)},children:[(0,W.jsx)(`option`,{value:`--`,children:`--`}),(0,W.jsx)(`option`,{value:`8`,children:`8`}),(0,W.jsx)(`option`,{value:`10`,children:`10`}),(0,W.jsx)(`option`,{value:`12`,children:`12`}),(0,W.jsx)(`option`,{value:`14`,children:`14`}),(0,W.jsx)(`option`,{value:`16`,children:`16`}),(0,W.jsx)(`option`,{value:`18`,children:`18`}),(0,W.jsx)(`option`,{value:`20`,children:`20`})]}),(0,W.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:C,children:`bold`}),(0,W.jsx)(`button`,{style:{fontWeight:p?`bold`:void 0},onClick:w,children:`italic`}),(0,W.jsx)(`button`,{style:{fontWeight:g?`bold`:void 0},onClick:T,children:`underline`}),(0,W.jsx)(`button`,{style:{fontWeight:y?`bold`:void 0},onClick:E,children:`strike`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`button`,{onClick:()=>{D.exec(u,`align`,`right`,void 0)},children:`align`}),(0,W.jsx)(`button`,{onClick:()=>{D.exec(le)},children:`indent`}),(0,W.jsx)(`button`,{onClick:()=>{D.exec(ue)},children:`outdent`})]})]}),(0,W.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,W.jsx)(`div`,{style:{textAlign:e.align,textIndent:e.indent?`${e.indent}em`:void 0},children:e.children.map((e,t)=>(0,W.jsx)(me,{node:e},t))},t))}),r?(0,W.jsxs)(`div`,{style:{position:`fixed`,top:r.top-30,left:r.left,whiteSpace:`nowrap`},children:[(0,W.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:C,children:`bold`}),(0,W.jsx)(`button`,{style:{fontWeight:p?`bold`:void 0},onClick:w,children:`italic`}),(0,W.jsx)(`button`,{style:{fontWeight:g?`bold`:void 0},onClick:T,children:`underline`}),(0,W.jsx)(`button`,{style:{fontWeight:y?`bold`:void 0},onClick:E,children:`strike`})]}):null]})}},he=I({children:j(z([I({text:L()}),I({type:N(`tag`),label:L(),value:L()})]))}),Y={render:()=>{let e=(0,H.useRef)(null),[t,n]=(0,H.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,H.useMemo)(()=>{let e=x({doc:t,schema:he}).exec(h).exec(v,{voidToString:e=>e.label}).exec(m);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,H.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,H.useRef)(null),a=(0,H.useRef)(null);return(0,W.jsxs)(`div`,{children:[(0,W.jsxs)(`div`,{children:[(0,W.jsxs)(`label`,{children:[`label:`,(0,W.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,W.jsxs)(`label`,{children:[`value:`,(0,W.jsx)(`input`,{ref:a,defaultValue:`123`})]}),(0,W.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=a.current?.value;!e||!t||r.exec(o,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,W.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,n)=>`text`in e?e.text||(0,W.jsx)(`br`,{}):(0,W.jsx)(`span`,{contentEditable:!1,onClick:n=>{n.preventDefault();let i=t.children.indexOf(e);if(i===-1)return;let a=window.prompt(`label:`,e.label);if(!a)return;let o=t.children.slice(0,i+1).reduce((e,t)=>e+f(t),0);r.exec(y,`label`,a,o)},style:{background:`slategray`,color:`white`,cursor:`pointer`,fontSize:12,padding:4,borderRadius:8},children:e.label},n))})]})}},ge=`Aayla Secura,Adi Gallia,Admiral Dodd Rancit,Admiral Firmus Piett,Admiral Gial Ackbar,Admiral Ozzel,Admiral Raddus,Admiral Terrinald Screed,Admiral Trench,Admiral U.O. Statura,Agen Kolar,Agent Kallus,Aiolin and Morit Astarte,Aks Moe,Almec,Alton Kastle,Amee,AP-5,Armitage Hux,Artoo,Arvel Crynyd,Asajj Ventress,Aurra Sing,AZI-3,Bala-Tik,Barada,Bargwill Tomder,Baron Papanoida,Barriss Offee,Baze Malbus,Bazine Netal,BB-8,BB-9E,Ben Quadinaros,Berch Teller,Beru Lars,Bib Fortuna,Biggs Darklighter,Black Krrsantan,Bo-Katan Kryze,Boba Fett,Bobbajo,Bodhi Rook,Borvo the Hutt,Boss Nass,Bossk,Breha Antilles-Organa,Bren Derlin,Brendol Hux,BT-1,C-3PO,C1-10P,Cad Bane,Caluan Ematt,Captain Gregor,Captain Phasma,Captain Quarsh Panaka,Captain Rex,Carlist Rieekan,Casca Panzoro,Cassian Andor,Cassio Tagge,Cham Syndulla,Che Amanwe Papanoida,Chewbacca,Chi Eekway Papanoida,Chief Chirpa,Chirrut Îmwe,Ciena Ree,Cin Drallig,Clegg Holdfast,Cliegg Lars,Coleman Kcaj,Coleman Trebor,Colonel Kaplan,Commander Bly,Commander Cody (CC-2224),Commander Fil (CC-3714),Commander Fox,Commander Gree,Commander Jet,Commander Wolffe,Conan Antonio Motti,Conder Kyl,Constable Zuvio,Cordé,Cpatain Typho,Crix Madine,Cut Lawquane,Dak Ralter,Dapp,Darth Bane,Darth Maul,Darth Tyranus,Daultay Dofine,Del Meeko,Delian Mors,Dengar,Depa Billaba,Derek Klivian,Dexter Jettster,Dineé Ellberger,DJ,Doctor Aphra,Doctor Evazan,Dogma,Dormé,Dr. Cylo,Droidbait,Droopy McCool,Dryden Vos,Dud Bolt,Ebe E. Endocott,Echuu Shen-Jon,Eeth Koth,Eighth Brother,Eirtaé,Eli Vanto,Ellé,Ello Asty,Embo,Eneb Ray,Enfys Nest,EV-9D9,Evaan Verlaine,Even Piell,Ezra Bridger,Faro Argyus,Feral,Fifth Brother,Finis Valorum,Finn,Fives,FN-1824,FN-2003,Fodesinbeed Annodue,Fulcrum,FX-7,GA-97,Galen Erso,Gallius Rax,Garazeb "Zeb" Orrelios,Gardulla the Hutt,Garrick Versio,Garven Dreis,Gavyn Sykes,Gideon Hask,Gizor Dellso,Gonk droid,Grand Inquisitor,Greeata Jendowanian,Greedo,Greer Sonnel,Grievous,Grummgar,Gungi,Hammerhead,Han Solo,Harter Kalonia,Has Obbit,Hera Syndulla,Hevy,Hondo Ohnaka,Huyang,Iden Versio,IG-88,Ima-Gun Di,Inquisitors,Inspector Thanoth,Jabba,Jacen Syndulla,Jan Dodonna,Jango Fett,Janus Greejatus,Jar Jar Binks,Jas Emari,Jaxxon,Jek Tono Porkins,Jeremoch Colton,Jira,Jobal Naberrie,Jocasta Nu,Joclad Danva,Joh Yowza,Jom Barell,Joph Seastriker,Jova Tarkin,Jubnuk,Jyn Erso,K-2SO,Kanan Jarrus,Karbin,Karina the Great,Kes Dameron,Ketsu Onyo,Ki-Adi-Mundi,King Katuunko,Kit Fisto,Kitster Banai,Klaatu,Klik-Klak,Korr Sella,Kylo Ren,L3-37,Lama Su,Lando Calrissian,Lanever Villecham,Leia Organa,Letta Turmond,Lieutenant Kaydel Ko Connix,Lieutenant Thire,Lobot,Logray,Lok Durd,Longo Two-Guns,Lor San Tekka,Lorth Needa,Lott Dod,Luke Skywalker,Lumat,Luminara Unduli,Lux Bonteri,Lyn Me,Lyra Erso,Mace Windu,Malakili,Mama the Hutt,Mars Guo,Mas Amedda,Mawhonic,Max Rebo,Maximilian Veers,Maz Kanata,ME-8D9,Meena Tills,Mercurial Swift,Mina Bonteri,Miraj Scintel,Mister Bones,Mod Terrik,Moden Canady,Mon Mothma,Moradmin Bast,Moralo Eval,Morley,Mother Talzin,Nahdar Vebb,Nahdonnis Praji,Nien Nunb,Niima the Hutt,Nines,Norra Wexley,Nute Gunray,Nuvo Vindi,Obi-Wan Kenobi,Odd Ball,Ody Mandrell,Omi,Onaconda Farr,Oola,OOM-9,Oppo Rancisis,Orn Free Taa,Oro Dassyne,Orrimarko,Osi Sobeck,Owen Lars,Pablo-Jill,Padmé Amidala,Pagetti Rook,Paige Tico,Paploo,Petty Officer Thanisson,Pharl McQuarrie,Plo Koon,Po Nudo,Poe Dameron,Poggle the Lesser,Pong Krell,Pooja Naberrie,PZ-4CO,Quarrie,Quay Tolsite,Queen Apailana,Queen Jamillia,Queen Neeyutnee,Qui-Gon Jinn,Quiggold,Quinlan Vos,R2-D2,R2-KT,R3-S6,R4-P17,R5-D4,RA-7,Rabé,Rako Hardeen,Ransolm Casterfo,Rappertunie,Ratts Tyerell,Raymus Antilles,Ree-Yees,Reeve Panzoro,Rey,Ric Olié,Riff Tamson,Riley,Rinnriyin Di,Rio Durant,Rogue Squadron,Romba,Roos Tarpals,Rose Tico,Rotta the Hutt,Rukh,Rune Haako,Rush Clovis,Ruwee Naberrie,Ryoo Naberrie,Sabé,Sabine Wren,Saché,Saelt-Marae,Saesee Tiin,Salacious B. Crumb,San Hill,Sana Starros,Sarco Plank,Sarkli,Satine Kryze,Savage Opress,Sebulba,Senator Organa,Sergeant Kreel,Seventh Sister,Shaak Ti,Shara Bey,Shmi Skywalker,Shu Mai,Sidon Ithano,Sifo-Dyas,Sim Aloo,Siniir Rath Velus,Sio Bibble,Sixth Brother,Slowen Lo,Sly Moore,Snaggletooth,Snap Wexley,Snoke,Sola Naberrie,Sora Bulq,Strono Tuggs,Sy Snootles,Tallissan Lintra,Tarfful,Tasu Leech,Taun We,TC-14,Tee Watt Kaa,Teebo,Teedo,Teemto Pagalies,Temiri Blagg,Tessek,Tey How,Thane Kyrell,The Bendu,The Smuggler,Thrawn,Tiaan Jerjerrod,Tion Medon,Tobias Beckett,Tulon Voidgazer,Tup,U9-C4,Unkar Plutt,Val Beckett,Vanden Willard,Vice Admiral Amilyn Holdo,Vober Dand,WAC-47,Wag Too,Wald,Walrus Man,Warok,Wat Tambor,Watto,Wedge Antilles,Wes Janson,Wicket W. Warrick,Wilhuff Tarkin,Wollivan,Wuher,Wullf Yularen,Xamuel Lennox,Yaddle,Yarael Poof,Yoda,Zam Wesell,Zev Senesca,Ziro the Hutt,Zuckuss`.split(`,`),_e=8,X=/\B@([\-+\w]*)$/,ve=({chars:e,index:t,top:n,left:r,complete:i})=>(0,W.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,fontSize:`12px`,border:`solid 1px gray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,W.jsx)(`div`,{style:{padding:`4px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),ye=I({children:j(I({children:j(z([I({text:L()}),I({type:N(`mention`),name:L()})]))}))}),Z={render:()=>{let e=(0,H.useRef)(null),[t,n]=(0,H.useState)({children:[{children:[{text:`Hi, `},{type:`mention`,name:`Captain Gregor`},{text:` and `},{type:`mention`,name:`Jaxxon`},{text:` . Please enter @ to show suggestions.`}]},{children:[{text:``}]}]}),[r,i]=(0,H.useState)(null),[s,c]=(0,H.useState)(0),l=(r&&a(t,0,r.caret).match(X))?.[1]??``,u=(0,H.useMemo)(()=>ge.filter(e=>e.toLowerCase().startsWith(l.toLowerCase())).slice(0,_e),[l]),d=t=>{if(!e.current||!r)return;let n=u[t],a=r.caret-l.length-1,s=r.caret;_.exec(p,[a,s]).exec(o,{type:`mention`,name:n},a),i(null),c(0)},f=(0,H.useEffectEvent)(()=>{if(!r||!u.length)return!1;c(e=>e<=0?u.length-1:e-1)}),m=(0,H.useEffectEvent)(()=>{if(!r||!u.length)return!1;c(e=>e>=u.length-1?0:e+1)}),h=(0,H.useEffectEvent)(()=>{if(!r||!u.length)return!1;d(s)}),g=(0,H.useEffectEvent)(()=>{if(!r||!u.length)return!1;i(null),c(0)}),_=(0,H.useMemo)(()=>{let e=x({doc:t,schema:ye}).exec(b,{ArrowUp:f,ArrowDown:m,Enter:h,Escape:g}).exec(ee,e=>{let t=Math.min(..._.selection);if(X.test(a(_.doc,0,t))){let n=e();i({top:n.top+n.height,left:n.left,caret:t})}else i(null);c(0)});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,H.useEffect)(()=>{if(e.current)return _.input(e.current)},[]),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,W.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,W.jsx)(`br`,{}):(0,W.jsxs)(`span`,{contentEditable:!1,style:{background:`#EAF5F9`,color:`#4276AA`,borderRadius:`3px`},children:[`@`,e.name]},t))},t))}),r&&(0,U.createPortal)((0,W.jsx)(ve,{top:r.top,left:r.left,chars:u,index:s,complete:d}),document.body)]})}},be=I({children:j(I({children:j(z([I({text:L()}),I({type:N(`image`),src:L()}),I({type:N(`video`),src:L()}),I({type:N(`youtube`),id:L()})]))}))}),Q={render:()=>{let e=(0,H.useRef)(null),[t,n]=(0,H.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]},{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]},{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,H.useMemo)(()=>{let e=x({doc:t,schema:be}).exec(h).exec(_,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(g,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src}),video:e=>({type:`video`,src:e.childNodes[0].src}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(v);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,H.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,W.jsxs)(`div`,{children:[(0,W.jsxs)(`div`,{style:{display:`flex`,padding:4,gap:4},children:[(0,W.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(o,{type:`image`,src:e})},children:`insert image`}),(0,W.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(o,{type:`video`,src:e})},children:`insert video`}),(0,W.jsx)(`button`,{onClick:()=>{let e=window.prompt(`id:`);e&&r.exec(o,{type:`youtube`,id:e})},children:`insert youtube`})]}),(0,W.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,W.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,W.jsx)(`br`,{}):e.type===`image`?(0,W.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t):e.type===`video`?(0,W.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,W.jsx)(`source`,{src:e.src})},t):e.type===`youtube`?(0,W.jsx)(`iframe`,{"data-youtube-id":e.id,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e.id,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}):null)},t))})]})}},xe=I({children:j(I({children:j(z([I({text:L()}),I({type:N(`ruby`),ruby:L(),value:L()})]))}))}),$={render:()=>{let e=(0,H.useRef)(null),[t,n]=(0,H.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,H.useMemo)(()=>{let e=x({doc:t,schema:xe}).exec(v,{voidToString:e=>e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,H.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,W.jsx)(`div`,{children:(0,W.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,W.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,W.jsx)(`br`,{}):(0,W.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,W.jsx)(`rp`,{children:`(`}),(0,W.jsx)(`rt`,{children:e.ruby}),(0,W.jsx)(`rp`,{children:`)`})]},t))},t))})})}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
          {doc.children.map((t, j) => "text" in t ? t.text || <br /> : <span key={j} contentEditable={false} onClick={e => {
          e.preventDefault();
          const tagIndex = doc.children.indexOf(t);
          if (tagIndex === -1) return;
          const value = window.prompt("label:", t.label);
          if (!value) return;
          const offset = doc.children.slice(0, tagIndex + 1).reduce((acc, n) => acc + getNodeSize(n), 0);
          editor.exec(SetVoidAttr, "label", value, offset);
        }} style={{
          background: "slategray",
          color: "white",
          cursor: "pointer",
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
}`,...$.parameters?.docs?.source}}},Se=[`Empty`,`RichText`,`Tag`,`Mention`,`Media`,`Ruby`]}))();export{K as Empty,Q as Media,Z as Mention,J as RichText,$ as Ruby,Y as Tag,Se as __namedExportsOrder,G as default};