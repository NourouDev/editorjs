import { describe, it, expect } from "vitest";

// LCS-based diff algorithm (same as in JsonFormatter)
interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const lcsMatrix: number[][] = [];
  for (let i = 0; i <= oldLines.length; i++) {
    lcsMatrix[i] = [];
    for (let j = 0; j <= newLines.length; j++) {
      if (i === 0 || j === 0) {
        lcsMatrix[i][j] = 0;
      } else if (oldLines[i - 1] === newLines[j - 1]) {
        lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1;
      } else {
        lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]);
      }
    }
  }

  const stack: DiffLine[] = [];
  let i = oldLines.length;
  let j = newLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: "unchanged", content: oldLines[i - 1], oldLineNum: i, newLineNum: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
      stack.push({ type: "added", content: newLines[j - 1], newLineNum: j });
      j--;
    } else {
      stack.push({ type: "removed", content: oldLines[i - 1], oldLineNum: i });
      i--;
    }
  }
  stack.reverse();
  return stack;
}

describe("JSON Diff", () => {
  it("returns empty diff for identical JSON", () => {
    const json = '{"name": "test", "value": 123}';
    const result = computeDiff(json, json);
    expect(result.every(l => l.type === "unchanged")).toBe(true);
    expect(result.length).toBe(1);
  });

  it("detects added line", () => {
    const oldText = '{"name": "test"}';
    const newText = '{"name": "test", "value": 123}';
    const result = computeDiff(oldText, newText);
    const added = result.filter(l => l.type === "added");
    expect(added.length).toBe(1);
    expect(added[0].content).toContain('"value"');
  });

  it("detects removed line", () => {
    const oldText = '{"name": "test", "value": 123}';
    const newText = '{"name": "test"}';
    const result = computeDiff(oldText, newText);
    const removed = result.filter(l => l.type === "removed");
    expect(removed.length).toBe(1);
    expect(removed[0].content).toContain('"value"');
  });

  it("detects multiple changes", () => {
    const oldText = '{\n  "a": 1,\n  "b": 2\n}';
    const newText = '{\n  "a": 1,\n  "c": 3,\n  "b": 2\n}';
    const result = computeDiff(oldText, newText);
    expect(result.some(l => l.type === "added")).toBe(true);
  });

  it("handles empty old text", () => {
    const result = computeDiff("", '{"name": "test"}');
    expect(result.every(l => l.type === "added")).toBe(true);
  });

  it("handles empty new text", () => {
    const result = computeDiff('{"name": "test"}', "");
    expect(result.every(l => l.type === "removed")).toBe(true);
  });

  it("marks unchanged lines correctly", () => {
    const oldText = 'line1\nline2\nline3';
    const newText = 'line1\nmodified\nline3';
    const result = computeDiff(oldText, newText);
    const unchanged = result.filter(l => l.type === "unchanged");
    expect(unchanged.length).toBe(2);
  });

  it("preserves line numbers for unchanged lines", () => {
    const oldText = 'line1\nline2\nline3';
    const newText = 'line1\nline2\nline3';
    const result = computeDiff(oldText, newText);
    expect(result[0].oldLineNum).toBe(1);
    expect(result[0].newLineNum).toBe(1);
  });
});
