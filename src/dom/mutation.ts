/**
 * @internal
 */
export const createMutationObserver = (
  element: Element,
  onMutationIgnored: () => void,
) => {
  let isInputing = false;
  let isSilent = true;
  let queue: MutationRecord[] = [];

  const process = (records: MutationRecord[]) => {
    if (isInputing) {
      queue.push(...records);
    }
  };
  // https://dom.spec.whatwg.org/#interface-mutationobserver
  const mo = new MutationObserver((records) => {
    process(records);
    if (!isInputing || !isSilent) {
      onMutationIgnored();
    }
  });

  const sync = () => {
    process(mo.takeRecords());
  };

  const flush = (): MutationRecord[] => {
    sync();
    const prev = queue;
    queue = [];
    return prev;
  };

  mo.observe(element, {
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
  });

  return {
    _revert: (records: MutationRecord[]) => {
      let m: MutationRecord | undefined;
      while ((m = records.pop())) {
        if (m.type === "childList") {
          const { target, removedNodes, addedNodes, nextSibling } = m;
          for (let i = removedNodes.length - 1; i >= 0; i--) {
            target.insertBefore(removedNodes[i]!, nextSibling);
          }
          for (let i = addedNodes.length - 1; i >= 0; i--) {
            target.removeChild(addedNodes[i]!);
          }
        } else {
          (m.target as CharacterData).data = m.oldValue!;
        }
      }
      flush();
    },
    /**
     * @param silent if false, records mutations but still notifies them as ignored
     */
    _record: (enable: boolean, silent: boolean = true) => {
      if (!isInputing && enable) {
        sync();
      }
      isInputing = enable;
      isSilent = silent;
    },
    _flush: flush,
    _dispose: () => {
      queue.length = 0;
      mo.disconnect();
    },
  };
};
