const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('codesolver_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include'
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred while communicating with the server.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  // Auth
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body }),
    login: (body) => request('/auth/login', { method: 'POST', body }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me', { method: 'GET' }),
  },

  // Topics
  topics: {
    getAll: () => request('/topics', { method: 'GET' }),
    getById: (topicId) => request(`/topics/${topicId}`, { method: 'GET' }),
  },

  // Problems
  problems: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const queryString = query.toString();
      return request(`/problems${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
    },
    getByTopic: (topicId) => request(`/problems/topic/${topicId}`, { method: 'GET' }),
    complete: (problemId) => request(`/problems/${problemId}/complete`, { method: 'POST' }),
    uncomplete: (problemId) => request(`/problems/${problemId}/complete`, { method: 'DELETE' }),
    bookmark: (problemId) => request(`/problems/${problemId}/bookmark`, { method: 'POST' }),
    unbookmark: (problemId) => request(`/problems/${problemId}/bookmark`, { method: 'DELETE' }),
    getBookmarks: () => request('/problems/user/bookmarks', { method: 'GET' }),
  },

  // Progress
  progress: {
    getOverall: () => request('/progress', { method: 'GET' }),
    getByTopic: (topicId) => request(`/progress/${topicId}`, { method: 'GET' }),
  },

  // Admin
  admin: {
    getStats: () => request('/admin/stats', { method: 'GET' }),
    getUsers: () => request('/admin/users', { method: 'GET' }),
    updateUserRole: (userId, role) => request(`/admin/users/${userId}/role`, { method: 'PUT', body: { role } }),
    deleteUser: (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' }),
    createProblem: (body) => request('/admin/problems', { method: 'POST', body }),
    updateProblem: (problemId, body) => request(`/admin/problems/${problemId}`, { method: 'PUT', body }),
    deleteProblem: (problemId) => request(`/admin/problems/${problemId}`, { method: 'DELETE' }),
  }
};

export default api;
