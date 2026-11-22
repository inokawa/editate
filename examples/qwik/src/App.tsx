import { component$, useSignal, useVisibleTask$ } from "@qwik.dev/core";
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

export default component$(() => {
  const ref = useSignal<HTMLDivElement>();
  const doc = useSignal<Doc>(initialDoc);
  useVisibleTask$(
    ({ cleanup }) => {
      const editor = createEditor({
        doc: initialDoc,
        schema: schema,
      }).exec(plainTransferPlugin);
      editor.on("change", () => {
        doc.value = editor.doc;
      });
      cleanup(editor.input(ref.value!));
    },
    { strategy: "document-ready" },
  );

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: "8px",
      }}
    >
      {doc.value.children.map((b) => (
        <div>
          {b.children.map((n) => (
            <span>{n.text || <br />}</span>
          ))}
        </div>
      ))}
    </div>
  );
});
