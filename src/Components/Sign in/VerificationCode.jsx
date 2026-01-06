import React, { useState, useEffect } from 'react';
import './VerificationCode.css';
import SuccessDialog from './SuccessDialog';
import verifyBg from '../video-img/sign-in,login-out/otp.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const VerificationCode = ({ role, onBack, onVerifySuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  //add animation..................
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      // Handle verification logic here
      console.log('Verification code:', code);
      setShowSuccessDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    if (onVerifySuccess) {
      onVerifySuccess();
    }
  };

  return (
    <>
      <div data-aos="fade-down" className="verification-container">
        <div className="verification-content">
          <div className="header-section">
            <h1 className="verification-title">Verification code</h1>
            <button className="back-button" onClick={onBack}>→</button>
          </div>

          <div className="verification-illustration">
            <img src={verifyBg} alt="Verification illustration" className="illustration-img" />
          </div>

          <div className="instruction-text">
            <p>Enter the activation code sent to your phone</p>
          </div>

          <form className="verification-form" onSubmit={handleVerify}>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>

            <button type="submit" className="verify-btn">
              VERIFY
            </button>
          </form>
        </div>
      </div>
      {showSuccessDialog && (
        <SuccessDialog 
          onClose={handleDialogClose} 
          userName={window.tempUserData?.name || 'User'}
        />
      )}
    </>
  );
};

export default VerificationCode;

