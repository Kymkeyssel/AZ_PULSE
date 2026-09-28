const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fonction générique pour effectuer des requêtes à l'API
 */
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('az_pulse_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Si on envoie un FormData (upload de fichier), on laisse le navigateur gérer le Content-Type
  // (il va ajouter le boundary multipart/form-data automatiquement)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
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

  checkStatus: (uuid) => {
    return fetchApi('/auth/status', {
      method: 'POST',
      body: JSON.stringify({ uuid }),
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

export const academyService = {
  getApprenantDashboard: () => {
    return fetchApi('/dashboard/apprenant', {
      method: 'GET'
    });
  },
  
  uploadDocument: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return fetchApi('/dashboard/apprenant/upload', {
      method: 'POST',
      body: formData,
    });
  }
};

/**
 * CRM — prospects, opportunités et relances.
 *
 * Rappel : l'interface n'est pas la sécurité. Elle masque ce que
 * l'administrateur n'a pas accordé, mais c'est Symfony qui refuse réellement
 * l'appel (403) si la permission manque.
 */
export const crmService = {
  // ── Pipeline ──────────────────────────────────────────────────────────
  getPipeline: ({ scope = 'mine', includeClosed = false } = {}) => {
    const params = new URLSearchParams({ scope });
    if (includeClosed) params.set('includeClosed', '1');

    return fetchApi(`/crm/pipeline?${params.toString()}`);
  },

  getStats: () => fetchApi('/crm/stats'),

  // ── Clients ───────────────────────────────────────────────────────────
  searchCustomers: (q, limit = 20) => {
    return fetchApi(`/customers/search?q=${encodeURIComponent(q)}&limit=${limit}`);
  },

  listCustomers: ({ status, owner } = {}) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (owner) params.set('owner', owner);

    const qs = params.toString();
    return fetchApi(`/customers${qs ? `?${qs}` : ''}`);
  },

  createCustomer: (payload) => {
    return fetchApi('/customers', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateCustomer: (id, payload) => {
    return fetchApi(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },

  // ── Opportunités ──────────────────────────────────────────────────────
  listOpportunities: ({ stage, customer, owner } = {}) => {
    const params = new URLSearchParams();
    if (stage) params.set('stage', stage);
    if (customer) params.set('customer', customer);
    if (owner) params.set('owner', owner);

    const qs = params.toString();
    return fetchApi(`/opportunities${qs ? `?${qs}` : ''}`);
  },

  createOpportunity: (payload) => {
    return fetchApi('/opportunities', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateOpportunity: (id, payload) => {
    return fetchApi(`/opportunities/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },

  /**
   * Déplace une affaire d'étape. Le serveur applique les règles métier
   * (gagné → client, probabilité à 100, création du projet).
   */
  changeStage: (id, stage) => {
    return fetchApi(`/opportunities/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
  },

  // ── Relances ──────────────────────────────────────────────────────────
  listReminders: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value);
      }
    });

    const qs = params.toString();
    return fetchApi(`/reminders${qs ? `?${qs}` : ''}`);
  },

  getReminderSummary: () => fetchApi('/reminders/summary'),

  createReminder: (payload) => {
    return fetchApi('/reminders', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateReminder: (id, payload) => {
    return fetchApi(`/reminders/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },

  completeReminder: (id) => {
    return fetchApi(`/reminders/${id}/complete`, { method: 'POST' });
  },

  reopenReminder: (id) => {
    return fetchApi(`/reminders/${id}/reopen`, { method: 'POST' });
  },

  deleteReminder: (id) => {
    return fetchApi(`/reminders/${id}`, { method: 'DELETE' });
  },
};
