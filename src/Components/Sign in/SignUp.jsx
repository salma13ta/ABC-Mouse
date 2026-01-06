import React, { useState, useEffect } from 'react';
import './SignUp.css';
import VerificationCode from './VerificationCode';
import signupBg from '../video-img/sign-in,login-out/sign_up.png';

import AOS from 'aos';
import 'aos/dist/aos.css';

const SignUp = ({ role, onScreenChange, onSignUpSuccess }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    childName: '',
    childAge: '',
    childImage: null,
    doctorSpecialty: '',
    address: '',
    password: '',
    confirmPassword: '',
    certificateImage: null,
    licenseImage: null,
    idImage: null
  });
//add animation..................
useEffect(()=>{
  AOS.init({duration:2000})
  },[])


  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Store user data for later use
    const userImage = role === 'child' && formData.childImage 
      ? URL.createObjectURL(formData.childImage) 
      : null;
    
    const fullUserData = {
      name: formData.name || 'John Doe',
      mobileNumber: formData.mobileNumber || '',
      email: formData.email || '',
      image: userImage,
      ...(role === 'child' ? {
        childName: formData.childName || '',
        childAge: formData.childAge || '',
        childImage: userImage
      } : {
        doctorSpecialty: formData.doctorSpecialty || '',
        address: formData.address || '',
        certificateImage: formData.certificateImage ? URL.createObjectURL(formData.certificateImage) : null,
        licenseImage: formData.licenseImage ? URL.createObjectURL(formData.licenseImage) : null,
        idImage: formData.idImage ? URL.createObjectURL(formData.idImage) : null
      })
    };
    
    window.tempUserData = fullUserData;
    // Show verification code screen
    setShowVerification(true);
  };

  if (showVerification) {
    return (
      <VerificationCode 
        role={role} 
        onBack={() => setShowVerification(false)}
        onVerifySuccess={() => {
          if (onSignUpSuccess) {
            const userData = window.tempUserData || { 
              name: formData.name || 'John Doe', 
              image: null,
              mobileNumber: formData.mobileNumber || '',
              email: formData.email || '',
              ...(role === 'child' ? {
                childName: formData.childName || '',
                childAge: formData.childAge || ''
              } : {
                doctorSpecialty: formData.doctorSpecialty || '',
                address: formData.address || ''
              })
            };
            onSignUpSuccess(userData.name, userData.image, userData);
          }
        }}
      />
    );
  }
  

  return (
    <div data-aos="fade-down" className="signup-container">
      <div className="signup-content">
        <h1 className="signup-title">HELLO!</h1>
        
        <div className="signup-illustration">
          <img src={signupBg} alt="Sign up illustration" className="illustration-img" />
        </div>
        
        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile number"
            className="form-input"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          {role === 'child' && (
            <>
              <input
                type="text"
                name="childName"
                placeholder="Child Name"
                className="form-input"
                value={formData.childName}
                onChange={handleInputChange}
                required
              />
              
              <input
                type="text"
                name="childAge"
                placeholder="Child Age"
                className="form-input"
                value={formData.childAge}
                onChange={handleInputChange}
                required
              />

              <div className="image-upload-section">
                <label className="upload-label">Child Image</label>
                <label className="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'childImage')}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-box">
                    <span className="upload-icon">📷</span>
                    {formData.childImage ? formData.childImage.name : 'Upload'}
                  </div>
                </label>
              </div>
            </>
          )}

          {role === 'doctor' && (
            <>
              <input
                type="text"
                name="doctorSpecialty"
                placeholder="Doctor Specialty"
                className="form-input"
                value={formData.doctorSpecialty}
                onChange={handleInputChange}
                required
              />
              
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <div className="image-upload-section">
                <label className="upload-label">Certificate Image</label>
                <label className="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'certificateImage')}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-box">
                    <span className="upload-icon">📷</span>
                    {formData.certificateImage ? formData.certificateImage.name : 'Upload'}
                  </div>
                </label>
              </div>

              <div className="image-upload-section">
                <label className="upload-label">License Image</label>
                <label className="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'licenseImage')}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-box">
                    <span className="upload-icon">📷</span>
                    {formData.licenseImage ? formData.licenseImage.name : 'Upload'}
                  </div>
                </label>
              </div>

              <div className="image-upload-section">
                <label className="upload-label">ID Image</label>
                <label className="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'idImage')}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-box">
                    <span className="upload-icon">📷</span>
                    {formData.idImage ? formData.idImage.name : 'Upload'}
                  </div>
                </label>
              </div>
            </>
          )}
          
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <span 
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          <button type="submit" className="signup-submit-btn">
            SIGN UP
          </button>

          <div className="or-separator">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            className="signin-link-btn"
            onClick={() => onScreenChange('signin')}
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

