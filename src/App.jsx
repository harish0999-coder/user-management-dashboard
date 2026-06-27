import { useMemo, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterPopup from "./components/FilterPopup";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import UserForm from "./components/UserForm";
import ConfirmDelete from "./components/ConfirmDelete";
import useUsers from "./hooks/useUsers";
import { DEFAULT_PAGE_SIZE, SORT_ORDERS } from "./utils/constants";
import { filterUsers, sortUsers } from "./utils/userFilters";
import { paginate, getTotalPages } from "./utils/pagination";
import "./styles/layout.css";

const EMPTY_FILTERS = { firstName: "", lastName: "", email: "", department: "" };

export default function App() {
  const { users, isLoading, error, refetch, addUser, editUser, removeUser } = useUsers();

  // ---- Search / filter / sort / pagination (all local UI state) ----
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState(SORT_ORDERS.ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // ---- Modal state ----
  const [formUser, setFormUser] = useState(null); // null = closed, {} = add, {...} = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const processedUsers = useMemo(() => {
    const filtered = filterUsers(users, { searchQuery, filters });
    return sortUsers(filtered, sortField, sortOrder);
  }, [users, searchQuery, filters, sortField, sortOrder]);

  const totalItems = processedUsers.length;
  const totalPages = getTotalPages(totalItems, pageSize);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleUsers = paginate(processedUsers, safeCurrentPage, pageSize);

  // ---- Handlers that reset pagination when the result set changes ----
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleApplyFilters = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC));
    } else {
      setSortField(field);
      setSortOrder(SORT_ORDERS.ASC);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // ---- CRUD orchestration ----
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    const result = formUser?.id
      ? await editUser(formUser.id, formData)
      : await addUser(formData);
    setIsSubmitting(false);
    if (result.success) setFormUser(null);
    return result;
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    const result = await removeUser(deleteTarget.id);
    setIsSubmitting(false);
    if (result.success) setDeleteTarget(null);
    else {
      // Surface the error inline by keeping the modal open isn't possible
      // here since ConfirmDelete has no error slot; fall back to a banner
      // by closing and letting the page-level error system show it.
      setDeleteTarget(null);
      window.alert(result.message);
    }
  };

  return (
    <div className="app">
      <Header totalCount={users.length} onAddUser={() => setFormUser({})} />

      {error && (
        <div className="banner banner--error" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn--secondary btn--sm banner__action" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {!error && (
        <>
          <div className="toolbar">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
            <button type="button" className="btn btn--secondary" onClick={() => setIsFilterOpen(true)}>
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
            <div className="toolbar__spacer" />
          </div>

          {isLoading ? (
            <div className="state-panel">
              <div className="spinner" role="status" aria-label="Loading users" />
              <p className="state-panel__title">Loading users…</p>
            </div>
          ) : (
            <>
              <UserTable
                users={visibleUsers}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={(user) => setFormUser(user)}
                onDelete={(user) => setDeleteTarget(user)}
              />

              {totalItems > 0 && (
                <Pagination
                  currentPage={safeCurrentPage}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </>
      )}

      {isFilterOpen && (
        <FilterPopup
          initialFilters={filters}
          onApply={handleApplyFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {formUser !== null && (
        <UserForm
          user={formUser.id ? formUser : null}
          onSubmit={handleFormSubmit}
          onClose={() => setFormUser(null)}
          isSubmitting={isSubmitting}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          user={deleteTarget}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          isDeleting={isSubmitting}
        />
      )}
    </div>
  );
}
