import client from "./client";

export const listAccommodations = (params = {}) =>
  client.get("/accommodations", { params }).then((res) => res.data);

export const getAccommodation = (id) =>
  client.get(`/accommodations/${id}`).then((res) => res.data);

export const createAccommodation = (payload) =>
  client.post("/accommodations", payload).then((res) => res.data);

export const updateAccommodation = (id, payload) =>
  client.put(`/accommodations/${id}`, payload).then((res) => res.data);

export const deleteAccommodation = (id) =>
  client.delete(`/accommodations/${id}`).then((res) => res.data);
