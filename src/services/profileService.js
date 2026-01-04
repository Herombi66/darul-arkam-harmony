import axios from 'axios';

const API_URL = '/api/profile';

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update user profile
const updateProfile = async (profileData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL, profileData, config);
  return response.data;
};

// Change password
const changePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/password`, passwordData, config);
  return response.data;
};

// Update user avatar
const updateAvatar = async (avatarData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/avatar`, avatarData, config);
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
};

export default profileService;