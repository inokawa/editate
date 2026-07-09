import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-GKyW4bDs.js";import{t as r}from"./jsx-runtime-O9QVJvLM.js";import{A as i,E as a,a as o,d as s,f as c,g as l,h as u,j as d,l as ee,t as f,v as p}from"./src-hWLXAcHk.js";function te(e){return!e&&!k?A:{lang:e?.lang??k?.lang,message:e?.message,abortEarly:e?.abortEarly??k?.abortEarly,abortPipeEarly:e?.abortPipeEarly??k?.abortPipeEarly}}function ne(e){return ae?.get(e)}function re(e){return oe?.get(e)}function ie(e,t){return se?.get(e)?.get(t)}function m(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function h(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??m(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??ie(e.reference,c.lang)??(l?re(c.lang):null)??r.message??ne(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function g(e){let t=j.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},te())}},j.set(e,t)),t}function _(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function v(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function y(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function b(e,t){return{kind:`schema`,type:`array`,reference:b,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return g(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else h(this,`type`,e,t);return e}}}function x(e){return{kind:`schema`,type:`boolean`,reference:x,expects:`boolean`,async:!1,message:e,get"~standard"(){return g(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:h(this,`type`,e,t),e}}}function S(e,t){return{kind:`schema`,type:`literal`,reference:S,expects:m(e),async:!1,literal:e,message:t,get"~standard"(){return g(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:h(this,`type`,e,t),e}}}function C(e,t){return{kind:`schema`,type:`optional`,reference:C,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return g(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=y(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function w(e,t){return{kind:`schema`,type:`picklist`,reference:w,expects:_(e.map(m),`|`),async:!1,options:e,message:t,get"~standard"(){return g(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:h(this,`type`,e,t),e}}}function T(e,t){return{kind:`schema`,type:`strict_object`,reference:T,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return g(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:y(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=v(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(h(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){h(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else h(this,`type`,e,t);return e}}}function E(e){return{kind:`schema`,type:`string`,reference:E,expects:`string`,async:!1,message:e,get"~standard"(){return g(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:h(this,`type`,e,t),e}}}function D(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function O(e,t){return{kind:`schema`,type:`union`,reference:O,expects:_(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return g(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];h(this,`type`,e,t,{issues:D(r)}),e.typed=!0}else if(i?.length===1)return i[0];else h(this,`type`,e,t,{issues:D(i)});return e}}}var k,A,ae,oe,se,j,M=t((()=>{A={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},j=new WeakMap})),N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;t((()=>{N=e(n()),f(),M(),P=r(),F={component:p},I=T({children:b(T({children:b(T({text:E()}))}))}),L={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{children:[{text:`Hello world.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=(0,N.useMemo)(()=>{let e=p({doc:t,schema:I}).exec(s).exec(c,{serializers:{text:e=>({text:e})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,N.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,P.jsx)(`div`,{children:e.children.map((e,t)=>(0,P.jsx)(`span`,{children:e.text||(0,P.jsx)(`br`,{})},t))},t))})}},R=T({text:E(),bold:C(x()),italic:C(x()),underline:C(x()),strike:C(x())}),z=T({children:b(T({align:C(w([`left`,`right`])),children:b(R)}))}),B=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,P.jsx)(t,{style:n,children:e.text||(0,P.jsx)(`br`,{})})},V={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=()=>{f.exec(d,`bold`)},a=()=>{f.exec(d,`italic`)},o=()=>{f.exec(d,`underline`)},c=()=>{f.exec(d,`strike`)},l=()=>{f.exec(i,`align`,`right`,void 0)},f=(0,N.useMemo)(()=>{let e=p({doc:t,schema:z}).exec(ee,{"Mod+B":r,"Mod+I":a,"Mod+U":o,"Mod+S":c}).exec(s).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,N.useEffect)(()=>{if(e.current)return f.input(e.current)},[]),(0,P.jsxs)(`div`,{children:[(0,P.jsxs)(`div`,{children:[(0,P.jsx)(`button`,{onClick:r,children:`bold`}),(0,P.jsx)(`button`,{onClick:a,children:`italic`}),(0,P.jsx)(`button`,{onClick:o,children:`underline`}),(0,P.jsx)(`button`,{onClick:c,children:`strike`}),(0,P.jsx)(`button`,{onClick:l,children:`align`})]}),(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,P.jsx)(`div`,{style:{textAlign:e.align},children:e.children.map((e,t)=>(0,P.jsx)(B,{node:e},t))},t))})]})}},H=T({children:b(O([T({text:E()}),T({type:S(`tag`),label:E(),value:E()})]))}),U={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,N.useMemo)(()=>{let e=p({doc:t,schema:H}).exec(s).exec(u,{serializer:e=>`text`in e?e.text:e.label}).exec(o);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,N.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,N.useRef)(null),c=(0,N.useRef)(null);return(0,P.jsxs)(`div`,{children:[(0,P.jsxs)(`div`,{children:[(0,P.jsxs)(`label`,{children:[`label:`,(0,P.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,P.jsxs)(`label`,{children:[`value:`,(0,P.jsx)(`input`,{ref:c,defaultValue:`123`})]}),(0,P.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=c.current?.value;!e||!t||r.exec(a,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>`text`in e?(0,P.jsx)(`span`,{children:e.text||(0,P.jsx)(`br`,{})},t):(0,P.jsx)(`span`,{contentEditable:!1,"data-tag-value":e.value,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},W=T({children:b(T({children:b(O([T({text:E()}),T({type:S(`image`),src:E()})]))}))}),G={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]}]}),r=(0,N.useMemo)(()=>{let e=p({doc:t,schema:W}).exec(s).exec(l,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(c,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,N.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,P.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,P.jsx)(`span`,{children:e.text||(0,P.jsx)(`br`,{})},t):(0,P.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t))},t))})}},K=T({children:b(T({children:b(O([T({text:E()}),T({type:S(`video`),src:E()})]))}))}),q={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]}]}),r=(0,N.useMemo)(()=>{let e=p({doc:t,schema:K}).exec(s).exec(c,{serializers:{text:e=>({text:e}),video:e=>({type:`video`,src:e.childNodes[0].src})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,N.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,P.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,P.jsx)(`span`,{children:e.text||(0,P.jsx)(`br`,{})},t):(0,P.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,P.jsx)(`source`,{src:e.src})},t))},t))})}},J=T({children:b(T({children:b(O([T({text:E()}),T({type:S(`youtube`),id:E()})]))}))}),Y=({id:e})=>(0,P.jsx)(`iframe`,{"data-youtube-node":!0,"data-youtube-id":e,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}),X={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,N.useMemo)(()=>{let e=p({doc:t,schema:J}).exec(s).exec(c,{serializers:{text:e=>({text:e}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,N.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,P.jsx)(`div`,{children:(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,P.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,P.jsx)(`span`,{children:e.text||(0,P.jsx)(`br`,{})},t):(0,P.jsx)(Y,{id:e.id},t))},t))})})}},Z=T({children:b(T({children:b(O([T({text:E()}),T({type:S(`ruby`),ruby:E(),value:E()})]))}))}),Q={render:()=>{let e=(0,N.useRef)(null),[t,n]=(0,N.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,N.useMemo)(()=>{let e=p({doc:t,schema:Z}).exec(u,{serializer:e=>`text`in e?e.text:e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,N.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,P.jsx)(`div`,{children:(0,P.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,P.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,P.jsx)(`span`,{children:e.text||(0,P.jsx)(`br`,{})},t):(0,P.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,P.jsx)(`rp`,{children:`(`}),(0,P.jsx)(`rt`,{children:e.ruby}),(0,P.jsx)(`rp`,{children:`)`})]},t))},t))})})}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
      }).exec(internalTranferPlugin).exec(htmlTransferPlugin, {
        serializers: {
          text: text => ({
            text
          })
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
}`,...L.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
      const e = createEditor({
        doc: doc,
        schema: richSchema
      }).exec(keymapPlugin, {
        "Mod+B": toggleBold,
        "Mod+I": toggleItalic,
        "Mod+U": toggleUnderline,
        "Mod+S": toggleStrike
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
    return <div>
        <div>
          <button onClick={toggleBold}>bold</button>
          <button onClick={toggleItalic}>italic</button>
          <button onClick={toggleUnderline}>underline</button>
          <button onClick={toggleStrike}>strike</button>
          <button onClick={toggleAlign}>align</button>
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
      </div>;
  }
}`,...V.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
        serializer: node => "text" in node ? node.text : node.label
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
          {doc.children.map((t, j) => "text" in t ? <span key={j}>{t.text || <br />}</span> : <span key={j} contentEditable={false} data-tag-value={t.value} style={{
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
}`,...U.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof imageSchema>;
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
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: imageSchema
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
    return <div ref={ref} style={{
      backgroundColor: "white",
      padding: 8
    }}>
        {doc.children.map((b, i) => <div key={i}>
            {b.children.map((t, j) => "text" in t ? <span key={j}>{t.text || <br />}</span> : <img key={j} src={t.src} style={{
          maxWidth: 200
        }} />)}
          </div>)}
      </div>;
  }
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof videoSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
        children: [{
          text: "Hello "
        }, {
          type: "video",
          src: "https://download.samplelib.com/mp4/sample-5s.mp4"
        }, {
          text: " world "
        }]
      }]
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: videoSchema
      }).exec(internalTranferPlugin).exec(htmlTransferPlugin, {
        serializers: {
          text: text => ({
            text
          }),
          video: e => {
            return {
              type: "video",
              src: (e.childNodes[0] as HTMLSourceElement).src
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
    return <div ref={ref} style={{
      backgroundColor: "white",
      padding: 8
    }}>
        {doc.children.map((b, i) => <div key={i}>
            {b.children.map((t, j) => "text" in t ? <span key={j}>{t.text || <br />}</span> :
        // safari needs contentEditable="false"
        <video key={j} width={400} controls contentEditable="false" suppressContentEditableWarning>
                  <source src={t.src} />
                </video>)}
          </div>)}
      </div>;
  }
}`,...q.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof youtubeSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
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
        schema: youtubeSchema
      }).exec(internalTranferPlugin).exec(htmlTransferPlugin, {
        serializers: {
          text: text => ({
            text
          }),
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
        <div ref={ref} style={{
        backgroundColor: "white",
        padding: 8
      }}>
          {doc.children.map((b, i) => <div key={i}>
              {b.children.map((t, j) => "text" in t ? <span key={j}>{t.text || <br />}</span> : <Youtube key={j} id={t.id} />)}
            </div>)}
        </div>
      </div>;
  }
}`,...X.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
        serializer: n => "text" in n ? n.text : n.value
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
              {b.children.map((t, j) => "text" in t ? <span key={j}>{t.text || <br />}</span> : <ruby key={j} contentEditable={false}>
                    {t.value}
                    <rp>(</rp>
                    <rt>{t.ruby}</rt>
                    <rp>)</rp>
                  </ruby>)}
            </div>)}
        </div>
      </div>;
  }
}`,...Q.parameters?.docs?.source}}},$=[`Basic`,`RichText`,`Tag`,`Image`,`Video`,`Iframe`,`Ruby`]}))();export{L as Basic,X as Iframe,G as Image,V as RichText,Q as Ruby,U as Tag,q as Video,$ as __namedExportsOrder,F as default};