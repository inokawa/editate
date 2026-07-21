import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-DAyCy_Ny.js";import{t as r}from"./react-dom-gyuNSL33.js";import{t as i}from"./jsx-runtime-O9QVJvLM.js";import{B as a,D as o,E as s,F as c,L as l,M as u,N as d,O as ee,R as f,T as te,a as p,d as m,f as h,g,h as _,j as v,l as y,s as b,t as x,v as S}from"./src-cdklREqv.js";function C(e){return!e&&!R?se:{lang:e?.lang??R?.lang,message:e?.message,abortEarly:e?.abortEarly??R?.abortEarly,abortPipeEarly:e?.abortPipeEarly??R?.abortPipeEarly}}function w(e){return ce?.get(e)}function T(e){return le?.get(e)}function E(e,t){return ue?.get(e)?.get(t)}function D(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function O(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??D(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??E(e.reference,c.lang)??(l?T(c.lang):null)??r.message??w(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function k(e){let t=z.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},C())}},z.set(e,t)),t}function ne(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function re(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function ie(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function A(e,t){return{kind:`schema`,type:`array`,reference:A,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return k(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else O(this,`type`,e,t);return e}}}function j(e){return{kind:`schema`,type:`boolean`,reference:j,expects:`boolean`,async:!1,message:e,get"~standard"(){return k(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:O(this,`type`,e,t),e}}}function M(e,t){return{kind:`schema`,type:`literal`,reference:M,expects:D(e),async:!1,literal:e,message:t,get"~standard"(){return k(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:O(this,`type`,e,t),e}}}function N(e){return{kind:`schema`,type:`number`,reference:N,expects:`number`,async:!1,message:e,get"~standard"(){return k(this)},"~run"(e,t){return typeof e.value==`number`&&!isNaN(e.value)?e.typed=!0:O(this,`type`,e,t),e}}}function P(e,t){return{kind:`schema`,type:`optional`,reference:P,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return k(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=ie(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function ae(e,t){return{kind:`schema`,type:`picklist`,reference:ae,expects:ne(e.map(D),`|`),async:!1,options:e,message:t,get"~standard"(){return k(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:O(this,`type`,e,t),e}}}function F(e,t){return{kind:`schema`,type:`strict_object`,reference:F,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return k(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:ie(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=re(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(O(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){O(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else O(this,`type`,e,t);return e}}}function I(e){return{kind:`schema`,type:`string`,reference:I,expects:`string`,async:!1,message:e,get"~standard"(){return k(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:O(this,`type`,e,t),e}}}function oe(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function L(e,t){return{kind:`schema`,type:`union`,reference:L,expects:ne(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return k(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];O(this,`type`,e,t,{issues:oe(r)}),e.typed=!0}else if(i?.length===1)return i[0];else O(this,`type`,e,t,{issues:oe(i)});return e}}}var R,se,ce,le,ue,z,de=t((()=>{se={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},z=new WeakMap}));function fe(e,t=e.selection[0]){let[n,,r]=l(e.doc,t);e.apply({type:`patch_node`,path:r,key:`indent`,value:(n.indent??0)+1})}function pe(e,t=e.selection[0]){let[n,,r]=l(e.doc,t);e.apply({type:`patch_node`,path:r,key:`indent`,value:Math.max((n.indent??0)-1,0)})}var B,V,H,U,W,G,me,he,K,ge,q,_e,J,Y,ve,X,ye,be,Z,xe,Q,Se,$,Ce;t((()=>{B=e(n()),x(),de(),V=e(r()),H=i(),U={component:S},W=F({children:A(F({children:A(F({text:I()}))}))}),G={render:()=>{let e=(0,B.useRef)(null),[t,n]=(0,B.useState)({children:[{children:[{text:``}]}]}),r=(0,B.useMemo)(()=>{let e=S({doc:t,schema:W}).exec(m).exec(_);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,B.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,H.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,H.jsx)(`div`,{children:e.children.map((e,t)=>(0,H.jsx)(`span`,{children:e.text||(0,H.jsx)(`br`,{})},t))},t))})}},me=F({text:I(),fontSize:P(N()),bold:P(j()),italic:P(j()),underline:P(j()),strike:P(j())}),he=F({children:A(F({align:P(ae([`left`,`right`])),indent:P(N()),children:A(me)}))}),K=10,ge=({node:e})=>{let t=e.bold?`strong`:`span`,n={fontSize:`${e.fontSize??K}pt`};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,H.jsx)(t,{style:n,children:e.text||(0,H.jsx)(`br`,{})})},q={render:()=>{let e=(0,B.useRef)(null),[t,n]=(0,B.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),[r,i]=(0,B.useState)(null),[a,o]=(0,B.useState)(),[l,ee]=(0,B.useState)(!1),[f,te]=(0,B.useState)(!1),[p,h]=(0,B.useState)(!1),[g,v]=(0,B.useState)(!1),x=e=>{D.exec(s,`fontSize`,e)},C=()=>{D.exec(d,`bold`)},w=()=>{D.exec(d,`italic`)},T=()=>{D.exec(d,`underline`)},E=()=>{D.exec(d,`strike`)},D=(0,B.useMemo)(()=>{let e=()=>{let e=new Set,t=!1,n=!1,r=!1,i=!1;for(let a of D.exec(c))a.fontSize?e.add(a.fontSize):e.add(K),a.bold&&(t=!0),a.italic&&(n=!0),a.underline&&(r=!0),a.strike&&(i=!0);o(e.size===1?e.values().next().value:void 0),ee(t),te(n),h(r),v(i)},r=S({doc:t,schema:he}).exec(y,{"Mod+B":C,"Mod+I":w,"Mod+U":T,"Mod+S":E}).exec(b,e=>{D.selection[0]===D.selection[1]?i(null):i(t=>{let n=e();return t&&t.top===n.top&&t.left===n.left?t:{top:n.top,left:n.left}})}).exec(m).exec(_);return r.on(`change`,()=>{n(r.doc),e()}),r.on(`selectionchange`,()=>{e()}),r},[]);return(0,B.useEffect)(()=>{if(e.current)return D.input(e.current)},[]),(0,H.jsxs)(`div`,{children:[(0,H.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4,padding:4,paddingBottom:8},children:[(0,H.jsxs)(`div`,{children:[(0,H.jsxs)(`select`,{value:a??`--`,onChange:e=>{e.preventDefault();let t=Number(e.target.value);Number.isNaN(t)||x(t)},children:[(0,H.jsx)(`option`,{value:`--`,children:`--`}),(0,H.jsx)(`option`,{value:`8`,children:`8`}),(0,H.jsx)(`option`,{value:`10`,children:`10`}),(0,H.jsx)(`option`,{value:`12`,children:`12`}),(0,H.jsx)(`option`,{value:`14`,children:`14`}),(0,H.jsx)(`option`,{value:`16`,children:`16`}),(0,H.jsx)(`option`,{value:`18`,children:`18`}),(0,H.jsx)(`option`,{value:`20`,children:`20`})]}),(0,H.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:C,children:`bold`}),(0,H.jsx)(`button`,{style:{fontWeight:f?`bold`:void 0},onClick:w,children:`italic`}),(0,H.jsx)(`button`,{style:{fontWeight:p?`bold`:void 0},onClick:T,children:`underline`}),(0,H.jsx)(`button`,{style:{fontWeight:g?`bold`:void 0},onClick:E,children:`strike`})]}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`button`,{onClick:()=>{D.exec(u,`align`,`right`,void 0)},children:`align`}),(0,H.jsx)(`button`,{onClick:()=>{D.exec(fe)},children:`indent`}),(0,H.jsx)(`button`,{onClick:()=>{D.exec(pe)},children:`outdent`})]})]}),(0,H.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,H.jsx)(`div`,{style:{textAlign:e.align,textIndent:e.indent?`${e.indent}em`:void 0},children:e.children.map((e,t)=>(0,H.jsx)(ge,{node:e},t))},t))}),r?(0,H.jsxs)(`div`,{style:{position:`fixed`,top:r.top-30,left:r.left,whiteSpace:`nowrap`},children:[(0,H.jsx)(`button`,{style:{fontWeight:l?`bold`:void 0},onClick:C,children:`bold`}),(0,H.jsx)(`button`,{style:{fontWeight:f?`bold`:void 0},onClick:w,children:`italic`}),(0,H.jsx)(`button`,{style:{fontWeight:p?`bold`:void 0},onClick:T,children:`underline`}),(0,H.jsx)(`button`,{style:{fontWeight:g?`bold`:void 0},onClick:E,children:`strike`})]}):null]})}},_e=F({children:A(L([F({text:I()}),F({type:M(`tag`),label:I(),value:I()})]))}),J={render:()=>{let e=(0,B.useRef)(null),[t,n]=(0,B.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,B.useMemo)(()=>{let e=S({doc:t,schema:_e}).exec(m).exec(_,{voidToString:e=>e.label}).exec(p);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,B.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,B.useRef)(null),a=(0,B.useRef)(null);return(0,H.jsxs)(`div`,{children:[(0,H.jsxs)(`div`,{children:[(0,H.jsxs)(`label`,{children:[`label:`,(0,H.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,H.jsxs)(`label`,{children:[`value:`,(0,H.jsx)(`input`,{ref:a,defaultValue:`123`})]}),(0,H.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=a.current?.value;!e||!t||r.exec(o,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,H.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,n)=>`text`in e?e.text||(0,H.jsx)(`br`,{}):(0,H.jsx)(`span`,{contentEditable:!1,onClick:n=>{n.preventDefault();let i=t.children.indexOf(e);if(i===-1)return;let a=window.prompt(`label:`,e.label);if(!a)return;let o=t.children.slice(0,i+1).reduce((e,t)=>e+f(t),0);r.exec(v,`label`,a,o)},style:{background:`slategray`,color:`white`,cursor:`pointer`,fontSize:12,padding:4,borderRadius:8},children:e.label},n))})]})}},Y=`Aayla Secura,Adi Gallia,Admiral Dodd Rancit,Admiral Firmus Piett,Admiral Gial Ackbar,Admiral Ozzel,Admiral Raddus,Admiral Terrinald Screed,Admiral Trench,Admiral U.O. Statura,Agen Kolar,Agent Kallus,Aiolin and Morit Astarte,Aks Moe,Almec,Alton Kastle,Amee,AP-5,Armitage Hux,Artoo,Arvel Crynyd,Asajj Ventress,Aurra Sing,AZI-3,Bala-Tik,Barada,Bargwill Tomder,Baron Papanoida,Barriss Offee,Baze Malbus,Bazine Netal,BB-8,BB-9E,Ben Quadinaros,Berch Teller,Beru Lars,Bib Fortuna,Biggs Darklighter,Black Krrsantan,Bo-Katan Kryze,Boba Fett,Bobbajo,Bodhi Rook,Borvo the Hutt,Boss Nass,Bossk,Breha Antilles-Organa,Bren Derlin,Brendol Hux,BT-1,C-3PO,C1-10P,Cad Bane,Caluan Ematt,Captain Gregor,Captain Phasma,Captain Quarsh Panaka,Captain Rex,Carlist Rieekan,Casca Panzoro,Cassian Andor,Cassio Tagge,Cham Syndulla,Che Amanwe Papanoida,Chewbacca,Chi Eekway Papanoida,Chief Chirpa,Chirrut Îmwe,Ciena Ree,Cin Drallig,Clegg Holdfast,Cliegg Lars,Coleman Kcaj,Coleman Trebor,Colonel Kaplan,Commander Bly,Commander Cody (CC-2224),Commander Fil (CC-3714),Commander Fox,Commander Gree,Commander Jet,Commander Wolffe,Conan Antonio Motti,Conder Kyl,Constable Zuvio,Cordé,Cpatain Typho,Crix Madine,Cut Lawquane,Dak Ralter,Dapp,Darth Bane,Darth Maul,Darth Tyranus,Daultay Dofine,Del Meeko,Delian Mors,Dengar,Depa Billaba,Derek Klivian,Dexter Jettster,Dineé Ellberger,DJ,Doctor Aphra,Doctor Evazan,Dogma,Dormé,Dr. Cylo,Droidbait,Droopy McCool,Dryden Vos,Dud Bolt,Ebe E. Endocott,Echuu Shen-Jon,Eeth Koth,Eighth Brother,Eirtaé,Eli Vanto,Ellé,Ello Asty,Embo,Eneb Ray,Enfys Nest,EV-9D9,Evaan Verlaine,Even Piell,Ezra Bridger,Faro Argyus,Feral,Fifth Brother,Finis Valorum,Finn,Fives,FN-1824,FN-2003,Fodesinbeed Annodue,Fulcrum,FX-7,GA-97,Galen Erso,Gallius Rax,Garazeb "Zeb" Orrelios,Gardulla the Hutt,Garrick Versio,Garven Dreis,Gavyn Sykes,Gideon Hask,Gizor Dellso,Gonk droid,Grand Inquisitor,Greeata Jendowanian,Greedo,Greer Sonnel,Grievous,Grummgar,Gungi,Hammerhead,Han Solo,Harter Kalonia,Has Obbit,Hera Syndulla,Hevy,Hondo Ohnaka,Huyang,Iden Versio,IG-88,Ima-Gun Di,Inquisitors,Inspector Thanoth,Jabba,Jacen Syndulla,Jan Dodonna,Jango Fett,Janus Greejatus,Jar Jar Binks,Jas Emari,Jaxxon,Jek Tono Porkins,Jeremoch Colton,Jira,Jobal Naberrie,Jocasta Nu,Joclad Danva,Joh Yowza,Jom Barell,Joph Seastriker,Jova Tarkin,Jubnuk,Jyn Erso,K-2SO,Kanan Jarrus,Karbin,Karina the Great,Kes Dameron,Ketsu Onyo,Ki-Adi-Mundi,King Katuunko,Kit Fisto,Kitster Banai,Klaatu,Klik-Klak,Korr Sella,Kylo Ren,L3-37,Lama Su,Lando Calrissian,Lanever Villecham,Leia Organa,Letta Turmond,Lieutenant Kaydel Ko Connix,Lieutenant Thire,Lobot,Logray,Lok Durd,Longo Two-Guns,Lor San Tekka,Lorth Needa,Lott Dod,Luke Skywalker,Lumat,Luminara Unduli,Lux Bonteri,Lyn Me,Lyra Erso,Mace Windu,Malakili,Mama the Hutt,Mars Guo,Mas Amedda,Mawhonic,Max Rebo,Maximilian Veers,Maz Kanata,ME-8D9,Meena Tills,Mercurial Swift,Mina Bonteri,Miraj Scintel,Mister Bones,Mod Terrik,Moden Canady,Mon Mothma,Moradmin Bast,Moralo Eval,Morley,Mother Talzin,Nahdar Vebb,Nahdonnis Praji,Nien Nunb,Niima the Hutt,Nines,Norra Wexley,Nute Gunray,Nuvo Vindi,Obi-Wan Kenobi,Odd Ball,Ody Mandrell,Omi,Onaconda Farr,Oola,OOM-9,Oppo Rancisis,Orn Free Taa,Oro Dassyne,Orrimarko,Osi Sobeck,Owen Lars,Pablo-Jill,Padmé Amidala,Pagetti Rook,Paige Tico,Paploo,Petty Officer Thanisson,Pharl McQuarrie,Plo Koon,Po Nudo,Poe Dameron,Poggle the Lesser,Pong Krell,Pooja Naberrie,PZ-4CO,Quarrie,Quay Tolsite,Queen Apailana,Queen Jamillia,Queen Neeyutnee,Qui-Gon Jinn,Quiggold,Quinlan Vos,R2-D2,R2-KT,R3-S6,R4-P17,R5-D4,RA-7,Rabé,Rako Hardeen,Ransolm Casterfo,Rappertunie,Ratts Tyerell,Raymus Antilles,Ree-Yees,Reeve Panzoro,Rey,Ric Olié,Riff Tamson,Riley,Rinnriyin Di,Rio Durant,Rogue Squadron,Romba,Roos Tarpals,Rose Tico,Rotta the Hutt,Rukh,Rune Haako,Rush Clovis,Ruwee Naberrie,Ryoo Naberrie,Sabé,Sabine Wren,Saché,Saelt-Marae,Saesee Tiin,Salacious B. Crumb,San Hill,Sana Starros,Sarco Plank,Sarkli,Satine Kryze,Savage Opress,Sebulba,Senator Organa,Sergeant Kreel,Seventh Sister,Shaak Ti,Shara Bey,Shmi Skywalker,Shu Mai,Sidon Ithano,Sifo-Dyas,Sim Aloo,Siniir Rath Velus,Sio Bibble,Sixth Brother,Slowen Lo,Sly Moore,Snaggletooth,Snap Wexley,Snoke,Sola Naberrie,Sora Bulq,Strono Tuggs,Sy Snootles,Tallissan Lintra,Tarfful,Tasu Leech,Taun We,TC-14,Tee Watt Kaa,Teebo,Teedo,Teemto Pagalies,Temiri Blagg,Tessek,Tey How,Thane Kyrell,The Bendu,The Smuggler,Thrawn,Tiaan Jerjerrod,Tion Medon,Tobias Beckett,Tulon Voidgazer,Tup,U9-C4,Unkar Plutt,Val Beckett,Vanden Willard,Vice Admiral Amilyn Holdo,Vober Dand,WAC-47,Wag Too,Wald,Walrus Man,Warok,Wat Tambor,Watto,Wedge Antilles,Wes Janson,Wicket W. Warrick,Wilhuff Tarkin,Wollivan,Wuher,Wullf Yularen,Xamuel Lennox,Yaddle,Yarael Poof,Yoda,Zam Wesell,Zev Senesca,Ziro the Hutt,Zuckuss`.split(`,`),ve=8,X=/\B@([\-+\w]*)$/,ye=({chars:e,index:t,top:n,left:r,complete:i})=>(0,H.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,fontSize:`12px`,border:`solid 1px gray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,H.jsx)(`div`,{style:{padding:`4px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),be=F({children:A(F({children:A(L([F({text:I()}),F({type:M(`mention`),name:I()})]))}))}),Z={render:()=>{let e=(0,B.useRef)(null),[t,n]=(0,B.useState)({children:[{children:[{text:`Hi, `},{type:`mention`,name:`Captain Gregor`},{text:` and `},{type:`mention`,name:`Jaxxon`},{text:` . Please enter @ to show suggestions.`}]},{children:[{text:``}]}]}),[r,i]=(0,B.useState)(null),[s,c]=(0,B.useState)(0),l=(r&&a(t,0,r.caret).match(X))?.[1]??``,u=(0,B.useMemo)(()=>Y.filter(e=>e.toLowerCase().startsWith(l.toLowerCase())).slice(0,ve),[l]),d=t=>{if(!e.current||!r)return;let n=u[t],a=r.caret-l.length-1,s=r.caret;g.exec(te,[a,s]).exec(o,{type:`mention`,name:n},a).exec(ee,` `),i(null),c(0)},f=(0,B.useEffectEvent)(()=>{if(!r||!u.length)return!1;c(e=>e<=0?u.length-1:e-1)}),p=(0,B.useEffectEvent)(()=>{if(!r||!u.length)return!1;c(e=>e>=u.length-1?0:e+1)}),m=(0,B.useEffectEvent)(()=>{if(!r||!u.length)return!1;d(s)}),h=(0,B.useEffectEvent)(()=>{if(!r||!u.length)return!1;i(null),c(0)}),g=(0,B.useMemo)(()=>{let e=S({doc:t,schema:be}).exec(_,{voidToString:e=>`@${e.name}`}).exec(y,{ArrowUp:f,ArrowDown:p,Enter:m,Escape:h}).exec(b,e=>{let t=Math.min(...g.selection);if(X.test(a(g.doc,0,t))){let n=e();i({top:n.top+n.height,left:n.left,caret:t})}else i(null);c(0)});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,B.useEffect)(()=>{if(e.current)return g.input(e.current)},[]),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,H.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,H.jsx)(`br`,{}):(0,H.jsxs)(`span`,{contentEditable:!1,style:{background:`#EAF5F9`,color:`#4276AA`,borderRadius:`3px`},children:[`@`,e.name]},t))},t))}),r&&(0,V.createPortal)((0,H.jsx)(ye,{top:r.top,left:r.left,chars:u,index:s,complete:d}),document.body)]})}},xe=F({children:A(F({children:A(L([F({text:I()}),F({type:M(`image`),src:I()}),F({type:M(`video`),src:I()}),F({type:M(`youtube`),id:I()})]))}))}),Q={render:()=>{let e=(0,B.useRef)(null),[t,n]=(0,B.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]},{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]},{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,B.useMemo)(()=>{let e=S({doc:t,schema:xe}).exec(m).exec(g,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(h,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src}),video:e=>({type:`video`,src:e.childNodes[0].src}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(_);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,B.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,H.jsxs)(`div`,{children:[(0,H.jsxs)(`div`,{style:{display:`flex`,padding:4,gap:4},children:[(0,H.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(o,{type:`image`,src:e})},children:`insert image`}),(0,H.jsx)(`button`,{onClick:()=>{let e=window.prompt(`url:`);e&&r.exec(o,{type:`video`,src:e})},children:`insert video`}),(0,H.jsx)(`button`,{onClick:()=>{let e=window.prompt(`id:`);e&&r.exec(o,{type:`youtube`,id:e})},children:`insert youtube`})]}),(0,H.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,H.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,H.jsx)(`br`,{}):e.type===`image`?(0,H.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t):e.type===`video`?(0,H.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,H.jsx)(`source`,{src:e.src})},t):e.type===`youtube`?(0,H.jsx)(`iframe`,{"data-youtube-id":e.id,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e.id,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}):null)},t))})]})}},Se=F({children:A(F({children:A(L([F({text:I()}),F({type:M(`ruby`),ruby:I(),value:I()})]))}))}),$={render:()=>{let e=(0,B.useRef)(null),[t,n]=(0,B.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,B.useMemo)(()=>{let e=S({doc:t,schema:Se}).exec(_,{voidToString:e=>e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,B.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,H.jsx)(`div`,{children:(0,H.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,H.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,H.jsx)(`br`,{}):(0,H.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,H.jsx)(`rp`,{children:`(`}),(0,H.jsx)(`rt`,{children:e.ruby}),(0,H.jsx)(`rp`,{children:`)`})]},t))},t))})})}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}},Ce=[`Empty`,`RichText`,`Tag`,`Mention`,`Media`,`Ruby`]}))();export{G as Empty,Q as Media,Z as Mention,q as RichText,$ as Ruby,J as Tag,Ce as __namedExportsOrder,U as default};