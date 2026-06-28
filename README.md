# User Management Dashboard

A React + Vite admin dashboard for viewing, searching, filtering, sorting,
adding, editing, and deleting users against the [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
mock REST API.

Built to satisfy the Ajackus "User Management Dashboard" assignment.

---

## 1. Project Overview

This app fetches user records from `https://jsonplaceholder.typicode.com/users`
and presents them in a sortable, searchable, paginated table. Administrators
can add new users, edit existing ones, and delete them — all backed by real
`GET`/`POST`/`PUT`/`DELETE` requests to the API, with optimistic local state
updates so the UI behaves like a real CRUD app even though JSONPlaceholder
doesn't persist writes server-side.

**Live features**

- Responsive data table (ID, First Name, Last Name, Email, Department, Actions)
- Real-time search across first name, last name, and email
- Filter popup for first name / last name / email / department
- Click-to-sort table headers (ascending/descending) on Name, Email, Department
- Pagination with 10 / 25 / 50 / 100 rows-per-page and windowed page buttons
- Add User modal with client-side validation
- Edit User modal pre-populated with the selected row's data
- Delete confirmation modal to prevent accidental deletions
- Friendly error banners with a Retry action if the API call fails
- Fully responsive layout (mobile, tablet, desktop), 44×44px tap targets

---

## 2. Installation Instructions

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone <your-repo-url>
cd user-management-dashboard
npm install
```

## 3. Running the Project

```bash
# Start the local dev server (http://localhost:5173)
npm run dev

# Lint the source
npm run lint

# Build a production bundle into dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## 4. Folder Structure

```
user-management-dashboard/
├── public/
├── src/
│   ├── api/
│   │   └── userService.js      # Axios instance + GET/POST/PUT/DELETE calls
│   ├── components/
│   │   ├── Header.jsx          # Brand, live user count, "Add User" button
│   │   ├── SearchBar.jsx       # Real-time search input
│   │   ├── FilterPopup.jsx     # Multi-field filter modal
│   │   ├── UserTable.jsx       # Table shell + sortable headers
│   │   ├── UserRow.jsx         # Single row: pill, actions
│   │   ├── Pagination.jsx     # Page-size select + windowed page buttons
│   │   ├── UserForm.jsx        # Add/Edit modal with validation
│   │   └── ConfirmDelete.jsx   # Delete safety modal
│   ├── hooks/
│   │   └── useUsers.js         # Fetch + CRUD state, isolated from UI
│   ├── utils/
│   │   ├── constants.js        # API URL, page sizes, departments, sort fields
│   │   ├── helpers.js          # name splitting, department/pill mapping
│   │   ├── validators.js       # Form validation rules
│   │   ├── userFilters.js      # Pure search/filter/sort logic (unit tested)
│   │   ├── pagination.js       # Pure pagination math (unit tested)
│   │   └── __tests__/          # Vitest unit tests for the four files above
│   ├── components/__tests__/
│   │   └── SearchBar.test.jsx  # Example component-level test (RTL)
│   ├── test/
│   │   └── setup.js            # Vitest + jest-dom global setup
│   ├── styles/                 # Plain CSS, one file per concern
│   ├── App.jsx                 # Root: search/filter/sort/pagination state
│   └── main.jsx                # Entry point
└── README.md
```

---

## 5. Libraries Used

| Library | Purpose |
|---|---|
| **React 19** | UI components, hooks-based state management |
| **Vite** | Dev server + build tooling |
| **Axios** | Promise-based HTTP client for the four CRUD calls |
| **Vitest + React Testing Library** | Unit tests for utilities and components |
| Plain CSS (custom design tokens) | Styling — no UI framework dependency |

No router was added since the app is a single view; no extra state library
was needed since `useState`/`useMemo` in `App.jsx` and the `useUsers` hook
were sufficient for this scope.

---

## 6. Testing

```bash
npm test          # run the full suite once
npm run test:watch  # re-run on file changes
```

68 tests cover the pure logic the brief specifically calls out as worth
testing ("pagination split math and search filters"), plus one component
test:

- `src/utils/__tests__/validators.test.js` — required fields, email format,
  multi-field error reporting
- `src/utils/__tests__/helpers.test.js` — name splitting edge cases,
  deterministic department assignment, API ↔ app shape mapping
- `src/utils/__tests__/userFilters.test.js` — search matching, multi-field
  filtering (AND semantics), ascending/descending sort, no-mutation guarantee
- `src/utils/__tests__/pagination.test.js` — page slicing math, total-page
  rounding, and the windowed page-button/ellipsis logic
- `src/components/__tests__/SearchBar.test.jsx` — renders, fires `onChange`
  as the user types, and the clear button's conditional rendering/behavior

The search/filter/sort/pagination logic that the table, App, and Pagination
component all rely on was deliberately pulled out into plain functions in
`src/utils/userFilters.js` and `src/utils/pagination.js` specifically so it
could be tested without rendering React at all — only the one stateful
input component (`SearchBar`) needed a rendered test.

---

## 7. Engineering Assumptions

JSONPlaceholder's `/users` schema doesn't match the columns the brief asks
for, so the following mappings were made (see `src/utils/helpers.js`):

- **First Name / Last Name** — the API's single `name` field (e.g. `"Leanne
  Graham"`) is split on the *first* space: everything before it is the first
  name, everything after is the last name. A single-word name falls back to
  an empty last name instead of throwing.
- **Department** — the API has no department field at all. Each fetched
  user is assigned a department deterministically from a fixed list of six
  (`Engineering, Sales, Marketing, Support, IT, Human Resources`) based on
  `(id - 1) % 6`. This keeps the value stable across reloads (rather than
  random) and gives the filter/sort features something realistic to work
  with. Users created via the **Add User** form pick their own department
  from the same list.
- **IDs for newly added users** — JSONPlaceholder's mock `POST` always
  echoes back `id: 11` regardless of how many users already exist. To avoid
  every new user colliding on the same id in local state, the app falls
  back to a locally generated id (`Date.now()`) whenever the API returns
  `11`.
- **Writes don't persist** — `POST`/`PUT`/`DELETE` against JSONPlaceholder
  return a simulated success but never actually change server-side data. On
  a successful response the app updates its own local state optimistically,
  so within a session Add/Edit/Delete behave like a real CRUD app; a page
  refresh will reset the dataset back to the original 10 API users.

---

## 8. Challenges Faced

- **No persistence layer.** Since JSONPlaceholder is read-only under the
  hood, all mutations had to be reflected in local React state immediately
  after a successful (simulated) API response, rather than re-fetching the
  list afterward (a re-fetch would just return the original, unmodified
  dataset and silently "undo" the user's change).
- **Schema mismatch.** Mapping `name` → `firstName`/`lastName` and inventing
  a `department` field meant designing a deterministic, documented
  transformation (see above) instead of hardcoding or randomizing values,
  so the data stays consistent across reloads and demoes predictably.
- **Keeping search, filters, sort, and pagination independent but
  composable.** All four needed to apply together without stepping on each
  other (e.g., changing the search query or filters has to reset pagination
  back to page 1, or a filtered-down list could appear to have "missing"
  pages). This was solved with a single `useMemo` pipeline in `App.jsx`
  that applies search → filters → sort in sequence, and explicit
  `setCurrentPage(1)` resets wherever the result set can shrink.

## 9. Future Architectural Improvements

- Swap JSONPlaceholder for a real backend with a persistent database so
  Add/Edit/Delete survive a page refresh.
- Add authentication/authorization so only admins can mutate user records.
- Move search/filter/sort/pagination server-side once the dataset is large
  enough that client-side `Array.filter/sort/slice` stops being sufficient.
- Add `react-router-dom` for deep-linking to a specific user or filtered
  view, and browser back/forward support.
- Add automated tests (e.g. Vitest + React Testing Library) for the
  validation, pagination-math, and search/filter utilities called out in
  the assignment's best-practices list.
- Replace `window.alert` (used as a last-resort fallback if a delete
  request fails) with an inline toast/notification component.

---

## 10. Notes for Reviewers

- This dashboard intentionally keeps state management to React's built-in
  hooks (`useState`, `useMemo`, custom hooks) rather than adding Redux/Zustand,
  since the scope (one list, one set of derived views) doesn't need it.
- Components are kept under ~150 lines and single-responsibility per the
  brief's best practices (e.g. `UserRow` only renders a row; `useUsers` only
  owns API/CRUD state).
