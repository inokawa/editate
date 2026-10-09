import{c as e,i as t}from"./preload-helper-usAeo7Bx.js";import{C as n}from"./iframe-BxuPWOtV.js";import{t as r}from"./react-dom-DZ_UnKvB.js";import{t as i}from"./jsx-runtime-O9QVJvLM.js";import{c as a,l as o,r as s,s as c,t as l,u}from"./dist-BMstJve2.js";import{A as d,M as f,N as p,P as m,S as h,X as g,d as _,q as v,s as y,t as b,w as x,y as S}from"./src-DLNdB8W5.js";var C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;t((()=>{C=e(n()),w=e(r()),s(),b(),T=i(),E={component:h},D=a({children:l(a({children:l(u([a({text:o()}),a({type:c([`mention`,`command`]),name:o()})]))}))}),O={"@":{type:`mention`,items:[`README.md`,`package.json`,`src/editor.ts`,`src/commands.ts`,`docs/API.md`]},"/":{type:`command`,items:[`summarize`,`review`,`translate`,`explain`,`fix`]}},k={mention:`@`,command:`/`},A=/(?:^|\s)([@/])([\w.-]*)$/,j=6,M=({type:e,name:t})=>(0,T.jsxs)(`span`,{contentEditable:!1,style:{borderRadius:`3px`,...e===`mention`?{background:`#EAF5F9`,color:`#4276AA`}:{background:`#F3EEFB`,color:`#7A55B8`}},children:[k[e],t]}),N=({files:e,onRemove:t})=>(0,T.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:4},children:e.map((e,n)=>(0,T.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:4,fontSize:12,backgroundColor:`whitesmoke`,border:`solid 1px lightgray`,borderRadius:4,padding:`2px 6px`},children:[`📄 `,e.name,t&&(0,T.jsx)(`button`,{style:{border:`none`,background:`none`,padding:0},onClick:()=>{t(n)},children:`✕`})]},n))}),P=({items:e,selectedIndex:t,top:n,left:r,complete:i})=>(0,T.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,minWidth:160,fontSize:`12px`,border:`solid 1px lightgray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,T.jsx)(`div`,{style:{padding:`4px 8px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),F={font:`12px sans-serif`,padding:`3px 8px`,borderRadius:6,border:`solid 1px lightgray`,backgroundColor:`white`,color:`dimgray`,cursor:`pointer`},I={render:()=>{let e=(0,C.useRef)(null),[t,n]=(0,C.useState)({children:[{children:[{text:`Ask about `},{type:`mention`,name:`src/editor.ts`},{text:` — type @ or / to see suggestions.`}]},{children:[{text:`Drop or paste files anywhere on the box. Enter to send, Shift+Enter for a new line.`}]}]}),[r,i]=(0,C.useState)(!1),[a,o]=(0,C.useState)([new File([],`dummy.txt`)]),[s,c]=(0,C.useState)([]),[l,u]=(0,C.useState)(null),[b,E]=(0,C.useState)(0),I=l&&g(t,0,l.caret).match(A),L=I?O[I[1]]:null,R=I?.[2]??``,z=(L?.items??[]).filter(e=>e.toLowerCase().startsWith(R.toLowerCase())).slice(0,j),B=e=>{let t=z[e];if(!l||!L||!t)return;let n=l.caret-R.length-1;J.exec(d,[n,l.caret]).exec(f,{type:L.type,name:t},n).exec(p,` `),u(null),E(0)},V=e=>{let t=[...e??[]];return t.length&&o(e=>[...e,...t]),t.length>0},H=!v(t)&&!a.length,U=()=>{if(H)return;let e=J.doc;c(t=>[...t,{doc:e,files:a}]),o([]),J.exec(m,[{children:[{text:``}]}]),J.selection=[0,0],J.exec(x)},W=(0,C.useEffectEvent)(()=>{if(!l||!z.length)return!1;E(e=>e<=0?z.length-1:e-1)}),G=(0,C.useEffectEvent)(()=>{if(!l||!z.length)return!1;E(e=>e>=z.length-1?0:e+1)}),K=(0,C.useEffectEvent)(()=>{l&&z.length?B(b):U()}),q=(0,C.useEffectEvent)(()=>{if(!l||!z.length)return!1;u(null),E(0)}),J=(0,C.useMemo)(()=>{let e=h({doc:t,schema:D}).exec(e=>{e.hook(`paste`,e=>e.files.length?!0:null)}).exec(S,{voidToString:e=>k[e.type]+e.name}).exec(_,{ArrowUp:W,ArrowDown:G,Enter:K,Escape:q}).exec(y,t=>{let n=Math.min(...e.selection);if(A.test(g(e.doc,0,n))){let e=t();u({top:e.top+e.height,left:e.left,caret:n})}else u(null);E(0)});return e.on(`change`,()=>{n(e.doc)}),e},[]);(0,C.useEffect)(()=>{if(e.current)return J.input(e.current)},[]);let Y=(0,C.useRef)(null);return(0,C.useEffect)(()=>{Y.current?.scrollTo({top:Y.current.scrollHeight})},[s]),(0,T.jsxs)(`div`,{style:{maxWidth:480},children:[(0,T.jsxs)(`div`,{ref:Y,style:{height:200,overflowY:`auto`,display:`flex`,flexDirection:`column`,gap:8,backgroundColor:`#F7F7F8`,borderRadius:8,padding:8,marginBottom:8},children:[(0,T.jsx)(`div`,{style:{marginTop:`auto`}}),s.map((e,t)=>(0,T.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`},children:(0,T.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4,maxWidth:`85%`,backgroundColor:`white`,border:`solid 1px #E3E3E3`,borderRadius:12,padding:`8px 12px`,boxShadow:`0 1px 2px rgba(0, 0, 0, 0.06)`},children:[e.files.length>0&&(0,T.jsx)(N,{files:e.files}),(0,T.jsx)(`div`,{children:e.doc.children.map((e,t)=>(0,T.jsx)(`div`,{style:{minHeight:`1em`},children:e.children.map((e,t)=>`text`in e?e.text:(0,T.jsx)(M,{...e},t))},t))})]})},t))]}),(0,T.jsxs)(`div`,{onDragOver:e=>{e.dataTransfer.types.includes(`Files`)&&e.preventDefault()},onDrop:e=>{V(e.dataTransfer.files)&&e.preventDefault()},onPaste:e=>{V(e.clipboardData.files)},onFocus:()=>{i(!0)},onBlur:()=>{i(!1)},style:{display:`flex`,flexDirection:`column`,gap:8,backgroundColor:`white`,border:`solid 1px ${r?`#2A6AD3`:`darkgray`}`,boxShadow:r?`0 0 0 1px #2A6AD3`:void 0,borderRadius:8,padding:8},children:[a.length>0&&(0,T.jsx)(N,{files:a,onRemove:e=>{o(t=>t.filter((t,n)=>n!==e))}}),(0,T.jsx)(`div`,{ref:e,style:{padding:4,minHeight:40,maxHeight:100,overflowY:`auto`,outline:`none`},children:t.children.map((e,t)=>(0,T.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,T.jsx)(`br`,{},t):(0,T.jsx)(M,{...e},t))},t))}),(0,T.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,margin:`0 -8px -8px`,padding:`6px 8px`,borderTop:`solid 1px #EDEDED`},children:[(0,T.jsxs)(`label`,{style:F,children:[`+`,(0,T.jsx)(`input`,{type:`file`,multiple:!0,hidden:!0,onChange:e=>{V(e.currentTarget.files),e.currentTarget.value=``}})]}),(0,T.jsx)(`button`,{disabled:H,onClick:U,style:{...F,marginLeft:`auto`,border:`none`,backgroundColor:H?`lightgray`:`#111`,color:`white`},children:`↑`})]})]}),l&&z.length>0&&(0,w.createPortal)((0,T.jsx)(P,{top:l.top,left:l.left,items:z,selectedIndex:b,complete:B}),document.body)]})}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [doc, setDoc] = useState<PromptDoc>({
      children: [{
        children: [{
          text: "Ask about "
        }, {
          type: "mention",
          name: "src/editor.ts"
        }, {
          text: " — type @ or / to see suggestions."
        }]
      }, {
        children: [{
          text: "Drop or paste files anywhere on the box. Enter to send, Shift+Enter for a new line."
        }]
      }]
    });
    const [focused, setFocused] = useState(false);
    const [files, setFiles] = useState<File[]>([new File([], "dummy.txt")]);
    const [messages, setMessages] = useState<{
      doc: PromptDoc;
      files: File[];
    }[]>([]);
    const [pos, setPos] = useState<{
      top: number;
      left: number;
      caret: number;
    } | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const match = pos && sliceText(doc, 0, pos.caret).match(TRIGGER_REG);
    const trigger = match ? TRIGGERS[match[1]!] : null;
    const query = match?.[2] ?? "";
    const filtered = (trigger?.items ?? []).filter(c => c.toLowerCase().startsWith(query.toLowerCase())).slice(0, MAX_LIST_LENGTH);
    const complete = (i: number) => {
      const selected = filtered[i];
      if (!pos || !trigger || !selected) return;
      const start = pos.caret - query.length - 1;
      editor.exec(Delete, [start, pos.caret]).exec(InsertNode, {
        type: trigger.type,
        name: selected
      }, start).exec(InsertText, " ");
      setPos(null);
      setSelectedIndex(0);
    };
    const addFiles = (list: FileList | null): boolean => {
      const added = [...(list ?? [])];
      if (added.length) {
        setFiles(prev => [...prev, ...added]);
      }
      return added.length > 0;
    };
    const sendDisabled = !getNodeSize(doc) && !files.length;
    const submit = () => {
      if (sendDisabled) return;
      // Read the doc before clearing it, because the updater below may run after ReplaceDoc
      const sent = editor.doc;
      setMessages(prev => [...prev, {
        doc: sent,
        files
      }]);
      setFiles([]);
      editor.exec(ReplaceDoc, [{
        children: [{
          text: ""
        }]
      }]);
      editor.selection = [0, 0];
      editor.exec(ClearHistory);
    };
    const onUp = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setSelectedIndex(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
    });
    const onDown = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setSelectedIndex(prev => prev >= filtered.length - 1 ? 0 : prev + 1);
    });
    const onEnter = useEffectEvent(() => {
      if (pos && filtered.length) {
        complete(selectedIndex);
      } else {
        // Enter submits. Shift+Enter inserts a new line by the browser.
        submit();
      }
    });
    const onClose = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setPos(null);
      setSelectedIndex(0);
    });
    const editor = useMemo(() => {
      const e = createEditor({
        doc,
        schema: promptSchema
      }).exec(editor => {
        // Consume pasted / dropped files so that they are not inserted into the document. The box handles them instead.
        editor.hook("paste", dataTransfer => dataTransfer.files.length ? true : null);
      }).exec(plainTransferPlugin, {
        voidToString: n => PREFIX[n.type] + n.name
      }).exec(keymapPlugin, {
        ArrowUp: onUp,
        ArrowDown: onDown,
        Enter: onEnter,
        Escape: onClose
      }).exec(selectionRectPlugin, getRect => {
        const selectionStart = Math.min(...e.selection);
        if (TRIGGER_REG.test(sliceText(e.doc, 0, selectionStart))) {
          const r = getRect();
          setPos({
            top: r.top + r.height,
            left: r.left,
            caret: selectionStart
          });
        } else {
          setPos(null);
        }
        setSelectedIndex(0);
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
    const chatRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight
      });
    }, [messages]);
    return <div style={{
      maxWidth: 480
    }}>
        <div ref={chatRef} style={{
        height: 200,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        backgroundColor: "#F7F7F8",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8
      }}>
          {/* Stick messages to the bottom */}
          <div style={{
          marginTop: "auto"
        }} />
          {messages.map((m, i) => <div key={i} style={{
          display: "flex",
          justifyContent: "flex-end"
        }}>
              <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: "85%",
            backgroundColor: "white",
            border: "solid 1px #E3E3E3",
            borderRadius: 12,
            padding: "8px 12px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)"
          }}>
                {m.files.length > 0 && <FileChips files={m.files} />}
                <div>
                  {m.doc.children.map((r, j) => <div key={j} style={{
                minHeight: "1em"
              }}>
                      {r.children.map((n, k) => "text" in n ? n.text : <Token key={k} {...n} />)}
                    </div>)}
                </div>
              </div>
            </div>)}
        </div>
        <div onDragOver={e => {
        // Allow dropping files anywhere on the box, not only on the editor
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
        }
      }} onDrop={e => {
        if (addFiles(e.dataTransfer.files)) {
          e.preventDefault();
        }
      }} onPaste={e => {
        // Files pasted on the editor bubble here, consumed by the paste hook above
        addFiles(e.clipboardData.files);
      }} onFocus={() => {
        setFocused(true);
      }} onBlur={() => {
        setFocused(false);
      }} style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        backgroundColor: "white",
        border: \`solid 1px \${focused ? "#2A6AD3" : "darkgray"}\`,
        boxShadow: focused ? "0 0 0 1px #2A6AD3" : undefined,
        borderRadius: 8,
        padding: 8
      }}>
          {files.length > 0 && <FileChips files={files} onRemove={i => {
          setFiles(prev => prev.filter((_, j) => j !== i));
        }} />}
          <div ref={ref} style={{
          padding: 4,
          minHeight: 40,
          maxHeight: 100,
          overflowY: "auto",
          outline: "none"
        }}>
            {doc.children.map((r, i) => <div key={i}>
                {r.children.map((n, j) => "text" in n ? n.text || <br key={j} /> : <Token key={j} {...n} />)}
              </div>)}
          </div>
          <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "0 -8px -8px",
          padding: "6px 8px",
          borderTop: "solid 1px #EDEDED"
        }}>
            <label style={FLAT_BUTTON_STYLE}>
              +
              <input type="file" multiple hidden onChange={e => {
              addFiles(e.currentTarget.files);
              e.currentTarget.value = "";
            }} />
            </label>
            <button disabled={sendDisabled} onClick={submit} style={{
            ...FLAT_BUTTON_STYLE,
            marginLeft: "auto",
            border: "none",
            backgroundColor: sendDisabled ? "lightgray" : "#111",
            color: "white"
          }}>
              ↑
            </button>
          </div>
        </div>
        {pos && filtered.length > 0 && createPortal(<Menu top={pos.top} left={pos.left} items={filtered} selectedIndex={selectedIndex} complete={complete} />, document.body)}
      </div>;
  }
}`,...I.parameters?.docs?.source}}},L=[`PromptBox`]}))();export{I as PromptBox,L as __namedExportsOrder,E as default};