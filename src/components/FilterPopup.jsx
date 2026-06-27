import { useState } from "react";
import { DEPARTMENTS } from "../utils/constants";
import "../styles/modal.css";

const EMPTY_FILTERS = { firstName: "", lastName: "", email: "", department: "" };

export default function FilterPopup({ initialFilters, onApply, onClose }) {
  const [draft, setDraft] = useState({ ...EMPTY_FILTERS, ...initialFilters });

  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  };

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="modal modal--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="filter-title">
            Filter users
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="field">
            <label className="field__label" htmlFor="filter-firstName">
              First name
            </label>
            <input
              id="filter-firstName"
              className="field__input"
              value={draft.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="e.g. Leanne"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="filter-lastName">
              Last name
            </label>
            <input
              id="filter-lastName"
              className="field__input"
              value={draft.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="e.g. Graham"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="filter-email">
              Email
            </label>
            <input
              id="filter-email"
              className="field__input"
              value={draft.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="e.g. april.biz"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="filter-department">
              Department
            </label>
            <select
              id="filter-department"
              className="field__select"
              value={draft.department}
              onChange={(e) => update("department", e.target.value)}
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={handleClear}>
            Clear all
          </button>
          <button type="button" className="btn btn--primary" onClick={handleApply}>
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
