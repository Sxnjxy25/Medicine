import api from './api';

const salesService = {
  getAll: async () => {
    const response = await api.get('/sales');
    return response.data;
  },

  create: async (sale) => {
    const response = await api.post('/sales', sale);
    return response.data;
  }
};

export default salesService;
