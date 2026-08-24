/**
 * Amenities are free-text (a host can type anything), so this maps common
 * keywords to a simple icon and falls back to a generic check mark for
 * anything unrecognized, rather than requiring a fixed enum.
 */
const RULES = [
  { test: /wifi|internet/, icon: "wifi" },
  { test: /kitchen|cooking/, icon: "kitchen" },
  { test: /park/, icon: "parking" },
  { test: /pool/, icon: "pool" },
  { test: /air ?condition|\bac\b/, icon: "ac" },
  { test: /pet/, icon: "pets" },
  { test: /camera|security/, icon: "camera" },
  { test: /garden|view/, icon: "leaf" },
  { test: /wash(er|ing)/, icon: "washer" },
  { test: /dry(er)?/, icon: "dryer" },
  { test: /fridge|refrigerator/, icon: "fridge" },
  { test: /bike|bicycle/, icon: "bike" },
  { test: /fire ?place/, icon: "fire" },
  { test: /\btv\b|television/, icon: "tv" },
  { test: /gym|fitness/, icon: "gym" },
];

function iconFor(name) {
  const lower = (name || "").toLowerCase();
  const match = RULES.find((r) => r.test.test(lower));
  return match ? match.icon : "check";
}

const paths = {
  wifi: (
    <>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5.5 12a10 10 0 0 1 13 0" />
      <path d="M9 15.5a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  kitchen: (
    <>
      <path d="M6 2v7a2 2 0 0 0 4 0V2" />
      <path d="M8 9v13" />
      <path d="M16 2c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v11" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 16V8h3.2a2.4 2.4 0 0 1 0 4.8H9" />
    </>
  ),
  pool: (
    <>
      <path d="M2 17c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
      <path d="M2 21c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
      <path d="M7 13V4l4 3 4-3v9" />
    </>
  ),
  ac: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="17" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </>
  ),
  pets: (
    <>
      <circle cx="12" cy="15.5" r="3.2" />
      <circle cx="6" cy="9" r="1.6" />
      <circle cx="18" cy="9" r="1.6" />
      <circle cx="9.5" cy="5.5" r="1.6" />
      <circle cx="14.5" cy="5.5" r="1.6" />
    </>
  ),
  camera: (
    <>
      <rect x="2" y="7" width="14" height="10" rx="2" />
      <path d="M16 10.5 22 7v10l-6-3.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16z" />
      <path d="M4 20c3-3 6-6 12-12" />
    </>
  ),
  washer: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <path d="M9 13a3 3 0 0 0 3 3" />
      <circle cx="7" cy="6" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  dryer: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <path d="M9.5 12c1 1.5 3.5 1.5 4.5 0" />
    </>
  ),
  fridge: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="5" y1="9" x2="19" y2="9" />
      <line x1="9" y1="4" x2="9" y2="7" />
      <line x1="9" y1="11" x2="9" y2="14" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="3.2" />
      <circle cx="18" cy="17" r="3.2" />
      <path d="M6 17 10 8h4l4 9" />
      <path d="M10 8 13 13h5" />
      <path d="M9 17h5" />
    </>
  ),
  fire: (
    <path d="M12 22c4 0 6-2.5 6-6 0-2.5-1.5-4-2.5-5.5C15 12 14 12.5 14 11c0-2-1.5-4-2.5-6C11 8 8 10 8 14c0 0-2-1-2-3.5C5 12.5 6 16 6 16c-2 0-2-2-2-2 0 4.5 3.5 8 8 8z" />
  ),
  tv: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  gym: (
    <>
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M6 8v8M4 9.5v5M18 8v8M20 9.5v5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.5 11 15.5 16 9" />
    </>
  ),
};

export default function AmenityIcon({ name, ...props }) {
  const key = iconFor(name);
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[key]}
    </svg>
  );
}
