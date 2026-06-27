/**
 * Pure pagination helpers — no React, no DOM. Kept separate from the
 * Pagination component so the page-window and slicing math can be unit
 * tested directly, per the assignment's "test critical helpers (pagination
 * split math)" guidance.
 */

/**
 * Slices a list down to the page the user is currently viewing.
 * e.g. paginate(users, 2, 10) returns items 11-20.
 */
export function paginate(items, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}

export function getTotalPages(totalItems, pageSize) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Builds a windowed list of page numbers with ellipses, e.g.
 * [1, "…", 4, 5, 6, "…", 12] instead of rendering a button for every page.
 * `delta` controls how many neighbors of the current page are shown.
 */
export function getPageWindow(currentPage, totalPages, delta = 1) {
  const range = [];
  for (let i = 1; i <= totalPages; i += 1) {
    const isEdge = i === 1 || i === totalPages;
    const isNeighbor = i >= currentPage - delta && i <= currentPage + delta;
    if (isEdge || isNeighbor) {
      range.push(i);
    }
  }

  const withEllipses = [];
  let previousPage = null;
  for (const page of range) {
    if (previousPage !== null) {
      const gap = page - previousPage;
      if (gap === 2) {
        // Exactly one page was skipped — show its number instead of
        // hiding a single page behind an ellipsis.
        withEllipses.push(previousPage + 1);
      } else if (gap > 2) {
        withEllipses.push("…");
      }
    }
    withEllipses.push(page);
    previousPage = page;
  }
  return withEllipses;
}
