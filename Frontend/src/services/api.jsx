
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
    },
    (error) => {
        console.error(`❌ API Error:`, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const authAPI = {
    // Login
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
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

    // Get user profile by email
    getProfile: async (email) => {
        try {
            const response = await api.get(`/users/profile/${email}`);
            return response;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    // Get current logged-in user from localStorage
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('No user found in storage');
            }
            const user = JSON.parse(userStr);
            return {
                data: {
                    success: true,
                    user: user
                }
            };
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    // Update profile by email
    updateProfile: async (email, userData) => {
        try {
            console.log('Sending update for email:', email);
            console.log('Update data:', userData);

            const response = await api.put(`/users/profile/${email}`, userData);
            console.log('Update response:', response.data);
            return response;
        } catch (error) {
            console.error('Update profile error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user');
    }
};