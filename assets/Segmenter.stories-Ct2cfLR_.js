import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{a as n}from"./iframe-DOi8d-ls.js";import{t as r}from"./jsx-runtime-CR4qI0Ep.js";import{n as i,t as a}from"./src-D1V7JRYA.js";var o,s,c,l,u,d,f;e((()=>{o=t(n()),a(),s=r(),c={component:i},l={width:`300px`,height:`200px`,background:`white`},u=({text:e,segmenter:t})=>{let n=t.segment(e),r=[];for(let{segment:e,index:t,isWordLike:i}of n)r.push((0,s.jsx)(`span`,{style:{background:i?`palegreen`:void 0,outline:`solid 1px green`},children:e},t));return(0,s.jsx)(`div`,{children:e?r:(0,s.jsx)(`br`,{})})},d={render:()=>{let[e,t]=(0,o.useState)(`すもももももももものうち。

吾輩 （ わがはい ） は猫である。名前はまだ無い。`),n=(0,o.useRef)(null);(0,o.useEffect)(()=>{if(n.current)return i({text:e,onChange:t}).input(n.current)},[]);let[r,a]=(0,o.useState)(`ja`),[c,d]=(0,o.useState)(`word`),f=(0,o.useMemo)(()=>Intl?.Segmenter?new Intl.Segmenter(r,{granularity:c}):null,[r,c]);return f?(0,s.jsxs)(`div`,{children:[(0,s.jsxs)(`div`,{children:[(0,s.jsxs)(`select`,{value:r,onChange:e=>a(e.target.value),children:[(0,s.jsx)(`option`,{value:`ja`,children:`ja`}),(0,s.jsx)(`option`,{value:`en`,children:`en`})]}),(0,s.jsxs)(`select`,{value:c,onChange:e=>d(e.target.value),children:[(0,s.jsx)(`option`,{value:`grapheme`,children:`grapheme`}),(0,s.jsx)(`option`,{value:`word`,children:`word`}),(0,s.jsx)(`option`,{value:`sentence`,children:`sentence`})]})]}),(0,s.jsx)(`div`,{ref:n,style:l,children:e.split(`
`).map((e,t)=>(0,s.jsx)(u,{text:e,segmenter:f},t))})]}):(0,s.jsx)(`div`,{children:`Intl.Segmenter is not supported in this browser.`})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    type Granularity = "grapheme" | "word" | "sentence";
    const [text, setText] = useState("すもももももももものうち。\\n\\n吾輩 （ わがはい ） は猫である。名前はまだ無い。");
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text,
        onChange: setText
      }).input(ref.current);
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
          {text.split("\\n").map((t, i) => <Row key={i} text={t} segmenter={segmenter} />)}
        </div>
      </div>;
  }
}`,...d.parameters?.docs?.source}}},f=[`Segmenter`]}))();export{d as Segmenter,f as __namedExportsOrder,c as default};