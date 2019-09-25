import Axios from "axios";

const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/"
      : "https://log.gabrielpoca.com"
});

export const signIn = data => axios.post("/sign_in", data);

export const signUp = data => axios.post("/sign_up", data);
