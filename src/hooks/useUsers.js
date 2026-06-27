import { useCallback, useEffect, useState } from "react";
import * as userService from "../api/userService";
import { mapApiUserToUser, mapUserToApiPayload } from "../utils/helpers";

/**
 * Owns the full lifecycle of user data: fetching, loading/error state, and
 * the four CRUD mutations. Kept separate from App.jsx so the component
 * tree only deals with rendering + local UI state (search/sort/pagination),
 * not API plumbing.
 *
 * Note on JSONPlaceholder's behavior: POST/PUT/DELETE all return a
 * successful, *simulated* response — nothing is actually persisted on the
 * server. We optimistically apply the change to local state on success so
 * the UI still behaves like a real CRUD app within a single session.
 */
export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers();
      setUsers(response.data.map(mapApiUserToUser));
    } catch {
      setError(
        "Failed to load users. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(async (formData) => {
    try {
      const response = await userService.createUser(
        mapUserToApiPayload(formData)
      );
      // JSONPlaceholder always echoes id 11 for new posts; to keep ids
      // unique in local state (so React keys + edit/delete still work) we
      // fall back to a locally generated id when that happens.
      const newId =
        response.data?.id && response.data.id !== 11
          ? response.data.id
          : Date.now();

      const newUser = { ...formData, id: newId };
      setUsers((prev) => [newUser, ...prev]);
      return { success: true };
    } catch {
      return {
        success: false,
        message: "Could not add user. Please try again.",
      };
    }
  }, []);

  const editUser = useCallback(async (id, formData) => {
    try {
      await userService.updateUser(id, mapUserToApiPayload(formData));
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...formData, id } : user))
      );
      return { success: true };
    } catch {
      return {
        success: false,
        message: "Could not update user. Please try again.",
      };
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return { success: true };
    } catch {
      return {
        success: false,
        message: "Could not delete user. Please try again.",
      };
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
}
