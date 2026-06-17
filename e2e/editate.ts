import { BrowserContext, Locator } from "@playwright/test";
import * as esbuild from "esbuild";
import * as path from "node:path";
import { SelectionSnapshot } from "../src/doc/types.ts";
import { TokenType } from "../src/dom/parser.ts";

declare global {
  interface Window {
    editate: typeof import("../src/dom/index.ts");
  }
}

const editateDom = esbuild
  .build({
    entryPoints: [path.join(import.meta.dirname, "../src/dom/index.ts")],
    bundle: true,
    write: false,
    format: "iife",
    globalName: "editate",
  })
  .then((r) => r.outputFiles[0].text);

export const initEditateHelpers = async (context: BrowserContext) => {
  await context.addInitScript(`
    ${await editateDom}
    window.editate = editate;
    `);
};

export const NON_EDITABLE_PLACEHOLDER = "$";

export const getText = async (
  editable: Locator,
  config: { blockTag?: string; selected?: boolean } = {},
): Promise<string[]> => {
  return editable.evaluate(
    (element, [NON_EDITABLE_PLACEHOLDER, { blockTag, selected }]) => {
      const document = element.ownerDocument;
      let target: Node = element;
      if (selected) {
        const selection = document.getSelection()!;
        target = selection.getRangeAt(0)!.cloneContents();
      }

      const {
        createParser,
        defaultIsBlockNode,
        TOKEN_BLOCK,
        TOKEN_TEXT,
        TOKEN_VOID,
        TOKEN_SOFT_BREAK,
      } = window.editate;

      const parse = createParser(
        document,
        blockTag
          ? (n) => n.tagName === blockTag.toUpperCase()
          : defaultIsBlockNode,
      );

      return parse(({ _next: next, _domNode: domNode }) => {
        let type: TokenType | void;
        let row: string[] | null = null;
        let text = "";
        let hasContent = false;

        const rows: string[] = [];

        const completeText = () => {
          if (text) {
            if (!row) {
              row = [];
            }
            row.push(text);
            text = "";
          }
        };
        const completeRow = () => {
          completeText();
          if (!row && hasContent) {
            row = [];
          }
          if (row) {
            rows.push(row.join(""));
          }
          row = null;
          hasContent = false;
        };

        while ((type = next())) {
          if (type === TOKEN_BLOCK) {
            completeRow();
          } else {
            hasContent = true;

            if (type === TOKEN_TEXT) {
              text += domNode<typeof type>().data;
            } else if (type === TOKEN_VOID) {
              completeText();
              row!.push(NON_EDITABLE_PLACEHOLDER);
            } else if (type === TOKEN_SOFT_BREAK) {
              completeRow();
            }
          }
        }
        completeRow();

        if (!rows.length) {
          rows.push("");
        }

        return rows;
      }, target);
    },
    [NON_EDITABLE_PLACEHOLDER, config] as const,
  );
};

export const waitForStyleSet = (
  editable: Locator,
  key: keyof CSSStyleDeclaration,
  value: string,
  unset?: boolean,
): Promise<boolean> => {
  return editable.evaluate(
    (element, [key, value, unset]) => {
      return new Promise<boolean>((resolve) => {
        const stringToStyle = (s: string): CSSStyleDeclaration => {
          const e = document.createElement("div");
          e.style.cssText = s;
          return e.style;
        };
        const mo = new MutationObserver((records) => {
          for (const r of records) {
            if (r.type === "attributes") {
              if (
                r.attributeName === "style" &&
                (unset
                  ? stringToStyle(r.oldValue!)
                  : (r.target as HTMLElement).style)[key] === value
              ) {
                mo.disconnect();
                resolve(true);
              }
            } else if (r.type === "childList") {
              if (
                (unset ? [...r.removedNodes] : [...r.addedNodes]).some(
                  (e) => (e as HTMLElement).style[key] === value,
                )
              ) {
                mo.disconnect();
                resolve(true);
              }
            }
          }
        });
        mo.observe(element, {
          subtree: true,
          attributes: true,
          attributeFilter: ["style"],
          attributeOldValue: true,
          childList: true,
        });
      });
    },
    [key, value, unset] as const,
  );
};

