import { Editor, EditorOptions } from '../editor.js';
type PlainDoc = {
    children: {
        children: {
            text: string;
        }[];
    }[];
};
export interface PlainEditorOptions extends Omit<EditorOptions<PlainDoc>, "doc" | "schema" | "onChange"> {
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
export declare const createPlainEditor: ({ text, singleline, onChange, ...opts }: PlainEditorOptions) => Editor<PlainDoc>;
export {};
