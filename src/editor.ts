import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createHistory } from "./history.js";
import {
  getCurrentDocument,
  takeSelectionSnapshot,
  setSelectionToDOM,
  getEmptySelectionSnapshot,
  getPointedCaretPosition,
  defaultIsBlockNode,
  defaultIsVoidNode,
  serializeRange,
} from "./dom/index.js";
import { createMutationObserver } from "./mutation.js";
import type { DocNode, Fragment, SelectionSnapshot } from "./doc/types.js";
import { is, isFunction, isString, microtask } from "./utils.js";
import type { EditorCommand } from "./commands.js";
import {
  applyOperation,
  Transaction,
  sliceFragment,
  type Operation,
  isUnsafeOperation,
  isValidSelection,
} from "./doc/edit.js";
import type { ParserConfig } from "./dom/parser.js";
import { comparePosition, toRange } from "./doc/position.js";
import type { EditorPlugin } from "./plugins/types.js";
import {
  type CopyHook,
  type PasteHook,
  plainCopy,
  plainPaste,
  hotkey,
  type KeyboardHook,
} from "./hooks/index.js";

const empty: unknown[] = [];

const noop = () => {};

/**
 * https://www.w3.org/TR/input-events-1/#interface-InputEvent-Attributes
 */
type InputType =
  | "insertText" // insert typed plain text
  | "insertReplacementText" // replace existing text by means of a spell checker, auto-correct or similar
  | "insertLineBreak" // insert a line break
  | "insertParagraph" // insert a paragraph break
  | "insertOrderedList" // insert a numbered list
  | "insertUnorderedList" // insert a bulleted list
  | "insertHorizontalRule" // insert a horizontal rule
  | "insertFromYank" // replace the current selection with content stored in a kill buffer
  | "insertFromDrop" // insert content into the DOM by means of drop
  | "insertFromPaste" // paste
  | "insertFromPasteAsQuotation" // paste content as a quotation
  | "insertTranspose" // transpose the last two characters that were entered
  | "insertCompositionText" // replace the current composition string
  | "insertLink" // insert a link
  | "deleteWordBackward" // delete a word directly before the caret position
  | "deleteWordForward" // delete a word directly after the caret position
  | "deleteSoftLineBackward" // delete from the caret to the nearest visual line break before the caret position
  | "deleteSoftLineForward" // delete from the caret to the nearest visual line break after the caret position
  | "deleteEntireSoftLine" // delete from to the nearest visual line break before the caret position to the nearest visual line break after the caret position
  | "deleteHardLineBackward" // delete from the caret to the nearest beginning of a block element or br element before the caret position
  | "deleteHardLineForward" // delete from the caret to the nearest end of a block element or br element after the caret position
  | "deleteByDrag" // remove content from the DOM by means of drag
  | "deleteByCut" // remove the current selection as part of a cut
  | "deleteContent" // delete the selection without specifying the direction of the deletion and this intention is not covered by another inputType
  | "deleteContentBackward" // delete the content directly before the caret position and this intention is not covered by another inputType or delete the selection with the selection collapsing to its start after the deletion
  | "deleteContentForward" // delete the content directly after the caret position and this intention is not covered by another inputType or delete the selection with the selection collapsing to its end after the deletion
  | "historyUndo" // undo the last editing action
  | "historyRedo" // to redo the last undone editing action
  | "formatBold" // initiate bold text
  | "formatItalic" // initiate italic text
  | "formatUnderline" // initiate underline text
  | "formatStrikeThrough" // initiate stricken through text
  | "formatSuperscript" // initiate superscript text
  | "formatSubscript" // initiate subscript text
  | "formatJustifyFull" // make the current selection fully justified
  | "formatJustifyCenter" // center align the current selection
  | "formatJustifyRight" // right align the current selection
  | "formatJustifyLeft" // left align the current selection
  | "formatIndent" // indent the current selection
  | "formatOutdent" // outdent the current selection
  | "formatRemove" // remove all formatting from the current selection
  | "formatSetBlockTextDirection" // set the text block direction
  | "formatSetInlineTextDirection" // set the text inline direction
  | "formatBackColor" // change the background color
  | "formatFontColor" // change the font color
  | "formatFontName" // change the font-family
  // Legacy events older Chrome/Safari may dispatch
  // https://github.com/w3c/input-events/pull/122
  | "deleteCompositionText"
  | "deleteByComposition"
  | "insertFromComposition";

/**
 * Options of {@link createEditor}.
 */
export interface EditorOptions<
  T extends DocNode,
  S extends StandardSchemaV1<T, T> | void = void,
