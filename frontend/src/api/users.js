import client from "./client";

export const login = (username, password) =>
  client.post("/users/login", { username, password }).then((res) => res.data);

export const register = (username, password, role) =>
  client.post("/users/register", { username, password, role }).then((res) => res.data);

export const getMe = () => client.get("/users/me").then((res) => res.data);
