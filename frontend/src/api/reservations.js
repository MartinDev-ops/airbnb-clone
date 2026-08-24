import client from "./client";

export const createReservation = (payload) =>
  client.post("/reservations", payload).then((res) => res.data);

export const listReservationsByHost = () =>
  client.get("/reservations/host").then((res) => res.data);

export const listReservationsByUser = () =>
  client.get("/reservations/user").then((res) => res.data);

export const cancelReservation = (id) =>
  client.delete(`/reservations/${id}`).then((res) => res.data);