> {
  /**
   * Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.
   */
  schema?: S;
  /**
   * Initial document.
   */
  doc: T;
  /**
   * The state editable or not.
   */
  readonly?: boolean;
  /**
   * Functions to handle keyboard events.
   *
   * Return `true` if you want to stop propagation.
   */
  keyboard?: KeyboardHook[];
  /**
   * Functions to handle copy events
   * @default [plainCopy()]
   */
  copy?: [CopyHook, ...rest: CopyHook[]];
  /**
   * Functions to handle paste / drop events
   * @default [plainPaste()]
   */
  paste?: [PasteHook, ...rest: PasteHook[]];
  /**
   * TODO
   */
  isBlock?: (node: HTMLElement) => boolean;
  /**
   * Callback invoked when document changes.
   */
  onChange: (doc: T) => void;
  /**
   * Callback invoked when errors happen.
   *
   * @default console.error
   */
  onError?: (message: string) => void;
}

type EditorEventMap = {
  change: () => void;
  selectionchange: () => void;
  readonly: () => void;
};

type EditorHookMap = {
  apply: (op: Operation, next: (op?: Operation) => void) => void;
  mount: (element: HTMLElement) => void | (() => void);
};

/**
 * The editor instance.
 */
export interface Editor<T extends DocNode = DocNode> {
  readonly doc: T;
  readonly selection: SelectionSnapshot;
  /**
   * The getter/setter for the editor's read-only state.
   * `true` to read-only. `false` to editable.
   */
  readonly: boolean;
  /**
   * Dispatches editing operations.
   * @param tr {@link Transaction} or {@link EditorCommand}
   * @param args arguments of {@link EditorCommand}
   */
  apply(tr: Transaction): this;
  apply<A extends unknown[]>(fn: EditorCommand<A, T>, ...args: A): this;
  /**
   * A function to subscribe editor events.
   * @returns cleanup function
   */
  on<K extends keyof EditorEventMap>(
    key: K,
    callback: EditorEventMap[K],
  ): () => void;
  /**
   * A function to register editor hooks.
   * @returns cleanup function
   */
  hook<K extends keyof EditorHookMap>(
    key: K,
    callback: EditorHookMap[K],
  ): () => void;
  /**
   * A function to make DOM editable.
   * @returns A function to stop subscribing DOM changes and restores previous DOM state.
   */
  input: (element: HTMLElement) => () => void;
  /**
   * A function to use editor plugins.
   */
  use<A extends unknown[]>(fn: EditorPlugin<A, T>, ...args: A): this;
}

/**
 * A function to initialize {@link Editor}.
 */
export const createEditor = <
  T extends DocNode,
  S extends StandardSchemaV1<T, T> | void = void,
