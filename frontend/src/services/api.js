import { API_BASE_URL, TOKEN_KEY } from './config';

/**
 * Fonction générique pour effectuer des requêtes à l'API
 */
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipToken) {
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
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    const message = data.error || data.message || data.details || `Erreur ${response.status}: Une erreur est survenue.`;
    const error = new Error(message);
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
      skipToken: true,
    });
  },

  register: (userData) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipToken: true,
    });
  },

  activate: (email, password) => {
    return fetchApi('/auth/activate', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipToken: true,
    });
  },

  checkStatus: (uuid) => {
    return fetchApi('/auth/status', {
      method: 'POST',
      body: JSON.stringify({ uuid }),
      skipToken: true,
    });
  },

  logout: () => {
    return fetchApi('/auth/logout', {
      method: 'POST',
    }).finally(() => {
      localStorage.removeItem(TOKEN_KEY);
    });
  },

  forgotPassword: (email) => {
    return fetchApi('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipToken: true,
    });
  },

  resetPassword: (token, password) => {
    return fetchApi('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      skipToken: true,
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

/**
 * File de notifications.
 *
 * Le serveur n'expose que de la lecture et du « marquer comme lu » : il n'y a
 * volontairement aucune méthode de création ni de suppression. Une notification
 * est un effet de bord d'un fait métier, pas un message que l'on composerait
 * depuis l'interface.
 */
export const notificationService = {
  /**
   * `unread` filtre sur les non lues ; sans lui, on récupère tout l'historique.
   */
  list: ({ page = 1, limit = 20, unread = false } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (unread) params.set('unread', '1');

    return fetchApi(`/notifications?${params.toString()}`);
  },

  /**
   * Compteur de la cloche.
   *
   * Appelé sur toutes les pages, d'où une route dédiée qui renvoie un simple
   * nombre : charger la file entière à chaque navigation serait du gaspillage.
   */
  getUnreadCount: () => fetchApi('/notifications/unread-count'),

  markAsRead: (id) => fetchApi(`/notifications/${id}/read`, { method: 'POST' }),

  markAllAsRead: () => fetchApi('/notifications/read-all', { method: 'POST' }),
};

/**
 * Journal d'audit — consultation seule.
 *
 * L'API ne propose ni création, ni modification, ni suppression : une trace
 * s'écrit depuis le code qui a commis l'action. Exposer une écriture ici
 * reviendrait à laisser un administrateur fabriquer une trace contre un collègue.
 */
export const auditService = {
  list: ({ page = 1, limit = 50, category, severity, action, actor, since } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.set('category', category);
    if (severity) params.set('severity', severity);
    if (action) params.set('action', action);
    if (actor) params.set('actor', actor);
    if (since) params.set('since', since);

    return fetchApi(`/audit?${params.toString()}`);
  },

  /** Valeurs closes des filtres, fournies par le serveur. */
  getFilters: () => fetchApi('/audit/filters'),
};

/**
 * Knowledge Hub — gestion documentaire
 */
export const knowledgeService = {
  listDocuments: ({ q, project_id } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (project_id) params.set('project_id', project_id);
    
    const qs = params.toString();
    return fetchApi(`/knowledge/documents${qs ? `?${qs}` : ''}`);
  },

  uploadDocument: (file, payload = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    if (payload.title) formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.type) formData.append('type', payload.type);
    if (payload.category_id) formData.append('category_id', payload.category_id);
    if (payload.project_id) formData.append('project_id', payload.project_id);
    if (payload.tag_ids) formData.append('tag_ids', JSON.stringify(payload.tag_ids));

    return fetchApi('/knowledge/documents', {
      method: 'POST',
      body: formData,
    });
  },

  publishDocument: (id) => {
    return fetchApi(`/knowledge/documents/${id}/publish`, { method: 'POST' });
  },

  downloadUrl: (id) => {
    return `${API_BASE_URL}/knowledge/documents/${id}/download`;
  }
};

export const roleService = {
  list: () => fetchApi('/roles'),
  updatePermissions: (id, permissions) => fetchApi(`/roles/${id}/permissions`, { method: 'POST', body: JSON.stringify({ permissions }) }),
};

/**
 * Workspace — projets et tâches
 */
export const workspaceService = {
  listProjects: () => fetchApi('/workspace/projects'),
  getProject: (id) => fetchApi(`/workspace/projects/${id}`),
  createProject: (payload) => fetchApi('/workspace/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => fetchApi(`/workspace/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  
  listTasks: (projectId) => fetchApi(`/workspace/projects/${projectId}/tasks`),
  createTask: (projectId, payload) => fetchApi(`/workspace/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (taskId, payload) => fetchApi(`/workspace/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};

/**
 * Analytics — indicateurs et KPIs
 */
export const analyticsService = {
  getKpis: () => fetchApi('/analytics/kpis'),
};

/**
 * Service IA — analyse contextuelle de projets via proxy Symfony
 */
export const aiService = {
  analyzeProject: (projectId, question = 'Analyse générale du projet et de ses risques.') => {
    return fetchApi(`/projects/${projectId}/ai-analysis`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  },

  chat: (message, conversationId = null, context = {}) => {
    return fetchApi('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversation_id: conversationId, context }),
    });
  },

  getInsights: (metrics = {}, scope = 'CRM & Performance') => {
    return fetchApi('/ai/insights', {
      method: 'POST',
      body: JSON.stringify({ metrics, scope }),
    });
  },

  getRecommendations: (context = {}, scope = 'Opérations & CRM') => {
    return fetchApi('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ ...context, scope }),
    });
  },
};


