import React, { useState, useEffect } from 'react';
import './PasswordReset.css';
import resetBg from '../video-img/sign-in,login-out/new_pass.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PasswordReset = ({ role, phoneNumber, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (value && index < 3) {
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

  const handleConfirm = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset:', { otp, password, confirmPassword });
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-content">
        <div className="header-section">
          <h1 className="reset-title">Password reset</h1>
          <button className="back-button" onClick={onBack}>→</button>
        </div>

        <div className="reset-illustration">
          <img src={resetBg} alt="Password reset illustration" className="illustration-img" />
        </div>

        <div className="instruction-text">
          <p>Enter the activation code sent to your phone</p>
        </div>

        <form className="reset-form" onSubmit={handleConfirm}>
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

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              placeholder="Confirm password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span 
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          <button type="submit" className="confirm-btn">
            CONFIRM
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;

