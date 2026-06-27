// Centralized constants so magic strings/numbers never get duplicated
// across components. If JSONPlaceholder ever changes its base URL, or the
// page-size options need to change, this is the only file to touch.

export const API_BASE_URL = "https://jsonplaceholder.typicode.com";
export const USERS_ENDPOINT = `${API_BASE_URL}/users`;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

// JSONPlaceholder has no "department" field. Engineering assumption (also
// documented in README.md): every fetched user is assigned a department by
// cycling through this list deterministically based on their id, so the
// data looks realistic and is filterable/sortable out of the box. Users
// added through the "Add User" form choose their own department instead.
export const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Support",
  "IT",
  "Human Resources",
];

export const SORT_FIELDS = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "email", label: "Email" },
  { value: "department", label: "Department" },
];

export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
};
