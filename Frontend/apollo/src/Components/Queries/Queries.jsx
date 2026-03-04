// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Navbar from "../Navbar";
import "./Queries.css";

function Queries() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Later you can connect API here
    console.log("Query Submitted:", query);

    setSubmitted(true);
    setQuery("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <div className="query-page">

        {/* HERO SECTION */}
        <div className="query-header">
          <h1>Have Questions? We’re Here to Help!</h1>
          <p>
            If you have any questions about our services, appointment bookings,
            or hospital facilities, feel free to reach out. Our support team is
            available 24/7 to assist you.
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="query-card">
          <h2>Submit Your Query</h2>
          <p>
            Please describe your concern below. Our team will respond as soon
            as possible.
          </p>

          <form onSubmit={handleSubmit}>
            <textarea
              className="query-textarea"
              placeholder="Type your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></textarea>

            <button type="submit" className="submit-btn">
              Submit Query
            </button>
          </form>

          {submitted && (
            <div className="success-message">
              ✅ Your query has been submitted successfully!
            </div>
          )}
        </div>

        {/* CONTACT INFO */}
        <div className="contact-card">
          <h2>Contact Information</h2>
          <div className="contact-item">
            <strong>Phone:</strong> +91 1234567890
          </div>
          <div className="contact-item">
            <strong>Email:</strong> support@apollohospital.com
          </div>
          <div className="contact-item">
            <strong>Office Hours:</strong> 24/7 Support
          </div>
        </div>

      </div>
    </>
  );
}

export default Queries;