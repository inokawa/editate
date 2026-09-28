import { BrowserContext, Locator } from "@playwright/test";
import * as path from "node:path";
import { build } from "rolldown";
import { DomPosition } from "../src/doc/types.ts";
import { TokenType } from "../src/dom/parser.ts";

declare global {
  interface Window {
    editate: typeof import("../src/dom/index.ts");
  }
}

const editateDom = build({
  input: path.join(import.meta.dirname, "../src/dom/index.ts"),
  write: false,
  output: { format: "iife", name: "editate" },
}).then((r) => r.output[0].code);

export const initEditateHelpers = async (context: BrowserContext) => {
  await context.addInitScript(`
    ${await editateDom}
    window.editate = editate;
    `);
};

const NON_EDITABLE_PLACEHOLDER = "$";

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
              if (!row) {
                row = [];
              }
              row.push(NON_EDITABLE_PLACEHOLDER);
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

export const getSelection = async (
  editable: Locator,
  config: { blockTag?: string } = {},
): Promise<[number, number]> => {
  const lines = await getText(editable, { blockTag: config.blockTag });
  const selection = await editable.evaluate((element, { blockTag }) => {
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

  const tranformPos = ([path, offset]: DomPosition): number => {
    const p = path.length ? path[0]! : 0;
    for (let i = 0; i < p; i++) {
      const length = lines[i]!.length;
      offset += length;
      if (i !== lines.length - 1) {
        offset++;
      }
    }
    return offset;
  };
  return [tranformPos(selection[0]), tranformPos(selection[1])];
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
