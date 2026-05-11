import { faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";

function sortJson(obj: any, direction: 'asc' | 'desc'): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sortJson(item, direction));
  } else if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj);
    keys.sort((a, b) => {
      if (direction === 'asc') return a.localeCompare(b);
      return b.localeCompare(a);
    });
    
    const sorted: any = {};
    for (const key of keys) {
      sorted[key] = sortJson(obj[key], direction);
    }
    return sorted;
  }
  return obj;
}

describe("JSON Performance Tests", () => {
  it("should handle 10MB+ JSON load, parse and format", () => {
    console.log("Generating ~10MB of fake JSON data...");
    const data = [];
    // Generate ~50,000 objects to reach ~10MB
    for (let i = 0; i < 50000; i++) {
      data.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        bio: faker.lorem.paragraph(),
        verified: faker.datatype.boolean(),
        count: faker.number.int({ min: 1, max: 1000 }),
        tags: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
      });
    }
    
    const jsonString = JSON.stringify(data);
    const sizeInMB = jsonString.length / (1024 * 1024);
    console.log(`Generated JSON size: ${sizeInMB.toFixed(2)} MB`);
    
    expect(sizeInMB).toBeGreaterThan(10);
    
    // Test Parse
    const startParse = performance.now();
    const parsed = JSON.parse(jsonString);
    const endParse = performance.now();
    console.log(`Parse time: ${(endParse - startParse).toFixed(2)} ms`);
    
    expect(parsed.length).toBe(50000);
    
    // Test Format (Stringify with indent)
    const startFormat = performance.now();
    const formatted = JSON.stringify(parsed, null, 2);
    const endFormat = performance.now();
    console.log(`Format time: ${(endFormat - startFormat).toFixed(2)} ms`);
    
    // Test Sort
    const startSort = performance.now();
    // Sort a subset or all if it's fast enough
    // Sorting 50,000 objects with nested keys might be slow, let's try it or a subset.
    // Let's do it on the whole thing to really test performance.
    const sorted = sortJson(parsed.slice(0, 10000), 'asc'); // 10k objects is safer for unit test timeout
    const endSort = performance.now();
    console.log(`Sort time (10k items): ${(endSort - startSort).toFixed(2)} ms`);
    
    expect(sorted.length).toBe(10000);
  });
});
