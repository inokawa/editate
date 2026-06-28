import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-Cy4AdFq-.js";import{t as r}from"./jsx-runtime-O9QVJvLM.js";import{C as i,T as a,b as o,n as s,t as c,v as l,x as u,y as d}from"./src-BuDUmYzf.js";var f,p,m,h,g,_,v,y,b,x,S,C,w,T;t((()=>{f=e(n()),c(),p=r(),m={component:s},h={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(``);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,onChange:n}).input(e.current)},[]),(0,p.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`div`,{children:e||(0,p.jsx)(`br`,{})},t))})}},g={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`Hello world.
こんにちは。
👍❤️🧑‍🧑‍🧒`);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,onChange:n}).input(e.current)},[]),(0,p.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`div`,{children:e||(0,p.jsx)(`br`,{})},t))})}},_={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`Hello world.`);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,singleline:!0,onChange:n}).input(e.current)},[]),(0,p.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t||(0,p.jsx)(`br`,{})})}},v={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`Hello world.`),r=(0,f.useMemo)(()=>s({text:t,singleline:!0,onChange:n}),[]),[i,a]=(0,f.useState)(r.readonly);return(0,f.useEffect)(()=>{if(!e.current)return;let t=r.input(e.current),n=r.on(`readonly`,()=>{a(r.readonly)});return()=>{t(),n()}},[]),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`div`,{children:(0,p.jsx)(`button`,{onClick:()=>{r.readonly=!i},children:i?`editable`:`readonly`})}),(0,p.jsx)(`div`,{ref:e,style:{background:`white`,color:i?`gray`:void 0},children:t||(0,p.jsx)(`br`,{})})]})}},y={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(``);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,singleline:!0,onChange:n}).input(e.current)},[]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},"aria-placeholder":`Enter some text...`,children:t}),(0,p.jsx)(`style`,{children:`
[contenteditable]:empty:before {
  content: attr(aria-placeholder) / "";
  pointer-events: none;
  color: gray;
}
`})]})}},b={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`),[r,i]=(0,f.useState)(`dolor`);(0,f.useEffect)(()=>{if(e.current)return s({text:t,onChange:n}).input(e.current)},[]);let a=r?RegExp(`(${r})`):null;return(0,p.jsxs)(`div`,{children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`label`,{htmlFor:`search`,children:`search word`}),(0,p.jsx)(`input`,{name:`search`,value:r,onChange:e=>i(e.target.value)})]}),(0,p.jsx)(`div`,{ref:e,style:{background:`white`},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`div`,{children:e?(a?e.split(a):[e]).map((e,t)=>e===r?(0,p.jsx)(`mark`,{children:e},t):(0,p.jsx)(`span`,{children:e},t)):(0,p.jsx)(`br`,{})},t))})]})}},x={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`Hello world.
こんにちは。
👍❤️🧑‍🧑‍🧒`),r=(0,f.useMemo)(()=>s({text:t,onChange:n}),[]);(0,f.useEffect)(()=>{if(e.current)return r.input(e.current)},[]);let[c,m]=(0,f.useState)(`text`);return(0,p.jsxs)(`div`,{children:[(0,p.jsxs)(`div`,{style:{padding:4,display:`flex`,flexDirection:`column`,gap:4},children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`input`,{value:c,onChange:e=>{m(e.target.value)}}),(0,p.jsx)(`button`,{onClick:()=>{r.exec(a,c)},children:`insert`})]}),(0,p.jsx)(`div`,{children:(0,p.jsx)(`button`,{onClick:()=>{r.exec(i)},children:`delete selection`})}),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`move`,`forward`,`character`),e.current?.focus()},children:`move forward`}),(0,p.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`move`,`backward`,`character`),e.current?.focus()},children:`move backward`}),(0,p.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`extend`,`forward`,`character`),e.current?.focus()},children:`move focus forward`}),(0,p.jsx)(`button`,{onClick:()=>{document.getSelection()?.modify(`extend`,`backward`,`character`),e.current?.focus()},children:`move focus backward`})]}),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`button`,{disabled:!r.exec(u),onClick:()=>{r.exec(o)},children:`undo`}),(0,p.jsx)(`button`,{disabled:!r.exec(d),onClick:()=>{r.exec(l)},children:`redo`})]})]}),(0,p.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`div`,{children:e||(0,p.jsx)(`br`,{})},t))})]})}},S={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`Hello world.
こんにちは。
👍❤️🧑‍🧑‍🧒`);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,isBlock:e=>!!e.dataset.line,onChange:n}).input(e.current)},[]),(0,p.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`span`,{"data-line":!0,style:{display:`block`},children:e||(0,p.jsx)(`br`,{})},t))})}},C={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`אחד !
two !
שְׁלוֹשָׁה !`);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,onChange:n}).input(e.current)},[]),(0,p.jsx)(`div`,{ref:e,style:{direction:`rtl`,background:`white`},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`div`,{children:e||(0,p.jsx)(`br`,{})},t))})}},w={render:()=>{let e=(0,f.useRef)(null),[t,n]=(0,f.useState)(`春は、あけぼの。やうやうしろくなりゆく山ぎは、すこし明かりて、紫だちたる雲の、細くたなびきたる。
夏は、夜。月のころはさらなり。闇もなほ、蛍の多く飛びちがひたる。また、ただ一つ二つなど、ほのかにうち光りて行くも、をかし。雨など降るも、をかし。
秋は、夕暮。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛びいそぐさへあはれなり。まいて、雁などのつらねたるが、いと小さく見ゆるは、いとをかし。日入りはてて、風の音、虫の音など、はた、言ふべきにあらず。
冬は、つとめて。雪の降りたるは、言ふべきにもあらず。霜のいと白きも。またさらでも、いと寒きに、火など急ぎおこして、炭持てわたるも、いとつきづきし。昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。`);return(0,f.useEffect)(()=>{if(e.current)return s({text:t,onChange:n}).input(e.current)},[]),(0,p.jsx)(`div`,{ref:e,style:{writingMode:`vertical-rl`,background:`white`,height:400},children:t.split(`
`).map((e,t)=>(0,p.jsx)(`div`,{children:e||(0,p.jsx)(`br`,{})},t))})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(\`Hello world.\`);
    const editor = useMemo(() => createPlainEditor({
      text: text,
      singleline: true,
      onChange: setText
    }), []);
    const [readonly, setReadonly] = useState(editor.readonly);
    useEffect(() => {
      if (!ref.current) return;
      const cleanupInput = editor.input(ref.current);
      const cleanupOnReadonly = editor.on("readonly", () => {
        setReadonly(editor.readonly);
      });
      return () => {
        cleanupInput();
        cleanupOnReadonly();
      };
    }, []);
    return <div>
        <div>
          <button onClick={() => {
          editor.readonly = !readonly;
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
        padding: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }}>
          <div>
            <input value={insertText} onChange={e => {
            setInsertText(e.target.value);
          }} />
            <button onClick={() => {
            editor.exec(InsertText, insertText);
          }}>
              insert
            </button>
          </div>
          <div>
            <button onClick={() => {
            editor.exec(Delete);
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
          <div>
            <button disabled={!editor.exec(Undoable)} onClick={() => {
            editor.exec(Undo);
          }}>
              undo
            </button>
            <button disabled={!editor.exec(Redoable)} onClick={() => {
            editor.exec(Redo);
          }}>
              redo
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T=[`Empty`,`Multiline`,`Singleline`,`Readonly`,`Placeholder`,`Highlight`,`Command`,`SpanAsBlock`,`Rtl`,`Vertical`]}))();export{x as Command,h as Empty,b as Highlight,g as Multiline,y as Placeholder,v as Readonly,C as Rtl,_ as Singleline,S as SpanAsBlock,w as Vertical,T as __namedExportsOrder,m as default};