import { createRoot } from "remix/component";
import { App } from "./App.tsx";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
