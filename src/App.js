import React, { useState, useEffect } from 'react';
import './App.css';
import SignIn from './Components/Sign in/SignIn';
import Home from './Components/Home/Home';
import DoctorHome from './Components/DoctorHome/DoctorHome';

function App() {
  const [currentView, setCurrentView] = useState('signin'); // 'signin' or 'home'
  const [userRole, setUserRole] = useState(null); // 'child' or 'doctor'
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const data = JSON.parse(savedUserData);
        setUserRole(data.role);
        setUserName(data.name || 'John Doe');
        setUserImage(data.image || null);
        setUserData(data);
        setCurrentView('home');
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleSignInSuccess = (role, name, image, fullData) => {
    const userDataObj = fullData ? { ...fullData, role } : {
      role,
      name: name || 'John Doe',
      image,
      mobileNumber: '',
      email: '',
      ...(role === 'child' ? { childName: '', childAge: '' } : { doctorSpecialty: '', address: '' })
    };
    
    setUserRole(role);
    setUserName(name || 'John Doe');
    setUserImage(image);
    setUserData(userDataObj);
    setCurrentView('home');
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userDataObj));
  };

  const handleUserDataUpdate = (updatedData) => {
    const newImage = updatedData.image || updatedData.childImagePreview || updatedData.imagePreview || userImage;
    const userDataObj = { 
      ...updatedData, 
      role: userRole,
      image: newImage,
      childImage: newImage,
      childImagePreview: newImage,
      imagePreview: newImage
    };
    setUserData(userDataObj);
    setUserName(updatedData.name || userName);
    setUserImage(newImage);
    
    // Save to localStorage (note: blob URLs won't persist, but we save the reference)
    localStorage.setItem('userData', JSON.stringify(userDataObj));
  };

  const handleLogout = () => {
    // Clear user data
    setUserRole(null);
    setUserName(null);
    setUserImage(null);
    setUserData(null);
    
    // Clear localStorage
    localStorage.removeItem('userData');
    
    // Return to sign in screen
    setCurrentView('signin');
  };

  return (
    <div className="App">
      <div className="animated-background">
        <div className="background-gradient"></div>
        <svg className="star star-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <svg className="star star-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.5"/>
        </svg>
        <svg className="heart" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="app-content">
        {currentView === 'signin' ? (
          <SignIn onSignInSuccess={handleSignInSuccess} />
        ) : userRole === 'doctor' ? (
          <DoctorHome 
            userName={userName} 
            userImage={userImage}
            userData={userData}
            onUserDataUpdate={handleUserDataUpdate}
            onLogout={handleLogout}
          />
        ) : (
          <Home 
            userName={userName} 
            userImage={userImage}
            userData={userData}
            onUserDataUpdate={handleUserDataUpdate}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

export default App;
