/* eslint-disable react/prop-types */
// export default Department;
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar/Navbar.jsx';
import { Link } from 'react-router-dom';
import graduationHat from './Components/assests/graduation-hat.png';
import talking from './Components/assests/talking.png';
import femaleDoctorImg from './Components/assests/female-doctor.png';
import maleDoctorImg from './Components/assests/male-doctor.png';
import './Department.css';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import Cookies from 'js-cookie';
import apiClient from './api/client.js';

// eslint-disable-next-line react/prop-types
function Department({ departmentName, departmentApiSlug }) {
  const [doctors, setDoctors] = useState([]);
  const isLoggedIn = Cookies.get('loggedIn') === 'true';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({ experience: '', gender: '', language: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/departments/${departmentApiSlug}`);
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        setFilters({ experience: '', gender: '', language: '' });
      } catch (err) {
        console.error("Error while fetching data", err);
      }
    };
    fetchData();
  }, [departmentApiSlug]);
  // Function to apply filters and update filtered doctors
  const applyFilters = () => {
    let filtered = doctors;

    // Apply filters based on experience, gender, and language
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      filtered = filtered.filter(doctor => {
        const experience = parseInt(doctor.experience);
        return experience >= min && (max === undefined || experience <= max);
      });
    }
  
    if (filters.gender) {
      filtered = filtered.filter(doctor => doctor.gender === filters.gender);
    }
    if (filters.language) {
      filtered = filtered.filter((doctor) => {
        const languages = Array.isArray(doctor.languagesSpoken)
          ? doctor.languagesSpoken
          : String(doctor.languagesSpoken || '')
              .split(',')
              .map((language) => language.trim())
              .filter(Boolean);

        return languages.some(
          (language) => language.toLowerCase() === filters.language.toLowerCase()
        );
      });
    }

    setFilteredDoctors(filtered);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
  };

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({ experience: '', gender: '', language: '' });
    setFilteredDoctors(doctors);
  };
  
  return (
    <>
      <Navbar />
      <div className="filters">
        <div className='filter-heading'>
        <h3>Filter Doctors:</h3>
        </div>
        <div className='filter-section'>
        <div>
          <label>Experience:</label>
          <select value={filters.experience} onChange={e => handleFilterChange('experience', e.target.value)}>
            <option value="">All</option>
            <option value="0-5">0-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-15">11-15 years</option>
            <option value="16+">16+ years</option>
          </select>
        </div>
        <div>
          <label>Gender:</label>
          <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)}>
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Language:</label>
          <select value={filters.language} onChange={e => handleFilterChange('language', e.target.value)}>
            <option value="">All</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Telugu">Telugu</option>
            <option value="Kannada">Kannada</option>
            <option value="Malayalam">Malayalam</option>
          </select>
        </div>
        </div>
        <div className='filter-buttons'>
        <button className="btn btn-light m-1" onClick={applyFilters}>Apply Filters</button>
        <button className="btn btn-light m-1"onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>
      <div className='department'>
        <h2 className='mb-4'>Consult {departmentName}</h2>
        <ul className="doctor-list">
          {filteredDoctors.map((doctor) => (
            <li key={doctor._id} className="doctor-item">
              <div className="doctor-box">
                <div className='doct'>
                  <div>
                    <img className="doctor-img" src={doctor.gender === 'Male' ? maleDoctorImg : femaleDoctorImg} alt="doctor-img" />
                  </div>
                  <div>
                    <p className='doctor-name'>{doctor.name}</p>
                    <p className='speciality'>{departmentName}</p>
                    <p className='experience'>{doctor.experience}</p>
                  </div>
                </div>
                <div className='edu'>
                  <img className="graduationHat m-1" src={graduationHat} alt='grad-hat' />
                  <p>{doctor.education}</p>
                </div>
                <div className='doc-language-spoken m-2'>
                  <img className="talking" src={talking} alt='talking' />
                  <p>{doctor.languagesSpoken}</p>
                </div>
                {isLoggedIn ? (
                  <Link to={`/book-appointment/${departmentApiSlug}/${doctor._id}`}>
                    <button className='mt-3 button-91'>Book Consult with Doctor</button>
                  </Link>
                ) : (
                  <>
                    <Button className='mt-3 button-91' onClick={onOpen}>Book Consult with Doctor</Button>
                    <Modal isOpen={isOpen} onClose={onClose} size="sm">
                      <ModalOverlay />
                      <ModalContent className="modal-content">
                        <ModalHeader className="modal-header">
                          <p>Login</p></ModalHeader>
                        <ModalBody className="modal-body">
                          <p>Please login to book a consultation.</p>
                          <Link to="/login" className="modal-link">
                            <button className="modal-button button-18">Login</button>
                          </Link>
                        </ModalBody>
                        <hr className='line' />
                        <ModalFooter className="modal-footer">
                          <Button onClick={onClose} className="modal-button button-18 ">Close</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Department;

