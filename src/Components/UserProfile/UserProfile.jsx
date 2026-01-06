import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoMdArrowRoundBack } from "react-icons/io";


const UserProfile = ({ userData, role, onSave, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    childName: '',
    childAge: '',
    childImage: null,
    childImagePreview: null,
    imagePreview: null,
    doctorSpecialty: '',
    address: '',
    certificateImage: null,
    certificateImagePreview: null,
    licenseImage: null,
    licenseImagePreview: null,
    idImage: null,
    idImagePreview: null
  });

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  useEffect(() => {
    if (userData && !isEditing) {
      const currentImage = userData.childImagePreview || userData.image || userData.childImage || null;
      setFormData(prev => {
        // Only update if we don't have a preview already (to avoid overwriting user's changes)
        const shouldUpdateImage = !prev.childImagePreview && !prev.imagePreview;
        return {
          ...prev,
          name: userData.name || prev.name || '',
          mobileNumber: userData.mobileNumber || prev.mobileNumber || '',
          email: userData.email || prev.email || '',
          childName: userData.childName || prev.childName || '',
          childAge: userData.childAge || prev.childAge || '',
          childImagePreview: shouldUpdateImage ? currentImage : prev.childImagePreview,
          imagePreview: shouldUpdateImage ? currentImage : prev.imagePreview,
          doctorSpecialty: userData.doctorSpecialty || prev.doctorSpecialty || '',
          address: userData.address || prev.address || '',
          certificateImagePreview: userData.certificateImage || prev.certificateImagePreview || null,
          licenseImagePreview: userData.licenseImage || prev.licenseImagePreview || null,
          idImagePreview: userData.idImage || prev.idImagePreview || null
        };
      });
    }
  }, [userData, isEditing]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData({
        ...formData,
        [fieldName]: file,
        [fieldName + 'Preview']: preview
      });
    }
  };

  const handleSave = () => {
    const newImage = formData.childImagePreview || formData.imagePreview || userData?.image || userData?.childImage || null;
    const updatedData = {
      ...userData,
      ...formData,
      image: newImage,
      childImage: newImage,
      childImagePreview: newImage,
      imagePreview: newImage
    };
    if (onSave) {
      onSave(updatedData);
    }
    // Update formData to reflect saved changes
    setFormData({
      ...formData,
      childImagePreview: newImage,
      imagePreview: newImage
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        mobileNumber: userData.mobileNumber || '',
        email: userData.email || '',
        childName: userData.childName || '',
        childAge: userData.childAge || '',
        childImage: null,
        childImagePreview: userData.childImage || userData.image || null,
        imagePreview: userData.image || userData.childImage || null,
        doctorSpecialty: userData.doctorSpecialty || '',
        address: userData.address || '',
        certificateImage: null,
        certificateImagePreview: userData.certificateImage || null,
        licenseImage: null,
        licenseImagePreview: userData.licenseImage || null,
        idImage: null,
        idImagePreview: userData.idImage || null
      });
    }
    setIsEditing(false);
  };

  // Always prioritize formData preview first (for immediate updates), then saved userData
  const displayImage = (formData.childImagePreview || formData.imagePreview) || (userData?.childImagePreview || userData?.image || userData?.childImage) || null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous blob URL to prevent memory leaks
      if (formData.childImagePreview && formData.childImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.childImagePreview);
      }
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        childImage: file,
        childImagePreview: preview,
        imagePreview: preview
      }));
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <button className="back-btn" onClick={onBack}><IoMdArrowRoundBack />
       </button>
        <h2>User Profile</h2>
      </div>

      <div className="profile-page-content">
          {/* Profile Image */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              {displayImage ? (
                <img src={displayImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  {(userData?.name || formData.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <label className="camera-icon-overlay">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div className="camera-icon">📷</div>
                </label>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="profile-info-section">
            <div className="info-row">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="profile-input"
                  placeholder="Enter name"
                />
              ) : (
                <span>{userData?.name || formData.name || 'Not specified'}</span>
              )}
            </div>

            <div className="info-row">
              <label>Phone Number:</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="profile-input"
                  placeholder="Enter phone number"
                />
              ) : (
                <span>{userData?.mobileNumber || formData.mobileNumber || 'Not specified'}</span>
              )}
            </div>

            <div className="info-row">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                  placeholder="Enter email"
                />
              ) : (
                <span>{userData?.email || formData.email || 'Not specified'}</span>
              )}
            </div>

            {/* Child-specific fields */}
            {role === 'child' && (
              <>
                <div className="info-row">
                  <label>Child Name:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Enter child name"
                    />
                  ) : (
                    <span>{userData?.childName || formData.childName || 'Not specified'}</span>
                  )}
                </div>

                <div className="info-row">
                  <label>Child Age:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Enter child age"
                    />
                  ) : (
                    <span>{userData?.childAge || formData.childAge || 'Not specified'}</span>
                  )}
                </div>
              </>
            )}

            {/* Doctor-specific fields */}
            {role === 'doctor' && (
              <>
                <div className="info-row">
                  <label>Specialty:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="doctorSpecialty"
                      value={formData.doctorSpecialty}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Enter specialty"
                    />
                  ) : (
                    <span>{userData?.doctorSpecialty || formData.doctorSpecialty || 'Not specified'}</span>
                  )}
                </div>

                <div className="info-row">
                  <label>Address:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="Enter address"
                    />
                  ) : (
                    <span>{userData?.address || formData.address || 'Not specified'}</span>
                  )}
                </div>

                {/* Doctor Documents */}
                <div className="documents-section">
                  <h3>Documents</h3>
                  
                  <div className="document-item">
                    <label>Certificate:</label>
                    {isEditing ? (
                      <label className="upload-document-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'certificateImage')}
                          style={{ display: 'none' }}
                        />
                        {formData.certificateImagePreview ? 'Updated' : 'Upload File'}
                      </label>
                    ) : (
                      formData.certificateImagePreview ? (
                        <img src={formData.certificateImagePreview} alt="Certificate" className="document-preview" />
                      ) : (
                        <span>Not available</span>
                      )
                    )}
                  </div>

                  <div className="document-item">
                    <label>License:</label>
                    {isEditing ? (
                      <label className="upload-document-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'licenseImage')}
                          style={{ display: 'none' }}
                        />
                        {formData.licenseImagePreview ? 'Updated' : 'Upload File'}
                      </label>
                    ) : (
                      formData.licenseImagePreview ? (
                        <img src={formData.licenseImagePreview} alt="License" className="document-preview" />
                      ) : (
                        <span>Not available</span>
                      )
                    )}
                  </div>

                  <div className="document-item">
                    <label>ID Card:</label>
                    {isEditing ? (
                      <label className="upload-document-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'idImage')}
                          style={{ display: 'none' }}
                        />
                        {formData.idImagePreview ? 'Updated' : 'Upload File'}
                      </label>
                    ) : (
                      formData.idImagePreview ? (
                        <img src={formData.idImagePreview} alt="ID Card" className="document-preview" />
                      ) : (
                        <span>Not available</span>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-profile-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-profile-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default UserProfile;
