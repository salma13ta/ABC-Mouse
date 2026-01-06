import React, { useState } from 'react';
import './FindDoctor.css';
import { FaSearch, FaStar, FaCalendar } from 'react-icons/fa';
import { IoMdArrowRoundBack } from "react-icons/io";

const FindDoctor = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock doctor data
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatric Speech Therapy',
      rating: 4.9,
      reviews: 127,
      price: 80,
      availability: 'Mon-Fri, 9AM-5PM',
      languages: ['English', 'Spanish'],
      image: null
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Articulation & Phonology',
      rating: 4.8,
      reviews: 93,
      price: 75,
      availability: 'Mon-Fri, 9AM-5PM',
      languages: ['English', 'Mandarin'],
      image: null
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Language Development',
      rating: 4.9,
      reviews: 156,
      price: 85,
      availability: 'Mon-Sat, 8AM-6PM',
      languages: ['English', 'Spanish', 'French'],
      image: null
    },
    {
      id: 4,
      name: 'Dr. David Anderson',
      specialty: 'Fluency Disorders',
      rating: 4.7,
      reviews: 89,
      price: 70,
      availability: 'Mon-Fri, 10AM-4PM',
      languages: ['English'],
      image: null
    },
    {
      id: 5,
      name: 'Dr. Olivia Wilson',
      specialty: 'Voice Disorders',
      rating: 5.0,
      reviews: 203,
      price: 90,
      availability: 'Mon-Fri, 9AM-5PM',
      languages: ['English', 'German'],
      image: null
    },
    {
      id: 6,
      name: 'Dr. James Taylor',
      specialty: 'Autism Spectrum Communication',
      rating: 4.8,
      reviews: 142,
      price: 95,
      availability: 'Mon-Thu, 9AM-5PM',
      languages: ['English', 'Spanish'],
      image: null
    }
  ];

  // Filter and sort doctors
  const getFilteredAndSortedDoctors = () => {
    let filtered = [...doctors];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
      );
    }

    // Sort based on selected filter
    switch (selectedFilter) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'top-rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'all' - no sorting
        break;
    }

    return filtered;
  };

  const filteredDoctors = getFilteredAndSortedDoctors();

  return (
    <div className="find-doctor-container">
      {/* Header */}
      <div className="find-doctor-header">
        <button className="find-doctor-back-button" onClick={onBack}>
          <IoMdArrowRoundBack />
        </button>
        <h1 className="find-doctor-title">Find a Doctor</h1>
      </div>

      {/* Search Bar */}
      <div className="find-doctor-search-container">
        <div className="find-doctor-search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="find-doctor-filters">
        <button
          className={`filter-button ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All Doctors
        </button>
        <button
          className={`filter-button ${selectedFilter === 'price-low' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('price-low')}
        >
          Price: Low to High
        </button>
        <button
          className={`filter-button ${selectedFilter === 'price-high' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('price-high')}
        >
          Price: High to Low
        </button>
        <button
          className={`filter-button ${selectedFilter === 'top-rated' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('top-rated')}
        >
          Top Rated
        </button>
      </div>

      {/* Doctor Listings */}
      <div className="find-doctor-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-image-container">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                ) : (
                  <div className="doctor-image-placeholder">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <div className="doctor-rating-price">
                  <div className="doctor-rating">
                    <FaStar className="star-icon" />
                    <span className="rating-value">{doctor.rating}</span>
                    <span className="rating-reviews">({doctor.reviews})</span>
                  </div>
                  <span className="doctor-price">${doctor.price}/session</span>
                </div>
                <div className="doctor-availability">
                  <FaCalendar className="calendar-icon" />
                  <span>{doctor.availability}</span>
                </div>
                <div className="doctor-languages">
                  {doctor.languages.map((language, index) => (
                    <span key={index} className="language-tag">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-doctors-found">
            <p>No doctors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctor;

