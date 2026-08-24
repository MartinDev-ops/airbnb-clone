// Small inline icon set used across the app. These are original, simple
// glyphs (not a reproduction of any third-party logo) so the "airbnb"
// wordmark in <Brand /> is paired with a generic house/travel mark.

export function BrandMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2 2 9v13h6v-7h8v7h6V9z" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function GlobeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 21s-6.7-4.35-9.3-8.1C.9 10.2 1.4 6.6 4.4 5 7 3.6 9.8 4.7 12 7.4 14.2 4.7 17 3.6 19.6 5c3 1.6 3.5 5.2 1.7 7.9C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15 3h-2.5C10 3 8.5 4.6 8.5 7.2V10H6v3.2h2.5V21h3.3v-7.8h2.6l.4-3.2h-3V7.5c0-.9.4-1.5 1.7-1.5H15z" />
    </svg>
  );
}

export function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21 6.4c-.6.3-1.3.5-2 .6.7-.5 1.3-1.2 1.5-2-.7.4-1.4.7-2.2.9-.6-.7-1.5-1.1-2.5-1.1-1.9 0-3.4 1.6-3.4 3.5 0 .3 0 .5.1.8-2.9-.1-5.4-1.5-7.1-3.7-.3.5-.5 1.1-.5 1.8 0 1.2.6 2.2 1.5 2.9-.6 0-1.1-.2-1.6-.4v0c0 1.7 1.2 3.1 2.8 3.4-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.2 2.4-1.2.9-2.7 1.5-4.3 1.5-.3 0-.6 0-.8 0 1.5 1 3.3 1.6 5.3 1.6 6.3 0 9.8-5.2 9.8-9.8v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
