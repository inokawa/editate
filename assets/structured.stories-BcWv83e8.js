import{n as e,o as t}from"./chunk-jRWAZmH_.js";import{a as n}from"./iframe-Db7fBNN8.js";import{t as r}from"./jsx-runtime-WZfjI2gv.js";import{_ as i,a,c as o,d as s,f as c,i as l,l as u,m as d,o as f,r as p,s as m,t as ee,u as h,v as g}from"./src-C-j23gWX.js";function te(e){return!e&&!M?N:{lang:e?.lang??M?.lang,message:e?.message,abortEarly:e?.abortEarly??M?.abortEarly,abortPipeEarly:e?.abortPipeEarly??M?.abortPipeEarly}}function ne(e){return ae?.get(e)}function re(e){return oe?.get(e)}function ie(e,t){return se?.get(e)?.get(t)}function _(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function v(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??_(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??ie(e.reference,c.lang)??(l?re(c.lang):null)??r.message??ne(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function y(e){let t=P.get(e);return t||(t={version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},te())}},P.set(e,t)),t}function b(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function x(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function S(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function C(e,t){return{kind:`schema`,type:`array`,reference:C,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return y(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else v(this,`type`,e,t);return e}}}function w(e){return{kind:`schema`,type:`boolean`,reference:w,expects:`boolean`,async:!1,message:e,get"~standard"(){return y(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:v(this,`type`,e,t),e}}}function T(e,t){return{kind:`schema`,type:`literal`,reference:T,expects:_(e),async:!1,literal:e,message:t,get"~standard"(){return y(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:v(this,`type`,e,t),e}}}function E(e,t){return{kind:`schema`,type:`optional`,reference:E,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return y(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=S(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function D(e,t){return{kind:`schema`,type:`picklist`,reference:D,expects:b(e.map(_),`|`),async:!1,options:e,message:t,get"~standard"(){return y(this)},"~run"(e,t){return this.options.includes(e.value)?e.typed=!0:v(this,`type`,e,t),e}}}function O(e,t){return{kind:`schema`,type:`strict_object`,reference:O,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return y(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:S(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=x(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(v(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){v(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else v(this,`type`,e,t);return e}}}function k(e){return{kind:`schema`,type:`string`,reference:k,expects:`string`,async:!1,message:e,get"~standard"(){return y(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:v(this,`type`,e,t),e}}}function A(e){let t;if(e)for(let n of e)if(t)for(let e of n.issues)t.push(e);else t=n.issues;return t}function j(e,t){return{kind:`schema`,type:`union`,reference:j,expects:b(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return y(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];v(this,`type`,e,t,{issues:A(r)}),e.typed=!0}else if(i?.length===1)return i[0];else v(this,`type`,e,t,{issues:A(i)});return e}}}var M,N,ae,oe,se,P,ce=e((()=>{N={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0},P=new WeakMap})),F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{F=t(n()),ee(),ce(),I=r(),L={component:l},R=O({children:C(O({children:C(O({text:k()}))}))}),z={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello world.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:R,copy:[h(),s(),c()],paste:[f(),m(e=>({text:e})),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))},t))})}},B=O({text:k(),bold:E(w()),italic:E(w()),underline:E(w()),strike:E(w())}),V=O({children:C(O({align:E(D([`left`,`right`])),children:C(B)}))}),H=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,I.jsx)(t,{style:n,children:e.text||(0,I.jsx)(`br`,{})})},U={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=()=>{m.apply(g,`bold`)},s=()=>{m.apply(g,`italic`)},u=()=>{m.apply(g,`underline`)},d=()=>{m.apply(g,`strike`)},p=()=>{m.apply(i,`align`,`right`,void 0)},m=(0,F.useMemo)(()=>l({doc:t,schema:V,keyboard:[a(`b`,r,{mod:!0}),a(`i`,s,{mod:!0}),a(`u`,u,{mod:!0}),a(`s`,d,{mod:!0})],copy:[h(),c()],paste:[f(),o()],onChange:n}),[]);return(0,F.useEffect)(()=>{if(e.current)return m.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`button`,{onClick:r,children:`bold`}),(0,I.jsx)(`button`,{onClick:s,children:`italic`}),(0,I.jsx)(`button`,{onClick:u,children:`underline`}),(0,I.jsx)(`button`,{onClick:d,children:`strike`}),(0,I.jsx)(`button`,{onClick:p,children:`align`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{style:{textAlign:e.align},children:e.children.map((e,t)=>(0,I.jsx)(H,{node:e},t))},t))})]})}},W=O({children:C(O({children:C(j([O({text:k()}),O({type:T(`tag`),label:k(),value:k()})]))}))}),G={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}]}),r=(0,F.useMemo)(()=>l({doc:t,schema:W,copy:[h(),c(e=>`text`in e?e.text:e.label)],paste:[f(),o()],onChange:n}).use(p),[]);(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,F.useRef)(null),a=(0,F.useRef)(null);return(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`label`,{children:[`label:`,(0,I.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,I.jsxs)(`label`,{children:[`value:`,(0,I.jsx)(`input`,{ref:a,defaultValue:`123`})]}),(0,I.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=a.current?.value;!e||!t||r.apply(d,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children[0].children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(`span`,{contentEditable:!1,"data-tag-value":e.value,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},K=O({children:C(O({children:C(j([O({text:k()}),O({type:T(`image`),src:k()})]))}))}),q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]}]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:K,copy:[h(),s(),c()],paste:[f(),u({"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}),m(e=>({text:e}),[e=>{if(e.tagName===`IMG`)return{type:`image`,src:e.src}}]),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t))},t))})}},J=O({children:C(O({children:C(j([O({text:k()}),O({type:T(`video`),src:k()})]))}))}),Y={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]}]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:J,copy:[h(),s(),c()],paste:[f(),m(e=>({text:e}),[e=>{if(e.tagName===`VIDEO`)return{type:`video`,src:e.childNodes[0].src}}]),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,I.jsx)(`source`,{src:e.src})},t))},t))})}},X=O({children:C(O({children:C(j([O({text:k()}),O({type:T(`youtube`),id:k()})]))}))}),Z=({id:e})=>(0,I.jsx)(`iframe`,{"data-youtube-node":!0,"data-youtube-id":e,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}),Q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:X,copy:[h(),s(),c()],paste:[f(),m(e=>({text:e}),[e=>{if(e.dataset.youtubeNode)return{type:`youtube`,id:e.dataset.youtubeId}}]),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{children:(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t):(0,I.jsx)(Z,{id:e.id},t))},t))})})}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: basicSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [internalPaste(), htmlPaste<Doc>(text => ({
          text
        })), plainPaste()],
        onChange: setDoc
      }).input(ref.current);
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
      editor.apply(ToggleFormat, "bold");
    };
    const toggleItalic = () => {
      editor.apply(ToggleFormat, "italic");
    };
    const toggleUnderline = () => {
      editor.apply(ToggleFormat, "underline");
    };
    const toggleStrike = () => {
      editor.apply(ToggleFormat, "strike");
    };
    const toggleAlign = () => {
      editor.apply(ToggleBlockAttr, "align", "right", undefined);
    };
    const editor = useMemo(() => createEditor({
      doc: doc,
      schema: richSchema,
      keyboard: [hotkey("b", toggleBold, {
        mod: true
      }), hotkey("i", toggleItalic, {
        mod: true
      }), hotkey("u", toggleUnderline, {
        mod: true
      }), hotkey("s", toggleStrike, {
        mod: true
      })],
      copy: [internalCopy(), plainCopy()],
      paste: [internalPaste(), plainPaste()],
      onChange: setDoc
    }), []);
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
    const editor = useMemo(() => createEditor({
      doc: doc,
      schema: tagSchema,
      copy: [internalCopy(), plainCopy<Doc>(node => "text" in node ? node.text : node.label)],
      paste: [internalPaste(), plainPaste()],
      onChange: setDoc
    }).use(singlelinePlugin), []);
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
          editor.apply(InsertNode, {
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
    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: imageSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [internalPaste(), filePaste({
          "image/png": file => ({
            type: "image",
            src: URL.createObjectURL(file)
          })
        }), htmlPaste<Doc>(text => ({
          text
        }), [e => {
          if (e.tagName === "IMG") {
            return {
              type: "image",
              src: (e as HTMLImageElement).src
            };
          }
        }]), plainPaste()],
        onChange: setDoc
      }).input(ref.current);
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
    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: videoSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [internalPaste(), htmlPaste<Doc>(text => ({
          text
        }), [e => {
          if (e.tagName === "VIDEO") {
            return {
              type: "video",
              src: (e.childNodes[0] as HTMLSourceElement).src
            };
          }
        }]), plainPaste()],
        onChange: setDoc
      }).input(ref.current);
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
    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: youtubeSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [internalPaste(), htmlPaste<Doc>(text => ({
          text
        }), [e => {
          if (!!e.dataset.youtubeNode) {
            return {
              type: "youtube",
              id: e.dataset.youtubeId!
            };
          }
        }]), plainPaste()],
        onChange: setDoc
      }).input(ref.current);
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