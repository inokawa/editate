import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{a as n}from"./iframe-DOi8d-ls.js";import{t as r}from"./jsx-runtime-CR4qI0Ep.js";import{h as i,n as a,p as o,t as s}from"./src-D1V7JRYA.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{c=t(n()),s(),l=r(),u={component:a},d={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(``);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e||(0,l.jsx)(`br`,{})},t))})}},f={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`Hello world.
こんにちは。
👍❤️🧑‍🧑‍🧒`);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e||(0,l.jsx)(`br`,{})},t))})}},p={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`Hello world.`);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,singleline:!0,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t||(0,l.jsx)(`br`,{})})}},m={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`Hello world.`),r=(0,c.useMemo)(()=>a({text:t,singleline:!0,onChange:n}),[]),[i,o]=(0,c.useState)(!1);return(0,c.useEffect)(()=>{if(e.current)return r.input(e.current)},[]),(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`div`,{children:(0,l.jsx)(`button`,{onClick:()=>{let e=!i;r.readonly=e,o(e)},children:i?`editable`:`readonly`})}),(0,l.jsx)(`div`,{ref:e,style:{background:`white`,color:i?`gray`:void 0},children:t||(0,l.jsx)(`br`,{})})]})}},h={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(``);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,singleline:!0,onChange:n}).input(e.current)},[]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},"aria-placeholder":`Enter some text...`,children:t}),(0,l.jsx)(`style`,{children:`
[contenteditable]:empty:before {
  content: attr(aria-placeholder) / "";
  pointer-events: none;
  color: gray;
}
`})]})}},g={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`),[r,i]=(0,c.useState)(`dolor`);(0,c.useEffect)(()=>{if(e.current)return a({text:t,onChange:n}).input(e.current)},[]);let o=r?RegExp(`(${r})`):null;return(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`label`,{htmlFor:`search`,children:`search word`}),(0,l.jsx)(`input`,{name:`search`,value:r,onChange:e=>i(e.target.value)})]}),(0,l.jsx)(`div`,{ref:e,style:{background:`white`},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e?(o?e.split(o):[e]).map((e,t)=>e===r?(0,l.jsx)(`mark`,{children:e},t):(0,l.jsx)(`span`,{children:e},t)):(0,l.jsx)(`br`,{})},t))})]})}},_={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`Hello world.
こんにちは。
👍❤️🧑‍🧑‍🧒`),r=(0,c.useMemo)(()=>a({text:t,onChange:n}),[]);(0,c.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let[s,u]=(0,c.useState)(`text`);return(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`div`,{style:{padding:4},children:[(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`input`,{value:s,onChange:e=>{u(e.target.value)}}),(0,l.jsx)(`button`,{onClick:()=>{r.apply(i,s)},children:`insert`})]}),(0,l.jsx)(`div`,{children:(0,l.jsx)(`button`,{onClick:()=>{r.apply(o)},children:`delete selection`})}),(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`move`,`forward`,`character`),e.current?.focus()},children:`move forward`}),(0,l.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`move`,`backward`,`character`),e.current?.focus()},children:`move backward`}),(0,l.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`extend`,`forward`,`character`),e.current?.focus()},children:`move focus forward`}),(0,l.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`extend`,`backward`,`character`),e.current?.focus()},children:`move focus backward`})]})]}),(0,l.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e||(0,l.jsx)(`br`,{})},t))})]})}},v={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`Hello world.
こんにちは。
👍❤️🧑‍🧑‍🧒`);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,isBlock:e=>!!e.dataset.line,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`span`,{"data-line":!0,style:{display:`block`},children:e||(0,l.jsx)(`br`,{})},t))})}},y={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`אחד !
two !
שְׁלוֹשָׁה !`);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{direction:`rtl`,background:`white`},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e||(0,l.jsx)(`br`,{})},t))})}},b={render:()=>{let e=(0,c.useRef)(null),[t,n]=(0,c.useState)(`春は、あけぼの。やうやうしろくなりゆく山ぎは、すこし明かりて、紫だちたる雲の、細くたなびきたる。
夏は、夜。月のころはさらなり。闇もなほ、蛍の多く飛びちがひたる。また、ただ一つ二つなど、ほのかにうち光りて行くも、をかし。雨など降るも、をかし。
秋は、夕暮。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛びいそぐさへあはれなり。まいて、雁などのつらねたるが、いと小さく見ゆるは、いとをかし。日入りはてて、風の音、虫の音など、はた、言ふべきにあらず。
冬は、つとめて。雪の降りたるは、言ふべきにもあらず。霜のいと白きも。またさらでも、いと寒きに、火など急ぎおこして、炭持てわたるも、いとつきづきし。昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。`);return(0,c.useEffect)(()=>{if(e.current)return a({text:t,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{writingMode:`vertical-rl`,background:`white`,height:400},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e||(0,l.jsx)(`br`,{})},t))})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <div ref={ref} style={{
      backgroundColor: "white",
      border: "solid 1px darkgray",
      padding: 8
    }}>
        {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
      </div>;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.\\nこんにちは。\\n👍❤️🧑‍🧑‍🧒");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <div ref={ref} style={{
      backgroundColor: "white",
      border: "solid 1px darkgray",
      padding: 8
    }}>
        {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
      </div>;
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        singleline: true,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <div ref={ref} style={{
      backgroundColor: "white",
      border: "solid 1px darkgray",
      padding: 8
    }}>
        {text ? text : <br />}
      </div>;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(\`Hello world.\`);
    const editor = useMemo(() => createPlainEditor({
      text: text,
      singleline: true,
      onChange: setText
    }), []);
    const [readonly, setReadonly] = useState(false);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    return <div>
        <div>
          <button onClick={() => {
          const text = !readonly;
          editor.readonly = text;
          setReadonly(text);
        }}>
            {readonly ? "editable" : "readonly"}
          </button>
        </div>
        <div ref={ref} style={{
        background: "white",
        color: readonly ? "gray" : undefined
      }}>
          {text ? text : <br />}
        </div>
      </div>;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        singleline: true,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8
      }} aria-placeholder="Enter some text...">
          {text}
        </div>
        <style>{\`
[contenteditable]:empty:before {
  content: attr(aria-placeholder) / "";
  pointer-events: none;
  color: gray;
}
\`}</style>
      </>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
    const [searchText, setSearchText] = useState("dolor");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText
      }).input(ref.current);
    }, []);
    const reg = searchText ? new RegExp(\`(\${searchText})\`) : null;
    return <div>
        <div>
          <label htmlFor="search">search word</label>
          <input name="search" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </div>
        <div ref={ref} style={{
        background: "white"
      }}>
          {text.split("\\n").map((r, i) => <div key={i}>
              {r ? (reg ? r.split(reg) : [r]).map((t, j) => t === searchText ? <mark key={j}>{t}</mark> : <span key={j}>{t}</span>) : <br />}
            </div>)}
        </div>
      </div>;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.\\nこんにちは。\\n👍❤️🧑‍🧑‍🧒");
    const editor = useMemo(() => createPlainEditor({
      text: text,
      onChange: setText
    }), []);
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);
    const [insertText, setInsertText] = useState("text");
    return <div>
        <div style={{
        padding: 4
      }}>
          <div>
            <input value={insertText} onChange={e => {
            setInsertText(e.target.value);
          }} />
            <button onClick={() => {
            editor.apply(InsertText, insertText);
          }}>
              insert
            </button>
          </div>
          <div>
            <button onClick={() => {
            editor.apply(Delete);
          }}>
              delete selection
            </button>
          </div>
          <div>
            <button onClick={() => {
            document.getSelection()?.modify("move", "forward", "character");
            ref.current?.focus();
          }}>
              move forward
            </button>
            <button onClick={() => {
            document.getSelection()?.modify("move", "backward", "character");
            ref.current?.focus();
          }}>
              move backward
            </button>
            <button onClick={() => {
            document.getSelection()?.modify("extend", "forward", "character");
            ref.current?.focus();
          }}>
              move focus forward
            </button>
            <button onClick={() => {
            document.getSelection()?.modify("extend", "backward", "character");
            ref.current?.focus();
          }}>
              move focus backward
            </button>
          </div>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8
      }}>
          {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
        </div>
      </div>;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.\\nこんにちは。\\n👍❤️🧑‍🧑‍🧒");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        isBlock: node => !!node.dataset.line,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <div ref={ref} style={{
      backgroundColor: "white",
      border: "solid 1px darkgray",
      padding: 8
    }}>
        {text.split("\\n").map((r, i) => <span key={i} data-line style={{
        display: "block"
      }}>
            {r ? r : <br />}
          </span>)}
      </div>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(\`אחד !
two !
שְׁלוֹשָׁה !\`);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <div ref={ref} style={{
      direction: "rtl",
      background: "white"
    }}>
        {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
      </div>;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(\`春は、あけぼの。やうやうしろくなりゆく山ぎは、すこし明かりて、紫だちたる雲の、細くたなびきたる。
夏は、夜。月のころはさらなり。闇もなほ、蛍の多く飛びちがひたる。また、ただ一つ二つなど、ほのかにうち光りて行くも、をかし。雨など降るも、をかし。
秋は、夕暮。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛びいそぐさへあはれなり。まいて、雁などのつらねたるが、いと小さく見ゆるは、いとをかし。日入りはてて、風の音、虫の音など、はた、言ふべきにあらず。
冬は、つとめて。雪の降りたるは、言ふべきにもあらず。霜のいと白きも。またさらでも、いと寒きに、火など急ぎおこして、炭持てわたるも、いとつきづきし。昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。\`);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText
      }).input(ref.current);
    }, []);
    return <div ref={ref} style={{
      writingMode: "vertical-rl",
      background: "white",
      height: 400
    }}>
        {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
      </div>;
  }
}`,...b.parameters?.docs?.source}}},x=[`Empty`,`Multiline`,`Singleline`,`Readonly`,`Placeholder`,`Highlight`,`Command`,`SpanAsBlock`,`Rtl`,`Vertical`]}))();export{_ as Command,d as Empty,g as Highlight,f as Multiline,h as Placeholder,m as Readonly,y as Rtl,p as Singleline,v as SpanAsBlock,b as Vertical,x as __namedExportsOrder,u as default};