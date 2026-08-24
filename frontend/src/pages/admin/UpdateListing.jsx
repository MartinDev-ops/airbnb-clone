import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccommodation, updateAccommodation } from "../../api/accommodations";
import AdminHeader from "../../components/AdminHeader";
import ListingForm from "../../components/ListingForm";

/**
 * Update Listing page (Admin Dashboard brief item 5). Pre-fills the form
 * with the existing listing's data and saves changes with PUT.
 */
export default function UpdateListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getAccommodation(id)
      .then((data) => {
        setListing(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleUpdate(payload) {
    await updateAccommodation(id, payload);
    navigate("/admin/listings");
  }

  return (
    <>
      <AdminHeader />
      <div className="container admin-page">
        <h1>Update Listing</h1>
        {status === "loading" && <div className="page-loading">Loading listing…</div>}
        {status === "error" && <div className="page-error">Couldn't load that listing.</div>}
        {status === "ready" && (
          <ListingForm
            initialValues={{
              title: listing.title,
              location: listing.location,
              description: listing.description,
              type: listing.type,
              price: listing.price,
              guests: listing.guests,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              weeklyDiscount: listing.weeklyDiscount,
              cleaningFee: listing.cleaningFee,
              serviceFee: listing.serviceFee,
              occupancyTaxes: listing.occupancyTaxes,
              enhancedCleaning: listing.enhancedCleaning,
              selfCheckIn: listing.selfCheckIn,
            }}
            initialAmenities={listing.amenities || []}
            initialImages={listing.images || []}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            onCancel={() => navigate("/admin/listings")}
          />
        )}
      </div>
    </>
  );
}
