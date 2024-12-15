import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

export const inventoryService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  },

  addStock: async (stockData) => {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockData),
    });
    if (!response.ok) throw new Error('Failed to add stock');
    return response.json();
  },

  archiveStock: async (id) => {
    const response = await fetch(`${API_URL}/inventory/${id}/archive`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to archive stock');
    return response.json();
  },

  moveToHistory: async (stockId) => {
    const response = await fetch(`${API_URL}/inventory/${stockId}/move-to-history`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to move stock to history');
    return response.json();
  },

  getStockHistory: async () => {
    const response = await fetch(`${API_URL}/inventory/history`);
    if (!response.ok) throw new Error('Failed to fetch stock history');
    return response.json();
  },

  restock: async (stockId, restockData) => {
    const response = await fetch(`${API_URL}/inventory/${stockId}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restockData),
    });
    if (!response.ok) throw new Error('Failed to restock inventory');
    return response.json();
  },

  cleanupEmptyStocks: async () => {
    const response = await fetch(`${API_URL}/inventory/cleanup-empty-stocks`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to cleanup empty stocks');
    return response.json();
  },
};

