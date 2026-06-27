import { useState } from "react";
import { DEPARTMENTS } from "../utils/constants";
import { validateUserForm, isFormValid } from "../utils/validators";
import "../styles/modal.css";

const EMPTY_USER = { firstName: "", lastName: "", email: "", department: DEPARTMENTS[0] };

export default function UserForm({ user, onSubmit, onClose, isSubmitting }) {
  const isEditMode = Boolean(user);
  const [formData, setFormData] = useState(user ? { ...user } : { ...EMPTY_USER });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error the moment the user starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateUserForm(formData);
    setErrors(validationErrors);
    if (!isFormValid(validationErrors)) return;

    const result = await onSubmit(formData);
    if (!result?.success) {
      setSubmitError(result?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="overlay" role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <div className="modal__header">
          <h2 className="modal__title" id="user-form-title">
            {isEditMode ? "Edit user" : "Add user"}
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            {submitError && (
              <div className="banner banner--error" role="alert">
                {submitError}
              </div>
            )}

            <div className="field-row">
              <div className="field">
                <label className="field__label" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  className={`field__input ${errors.firstName ? "field__input--invalid" : ""}`}
                  value={formData.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  autoFocus
                />
                {errors.firstName && (
                  <p className="field__error" id="firstName-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  className={`field__input ${errors.lastName ? "field__input--invalid" : ""}`}
                  value={formData.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <p className="field__error" id="lastName-error">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`field__input ${errors.email ? "field__input--invalid" : ""}`}
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="field__error" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                className={`field__select ${errors.department ? "field__input--invalid" : ""}`}
                value={formData.department}
                onChange={(e) => update("department", e.target.value)}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="field__error">{errors.department}</p>}
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEditMode ? "Save changes" : "Add user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
