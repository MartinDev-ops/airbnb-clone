import { useNavigate } from "react-router-dom";
import { createAccommodation } from "../../api/accommodations";
import AdminHeader from "../../components/AdminHeader";
import ListingForm from "../../components/ListingForm";

/**
 * Create Listing page (Admin Dashboard brief item 3 / rubric "Admin Create
 * Listing Page"). All fields from the brief are present: title, location,
 * description, bedrooms/bathrooms/guests, type, price, amenities, images,
 * weekly discount, cleaning fee, service fee, occupancy taxes.
 */
export default function CreateListing() {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    await createAccommodation(payload);
    navigate("/admin/listings");
  }

  return (
    <>
      <AdminHeader />
      <div className="container admin-page">
        <h1>Create Listing</h1>
        <ListingForm onSubmit={handleCreate} submitLabel="Create" onCancel={() => navigate("/admin/listings")} />
      </div>
    </>
  );
}
