// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";
import arrow from "../assets/common/arrow.png";

function Register() {
  const [registerUser, setRegisterUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e, field) => {
    setRegisterUser({ ...registerUser, [field]: e.target.value });
  };

  const validateData = (data) => {
    const errors = {};

    if (!data.email.trim()) {
      errors.email = "Please enter your email!";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Please enter a valid email!";
    }

    if (!data.username.trim()) {
      errors.username = "Please enter your username!";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters!";
    }

    if (!data.password.trim()) {
      errors.password = "Please enter your password!";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters!";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateData(registerUser);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();

      formData.append("username", registerUser.username);
      formData.append("email", registerUser.email);
      formData.append("password", registerUser.password);

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert("Registration successful");
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("Registration error", error);
    }
  };

  return (
    <div className="register-page">
      <Link to="/">
        <img src={arrow} className="back-arrow" alt="back" />
      </Link>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="auth-head">
          <h2>Create Account</h2>
          <p>Register to start booking appointments</p>
        </div>

        {/* Profile Upload */}

        <div className="profile-upload">
          <label htmlFor="profileInput">
            <div className="profile-box">
              {preview ? (
                <img src={preview} alt="preview" className="profile-preview" />
              ) : (
                <span>Upload Profile Photo</span>
              )}
            </div>
          </label>

          <input
            id="profileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* Username */}

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={registerUser.username}
            onChange={(e) => handleChange(e, "username")}
            placeholder="Enter your username"
          />
          {formErrors.username && (
            <span className="error">{formErrors.username}</span>
          )}
        </div>

        {/* Email */}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={registerUser.email}
            onChange={(e) => handleChange(e, "email")}
            placeholder="Enter your email"
          />
          {formErrors.email && (
            <span className="error">{formErrors.email}</span>
          )}
        </div>

        {/* Password */}

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={registerUser.password}
            onChange={(e) => handleChange(e, "password")}
            placeholder="Enter your password"
          />
          {formErrors.password && (
            <span className="error">{formErrors.password}</span>
          )}
        </div>

        <button className="register-btn">Register</button>

        <p className="register-login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;