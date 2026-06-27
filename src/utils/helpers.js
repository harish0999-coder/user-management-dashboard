import { DEPARTMENTS } from "./constants";

/**
 * JSONPlaceholder users only have a single `name` field (e.g. "Leanne
 * Graham"). The dashboard needs separate First Name / Last Name columns,
 * so we split on the first space: everything before it is the first name,
 * everything after is the last name. Single-word names fall back to an
 * empty last name rather than throwing.
 */
export function splitName(fullName = "") {
  const trimmed = fullName.trim();
  const firstSpace = trimmed.indexOf(" ");

  if (firstSpace === -1) {
    return { firstName: trimmed, lastName: "" };
  }

  return {
    firstName: trimmed.slice(0, firstSpace),
    lastName: trimmed.slice(firstSpace + 1),
  };
}

/**
 * JSONPlaceholder has no concept of a department. We deterministically
 * assign one based on the user's id so reloading the page always produces
 * the same value (rather than a random one) and the dataset still looks
 * varied enough to demo filtering/sorting by department.
 */
export function assignDepartment(id) {
  const index = (Number(id) - 1) % DEPARTMENTS.length;
  return DEPARTMENTS[index < 0 ? 0 : index];
}

/**
 * Maps a raw JSONPlaceholder user object to the flat shape the rest of the
 * app works with: { id, firstName, lastName, email, department }.
 */
export function mapApiUserToUser(apiUser) {
  const { firstName, lastName } = splitName(apiUser.name);
  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email ?? "",
    department: assignDepartment(apiUser.id),
  };
}

/**
 * Combines firstName/lastName back into the single `name` field
 * JSONPlaceholder's API expects on POST/PUT.
 */
export function mapUserToApiPayload(user) {
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    department: user.department, // not part of the real schema, sent anyway
  };
}

// Stable palette for department pills. Picking from a fixed list keyed by
// a hash of the department name means every "Engineering" pill anywhere in
// the app is always the same color, with no extra state to track.
const PILL_PALETTE = [
  { bg: "#E3EFEA", fg: "#1F6F5C" },
  { bg: "#F4E3DA", fg: "#C2542E" },
  { bg: "#E6E6F4", fg: "#4A4A9E" },
  { bg: "#FCEFD0", fg: "#9C6B0B" },
  { bg: "#E0EEF6", fg: "#1F6F9C" },
  { bg: "#F0E3EE", fg: "#9C3E7E" },
];

export function getDepartmentColor(department = "") {
  let hash = 0;
  for (let i = 0; i < department.length; i += 1) {
    hash = (hash * 31 + department.charCodeAt(i)) % PILL_PALETTE.length;
  }
  return PILL_PALETTE[Math.abs(hash) % PILL_PALETTE.length];
}

export function getInitials(firstName = "", lastName = "") {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}` || "?";
}
