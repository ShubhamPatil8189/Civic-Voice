import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const { verifyOTP, tempEmail } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!tempEmail) {
      navigate('/login');
    }
  }, [tempEmail, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyOTP(otp);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Verify OTP</h2>
      <p>Email: {tempEmail}</p>
      <p>OTP expires in: {formatTime(countdown)}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Enter 6-digit OTP *</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            style={{ width: '100%', padding: '8px' }}
            placeholder="123456"
          />
        </div>
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          style={{ padding: '10px 20px', width: '100%' }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;