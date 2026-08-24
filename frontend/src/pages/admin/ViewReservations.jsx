import { useEffect, useState } from "react";
import { listReservationsByHost, listReservationsByUser, cancelReservation } from "../../api/reservations";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../../components/AdminHeader";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

/**
 * View Reservations page - reachable from the Top Header's account
 * dropdown ("view reservations") once logged in, per brief item 1. Shared
 * by both roles: a host sees bookings made on their listings; a guest
 * sees the reservations they've made themselves.
 */
export default function ViewReservations() {
  const { user } = useAuth();
  const isHost = user?.role === "host";

  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchReservations = isHost ? listReservationsByHost : listReservationsByUser;
    fetchReservations()
      .then((data) => {
        setReservations(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isHost]);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const content = (
    <div className="container admin-page">
      <h1>Reservations</h1>

      {status === "loading" && <div className="page-loading">Loading reservations…</div>}
      {status === "error" && <div className="page-error">Couldn't load reservations.</div>}
      {status === "ready" && reservations.length === 0 && (
        <div className="page-empty">
          {isHost ? "No reservations yet for your listings." : "You haven't booked any stays yet."}
        </div>
      )}

      {status === "ready" && reservations.length > 0 && (
        <div className="table-scroll">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Listing</th>
                {isHost && <th>Guest</th>}
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.accommodation?.title || "Listing removed"}</td>
                  {isHost && <td>{r.user?.username}</td>}
                  <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                  <td>{r.guests}</td>
                  <td>${r.priceBreakdown?.total}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleCancel(r._id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (isHost) {
    return (
      <>
        <AdminHeader />
        {content}
      </>
    );
  }

  return (
    <>
      <Header />
      {content}
      <Footer />
    </>
  );
}
