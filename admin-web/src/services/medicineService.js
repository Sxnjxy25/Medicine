import api from './api';

const medicineService = {
  getAll: async () => {
    const response = await api.get('/medicines');
    // Only return active medicines (filter out soft-deleted/inactive ones)
    return response.data.filter(m => m.active !== false);
  },

  getAllMedicines: async () => {
    return medicineService.getAll();
  },

  getLowStockMedicines: async () => {
    const medicines = await medicineService.getAll();
    // Return active medicines where quantity (stock) is less than minimumStock or fallback of 50
    return medicines.filter((m) => m.quantity < (m.minimumStock || 50));
  },

  getById: async (id) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },

  create: async (medicine) => {
    const response = await api.post('/medicines', medicine);
    return response.data;
  },

  update: async (id, medicine) => {
    const response = await api.put(`/medicines/${id}`, medicine);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/medicines/${id}`);
    return response.data;
  },
};

export default medicineService;
