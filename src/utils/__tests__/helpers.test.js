import { describe, it, expect } from "vitest";
import {
  splitName,
  assignDepartment,
  mapApiUserToUser,
  mapUserToApiPayload,
  getDepartmentColor,
  getInitials,
} from "../helpers";
import { DEPARTMENTS } from "../constants";

describe("splitName", () => {
  it("splits a standard two-word name on the first space", () => {
    expect(splitName("Leanne Graham")).toEqual({ firstName: "Leanne", lastName: "Graham" });
  });

  it("treats everything after the first space as the last name", () => {
    expect(splitName("Mary Jane Watson")).toEqual({
      firstName: "Mary",
      lastName: "Jane Watson",
    });
  });

  it("falls back to an empty last name for a single-word name", () => {
    expect(splitName("Madonna")).toEqual({ firstName: "Madonna", lastName: "" });
  });

  it("trims surrounding whitespace before splitting", () => {
    expect(splitName("  Leanne Graham  ")).toEqual({ firstName: "Leanne", lastName: "Graham" });
  });

  it("handles an empty string without throwing", () => {
    expect(splitName("")).toEqual({ firstName: "", lastName: "" });
  });

  it("handles an undefined input via the default parameter", () => {
    expect(splitName()).toEqual({ firstName: "", lastName: "" });
  });
});

describe("assignDepartment", () => {
  it("is deterministic — the same id always maps to the same department", () => {
    expect(assignDepartment(3)).toBe(assignDepartment(3));
  });

  it("cycles through the department list as ids increase", () => {
    const results = [1, 2, 3, 4, 5, 6, 7].map(assignDepartment);
    // id 7 should wrap back around to the same department as id 1
    expect(results[6]).toBe(results[0]);
  });

  it("only ever returns a value from the known DEPARTMENTS list", () => {
    for (let id = 1; id <= 20; id += 1) {
      expect(DEPARTMENTS).toContain(assignDepartment(id));
    }
  });
});

describe("mapApiUserToUser", () => {
  it("maps a raw JSONPlaceholder user into the app's flat user shape", () => {
    const apiUser = {
      id: 1,
      name: "Leanne Graham",
      email: "Sincere@april.biz",
    };

    const mapped = mapApiUserToUser(apiUser);

    expect(mapped).toEqual({
      id: 1,
      firstName: "Leanne",
      lastName: "Graham",
      email: "Sincere@april.biz",
      department: assignDepartment(1),
    });
  });

  it("defaults email to an empty string when missing from the API payload", () => {
    const mapped = mapApiUserToUser({ id: 2, name: "Ervin Howell" });
    expect(mapped.email).toBe("");
  });
});

describe("mapUserToApiPayload", () => {
  it("recombines firstName/lastName into a single name field", () => {
    const payload = mapUserToApiPayload({
      firstName: "Leanne",
      lastName: "Graham",
      email: "leanne@example.com",
      department: "Engineering",
    });

    expect(payload.name).toBe("Leanne Graham");
    expect(payload.email).toBe("leanne@example.com");
    expect(payload.department).toBe("Engineering");
  });

  it("trims a trailing space when lastName is empty", () => {
    const payload = mapUserToApiPayload({ firstName: "Madonna", lastName: "", email: "m@example.com" });
    expect(payload.name).toBe("Madonna");
  });
});

describe("getDepartmentColor", () => {
  it("is deterministic — the same department always returns the same color", () => {
    expect(getDepartmentColor("Engineering")).toEqual(getDepartmentColor("Engineering"));
  });

  it("returns a bg/fg pair for every known department", () => {
    DEPARTMENTS.forEach((dept) => {
      const color = getDepartmentColor(dept);
      expect(color).toHaveProperty("bg");
      expect(color).toHaveProperty("fg");
    });
  });
});

describe("getInitials", () => {
  it("returns uppercase first letters of first and last name", () => {
    expect(getInitials("Leanne", "Graham")).toBe("LG");
  });

  it("falls back to a question mark when both names are empty", () => {
    expect(getInitials("", "")).toBe("?");
  });
});
