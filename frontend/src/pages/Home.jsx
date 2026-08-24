import { useState } from "react";
import { Link } from "react-router-dom";
import GiftCardsArt from "../components/GiftCardsArt";

const inspirationCards = [
  { city: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500" },
  { city: "New York", country: "USA", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500" },
  { city: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500" },
  { city: "Cape Town", country: "South Africa", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=500" },
  { city: "Phuket", country: "Thailand", img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=500" },
];

const destinationTabs = {
  "Popular destinations": [
    { name: "Eiffel Tower", place: "Paris, France" },
    { name: "Statue of Liberty", place: "New York, USA" },
    { name: "Shibuya Crossing", place: "Tokyo, Japan" },
    { name: "Big Ben", place: "London, UK" },
    { name: "Colosseum", place: "Rome, Italy" },
    { name: "Sydney Opera House", place: "Sydney, Australia" },
    { name: "Table Mountain", place: "Cape Town, South Africa" },
    { name: "Sagrada Familia", place: "Barcelona, Spain" },
    { name: "Great Wall", place: "Beijing, China" },
    { name: "Christ the Redeemer", place: "Rio de Janeiro, Brazil" },
    { name: "Santorini", place: "Santorini, Greece" },
    { name: "Grand Canyon", place: "Arizona, USA" },
  ],
  "Beach destinations": [
    { name: "Bora Bora", place: "French Polynesia" },
    { name: "Maldives", place: "South Asia" },
    { name: "Copacabana", place: "Rio de Janeiro, Brazil" },
    { name: "Whitehaven Beach", place: "Queensland, Australia" },
  ],
  "Mountain cabins": [
    { name: "Aspen", place: "Colorado, USA" },
    { name: "Zermatt", place: "Switzerland" },
    { name: "Queenstown", place: "New Zealand" },
    { name: "Banff", place: "Alberta, Canada" },
  ],
  "Unique stays": [
    { name: "Treehouses", place: "Worldwide" },
    { name: "Houseboats", place: "Worldwide" },
    { name: "Igloos", place: "Worldwide" },
    { name: "Windmills", place: "Worldwide" },
  ],
  "Destinations for arts and culture": [
    { name: "The Louvre", place: "Paris, France" },
    { name: "Uffizi Gallery", place: "Florence, Italy" },
    { name: "Rijksmuseum", place: "Amsterdam, Netherlands" },
    { name: "Metropolitan Museum of Art", place: "New York, USA" },
  ],
  "Destinations for outdoor adventure": [
    { name: "Torres del Paine", place: "Patagonia, Chile" },
    { name: "Milford Track", place: "Queenstown, New Zealand" },
    { name: "Kilimanjaro", place: "Tanzania" },
    { name: "Yosemite Valley", place: "California, USA" },
  ],
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("Popular destinations");

  return (
    <>
      <div className="container">
        <div className="hero">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600"
            alt="Modern house with a garden"
          />
          <div className="hero-overlay">
            <h1>Not sure where to go? Perfect.</h1>
            <span className="pill">I'm flexible</span>
          </div>
        </div>

        <section className="home-section">
          <h2>Inspiration for your next trip</h2>
          <div className="card-grid">
            {inspirationCards.map((c) => (
              <div key={c.city} className="location-card">
                <img src={c.img} alt={c.city} />
                <div className="card-label">
                  <strong>{c.city}</strong>
                  <span>{c.country}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2>Discover Airbnb Experiences</h2>
          <div className="experience-banner">
            <div className="banner-tile">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                alt="Things to do on your trip"
              />
              <div className="banner-content">
                <h3>Things to do on your trip</h3>
                <span className="pill">Explore experiences</span>
              </div>
            </div>
            <div className="banner-tile">
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800"
                alt="Things to do at home"
              />
              <div className="banner-content">
                <h3>Things to do from home</h3>
                <span className="pill">Explore online experiences</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="shop-section">
            <div className="shop-panel-text">
              <h2>ShopAirbnb</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                Give the gift of travel with an Airbnb gift card.
              </p>
              <button type="button" className="btn btn-dark">
                Learn more
              </button>
            </div>
            <div className="shop-panel-image">
              <GiftCardsArt />
            </div>
          </div>
        </section>

        <div className="hero">
          <img
            src="https://images.unsplash.com/photo-1616377230292-97f202692d74?w=1600"
            alt="Smiling host in front of her home"
          />
          <div className="hero-overlay">
            <h1>Questions about hosting?</h1>
            <span className="pill">Ask a super host</span>
          </div>
        </div>

        <section className="home-section">
          <h2>Inspiration for future getaways</h2>
          <div className="tabs">
            {Object.keys(destinationTabs).map((tab) => (
              <button
                key={tab}
                className={tab === activeTab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="destination-grid">
            {destinationTabs[activeTab].map((d) => (
              <Link
                key={d.name}
                to={`/locations?location=${encodeURIComponent(d.place.split(",")[0])}`}
                className="destination"
              >
                <strong>{d.name}</strong>
                <span>{d.place}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
