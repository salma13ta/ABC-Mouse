import React, { useState, useEffect } from 'react';
import './SignIn.css';
import childImage from './children-reading-removebg-preview.png';
import doctorImage from './doctor-child-removebg-preview.png';
import WelcomeBack from './WelcomeBack';
import SignUp from './SignUp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import imgLogo from '../video-img/WhatsApp_Image_2026-01-05_at_4.43.00_PM-removebg-preview.png';

const SignIn = ({ onSignInSuccess }) => {
  const [selectedRole, setSelectedRole] = useState(null); // 'child' or 'doctor'
  const [currentScreen, setCurrentScreen] = useState('role-selection'); // 'role-selection', 'signin', 'signup'

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentScreen('signin');
  };

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };

  const handleSignInSuccess = (name, image, fullData) => {
    if (onSignInSuccess) {
      onSignInSuccess(selectedRole, name, image, fullData);
    }
  };

  //add animation..................
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  // Show Welcome Back (Sign In) screen
  if (currentScreen === 'signin') {
    return <WelcomeBack role={selectedRole} onScreenChange={handleScreenChange} onSignInSuccess={handleSignInSuccess} />;
  }

  // Show Sign Up screen
  if (currentScreen === 'signup') {
    return (
      <SignUp 
        role={selectedRole} 
        onScreenChange={handleScreenChange}
        onSignUpSuccess={handleSignInSuccess}
      />
    );
  }

  // Show role selection screen
  return (
    <div data-aos="fade-down" className="signin-container">
      <div className="signin-content">
        <img src={imgLogo} alt="logo" className="logo" />
        <h1 className="signin-title">Who are you?</h1>
        <p className="signin-paragraph">Your child's journey to better communication starts here!</p>
        <div className="role-options">
          <div 
            className="role-card" 
            style={{backgroundImage: `url("${childImage}")`}}
            onClick={() => handleRoleSelect('child')}
          >
            <div className="role-overlay"></div>
            <div className="role-content">
              <h2 className="role-title">I'm a Child</h2>
              <p className="role-description">Explore games, stories, and learning adventures!</p>
            </div>
          </div>
          <div 
            className="role-card" 
            style={{backgroundImage: `url("${doctorImage}")`}}
            onClick={() => handleRoleSelect('doctor')}
          >
            <div className="role-overlay"></div>
            <div className="role-content">
              <h2 className="role-title">I'm a Doctor</h2>
              <p className="role-description">Access patient records, manage appointments, and clinical tools.</p>
              <a href="/support" className="support-link">Need help? Contact support</a>
            </div>
          </div>
        </div>
        <p className="signin-paragraph">Explore games, stories, and learning adventures!</p>
      </div>
    </div>
  );
};

export default SignIn;

