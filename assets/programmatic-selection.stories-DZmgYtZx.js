import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-STymeUI6.js";import{t as r}from"./jsx-runtime-O9QVJvLM.js";import{n as i,t as a}from"./src-Bxfip7vG.js";var o,s,c,l,u;t((()=>{o=e(n()),a(),s=r(),c={component:i},l={render:()=>{let e=(0,o.useRef)(null),t=(0,o.useRef)(null),[n,r]=(0,o.useState)(`Hello world`),[a,c]=(0,o.useState)([0,0]),[l,u]=(0,o.useState)(`none`),d=()=>{let t=e.current,n=document.getSelection();if(!t||!n||!n.focusNode||!t.contains(n.focusNode)){u(`none`);return}let r=document.createRange();r.selectNodeContents(t);try{r.setEnd(n.focusNode,n.focusOffset),u(String(r.toString().length))}catch{u(`?`)}};(0,o.useEffect)(()=>{if(!e.current)return;let a=i({text:n,onChange:r});t.current=a;let o=a.on(`selectionchange`,()=>c(a.selection)),s=()=>d();document.addEventListener(`selectionchange`,s);let l=a.input(e.current);return()=>{o(),document.removeEventListener(`selectionchange`,s),l()}},[]);let f=(n,r=n)=>{e.current?.focus(),t.current.selection=[n,r],requestAnimationFrame(d)},p=a[0]===a[1]&&l!==`none`&&l!==String(a[0]);return(0,s.jsxs)(`div`,{style:{fontFamily:`sans-serif`,maxWidth:600},children:[(0,s.jsxs)(`p`,{children:[`Click a button: the `,(0,s.jsx)(`b`,{children:`model`}),` updates, but the `,(0,s.jsx)(`b`,{children:`DOM caret`}),` `,`doesn't move.`]}),(0,s.jsxs)(`div`,{style:{display:`flex`,gap:8,marginBottom:8},children:[(0,s.jsx)(`button`,{"data-testid":`set-3`,onClick:()=>f(3),children:`set selection → [3, 3]`}),(0,s.jsx)(`button`,{"data-testid":`set-0-5`,onClick:()=>f(0,5),children:`set selection → [0, 5]`}),(0,s.jsx)(`button`,{"data-testid":`set-end`,onClick:()=>f(n.length),children:`set selection → end`})]}),(0,s.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8,minHeight:48,fontSize:20},children:n.split(`
`).map((e,t)=>(0,s.jsx)(`div`,{children:e||(0,s.jsx)(`br`,{})},t))}),(0,s.jsxs)(`pre`,{style:{fontSize:14},children:[`model selection:`,` `,(0,s.jsx)(`span`,{"data-testid":`model`,children:JSON.stringify(a)}),`
`,`DOM caret: `,(0,s.jsx)(`span`,{"data-testid":`dom-caret`,children:l}),`
`,`
`,(0,s.jsx)(`b`,{children:p?`❌ model and DOM caret diverge — bug reproduced`:``})]})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const editorRef = useRef<ReturnType<typeof createPlainEditor>>(null);
    const [text, setText] = useState("Hello world");
    const [model, setModel] = useState<readonly [number, number]>([0, 0]);
    const [domCaret, setDomCaret] = useState<string>("none");

    // Map a DOM (node, offset) to a global plain-text offset within the host.
    const readDomCaret = () => {
      const host = ref.current;
      const s = document.getSelection();
      if (!host || !s || !s.focusNode || !host.contains(s.focusNode)) {
        setDomCaret("none");
        return;
      }
      const r = document.createRange();
      r.selectNodeContents(host);
      try {
        r.setEnd(s.focusNode, s.focusOffset);
        setDomCaret(String(r.toString().length));
      } catch {
        setDomCaret("?");
      }
    };
    useEffect(() => {
      if (!ref.current) return;
      const editor = createPlainEditor({
        text,
        onChange: setText
      });
      editorRef.current = editor;
      const offSel = editor.on("selectionchange", () => setModel(editor.selection));
      const onDomSel = () => readDomCaret();
      document.addEventListener("selectionchange", onDomSel);
      const cleanup = editor.input(ref.current);
      return () => {
        offSel();
        document.removeEventListener("selectionchange", onDomSel);
        cleanup();
      };
    }, []);
    const set = (start: number, end = start) => {
      ref.current?.focus();
      editorRef.current!.selection = [start, end];
      requestAnimationFrame(readDomCaret);
    };
    const collapsed = model[0] === model[1];
    const diverged = collapsed && domCaret !== "none" && domCaret !== String(model[0]);
    return <div style={{
      fontFamily: "sans-serif",
      maxWidth: 600
    }}>
        <p>
          Click a button: the <b>model</b> updates, but the <b>DOM caret</b>{" "}
          doesn&apos;t move.
        </p>
        <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 8
      }}>
          <button data-testid="set-3" onClick={() => set(3)}>
            set selection → [3, 3]
          </button>
          <button data-testid="set-0-5" onClick={() => set(0, 5)}>
            set selection → [0, 5]
          </button>
          <button data-testid="set-end" onClick={() => set(text.length)}>
            set selection → end
          </button>
        </div>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8,
        minHeight: 48,
        fontSize: 20
      }}>
          {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
        </div>
        <pre style={{
        fontSize: 14
      }}>
          model selection:{" "}
          <span data-testid="model">{JSON.stringify(model)}</span>
          {"\\n"}DOM caret: <span data-testid="dom-caret">{domCaret}</span>
          {"\\n"}
          {"\\n"}
          <b>
            {diverged ? "❌ model and DOM caret diverge — bug reproduced" : ""}
          </b>
        </pre>
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`Repro: \`editor.selection = …\` updates the model but not the DOM caret.

The public selection setter runs \`updateSelection\` (model + a \`selectionchange\`
event) but never \`setSelectionToDOM\` — that only fires from the MutationObserver
and \`flushInput\` paths. So a programmatic selection never moves the visible
caret; editate re-syncs its model back from the DOM on the next real
selectionchange, silently discarding the programmatic value.

Not iOS-specific — reproduces in every browser. Click a button and compare the
"model" readout (updates) to the "DOM caret" readout (doesn't move).`,...l.parameters?.docs?.description}}},u=[`Repro`]}))();export{l as Repro,u as __namedExportsOrder,c as default};