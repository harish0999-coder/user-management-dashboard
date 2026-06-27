import { SORT_ORDERS } from "./constants";

/**
 * Pure, framework-free search/filter/sort logic for the user list. Pulled
 * out of App.jsx so the matching rules can be unit tested directly without
 * rendering any React components, per the assignment's "test critical
 * helpers (search filters)" guidance.
 */

/**
 * True if `user` matches the free-text search query against first name,
 * last name, or email (case-insensitive, substring match).
 */
export function matchesSearch(user, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return (
    user.firstName.toLowerCase().includes(normalizedQuery) ||
    user.lastName.toLowerCase().includes(normalizedQuery) ||
    user.email.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * True if `user` satisfies every populated field in `filters`. An empty
 * filter field is treated as "no constraint" rather than "must be empty".
 */
export function matchesFilters(user, filters) {
  const { firstName = "", lastName = "", email = "", department = "" } = filters;

  const firstNameOk = !firstName || user.firstName.toLowerCase().includes(firstName.toLowerCase());
  const lastNameOk = !lastName || user.lastName.toLowerCase().includes(lastName.toLowerCase());
  const emailOk = !email || user.email.toLowerCase().includes(email.toLowerCase());
  const departmentOk = !department || user.department === department;

  return firstNameOk && lastNameOk && emailOk && departmentOk;
}

/** Applies both search and filters to a list, returning the matching subset. */
export function filterUsers(users, { searchQuery = "", filters = {} } = {}) {
  return users.filter(
    (user) => matchesSearch(user, searchQuery) && matchesFilters(user, filters)
  );
}

/**
 * Returns a new, sorted array (never mutates the input) ordered by the
 * given field, case-insensitive lexicographical comparison.
 */
export function sortUsers(users, sortField, sortOrder) {
  const sorted = [...users].sort((a, b) => {
    const valueA = String(a[sortField] ?? "").toLowerCase();
    const valueB = String(b[sortField] ?? "").toLowerCase();
    return valueA.localeCompare(valueB);
  });

  return sortOrder === SORT_ORDERS.DESC ? sorted.reverse() : sorted;
}
