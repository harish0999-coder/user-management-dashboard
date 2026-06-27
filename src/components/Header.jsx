import "../styles/layout.css";

export default function Header({ totalCount, onAddUser }) {
  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">User Management</h1>
        <span className="header__count">{totalCount} total</span>
      </div>
      <div className="header__actions">
        <button type="button" className="btn btn--primary" onClick={onAddUser}>
          + Add User
        </button>
      </div>
    </header>
  );
}
