import{c as e,i as t}from"./preload-helper-DbRxMUml.js";import{S as n}from"./iframe-cOWrQau6.js";import{t as r}from"./jsx-runtime-CP4-wa-Y.js";import{a as i,c as a,h as o,i as s,l as c,o as l,r as u,s as d,t as f,v as ee,y as p}from"./src-NsILKfXN.js";function te(e){return!e&&!A?j:{lang:e?.lang??A?.lang,message:e?.message,abortEarly:e?.abortEarly??A?.abortEarly,abortPipeEarly:e?.abortPipeEarly??A?.abortPipeEarly}}function m(e){return M?.get(e)}function ne(e){return ie?.get(e)}function re(e,t){return N?.get(e)?.get(t)}function h(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function g(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??h(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??re(e.reference,c.lang)??(l?ne(c.lang):null)??r.message??m(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function _(e){let t=P.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},te())}},P.set(e,t)),t}function v(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function y(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function b(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function x(e,t){return{kind:`schema`,type:`array`,reference:x,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return _(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else g(this,`type`,e,t);return e}}}function S(e){return{kind:`schema`,type:`boolean`,reference:S,expects:`boolean`,async:!1,message:e,get"~standard"(){return _(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:g(this,`type`,e,t),e}}}function C(e,t){return{kind:`schema`,type:`literal`,reference:C,expects:h(e),async:!1,literal:e,message:t,get"~standard"(){return _(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:g(this,`type`,e,t),e}}}function w(e,t){return{kind:`schema`,type:`optional`,reference:w,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return _(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=b(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function T(e,t){return{kind:`schema`,type:`picklist`,reference:T,expects:v(e.map(h),`|`),async:!1,options:e,message:t,get"~standard"(){return _(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:g(this,`type`,e,t),e}}}function E(e,t){return{kind:`schema`,type:`strict_object`,reference:E,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return _(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:b(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=y(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(g(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){g(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else g(this,`type`,e,t);return e}}}function D(e){return{kind:`schema`,type:`string`,reference:D,expects:`string`,async:!1,message:e,get"~standard"(){return _(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:g(this,`type`,e,t),e}}}function O(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function k(e,t){return{kind:`schema`,type:`union`,reference:k,expects:v(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return _(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];g(this,`type`,e,t,{issues:O(r)}),e.typed=!0}else if(i?.length===1)return i[0];else g(this,`type`,e,t,{issues:O(i)});return e}}}var A,j,M,ie,N,P,ae=t((()=>{j={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},P=new WeakMap})),F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;t((()=>{F=e(n()),f(),ae(),I=r(),L={component:c},R=E({children:x(E({children:x(E({text:D()}))}))}),z={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello world.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=(0,F.useMemo)(()=>{let e=c({doc:t,schema:R}).exec(i).exec(l,{serializeText:e=>({text:e})}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))},t))})}},B=E({text:D(),bold:w(S()),italic:w(S()),underline:w(S()),strike:w(S())}),V=E({children:x(E({align:w(T([`left`,`right`])),children:x(B)}))}),H=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,I.jsx)(t,{style:n,children:e.text||(0,I.jsx)(`br`,{})})},U={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=()=>{f.exec(p,`bold`)},a=()=>{f.exec(p,`italic`)},o=()=>{f.exec(p,`underline`)},l=()=>{f.exec(p,`strike`)},u=()=>{f.exec(ee,`align`,`right`,void 0)},f=(0,F.useMemo)(()=>{let e=c({doc:t,schema:V}).exec(s,{"Mod+B":r,"Mod+I":a,"Mod+U":o,"Mod+S":l}).exec(i).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return f.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`button`,{onClick:r,children:`bold`}),(0,I.jsx)(`button`,{onClick:a,children:`italic`}),(0,I.jsx)(`button`,{onClick:o,children:`underline`}),(0,I.jsx)(`button`,{onClick:l,children:`strike`}),(0,I.jsx)(`button`,{onClick:u,children:`align`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{style:{textAlign:e.align},children:e.children.map((e,t)=>(0,I.jsx)(H,{node:e},t))},t))})]})}},W=E({children:x(E({children:x(k([E({text:D()}),E({type:C(`tag`),label:D(),value:D()})]))}))}),G={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}]}),r=(0,F.useMemo)(()=>{let e=c({doc:t,schema:W}).exec(i).exec(d,{serializer:e=>`text`in e?e.text:e.label}).exec(u);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let a=(0,F.useRef)(null),s=(0,F.useRef)(null);return(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`label`,{children:[`label:`,(0,I.jsx)(`input`,{ref:a,defaultValue:`Grape`})]}),(0,I.jsxs)(`label`,{children:[`value:`,(0,I.jsx)(`input`,{ref:s,defaultValue:`123`})]}),(0,I.jsx)(`button`,{onClick:()=>{let e=a.current?.value,t=s.current?.value;!e||!t||r.exec(o,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children[0].children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(`span`,{contentEditable:!1,"data-tag-value":e.value,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},K=E({children:x(E({children:x(k([E({text:D()}),E({type:C(`image`),src:D()})]))}))}),q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]}]}),r=(0,F.useMemo)(()=>{let e=c({doc:t,schema:K}).exec(i).exec(a,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(l,{serializeText:e=>({text:e}),serializers:[e=>{if(e.tagName===`IMG`)return{type:`image`,src:e.src}}]}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t))},t))})}},J=E({children:x(E({children:x(k([E({text:D()}),E({type:C(`video`),src:D()})]))}))}),Y={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]}]}),r=(0,F.useMemo)(()=>{let e=c({doc:t,schema:J}).exec(i).exec(l,{serializeText:e=>({text:e}),serializers:[e=>{if(e.tagName===`VIDEO`)return{type:`video`,src:e.childNodes[0].src}}]}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,I.jsx)(`source`,{src:e.src})},t))},t))})}},X=E({children:x(E({children:x(k([E({text:D()}),E({type:C(`youtube`),id:D()})]))}))}),Z=({id:e})=>(0,I.jsx)(`iframe`,{"data-youtube-node":!0,"data-youtube-id":e,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}),Q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,F.useMemo)(()=>{let e=c({doc:t,schema:X}).exec(i).exec(l,{serializeText:e=>({text:e}),serializers:[e=>{if(e.dataset.youtubeNode)return{type:`youtube`,id:e.dataset.youtubeId}}]}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsx)(`div`,{children:(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(Z,{id:e.id},t))},t))})})}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
        serializeText: text => ({
          text
        })
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
}`,...z.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{
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
          {doc.children[0].children.map((t, j) => "text" in t ? <span key={j}>{t.text || <br />}</span> : <span key={j} contentEditable={false} data-tag-value={t.value} style={{
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
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
        serializeText: text => ({
          text
        }),
        serializers: [e => {
          if (e.tagName === "IMG") {
            return {
              type: "image",
              src: (e as HTMLImageElement).src
            };
          }
        }]
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
}`,...q.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
        serializeText: text => ({
          text
        }),
        serializers: [e => {
          if (e.tagName === "VIDEO") {
            return {
              type: "video",
              src: (e.childNodes[0] as HTMLSourceElement).src
            };
          }
        }]
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
}`,...Y.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
        serializeText: text => ({
          text
        }),
        serializers: [e => {
          if (!!e.dataset.youtubeNode) {
            return {
              type: "youtube",
              id: e.dataset.youtubeId!
            };
          }
        }]
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
}`,...Q.parameters?.docs?.source}}},$=[`Basic`,`RichText`,`Tag`,`Image`,`Video`,`Iframe`]}))();export{z as Basic,Q as Iframe,q as Image,U as RichText,G as Tag,Y as Video,$ as __namedExportsOrder,L as default};