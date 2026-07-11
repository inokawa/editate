import { nodeToString } from "../doc/node.js";
import { stringToFragment } from "../doc/utils.js";
import { createEditor, type Editor, type EditorOptions } from "../editor.js";
import { plainTransferPlugin, singlelinePlugin } from "../plugins/index.js";

type PlainDoc = { children: { children: { text: string }[] }[] };

export interface PlainEditorOptions extends Omit<
  EditorOptions<PlainDoc>,
  "doc" | "schema" | "onChange"
> {
  /**
   * Initial document text.
   */
  text: string;
  /**
   * TODO
   */
  singleline?: boolean;
  /**
   * Callback invoked when document changes.
   */
  onChange: (text: string) => void;
}

/**
 * A function to initialize editor with plaintext.
 */
export const createPlainEditor = ({
  text,
  singleline,
  onChange,
  ...opts
}: PlainEditorOptions): Editor<PlainDoc> => {
  const editor = createEditor<PlainDoc>({
    ...opts,
    doc: { children: stringToFragment(text) },
  }).exec(plainTransferPlugin);
  if (singleline) {
    editor.exec(singlelinePlugin);
  }
  editor.on("change", () => {
    onChange(nodeToString(editor.doc));
  });
  return editor;
};
