import { describe, it, expect } from "vitest";

// Test the core JSON parsing logic (same as what runs in the worker)
function getErrorPosition(error: Error, text: string) {
  const positionMatch = error.message.match(/position (\d+)/);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const lines = text.slice(0, position).split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }
  return undefined;
}

// Validation
function validateJson(data: string): { success: boolean; error?: string; position?: { line: number; column: number } } {
  try {
    JSON.parse(data);
    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      position: getErrorPosition(e, data)
    };
  }
}

// Formatting
function formatJson(data: string, indent = 2): { success: boolean; formatted?: string; error?: string } {
  try {
    const obj = JSON.parse(data);
    return { success: true, formatted: JSON.stringify(obj, null, indent) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Minify
function minifyJson(data: string): { success: boolean; minified?: string; error?: string } {
  try {
    const obj = JSON.parse(data);
    return { success: true, minified: JSON.stringify(obj) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

describe("JSON Validation", () => {
  it("validates simple valid JSON object", () => {
    const result = validateJson('{"name": "test", "value": 123}');
    expect(result.success).toBe(true);
  });

  it("validates valid JSON array", () => {
    const result = validateJson('[1, 2, 3, "four"]');
    expect(result.success).toBe(true);
  });

  it("validates nested JSON", () => {
    const result = validateJson('{"user": {"name": "John", "scores": [10, 20, 30]}}');
    expect(result.success).toBe(true);
  });

  it("validates empty object", () => {
    const result = validateJson('{}');
    expect(result.success).toBe(true);
  });

  it("validates empty array", () => {
    const result = validateJson('[]');
    expect(result.success).toBe(true);
  });

  it("validates JSON with special characters", () => {
    const result = validateJson('{"message": "Hello\\nWorld", "path": "C:\\\\Users\\\\Test"}');
    expect(result.success).toBe(true);
  });

  it("fails on invalid JSON - missing quote", () => {
    const result = validateJson('{"name: "test"}');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("fails on invalid JSON - trailing comma", () => {
    const result = validateJson('{"name": "test",}');
    expect(result.success).toBe(false);
  });

  it("fails on invalid JSON - single quotes", () => {
    const result = validateJson("{'name': 'test'}");
    expect(result.success).toBe(false);
  });

  it("fails on invalid JSON - undefined", () => {
    const result = validateJson('{"value": undefined}');
    expect(result.success).toBe(false);
  });

  it("fails on invalid JSON - unclosed object", () => {
    const result = validateJson('{"name": "test"');
    expect(result.success).toBe(false);
  });

  it("fails on invalid JSON - extra comma", () => {
    const result = validateJson('[1, 2, 3,,]');
    expect(result.success).toBe(false);
  });
});

describe("JSON Formatting", () => {
  it("formats simple JSON with 2-space indent", () => {
    const result = formatJson('{"name":"test","value":123}');
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('  "name": "test"');
  });

  it("formats simple JSON with 4-space indent", () => {
    const result = formatJson('{"name":"test"}', 4);
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('    "name": "test"');
  });

  it("formats nested JSON", () => {
    const result = formatJson('{"user":{"name":"John","scores":[10,20,30]}}');
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('  "user": {');
    expect(result.formatted).toContain('    "scores": [');
  });

  it("formats JSON array", () => {
    const result = formatJson('[1,2,3]');
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('  1');
    expect(result.formatted).toContain('  3');
  });

  it("fails to format invalid JSON", () => {
    const result = formatJson('not json');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("preserves string content exactly", () => {
    const input = '{"message":"Hello World"}';
    const result = formatJson(input);
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('"Hello World"');
  });

  it("handles large numbers correctly", () => {
    const result = formatJson('{"big": 9007199254740991}');
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('9007199254740991');
  });

  it("handles unicode characters", () => {
    const result = formatJson('{"emoji":"Hello 👋"}');
    expect(result.success).toBe(true);
    expect(result.formatted).toContain('👋');
  });
});

describe("JSON Minify", () => {
  it("minifies formatted JSON", () => {
    const result = minifyJson('{\n  "name": "test",\n  "value": 123\n}');
    expect(result.success).toBe(true);
    expect(result.minified).toBe('{"name":"test","value":123}');
  });

  it("minifies simple JSON", () => {
    const result = minifyJson('{"name":"test"}');
    expect(result.minified).toBe('{"name":"test"}');
  });

  it("fails to minify invalid JSON", () => {
    const result = minifyJson('not json');
    expect(result.success).toBe(false);
  });
});

describe("Error Position Detection", () => {
  it("detects error at start of string", () => {
    const error = new Error("Unexpected token 'i', \"invalid\" is not valid JSON at position 0");
    const pos = getErrorPosition(error, 'invalid');
    expect(pos).toBeDefined();
    expect(pos?.line).toBe(1);
    expect(pos?.column).toBe(1);
  });
 
  it("detects error position in middle of string", () => {
    const input = '{"name": "test", invalid}';
    const error = new Error("Unexpected token 'i', \"... invalid}\" is not valid JSON at position 17");
    const pos = getErrorPosition(error, input);
    expect(pos).toBeDefined();
    expect(pos?.line).toBe(1);
  });
});

describe("Edge Cases", () => {
  it("handles deeply nested JSON", () => {
    let deep = '{"a":{"b":{"c":{"d":{"e":"value"}}}}}';
    const result = validateJson(deep);
    expect(result.success).toBe(true);
  });

  it("handles large JSON array", () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);
    const result = validateJson(JSON.stringify(arr));
    expect(result.success).toBe(true);
  });

  it("handles JSON with null values", () => {
    const result = validateJson('{"value": null, "empty": null}');
    expect(result.success).toBe(true);
  });

  it("handles JSON with boolean values", () => {
    const result = validateJson('{"active": true, "deleted": false}');
    expect(result.success).toBe(true);
  });

  it("handles numbers at extremes", () => {
    const result = validateJson('{"min": -1e308, "max": 1e308, "tiny": 1e-308}');
    expect(result.success).toBe(true);
  });
});
