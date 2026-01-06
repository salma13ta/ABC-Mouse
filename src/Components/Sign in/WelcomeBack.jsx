import React, { useState, useEffect } from 'react';
import './WelcomeBack.css';
import ForgotPassword from './ForgotPassword';
import SuccessDialog from './SuccessDialog';
import welcomeBg from '../video-img/sign-in,login-out/log_image.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const WelcomeBack = ({ role, onScreenChange, onSignInSuccess }) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  //add animation..................
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const handleSignIn = () => {
    // In a real app, you would fetch user data from API based on phoneNumber
    // For now, we'll use default values or try to load from localStorage
    const savedUserData = localStorage.getItem('userData');
    let userData;
    
    if (savedUserData) {
      try {
        userData = JSON.parse(savedUserData);
        // Match by phone number if available
        if (userData.mobileNumber === phoneNumber) {
          window.tempUserData = userData;
        } else {
          // Create default data
          userData = {
            name: phoneNumber || 'John Doe',
            mobileNumber: phoneNumber || '',
            email: '',
            image: null,
            ...(role === 'child' ? { childName: '', childAge: '' } : { doctorSpecialty: '', address: '' })
          };
          window.tempUserData = userData;
        }
      } catch (error) {
        userData = {
          name: phoneNumber || 'John Doe',
          mobileNumber: phoneNumber || '',
          email: '',
          image: null,
          ...(role === 'child' ? { childName: '', childAge: '' } : { doctorSpecialty: '', address: '' })
        };
        window.tempUserData = userData;
      }
    } else {
      userData = {
        name: phoneNumber || 'John Doe',
        mobileNumber: phoneNumber || '',
        email: '',
        image: null,
        ...(role === 'child' ? { childName: '', childAge: '' } : { doctorSpecialty: '', address: '' })
      };
      window.tempUserData = userData;
    }
    
    setShowSuccessDialog(true);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    if (onSignInSuccess) {
      const userData = window.tempUserData || { 
        name: phoneNumber || 'John Doe', 
        mobileNumber: phoneNumber || '',
        email: '',
        image: null,
        ...(role === 'child' ? { childName: '', childAge: '' } : { doctorSpecialty: '', address: '' })
      };
      onSignInSuccess(userData.name, userData.image, userData);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword role={role} onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <>
      <div className="welcome-back-container">
        <div data-aos="fade-up" className="welcome-back-content">
          <h1 className="welcome-title">WELCOME BACK</h1>
          <div className="welcome-illustration">
            <img src={welcomeBg} alt="Welcome illustration" className="illustration-img" />
          </div>
          <div className="form-container">
            <div className="input-group">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>

            <button 
              type="button"
              className="forgot-password-link"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>

            <button className="signin-btn" onClick={handleSignIn}>
              SIGN IN
            </button>

            <div className="or-separator">
              <span>OR</span>
            </div>

            <button className="signup-btn" onClick={() => onScreenChange('signup')}>
              SIGN UP
            </button>
          </div>
        </div>
      </div>
      {showSuccessDialog && (
        <SuccessDialog 
          onClose={handleDialogClose} 
          userName={phoneNumber || 'User'}
        />
      )}
    </>
  );
};

export default WelcomeBack;

