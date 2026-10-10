import { API_BASE_URL, TOKEN_KEY } from './config';

/**
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
  listCourses: () => fetchApi('/academy/courses'),
  listSchedule: () => fetchApi('/academy/schedule'),
  listAssignments: () => fetchApi('/academy/assignments'),
  listSubmissions: () => fetchApi('/academy/submissions'),
  listCourseDocuments: () => fetchApi('/academy/documents'),
  createAssignment: (data) => fetchApi('/academy/assignments', { method: 'POST', body: JSON.stringify(data) }),
  uploadCourseDocument: (file, courseId) => { const body = new FormData(); body.append('file', file); body.append('courseId', courseId); return fetchApi('/academy/documents', { method: 'POST', body }); },
  submitAssignment: (assignmentId, file) => { const body = new FormData(); body.append('file', file); return fetchApi(`/academy/assignments/${assignmentId}/submissions`, { method: 'POST', body }); },
  publishMeetingLink: (sessionId, url) => fetchApi(`/academy/schedule/${sessionId}/meeting`, { method: 'PATCH', body: JSON.stringify({ url }) }),
  downloadSubmission: async (id) => { const token = localStorage.getItem(TOKEN_KEY); const response = await fetch(`${API_BASE_URL}/academy/submissions/${id}/download`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (!response.ok) throw new Error('Téléchargement impossible'); return response.blob(); },
  listGrades: () => fetchApi('/academy/grades'),
  listPayments: () => fetchApi('/academy/payments'),
  downloadPayment: async (id) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_BASE_URL}/academy/payments/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || body.error || `Erreur ${response.status}`);
    }
    return response.blob();
  },
  depositPayment: (file, payload = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(payload).forEach(([key, value]) => value !== undefined && value !== null && formData.append(key, value));
    return fetchApi('/academy/payments', { method: 'POST', body: formData });
  },
  validatePayment: (id) => fetchApi(`/academy/payments/${id}/validate`, { method: 'POST' }),
  rejectPayment: (id) => fetchApi(`/academy/payments/${id}/reject`, { method: 'POST' }),
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
 *
 * l'appel (403) si la permission manque.
 */
export const crmService = {
  getPipeline: ({ scope = 'mine', includeClosed = false } = {}) => {
    const params = new URLSearchParams({ scope });
    if (includeClosed) params.set('includeClosed', '1');

    return fetchApi(`/crm/pipeline?${params.toString()}`);
  },

  getStats: () => fetchApi('/crm/stats'),

  getCustomer: (id) => fetchApi(`/customers/${id}`),
  listCustomerActivities: (id) => fetchApi(`/customers/${id}/activities`),
  createActivity: (payload) => fetchApi('/activities', { method: 'POST', body: JSON.stringify(payload) }),
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
   */
  changeStage: (id, stage, transition = {}) => {
    return fetchApi(`/opportunities/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, transition }),
    });
  },

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
 * depuis l'interface.
 */
export const notificationService = {
  /**
   */
  list: ({ page = 1, limit = 20, unread = false } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (unread) params.set('unread', '1');

    return fetchApi(`/notifications?${params.toString()}`);
  },

  /**
   * Compteur de la cloche.
   *
   */
  getUnreadCount: () => fetchApi('/notifications/unread-count'),

  markAsRead: (id) => fetchApi(`/notifications/${id}/read`, { method: 'POST' }),

  markAllAsRead: () => fetchApi('/notifications/read-all', { method: 'POST' }),
};

/**
 *
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
 */
export const workspaceService = {
  listProjects: () => fetchApi('/workspace/projects'),
  listTeamMembers: () => fetchApi('/workspace/projects/team'),
  addProjectMember: (projectId, userId) => fetchApi(`/workspace/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify({ user_id: userId }) }),
  getProject: (id) => fetchApi(`/workspace/projects/${id}`),
  createProject: (payload) => fetchApi('/workspace/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => fetchApi(`/workspace/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  
  listTasks: (projectId) => fetchApi(`/workspace/projects/${projectId}/tasks`),
  createTask: (projectId, payload) => fetchApi(`/workspace/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (taskId, payload) => fetchApi(`/workspace/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};

/**
 */
export const incidentService = {
  list: () => fetchApi('/it/incidents'),
  create: (payload) => fetchApi('/it/incidents', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => fetchApi(`/it/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};

export const analyticsService = {
  getKpis: () => fetchApi('/analytics/kpis'),
};

export const itService = {
  getComputers: () => fetchApi('/it/inventory/computers'),
  getComputerDetails: (id) => fetchApi(`/it/inventory/computers/${id}/details`),
};

/**
 */
export const aiService = {
  analyzeProject: (projectId, question = 'General project and risk analysis.') => {
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

  getRecommendations: (context = {}, scope = 'Operations & CRM') => {
    return fetchApi('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ ...context, scope }),
    });
  },
};
