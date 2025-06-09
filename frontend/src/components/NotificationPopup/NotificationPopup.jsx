import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './NotificationPopup.css';

const NotificationPopup = ({ notifications, onClose, onMarkAsRead, onDelete }) => {
  const { darkMode } = useContext(ThemeContext);

  const formatMessage = (message) => {
    try {
      // Check if message is defined
      if (!message) return null;

      // Split message into parts
      const parts = message.split('\n');
      
      // Only proceed if we have at least 2 parts
      if (parts.length < 2) {
        return (
          <div className="notification-body">
            {message}
          </div>
        );
      }

      const statusPart = parts[1] || '';
      const isApproved = statusPart.toLowerCase().includes('approved');
      const isRejected = statusPart.toLowerCase().includes('rejected');
      const statusClass = isApproved ? 'approved' : isRejected ? 'rejected' : '';

      return (
        <>
          <div className="notification-header-text">{parts[0]}</div>
          <div className={`notification-status ${statusClass}`}>
            {parts[1]}
          </div>
          <div className="notification-body">
            {parts.slice(2).join('\n')}
          </div>
        </>
      );
    } catch (error) {
      console.error('Error formatting notification:', error);
      return (
        <div className="notification-body">
          {message || 'Error displaying notification'}
        </div>
      );
    }
  };

  return (
    <div className={`notification-popup ${darkMode ? 'dark-mode' : ''}`}>
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="notification-list">
        {notifications?.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content" onClick={() => onMarkAsRead(notification._id)}>
                {formatMessage(notification.message)}
              </div>
              <div className="notification-actions">
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(notification._id)}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;