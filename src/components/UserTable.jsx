import UserRow from "./UserRow";
import { SORT_FIELDS, SORT_ORDERS } from "../utils/constants";
import "../styles/table.css";

function SortableHeader({ field, label, sortField, sortOrder, onSort }) {
  const isActive = sortField === field;
  return (
    <th className="is-sortable" onClick={() => onSort(field)} scope="col">
      {label}
      {isActive && (
        <span className="sort-caret">{sortOrder === SORT_ORDERS.ASC ? "▲" : "▼"}</span>
      )}
    </th>
  );
}

export default function UserTable({ users, sortField, sortOrder, onSort, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="state-panel">
        <p className="state-panel__title">No users match your search or filters</p>
        <p>Try clearing the search box or removing some filters.</p>
      </div>
    );
  }

  // SORT_FIELDS only covers name/email/department per the spec; the
  // remaining columns (id, actions) stay unsortable.
  const sortableMap = Object.fromEntries(SORT_FIELDS.map((f) => [f.value, f.label]));

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <SortableHeader
              field="firstName"
              label={sortableMap.firstName}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              field="lastName"
              label={sortableMap.lastName}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              field="email"
              label={sortableMap.email}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              field="department"
              label={sortableMap.department}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th scope="col" style={{ textAlign: "right" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
