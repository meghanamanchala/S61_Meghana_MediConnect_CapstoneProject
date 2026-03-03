// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage';
import Appointment from './Components/Appointment/Appointment.jsx';
import Queries from './Components/Queries/Queries.jsx';
import DocAppointment from './Components/DocAppointment/DocAppointment.jsx';
import Department from './Department.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './Components/Loginpage/Login.jsx';
import RegisterForm from './Components/RegisterPage/Register.jsx';
// import DoctorLogin from './Components/DoctorLoginPage/DoctorLogin.jsx';
import PatientDetails from './Components/Patient/PatientDetails.jsx';
import Payment from './Components/Payment.jsx';
import { Elements } from '@stripe/react-stripe-js';
import OTP from './Components/OTP/otp-provider.jsx';
import { loadStripe } from '@stripe/stripe-js';

const departments = [
  { name: "Anesthesiologist", path: "anaesthesia", apiSlug: "anesthesiologist" },
  { name: "Cardiologist", path: "cardiology", apiSlug: "cardiologist" },
  { name: "Dentist", path: "dental", apiSlug: "dentist" },
  { name: "Dermatologist", path: "dermatology", apiSlug: "dermatologist" },
  { name: "ENT Specialist", path: "ent", apiSlug: "ent-specialist" },
  { name: "Gastroenterologist", path: "gastroenterology", apiSlug: "gastroenterologist" },
  { name: "Gynecologist", path: "gynecologist", apiSlug: "gynecologist" },
  { name: "Nephrologist", path: "nephrology", apiSlug: "nephrologist" },
  { name: "Neurologist", path: "neurology", apiSlug: "neurologist" },
  { name: "Ophthalmologist", path: "ophthalmology", apiSlug: "ophthalmologist" },
  { name: "Oncologist", path: "oncology", apiSlug: "oncologist" },
  { name: "Orthopedic Surgeon", path: "orthopedic", apiSlug: "orthopedic-surgeon" },
  { name: "Pediatrician", path: "pediatrics", apiSlug: "pediatrician" },
  { name: "Pulmonologist", path: "pulmonology", apiSlug: "pulmonologist" },
  { name: "Radiologist", path: "radiology", apiSlug: "radiologist" },
  { name: "Urologist", path: "urology", apiSlug: "urologist" },
];

const stripePromise = loadStripe('pk_test_51POxSU05WctnSMfqFTIUfM6SV20oJZDH6EveZE1NImOkThwgtNUPNifYtyQ1yp4wEpSdIajmShzQnfCyyDBpsMEo009thK6PFO');
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/queries' element={<Queries />} />
        {departments.map((department) => (
          <Route
            key={department.path}
            path={`/departments/${department.path}`}
            element={<Department departmentName={department.name} departmentApiSlug={department.apiSlug} />}
          />
        ))}
        <Route path="/book-appointment/:departmentName/:doctorId" element={<Elements stripe={stripePromise}><DocAppointment /></Elements>} />
        <Route path='/register' element={<RegisterForm />}/>
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path='/doctorlogin' element={<DoctorLogin />}/> */}
        <Route path="/patients" element={<PatientDetails />} />
        <Route path='/payment' element={<Elements stripe={stripePromise}><Payment /></Elements>} />
        <Route path='/otp' element={<OTP />}/>
        </Routes>
    </>
  );
}

export default App;

