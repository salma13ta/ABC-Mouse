import React from 'react';
import './SessionsCard.css';

const SessionsCard = ({ onClick, isLoaded }) => {
  return (
    <div 
      className={`doctor-functionality-card doctor-sessions-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
      onClick={onClick}
      data-aos="fade-up"
    >
      <div className="doctor-card-icon doctor-sessions-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
      <h3 className="doctor-card-title">Sessions</h3>
    </div>
  );
};

export default SessionsCard;

