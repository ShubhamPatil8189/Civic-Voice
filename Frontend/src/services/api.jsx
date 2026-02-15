import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
    baseURL: 'http://localhost:5000/api',  // Your backend URL
    withCredentials: true,  // VERY IMPORTANT! This sends cookies with every request
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Log all requests (optional, for debugging)
API.interceptors.request.use(
    (config) => {
        console.log(`📤 Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
API.interceptors.response.use(
    (response) => {
        console.log(`📥 Response from ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('❌ Response error:', error.response.status, error.response.data);
            
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    console.log('🔒 Unauthorized - Redirecting to login');
                    // You can add redirect logic here if needed
                    break;
                case 404:
                    console.log('🔍 Resource not found');
                    break;
                case 500:
                    console.log('💥 Server error');
                    break;
                default:
                    console.log('⚠️ Other error:', error.response.status);
            }
        } else if (error.request) {
            // Request was made but no response
            console.error('📡 No response from server. Is backend running?');
        } else {
            // Something else happened
            console.error('❌ Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Authentication API endpoints
export const authAPI = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - Axios response promise
     */
    register: (userData) => API.post('/auth/register', userData),
    
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Axios response promise
     */
    login: (email, password) => API.post('/auth/login', { email, password }),
    
    /**
     * Get current logged in user profile
     * @returns {Promise} - Axios response promise with user data
     */
    getCurrentUser: () => API.get('/auth/me'),
    
    /**
     * Update user profile
     * @param {Object} data - Profile data to update
     * @returns {Promise} - Axios response promise
     */
    updateProfile: (data) => API.put('/auth/profile', data),
    
    /**
     * Check if user is authenticated
     * @returns {Promise} - Axios response promise with auth status
     */
    checkAuth: () => API.get('/auth/check'),
    
    /**
     * Logout user
     * @returns {Promise} - Axios response promise
     */
    logout: () => API.post('/auth/logout')
};

// Optional: User API endpoints (for other user operations)
export const userAPI = {
    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise} - Axios response promise
     */
    getUserById: (userId) => API.get(`/users/${userId}`),
    
    /**
     * Get all users (admin only)
     * @returns {Promise} - Axios response promise
     */
    getAllUsers: () => API.get('/users'),
    
    /**
     * Delete user (admin only)
     * @param {string} userId - User ID to delete
     * @returns {Promise} - Axios response promise
     */
    deleteUser: (userId) => API.delete(`/users/${userId}`)
};

// Export both APIs
export default API;