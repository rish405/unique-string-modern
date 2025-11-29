import { describe, it, expect } from "vitest";
import uniqueString, { uniqueStringAsync } from "../src";

const charset = /^[A-Za-z0-9_-]+$/;

describe("uniqueString", () => {
  it("generates default length (22) URL-safe string", () => {
    const id = uniqueString();
    expect(id.length).toBe(22);
    expect(charset.test(id)).toBe(true);
    expect(id.includes("=")).toBe(false);
  });

  it("respects custom length", () => {
    const id = uniqueString(10);
    expect(id.length).toBe(10);
    expect(charset.test(id)).toBe(true);
  });

  it("has very low collision rate in 1000 samples", () => {
    const set = new Set<string>();
    for (let i = 0; i < 1000; i++) set.add(uniqueString());
    expect(set.size).toBe(1000);
  });
});

describe("uniqueStringAsync", () => {
  it("generates default length asynchronously", async () => {
    const id = await uniqueStringAsync();
    expect(id.length).toBe(22);
    expect(charset.test(id)).toBe(true);
  });

  it("supports concurrent calls", async () => {
    const ids = await Promise.all([uniqueStringAsync(12), uniqueStringAsync(12), uniqueStringAsync(12)]);
    expect(new Set(ids).size).toBe(3);
    ids.forEach((id) => expect(charset.test(id)).toBe(true));
  });
});

