import React from 'react';
import './ProfileMenu.css';
import { FaUserEdit, FaCog, FaLifeRing, FaSignOutAlt } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';

const ProfileMenu = ({
  userImage,
  userData,
  userName,
  onBack,
  onEditProfile,
  onSettings,
  onHelp,
  onLogout,
}) => {
  return (
    <div className="page-wrapper profile-menu-page">
      <div className="profile-menu-hero">
        <button className="profile-menu-back" onClick={onBack}>
          <IoMdArrowRoundBack />
        </button>
        <div className="profile-menu-avatar">
          <div className="profile-menu-avatar-inner">
            {userImage || userData?.image ? (
              <img src={userImage || userData?.image} alt="Parent" />
            ) : (
              <CgProfile />
            )}
          </div>
        </div>
        <h3 className="profile-menu-name">{userName || userData?.name || 'Parent Name'}</h3>
        <p className="profile-menu-email">{userData?.email || 'parent@email.com'}</p>
      </div>
      <div className="profile-menu-list">
        <button className="profile-menu-item" onClick={onEditProfile}>
          <div className="profile-menu-icon edit"><FaUserEdit /></div>
          <span>Edit Profile</span>
          <span className="profile-menu-arrow">→</span>
        </button>
        <button className="profile-menu-item" onClick={onSettings}>
          <div className="profile-menu-icon settings"><FaCog /></div>
          <span>Settings</span>
          <span className="profile-menu-arrow">→</span>
        </button>
        <button className="profile-menu-item" onClick={onHelp}>
          <div className="profile-menu-icon help"><FaLifeRing /></div>
          <span>Help & Support</span>
          <span className="profile-menu-arrow">→</span>
        </button>
        <button className="profile-menu-item logout" onClick={onLogout}>
          <div className="profile-menu-icon logout"><FaSignOutAlt /></div>
          <span>Logout</span>
          <span className="profile-menu-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;


