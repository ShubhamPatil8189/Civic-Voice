import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export const authAPI = {
    // Login
    login: async (credentials) => {
        try {
            console.log('Attempting login with:', credentials.email);
            const response = await api.post('/auth/login', credentials);
            console.log('Login response:', response.data);
            
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response;
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },
    
    // Register
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },
    
    // Update profile by email
    updateProfile: async (email, userData) => {
        try {
            const response = await api.put(`/users/profile/${email}`, userData);
            return response;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },
    
    // Logout
    logout: () => {
        localStorage.removeItem('user');
    }
};