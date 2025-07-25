import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './RequestRecipe.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const RequestRecipe = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customMessages, setCustomMessages] = useState({});

  useEffect(() => {
    fetchRequests();
    // Set up polling interval
    const intervalId = setInterval(fetchRequests, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/recipe-requests`);
      setRequests(response.data.requests || []);
    } catch (error) {
      setError('Failed to load requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const validStatus = status === 'approve' ? 'approved' : 'rejected';
      const message = customMessages[id] || `Your recipe has been ${validStatus}.`;

      const response = await axios.post(`${API_BASE_URL}/api/recipe-requests/${validStatus}`, {
        requestId: id,
        message,
      });

      if (response.data.success) {
        toast.success(`Recipe request ${validStatus} successfully`);
        fetchRequests(); // Refresh the request list
        setCustomMessages((prev) => ({ ...prev, [id]: '' })); // Reset message input
      } else {
        toast.error(response.data.message || `Failed to ${validStatus} request`);
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleMessageChange = (id, value) => {
    setCustomMessages((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="request-container">
      <h2>Recipe Requests</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="request-grid">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="request-card">
              <h3>{request.recipeName}</h3>
              <p className="requested-by">Requested by: {request.requestedBy}</p>
              <p className="description">{request.description}</p>
              <p className="timestamp">Requested at: {formatDate(request.createdAt)}</p>
              {request.adminMessage && (
                <div className="admin-message-wrapper">
                  {request.adminMessage.split('\n').map((line, i) => (
                    <p key={i} className="admin-message-line">{line}</p>
                  ))}
                </div>
              )}
              {request.status === 'approved' ? (
                <p className="status-label approved">Approved</p>
              ) : request.status === 'rejected' ? (
                <p className="status-label rejected">Rejected</p>
              ) : (
                <div className="button-group">
                  <input
                    type="text"
                    placeholder="Enter custom message"
                    value={customMessages[request._id] || ''}
                    onChange={(e) => handleMessageChange(request._id, e.target.value)}
                  />
                  <button
                    className="approve-btn"
                    onClick={() => handleStatusUpdate(request._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusUpdate(request._id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No recipe requests found</p>
        )}
      </div>
    </div>
  );
};

export default RequestRecipe;
