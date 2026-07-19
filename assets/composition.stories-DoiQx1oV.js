import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-8seASxUo.js";import{t as r}from"./jsx-runtime-O9QVJvLM.js";import{n as i,t as a}from"./src-C4k-hfcv.js";var o,s,c,l,u;t((()=>{o=e(n()),a(),s=r(),c={component:i},l={render:()=>{let e=(0,o.useRef)(null),[t,n]=(0,o.useState)(`Type a word in the middle, then tap here.`),[r,a]=(0,o.useState)([0,0]);return(0,o.useEffect)(()=>{if(!e.current)return;let r=i({text:t,onChange:n}),o=r.on(`selectionchange`,()=>{a(r.selection)}),s=r.input(e.current);return()=>{o(),s()}},[]),(0,s.jsxs)(`div`,{style:{fontFamily:`sans-serif`,maxWidth:600},children:[(0,s.jsxs)(`ol`,{children:[(0,s.jsxs)(`li`,{children:[`Open this story on an `,(0,s.jsx)(`b`,{children:`Android`}),` device (GBoard or another composing IME).`]}),(0,s.jsx)(`li`,{children:`Put the caret somewhere in the middle of the line.`}),(0,s.jsxs)(`li`,{children:[`Type a few letters but do `,(0,s.jsx)(`b`,{children:`not`}),` press space or accept a suggestion — leave the word `,(0,s.jsx)(`b`,{children:`composing`}),` (underlined).`]}),(0,s.jsxs)(`li`,{children:[(0,s.jsx)(`b`,{children:`Tap at the end`}),` of the line to move the caret there.`]})]}),(0,s.jsxs)(`p`,{children:[(0,s.jsx)(`b`,{children:`Expected:`}),` the caret stays where you tapped.`,(0,s.jsx)(`br`,{}),(0,s.jsx)(`b`,{children:`Bug:`}),` the caret springs back to the composing word and the IME re-composes it.`]}),(0,s.jsx)(`div`,{ref:e,style:{backgroundColor:`white`,border:`solid 1px darkgray`,padding:8,minHeight:96,fontSize:20},children:t.split(`
`).map((e,t)=>(0,s.jsx)(`div`,{children:e||(0,s.jsx)(`br`,{})},t))}),(0,s.jsxs)(`pre`,{children:[`editor.selection: `,JSON.stringify(r)]})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Type a word in the middle, then tap here.");
    const [selection, setSelection] = useState<readonly [number, number]>([0, 0]);
    useEffect(() => {
      if (!ref.current) return;
      const editor = createPlainEditor({
        text,
        onChange: setText
      });
      const offSelection = editor.on("selectionchange", () => {
        setSelection(editor.selection);
      });
      const cleanup = editor.input(ref.current);
      return () => {
        offSelection();
        cleanup();
      };
    }, []);
    return <div style={{
      fontFamily: "sans-serif",
      maxWidth: 600
    }}>
        <ol>
          <li>
            Open this story on an <b>Android</b> device (GBoard or another
            composing IME).
          </li>
          <li>Put the caret somewhere in the middle of the line.</li>
          <li>
            Type a few letters but do <b>not</b> press space or accept a
            suggestion — leave the word <b>composing</b> (underlined).
          </li>
          <li>
            <b>Tap at the end</b> of the line to move the caret there.
          </li>
        </ol>
        <p>
          <b>Expected:</b> the caret stays where you tapped.
          <br />
          <b>Bug:</b> the caret springs back to the composing word and the IME
          re-composes it.
        </p>
        <div ref={ref} style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8,
        minHeight: 96,
        fontSize: 20
      }}>
          {text.split("\\n").map((r, i) => <div key={i}>{r ? r : <br />}</div>)}
        </div>
        <pre>editor.selection: {JSON.stringify(selection)}</pre>
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`Repro: a pointer tap that ends an IME composition is discarded.

When a word is still composing (e.g. Android GBoard keeps it underlined until
you commit), tapping elsewhere moves the DOM caret — but \`flushInput\` reverts
the composition and restores the *model* selection, so the caret springs back
to where the composition was and the IME re-composes the word. Only
reproducible with a composing IME (a hardware keyboard / desktop commits each
keystroke, so there is no open composition to fight).

The \`editor.selection\` readout below ends at the sprung-back position, not
where you tapped.`,...l.parameters?.docs?.description}}},u=[`TapDuringCompositionResetsCaret`]}))();export{l as TapDuringCompositionResetsCaret,u as __namedExportsOrder,c as default};