import { min } from "../utils.js";
import type { Path, Position, Range } from "./types.js";

/**
 * @internal
 * 0 : same
 * -1: A is before B (forward)
 *  1: A is after B (backward)
 */
export const comparePath = (pathA: Path, pathB: Path): 0 | 1 | -1 => {
  const length = min(pathA.length, pathB.length);
  for (let i = 0; i < length; i++) {
    const a = pathA[i]!;
    const b = pathB[i]!;
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
};

/**
 * @internal
 * 0 : same
 * -1: A is before B (forward)
 * 1 : A is after B (backward)
 */
export const comparePosition = (
  [pathA, offsetA]: Position,
  [pathB, offsetB]: Position,
): 0 | 1 | -1 => {
  const comp = comparePath(pathA, pathB);
  if (comp === 0) {
    return offsetA === offsetB ? 0 : offsetA < offsetB ? -1 : 1;
  } else {
    return comp;
  }
};

/**
 * @internal
 */
export const toRange = ([a, b]: readonly [Position, Position]): Range => {
  return comparePosition(a, b) === 1 ? [b, a] : [a, b];
};
