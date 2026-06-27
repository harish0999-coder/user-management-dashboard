import "../styles/modal.css";

export default function ConfirmDelete({ user, onConfirm, onClose, isDeleting }) {
  return (
    <div className="overlay" role="presentation">
      <div
        className="modal modal--sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <div className="modal__header">
          <h2 className="modal__title" id="confirm-delete-title">
            Delete user
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="confirm-delete__body">
            <div className="confirm-delete__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M10.29 3.86l-8.49 14.7A1 1 0 002.66 20h18.68a1 1 0 00.86-1.5l-8.49-14.7a1 1 0 00-1.72 0z" />
              </svg>
            </div>
            <div className="confirm-delete__text">
              <p>
                Are you sure you want to delete{" "}
                <span className="confirm-delete__name">
                  {user.firstName} {user.lastName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting…" : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}
