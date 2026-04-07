import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{a as n}from"./iframe-DOi8d-ls.js";import{t as r}from"./react-dom-BnMndjNx.js";import{t as i}from"./jsx-runtime-CR4qI0Ep.js";import{n as a,t as o}from"./src-D1V7JRYA.js";var s,c,l,u,d,f,p,m;e((()=>{s=t(n()),o(),c=t(r()),l=i(),u={component:a},d=()=>{let e=(0,s.useRef)(null),[t,n]=(0,s.useState)(`This is new window!`);return(0,s.useEffect)(()=>{if(e.current)return a({text:t,onChange:n}).input(e.current)},[]),(0,l.jsx)(`div`,{ref:e,style:{background:`white`},children:t.split(`
`).map((e,t)=>(0,l.jsx)(`div`,{children:e||(0,l.jsx)(`br`,{})},t))})},f=({children:e,onUnload:t})=>{let[n,r]=(0,s.useState)(null);return(0,s.useLayoutEffect)(()=>{let e=window.open(``,``,`width=600,height=400,left=200,top=200`);if(!e)return;let n=e.document.createElement(`div`);return e.document.body.appendChild(n),e.addEventListener(`unload`,t,{once:!0}),r(n),()=>{e?.close()}},[]),n?(0,c.createPortal)(e,n):null},p={name:`NewWindow`,render:()=>{let[e,t]=(0,s.useState)(!1);return(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`button`,{onClick:()=>{t(e=>!e)},children:[e?`close`:`open`,` window`]}),e&&(0,l.jsx)(f,{onUnload:()=>{t(!1)},children:(0,l.jsx)(d,{})})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "NewWindow",
  render: () => {
    const [isWindowOpened, setIsWindowOpened] = useState(false);
    return <div>
        <button onClick={() => {
        setIsWindowOpened(prev => !prev);
      }}>
          {isWindowOpened ? "close" : "open"} window
        </button>
        {isWindowOpened && <NewWindow onUnload={() => {
        setIsWindowOpened(false);
      }}>
            <Content />
          </NewWindow>}
      </div>;
  }
}`,...p.parameters?.docs?.source}}},m=[`Default`]}))();export{p as Default,m as __namedExportsOrder,u as default};