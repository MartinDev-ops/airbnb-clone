import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listAccommodations } from "../api/accommodations";
import ListingCard from "../components/ListingCard";

export default function Locations() {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    listAccommodations(location ? { location } : {})
      .then((data) => {
        setListings(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [location]);

  return (
    <div className="container locations-page">
      <h1>
        {status === "loading" && "Searching stays…"}
        {status === "error" && "Could not load listings."}
        {status === "ready" &&
          (listings.length
            ? `${listings.length} stays ${location ? `in ${location}` : "in all locations"}`
            : `No stays found${location ? ` in ${location}` : ""}`)}
      </h1>

      {status === "ready" &&
        listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
    </div>
  );
}
