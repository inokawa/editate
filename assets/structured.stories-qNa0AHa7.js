import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-BJHVxNWe.js";import{t as r}from"./jsx-runtime-O9QVJvLM.js";import{A as i,E as a,a as o,d as s,f as c,g as l,h as u,j as d,l as f,t as p,v as m}from"./src-_fxiH3k5.js";import{a as h,c as g,i as _,l as v,n as y,o as b,r as x,s as S,t as C}from"./dist-BU9rxNiL.js";var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W;t((()=>{w=e(n()),p(),x(),T=r(),E={component:m},D=S({children:C(S({children:C(S({text:g()}))}))}),O={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{children:[{text:`Hello world.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=(0,w.useMemo)(()=>{let e=m({doc:t,schema:D}).exec(s).exec(c,{serializers:{text:e=>({text:e})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,w.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{children:e.children.map((e,t)=>(0,T.jsx)(`span`,{children:e.text||(0,T.jsx)(`br`,{})},t))},t))})}},k=S({text:g(),bold:h(y()),italic:h(y()),underline:h(y()),strike:h(y())}),A=S({children:C(S({align:h(b([`left`,`right`])),children:C(k)}))}),j=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,T.jsx)(t,{style:n,children:e.text||(0,T.jsx)(`br`,{})})},M={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=()=>{p.exec(d,`bold`)},a=()=>{p.exec(d,`italic`)},o=()=>{p.exec(d,`underline`)},c=()=>{p.exec(d,`strike`)},l=()=>{p.exec(i,`align`,`right`,void 0)},p=(0,w.useMemo)(()=>{let e=m({doc:t,schema:A}).exec(f,{"Mod+B":r,"Mod+I":a,"Mod+U":o,"Mod+S":c}).exec(s).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,w.useEffect)(()=>{if(e.current)return p.input(e.current)},[]),(0,T.jsxs)(`div`,{children:[(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`button`,{onClick:r,children:`bold`}),(0,T.jsx)(`button`,{onClick:a,children:`italic`}),(0,T.jsx)(`button`,{onClick:o,children:`underline`}),(0,T.jsx)(`button`,{onClick:c,children:`strike`}),(0,T.jsx)(`button`,{onClick:l,children:`align`})]}),(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{style:{textAlign:e.align},children:e.children.map((e,t)=>(0,T.jsx)(j,{node:e},t))},t))})]})}},N=S({children:C(v([S({text:g()}),S({type:_(`tag`),label:g(),value:g()})]))}),P={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,w.useMemo)(()=>{let e=m({doc:t,schema:N}).exec(s).exec(u,{voidToString:e=>e.label}).exec(o);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,w.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,w.useRef)(null),c=(0,w.useRef)(null);return(0,T.jsxs)(`div`,{children:[(0,T.jsxs)(`div`,{children:[(0,T.jsxs)(`label`,{children:[`label:`,(0,T.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,T.jsxs)(`label`,{children:[`value:`,(0,T.jsx)(`input`,{ref:c,defaultValue:`123`})]}),(0,T.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=c.current?.value;!e||!t||r.exec(a,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>`text`in e?(0,T.jsx)(`span`,{children:e.text||(0,T.jsx)(`br`,{})},t):(0,T.jsx)(`span`,{contentEditable:!1,"data-tag-value":e.value,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},F=S({children:C(S({children:C(v([S({text:g()}),S({type:_(`image`),src:g()})]))}))}),I={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]}]}),r=(0,w.useMemo)(()=>{let e=m({doc:t,schema:F}).exec(s).exec(l,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(c,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,w.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,T.jsx)(`span`,{children:e.text||(0,T.jsx)(`br`,{})},t):(0,T.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t))},t))})}},L=S({children:C(S({children:C(v([S({text:g()}),S({type:_(`video`),src:g()})]))}))}),R={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]}]}),r=(0,w.useMemo)(()=>{let e=m({doc:t,schema:L}).exec(s).exec(c,{serializers:{text:e=>({text:e}),video:e=>({type:`video`,src:e.childNodes[0].src})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,w.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,T.jsx)(`span`,{children:e.text||(0,T.jsx)(`br`,{})},t):(0,T.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,T.jsx)(`source`,{src:e.src})},t))},t))})}},z=S({children:C(S({children:C(v([S({text:g()}),S({type:_(`youtube`),id:g()})]))}))}),B=({id:e})=>(0,T.jsx)(`iframe`,{"data-youtube-node":!0,"data-youtube-id":e,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}),V={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,w.useMemo)(()=>{let e=m({doc:t,schema:z}).exec(s).exec(c,{serializers:{text:e=>({text:e}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(u);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,w.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,T.jsx)(`div`,{children:(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,T.jsx)(`span`,{children:e.text||(0,T.jsx)(`br`,{})},t):(0,T.jsx)(B,{id:e.id},t))},t))})})}},H=S({children:C(S({children:C(v([S({text:g()}),S({type:_(`ruby`),ruby:g(),value:g()})]))}))}),U={render:()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,w.useMemo)(()=>{let e=m({doc:t,schema:H}).exec(u,{voidToString:e=>e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,w.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,T.jsx)(`div`,{children:(0,T.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?(0,T.jsx)(`span`,{children:e.text||(0,T.jsx)(`br`,{})},t):(0,T.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,T.jsx)(`rp`,{children:`(`}),(0,T.jsx)(`rt`,{children:e.ruby}),(0,T.jsx)(`rp`,{children:`)`})]},t))},t))})})}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W=[`Basic`,`RichText`,`Tag`,`Image`,`Video`,`Iframe`,`Ruby`]}))();export{O as Basic,V as Iframe,I as Image,M as RichText,U as Ruby,P as Tag,R as Video,W as __namedExportsOrder,E as default};