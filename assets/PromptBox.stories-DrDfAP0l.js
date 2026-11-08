import{n as e,o as t}from"./rolldown-runtime-BCiCTKAo.js";import{f as n}from"./iframe-DUaYTx_q.js";import{t as r}from"./react-dom-BDuPKTEi.js";import{t as i}from"./jsx-runtime-BB9-612F.js";import{c as a,l as o,r as s,s as c,t as l,u}from"./dist-BEhlLfzv.js";import{F as d,L as f,U as p,a as m,i as h,n as g,r as _,t as v,u as y}from"./plainTransfer-DX0eXjWD.js";import{a as b,i as x,r as S,t as C,u as w}from"./commands-B2cVjEDb.js";import{i as T,n as E,r as D,t as O}from"./selectionRect-Bcuo24Un.js";var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{k=t(n()),A=r(),s(),y(),h(),w(),f(),D(),v(),O(),j=i(),M={component:_},N=a({children:l(a({children:l(u([a({text:o()}),a({type:c([`mention`,`command`]),name:o()})]))}))}),P={"@":{type:`mention`,items:[`README.md`,`package.json`,`src/editor.ts`,`src/commands.ts`,`docs/API.md`]},"/":{type:`command`,items:[`summarize`,`review`,`translate`,`explain`,`fix`]}},F={mention:`@`,command:`/`},I=/(?:^|\s)([@/])([\w.-]*)$/,L=6,R=({type:e,name:t})=>(0,j.jsxs)(`span`,{contentEditable:!1,style:{borderRadius:`3px`,...e===`mention`?{background:`#EAF5F9`,color:`#4276AA`}:{background:`#F3EEFB`,color:`#7A55B8`}},children:[F[e],t]}),z=({files:e,onRemove:t})=>(0,j.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:4},children:e.map((e,n)=>(0,j.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:4,fontSize:12,backgroundColor:`whitesmoke`,border:`solid 1px lightgray`,borderRadius:4,padding:`2px 6px`},children:[`📄 `,e.name,t&&(0,j.jsx)(`button`,{style:{border:`none`,background:`none`,padding:0},onClick:()=>{t(n)},children:`✕`})]},n))}),B=({items:e,selectedIndex:t,top:n,left:r,complete:i})=>(0,j.jsx)(`div`,{style:{position:`fixed`,top:n,left:r,minWidth:160,fontSize:`12px`,border:`solid 1px lightgray`,borderRadius:`3px`,background:`white`,cursor:`pointer`},children:e.map((e,n)=>(0,j.jsx)(`div`,{style:{padding:`4px 8px`,...t===n&&{color:`white`,background:`#2A6AD3`}},onMouseDown:e=>{e.preventDefault(),i(n)},children:e},e))}),V={font:`12px sans-serif`,padding:`3px 8px`,borderRadius:6,border:`solid 1px lightgray`,backgroundColor:`white`,color:`dimgray`,cursor:`pointer`},H={render:()=>{let e=(0,k.useRef)(null),[t,n]=(0,k.useState)({children:[{children:[{text:`Ask about `},{type:`mention`,name:`src/editor.ts`},{text:` — type @ or / to see suggestions.`}]},{children:[{text:`Drop or paste files anywhere on the box. Enter to send, Shift+Enter for a new line.`}]}]}),[r,i]=(0,k.useState)(!1),[a,o]=(0,k.useState)([new File([],`dummy.txt`)]),[s,c]=(0,k.useState)([]),[l,u]=(0,k.useState)(null),[f,h]=(0,k.useState)(0),v=l&&p(t,0,l.caret).match(I),y=v?P[v[1]]:null,w=v?.[2]??``,D=(y?.items??[]).filter(e=>e.toLowerCase().startsWith(w.toLowerCase())).slice(0,L),O=e=>{let t=D[e];if(!l||!y||!t)return;let n=l.caret-w.length-1;J.exec(C,[n,l.caret]).exec(S,{type:y.type,name:t},n).exec(x,` `),u(null),h(0)},M=e=>{let t=[...e??[]];return t.length&&o(e=>[...e,...t]),t.length>0},H=!d(t)&&!a.length,U=()=>{if(H)return;let e=J.doc;c(t=>[...t,{doc:e,files:a}]),o([]),J.exec(b,[{children:[{text:``}]}]),J.selection=[0,0],J.exec(m)},W=(0,k.useEffectEvent)(()=>{if(!l||!D.length)return!1;h(e=>e<=0?D.length-1:e-1)}),G=(0,k.useEffectEvent)(()=>{if(!l||!D.length)return!1;h(e=>e>=D.length-1?0:e+1)}),K=(0,k.useEffectEvent)(()=>{l&&D.length?O(f):U()}),q=(0,k.useEffectEvent)(()=>{if(!l||!D.length)return!1;u(null),h(0)}),J=(0,k.useMemo)(()=>{let e=_({doc:t,schema:N}).exec(e=>{e.hook(`paste`,e=>e.files.length?!0:null)}).exec(g,{voidToString:e=>F[e.type]+e.name}).exec(T,{ArrowUp:W,ArrowDown:G,Enter:K,Escape:q}).exec(E,t=>{let n=Math.min(...e.selection);if(I.test(p(e.doc,0,n))){let e=t();u({top:e.top+e.height,left:e.left,caret:n})}else u(null);h(0)});return e.on(`change`,()=>{n(e.doc)}),e},[]);(0,k.useEffect)(()=>{if(e.current)return J.input(e.current)},[]);let Y=(0,k.useRef)(null);return(0,k.useEffect)(()=>{Y.current?.scrollTo({top:Y.current.scrollHeight})},[s]),(0,j.jsxs)(`div`,{style:{maxWidth:480},children:[(0,j.jsxs)(`div`,{ref:Y,style:{height:200,overflowY:`auto`,display:`flex`,flexDirection:`column`,gap:8,backgroundColor:`#F7F7F8`,borderRadius:8,padding:8,marginBottom:8},children:[(0,j.jsx)(`div`,{style:{marginTop:`auto`}}),s.map((e,t)=>(0,j.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`},children:(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4,maxWidth:`85%`,backgroundColor:`white`,border:`solid 1px #E3E3E3`,borderRadius:12,padding:`8px 12px`,boxShadow:`0 1px 2px rgba(0, 0, 0, 0.06)`},children:[e.files.length>0&&(0,j.jsx)(z,{files:e.files}),(0,j.jsx)(`div`,{children:e.doc.children.map((e,t)=>(0,j.jsx)(`div`,{style:{minHeight:`1em`},children:e.children.map((e,t)=>`text`in e?e.text:(0,j.jsx)(R,{...e},t))},t))})]})},t))]}),(0,j.jsxs)(`div`,{onDragOver:e=>{e.dataTransfer.types.includes(`Files`)&&e.preventDefault()},onDrop:e=>{M(e.dataTransfer.files)&&e.preventDefault()},onPaste:e=>{M(e.clipboardData.files)},onFocus:()=>{i(!0)},onBlur:()=>{i(!1)},style:{display:`flex`,flexDirection:`column`,gap:8,backgroundColor:`white`,border:`solid 1px ${r?`#2A6AD3`:`darkgray`}`,boxShadow:r?`0 0 0 1px #2A6AD3`:void 0,borderRadius:8,padding:8},children:[a.length>0&&(0,j.jsx)(z,{files:a,onRemove:e=>{o(t=>t.filter((t,n)=>n!==e))}}),(0,j.jsx)(`div`,{ref:e,style:{padding:4,minHeight:40,maxHeight:100,overflowY:`auto`,outline:`none`},children:t.children.map((e,t)=>(0,j.jsx)(`div`,{children:e.children.map((e,t)=>`text`in e?e.text||(0,j.jsx)(`br`,{},t):(0,j.jsx)(R,{...e},t))},t))}),(0,j.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,margin:`0 -8px -8px`,padding:`6px 8px`,borderTop:`solid 1px #EDEDED`},children:[(0,j.jsxs)(`label`,{style:V,children:[`+`,(0,j.jsx)(`input`,{type:`file`,multiple:!0,hidden:!0,onChange:e=>{M(e.currentTarget.files),e.currentTarget.value=``}})]}),(0,j.jsx)(`button`,{disabled:H,onClick:U,style:{...V,marginLeft:`auto`,border:`none`,backgroundColor:H?`lightgray`:`#111`,color:`white`},children:`↑`})]})]}),l&&D.length>0&&(0,A.createPortal)((0,j.jsx)(B,{top:l.top,left:l.left,items:D,selectedIndex:f,complete:O}),document.body)]})}},U=[`PromptBox`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}}})))()}W();export{H as PromptBox,U as __namedExportsOrder,M as default};