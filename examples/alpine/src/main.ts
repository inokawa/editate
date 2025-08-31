import Alpine from "alpinejs";
import { createPlainEditor } from "editate";

Alpine.directive("editable", (el, _, { cleanup }) => {
  const data = Alpine.$data(el) as { text: string };
  const editor = createPlainEditor({
    text: data.text,
    onChange: (v) => {
      data.text = v;
    },
  });
  const dispose = editor.input(el);
  cleanup(() => {
    dispose();
  });
});

(window as any).Alpine = Alpine;

Alpine.start();
