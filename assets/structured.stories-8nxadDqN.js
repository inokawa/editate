import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-CUR8HPdS.js";import{t as r}from"./jsx-runtime-O9QVJvLM.js";import{A as i,E as a,N as o,a as s,d as c,f as l,g as u,h as d,j as f,l as p,s as m,t as h,v as g}from"./src-B_omEUw4.js";import{a as _,c as v,i as y,l as b,n as x,o as S,r as C,s as w,t as T}from"./dist-BU9rxNiL.js";var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K;t((()=>{E=e(n()),h(),C(),D=r(),O={component:g},k=w({children:T(w({children:T(w({text:v()}))}))}),A={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{children:[{text:`Hello world.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),r=(0,E.useMemo)(()=>{let e=g({doc:t,schema:k}).exec(c).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,E.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,D.jsx)(`div`,{children:e.children.map((e,t)=>(0,D.jsx)(`span`,{children:e.text||(0,D.jsx)(`br`,{})},t))},t))})}},j=w({text:v(),bold:_(x()),italic:_(x()),underline:_(x()),strike:_(x())}),M=w({children:T(w({align:_(S([`left`,`right`])),children:T(j)}))}),N=({node:e})=>{let t=e.bold?`strong`:`span`,n={};return e.italic&&(n.fontStyle=`italic`),e.underline&&(n.textDecoration=`underline`),e.strike&&(n.textDecoration=n.textDecoration?`${n.textDecoration} line-through`:`line-through`),(0,D.jsx)(t,{style:n,children:e.text||(0,D.jsx)(`br`,{})})},P={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{children:[{text:`Hello`,bold:!0},{text:` `},{text:`World`,italic:!0},{text:`.`}]},{children:[{text:`こんにちは。`}]},{children:[{text:`👍❤️🧑‍🧑‍🧒`}]}]}),[r,a]=(0,E.useState)(null),[s,l]=(0,E.useState)(!1),[u,h]=(0,E.useState)(!1),[_,v]=(0,E.useState)(!1),[y,b]=(0,E.useState)(!1),x=()=>{O.exec(f,`bold`)},S=()=>{O.exec(f,`italic`)},C=()=>{O.exec(f,`underline`)},w=()=>{O.exec(f,`strike`)},T=()=>{O.exec(i,`align`,`right`,void 0)},O=(0,E.useMemo)(()=>{let e=()=>{let e=!1,t=!1,n=!1,r=!1;for(let i of O.exec(o))i.bold&&(e=!0),i.italic&&(t=!0),i.underline&&(n=!0),i.strike&&(r=!0);l(e),h(t),v(n),b(r)},r=g({doc:t,schema:M}).exec(p,{"Mod+B":x,"Mod+I":S,"Mod+U":C,"Mod+S":w}).exec(m,e=>{O.selection[0]===O.selection[1]?a(null):a(t=>{let n=e();return t&&t.top===n.top&&t.left===n.left?t:{top:n.top,left:n.left}})}).exec(c).exec(d);return r.on(`change`,()=>{n(r.doc),e()}),r.on(`selectionchange`,()=>{e()}),r},[]);return(0,E.useEffect)(()=>{if(e.current)return O.input(e.current)},[]),(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4,padding:4},children:[(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`button`,{style:{fontWeight:s?`bold`:void 0},onClick:x,children:`bold`}),(0,D.jsx)(`button`,{style:{fontWeight:u?`bold`:void 0},onClick:S,children:`italic`}),(0,D.jsx)(`button`,{style:{fontWeight:_?`bold`:void 0},onClick:C,children:`underline`}),(0,D.jsx)(`button`,{style:{fontWeight:y?`bold`:void 0},onClick:w,children:`strike`})]}),(0,D.jsx)(`div`,{children:(0,D.jsx)(`button`,{onClick:T,children:`align`})})]}),(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.children.map((e,t)=>(0,D.jsx)(`div`,{style:{textAlign:e.align},children:e.children.map((e,t)=>(0,D.jsx)(N,{node:e},t))},t))}),r?(0,D.jsxs)(`div`,{style:{position:`fixed`,top:r.top-30,left:r.left,whiteSpace:`nowrap`},children:[(0,D.jsx)(`button`,{style:{fontWeight:s?`bold`:void 0},onClick:x,children:`bold`}),(0,D.jsx)(`button`,{style:{fontWeight:u?`bold`:void 0},onClick:S,children:`italic`}),(0,D.jsx)(`button`,{style:{fontWeight:_?`bold`:void 0},onClick:C,children:`underline`}),(0,D.jsx)(`button`,{style:{fontWeight:y?`bold`:void 0},onClick:w,children:`strike`})]}):null]})}},F=w({children:T(b([w({text:v()}),w({type:y(`tag`),label:v(),value:v()})]))}),I={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{text:`Hello `},{type:`tag`,label:`Apple`,value:`1`},{text:` world `},{type:`tag`,label:`Orange`,value:`2`}]}),r=(0,E.useMemo)(()=>{let e=g({doc:t,schema:F}).exec(c).exec(d,{voidToString:e=>e.label}).exec(s);return e.on(`change`,()=>{n(r.doc)}),e},[]);(0,E.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let i=(0,E.useRef)(null),o=(0,E.useRef)(null);return(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`label`,{children:[`label:`,(0,D.jsx)(`input`,{ref:i,defaultValue:`Grape`})]}),(0,D.jsxs)(`label`,{children:[`value:`,(0,D.jsx)(`input`,{ref:o,defaultValue:`123`})]}),(0,D.jsx)(`button`,{onClick:()=>{let e=i.current?.value,t=o.current?.value;!e||!t||r.exec(a,{type:`tag`,value:t,label:e})},children:`insert`})]}),(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>`text`in e?e.text||(0,D.jsx)(`br`,{}):(0,D.jsx)(`span`,{contentEditable:!1,style:{background:`slategray`,color:`white`,fontSize:12,padding:4,borderRadius:8},children:e.label},t))})]})}},L=w({children:T(w({children:T(b([w({text:v()}),w({type:y(`image`),src:v()})]))}))}),R={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{children:[{text:`Hello `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=1`},{text:` world `},{type:`image`,src:`https://loremflickr.com/320/240/cats?lock=2`}]}]}),r=(0,E.useMemo)(()=>{let e=g({doc:t,schema:L}).exec(c).exec(u,{"image/png":e=>({type:`image`,src:URL.createObjectURL(e)})}).exec(l,{serializers:{text:e=>({text:e}),img:e=>({type:`image`,src:e.src})}}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,E.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,D.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,D.jsx)(`br`,{}):(0,D.jsx)(`img`,{src:e.src,style:{maxWidth:200}},t))},t))})}},z=w({children:T(w({children:T(b([w({text:v()}),w({type:y(`video`),src:v()})]))}))}),B={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{children:[{text:`Hello `},{type:`video`,src:`https://download.samplelib.com/mp4/sample-5s.mp4`},{text:` world `}]}]}),r=(0,E.useMemo)(()=>{let e=g({doc:t,schema:z}).exec(c).exec(l,{serializers:{text:e=>({text:e}),video:e=>({type:`video`,src:e.childNodes[0].src})}}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,E.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,D.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,D.jsx)(`br`,{}):(0,D.jsx)(`video`,{width:400,controls:!0,contentEditable:`false`,suppressContentEditableWarning:!0,children:(0,D.jsx)(`source`,{src:e.src})},t))},t))})}},V=w({children:T(w({children:T(b([w({text:v()}),w({type:y(`youtube`),id:v()})]))}))}),H=({id:e})=>(0,D.jsx)(`iframe`,{"data-youtube-id":e,width:`560`,height:`315`,src:`https://www.youtube.com/embed/`+e,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}),U={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{children:[{text:`Hello `},{type:`youtube`,id:`IqKz0SfHaqI`},{text:` Youtube`}]}]}),r=(0,E.useMemo)(()=>{let e=g({doc:t,schema:V}).exec(c).exec(l,{serializers:{text:e=>({text:e}),iframe:e=>({type:`youtube`,id:e.dataset.youtubeId})}}).exec(d);return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,E.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,D.jsx)(`div`,{children:(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,D.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,D.jsx)(`br`,{}):(0,D.jsx)(H,{id:e.id},t))},t))})})}},W=w({children:T(w({children:T(b([w({text:v()}),w({type:y(`ruby`),ruby:v(),value:v()})]))}))}),G={render:()=>{let e=(0,E.useRef)(null),[t,n]=(0,E.useState)({children:[{children:[{text:`また`},{type:`ruby`,ruby:`あした`,value:`明日`},{text:`お`},{type:`ruby`,ruby:`あ`,value:`会`},{text:`いしましょう。`}]}]}),r=(0,E.useMemo)(()=>{let e=g({doc:t,schema:W}).exec(d,{voidToString:e=>e.value});return e.on(`change`,()=>{n(e.doc)}),e},[]);return(0,E.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,D.jsx)(`div`,{children:(0,D.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,padding:8},children:t.children.map((e,t)=>(0,D.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,D.jsx)(`br`,{}):(0,D.jsxs)(`ruby`,{contentEditable:!1,children:[e.value,(0,D.jsx)(`rp`,{children:`(`}),(0,D.jsx)(`rt`,{children:e.ruby}),(0,D.jsx)(`rp`,{children:`)`})]},t))},t))})})}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
            {b.children.map((t, j) => "text" in t ? t.text || <br /> : <img key={j} src={t.src} style={{
          maxWidth: 200
        }} />)}
          </div>)}
      </div>;
  }
}`,...R.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
            {b.children.map((t, j) => "text" in t ? t.text || <br /> :
        // safari needs contentEditable="false"
        <video key={j} width={400} controls contentEditable="false" suppressContentEditableWarning>
                  <source src={t.src} />
                </video>)}
          </div>)}
      </div>;
  }
}`,...B.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
              {b.children.map((t, j) => "text" in t ? t.text || <br /> : <Youtube key={j} id={t.id} />)}
            </div>)}
        </div>
      </div>;
  }
}`,...U.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},K=[`Basic`,`RichText`,`Tag`,`Image`,`Video`,`Iframe`,`Ruby`]}))();export{A as Basic,U as Iframe,R as Image,P as RichText,G as Ruby,I as Tag,B as Video,K as __namedExportsOrder,O as default};