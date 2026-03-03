/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DocAppointment.css';
import femaleDoctorImg from '../assests/female-doctor.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import maleDoctorImg from '../assests/male-doctor.png';
import Payment from '../Payment.jsx';
import Navbar from '../Navbar/Navbar.jsx';

function DocAppointment() {
  const { departmentName, doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  const [patientDetails, setPatientDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    date: '',
    amount: '',
    reason: '',
    doctor: doctorId
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        if (!departmentName || !doctorId) {
          setError('Department name or doctor ID not provided');
          return;
        }

  const response = await axios.get(`${import.meta.env.VITE_API_URL}/departments/${departmentName}`);
        const doctors = response.data;

        // Find the doctor with the matching doctorId
        const selectedDoctor = doctors.find(doc => doc._id === doctorId);

        if (selectedDoctor) {
          setDoctor(selectedDoctor);
          setPatientDetails(prevState => ({
            ...prevState,
            amount: selectedDoctor.amount
          }));
        } else {
          setError('Doctor not found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Error fetching doctor details: ' + error.message);
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [departmentName, doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    try {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: patientDetails.amount }), 
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      navigate('/payment', { state: { clientSecret: data.clientSecret, patientDetails } });
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Error initiating payment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Checking if any required fields are empty before proceeding
    if (!patientDetails.firstName ||
        !patientDetails.lastName ||
        !patientDetails.email ||
        !patientDetails.phoneNumber ||
        !patientDetails.date ||
        !patientDetails.reason) {
      toast.error('Please fill in all fields'); 
      return; 
    }

    try {
  await axios.post(`${import.meta.env.VITE_API_URL}/patients`, patientDetails);

      // Clear form fields after successful submission
      setPatientDetails({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        date: '',
        amount: '',
        reason: '',
        doctor: doctorId 
      });
      
      toast.success('Patient details submitted successfully');
      handlePayment(); // Proceed to payment section after successful form submission
    } catch (error) {
      toast.error('Error while submitting patient details');
      console.error('Error submitting patient details:', error);
    }
  };
  
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="doctor-boxing">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : doctor ? (
          <>
            <div className="doctor-info">
              <div className="doctor-image-box">
                <img className="doctor-picture" src={doctor.gender === 'Male' ? maleDoctorImg : femaleDoctorImg} alt="doctor-img" />
              </div>
              <div className="doctor-details">
                <div className='side-by-side'>
                  <div>Doctor Name:</div>
                  <p>{doctor.name}</p>
                </div>
                <div className='side-by-side'>
                  <div>Experience: </div>
                  <p>{doctor.experience}</p>
                </div>
                <div className='side-by-side'>
                  <div>Education: </div>
                  <p>{doctor.education}</p>
                </div>
                <div className='side-by-side'>
                  <div>Languages Spoken:</div>
                  <p>{doctor.languagesSpoken}</p>
                </div>
              </div>
            </div>

            <form className="appointment-form" onSubmit={handleSubmit}>
              <h3 className='text-center title'>Fill Patient Details</h3>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="firstName">First Name:</label>
                  <input type="text" id="firstName" name="firstName" value={patientDetails.firstName} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name:</label>
                  <input type="text" id="lastName" name="lastName" value={patientDetails.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={patientDetails.email} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input type="tel" id="phoneNumber" name="phoneNumber" value={patientDetails.phoneNumber} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="date">Date of Appointment:</label>
                  <input type="date" id="date" name="date" value={patientDetails.date} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label htmlFor="amount">Amount to be Paid in ₹:</label>
                  <input type="text" id="amount" name="amount" value={patientDetails.amount} onChange={handleInputChange} readOnly />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="reason">Reason for Appointment:</label>
                  <textarea id="reason" name="reason" value={patientDetails.reason} onChange={handleInputChange} required />
                </div>
              </div>
              <button type="submit">Submit</button> 
              {clientSecret && <Payment clientSecret={clientSecret} />}
            </form>
          </>
        ) : (
          <p>No doctor details found</p>
        )}
      </div>
    </>
  );
}

export default DocAppointment;
