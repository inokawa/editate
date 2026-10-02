import { css, ref, type Handle } from "remix/component";
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

const editorStyle = css({
  backgroundColor: "white",
  border: "solid 1px darkgray",
  padding: 8,
});

export function App(handle: Handle) {
  let doc: Doc = initialDoc;

  return () => (
    <div
      mix={[
        editorStyle,
        ref((node, signal) => {
          const editor = createEditor({
            doc: initialDoc,
            schema: schema,
          }).exec(plainTransferPlugin);
          editor.on("change", () => {
            doc = editor.doc;
            handle.update();
          });
          signal.addEventListener("abort", editor.input(node));
        }),
      ]}
    >
      {doc.children.map((b, i) => (
        <div key={i}>
          {b.children.map((n, j) => (
            <span key={j}>{n.text || <br />}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
