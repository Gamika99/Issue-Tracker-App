import axios from 'axios';
import { Issue, IssuesResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const issueService = {
  getIssues: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<IssuesResponse> => {
    const response = await api.get('/issues', { params });
    return response.data;
  },

  getIssue: async (id: string): Promise<Issue> => {
    const response = await api.get(`/issues/${id}`);
    return response.data.data;
  },

  createIssue: async (issueData: Partial<Issue>): Promise<Issue> => {
    const response = await api.post('/issues', issueData);
    return response.data.data;
  },

  updateIssue: async (id: string, issueData: Partial<Issue>): Promise<Issue> => {
    const response = await api.put(`/issues/${id}`, issueData);
    return response.data.data;
  },

  deleteIssue: async (id: string): Promise<void> => {
    await api.delete(`/issues/${id}`);
  },
};

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;