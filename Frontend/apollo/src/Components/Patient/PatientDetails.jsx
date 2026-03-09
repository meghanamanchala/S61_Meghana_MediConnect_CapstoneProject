// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Navbar from "../Navbar";
import "./PatientDetails.css";
import Cookies from "js-cookie";
import apiClient from "../../api/client.js";
import PageLoader from "../Common/PageLoader";

function PatientDetails() {
  const PAGE_SIZE = 6;

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editPatient, setEditPatient] = useState(null);
  const [deletePatient, setDeletePatient] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editedPatientData, setEditedPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    doctorName: "",
    phoneNumber: "",
    date: "",
    reason: "",
    amount: ""
  });

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          )
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
    if (!actionSuccess) return;

    const timer = setTimeout(() => {
      setActionSuccess("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [actionSuccess]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDate]);

  const handleEdit = (patient) => {
    setActionError("");
    setActionSuccess("");

    setEditPatient(patient);

    setEditedPatientData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      doctorName: getDoctorName(patient.doctor, patient),
      phoneNumber: patient.phoneNumber,
      date: patient.date?.split("T")[0],
      reason: patient.reason,
      amount: patient.amount
    });
  };

  const handleUpdate = async () => {
    const patientId = editPatient?._id || editPatient?.id;

    if (!patientId) {
      setActionError("Unable to update: patient ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");
    setActionSuccess("");

    try {

      const response = await apiClient.put(
        `/patients/${patientId}`,
        editedPatientData
      );

      const updated = response.data;

      setPatients(prev =>
        prev.map(p => (p._id || p.id) === (updated._id || updated.id) ? updated : p)
      );

      setEditPatient(null);
      setActionSuccess("Appointment updated successfully.");

    } catch (err) {

      setActionError(err?.response?.data?.message || "Update failed. Please try again.");

    } finally {
      setIsSubmitting(false);

    }
  };

  const handleDelete = async () => {
    const patientId = deletePatient?._id || deletePatient?.id;

    if (!patientId) {
      setActionError("Unable to delete: patient ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");
    setActionSuccess("");

    try {

      await apiClient.delete(`/patients/${patientId}`);

      setPatients(prev =>
        prev.filter(p => (p._id || p.id) !== patientId)
      );

      setDeletePatient(null);
      setActionSuccess("Appointment deleted successfully.");

    } catch (err) {

      setActionError(err?.response?.data?.message || "Delete failed. Please try again.");

    } finally {
      setIsSubmitting(false);

    }
  };


  const formatDate = (value) => {
    if (!value) return "N/A";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "N/A";
    return parsedDate.toLocaleDateString();
  };

  const formatDateInputValue = (value) => {
    if (!value) return "";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "";
    return parsedDate.toISOString().split("T")[0];
  };

  const getStatusMeta = (value) => {
    if (!value) return { label: "Pending", className: "status-pending" };

    const appointmentDate = new Date(value);
    if (Number.isNaN(appointmentDate.getTime())) {
      return { label: "Pending", className: "status-pending" };
    }

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const appointmentOnly = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    );

    if (appointmentOnly.getTime() === todayOnly.getTime()) {
      return { label: "Today", className: "status-today" };
    }

    if (appointmentOnly > todayOnly) {
      return { label: "Upcoming", className: "status-upcoming" };
    }

    return { label: "Completed", className: "status-completed" };
  };

  const getDoctorName = (doctor, fallbackPatient) => {
    if (fallbackPatient?.doctorName) return fallbackPatient.doctorName;
    if (!doctor) return "Doctor not assigned";
    if (typeof doctor === "string") return doctor;

    const fullName = [doctor.firstName, doctor.lastName].filter(Boolean).join(" ").trim();
    if (fullName) return fullName;
    if (doctor.name) return doctor.name;

    return `${fallbackPatient?.firstName || ""} ${fallbackPatient?.lastName || ""}`.trim() || "Assigned Doctor";
  };

  const getInitials = (name = "Doctor") => {
    const parts = name
      .split(" ")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);

    if (!parts.length) return "DR";
    return parts.map((part) => part[0].toUpperCase()).join("");
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  const filteredPatients = patients.filter((patient) => {
    const doctorName = getDoctorName(patient.doctor, patient);
    const matchesSearch = !normalizedQuery ||
      `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase().includes(normalizedQuery) ||
      (patient.email || "").toLowerCase().includes(normalizedQuery) ||
      (patient.phoneNumber || "").toLowerCase().includes(normalizedQuery) ||
      (patient.reason || "").toLowerCase().includes(normalizedQuery) ||
      doctorName.toLowerCase().includes(normalizedQuery);

    const matchesDate = !selectedDate || formatDateInputValue(patient.date) === selectedDate;
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setEditedPatientData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader message="Loading appointments..." />
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

        <div className="patient-header">
          <h2>My Appointments</h2>
          <p>Track, update, or remove your booked appointments.</p>
        </div>

        <div className="patient-toolbar">
          <input
            type="text"
            className="patient-search"
            placeholder="Search appointments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <input
            type="date"
            className="patient-date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button
            type="button"
            className="clear-filters-btn"
            onClick={handleClearFilters}
            disabled={!searchQuery && !selectedDate}
          >
            Clear Filters
          </button>
        </div>

        {actionSuccess && <div className="action-success-banner">{actionSuccess}</div>}
        {actionError && <div className="action-error-banner">{actionError}</div>}

        {patients.length === 0 ? (

          <div className="empty-state">
            No appointments found.
          </div>

        ) : filteredPatients.length === 0 ? (

          <div className="empty-state">
            No appointments match your search or date filter.
          </div>

        ) : (

          <div className="patient-grid">

            {paginatedPatients.map((patient) => (

              (() => {
                const status = getStatusMeta(patient.date);
                const doctorName = getDoctorName(patient.doctor, patient);
                const doctorInitials = getInitials(doctorName);

                return (

              <div key={patient._id || patient.id} className="patient-card">

                <div className="card-head">
                  <h3>
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <span className={`card-pill ${status.className}`}>{status.label}</span>
                </div>

                <div className="doctor-row">
                  <div className="doctor-avatar" aria-hidden="true">{doctorInitials}</div>
                  <div className="doctor-info">
                    <span className="doctor-label">Doctor</span>
                    <strong>{doctorName}</strong>
                  </div>
                </div>

                <p><strong>Email:</strong> {patient.email}</p>

                <p><strong>Phone:</strong> {patient.phoneNumber}</p>

                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(patient.date)}
                </p>

                <p><strong>Reason:</strong> {patient.reason}</p>

                <p><strong>Amount:</strong> ₹{patient.amount}</p>

                <div className="card-actions">

                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => handleEdit(patient)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => setDeletePatient(patient)}
                  >
                    Delete
                  </button>

                </div>

              </div>

                );
              })()

            ))}

          </div>

        )}

        {filteredPatients.length > 0 && (
          <div className="pagination-wrap">
            <button
              type="button"
              className="page-btn"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>

            <span className="page-indicator">Page {safeCurrentPage} of {totalPages}</span>

            <button
              type="button"
              className="page-btn"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* EDIT MODAL */}

      {editPatient &&
        ReactDOM.createPortal(

          <div className="modal-overlay">

            <div className="patient-modal">

              <h3>Edit Appointment</h3>

              <div className="modal-fields-grid">
                {[
                  { name: "firstName", label: "First Name", type: "text" },
                  { name: "lastName", label: "Last Name", type: "text" },
                  { name: "email", label: "Email", type: "email", locked: true },
                  { name: "doctorName", label: "Doctor", type: "text", locked: true },
                  { name: "phoneNumber", label: "Phone Number", type: "text" },
                  { name: "date", label: "Appointment Date", type: "date", locked: true },
                  { name: "reason", label: "Reason", type: "text" },
                  { name: "amount", label: "Amount", type: "number", locked: true }
                ].map((field) => (

                  <div key={field.name} className="modal-field">
                    <label>{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={editedPatientData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.label}
                      readOnly={field.locked}
                    />
                  </div>

                ))}
              </div>

              {actionError && <div className="modal-error">{actionError}</div>}

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditPatient(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>,

          document.body
        )
      }

      {/* DELETE MODAL */}

      {deletePatient &&
        ReactDOM.createPortal(

          <div className="modal-overlay">

            <div className="patient-modal delete-modal">

              <h3>Delete Appointment</h3>

              <p>Are you sure you want to delete this record?</p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-delete"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Yes Delete"}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setDeletePatient(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>,

          document.body
        )
      }

    </>
  );
}

export default PatientDetails;