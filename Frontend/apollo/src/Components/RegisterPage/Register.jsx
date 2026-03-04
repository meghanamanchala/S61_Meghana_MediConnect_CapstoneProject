// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { Link } from 'react-router-dom';
import arrow from '../assets/common/arrow.png';

function Register() {
    const [registerUser, setRegisterUser] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [registerStatus, setRegisterStatus] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleChange = (e, field) => {
        setRegisterUser({ ...registerUser, [field]: e.target.value });
    };

    const validateData = (data) => {
        const errors = {};

        // Email validation
        if (!data.email.trim()) {
            errors.email = "Please enter your email!";
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            errors.email = "Please enter a valid email!";
        }

        // Username validation
        if (!data.username.trim()) {
            errors.username = "Please enter your username!";
        } else if (data.username.length < 3) {
            errors.username = "Username should have a minimum length of 3 characters!";
        } else if (data.username.length > 30) {
            errors.username = "Username should have a maximum length of 30 characters!";
        } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            errors.username = "Username can only contain letters, numbers, and underscores!";
        }

        // Password validation
        if (!data.password.trim()) {
            errors.password = "Please enter your password!";
        } else if (data.password.length < 8) {
            errors.password = "Password should have a minimum length of 8 characters!";
        } else if (data.password.length > 20) {
            errors.password = "Password should have a maximum length of 20 characters!";
        } else if (!/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)) {
            errors.password = "Password must contain both letters and numbers!";
        } else if (!/[!@#$%^&*]/.test(data.password)) {
            errors.password = "Password must contain at least one special character!";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateData(registerUser);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', registerUser.username);
            formData.append('email', registerUser.email);
            formData.append('password', registerUser.password);
            if (selectedFile) {
                formData.append('profilePicture', selectedFile);
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                setRegisterStatus(true);
                window.alert('Registration successful');
                window.location.href = '/otp';
            } else {
                console.log('Registration Failed');
            }
        } catch (error) {
            console.log('An error occurred while registering', error);
        }
    };

    return (
        <>
            <Link to="/login">
                <img src={arrow} className="back-arrow" alt="back" />
            </Link>
            <div className='register-page'>
                <form className='register-form' onSubmit={handleSubmit}>
                    <div className='auth-head'>
                        <h2>Create Account</h2>
                        <p>Register to start booking appointments</p>
                    </div>
                    <div>
                        <label className="register-label">Username:</label>
                        <input
                            className="register-input"
                            type="text"
                            value={registerUser.username}
                            onChange={(e) => handleChange(e, "username")}
                        />
                        {formErrors.username && <span className="error">{formErrors.username}</span>}
                    </div>
                    <div>
                        <label className="register-label">Password: </label>
                        <input
                            className="register-input"
                            type="password"
                            value={registerUser.password}
                            onChange={(e) => handleChange(e, "password")}
                        />
                        {formErrors.password && <span className="error">{formErrors.password}</span>}
                    </div>
                    <div>
                        <label className='register-label'>Email:</label>
                        <input
                            className='register-input'
                            type="email"
                            value={registerUser.email}
                            onChange={(e) => handleChange(e, 'email')}
                        />
                        {formErrors.email && <span className="error">{formErrors.email}</span>}
                    </div>
                    <div>
                        <label className="register-label">Upload your profile:</label>
                        <input className="register-input" type="file" onChange={handleFileChange} />
                    </div>
                    <div className='registerBtn-container'>
                        <button className="button-19" type="submit">Register</button>
                    </div>
                    <p className='register-login-link'>Already have an account? <Link to='/login'>Login</Link></p>
                </form>
            </div>
        </>
    );
}

export default Register;
