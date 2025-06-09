import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, recipes: 0, totalRequests: 0, approvedRequests: 0, pendingRequests:0 , rejectedRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, recipesRes, requestsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/user/count`),
        axios.get(`${API_BASE_URL}/api/food/count`),
        axios.get(`${API_BASE_URL}/api/recipe-requests/count`)
      ]);

      const newStats = {
        users: usersRes.status === 'fulfilled' ? usersRes.value?.data?.count || 0 : 0,
        recipes: recipesRes.status === 'fulfilled' ? recipesRes.value?.data?.count || 0 : 0,
        totalRequests: requestsRes.status === 'fulfilled' ? requestsRes.value?.data?.total || 0 : 0,
        approvedRequests: requestsRes.status === 'fulfilled' ? requestsRes.value?.data?.approved || 0 : 0,
        pendingRequests: requestsRes.status === 'fulfilled' ? requestsRes.value?.data?.pending || 0 : 0,
        rejectedRequests: requestsRes.status === 'fulfilled' ? requestsRes.value?.data?.rejected || 0 : 0
      };

      setStats(newStats);
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError('Failed to fetch dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard__loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>
      {error && <p className="dashboard__error">{error}</p>}
      <div className="dashboard__stats">
        <div className="stat-item">
          <h2 className="stat-item__title">Total Users</h2>
          <p className="stat-item__count">{stats.users}</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-item__title">Total Recipes</h2>
          <p className="stat-item__count">{stats.recipes}</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-item__title">Total Requests</h2>
          <p className="stat-item__count">{stats.totalRequests}</p>
        </div>
        <div className={`stat-item ${stats.approvedRequests > 0 ? 'approved' : ''}`}>
          <h2 className="stat-item__title">Approved Requests</h2>
          <p className="stat-item__count">{stats.approvedRequests}</p>
        </div>
        <div className={`stat-item ${stats.pendingRequests > 0 ? 'pending' : ''}`}>
          <h2 className="stat-item__title">Pending Requests</h2>
          <p className="stat-item__count">{stats.pendingRequests}</p>
        </div>
        <div className={`stat-item ${stats.rejectedRequests > 0 ? 'rejected' : ''}`}>
          <h2 className="stat-item__title">Rejected Requests</h2>
          <p className="stat-item__count">{stats.rejectedRequests}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
