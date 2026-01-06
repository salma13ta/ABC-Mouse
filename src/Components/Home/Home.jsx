import React, { useState, useEffect, useCallback } from 'react';
import './Home.css';
import Chat from '../chat/Chat';
import UserProfile from '../UserProfile/UserProfile';
import FindDoctor from '../FindDoctor/FindDoctor';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import ExercisesPage from '../Exercises/ExercisesPage';
import ProgressPage from '../Progress/ProgressPage';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBell, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getDoctorExercises, getDoctorProgress } from '../../services/mockDoctorData';

// Sessions data - moved outside component to avoid re-creation
const upcomingSessions = [
    {
      doctorName: "Dr. Sarah Johnson",
      dateTime: new Date(2026, 0, 12, 10, 0),
      type: "Online",
      icon: "video",
    },
    {
      doctorName: "Dr. Emily Rodriguez",
      dateTime: new Date(2026, 0, 13, 14, 0),
      type: "In-Person",
      icon: "location",
    },
    {
      doctorName: "Dr. Michael Brown",
      dateTime: new Date(2026, 0, 14, 11, 30),
      type: "Online",
      icon: "video",
    },
    {
      doctorName: "Dr. Olivia Wilson",
      dateTime: new Date(2026, 0, 15, 9, 0),
      type: "In-Person",
      icon: "location",
    },
    {
      doctorName: "Dr. David Anderson",
      dateTime: new Date(2026, 0, 16, 13, 0),
      type: "Online",
      icon: "video",
    },
    {
      doctorName: "Dr. Sophia Martinez",
      dateTime: new Date(2026, 0, 17, 15, 30),
      type: "In-Person",
      icon: "location",
    },
    {
      doctorName: "Dr. James Taylor",
      dateTime: new Date(2026, 0, 18, 10, 0),
      type: "Online",
      icon: "video",
    },
    {
      doctorName: "Dr. Emma Thomas",
      dateTime: new Date(2026, 0, 19, 12, 0),
      type: "In-Person",
      icon: "location",
    },
    {
      doctorName: "Dr. Daniel Moore",
      dateTime: new Date(2026, 0, 20, 16, 0),
      type: "Online",
      icon: "video",
    },
    {
      doctorName: "Dr. Isabella Clark",
      dateTime: new Date(2026, 0, 21, 9, 30),
      type: "In-Person",
      icon: "location",
    },
];

