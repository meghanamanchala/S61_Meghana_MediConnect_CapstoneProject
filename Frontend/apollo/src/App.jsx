// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage, Appointment, Queries, DocAppointment, LoginForm, RegisterForm, PatientDetails, Payment } from './Components';
import Department from './Department.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { DoctorLogin } from './Components';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'js-cookie';

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

function RequireAuth({ children }) {
  const location = useLocation();
  const isLoggedIn = Cookies.get('loggedIn') === 'true' && Boolean(Cookies.get('token'));

  if (!isLoggedIn) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

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
        <Route
          path="/book-appointment/:departmentName/:doctorId"
          element={
            <RequireAuth>
              <Elements stripe={stripePromise}><DocAppointment /></Elements>
            </RequireAuth>
          }
        />
        <Route path='/register' element={<RegisterForm />}/>
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path='/doctorlogin' element={<DoctorLogin />}/> */}
        <Route path="/patients" element={<PatientDetails />} />
        <Route path='/payment' element={<Elements stripe={stripePromise}><Payment /></Elements>} />
        </Routes>
    </>
  );
}

export default App;

