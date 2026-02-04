import React, { useState, useEffect, useRef } from 'react';
import './VideoCall.css';
import { FaPhone, FaVideo, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaLock} from 'react-icons/fa';

const VideoCall = ({ contact, isVideo, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(isVideo);
  const [showMenu, setShowMenu] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Start camera/microphone
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideo ? { facingMode: 'user' } : false,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current && isVideo) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
      }
    };

    if (isVideo) {
      startMedia();
    }

    // Simulate call connection after 3 seconds
    const timer = setTimeout(() => {
      setIsRinging(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideo]);

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (onEndCall) {
      onEndCall();
    }
  };

  const handleToggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch(action) {
      case 'share-screen':
        alert('Screen sharing feature');
        break;
      case 'send-message':
        alert('Send message feature');
        break;
      case 'add-participant':
        alert('Add participant feature');
        break;
      case 'switch-camera':
        alert('Switch camera feature');
        break;
      default:
        break;
    }
  };

  return (
    <div className="video-call-container">

      {/* Background Pattern */}
      <div className="call-background"></div>

      {/* Header */}
      <div className="call-header">
        <div className="call-header-info">
          <h2 className="call-contact-name">{contact?.name || 'Contact'}</h2>
          <p className="call-status">
            {isRinging ? 'يتصل...' : isVideo ? 'مكالمة فيديو' : 'مكالمة صوتية'}
          </p>
        </div>
      </div>


      {/* Main Video/Profile Area */}
      <div className="call-main-area">
        {isVideo && isVideoOn && localVideoRef.current ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
        ) : (
          <div className="call-profile-container">
            <div className={`call-profile-image ${isRinging ? 'ringing' : ''}`}>
              {contact?.image ? (
                <img src={contact.image} alt={contact.name} />
              ) : (
                <div className="call-avatar-placeholder">
                  {contact?.name?.charAt(0) || 'C'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Local Video (Small) */}
        {isVideo && isVideoOn && (
          <div className="local-video-container">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="call-controls">
        <div className="call-controls-top">
          <div className="call-encryption-info">
            <FaLock />
            <span>مشفرة تماما بين الطرفين</span>
          </div>
        </div>
        <div className="call-controls-bottom">
          <button 
            className="call-control-btn hangup-btn" 
            onClick={handleEndCall}
            title="End Call"
          >
            <FaPhone />
          </button>
          <button 
            className={`call-control-btn ${isMuted ? 'active' : ''}`}
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button 
            className={`call-control-btn ${isSpeakerOn ? 'active' : ''}`}
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            title={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
          >
            {isSpeakerOn ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          {isVideo && (
            <button 
              className={`call-control-btn ${isVideoOn ? 'active' : ''}`}
              onClick={handleToggleVideo}
              title={isVideoOn ? 'Turn off video' : 'Turn on video'}
            >
              <FaVideo />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default VideoCall;

