import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import PasswordReset from './PasswordReset';
import forgotBg from '../video-img/sign-in,login-out/forgot_password.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ForgotPassword = ({ role, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  //add animation..................
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      setShowPasswordReset(true);
    }
  };

  if (showPasswordReset) {
    return <PasswordReset role={role} phoneNumber={phoneNumber} onBack={() => setShowPasswordReset(false)} />;
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="header-section">
          <h1 className="forgot-title">FORGOT PASSWORD</h1>
          <button className="back-button" onClick={onBack}>→</button>
        </div>

        <div className="forgot-illustration">
          <img src={forgotBg} alt="Forgot password illustration" className="illustration-img" />
        </div>

        <div className="instruction-text">
          <p>Don't worry! It happens. Please enter the phone number, we will send the OTP to this phone number.</p>
        </div>

        <form className="forgot-form" onSubmit={handleContinue}>
          <input
            type="tel"
            placeholder="Phone Number"
            className="form-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <button type="submit" className="continue-btn">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

