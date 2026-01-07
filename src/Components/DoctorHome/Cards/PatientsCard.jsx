import React from 'react';
import './PatientsCard.css';

const PatientsCard = ({ onClick, isLoaded }) => {
  return (
    <div 
      className={`doctor-functionality-card doctor-patients-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
      onClick={onClick}
      data-aos="fade-up"
    >
      <div className="doctor-card-icon doctor-patients-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <h3 className="doctor-card-title">Patients</h3>
    </div>
  );
};

export default PatientsCard;