const Home = ({ role, userName, userImage, userData, onUserDataUpdate, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [settingsState, setSettingsState] = useState({
    notifications: true,
    sounds: true,
    muteSessionReminders: false,
  });
  const [selectedDoctorId] = useState('doctor-1'); // placeholder until API connects
  const [selectedChildId] = useState('child-1'); // placeholder until API connects
  const [exercisesData, setExercisesData] = useState(() => getDoctorExercises());
  const [progressData, setProgressData] = useState(() => getDoctorProgress());
  const avatarImage = userImage || userData?.image || userData?.childImagePreview || userData?.childImage;
  const avatarName = (userName || userData?.name || userData?.childName || '').trim();
  const avatarInitial = avatarName ? avatarName.charAt(0).toUpperCase() : '?';

  // Format date and time
  const formatDateTime = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${month} ${day}, ${year} at ${hours}:${minutesStr} ${ampm}`;
  };

  // Get sessions to display (2 initially, all when showAllSessions is true)
  const displayedSessions = showAllSessions ? upcomingSessions : upcomingSessions.slice(0, 2);

  // Calculate progress percentage based on exercises
  // This function reads exercises data from userData or localStorage
  // To update progress, set userData.exercises = { total: number, completed: number }
  // Or save to localStorage: localStorage.setItem('exercisesData', JSON.stringify({ total: 10, completed: 5 }))
  const calculateProgress = useCallback(() => {
    // Get exercises data from userData or localStorage
    let exercisesData = null;
    
    if (userData?.exercises) {
      exercisesData = userData.exercises;
    } else {
      try {
        const stored = localStorage.getItem('exercisesData');
        if (stored) {
          exercisesData = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error parsing exercises data:', e);
      }
    }
    
    // If exercises data exists, calculate percentage
    if (exercisesData && typeof exercisesData.total === 'number' && typeof exercisesData.completed === 'number' && exercisesData.total > 0) {
      const percentage = Math.round((exercisesData.completed / exercisesData.total) * 100);
      return Math.min(percentage, 100); // Cap at 100%
    }
    
    // Default progress if no exercises data
    return userData?.progressPercentage || 0;
  }, [userData]);

  const [progressPercentage, setProgressPercentage] = useState(() => calculateProgress());

  useEffect(() => {
    setIsLoaded(true);
    // Update progress when userData changes
    setProgressPercentage(calculateProgress());
  }, [userData, calculateProgress]);

  //add animation..................
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  // Load mock data tied to doctor/child to make it easy to swap with API later
  const loadDoctorData = useCallback(() => {
    setExercisesData(getDoctorExercises(selectedDoctorId, selectedChildId));
    setProgressData(getDoctorProgress(selectedDoctorId, selectedChildId));
  }, [selectedDoctorId, selectedChildId]);

  useEffect(() => {
    loadDoctorData();
  }, [loadDoctorData]);

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
    <div className="home-container">
      {/* Merged Navbar and Child Profile Section */}
      {currentPage !== 'profile-menu' && (
        <div data-aos="fade-down" className={`home-navbar-merged ${isLoaded ? 'fade-in aos-init aos-animate' : ''}`}>
          <div className="navbar-content" onClick={() => handleNavigate('home')} style={{ cursor: 'pointer' }}>
            <div className="navbar-left">
              <div className="user-avatar" onClick={(e) => { e.stopPropagation(); handleAvatarClick(e); }} style={{ cursor: 'pointer' }}>
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt={avatarName || 'Profile'} 
                    className="avatar-img" 
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {avatarInitial}
                  </div>
                )}
              </div>
              <div className="user-info" style={{ cursor: 'pointer', flex: 1 }}>
                <p className="welcome-text">Welcome back,</p>
                <h3 className="user-greeting">
                  {userName || userData?.name || 'Parent'} , {userData?.childAge || '5'} years
                </h3>
              </div>
            </div>
            <div className="navbar-right">
              <div className="navbar-right-icons-container">
                 <div className="notification-icon" onClick={(e) => { e.stopPropagation(); handleNotificationClick(e); }}>
                <FaBell />
                {notificationCount > 0 && (
                  <span className="notification-badge notification-dot"></span>
                )}
              </div>
              <div className="profile-icon" onClick={(e) => { e.stopPropagation(); handleAvatarClick(e); }} style={{ cursor: 'pointer' }}>
                <CgProfile className="profile-icon-icon"/>
              </div>
              </div>
              <div>
                <div className="progress-percentage">{progressPercentage}%</div>
                <p className="progress-label">Progress</p>
              </div>
            </div>
            
          </div>
        </div>
      )}

      <div className="home-content">
        {currentPage === 'home' && (
          <div className={`home-main ${isLoaded ? 'loaded' : ''}`}>
            {/* Functionality Cards Grid */}
            <div className={`functionality-section ${isLoaded ? 'fade-in aos-init aos-animate' : ''}`}>
              <div className="functionality-grid">
                <div className={`functionality-card find-doctor-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
                  onClick={() => handleNavigate('find-doctor')}
                  data-aos="fade-up"
                >
                  <div className="card-icon find-doctor-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h3 className="card-title">Find Doctor</h3>
                  <p className="card-subtitle">Browse specialists</p>
                </div>

                <div className={`functionality-card exercises-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
                  onClick={() => handleNavigate('exercises')}
                  data-aos="fade-up"
                >
                  <div className="card-icon exercises-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <h3 className="card-title">Exercises</h3>
                  <p className="card-subtitle">Practice activities</p>
                </div>

                <div className={`functionality-card exercises-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
                  onClick={() => handleNavigate('progress')}
                  data-aos="fade-up"
                >
                  <div className="card-icon progress-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                  </div>
                  <h3 className="card-title">Progress</h3>
                  <p className="card-subtitle">View reports</p>
                </div>

                <div className={`functionality-card messages-card ${isLoaded ? 'aos-init aos-animate' : ''}`}
                  onClick={() => handleNavigate('chat')}
                  data-aos="fade-up"
                >
                  <div className="card-icon messages-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="card-title">Messages</h3>
                  <p className="card-subtitle">Chat with doctor</p>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions Section */}
            <div className="upcoming-sessions-section">
              <div className="sessions-header">
                <h2 className="sessions-title">Upcoming Sessions</h2>
                {upcomingSessions.length > 2 && (
                <div className="view-all-container">
                  <button 
                    className="view-all-btn"
                    onClick={() => setShowAllSessions(!showAllSessions)}
                  >
                    {showAllSessions ? 'Show Less' : 'View All'}
                  </button>
                </div>
              )}
              </div>
              <div className="sessions-list">
                {displayedSessions && displayedSessions.length > 0 ? (
                  displayedSessions.map((session, index) => (
                    <div key={index} className="session-card">
                      <div className={`session-icon ${session.icon === 'video' ? 'video-icon' : 'location-icon'}`}>
                        {session.icon === 'video' ? (
                          <FaVideo />
                        ) : (
                          <FaMapMarkerAlt />
                        )}
                      </div>
                      <div className="session-info">
                        <h3 className="session-doctor-name">{session.doctorName}</h3>
                        <p className="session-date-time">{formatDateTime(session.dateTime)}</p>
                      </div>
                      <div className={`session-badge ${session.type === 'Online' ? 'online-badge' : 'inperson-badge'}`}>
                        {session.type}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-sessions">No upcoming sessions</div>
                )}
              </div>
            </div>

            {/* This Month's Progress Section */}
            <div className={`progress-section ${isLoaded ? 'fade-in aos-init aos-animate' : ''}`}>
              <h2 className="progress-section-title">This Month's Progress</h2>
              <div className="progress-chart-container">
                {/* Chart placeholder - can be replaced with actual chart component */}
                <div className="progress-chart-placeholder">
                  <div className="chart-months">
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                    <span>Jan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentPage === 'find-doctor' && (
          <div className="page-content find-doctor-page-wrapper">
            <FindDoctor onBack={() => handleNavigate('home')} />
          </div>
        )}
        {currentPage === 'exercises' && (
          <ExercisesPage data={exercisesData} onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'chat' && (
          <div className="page-content chat-page">
            <Chat 
              onBack={() => handleNavigate('home')} 
              userImage={userImage || userData?.image || userData?.childImagePreview || userData?.childImage}
              userName={userName || userData?.name || userData?.childName}
            />
          </div>
        )}
        {currentPage === 'progress' && (
          <div className="page-content progress-page-wrapper">
            <ProgressPage data={progressData} onBack={() => handleNavigate('home')} />
          </div>
        )}
        {currentPage === 'profile' && (
          <div className="page-content profile-page-wrapper">
            <UserProfile
              userData={userData}
              role={role}
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
          <div className="page-content simple-page">
            <div className="simple-page-header">
              <button className="back-button" onClick={() => handleNavigate('profile-menu')}>
                <IoMdArrowRoundBack />
              </button>
              <h2>Settings</h2>
            </div>
            <div className="settings-list">
              {[
                { key: 'notifications', title: 'Notifications', desc: 'Receive alerts about sessions and updates' },
                { key: 'sounds', title: 'Sound Effects', desc: 'Play friendly sounds in the app' },
                { key: 'muteSessionReminders', title: 'Mute Session Reminders', desc: 'Silence reminders during quiet hours' },
              ].map(item => (
                <div key={item.key} className="setting-item">
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!!settingsState[item.key]}
                      onChange={(e) => setSettingsState(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentPage === 'help' && (
          <div className="page-content simple-page">
            <div className="simple-page-header">
              <button className="back-button" onClick={() => handleNavigate('profile-menu')}>
                <IoMdArrowRoundBack />
              </button>
              <h2>Help & Support</h2>
            </div>
            <p className="simple-page-copy help-subtitle">We're here to help you and your child every step of the way.</p>
            <div className="help-grid">
              {[
                { icon: '❓', title: 'FAQ', text: 'Find quick answers to common questions parents often ask.' },
                { icon: '🧭', title: 'How It Works', text: 'Learn how to use the platform step by step with ease.' },
                { icon: '👨‍👩‍👧', title: 'Parent Guide', text: 'Simple tips to help you support your child during activities.' },
                { icon: '🛠', title: 'Technical Support', text: 'Facing a technical issue? We're here to help you fix it.' },
                { icon: '💬', title: 'Contact Support', text: 'Get in touch with our support team anytime you need help.' },
                { icon: '🔒', title: 'Safety & Privacy', text: 'Your child's safety and privacy are always our top priority.' },
              ].map((item, idx) => (
                <div key={idx} className="help-card">
                  <div className="help-icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="help-cta">
              <div>
                <h4>Need Help Now?</h4>
                <p>Chat with our team for quick assistance.</p>
              </div>
              <button className="primary-btn">Contact Support</button>
            </div>
          </div>
        )}
        {currentPage === 'notifications' && (
          <div data-aos="fade-down" className="page-content notifications-page-wrapper">
            <div className="notifications-page">
              <div className="notifications-page-header">
                <button className="back-button" onClick={() => handleNavigate('home')}>
                  <IoMdArrowRoundBack />
                </button>
                <h2 className="notifications-page-title">Notifications</h2>
              </div>
              <div className="notifications-page-list">
                {notificationCount > 0 ? (
                  <>
                    <div className="notification-page-item">
                      <div className="notification-page-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div className="notification-page-content">
                        <h4>Session Reminder</h4>
                        <p>You have a session with Dr. Sarah Johnson tomorrow at 10:00 AM</p>
                        <span className="notification-page-time">1 hour ago</span>
                      </div>
                    </div>
                    <div className="notification-page-item">
                      <div className="notification-page-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div className="notification-page-content">
                        <h4>New Exercise Assigned</h4>
                        <p>Dr. Emily Rodriguez assigned 3 new exercises</p>
                        <span className="notification-page-time">3 hours ago</span>
                      </div>
                    </div>
                    <div className="notification-page-item">
                      <div className="notification-page-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <div className="notification-page-content">
                        <h4>Progress Report Available</h4>
                        <p>Your monthly progress report is ready to view</p>
                        <span className="notification-page-time">1 day ago</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-notifications-page">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

