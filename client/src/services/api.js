import axios from 'axios';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:3000', // Make sure this matches your backend server port
  headers: {
    'Content-Type': 'application/json'
  }
});

export const inventoryService = {
  getAllStock: async () => {
    const response = await api.get('/api/inventory');
    return response.data;
  },
  
  getStockById: async (id) => {
    const response = await api.get(`/api/inventory/${id}`);
    return response.data;
  },
  
  addStock: async (stockData) => {
    const response = await api.post('/api/inventory', stockData);
    return response.data;
  }
};

