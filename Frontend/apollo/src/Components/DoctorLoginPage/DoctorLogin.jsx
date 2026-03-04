// // eslint-disable-next-line no-unused-vars
// import React, { useState } from 'react';
// import axios from 'axios';
// import './DoctorLogin.css';
// import { Link } from 'react-router-dom';
// import arrow from '../assets/common/arrow.png';

// function DoctorLogin() {
//     const [docAdmin, setDocAdmin] = useState({
//         username: '',
//         password: ''
//     });

//     const handleChange = (e, field) => {
//         setDocAdmin({ ...docAdmin, [field]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_API_URL}/docAdmin/doctorLogin`, {
//                 Docusername: docAdmin.username, 
//                 Docpassword: docAdmin.password  
//             });
//             if (response.status >= 200 && response.status < 300) {
//                 console.log(response.data);
//             } else {
//                 console.log('Registration failed');
//             }
//         } catch (error) {
//             console.error('An error occurred while registering', error);
//         }
//     };

//     return (
//         <>
//         <Link to="/login">
//         <img src={arrow} className="back-arrow" alt="back"/>
//         </Link>
//         <div className='doctor-login-page'>
//             <form className='login-form' style={{backgroundColor:'white',padding:'60px',border:'1px solid black'}} onSubmit={handleSubmit}>
//                 <h1 className='heading' style={{textAlign:'center'}}>Login as Doctor</h1>
//                 <div>
//                     <label className="login-label">Username:</label>
//                     <input
//                         className="login-input"
//                         type="text"
//                         value={docAdmin.username}
//                         onChange={(e) => handleChange(e, "username")}
//                     />
//                 </div>
//                 <div>
//                     <label className="login-label">Password:</label>
//                     <input
//                         className="login-input"
//                         type="password"
//                         value={docAdmin.password}
//                         onChange={(e) => handleChange(e, "password")}
//                     />
//                 </div>
//                 <div className='loginBtn-container'>
//                     <button className="button-19" type="submit">Login</button> 
//                 </div>
//             </form>
//         </div>
//         </>
//     );
// }

// export default DoctorLogin;
