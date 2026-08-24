import { useState } from "react";
import { GlobeIcon, FacebookIcon, TwitterIcon, InstagramIcon } from "./Icons";

const columns = [
  {
    title: "Support",
    links: [
      "Help Center",
      "Safety information",
      "Cancellation options",
      "Our COVID-19 Response",
      "Supporting people with disabilities",
      "Guest Referrals",
    ],
  },
  {
    title: "Community",
    links: [
      "Airbnb.org: disaster relief housing",
      "Support Afghan refugees",
      "Combating discrimination",
      "Join the LGBTQ+ community",
    ],
  },
  {
    title: "Hosting",
    links: ["Try hosting", "AirCover: protection for Hosts", "Explore hosting resources", "Visit our community forum", "How to host responsibly"],
  },
  {
    title: "About",
    links: ["Newsroom", "Learn about new features", "Letter from our founders", "Careers", "Investors", "Airbnb Luxe"],
  },
];

export default function Footer() {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-columns">
          {columns.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} airbnb clone, Inc. &middot; Privacy &middot; Terms</span>
          <div className="footer-controls">
            <GlobeIcon width={16} height={16} />
            <select
              className="footer-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <select
              className="footer-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <div className="footer-social">
              <FacebookIcon width={17} height={17} />
              <TwitterIcon width={17} height={17} />
              <InstagramIcon width={18} height={18} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
