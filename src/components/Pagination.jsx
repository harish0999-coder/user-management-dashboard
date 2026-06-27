import { PAGE_SIZE_OPTIONS } from "../utils/constants";
import { getPageWindow, getTotalPages } from "../utils/pagination";
import "../styles/pagination.css";

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = getTotalPages(totalItems, pageSize);
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageWindow(currentPage, totalPages);

  return (
    <div className="pagination">
      <p className="pagination__info">
        Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of{" "}
        <strong>{totalItems}</strong> users
      </p>

      <div className="pagination__controls">
        <button
          type="button"
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {pages.map((page, idx) =>
          page === "…" ? (
            <span key={`ellipsis-${idx}`} className="page-btn page-btn--ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`page-btn ${page === currentPage ? "page-btn--active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      <div className="pagination__size">
        <label htmlFor="page-size">Rows per page</label>
        <select
          id="page-size"
          className="select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
