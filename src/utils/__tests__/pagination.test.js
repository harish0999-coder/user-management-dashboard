import { describe, it, expect } from "vitest";
import { paginate, getTotalPages, getPageWindow } from "../pagination";

const items = Array.from({ length: 23 }, (_, i) => i + 1); // [1..23]

describe("paginate", () => {
  it("returns the first page slice correctly", () => {
    expect(paginate(items, 1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("returns the second page slice correctly", () => {
    expect(paginate(items, 2, 10)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it("returns a partial final page when the count doesn't divide evenly", () => {
    expect(paginate(items, 3, 10)).toEqual([21, 22, 23]);
  });

  it("returns an empty array for a page beyond the data", () => {
    expect(paginate(items, 5, 10)).toEqual([]);
  });

  it("returns everything on one page when pageSize exceeds the item count", () => {
    expect(paginate(items, 1, 100)).toEqual(items);
  });
});

describe("getTotalPages", () => {
  it("rounds up for a partial last page", () => {
    expect(getTotalPages(23, 10)).toBe(3);
  });

  it("returns exactly 1 page when items divide evenly into one page size", () => {
    expect(getTotalPages(20, 20)).toBe(1);
  });

  it("never returns less than 1, even for zero items", () => {
    expect(getTotalPages(0, 10)).toBe(1);
  });
});

describe("getPageWindow", () => {
  it("shows every page when there are few total pages", () => {
    expect(getPageWindow(1, 4)).toEqual([1, 2, 3, 4]);
  });

  it("always includes the first and last page", () => {
    const window = getPageWindow(5, 20);
    expect(window[0]).toBe(1);
    expect(window[window.length - 1]).toBe(20);
  });

  it("inserts an ellipsis when there is a gap to the first page", () => {
    expect(getPageWindow(10, 20)).toContain("…");
  });

  it("includes neighbors around the current page", () => {
    const window = getPageWindow(10, 20);
    expect(window).toEqual(expect.arrayContaining([9, 10, 11]));
  });

  it("does not duplicate an ellipsis when the current page is near an edge", () => {
    const window = getPageWindow(1, 20);
    const ellipsisCount = window.filter((p) => p === "…").length;
    expect(ellipsisCount).toBeLessThanOrEqual(1);
  });
});
