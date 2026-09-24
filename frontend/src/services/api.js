const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fonction générique pour effectuer des requêtes à l'API
 */
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('az_pulse_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Une erreur est survenue.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authService = {
  login: (email, password) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: (userData) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  activate: (email, password) => {
    return fetchApi('/auth/activate', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: () => {
    return fetchApi('/auth/logout', {
      method: 'POST',
    }).finally(() => {
      localStorage.removeItem('az_pulse_token');
    });
  }
};
