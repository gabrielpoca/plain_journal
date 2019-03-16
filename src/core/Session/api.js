import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:4000/api/"
});

export const handshake = data =>
  axios.post("http://localhost:4000/api/journal_entries_batch/handshake", data);

export const update = data =>
  axios.post("http://localhost:4000/api/journal_entries_batch/update", data);

export const signIn = data =>
  axios.post("http://localhost:4000/api/sessions", data);

export const signUp = data =>
  axios.post("http://localhost:4000/api/users", data);

export const currentUser = () =>
  axios.get("http://localhost:4000/api/current_user");

export const setAuthToken = token => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
