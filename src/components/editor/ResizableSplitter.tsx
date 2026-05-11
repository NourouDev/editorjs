import { createSignal, onCleanup } from "solid-js";

interface ResizableSplitterProps {
  onResize: (deltaX: number) => void;
}

export default function ResizableSplitter(props: ResizableSplitterProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  let startX = 0;

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX = e.clientX;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      startX = e.clientX;
      props.onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  onCleanup(() => {
    if (typeof document !== "undefined") {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  });

  return (
    <div
      class="flex-shrink-0 w-2 h-full relative group cursor-col-resize"
      onMouseDown={handleMouseDown}
    >
      {/* Visible track */}
      <div
        class={`absolute inset-y-0 -left-2 w-6 transition-colors ${
          isDragging()
            ? "bg-indigo-500/20"
            : "hover:bg-indigo-500/10"
        }`}
      />
      {/* Active line */}
      <div
        class={`absolute inset-y-0 left-0.5 w-1 transition-colors ${
          isDragging()
            ? "bg-indigo-500"
            : "bg-slate-200 dark:bg-slate-700 group-hover:bg-indigo-400"
        }`}
      />
    </div>
  );
}
