import axios from "axios";
import { USERS_ENDPOINT } from "../utils/constants";

// Single axios instance so timeout/headers are configured once. If this
// project ever points at a real backend, this is the only file that needs
// a base URL or auth header change.
const client = axios.create({
  baseURL: USERS_ENDPOINT,
  timeout: 10000,
});

export const getUsers = () => client.get("/");

export const createUser = (payload) => client.post("/", payload);

export const updateUser = (id, payload) => client.put(`/${id}`, payload);

export const deleteUser = (id) => client.delete(`/${id}`);
