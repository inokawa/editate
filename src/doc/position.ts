import type { Range, Selection } from "./types.js";

/**
 * @internal
 */
export const toRange = ([a, b]: Selection | Range): Range => {
  return a > b ? [b, a] : [a, b];
};

/**
 * @internal
 */
export const isCollapsed = ([a, b]: Selection | Range): boolean => {
  return a === b;
};

/**
 * @internal
 */
export const hasIntersection = (
  [aStart, aEnd]: Range,
  [bStart, bEnd]: Range,
): boolean => {
  // ignore edge for now
  return aStart < bEnd && bStart < aEnd;
};
