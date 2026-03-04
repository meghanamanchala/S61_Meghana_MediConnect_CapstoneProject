// eslint-disable-next-line no-unused-vars
import React from 'react';
import Navbar from '../Navbar';
import './Appointment.css';
import { departmentdata } from '../data';
import next from '../assets/departments/nextArrow.png';
import { Link } from 'react-router-dom';

function Appointment() {
  return (
    <>
      <Navbar />
      <div className="container1">
        <div className='text-center m-5'>
          <h2 className='heading'>Select Department</h2>
        </div>
        <div className='row department-section'>
          {departmentdata.map((department, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6" key={index} >
              <div className="image-container">
                <img src={department.image} alt={department.name} className="img-fluid" />
              </div>
              <Link to={`/departments/${department.name.toLowerCase()}`} className='link-no-underline' style={{ textDecoration: 'none' }}>
                <div className='deptname text-left mt-2 mb-2'>
                  <p>{department.name}</p>
                  <img src={next} alt='right-arrow' />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Appointment;

