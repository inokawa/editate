import { createSignal, For, onSettled } from "solid-js";
import { createEditor, plainTransferPlugin } from "editate";
import * as z from "zod";

const schema = z.strictObject({
  children: z.array(
    z.strictObject({
      children: z.array(
        z.strictObject({
          text: z.string(),
        }),
      ),
    }),
  ),
});

type Doc = z.infer<typeof schema>;

const initialDoc: Doc = {
  children: [
    { children: [{ text: "Hello world." }] },
    { children: [{ text: "こんにちは。" }] },
    { children: [{ text: "👍❤️🧑‍🧑‍🧒" }] },
  ],
};

function App() {
  let ref: HTMLDivElement | undefined;
  const [doc, setDoc] = createSignal<Doc>(initialDoc);
  onSettled(() => {
    const editor = createEditor({
      doc: initialDoc,
      schema: schema,
    }).exec(plainTransferPlugin);
    editor.on("change", () => {
      setDoc(editor.doc);
    });
    return editor.input(ref!);
  });

  return (
    <div
      ref={ref}
      style={{
        "background-color": "white",
        border: "solid 1px darkgray",
        padding: "8px",
      }}
    >
      <For each={doc().children}>
        {(b) => (
          <div>
            <For each={b.children}>
              {(n) => <span>{n.text || <br />}</span>}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

export default App;
