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
  },
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },
  resetStaffPassword: async (id, password) => {
    const response = await api.put(`/auth/users/${id}/password`, { password });
    return response.data;
  }
};

export default authService;
