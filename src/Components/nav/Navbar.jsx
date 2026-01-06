import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaBell } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CgProfile } from "react-icons/cg";


const Navbar = ({ userName, userImage, onNavigate, userData, role, onUserDataUpdate, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const avatarImage = userImage || userData?.image || userData?.childImagePreview || userData?.childImage;
  const avatarName = (userName || userData?.name || userData?.childName || '').trim();
  const avatarInitial = avatarName ? avatarName.charAt(0).toUpperCase() : '?';

  //add animation..................
  useEffect(() => {
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


  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowMenu(false);
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowNotifications(false);
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  return (
    <div data-aos="fade-down" className="home-navbar-merged fade-in aos-init aos-animate">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="user-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            {avatarImage ? (
              <img 
                src={avatarImage}
                className="avatar-img" 
              />
            ) : (
              <div className="avatar-placeholder">
                {avatarInitial}
              </div>
            )}
          </div>
          <div className="user-info" onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer', flex: 1 }}>
            <p className="welcome-text">Welcome back,</p>
            <h3 className="user-greeting">
              {userName || 'Parent'}
            </h3>
          </div>
        </div>
        <div className="navbar-right">
          <div className="notification-icon" onClick={handleNotificationClick}>
            <FaBell />
            {notificationCount > 0 && (
              <span className="notification-badge notification-dot"></span>
            )}
          </div>
          <div className="profile-icon" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
          <CgProfile className="profile-icon-icon"/>
          </div>
          
        </div>
      </div>
      
      {showNotifications && (
        <div data-aos="fade-down" className="notifications-dialog">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="close-notifications-btn" onClick={() => setShowNotifications(false)}>
              ×
            </button>
          </div>
          <div className="notifications-list">
            {notificationCount > 0 ? (
              <>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>New Message</h4>
                    <p>You have a new message from Dr. Ahmed</p>
                    <span className="notification-time">2 minutes ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>Session Reminder</h4>
                    <p>Your session starts in 30 minutes</p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>Progress Update</h4>
                    <p>Your child's progress report is ready</p>
                    <span className="notification-time">3 hours ago</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-notifications">
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

