/**
 * SideBySideDiff.tsx — Real code-editor style diff
 *
 * Features:
 * - Side-by-side layout (left=OLD, right=NEW)
 * - Synchronized scroll
 * - Empty placeholder rows to keep lines aligned
 * - Character-level highlighting inside changed lines (like VSCode)
 * - Proper gutter with line numbers and +/- signs
 */

import { For, createMemo, onMount, onCleanup } from "solid-js";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

interface CharSpan {
  text: string;
  changed: boolean;
}

interface AlignedRow {
  left: {
    content: string;
    lineNum: number;
    type: "removed" | "unchanged";
    charSpans?: CharSpan[];
  } | null; // null = empty placeholder
  right: {
    content: string;
    lineNum: number;
    type: "added" | "unchanged";
    charSpans?: CharSpan[];
  } | null;
}

// ── Character-level diff (Myers/LCS on chars) ─────────────────────────────────

function charDiff(oldStr: string, newStr: string): { oldSpans: CharSpan[]; newSpans: CharSpan[] } {
  // LCS on words (token-level is faster and more readable than pure char)
  const tokenize = (s: string) => s.split(/(\s+|[{}[\],:"]+)/g).filter(t => t.length > 0);
  const a = tokenize(oldStr);
  const b = tokenize(newStr);

  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);

  // Trace back
  const oldSpans: CharSpan[] = [];
  const newSpans: CharSpan[] = [];
  let i = m, j = n;
  const ops: Array<{ type: "same" | "del" | "ins"; text: string }> = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) {
      ops.unshift({ type: "same", text: a[i-1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      ops.unshift({ type: "ins", text: b[j-1] });
      j--;
    } else {
      ops.unshift({ type: "del", text: a[i-1] });
      i--;
    }
  }

  for (const op of ops) {
    if (op.type === "same") {
      oldSpans.push({ text: op.text, changed: false });
      newSpans.push({ text: op.text, changed: false });
    } else if (op.type === "del") {
      oldSpans.push({ text: op.text, changed: true });
    } else {
      newSpans.push({ text: op.text, changed: true });
    }
  }

  return { oldSpans, newSpans };
}

// ── Align diff lines into rows ─────────────────────────────────────────────────

function alignDiff(lines: DiffLine[]): AlignedRow[] {
  const rows: AlignedRow[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.type === "unchanged") {
      rows.push({
        left:  { content: line.content, lineNum: line.oldLineNum!, type: "unchanged" },
        right: { content: line.content, lineNum: line.newLineNum!, type: "unchanged" },
      });
      i++;
      continue;
    }

    // Collect a consecutive block of removed/added lines
    const removed: DiffLine[] = [];
    const added:   DiffLine[] = [];
    while (i < lines.length && lines[i].type !== "unchanged") {
      if (lines[i].type === "removed") removed.push(lines[i]);
      else                             added.push(lines[i]);
      i++;
    }

    const maxLen = Math.max(removed.length, added.length);
    for (let k = 0; k < maxLen; k++) {
      const rem = removed[k];
      const add = added[k];

      // Compute character diff for paired lines
      let oldSpans: CharSpan[] | undefined;
      let newSpans: CharSpan[] | undefined;
      if (rem && add) {
        const d = charDiff(rem.content, add.content);
        oldSpans = d.oldSpans;
        newSpans = d.newSpans;
      }

      rows.push({
        left:  rem ? { content: rem.content, lineNum: rem.oldLineNum!, type: "removed", charSpans: oldSpans } : null,
        right: add ? { content: add.content, lineNum: add.newLineNum!, type: "added",   charSpans: newSpans } : null,
      });
    }
  }

  return rows;
}

// ── Render a line with character-level highlights ──────────────────────────────

function SpannedLine(props: { spans: CharSpan[]; side: "left" | "right" }) {
  return (
    <span>
      <For each={props.spans}>
        {(span) => (
          <span
            class={span.changed
              ? props.side === "left"
                ? "bg-red-300/50 dark:bg-red-500/30 rounded-sm"
                : "bg-emerald-300/50 dark:bg-emerald-500/30 rounded-sm"
              : ""}
          >
            {span.text}
          </span>
        )}
      </For>
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SideBySideDiffProps {
  lines: DiffLine[];
}

const LINE_H = 22;

export default function SideBySideDiff(props: SideBySideDiffProps) {
  let leftRef!:  HTMLDivElement;
  let rightRef!: HTMLDivElement;
  let syncL = false, syncR = false;

  const rows = createMemo(() => alignDiff(props.lines));

  const onLeftScroll = () => {
    if (syncR) return;
    syncL = true;
    rightRef.scrollTop  = leftRef.scrollTop;
    rightRef.scrollLeft = leftRef.scrollLeft;
    syncL = false;
  };
  const onRightScroll = () => {
    if (syncL) return;
    syncR = true;
    leftRef.scrollTop  = rightRef.scrollTop;
    leftRef.scrollLeft = rightRef.scrollLeft;
    syncR = false;
  };

  onMount(() => {
    leftRef.addEventListener("scroll",  onLeftScroll,  { passive: true });
    rightRef.addEventListener("scroll", onRightScroll, { passive: true });
    onCleanup(() => {
      leftRef.removeEventListener("scroll",  onLeftScroll);
      rightRef.removeEventListener("scroll", onRightScroll);
    });
  });

  // ── Style helpers ────────────────────────────────────────────────────────
  const rowBg = (type: string | undefined) =>
    type === "removed" ? "bg-red-50 dark:bg-[#3d1515]"
    : type === "added"  ? "bg-emerald-50 dark:bg-[#122318]"
    : "";

  const gutterBg = (type: string | undefined) =>
    type === "removed" ? "bg-red-100/80 dark:bg-red-900/30"
    : type === "added"  ? "bg-emerald-100/80 dark:bg-emerald-900/30"
    : "bg-slate-100/60 dark:bg-slate-900/50";

  const gutterText = (type: string | undefined) =>
    type === "removed" ? "text-red-400 dark:text-red-500"
    : type === "added"  ? "text-emerald-500 dark:text-emerald-400"
    : "text-slate-400 dark:text-slate-600";

  const signChar = (type: string | undefined) =>
    type === "removed" ? "−" : type === "added" ? "+" : "";

  const signColor = (type: string | undefined) =>
    type === "removed" ? "text-red-400 dark:text-red-500 font-bold"
    : type === "added"  ? "text-emerald-500 dark:text-emerald-400 font-bold"
    : "";

  const textColor = (type: string | undefined) =>
    type === "removed" ? "text-slate-800 dark:text-red-100"
    : type === "added"  ? "text-slate-800 dark:text-emerald-100"
    : "text-slate-700 dark:text-slate-300";

  const PanelCol = (side: "left" | "right") => (row: AlignedRow) => {
    const cell = side === "left" ? row.left : row.right;
    const type = cell?.type;

    return (
      <tr class={`border-b border-slate-100/80 dark:border-slate-800/50 ${rowBg(type)}`}
          style={{ height: `${LINE_H}px` }}>
        {/* Line number gutter */}
        <td class={`${gutterBg(type)} ${gutterText(type)} select-none text-right pr-2 pl-2 text-[11px] font-mono border-r border-slate-200 dark:border-slate-700/60 w-10 whitespace-nowrap`}
            style={{ "min-width": "2.5rem", height: `${LINE_H}px`, "line-height": `${LINE_H}px` }}>
          {cell?.lineNum ?? ""}
        </td>
        {/* +/- sign */}
        <td class={`${gutterBg(type)} ${signColor(type)} select-none text-center w-5 border-r border-slate-200 dark:border-slate-700/60 text-[12px]`}
            style={{ width: "1.25rem", height: `${LINE_H}px`, "line-height": `${LINE_H}px` }}>
          {signChar(type)}
        </td>
        {/* Content */}
        <td class={`${textColor(type)} pl-4 pr-6 font-mono text-[13px] whitespace-pre overflow-hidden`}
            style={{ height: `${LINE_H}px`, "line-height": `${LINE_H}px` }}>
          {cell
            ? cell.charSpans
              ? <SpannedLine spans={cell.charSpans} side={side} />
              : cell.content || " "
            : <span class="opacity-0">·</span>  /* placeholder row */
          }
        </td>
      </tr>
    );
  };

  return (
    <div class="flex h-full overflow-hidden select-text bg-white dark:bg-[#0d1117]">

      {/* ── LEFT (OLD) ───────────────────────────────────────────────── */}
      <div ref={leftRef!} class="flex-1 min-w-0 overflow-auto border-r-2 border-slate-200 dark:border-slate-700">
        {/* Sticky header */}
        <div class="sticky top-0 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 select-none">
          <span class="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Original</span>
        </div>
        <table class="w-full border-collapse">
          <tbody>
            <For each={rows()}>{PanelCol("left")}</For>
          </tbody>
        </table>
      </div>

      {/* ── RIGHT (NEW) ──────────────────────────────────────────────── */}
      <div ref={rightRef!} class="flex-1 min-w-0 overflow-auto">
        {/* Sticky header */}
        <div class="sticky top-0 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 select-none">
          <span class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Modified</span>
        </div>
        <table class="w-full border-collapse">
          <tbody>
            <For each={rows()}>{PanelCol("right")}</For>
          </tbody>
        </table>
      </div>

    </div>
  );
}
