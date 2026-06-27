import "../styles/searchbar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <svg
        className="search__icon"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="text"
        className="search__input"
        placeholder="Search by name or email…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search users"
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
