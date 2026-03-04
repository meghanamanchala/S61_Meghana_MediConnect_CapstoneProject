// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./PatientDetails.css";
import Cookies from "js-cookie";
import apiClient from "../../api/client.js";

function PatientDetails() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [editPatient, setEditPatient] = useState(null);
  const [editedPatientData, setEditedPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    date: "",
    reason: "",
    amount: "",
  });

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (Cookies.get("loggedIn") !== "true") {
          throw new Error("Please login to view patient details");
        }

        const token = Cookies.get("token");
        const decodedToken = token ? decodeToken(token) : null;
        const userEmail = Cookies.get("email") || decodedToken?.email || "";

        if (!userEmail) {
          throw new Error("Session expired. Please login again");
        }

        const response = await apiClient.get("/patients");
        const filtered = response.data.filter(
          (p) => p.email === userEmail
        );

        setPatients(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await apiClient.delete(`/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
      setMessage("Patient record deleted successfully.");
      setMessageType("success");
    } catch (err) {
      setMessage("Unable to delete record.");
      setMessageType("error");
    }
  };

  const handleEdit = (patient) => {
    setEditPatient(patient);
    setEditedPatientData({ ...patient });
  };

  const handleUpdate = async () => {
    try {
      const response = await apiClient.put(
        `/patients/${editPatient._id}`,
        editedPatientData
      );

      const updated = response.data;

      setPatients((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      setEditPatient(null);
      setMessage("Patient details updated successfully.");
      setMessageType("success");
    } catch {
      setMessage("Error updating patient.");
      setMessageType("error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatientData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="center-message">Loading patient records...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="center-message error">{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="patient-container">
        <h2>My Appointments</h2>

        {message && (
          <div className={`alert ${messageType}`}>{message}</div>
        )}

        {patients.length === 0 ? (
          <div className="empty-state">
            No appointments found.
          </div>
        ) : (
          <div className="patient-grid">
            {patients.map((patient) => (
              <div key={patient._id} className="patient-card">
                <h3>
                  {patient.firstName} {patient.lastName}
                </h3>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(patient.date).toLocaleDateString()}
                </p>
                <p><strong>Reason:</strong> {patient.reason}</p>
                <p><strong>Amount:</strong> ₹{patient.amount}</p>

                <div className="card-actions">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(patient._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(patient)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editPatient && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Patient</h3>

            {[
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "date",
              "reason",
            ].map((field) => (
              <input
                key={field}
                type={field === "date" ? "date" : "text"}
                name={field}
                value={editedPatientData[field]}
                onChange={handleInputChange}
                placeholder={field}
              />
            ))}

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="btn-secondary"
                onClick={() => setEditPatient(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientDetails;