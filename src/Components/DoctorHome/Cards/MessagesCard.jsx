import React from 'react';
import './MessagesCard.css';

const MessagesCard = ({ onClick, isLoaded }) => {
  return (
    <div 
      className={`doctor-functionality-card doctor-messages-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
      onClick={onClick}
      data-aos="fade-up"
    >
      <div className="doctor-card-icon doctor-messages-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h3 className="doctor-card-title">Messages</h3>
    </div>
  );
};

export default MessagesCard;

