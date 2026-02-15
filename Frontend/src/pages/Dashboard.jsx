import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.firstName}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout} style={{ padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;