export const getSelection = (
  editable: Locator,
  config: { blockTag?: string } = {},
): Promise<SelectionSnapshot> => {
  return editable.evaluate((element, { blockTag }) => {
    return window.editate.takeSelectionSnapshot(
      element,
      window.editate.createParser(
        element.ownerDocument,
        blockTag
          ? (n) => n.tagName === blockTag.toUpperCase()
          : window.editate.defaultIsBlockNode,
      ),
    );
  }, config);
};

export const getSelectedRect = (editable: Locator): Promise<DOMRect> => {
  return editable.evaluate((element) => {
    const selection = element.ownerDocument.getSelection()!;
    return selection.getRangeAt(0)!.getBoundingClientRect();
  });
};

export const moveSelectionToOrigin = (editable: Locator) => {
  return editable.evaluate((element) => {
    const selection = element.ownerDocument.getSelection()!;
    selection.setBaseAndExtent(element, 0, element, 0);
  });
};

export const deleteAt = (
  value: readonly string[],
  length: number,
  [line, offset]: readonly [line: number, offset: number],
): string[] => {
  return value.map((r, i) =>
    i === line ? r.slice(0, offset) + r.slice(offset + length) : r,
  );
};

export const insertAt = (
  value: readonly string[],
  text: string,
  [line, offset]: readonly [line: number, offset: number],
): string[] => {
  return value.map((r, i) =>
    i === line ? r.slice(0, offset) + text + r.slice(offset) : r,
  );
};

export const replaceAt = (
  value: readonly string[],
  insertedText: string,
  deleteLength: number,
  pos: readonly [line: number, offset: number],
): string[] => {
  return insertAt(deleteAt(value, deleteLength, pos), insertedText, pos);
};

export const insertLineBreakAt = (
  value: readonly string[],
  [line, offset]: readonly [line: number, offset: number],
): string[] => {
  return value.flatMap((r, i) => {
    if (i === line) {
      return [r.slice(0, offset), r.slice(offset)];
    }
    return r;
  });
};

// export const logInput = (editable: Locator) =>
//   editable.evaluate((e) => {
//     return new Promise<[string, string, any, any, any]>((res) => {
//       e.addEventListener(
//         "beforeinput",
//         (ev: Event) => {
//           const range = (ev as InputEvent).getTargetRanges()[0];
//           const serializeRange = (range: AbstractRange) => {
//             const serializeNode = (node: Node) => {
//               const nodeName = node.nodeName;
//               return JSON.stringify([
//                 nodeName,
//                 node.nodeType === 3
//                   ? (node as Text).data
//                   : [...(node as Element).childNodes].map(serializeNode),
//               ]);
//             };
//             return {
//               startContainer: serializeNode(range.startContainer),
//               startOffset: range.startOffset,
//               endContainer: serializeNode(range.endContainer),
//               endOffset: range.endOffset,
//               js: window.editate.serializeRange(
//                 e,
//                 {
//                   _document: e.ownerDocument,
//                   _isBlock: window.editate.defaultIsBlockNode,
//                 },
//                 range
//               ),
//             } as const;
//           };

//           const targetRange = serializeRange(range);
//           const prevSelection = serializeRange(
//             e.ownerDocument.getSelection()!.getRangeAt(0)!
//           );

//           e.addEventListener(
//             "input",
//             () => {
//               res([
//                 e.innerHTML,
//                 (ev as InputEvent).inputType,
//                 targetRange,
//                 prevSelection,
//                 serializeRange(e.ownerDocument.getSelection()!.getRangeAt(0)!),
//               ]);
//             },
//             {
//               once: true,
//               capture: true,
//             }
//           );
//         },
//         {
//           once: true,
//           capture: true,
//         }
//       );
//     });
//   });
