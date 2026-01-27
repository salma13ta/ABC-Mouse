import React, { useState, useEffect } from 'react';
import './DoctorHome.css';
import Chat from '../chat/Chat';
import UserProfile from '../UserProfile/UserProfile';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import PatientsCard from './Cards/PatientsCard';
import SessionsCard from './Cards/SessionsCard';
import ReportsCard from './Cards/ReportsCard';
import MessagesCard from './Cards/MessagesCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBell, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiTrendingUp } from "react-icons/fi";
import { FaCheck, FaClock } from "react-icons/fa";

const DoctorHome = ({ userName, userImage, userData, onUserDataUpdate, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const [settingsState, setSettingsState] = useState({
    notifications: true,
    sounds: true,
    muteSessionReminders: false,
  });
  
  // Doctor-specific data
  const todayRevenue = 240;
  const monthRevenue = 6400;
  
  // Today's sessions for doctor
  const getTodaysSessions = () => {
    return [
      {
        patientName: "Emma Williams",
        time: "10:00 AM",
        type: "online",
        status: "confirmed"
      },
      {
        patientName: "Noah Brown",
        time: "2:00 PM",
        type: "in-person",
        status: "pending"
      }
    ];
  };
  
  const todaysSessions = getTodaysSessions();
  
  // Patients data
  const patients = [
    {
      id: 1,
      name: "Emma Williams",
      age: 5,
      image: null,
      condition: "Articulation Disorder",
      lastSession: "Jan 10, 2026",
      nextSession: "Jan 17, 2026",
      progress: 65
    },
    {
      id: 2,
      name: "Noah Brown",
      age: 7,
      image: null,
      condition: "Language Delay",
      lastSession: "Jan 11, 2026",
      nextSession: "Jan 18, 2026",
      progress: 42
    },
    {
      id: 3,
      name: "Olivia Davis",
      age: 6,
      image: null,
      condition: "Stuttering",
      lastSession: "Jan 9, 2026",
      nextSession: "Jan 16, 2026",
      progress: 78
    }
  ];

  // All sessions data
  const allSessions = [
    {
      id: 1,
      patientName: "Emma Williams",
      date: "Jan 12, 2026",
      time: "10:00 AM",
      type: "online",
      status: "confirmed"
    },
    {
      id: 2,
      patientName: "Noah Brown",
      date: "Jan 12, 2026",
      time: "2:00 PM",
      type: "in-person",
      status: "pending"
    },
    {
      id: 3,
      patientName: "Olivia Davis",
      date: "Jan 13, 2026",
      time: "11:00 AM",
      type: "online",
      status: "confirmed"
    }
  ];

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reportData, setReportData] = useState({
    observations: '',
    progressNotes: '',
    recommendations: '',
    assignedExercises: ''
  });
  
  const avatarImage = userImage || userData?.image;
  const avatarName = (userName || userData?.name || '').trim();
  const avatarInitial = avatarName ? avatarName.charAt(0).toUpperCase() : 'D';

  useEffect(() => {
    setIsLoaded(true);
    AOS.init({ duration: 2000 });
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-icon') && !event.target.closest('.notifications-dialog')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    handleNavigate('notifications');
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowNotifications(false);
    setCurrentPage('profile-menu');
  };

  return (
    <div className="doctor-home-container">
      {/* Doctor Navbar */}
      {currentPage !== 'profile-menu' && (
        <div  className={`doctor-navbar-merged ${isLoaded ? 'fade-in aos-init aos-animate' : ''}`}>
          <div className="doctor-navbar-content" onClick={() => handleNavigate('home')} style={{ cursor: 'pointer' }}>
            <div className="doctor-navbar-left">
              <div className="doctor-user-avatar" onClick={(e) => { e.stopPropagation(); handleAvatarClick(e); }} style={{ cursor: 'pointer' }}>
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt={avatarName || 'Profile'} 
                    className="doctor-avatar-img" 
                  />
                ) : (
                  <div className="doctor-avatar-placeholder">
                    {avatarInitial}
                  </div>
                )}
              </div>
              <div className="doctor-user-info" style={{ cursor: 'pointer', flex: 1 }}>
                <p className="doctor-welcome-text">Welcome back,</p>
                <h3 className="doctor-user-greeting">
                  Dr. {userName || userData?.name || 'Doctor'}
                </h3>
              </div>
            </div>
            <div className="doctor-navbar-right">
              <div className="doctor-navbar-right-icons-container">
                <div className="doctor-notification-icon" onClick={(e) => { e.stopPropagation(); handleNotificationClick(e); }}>
                  <FaBell />
                  {notificationCount > 0 && (
                    <span className="doctor-notification-badge doctor-notification-dot"></span>
                  )}
                </div>
                <div className="doctor-profile-icon" onClick={(e) => { e.stopPropagation(); handleAvatarClick(e); }} style={{ cursor: 'pointer' }}>
                  <CgProfile className="doctor-profile-icon-icon"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="doctor-home-content">
        {currentPage === 'home' && (
          <div className="doctor-home-main">
            {/* Doctor Dashboard - Summary Cards */}
            <div className={`doctor-summary-section ${isLoaded ? 'fade-in aos-init aos-animate' : ''}`}>
              <div className="doctor-summary-grid">
                <div className="doctor-summary-card">
                  <div className="summary-card-header">
                    <span className="summary-card-label">Today</span>
                    <svg className="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="summary-card-amount">${todayRevenue}</div>
                </div>
                <div className="doctor-summary-card">
                  <div className="summary-card-header">
                    <span className="summary-card-label">This Month</span>
                    <svg className="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="summary-card-amount">${monthRevenue}</div>
                </div>
              </div>
            </div>

            {/* Doctor Navigation Cards */}
            <div className={`doctor-functionality-section ${isLoaded ? 'fade-in aos-init aos-animate' : ''}`}>
              <div className="doctor-functionality-grid">
                <PatientsCard 
                  onClick={() => handleNavigate('patients')}
                  isLoaded={isLoaded}
                />
                <SessionsCard 
                  onClick={() => handleNavigate('sessions')}
                  isLoaded={isLoaded}
                />
                <ReportsCard 
                  onClick={() => handleNavigate('reports')}
                  isLoaded={isLoaded}
                />
                <MessagesCard 
                  onClick={() => handleNavigate('chat')}
                  isLoaded={isLoaded}
                />
              </div>
            </div>

            {/* Today's Sessions Section for Doctor */}
            <div className="doctor-sessions-section">
              <div className="doctor-sessions-header">
                <h2 className="doctor-sessions-title">Today's Sessions</h2>
              </div>
              <div className="doctor-sessions-list">
                {todaysSessions && todaysSessions.length > 0 ? (
                  todaysSessions.map((session, index) => (
                    <div key={index} className="doctor-session-card">
                      <div className="doctor-session-info">
                        <h3 className="doctor-session-patient-name">{session.patientName}</h3>
                        <p className="doctor-session-time">{session.time} • {session.type}</p>
                      </div>
                      <div className={`doctor-session-status-badge ${session.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                        {session.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="doctor-no-sessions">No sessions today</div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'chat' && (
          <div className="doctor-page-content doctor-chat-page">
            <Chat 
              onBack={() => handleNavigate('home')} 
              userImage={userImage || userData?.image}
              userName={userName || userData?.name}
              role="doctor"
              patients={patients}
            />
          </div>
        )}

        {currentPage === 'profile' && (
          <div className="doctor-page-content doctor-profile-page-wrapper">
            <UserProfile
              userData={userData}
              role="doctor"
              onSave={(updatedData) => {
                if (onUserDataUpdate) {
                  onUserDataUpdate(updatedData);
                }
              }}
              onBack={() => handleNavigate('profile-menu')}
            />
          </div>
        )}

        {currentPage === 'profile-menu' && (
          <ProfileMenu
            userImage={userImage}
            userData={userData}
            userName={userName}
            onBack={() => handleNavigate('home')}
            onEditProfile={() => handleNavigate('profile')}
            onSettings={() => handleNavigate('settings')}
            onHelp={() => handleNavigate('help')}
            onLogout={onLogout}
          />
        )}

        {currentPage === 'settings' && (
          <div className="doctor-page-content doctor-simple-page">
            <div className="doctor-simple-page-header">
              <button className="doctor-back-button" onClick={() => handleNavigate('profile-menu')}>
                <IoMdArrowRoundBack />
              </button>
              <h2>Settings</h2>
            </div>
            <div className="doctor-settings-list">
              {[
                { key: 'notifications', title: 'Notifications', desc: 'Receive alerts about sessions' },
                { key: 'sounds', title: 'Sound Effects', desc: 'Play friendly sounds in the app' },
                { key: 'muteSessionReminders', title: 'Mute Session Reminders', desc: 'Silence reminders quiet hours' },
              ].map(item => (
                <div key={item.key} className="doctor-setting-item">
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <label className="doctor-switch">
                    <input
                      type="checkbox"
                      checked={!!settingsState[item.key]}
                      onChange={(e) => setSettingsState(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    />
                    <span className="doctor-slider round"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'help' && (
          <div className="doctor-page-content doctor-simple-page">
            <div className="doctor-simple-page-header">
              <button className="doctor-back-button" onClick={() => handleNavigate('profile-menu')}>
                <IoMdArrowRoundBack />
              </button>
              <h2>Help & Support</h2>
            </div>
            <p className="doctor-simple-page-copy doctor-help-subtitle">We're here to help you every step of the way.</p>
            <div className="doctor-help-grid">
              {[
                { icon: '❓', title: 'FAQ', text: 'Find quick answers to common questions.' },
                { icon: '🧭', title: 'How It Works', text: 'Learn how to use the platform step by step with ease.' },
                { icon: '🛠', title: 'Technical Support', text: "Facing a technical issue? We're here to help you fix it." },
                { icon: '💬', title: 'Contact Support', text: 'Get in touch with our support team anytime you need help.' },
                { icon: '🔒', title: 'Safety & Privacy', text: "Patient safety and privacy are always our top priority." },
              ].map((item, idx) => (
                <div key={idx} className="doctor-help-card">
                  <div className="doctor-help-icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="doctor-help-cta">
              <div>
                <h4>Need Help Now?</h4>
                <p>Chat with our team for quick assistance.</p>
              </div>
              <button className="doctor-primary-btn">Contact Support</button>
            </div>
          </div>
        )}

        {currentPage === 'notifications' && (
          <div data-aos="fade-down" className="doctor-page-content doctor-notifications-page-wrapper">
            <div className="doctor-notifications-page">
              <div className="doctor-notifications-page-header">
                <button className="doctor-back-button" onClick={() => handleNavigate('home')}>
                  <IoMdArrowRoundBack />
                </button>
                <h2 className="doctor-notifications-page-title">Notifications</h2>
              </div>
              <div className="doctor-notifications-page-list">
                {notificationCount > 0 ? (
                  <>
                    <div className="doctor-notification-page-item">
                      <div className="doctor-notification-page-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div className="doctor-notification-page-content">
                        <h4>New Appointment Request</h4>
                        <p>Emma Williams requested an appointment for tomorrow at 10:00 AM</p>
                        <span className="doctor-notification-page-time">1 hour ago</span>
                      </div>
                    </div>
                    <div className="doctor-notification-page-item">
                      <div className="doctor-notification-page-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div className="doctor-notification-page-content">
                        <h4>Patient Report Submitted</h4>
                        <p>Noah Brown submitted a progress report</p>
                        <span className="doctor-notification-page-time">3 hours ago</span>
                      </div>
                    </div>
                    <div className="doctor-notification-page-item">
                      <div className="doctor-notification-page-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <div className="doctor-notification-page-content">
                        <h4>Payment Received</h4>
                        <p>Payment of $240 received for today's sessions</p>
                        <span className="doctor-notification-page-time">1 day ago</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="doctor-no-notifications-page">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'patients' && (
          <div className="doctor-page-content doctor-patients-page">
            <div className="doctor-patients-header">
              <button className="doctor-back-button" onClick={() => handleNavigate('home')}>
                <IoMdArrowRoundBack />
              </button>
              <h2 className="doctor-patients-title">My Patients</h2>
            </div>
            <div className="doctor-patients-list">
              {patients.map((patient) => (
                <div key={patient.id} className="doctor-patient-card">
                  <div className="doctor-patient-avatar">
                    {patient.image ? (
                      <img src={patient.image} alt={patient.name} />
                    ) : (
                      <div className="doctor-patient-avatar-placeholder">
                        {patient.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="doctor-patient-info">
                    <h3 className="doctor-patient-name">{patient.name}, {patient.age}</h3>
                    <p className="doctor-patient-condition">{patient.condition}</p>
                    <p className="doctor-patient-sessions">
                      Last: {patient.lastSession} • Next: {patient.nextSession}
                    </p>
                  </div>
                  <div className="doctor-patient-progress">
                    <FiTrendingUp className="doctor-progress-icon" />
                    <span className="doctor-progress-percentage">{patient.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'sessions' && (
          <div className="doctor-page-content doctor-sessions-page">
            <div className="doctor-sessions-page-header">
              <button className="doctor-back-button" onClick={() => handleNavigate('home')}>
                <IoMdArrowRoundBack />
              </button>
              <h2 className="doctor-sessions-page-title">Sessions</h2>
            </div>
            <div className="doctor-sessions-page-list">
              {allSessions.map((session) => (
                <div key={session.id} className="doctor-session-page-card">
                  <div className={`doctor-session-page-icon ${session.type === 'online' ? 'online' : 'inperson'}`}>
                    {session.type === 'online' ? (
                      <FaVideo />
                    ) : (
                      <FaMapMarkerAlt />
                    )}
                  </div>
                  <div className="doctor-session-page-info">
                    <h3 className="doctor-session-page-patient-name">{session.patientName}</h3>
                    <p className="doctor-session-page-date">{session.date} at {session.time}</p>
                  </div>
                  <div className="doctor-session-page-badges">
                    <div className={`doctor-session-status-badge-page ${session.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                      {session.status === 'confirmed' ? (
                        <><FaCheck /> confirmed</>
                      ) : (
                        <><FaClock /> pending</>
                      )}
                    </div>
                    <div className="doctor-session-type-badge">
                      {session.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'reports' && !selectedPatient && (
          <div className="doctor-page-content doctor-reports-list-page">
            <div className="doctor-reports-list-header">
              <button className="doctor-back-button" onClick={() => handleNavigate('home')}>
                <IoMdArrowRoundBack />
              </button>
              <h2 className="doctor-reports-list-title">Reports</h2>
            </div>
            <div className="doctor-reports-list">
              {patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="doctor-report-item-card"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setReportData({
                      observations: '',
                      progressNotes: '',
                      recommendations: '',
                      assignedExercises: ''
                    });
                  }}
                >
                  <div className="doctor-report-item-info">
                    <h3>{patient.name}</h3>
                    <p>Click to write a new report</p>
                  </div>
                  <svg className="doctor-report-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'reports' && selectedPatient && (
          <div className="doctor-page-content doctor-write-report-page">
            <div className="doctor-write-report-header">
              <button className="doctor-back-button" onClick={() => setSelectedPatient(null)}>
                <IoMdArrowRoundBack />
              </button>
              <h2 className="doctor-write-report-title">Write Report</h2>
            </div>
            <div className="doctor-write-report-patient">
              Patient: {selectedPatient.name}
            </div>
            <div className="doctor-write-report-form">
              <div className="doctor-report-field">
                <label className="doctor-report-label">Observations</label>
                <textarea
                  className="doctor-report-textarea"
                  placeholder="Enter observations..."
                  value={reportData.observations}
                  onChange={(e) => setReportData({ ...reportData, observations: e.target.value })}
                />
              </div>
              <div className="doctor-report-field">
                <label className="doctor-report-label">Progress Notes</label>
                <textarea
                  className="doctor-report-textarea"
                  placeholder="Enter progress notes..."
                  value={reportData.progressNotes}
                  onChange={(e) => setReportData({ ...reportData, progressNotes: e.target.value })}
                />
              </div>
              <div className="doctor-report-field">
                <label className="doctor-report-label">Recommendations</label>
                <textarea
                  className="doctor-report-textarea"
                  placeholder="Enter recommendations..."
                  value={reportData.recommendations}
                  onChange={(e) => setReportData({ ...reportData, recommendations: e.target.value })}
                />
              </div>
              <div className="doctor-report-field">
                <label className="doctor-report-label">Assigned Exercises</label>
                <textarea
                  className="doctor-report-textarea"
                  placeholder="Enter assigned exercises..."
                  value={reportData.assignedExercises}
                  onChange={(e) => setReportData({ ...reportData, assignedExercises: e.target.value })}
                />
              </div>
            </div>
            <div className="doctor-write-report-actions">
              <button 
                className="doctor-save-report-btn"
                onClick={() => {
                  // Handle save report logic here
                  alert('Report saved successfully!');
                  setSelectedPatient(null);
                  setReportData({
                    observations: '',
                    progressNotes: '',
                    recommendations: '',
                    assignedExercises: ''
                  });
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Report
              </button>
              <button 
                className="doctor-add-report-btn"
                onClick={() => {
                  // Handle add logic here
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorHome;