>({
  doc,
  readonly = false,
  schema,
  keyboard,
  copy: copyHooks = [plainCopy()],
  paste: pasteHooks = [plainPaste()],
  isBlock = defaultIsBlockNode,
  onChange,
  onError = console.error,
}: EditorOptions<T, S>): Editor<T> => {
  let selection: SelectionSnapshot = getEmptySelectionSnapshot();

  const validate = (value: T, onError: (m: string) => void): boolean => {
    if (!schema) {
      onError(
        "An unsafe operation was detected. We recommend using schema option.",
      );
      return true;
    }
    const result = schema["~standard"].validate(value);
    if (result instanceof Promise) {
      onError("async validate is not supported.");
    } else if (result.issues) {
      onError(result.issues.map((i) => i.message).join("\n"));
    } else {
      return true;
    }
    return false;
  };

  let initialError: string | undefined;
  if (
    !validate(doc, (m) => {
      initialError = m;
    }) &&
    initialError
  ) {
    throw new Error(initialError);
  }

  const keydownHooks: KeyboardHook[] = [
    hotkey(
      "z",
      () => {
        if (!readonly) {
          const nextHistory = history.undo();
          if (nextHistory) {
            doc = nextHistory[0];
            updateSelection(nextHistory[1]);
            publish("change");
          }
        }
      },
      { mod: true },
    ),
    hotkey(
      "z",
      () => {
        if (!readonly) {
          const nextHistory = history.redo();
          if (nextHistory) {
            doc = nextHistory[0];
            updateSelection(nextHistory[1]);
            publish("change");
          }
        }
      },
      { mod: true, shift: true },
    ),
  ];
  if (keyboard) {
    keydownHooks.push(...keyboard);
  }

  const hooks = new Map<
    keyof EditorHookMap,
    EditorHookMap[keyof EditorHookMap][]
  >();

  const getHook = <T extends keyof EditorHookMap>(
    key: T,
  ): readonly EditorHookMap[T][] => {
    return (hooks.get(key) || empty) as unknown as EditorHookMap[T][];
  };

  const subs = new Map<
    keyof EditorEventMap,
    [cbs: Set<EditorEventMap[keyof EditorEventMap]>, queued: boolean]
  >();

  const publish = <K extends keyof EditorEventMap>(key: K) => {
    const sub = subs.get(key);
    if (sub && !sub[1]) {
      sub[1] = true;
      microtask(() => {
        sub[1] = false;
        sub[0].forEach((cb) => {
          cb();
        });
      });
    }
  };

  const apply = (tr: Transaction) => {
    if (!readonly) {
      const currentDoc = doc;
      const applyHooks = getHook("apply");
      const length = applyHooks.length;

      for (let op of tr.ops) {
        let index = 0;

        const dispatch = () => {
          if (index < length) {
            const i = index;
            applyHooks[index]!(op, next);
            if (i === index) {
              next();
            }
          } else if (index === length) {
            index++;

            try {
              const [nextDoc, nextSelection] = applyOperation(
                doc,
                selection,
                op,
              );
              if (!isUnsafeOperation(op) || validate(nextDoc, onError)) {
                doc = nextDoc;
                selection = nextSelection;
              }
            } catch (e) {
              // rollback
              onError("rollback operation: " + e);
            }
          }
        };

        const next = (o?: Operation): void => {
          if (o) {
            op = o;
          }
          index++;
          dispatch();
        };

        dispatch();
      }

      if (!is(currentDoc, doc)) {
        publish("change");
      }
    }
  };

  const updateSelection = (s: SelectionSnapshot) => {
    if (
      isValidSelection(doc, s) &&
      (comparePosition(selection[0], s[0]) ||
        comparePosition(selection[1], s[1]))
    ) {
      selection = s;
      publish("selectionchange");
    }
  };

  const editor: Editor<T> = {
    get doc() {
      return doc;
    },
    get selection() {
      return selection;
    },
    // set selection(value) {
    //   updateSelection(value);
    // },
    get readonly() {
      return readonly;
    },
    set readonly(value) {
      readonly = value;
      publish("readonly");
    },
    apply: (tr: Transaction | EditorCommand<any, T>, ...args: unknown[]) => {
      if (isFunction(tr)) {
        tr.call(editor, ...args);
      } else {
        apply(tr);
      }
      return editor;
    },
    on: (type, callback) => {
      let sub = subs.get(type);
      if (!sub) {
        subs.set(type, (sub = [new Set(), false]));
      }
      const cbs = sub[0];
      cbs.add(callback);
      return () => {
        cbs.delete(callback);
      };
    },
    hook: (type, callback) => {
      let sub = hooks.get(type);
      if (!sub) {
        hooks.set(type, (sub = []));
      }
      sub.push(callback);
      return () => {
        const i = sub.indexOf(callback);
        if (i !== -1) {
          sub.splice(i, 1);
        }
      };
    },
    use: (plugin, ...args) => {
      plugin.call(editor, ...args);
      return editor;
    },
    input: (element) => {
      if (
        !(window.InputEvent && isFunction(InputEvent.prototype.getTargetRanges))
      ) {
        onError("beforeinput event is not supported.");
        return noop;
      }

      // https://w3c.github.io/contentEditable/
      // https://w3c.github.io/editing/docs/execCommand/
      // https://w3c.github.io/selection-api/
      const {
        contentEditable: prevContentEditable,
        role: prevRole,
        ariaMultiLine: prevAriaMultiLine,
        ariaReadOnly: prevAriaReadOnly,
      } = element;
      const prevWhiteSpace = element.style.whiteSpace;

      element.role = "textbox";
      // https://html.spec.whatwg.org/multipage/interaction.html#best-practices-for-in-page-editors
      element.style.whiteSpace = "pre-wrap";
      element.ariaMultiLine = "true";

      let disposed = false;
      let selectionReverted = false;
      let inputTransaction: [Transaction, SelectionSnapshot] | null = null;
      let isComposing = false;
      let hasFocus = false;
      let isDragging = false;

      const document = getCurrentDocument(element);

      const parserConfig: ParserConfig = {
        _document: document,
        _isBlock: isBlock as ParserConfig["_isBlock"],
        _isVoid: defaultIsVoidNode,
      };

      const setEditableState = () => {
        element.contentEditable = readonly ? "false" : "true";
        element.ariaReadOnly = readonly ? "true" : null;
      };

      setEditableState();

      const cleanupOnChange = editor.on("change", () => {
        if (!hasFocus) {
          requestAnimationFrame(() => {
            if (!hasFocus) {
              // Set focus imperatively to return focus to the editor after a command execution via click.
              // It must be queued after the MO callback because that may cause an additional selectionchange event.
              element.focus({ preventScroll: true });
            }
          });
        }
      });
      const cleanupOnReadonly = editor.on("readonly", setEditableState);

      const copy = (dataTransfer: DataTransfer, fragment: Fragment) => {
        for (const ex of copyHooks) {
          ex(dataTransfer, fragment, element);
        }
      };
      const paste = (dataTransfer: DataTransfer): string | Fragment | void => {
        for (const ex of pasteHooks) {
          const pasted = ex(dataTransfer, parserConfig);
          if (pasted) {
            return pasted;
          }
        }
        onError("failed to serialize pasted data");
      };

      const observer = createMutationObserver(element, () => {
        // TODO optimize
        // Mutation to selected DOM may change selection, so restore it.
        setSelectionToDOM(document, element, selection, parserConfig);
      });

      const syncSelection = () => {
        updateSelection(takeSelectionSnapshot(element, parserConfig));
      };

      const flushInput = () => {
        const queue = observer._flush();

        observer._record(false);

        if (queue.length) {
          // Revert DOM
          let m: MutationRecord | undefined;
          while ((m = queue.pop())) {
            if (m.type === "childList") {
              const { target, removedNodes, addedNodes, nextSibling } = m;
              for (let i = removedNodes.length - 1; i >= 0; i--) {
                target.insertBefore(removedNodes[i]!, nextSibling);
              }
              for (let i = addedNodes.length - 1; i >= 0; i--) {
                target.removeChild(addedNodes[i]!);
              }
            } else {
              (m.target as CharacterData).nodeValue = m.oldValue!;
            }
          }
          observer._flush();

          // Restore previous selection
          // Updating selection may schedule the next selectionchange event
          // It should be ignored especially in firefox not to confuse editor state
          selectionReverted = setSelectionToDOM(
            document,
            element,
            selection,
            parserConfig,
            true,
          );
        }

        if (inputTransaction) {
          updateSelection(inputTransaction[1]);
          apply(inputTransaction[0]);
          inputTransaction = null;
        }
        isComposing = false;
      };

      // spec compliant: keydown -> beforeinput -> input (-> keyup)
      // Safari (IME)  : beforeinput -> input -> keydown (-> keyup)
      // https://w3c.github.io/uievents/#events-keyboard-event-order
      // https://bugs.webkit.org/show_bug.cgi?id=165004
      const onKeyDown = (e: KeyboardEvent) => {
        if (isComposing) return;

        for (const handler of keydownHooks) {
          if (handler(e)) {
            e.preventDefault();
            observer._record(false);
            return;
          }
        }
      };

      const onInput = () => {
        if (!isComposing) {
          flushInput();
        }
      };
      const onBeforeInput = (e: InputEvent) => {
        e.preventDefault();

        const inputType = e.inputType as InputType;

        if (inputType.startsWith("format")) {
          // Ignore format inputs from document.execCommand() or shortcuts like mod+b.
          return;
        }
        if (inputType === "historyUndo" || inputType === "historyRedo") {
          // Cancel for now.
          return;
        }

        if (isComposing) {
          // Unfortunately, input events related to composition are not cancellable.
          // So we record mutations to DOM and revert them after composition ended.
          observer._record(true);
        } else {
          syncSelection();
        }

        const domRange = e.getTargetRanges()[0];
        if (domRange) {
          // Read input
          const range = serializeRange(element, parserConfig, domRange);
          let data =
            inputType === "insertParagraph" || inputType === "insertLineBreak"
              ? "\n"
              : e.data;
          if (data == null) {
            const dataTransfer = e.dataTransfer;
            if (dataTransfer) {
              // In some cases (e.g. insertReplacementText), dataTransfer contains text.
              data = dataTransfer.getData("text/plain");
            }
          }

          let tr: Transaction;
          if (!inputTransaction) {
            inputTransaction = [new Transaction(), selection];
          }
          tr = inputTransaction[0];
          if (comparePosition(...range) !== 0) {
            // replace or delete
            tr.delete(...range);
          }
          if (data) {
            // replace or insert
            tr.insertText(range[0], data);
          }
        }

        if (!isComposing) {
          flushInput();
        }
      };
      const onCompositionStart = () => {
        if (!isComposing) {
          syncSelection();
        }
        isComposing = true;
      };
      const onCompositionEnd = () => {
        flushInput();
      };

      const onFocus = () => {
        hasFocus = true;
        syncSelection();
      };
      const onBlur = () => {
        hasFocus = false;
      };

      const onSelectionChange = () => {
        if (selectionReverted) {
          selectionReverted = false;
          return;
        }
        // Safari may dispatch selectionchange event after dragstart
        if (hasFocus && !isComposing && !isDragging) {
          syncSelection();
        }
      };

      const copySelected = (dataTransfer: DataTransfer) => {
        syncSelection();
        if (comparePosition(...selection) !== 0) {
          copy(dataTransfer, sliceFragment(doc, ...toRange(selection)));
        }
      };

      const onCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        copySelected(e.clipboardData!);
      };
      const onCut = (e: ClipboardEvent) => {
        e.preventDefault();
        if (!readonly) {
          copySelected(e.clipboardData!);
          apply(new Transaction().delete(...toRange(selection)));
        }
      };
      const onPaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const pasted = paste(e.clipboardData!);
        if (pasted) {
          const [start, end] = toRange(selection);
          const tr = new Transaction().delete(start, end);
          if (isString(pasted)) {
            tr.insertText(start, pasted);
          } else {
            tr.insertFragment(start, pasted);
          }
          apply(tr);
        }
      };

      const onDrop = (e: DragEvent) => {
        e.preventDefault();

        const dataTransfer = e.dataTransfer;
        const droppedPosition = getPointedCaretPosition(
          document,
          element,
          e,
          parserConfig,
        );
        if (dataTransfer && droppedPosition) {
          let afterSelection: SelectionSnapshot | undefined;
          const tr = new Transaction();
          if (isDragging) {
            tr.delete(...toRange(selection));
          }
          const pasted = paste(dataTransfer);
          if (pasted) {
            const pos = tr.transform(droppedPosition);
            if (isString(pasted)) {
              tr.insertText(pos, pasted);
            } else {
              tr.insertFragment(pos, pasted);
            }
            afterSelection = [pos, tr.transform(droppedPosition)];
          }
          apply(tr);
          if (afterSelection) {
            updateSelection(afterSelection);
          }
        }
      };
      const onDragStart = (e: DragEvent) => {
        isDragging = true;
        copySelected(e.dataTransfer!);
      };
      const onDragEnd = () => {
        isDragging = false;
      };

      document.addEventListener("selectionchange", onSelectionChange);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("input", onInput);
      element.addEventListener("beforeinput", onBeforeInput);
      element.addEventListener("compositionstart", onCompositionStart);
      element.addEventListener("compositionend", onCompositionEnd);
      element.addEventListener("focus", onFocus);
      element.addEventListener("blur", onBlur);
      element.addEventListener("copy", onCopy);
      element.addEventListener("cut", onCut);
      element.addEventListener("paste", onPaste);
      element.addEventListener("drop", onDrop);
      element.addEventListener("dragstart", onDragStart);
      element.addEventListener("dragend", onDragEnd);

      const mountHooks = getHook("mount");
      const unmountHooks: (() => void)[] = [];
      mountHooks.forEach((mount) => {
        const cb = mount(element);
        if (cb) {
          unmountHooks.push(cb);
        }
      });

      return () => {
        if (disposed) return;
        disposed = true;

        cleanupOnChange();
        cleanupOnReadonly();

        element.contentEditable = prevContentEditable;
        element.role = prevRole;
        element.ariaMultiLine = prevAriaMultiLine;
        element.ariaReadOnly = prevAriaReadOnly;
        element.style.whiteSpace = prevWhiteSpace;

        observer._dispose();

        document.removeEventListener("selectionchange", onSelectionChange);
        element.removeEventListener("keydown", onKeyDown);
        element.removeEventListener("input", onInput);
        element.removeEventListener("beforeinput", onBeforeInput);
        element.removeEventListener("compositionstart", onCompositionStart);
        element.removeEventListener("compositionend", onCompositionEnd);
        element.removeEventListener("focus", onFocus);
        element.removeEventListener("blur", onBlur);
        element.removeEventListener("copy", onCopy);
        element.removeEventListener("cut", onCut);
        element.removeEventListener("paste", onPaste);
        element.removeEventListener("drop", onDrop);
        element.removeEventListener("dragstart", onDragStart);
        element.removeEventListener("dragend", onDragEnd);

        unmountHooks.forEach((cb) => {
          cb();
        });
      };
    },
  };

  const history = createHistory(editor);

  editor.on("change", () => {
    onChange(doc);
  });

  return editor;
};
