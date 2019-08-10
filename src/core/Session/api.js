import Axios from "axios";

const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/api/"
      : "https://log.gabrielpoca.com"
});

export const handshake = data =>
  axios.post("/api/journal_entries_batch/handshake", data);

export const update = data =>
  axios.post("/api/journal_entries_batch/update", data);

export const signIn = data => axios.post("/api/sessions", data);

export const signUp = data => axios.post("/api/users", data);

export const currentUser = () => axios.get("/api/current_user");

export const setAuthToken = token => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
