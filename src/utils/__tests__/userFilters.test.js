import { describe, it, expect } from "vitest";
import { matchesSearch, matchesFilters, filterUsers, sortUsers } from "../userFilters";
import { SORT_ORDERS } from "../constants";

const users = [
  { id: 1, firstName: "Leanne", lastName: "Graham", email: "leanne@april.biz", department: "Engineering" },
  { id: 2, firstName: "Ervin", lastName: "Howell", email: "ervin@melissa.tv", department: "Sales" },
  { id: 3, firstName: "Clementine", lastName: "Bauch", email: "clementine@yesenia.net", department: "Engineering" },
];

describe("matchesSearch", () => {
  it("matches on first name, case-insensitively", () => {
    expect(matchesSearch(users[0], "leanne")).toBe(true);
    expect(matchesSearch(users[0], "LEANNE")).toBe(true);
  });

  it("matches on last name", () => {
    expect(matchesSearch(users[0], "graham")).toBe(true);
  });

  it("matches on email", () => {
    expect(matchesSearch(users[0], "april.biz")).toBe(true);
  });

  it("returns false when nothing matches", () => {
    expect(matchesSearch(users[0], "nonexistent")).toBe(false);
  });

  it("treats an empty or whitespace-only query as matching everything", () => {
    expect(matchesSearch(users[0], "")).toBe(true);
    expect(matchesSearch(users[0], "   ")).toBe(true);
  });
});

describe("matchesFilters", () => {
  it("returns true when no filters are set", () => {
    expect(matchesFilters(users[0], {})).toBe(true);
  });

  it("filters by an exact department match", () => {
    expect(matchesFilters(users[0], { department: "Engineering" })).toBe(true);
    expect(matchesFilters(users[0], { department: "Sales" })).toBe(false);
  });

  it("filters by a partial, case-insensitive first name", () => {
    expect(matchesFilters(users[0], { firstName: "lea" })).toBe(true);
    expect(matchesFilters(users[0], { firstName: "xyz" })).toBe(false);
  });

  it("requires every populated field to match (AND, not OR)", () => {
    expect(matchesFilters(users[0], { firstName: "Leanne", department: "Sales" })).toBe(false);
    expect(matchesFilters(users[0], { firstName: "Leanne", department: "Engineering" })).toBe(true);
  });
});

describe("filterUsers", () => {
  it("combines search and filters together", () => {
    const result = filterUsers(users, {
      searchQuery: "e", // matches several users by substring
      filters: { department: "Engineering" },
    });
    expect(result.every((u) => u.department === "Engineering")).toBe(true);
  });

  it("returns the full list when no search or filters are applied", () => {
    expect(filterUsers(users, {})).toHaveLength(users.length);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterUsers(users, { searchQuery: "doesnotexist" })).toEqual([]);
  });
});

describe("sortUsers", () => {
  it("sorts ascending by firstName by default ordering", () => {
    const sorted = sortUsers(users, "firstName", SORT_ORDERS.ASC);
    expect(sorted.map((u) => u.firstName)).toEqual(["Clementine", "Ervin", "Leanne"]);
  });

  it("sorts descending when sortOrder is desc", () => {
    const sorted = sortUsers(users, "firstName", SORT_ORDERS.DESC);
    expect(sorted.map((u) => u.firstName)).toEqual(["Leanne", "Ervin", "Clementine"]);
  });

  it("sorts by an arbitrary field such as department", () => {
    const sorted = sortUsers(users, "department", SORT_ORDERS.ASC);
    expect(sorted.map((u) => u.department)).toEqual(["Engineering", "Engineering", "Sales"]);
  });

  it("does not mutate the original array", () => {
    const original = [...users];
    sortUsers(users, "firstName", SORT_ORDERS.DESC);
    expect(users).toEqual(original);
  });
});
