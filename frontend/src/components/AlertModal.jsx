import { createPortal } from "react-dom";

/**
 * Small centered popup for form validation errors (e.g. ListingForm), so
 * the message shows up in the middle of the screen instead of a banner
 * the user has to scroll up to notice.
 */
export default function AlertModal({ message, onClose }) {
  if (!message) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <button type="button" className="btn btn-admin" onClick={onClose}>
          OK
        </button>
      </div>
    </div>,
    document.body
  );
}
