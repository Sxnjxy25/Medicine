import api from './api';

const purchaseService = {
  getAll: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },

  create: async (purchase) => {
    const response = await api.post('/purchases', purchase);
    return response.data;
  },

  update: async (id, purchase) => {
    const response = await api.put(`/purchases/${id}`, purchase);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  }
};

export default purchaseService;
