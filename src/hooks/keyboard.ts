export type KeyboardHook = (keyboard: KeyboardEvent) => boolean | void;

/**
 * TODO
 */
export const hotkey = (
  key: string,
  cb: (e: KeyboardEvent) => void,
  {
    mod,
    shift = false,
    alt = false,
  }: {
    mod?: boolean;
    // ctrl?: boolean;
    // meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    // phase?: 'down' | 'up';
  } = {},
): KeyboardHook => {
  key = key.toLowerCase();

  return (e): boolean | void => {
    // TODO should we handle it e.code?
    if (e.key.toLowerCase() === key) {
      if (
        // TODO detect OS
        (!mod || e.ctrlKey || e.metaKey) &&
        shift === e.shiftKey &&
        alt === e.altKey
      ) {
        cb(e);
        return true;
      }
    }
  };
};
