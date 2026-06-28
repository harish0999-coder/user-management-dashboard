import { describe, it, expect } from "vitest";
import { validateUserForm, isFormValid } from "../validators";

describe("validateUserForm", () => {
  const validForm = {
    firstName: "Leanne",
    lastName: "Graham",
    email: "leanne@example.com",
    department: "Engineering",
  };

  it("returns no errors for a fully valid form", () => {
    const errors = validateUserForm(validForm);
    expect(errors).toEqual({});
    expect(isFormValid(errors)).toBe(true);
  });

  it("flags a missing first name", () => {
    const errors = validateUserForm({ ...validForm, firstName: "" });
    expect(errors.firstName).toBe("First name is required.");
  });

  it("flags a first name that is only whitespace", () => {
    const errors = validateUserForm({ ...validForm, firstName: "   " });
    expect(errors.firstName).toBeTruthy();
  });

  it("flags a missing last name", () => {
    const errors = validateUserForm({ ...validForm, lastName: "" });
    expect(errors.lastName).toBe("Last name is required.");
  });

  it("flags a missing email", () => {
    const errors = validateUserForm({ ...validForm, email: "" });
    expect(errors.email).toBe("Email is required.");
  });

  it.each([
    "not-an-email",
    "missing-at-sign.com",
    "no-domain@",
    "@no-local-part.com",
    "spaces in@email.com",
  ])("flags an invalid email format: %s", (badEmail) => {
    const errors = validateUserForm({ ...validForm, email: badEmail });
    expect(errors.email).toBe("Enter a valid email address.");
  });

  it.each([
    "a@b.co",
    "first.last@example.com",
    "user+tag@sub.example.org",
  ])("accepts a valid email format: %s", (goodEmail) => {
    const errors = validateUserForm({ ...validForm, email: goodEmail });
    expect(errors.email).toBeUndefined();
  });

  it("flags a missing department", () => {
    const errors = validateUserForm({ ...validForm, department: "" });
    expect(errors.department).toBe("Department is required.");
  });

  it("flags an overly long first name", () => {
    const errors = validateUserForm({ ...validForm, firstName: "a".repeat(51) });
    expect(errors.firstName).toMatch(/under 50 characters/);
  });

  it("reports multiple errors at once when several fields are invalid", () => {
    const errors = validateUserForm({ firstName: "", lastName: "", email: "", department: "" });
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining(["firstName", "lastName", "email", "department"])
    );
  });
});

describe("isFormValid", () => {
  it("is true for an empty errors object", () => {
    expect(isFormValid({})).toBe(true);
  });

  it("is false when any error key is present", () => {
    expect(isFormValid({ email: "Required" })).toBe(false);
  });
});
