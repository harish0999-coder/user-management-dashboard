import { getDepartmentColor } from "../utils/helpers";
import "../styles/table.css";

export default function UserRow({ user, onEdit, onDelete }) {
  const color = getDepartmentColor(user.department);

  return (
    <tr>
      <td className="cell-id">#{String(user.id).padStart(4, "0")}</td>
      <td className="cell-name">{user.firstName}</td>
      <td className="cell-name">{user.lastName}</td>
      <td className="cell-email">{user.email}</td>
      <td>
        <span className="pill" style={{ background: color.bg, color: color.fg }}>
          {user.department}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.firstName} ${user.lastName}`}
            title="Edit"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(user)}
            aria-label={`Delete ${user.firstName} ${user.lastName}`}
            title="Delete"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
