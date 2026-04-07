import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{a as n}from"./iframe-DOi8d-ls.js";import{t as r}from"./jsx-runtime-CR4qI0Ep.js";import{_ as i,a,c as o,d as s,f as c,i as l,l as u,m as d,o as f,r as p,s as m,t as ee,u as h}from"./src-D1V7JRYA.js";function te(e){return{lang:e?.lang??j?.lang,message:e?.message,abortEarly:e?.abortEarly??j?.abortEarly,abortPipeEarly:e?.abortPipeEarly??j?.abortPipeEarly}}function g(e){return M?.get(e)}function _(e){return N?.get(e)}function v(e,t){return P?.get(e)?.get(t)}function y(e){let t=typeof e;return t===`string`?`"${e}"`:t===`number`||t===`bigint`||t===`boolean`?`${e}`:t===`object`||t===`function`?(e&&Object.getPrototypeOf(e)?.constructor?.name)??`null`:t}function b(e,t,n,r,i){let a=i&&`input`in i?i.input:n.value,o=i?.expected??e.expects??null,s=i?.received??y(a),c={kind:e.kind,type:e.type,input:a,expected:o,received:s,message:`Invalid ${t}: ${o?`Expected ${o} but r`:`R`}eceived ${s}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind===`schema`,u=i?.message??e.message??v(e.reference,c.lang)??(l?_(c.lang):null)??r.message??g(c.lang);u!==void 0&&(c.message=typeof u==`function`?u(c):u),l&&(n.typed=!1),n.issues?n.issues.push(c):n.issues=[c]}function x(e){return{version:1,vendor:`valibot`,validate(t){return e[`~run`]({value:t},te())}}}function ne(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??`never`}function re(e,t,n){return typeof e.fallback==`function`?e.fallback(t,n):e.fallback}function S(e,t,n){return typeof e.default==`function`?e.default(t,n):e.default}function C(e,t){return{kind:`schema`,type:`array`,reference:C,expects:`Array`,async:!1,item:e,message:t,get"~standard"(){return x(this)},"~run"(e,t){let n=e.value;if(Array.isArray(n)){e.typed=!0,e.value=[];for(let r=0;r<n.length;r++){let i=n[r],a=this.item[`~run`]({value:i},t);if(a.issues){let o={type:`array`,origin:`value`,input:n,key:r,value:i};for(let t of a.issues)t.path?t.path.unshift(o):t.path=[o],e.issues?.push(t);if(e.issues||=a.issues,t.abortEarly){e.typed=!1;break}}a.typed||(e.typed=!1),e.value.push(a.value)}}else b(this,`type`,e,t);return e}}}function w(e){return{kind:`schema`,type:`boolean`,reference:w,expects:`boolean`,async:!1,message:e,get"~standard"(){return x(this)},"~run"(e,t){return typeof e.value==`boolean`?e.typed=!0:b(this,`type`,e,t),e}}}function T(e,t){return{kind:`schema`,type:`literal`,reference:T,expects:y(e),async:!1,literal:e,message:t,get"~standard"(){return x(this)},"~run"(e,t){return e.value===this.literal?e.typed=!0:b(this,`type`,e,t),e}}}function E(e,t){return{kind:`schema`,type:`optional`,reference:E,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return x(this)},"~run"(e,t){return e.value===void 0&&(this.default!==void 0&&(e.value=S(this,e,t)),e.value===void 0)?(e.typed=!0,e):this.wrapped[`~run`](e,t)}}}function D(e,t){return{kind:`schema`,type:`strict_object`,reference:D,expects:`Object`,async:!1,entries:e,message:t,get"~standard"(){return x(this)},"~run"(e,t){let n=e.value;if(n&&typeof n==`object`){e.typed=!0,e.value={};for(let r in this.entries){let i=this.entries[r];if(r in n||(i.type===`exact_optional`||i.type===`optional`||i.type===`nullish`)&&i.default!==void 0){let a=r in n?n[r]:S(i),o=i[`~run`]({value:a},t);if(o.issues){let i={type:`object`,origin:`value`,input:n,key:r,value:a};for(let t of o.issues)t.path?t.path.unshift(i):t.path=[i],e.issues?.push(t);if(e.issues||=o.issues,t.abortEarly){e.typed=!1;break}}o.typed||(e.typed=!1),e.value[r]=o.value}else if(i.fallback!==void 0)e.value[r]=re(i);else if(i.type!==`exact_optional`&&i.type!==`optional`&&i.type!==`nullish`&&(b(this,`key`,e,t,{input:void 0,expected:`"${r}"`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]}),t.abortEarly))break}if(!e.issues||!t.abortEarly){for(let r in n)if(!(r in this.entries)){b(this,`key`,e,t,{input:r,expected:`never`,path:[{type:`object`,origin:`key`,input:n,key:r,value:n[r]}]});break}}}else b(this,`type`,e,t);return e}}}function O(e){return{kind:`schema`,type:`string`,reference:O,expects:`string`,async:!1,message:e,get"~standard"(){return x(this)},"~run"(e,t){return typeof e.value==`string`?e.typed=!0:b(this,`type`,e,t),e}}}function k(e){let t;if(e)for(let n of e)t?t.push(...n.issues):t=n.issues;return t}function A(e,t){return{kind:`schema`,type:`union`,reference:A,expects:ne(e.map(e=>e.expects),`|`),async:!1,options:e,message:t,get"~standard"(){return x(this)},"~run"(e,t){let n,r,i;for(let a of this.options){let o=a[`~run`]({value:e.value},t);if(o.typed)if(o.issues)r?r.push(o):r=[o];else{n=o;break}else i?i.push(o):i=[o]}if(n)return n;if(r){if(r.length===1)return r[0];b(this,`type`,e,t,{issues:k(r)}),e.typed=!0}else if(i?.length===1)return i[0];else b(this,`type`,e,t,{issues:k(i)});return e}}}var j,M,N,P,ie=e((()=>{})),F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{F=t(n()),ee(),ie(),I=r(),L={component:l},R=D({children:C(C(D({text:O()})))}),z={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[[{text:`Hello world.`}],[{text:`こんにちは。`}],[{text:`👍❤️🧑‍🧑‍🧒`}]]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:R,copy:[h(),s(),c()],paste:[f(),m(e=>({text:e})),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.map((e,t)=>(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))},t))})}},B=D({text:O(),bold:E(w()),italic:E(w()),underline:E(w()),strike:E(w())}),V=D({children:C(C(B))}),H=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,I.jsx)(t,{style:n,children:e.text||(0,I.jsx)(`br`,{})})},U={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}],[{text:`こんにちは。`}],[{text:`👍❤️🧑‍🧑‍🧒`}]]}),r=()=>{p.apply(i,`bold`)},s=()=>{p.apply(i,`italic`)},u=()=>{p.apply(i,`underline`)},d=()=>{p.apply(i,`strike`)},p=(0,F.useMemo)(()=>l({doc:t,schema:V,keyboard:[a(`b`,r,{mod:!0}),a(`i`,s,{mod:!0}),a(`u`,u,{mod:!0}),a(`s`,d,{mod:!0})],copy:[h(),c()],paste:[f(),o()],onChange:n}),[]);return(0,F.useEffect)(()=>{if(e.current)return p.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`button`,{onClick:r,children:`bold`}),(0,I.jsx)(`button`,{onClick:s,children:`italic`}),(0,I.jsx)(`button`,{onClick:u,children:`underline`}),(0,I.jsx)(`button`,{onClick:d,children:`strike`})]}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.map((e,t)=>(0,I.jsx)(H,{node:e},t))},t))})]})}},W=D({children:C(C(A([D({type:T(`text`),text:O()}),D({type:T(`tag`),label:O(),value:O()})])))}),G={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[[{type:`text`,text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{type:`text`,text:` world `},{type:`tag`,label:`Orange`,value:`2`}]]}),r=(0,F.useMemo)(()=>l({doc:t,schema:W,plugins:[p()],copy:[h(),c(e=>`text`in e?e.text:e.label)],paste:[f(),o()],onChange:n}),[]);return(0,F.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{children:(0,I.jsx)(`button`,{onClick:()=>{let e=window.prompt(`label`);if(!e)return;let t=window.prompt(`value`);t&&r.apply(d,{type:`tag`,value:t,label:e})},children:`insert`})}),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children[0].map((e,t)=>e.type===`tag`?(0,I.jsx)(`span`,{contentEditable:!1,"data-tag-value":e.value,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t):(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))})]})}},K=D({children:C(C(A([D({type:T(`text`),text:O()}),D({type:T(`image`),src:O()})])))}),q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[[{type:`text`,text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{type:`text`,text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:K,copy:[h(),s(),c()],paste:[f(),u({"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}),m(e=>({type:`text`,text:e}),[e=>{if(e.tagName===`IMG`)return{type:`image`,src:e.src}}]),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.map((e,t)=>e.type===`image`?(0,I.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t):(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))},t))})}},J=D({children:C(C(A([D({type:T(`text`),text:O()}),D({type:T(`video`),src:O()})])))}),Y={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[[{type:`text`,text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{type:`text`,text:` world `}]]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:J,copy:[h(),s(),c()],paste:[f(),m(e=>({type:`text`,text:e}),[e=>{if(e.tagName===`VIDEO`)return{type:`video`,src:e.childNodes[0].src}}]),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.map((e,t)=>e.type===`video`?(0,I.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,I.jsx)(`source`,{src:e.src})},t):(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))},t))})}},X=D({children:C(C(A([D({type:T(`text`),text:O()}),D({type:T(`youtube`),id:O()})])))}),Z=({id:e})=>(0,I.jsx)(`iframe`,{"data-youtube-node":!0,"data-youtube-id":e,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}),Q={render:()=>{let e=(0,F.useRef)(null),[t,n]=(0,F.useState)({children:[[{type:`text`,text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{type:`text`,text:` Youtube`}]]});return(0,F.useEffect)(()=>{if(e.current)return l({doc:t,schema:X,copy:[h(),s(),c()],paste:[f(),m(e=>({type:`text`,text:e}),[e=>{if(e.dataset.youtubeNode)return{type:`youtube`,id:e.dataset.youtubeId}}]),o()],onChange:n}).input(e.current)},[]),(0,I.jsx)(`div`,{children:(0,I.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,I.jsx)(`div`,{children:e.map((e,t)=>e.type===`youtube`?(0,I.jsx)(Z,{id:e.id},t):(0,I.jsx)(`span`,{children:e.text||(0,I.jsx)(`br`,{})},t))},t))})})}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof basicSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [[{
        text: "Hello world."
      }], [{
        text: "こんにちは。"
      }], [{
        text: "👍❤️🧑‍🧑‍🧒"
      }]]
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
        {doc.children.map((r, i) => <div key={i}>
            {r.map((n, j) => <span key={j}>{n.text || <br />}</span>)}
          </div>)}
      </div>;
  }
}`,...z.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof richSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [[{
        text: "Hello",
        bold: true
      }, {
        text: " "
      }, {
        text: "World",
        italic: true
      }, {
        text: "."
      }], [{
        text: "こんにちは。"
      }], [{
        text: "👍❤️🧑‍🧑‍🧒"
      }]]
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
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8
      }}>
          {doc.children.map((r, i) => <div key={i}>
              {r.map((n, j) => <Text key={j} node={n} />)}
            </div>)}
        </div>
      </div>;
  }
}`,...U.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [[{
        type: "text",
        text: "Hello "
      }, {
        type: "tag",
        label: "Apple",
        value: "1"
      }, {
        type: "text",
        text: " world "
      }, {
        type: "tag",
        label: "Orange",
        value: "2"
      }]]
    });
    const editor = useMemo(() => createEditor({
      doc: doc,
      schema: tagSchema,
      plugins: [singlelinePlugin()],
      copy: [internalCopy(), plainCopy<Doc>(node => "text" in node ? node.text : node.label)],
      paste: [internalPaste(), plainPaste()],
      onChange: setDoc
    }), []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div>
        <div>
          <button onClick={() => {
          const label = window.prompt("label");
          if (!label) return;
          const value = window.prompt("value");
          if (!value) return;
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
          {doc.children[0].map((t, j) => t.type === "tag" ? <span key={j} contentEditable={false} data-tag-value={t.value} style={{
          background: "slategray",
          color: "white",
          fontSize: 12,
          padding: 4,
          borderRadius: 8
        }}>
                {t.label}
              </span> : <span key={j}>{t.text || <br />}</span>)}
        </div>
      </div>;
  }
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof imageSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [[{
        type: "text",
        text: "Hello "
      }, {
        type: "image",
        src: "https://loremflickr.com/320/240/cats?lock=1"
      }, {
        type: "text",
        text: " world "
      }, {
        type: "image",
        src: "https://loremflickr.com/320/240/cats?lock=2"
      }]]
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
          type: "text",
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
        {doc.children.map((r, i) => <div key={i}>
            {r.map((t, j) => t.type === "image" ? <img key={j} src={t.src} style={{
          maxWidth: 200
        }} /> : <span key={j}>{t.text || <br />}</span>)}
          </div>)}
      </div>;
  }
}`,...q.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof videoSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [[{
        type: "text",
        text: "Hello "
      }, {
        type: "video",
        src: "https://download.samplelib.com/mp4/sample-5s.mp4"
      }, {
        type: "text",
        text: " world "
      }]]
    });
    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: videoSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [internalPaste(), htmlPaste<Doc>(text => ({
          type: "text",
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
        {doc.children.map((r, i) => <div key={i}>
            {r.map((t, j) => t.type === "video" ?
        // safari needs contentEditable="false"
        <video key={j} width={400} controls contentEditable="false" suppressContentEditableWarning>
                  <source src={t.src} />
                </video> : <span key={j}>{t.text || <br />}</span>)}
          </div>)}
      </div>;
  }
}`,...Y.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof youtubeSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [[{
        type: "text",
        text: "Hello "
      }, {
        type: "youtube",
        id: "IqKz0SfHaqI"
      }, {
        type: "text",
        text: " Youtube"
      }]]
    });
    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: youtubeSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [internalPaste(), htmlPaste<Doc>(text => ({
          type: "text",
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
        {/* <div>
          <button
            onClick={() => {
              // TODO
              editorRef.current?.insert(" [IqKz0SfHaqI]");
            }}
          >
            insert
          </button>
         </div> */}
        <div ref={ref} style={{
        backgroundColor: "white",
        padding: 8
      }}>
          {doc.children.map((r, i) => <div key={i}>
              {r.map((t, j) => t.type === "youtube" ? <Youtube key={j} id={t.id} /> : <span key={j}>{t.text || <br />}</span>)}
            </div>)}
        </div>
      </div>;
  }
}`,...Q.parameters?.docs?.source}}},$=[`Basic`,`RichText`,`Tag`,`Image`,`Video`,`Iframe`]}))();export{z as Basic,Q as Iframe,q as Image,U as RichText,G as Tag,Y as Video,$ as __namedExportsOrder,L as default};