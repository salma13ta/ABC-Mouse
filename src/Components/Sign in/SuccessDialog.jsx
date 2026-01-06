import React, { useState, useEffect } from 'react';
import './SuccessDialog.css';
import successImage from '../video-img/sign-in,login-out/Jumping girl (2).gif';
import { FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SuccessDialog = ({ onClose, userName }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const word = "Success";
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  
  //add animation..................
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  
  const handleOkClick = () => {
    setShowWelcome(true);
  };

  const handleArrowHover = () => {
    if (onClose) {
      onClose();
    }
  };

  if (showWelcome) {
    return (
      <div className="welcome-page">
        <div className="welcome-content">
          <h2 className="welcome-message">Welcome, {userName || 'User'}</h2>
          <p> Explore games, stories, and learning adventures! </p>
          <div className="arrow-container" onMouseEnter={handleArrowHover}>
            <FaArrowRight className="home-arrow" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div data-aos="zoom-out-down" className="dialog-overlay" onClick={onClose}>
      <div data-aos="zoom-in-up" className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">
          {word.split('').map((char, index) => (
            <span
              key={index}
              className="animated-letter"
              style={{
                '--delay': `${index * 0.1}s`,
                '--color': colors[index % colors.length]
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>
        <div className="dialog-icon">
          <img src={successImage} alt="Success" className="dialog-image" />
        </div>
        <button className="dialog-ok-btn" onClick={handleOkClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessDialog;

