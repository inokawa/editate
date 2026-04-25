import { BrowserContext, Locator } from "@playwright/test";
import * as esbuild from "esbuild";
import * as path from "node:path";
import { SelectionSnapshot } from "../src/doc/types.ts";

declare global {
  interface Window {
    edix: typeof import("../src/dom/index.ts");
  }
}

const edixDom = esbuild
  .build({
    entryPoints: [path.join(import.meta.dirname, "../src/dom/index.ts")],
    bundle: true,
    write: false,
    format: "iife",
    globalName: "edix",
  })
  .then((r) => r.outputFiles[0].text);

export const initEdixHelpers = async (context: BrowserContext) => {
  await context.addInitScript(`
    ${await edixDom}
    window.edix = edix;
    `);
};

export const NON_EDITABLE_PLACEHOLDER = "$";

export const getText = async (
  editable: Locator,
  config: { blockTag?: string } = {},
): Promise<string[]> => {
  return editable.evaluate(
    (element, [NON_EDITABLE_PLACEHOLDER, { blockTag }]) => {
      const document = element.ownerDocument;
      return window.edix
        .domToFragment(
          element,
          {
            _document: document,
            _isBlock: blockTag
              ? (n) => n.tagName === blockTag.toUpperCase()
              : window.edix.defaultIsBlockNode,
            _isVoid: window.edix.defaultIsVoidNode,
          },
          (text) => ({ text }),
          () => ({}),
        )
        .map((r) => {
          return r.children.reduce<string>((acc, n) => {
            return acc + ("text" in n ? n.text : NON_EDITABLE_PLACEHOLDER);
          }, "");
        });
    },
    [NON_EDITABLE_PLACEHOLDER, config] as const,
  );
};

export const getSeletedText = (
  editable: Locator,
  config: { blockTag?: string } = {},
): Promise<string[]> => {
  return editable.evaluate(
    (element, [NON_EDITABLE_PLACEHOLDER, { blockTag }]) => {
      const document = element.ownerDocument;
      const selection = document.getSelection()!;
      const range = selection.getRangeAt(0)!.cloneContents();
      return window.edix
        .domToFragment(
          range,
          {
            _document: document,
            _isBlock: blockTag
              ? (n) => n.tagName === blockTag.toUpperCase()
              : window.edix.defaultIsBlockNode,
            _isVoid: window.edix.defaultIsVoidNode,
          },
          (text) => ({ text }),
          () => ({}),
        )
        .map((r) => {
          return r.children.reduce<string>((acc, n) => {
            return acc + ("text" in n ? n.text : NON_EDITABLE_PLACEHOLDER);
          }, "");
        });
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
    return window.edix.takeSelectionSnapshot(element, {
      _document: element.ownerDocument,
      _isBlock: blockTag
        ? (n) => n.tagName === blockTag.toUpperCase()
        : window.edix.defaultIsBlockNode,
      _isVoid: window.edix.defaultIsVoidNode,
    });
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
//               js: window.edix.serializeRange(
//                 e,
//                 {
//                   _document: e.ownerDocument,
//                   _isBlock: window.edix.defaultIsBlockNode,
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
