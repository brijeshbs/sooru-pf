import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/users/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// Projects/Playgrounds Services
export const playgroundService = {
  getAllPlaygrounds: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getPlayground: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createPlayground: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  updatePlayground: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deletePlayground: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

// Floor Plan Services
export const floorPlanService = {
  generatePlan: async (projectId, requirements) => {
    const response = await api.post(`/projects/${projectId}/generate`, requirements);
    return response.data;
  },

  // Room operations
  updateRoom: async (projectId, planId, roomId, roomData) => {
    const response = await api.put(
      `/projects/${projectId}/plans/${planId}/rooms/${roomId}`,
      roomData
    );
    return response.data;
  },

  addRoom: async (projectId, planId, roomData) => {
    const response = await api.post(
      `/projects/${projectId}/plans/${planId}/rooms`,
      roomData
    );
    return response.data;
  },

  deleteRoom: async (projectId, planId, roomId) => {
    const response = await api.delete(
      `/projects/${projectId}/plans/${planId}/rooms/${roomId}`
    );
    return response.data;
  },

  // Measurements
  getMeasurements: async (projectId, planId) => {
    const response = await api.get(
      `/projects/${projectId}/plans/${planId}/measurements`
    );
    return response.data;
  },

  // Save entire floor plan
  savePlan: async (projectId, planId, planData) => {
    const response = await api.put(
      `/projects/${projectId}/plans/${planId}`,
      planData
    );
    return response.data;
  },

  // Get floor plan history (for undo/redo)
  getPlanHistory: async (projectId, planId) => {
    const response = await api.get(
      `/projects/${projectId}/plans/${planId}/history`
    );
    return response.data;
  },

  // Validate room placement
  validateRoomPlacement: async (projectId, planId, roomData) => {
    const response = await api.post(
      `/projects/${projectId}/plans/${planId}/validate-room`,
      roomData
    );
    return response.data;
  }
};

export default api;