import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://yummiz.up.railway.app';

export const sendOTP = async (mobile) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/send-otp`, { mobile });
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to send OTP');
        }
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error('Too many attempts. Please try again later.');
        }
        throw new Error(error.response?.data?.message || error.message || 'Failed to send OTP');
    }
};

export const verifyOTP = async (mobile, otp) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/verify-otp`, { mobile, otp });
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to verify OTP');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to verify OTP');
    }
};
