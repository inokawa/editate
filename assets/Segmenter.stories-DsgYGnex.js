import{n as e,o as t}from"./rolldown-runtime-BCiCTKAo.js";import{f as n}from"./iframe-DUaYTx_q.js";import{t as r}from"./jsx-runtime-BB9-612F.js";import{n as i,r as a,t as o}from"./nodeId-5DH28Pl7.js";import{n as s,t as c}from"./plain-Csdo-XZj.js";var l,u,d,f,p,m,h;function g(){return(g=e((()=>{l=t(n()),s(),i(),u=r(),d={component:c},f={width:`300px`,height:`200px`,background:`white`},p=({text:e,segmenter:t})=>{let n=t.segment(e),r=[];for(let{segment:e,index:t,isWordLike:i}of n)r.push((0,u.jsx)(`span`,{style:{background:i?`palegreen`:void 0,outline:`solid 1px green`},children:e},t));return(0,u.jsx)(`div`,{children:e?r:(0,u.jsx)(`br`,{})})},m={render:()=>{let[e,t]=(0,l.useState)(`すもももももももものうち。

吾輩 （ わがはい ） は猫である。名前はまだ無い。`),n=(0,l.useMemo)(()=>c({text:e,onChange:t}).exec(a),[]),[r,i]=(0,l.useState)(()=>n.doc);(0,l.useEffect)(()=>n.on(`change`,()=>i(n.doc)),[]);let s=(0,l.useRef)(null);(0,l.useEffect)(()=>{if(s.current)return n.input(s.current)},[]);let[d,m]=(0,l.useState)(`ja`),[h,g]=(0,l.useState)(`word`),_=(0,l.useMemo)(()=>Intl?.Segmenter?new Intl.Segmenter(d,{granularity:h}):null,[d,h]);return _?(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`select`,{value:d,onChange:e=>m(e.target.value),children:[(0,u.jsx)(`option`,{value:`ja`,children:`ja`}),(0,u.jsx)(`option`,{value:`en`,children:`en`})]}),(0,u.jsxs)(`select`,{value:h,onChange:e=>g(e.target.value),children:[(0,u.jsx)(`option`,{value:`grapheme`,children:`grapheme`}),(0,u.jsx)(`option`,{value:`word`,children:`word`}),(0,u.jsx)(`option`,{value:`sentence`,children:`sentence`})]})]}),(0,u.jsx)(`div`,{ref:s,style:f,children:e.split(`
`).map((e,t)=>(0,u.jsx)(p,{text:e,segmenter:_},o(n,r.children[t])))})]}):(0,u.jsx)(`div`,{children:`Intl.Segmenter is not supported in this browser.`})}},h=[`Segmenter`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    type Granularity = "grapheme" | "word" | "sentence";
    const [text, setText] = useState("すもももももももものうち。\\n\\n吾輩 （ わがはい ） は猫である。名前はまだ無い。");
    const editor = useMemo(() => createPlainEditor({
      text,
      onChange: setText
    }).exec(nodeIdPlugin), []);
    // the lines are keyed by node id, so the doc is needed in addition to the text
    const [doc, setDoc] = useState(() => editor.doc);
    useEffect(() => editor.on("change", () => setDoc(editor.doc)), []);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    const [locale, setLocale] = useState("ja");
    const [granularity, setGranularity] = useState<Granularity>("word");
    const segmenter = useMemo(() => {
      if (!Intl?.Segmenter) {
        return null;
      }
      return new Intl.Segmenter(locale, {
        granularity
      });
    }, [locale, granularity]);
    if (!segmenter) {
      return <div>{"Intl.Segmenter is not supported in this browser."}</div>;
    }
    return <div>
        <div>
          <select value={locale} onChange={e => setLocale(e.target.value)}>
            <option value={"ja"}>ja</option>
            <option value={"en"}>en</option>
          </select>
          <select value={granularity} onChange={e => setGranularity(e.target.value as Granularity)}>
            <option value={"grapheme"}>grapheme</option>
            <option value={"word"}>word</option>
            <option value={"sentence"}>sentence</option>
          </select>
        </div>
        <div ref={ref} style={style}>
          {text.split("\\n").map((t, i) => <Row key={NodeId(editor, doc.children[i]!)} text={t} segmenter={segmenter} />)}
        </div>
      </div>;
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Segmenter,h as __namedExportsOrder,d as default};