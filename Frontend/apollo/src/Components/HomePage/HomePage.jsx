// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Navbar from "../Navbar";
import "./HomePage.css";
import { locationsData } from "../data";
import doctor from "../assets/common/doctor.jpeg";
import prathap from "../assets/common/prathap-reddy-img.jpg";

function HomePage() {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);

  const handleChange = (index) => {
    setSelectedLocationIndex(index);
  };

  return (
    <>
      <Navbar />

      <div className="content">

        {/* HERO SECTION */}
        <div className="section">
          <img src={doctor} alt="Doctor" />
          <div>
            <h1 className="hero-title">Compassionate Healthcare For Everyone</h1>
            <p>
              Welcome to Mediconnect! We’re dedicated to providing compassionate
              healthcare services to our community. From routine check-ups to
              advanced treatments, our expert doctors ensure personalized care
              for every patient.
            </p>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="section reverse">
          <div>
            <h1 className="hero-title">Excellence In Medical Innovation</h1>
            <p>
              Established in 1983, Apollo Healthcare has impacted over 200
              million lives across 120+ countries. With world-class facilities,
              advanced diagnostics, and leading specialists, we continue to
              redefine healthcare excellence.
            </p>
          </div>
          <img src={prathap} alt="Founder" />
        </div>

        {/* LOCATION TITLE */}
        <div className="section-2">
          <h3>OUR LOCATIONS</h3>
          <h1>Hospitals Across India</h1>
        </div>

        {/* LOCATION SECTION */}
        <div className="places">

          {/* LEFT: CITY CARDS */}
          <div className="location-section">
            {locationsData.map((location, index) => (
              <div
                key={index}
                className={`card ${
                  selectedLocationIndex === index ? "active" : ""
                }`}
                onClick={() => handleChange(index)}
              >
                <img src={location.icon} alt={location.name} />
                <p>{location.name}</p>
              </div>
            ))}
          </div>

          {/* RIGHT: SELECTED LOCATION DETAIL */}
          <div className="detailed-information">
            <div className="selecteditem">
              <img
                src={locationsData[selectedLocationIndex].image}
                alt={locationsData[selectedLocationIndex].name}
              />
              <div className="card-info">
                <h4>{locationsData[selectedLocationIndex].name}</h4>
                <p>
                  <strong>Address:</strong>{" "}
                  {locationsData[selectedLocationIndex].address}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {locationsData[selectedLocationIndex].phoneNumber}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default HomePage;