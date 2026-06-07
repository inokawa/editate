/**
 * @internal
 */
export const createMutationObserver = (
  element: Element,
  onMutationIgnored: () => void,
) => {
  let isInputing = false;

  const queue: MutationRecord[] = [];
  const process = (records: MutationRecord[]) => {
    if (isInputing) {
      queue.push(...records);
    }
  };
  // https://dom.spec.whatwg.org/#interface-mutationobserver
  const mo = new MutationObserver((records) => {
    process(records);
    if (!isInputing) {
      onMutationIgnored();
    }
  });

  const sync = () => {
    process(mo.takeRecords());
  };

  const flush = (): MutationRecord[] => {
    sync();
    return queue.splice(0);
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
    _record: (enable: boolean) => {
      if (!isInputing && enable) {
        sync();
      }
      isInputing = enable;
    },
    _flush: flush,
    _dispose: () => {
      queue.length = 0;
      mo.disconnect();
    },
  };
};
