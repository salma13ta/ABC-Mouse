import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import { FaSearch, FaPaperPlane, FaImage, FaFile, FaMicrophone, FaPhone, FaVideo, FaEllipsisV, FaInfoCircle, FaCheckSquare, FaBellSlash, FaClock, FaHeart, FaTimesCircle, FaThumbsDown, FaBan, FaMinusCircle, FaTrash } from 'react-icons/fa';
import VideoCall from './VideoCall';
import { IoMdArrowRoundBack } from "react-icons/io";

const Chat = ({ onBack, userImage, userName }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageList, setShowImageList] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const avatarName = (userName || '').trim();
  const avatarInitial = avatarName ? avatarName.charAt(0).toUpperCase() : '?';

  // Mock data for chats
  const chats = [
    { 
      id: 1, 
      name: 'Dr. Ahmed', 
      image: null, 
      lastMessage: "How can I help Maram?", 
      time: '10:30 AM',
      unread: 2
    },
    { 
      id: 2, 
      name: 'Dr. Sarah', 
      image: null, 
      lastMessage: "Maram needs help", 
      time: '9:15 AM',
      unread: 0
    },
    { 
      id: 3, 
      name: 'Dr. Mohamed', 
      image: null, 
      lastMessage: "I'll provide extra lessons to her this week", 
      time: 'Yesterday',
      unread: 1
    },
    { 
      id: 4, 
      name: 'Dr. Fatima', 
      image: null, 
      lastMessage: "Great progress!", 
      time: '2 days ago',
      unread: 0
    }
  ];

  // Initialize messages for each chat
  const initializeMessages = (chatId) => {
    if (!messages[chatId]) {
      const chatMessages = {
        1: [
          { id: 1, text: "How can I help Maram?", sender: 'doctor', time: '10:30 AM' },
          { id: 2, text: "Maram needs help", sender: 'user', time: '10:25 AM' },
          { id: 3, text: "I'll provide extra lessons to her this week", sender: 'doctor', time: '10:20 AM' }
        ],
        2: [
          { id: 1, text: "Hello, how can I assist you today?", sender: 'doctor', time: '9:15 AM' }
        ],
        3: [
          { id: 1, text: "I'll provide extra lessons to her this week", sender: 'doctor', time: 'Yesterday' }
        ],
        4: [
          { id: 1, text: "Great progress!", sender: 'doctor', time: '2 days ago' }
        ]
      };
      setMessages({ ...messages, [chatId]: chatMessages[chatId] || [] });
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    initializeMessages(chat.id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages({
        ...messages,
        [selectedChat.id]: [...(messages[selectedChat.id] || []), message]
      });
      setNewMessage('');
    }
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && selectedChat) {
      if (type === 'image') {
        setSelectedImages(files);
        setShowImageList(true);
      } else {
        // For single file
        const file = files[0];
        const message = {
          id: Date.now(),
          type: type,
          file: file,
          fileName: file.name,
          sender: 'user',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages({
          ...messages,
          [selectedChat.id]: [...(messages[selectedChat.id] || []), message]
        });
      }
    }
    // Reset input
    e.target.value = '';
  };

  const handleSendImages = () => {
    if (selectedImages.length > 0 && selectedChat) {
      selectedImages.forEach((image) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'image',
          file: image,
          fileName: image.name,
          sender: 'user',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages({
          ...messages,
          [selectedChat.id]: [...(messages[selectedChat.id] || []), message]
        });
      });
      setSelectedImages([]);
      setShowImageList(false);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (selectedChat && audioBlob.size > 0) {
          const message = {
            id: Date.now(),
            type: 'audio',
            file: audioBlob,
            sender: 'user',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages({
            ...messages,
            [selectedChat.id]: [...(messages[selectedChat.id] || []), message]
          });
        }
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone access to record voice messages.');
    }
  };

  const handleRecordStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePhoneCall = () => {
    setActiveCall({ contact: selectedChat, isVideo: false });
  };

  const handleVideoCall = () => {
    setActiveCall({ contact: selectedChat, isVideo: true });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleBackFromCall = () => {
    setActiveCall(null);
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch(action) {
      case 'contact-info':
        alert('Contact Info');
        break;
      case 'select-messages':
        alert('Select Messages');
        break;
      case 'mute':
        alert('Notifications Muted');
        break;
      case 'disappearing':
        alert('Disappearing Messages');
        break;
      case 'favourites':
        alert('Added to Favourites');
        break;
      case 'close':
        setSelectedChat(null);
        break;
      case 'report':
        alert('Report Chat');
        break;
      case 'block':
        alert('User Blocked');
        break;
      case 'clear':
        if (selectedChat) {
          setMessages({
            ...messages,
            [selectedChat.id]: []
          });
        }
        break;
      case 'delete':
        if (selectedChat) {
          setMessages({
            ...messages,
            [selectedChat.id]: []
          });
          setSelectedChat(null);
        }
        break;
      default:
        break;
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatMessages = selectedChat ? (messages[selectedChat.id] || []) : [];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Show call screen if active
  if (activeCall) {
    return (
      <VideoCall
        contact={activeCall.contact}
        isVideo={activeCall.isVideo}
        onEndCall={handleEndCall}
        onBack={handleBackFromCall}
      />
    );
  }

  if (selectedChat) {
    return (
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <button className="back-btn" onClick={() => setSelectedChat(null)}>
          <IoMdArrowRoundBack />
          </button>
          <div className="chat-header-info">
            <div className="chat-avatar">
              {selectedChat.image ? (
                <img src={selectedChat.image} alt={selectedChat.name} />
              ) : (
                <div className="avatar-placeholder">
                  {selectedChat.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="chat-name-info">
              <h3>{selectedChat.name}</h3>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="action-btn" onClick={handlePhoneCall} title="Call">
              <FaPhone />
            </button>
            <button className="action-btn" onClick={handleVideoCall} title="Video Call">
              <FaVideo />
            </button>
            <div className="menu-container">
              <button className="action-btn" onClick={() => setShowMenu(!showMenu)} title="More Options">
                <FaEllipsisV />
              </button>
              {showMenu && (
                <div className="dropdown-menu">
                  <div className="menu-section">
                    <button className="menu-item" onClick={() => handleMenuAction('contact-info')}>
                      <FaInfoCircle />
                      <span>Contact info</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('select-messages')}>
                      <FaCheckSquare />
                      <span>Select messages</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('mute')}>
                      <FaBellSlash />
                      <span>Mute notifications</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('disappearing')}>
                      <FaClock />
                      <span>Disappearing messages</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('favourites')}>
                      <FaHeart />
                      <span>Add to favourites</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('close')}>
                      <FaTimesCircle />
                      <span>Close chat</span>
                    </button>
                  </div>
                  <div className="menu-divider"></div>
                  <div className="menu-section">
                    <button className="menu-item" onClick={() => handleMenuAction('report')}>
                      <FaThumbsDown />
                      <span>Report</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('block')}>
                      <FaBan />
                      <span>Block</span>
                    </button>
                    <button className="menu-item" onClick={() => handleMenuAction('clear')}>
                      <FaMinusCircle />
                      <span>Clear chat</span>
                    </button>
                    <button className="menu-item danger" onClick={() => handleMenuAction('delete')}>
                      <FaTrash />
                      <span>Delete chat</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {selectedChatMessages.map((message) => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'message-right' : 'message-left'}`}>
              {message.sender === 'doctor' && (
                <div className="message-avatar">
                  {selectedChat.image ? (
                    <img src={selectedChat.image} alt={selectedChat.name} />
                  ) : (
                    <div className="avatar-placeholder-small">
                      {selectedChat.name.charAt(0)}
                    </div>
                  )}
                </div>
              )}
              <div className="message-content">
                {message.type === 'image' && (
                  <img src={URL.createObjectURL(message.file)} alt="Sent" className="message-image" />
                )}
                {message.type === 'file' && (
                  <div className="message-file">
                    <FaFile />
                    <span>{message.fileName}</span>
                  </div>
                )}
                {message.type === 'audio' && (
                  <div className="message-audio">
                    <audio controls src={message.file ? URL.createObjectURL(message.file) : ''}>
                      Your browser does not support the audio element.
                    </audio>
                    <span>Voice Message</span>
                  </div>
                )}
                {message.text && (
                  <p>{message.text}</p>
                )}
                <span className="message-time">{message.time}</span>
              </div>
              {message.sender === 'user' && (
                <div className="message-avatar user-avatar">
                  {userImage ? (
                    <img src={userImage} alt={avatarName || 'Profile'} />
                  ) : (
                    <div className="avatar-placeholder-small">
                      {avatarInitial}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image List Modal */}
        {showImageList && selectedImages.length > 0 && (
          <div className="image-list-modal">
            <div className="image-list-header">
              <h3>Selected Images ({selectedImages.length})</h3>
              <button className="close-modal-btn" onClick={() => { setShowImageList(false); setSelectedImages([]); }}>
                ×
              </button>
            </div>
            <div className="image-list-grid">
              {selectedImages.map((image, index) => (
                <div key={index} className="image-list-item">
                  <img src={URL.createObjectURL(image)} alt={`Selected ${index + 1}`} />
                  <button className="remove-image-btn" onClick={() => handleRemoveImage(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="image-list-actions">
              <button className="cancel-btn" onClick={() => { setShowImageList(false); setSelectedImages([]); }}>
                Cancel
              </button>
              <button className="send-images-btn" onClick={handleSendImages}>
                Send {selectedImages.length} Image{selectedImages.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="message-input-container">
          <div className="input-actions">
            <button 
              className="input-action-btn"
              onClick={() => imageInputRef.current?.click()}
              title="Send Image"
            >
              <FaImage />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e, 'image')}
            />
            <button 
              className="input-action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Send File"
            >
              <FaFile />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e, 'file')}
            />
            <button
              className={`input-action-btn ${isRecording ? 'recording' : ''}`}
              onMouseDown={handleRecordStart}
              onMouseUp={handleRecordStop}
              onMouseLeave={handleRecordStop}
              onTouchStart={handleRecordStart}
              onTouchEnd={handleRecordStop}
              title="Record Voice (Hold to record)"
            >
              <FaMicrophone />
            </button>
          </div>
          <input
            type="text"
            className="message-input"
            placeholder="type your message here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn" onClick={handleSendMessage}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      {/* Search Bar */}
      <div className="chat-search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="chat-search-input"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Chats List */}
      <div className="chats-list">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => handleChatSelect(chat)}
          >
            <div className="chat-item-avatar">
              {chat.image ? (
                <img src={chat.image} alt={chat.name} />
              ) : (
                <div className="avatar-placeholder">
                  {chat.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="chat-item-info">
              <div className="chat-item-header">
                <h3>{chat.name}</h3>
                <span className="chat-time">{chat.time}</span>
              </div>
              <p className="chat-last-message">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="chat-unread-badge">{chat.unread}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;

