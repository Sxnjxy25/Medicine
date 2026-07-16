import api from './api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // { username, role, token }
  },
  registerStaff: async (username, password) => {
    const response = await api.post('/auth/register-staff', { username, password });
    return response.data;
  },
  changePassword: async (username, currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', { username, currentPassword, newPassword });
    return response.data;
  }
};

export default authService;
