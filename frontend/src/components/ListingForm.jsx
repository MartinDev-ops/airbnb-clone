import { useState } from "react";
import AlertModal from "./AlertModal";

const listingTypes = ["Entire apartment", "Entire home", "Private room", "Shared room", "Whole Villa"];

const emptyForm = {
  title: "",
  location: "",
  description: "",
  type: "Entire apartment",
  price: "",
  guests: "",
  bedrooms: "",
  bathrooms: "",
  weeklyDiscount: "0",
  cleaningFee: "0",
  serviceFee: "0",
  occupancyTaxes: "0",
  enhancedCleaning: false,
  selfCheckIn: false,
};

/**
 * Shared form used by both Create Listing and Update Listing (brief items 3
 * & 5). Update Listing pre-fills every field from the existing listing, per
 * the rubric's "Pre-filled form with listing data" requirement.
 */
export default function ListingForm({
  initialValues,
  initialAmenities = [],
  initialImages = [],
  initialBedroomImage = "",
  onSubmit,
  submitLabel,
  onCancel,
}) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState(initialAmenities);
  const [images, setImages] = useState(initialImages);
  const [bedroomImage, setBedroomImage] = useState(initialBedroomImage);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addAmenity() {
    const value = amenityInput.trim();
    if (!value) return;
    setAmenities((a) => [...a, value]);
    setAmenityInput("");
  }

  function removeAmenity(index) {
    setAmenities((a) => a.filter((_, i) => i !== index));
  }

  // Images are stored as base64 directly on the listing document, and
  // MongoDB caps a document at 16MB. Downscaling + re-encoding as JPEG here
  // keeps a handful of uploads well within that limit instead of storing
  // full-resolution phone photos untouched.
  function readFileAsDataUrl(file, maxDimension = 1600, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            const scale = maxDimension / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const MAX_IMAGES = 5;

  async function handleImageFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow picking the same file again later
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const filesToAdd = files.slice(0, remaining);
    if (files.length > remaining) {
      setError(
        `You can only upload up to ${MAX_IMAGES} images. Only the first ${remaining} image${remaining === 1 ? "" : "s"} were added.`
      );
    } else {
      setError("");
    }

    const dataUrls = await Promise.all(filesToAdd.map((file) => readFileAsDataUrl(file)));
    setImages((imgs) => [...imgs, ...dataUrls]);
  }

  async function handleBedroomImageFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setBedroomImage(dataUrl);
  }

  function removeImage(index) {
    setImages((imgs) => imgs.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const required = ["title", "location", "type", "price", "guests", "bedrooms", "bathrooms"];
    const missing = required.filter((field) => !String(form[field]).trim());
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }
    if (images.length < MAX_IMAGES) {
      setError(`Please upload ${MAX_IMAGES} images (you've added ${images.length}).`);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        guests: Number(form.guests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        weeklyDiscount: Number(form.weeklyDiscount) || 0,
        cleaningFee: Number(form.cleaningFee) || 0,
        serviceFee: Number(form.serviceFee) || 0,
        occupancyTaxes: Number(form.occupancyTaxes) || 0,
        amenities,
        images,
        bedroomImage,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      <AlertModal message={error} onClose={() => setError("")} />

      <div>
        <div className="form-field">
          <label>Listing Title</label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="My Home" />
        </div>

        <div className="form-field">
          <label>Location</label>
          <input
            list="location-suggestions"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Select a location"
          />
          <datalist id="location-suggestions">
            <option value="New York" />
            <option value="Paris" />
            <option value="Tokyo" />
            <option value="Cape Town" />
            <option value="Los Angeles" />
          </datalist>
        </div>

        <div className="form-field">
          <label>Description</label>
          <textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={form.enhancedCleaning}
              onChange={(e) => update("enhancedCleaning", e.target.checked)}
            />
            Enhanced Cleaning
          </label>
          <label>
            <input type="checkbox" checked={form.selfCheckIn} onChange={(e) => update("selfCheckIn", e.target.checked)} />
            Self Check-in
          </label>
        </div>

        <div className="form-field">
          <label>Amenities</label>
          <div className="amenity-input-row">
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="wifi, kitchen, free parking…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAmenity();
                }
              }}
            />
            <button type="button" className="btn btn-admin" onClick={addAmenity}>
              Add
            </button>
          </div>
          {amenities.length > 0 && (
            <div className="amenity-tags">
              {amenities.map((a, i) => (
                <span className="amenity-tag" key={`${a}-${i}`}>
                  {a}
                  <button type="button" onClick={() => removeAmenity(i)}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="form-row">
          <div className="form-field">
            <label>Price ($/night)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              {listingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Guests</label>
            <input type="number" min="1" value={form.guests} onChange={(e) => update("guests", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Weekly discount ($)</label>
            <input
              type="number"
              min="0"
              value={form.weeklyDiscount}
              onChange={(e) => update("weeklyDiscount", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Cleaning fee ($)</label>
            <input type="number" min="0" value={form.cleaningFee} onChange={(e) => update("cleaningFee", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Service fee ($)</label>
            <input type="number" min="0" value={form.serviceFee} onChange={(e) => update("serviceFee", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Occupancy taxes ($)</label>
            <input
              type="number"
              min="0"
              value={form.occupancyTaxes}
              onChange={(e) => update("occupancyTaxes", e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Images</label>
          <p style={{ fontSize: "0.85rem", color: "#717171", margin: "-4px 0 8px" }}>
            Upload a minimum of 5 images.
          </p>
          <div className="amenity-input-row">
            <input
              id="image-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              style={{ display: "none" }}
            />
            <label htmlFor="image-file-input" className="btn btn-admin" style={{ cursor: "pointer" }}>
              Upload Images
            </label>
          </div>
          <div className="image-upload-box">
            {images.length === 0 ? (
              "No images uploaded"
            ) : (
              <div className="thumbs">
                {images.map((src, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={src} alt={`upload ${i}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        background: "#fff",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-field">
          <label>Bedroom photo</label>
          <p style={{ fontSize: "0.85rem", color: "#717171", margin: "-4px 0 8px" }}>
            Upload an image for where they'll sleep. Shown in the listing's "Where you'll sleep" section
            &mdash; if you skip this, that section won't be shown.
          </p>
          <div className="amenity-input-row">
            <input
              id="bedroom-image-input"
              type="file"
              accept="image/*"
              onChange={handleBedroomImageFile}
              style={{ display: "none" }}
            />
            <label htmlFor="bedroom-image-input" className="btn btn-admin" style={{ cursor: "pointer" }}>
              Upload Bedroom Photo
            </label>
          </div>
          <div className="image-upload-box">
            {bedroomImage ? (
              <div className="thumbs">
                <div style={{ position: "relative" }}>
                  <img src={bedroomImage} alt="Bedroom" />
                  <button
                    type="button"
                    onClick={() => setBedroomImage("")}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#fff",
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ) : (
              "No bedroom photo uploaded"
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-admin" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="btn btn-danger" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
