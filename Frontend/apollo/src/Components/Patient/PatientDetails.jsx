// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'
import './PatientDetails.css';

function PatientDetails() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editPatient, setEditPatient] = useState(null); // State to store patient being edited
    const [editedPatientData, setEditedPatientData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        date: '',
        reason: '',
        amount: ''
    });

    const decodeToken = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };
    

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = getCookie('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const decodedToken = decodeToken(token);
                const userEmail = decodedToken.email;
                console.log(userEmail)
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
                const filteredPatients = response.data.filter(patient => patient.email === userEmail);
                setPatients(filteredPatients);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patient details:', error);
                setError('Error fetching patient details: ' + error.message);
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/patients/${id}`);
            setPatients(prevPatients => prevPatients.filter(patient => patient._id !== id));
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleEdit = (patient) => {
        setEditPatient(patient);
        setEditedPatientData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            date: patient.date,
            reason: patient.reason,
            amount: patient.amount
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/patients/${editPatient._id}`, editedPatientData);
            const updatedPatient = response.data;
            setPatients(prevPatients => prevPatients.map(patient => patient._id === updatedPatient._id ? updatedPatient : patient));
            setEditPatient(null);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPatientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
      <>
      <Navbar />
        <div className="patient-list">
            <h2 className='mb-3'>Patient Details</h2>
            {patients.map(patient => (
                <div key={patient._id} className="patient-card">
                    <h3>{patient.firstName} {patient.lastName}</h3>
                    <p>Email: {patient.email}</p>
                    <p>Phone: {patient.phoneNumber}</p>
                    <p>Date of Appointment: {new Date(patient.date).toLocaleDateString()}</p>
                    <p>Reason: {patient.reason}</p>
                    <p>Amount Paid: ₹{patient.amount}</p>
                    <div>
                        <button  className="button-18 ml-3" onClick={() => handleDelete(patient._id)}>Delete</button>
                        <button  className="button-18 ml-3" onClick={() => handleEdit(patient)}>Edit</button>
                    </div>
                </div>
            ))}
            {editPatient && (
                <div className="update-form">
                    <h2>Edit Patient Details</h2>
                    <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={editedPatientData.firstName} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={editedPatientData.lastName} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={editedPatientData.email} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label>Phone Number:</label>
                    <input type="tel" name="phoneNumber" value={editedPatientData.phoneNumber} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label >Date of Appointment:</label>
                    <input type="date" name="date" value={editedPatientData.date} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label>Reason for Appointment:</label>
                    <textarea name="reason" value={editedPatientData.reason} onChange={handleInputChange} />
                    </div>
                    <div>
                    <label>Amount Paid:</label>
                    <input type="text" name="amount" value={editedPatientData.amount} onChange={handleInputChange} readOnly />
                    </div>
                    <button className="button-18 ml-3" style={{border:"2px solid white",borderRadius:"30px"}} onClick={handleUpdate}>Update</button>
                    <button className="button-18 ml-3" style={{border:"2px solid white",borderRadius:"30px"}} onClick={() => setEditPatient(null)}>Cancel</button>
                </div>
            )}
        </div>
        </>
    );
}

export default PatientDetails;
