// import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add JWT token
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         // Redirect to login if not already there
//         if (window.location.pathname !== '/login') {
//           window.location.href = '/login';
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // API methods
// export const authAPI = {
//   login: (email: string, password: string) =>
//     api.post('/auth/login', { email, password }),
//   register: (data: any) => api.post('/auth/register', data),
//   getMe: () => api.get('/auth/me'),
//   logout: () => api.post('/auth/logout'),
//   forgotPassword: (email: string) =>
//     api.post('/auth/forgot-password', { email }),
//   resetPassword: (token: string, newPassword: string) =>
//     api.post('/auth/reset-password', { token, newPassword }),
// };

// export const therapistAPI = {
//   getAll: (params?: any) => api.get('/therapists', { params }),
//   getById: (id: string) => api.get(`/therapists/${id}`),
//   getMyProfile: () => api.get('/therapists/me'),
//   createOrUpdate: (data: any) => api.post('/therapists', data),
//   updateAvailability: (id: string, availability: any) =>
//     api.put(`/therapists/${id}/availability`, { availability }),
//   getStats: (id: string) => api.get(`/therapists/${id}/stats`),
// };

// export const clientAPI = {
//   getAll: () => api.get('/clients'),
//   getById: (id: string) => api.get(`/clients/${id}`),
//   getMyProfile: () => api.get('/clients/me'),
//   createOrUpdate: (data: any) => api.post('/clients', data),
//   uploadDocument: (id: string, data: any) =>
//     api.post(`/clients/${id}/documents`, data),
//   uploadDocumentFile: (id: string, formData: FormData) =>
//     api.post(`/clients/${id}/documents`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }),
//   getDocuments: (id: string) => api.get(`/clients/${id}/documents`),
//   searchDocuments: (id: string, params?: any) =>
//     api.get(`/clients/${id}/documents/search`, { params }),
//   deleteDocument: (id: string, docId: string) =>
//     api.delete(`/clients/${id}/documents/${docId}`),
//   getTherapyTimeline: (id: string) => api.get(`/clients/${id}/timeline`),
// };

// export const sessionAPI = {
//   getAll: (params?: any) => api.get('/sessions', { params }),
//   getUpcoming: () => api.get('/sessions/upcoming'),
//   getById: (id: string) => api.get(`/sessions/${id}`),
//   create: (data: any) => api.post('/sessions', data),
//   update: (id: string, data: any) => api.put(`/sessions/${id}`, data),
//   cancel: (id: string, data: { reason?: string; loggedByTherapist?: boolean }) =>
//     api.delete(`/sessions/${id}`, { data }),
//   start: (id: string) => api.post(`/sessions/${id}/start`),
//   complete: (id: string, notes?: string) =>
//     api.post(`/sessions/${id}/complete`, { notes }),
//   saveSoapNote: (id: string, soapNote: any) =>
//     api.post(`/sessions/${id}/soap-note`, soapNote),
//   saveTranscript: (id: string, data: { text: string; originalLanguage: string; translatedText?: any }) =>
//     api.post(`/sessions/${id}/transcript`, data),
//   getTranscriptTranslation: (id: string, language: string) =>
//     api.get(`/sessions/${id}/transcript/${language}`),
// };

// export const subscriptionAPI = {
//   getPricing: () => api.get('/subscriptions/pricing'),
//   subscribe: (tier: string) => api.post('/subscriptions/subscribe', { tier }),
//   getCurrent: () => api.get('/subscriptions/current'),
//   getRemainingSessions: () => api.get('/subscriptions/remaining-sessions'),
//   cancel: (reason?: string) =>
//     api.delete('/subscriptions/cancel', { data: { reason } }),
//   getHistory: () => api.get('/subscriptions/history'),
// };

// export const stripeAPI = {
//   getConfig: () => api.get('/stripe/config'),
//   createCheckoutSession: (tier: string) => api.post('/stripe/create-checkout-session', { tier }),
//   createPaymentIntent: (sessionId: string) => api.post('/stripe/create-payment-intent', { sessionId }),
//   createCancellationPayment: (sessionId: string) => api.post('/stripe/create-cancellation-payment', { sessionId }),
//   confirmPayment: (paymentIntentId: string) => api.post('/stripe/confirm-payment', { paymentIntentId }),
//   processSessionPayment: (sessionId: string) => api.post('/stripe/process-session-payment', { sessionId }),
//   verifyCheckoutSession: (sessionId: string) => api.post('/stripe/verify-checkout', { sessionId }),
//   refundPayment: (paymentId: string, amount?: number, reason?: string) => 
//     api.post('/stripe/refund', { paymentId, amount, reason }),
// };

// export const assignmentAPI = {
//   getAll: (params?: any) => api.get('/assignments', { params }),
//   getById: (id: string) => api.get(`/assignments/${id}`),
//   create: (data: any) => api.post('/assignments', data),
//   update: (id: string, data: any) => api.put(`/assignments/${id}`, data),
//   markComplete: (id: string) => api.put(`/assignments/${id}`, { completed: true }),
//   addFeedback: (id: string, data: { feedback: string; rating?: number }) =>
//     api.post(`/assignments/${id}/feedback`, data),
//   delete: (id: string) => api.delete(`/assignments/${id}`),
// };

// export const forumAPI = {
//   getPosts: (params?: any) => api.get('/forum/posts', { params }),
//   getPost: (id: string) => api.get(`/forum/posts/${id}`),
//   createPost: (data: any) => api.post('/forum/posts', data),
//   updatePost: (id: string, data: any) => api.put(`/forum/posts/${id}`, data),
//   deletePost: (id: string) => api.delete(`/forum/posts/${id}`),
//   likePost: (id: string) => api.post(`/forum/posts/${id}/like`),
//   pinPost: (id: string) => api.post(`/forum/posts/${id}/pin`),
//   createReply: (postId: string, data: any) => api.post(`/forum/posts/${postId}/replies`, data),
//   updateReply: (id: string, data: any) => api.put(`/forum/replies/${id}`, data),
//   deleteReply: (id: string) => api.delete(`/forum/replies/${id}`),
//   likeReply: (id: string) => api.post(`/forum/replies/${id}/like`),
// };

// export const messageAPI = {
//   getSupportAgent: () => api.get('/messages/support-agent'),
//   getConversations: () => api.get('/messages/conversations'),
//   getMessages: (userId: string) => api.get(`/messages/${userId}`),
//   sendMessage: (receiverId: string, content: string, type?: string, attachments?: any[]) =>
//     api.post('/messages', { receiverId, content, type, attachments }),
//   sendMessageWithFiles: (formData: FormData) =>
//     api.post('/messages', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }),
//   markAsRead: (messageIds?: string[], senderId?: string) =>
//     api.put('/messages/read', { messageIds, senderId }),
//   deleteMessage: (id: string) => api.delete(`/messages/${id}`),
// };

// export const resourceAPI = {
//   getAll: (params?: any) => api.get('/resources', { params }),
//   aiSearch: (query: string, params?: any) => 
//     api.get('/resources/ai-search', { params: { query, ...params } }),
//   getById: (id: string) => api.get(`/resources/${id}`),
//   create: (data: any) => api.post('/resources', data),
//   update: (id: string, data: any) => api.put(`/resources/${id}`, data),
//   delete: (id: string) => api.delete(`/resources/${id}`),
// };

// export const translationAPI = {
//   getLanguages: () => api.get('/translation/languages'),
//   translateText: (text: string, sourceLanguage: string, targetLanguage: string) =>
//     api.post('/translation/translate', { text, sourceLanguage, targetLanguage }),
//   detectLanguage: (text: string) => api.post('/translation/detect', { text }),
//   getPreferences: () => api.get('/translation/preferences'),
//   updatePreferences: (data: any) => api.put('/translation/preferences', data),
//   getBilingualTherapists: (language: string) =>
//     api.get('/translation/bilingual-therapists', { params: { language } }),
//   realtime: (text: string, sourceLanguage: string, targetLanguage: string) =>
//     api.post('/translation/realtime', { text, sourceLanguage, targetLanguage }),
//   interpret: (text: string, sourceLanguage: string, targetLanguage: string, context?: string) =>
//     api.post('/translation/interpret', { text, sourceLanguage, targetLanguage, context }),
//   translateTranscript: (transcript: string, originalLanguage: string, targetLanguage: string) =>
//     api.post('/translation/transcript', { transcript, originalLanguage, targetLanguage }),
// };

// export const calendarAPI = {
//   // Internal calendar (built-in)
//   getEvents: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
//     api.get('/calendar/events', { params }),
//   getEvent: (eventId: string) => api.get(`/calendar/events/${eventId}`),
  
//   // Calendar integration status
//   getStatus: () => api.get('/calendar/status'),
  
//   // External calendar sync (optional)
//   connectGoogle: (data: { accessToken: string; refreshToken?: string; calendarId?: string }) =>
//     api.post('/calendar/connect/google', data),
//   connectOutlook: (data: { accessToken: string; refreshToken?: string; calendarId?: string }) =>
//     api.post('/calendar/connect/outlook', data),
//   disconnect: () => api.post('/calendar/disconnect'),
  
//   // Calendar event URLs for manual add
//   getEventUrl: (sessionId: string, provider?: string) =>
//     api.get(`/calendar/event-url/${sessionId}`, { params: { provider } }),
//   syncSession: (sessionId: string) => api.post(`/calendar/sync-session/${sessionId}`),
// };

// export const pushAPI = {
//   getVapidPublicKey: () => api.get('/push/vapid-public-key'),
//   subscribe: (subscription: any) => api.post('/push/subscribe', subscription),
//   unsubscribe: () => api.post('/push/unsubscribe'),
// };

// export const familyCoachingAPI = {
//   getSessions: (params?: any) => api.get('/family-coaching', { params }),
//   getSession: (id: string) => api.get(`/family-coaching/${id}`),
//   createSession: (data: any) => api.post('/family-coaching', data),
//   updateSession: (id: string, data: any) => api.put(`/family-coaching/${id}`, data),
//   cancelSession: (id: string, cancellationReason?: string) =>
//     api.delete(`/family-coaching/${id}`, { data: { cancellationReason } }),
// };

// export const healthCheck = () => api.get('/health');

// export default api;


import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ===================== REQUEST INTERCEPTOR ===================== */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/* ===================== AUTH API ===================== */
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

/* ===================== THERAPIST API ===================== */
export const therapistAPI = {
  getAll: (params?: any) => api.get('/therapists', { params }),
  getById: (id: string) => api.get(`/therapists/${id}`),
  getMyProfile: () => api.get('/therapists/me'),
  createOrUpdate: (data: any) => api.post('/therapists', data),
  updateAvailability: (id: string, availability: any) =>
    api.put(`/therapists/${id}/availability`, { availability }),
  getStats: (id: string) => api.get(`/therapists/${id}/stats`),
};

/* ===================== CLIENT API ===================== */
export const clientAPI = {
  getAll: () => api.get('/clients'),
  getById: (id: string) => api.get(`/clients/${id}`),
  getMyProfile: () => api.get('/clients/me'),
  createOrUpdate: (data: any) => api.post('/clients', data),
  uploadDocument: (id: string, data: any) =>
    api.post(`/clients/${id}/documents`, data),
  uploadDocumentFile: (id: string, formData: FormData) =>
    api.post(`/clients/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDocuments: (id: string) =>
    api.get(`/clients/${id}/documents`),
  searchDocuments: (id: string, params?: any) =>
    api.get(`/clients/${id}/documents/search`, { params }),
  deleteDocument: (id: string, docId: string) =>
    api.delete(`/clients/${id}/documents/${docId}`),
  getTherapyTimeline: (id: string) =>
    api.get(`/clients/${id}/timeline`),
};

/* ===================== SESSION API ===================== */
export const sessionAPI = {
  getAll: (params?: any) => api.get('/sessions', { params }),
  getUpcoming: () => api.get('/sessions/upcoming'),
  getById: (id: string) => api.get(`/sessions/${id}`),
  create: (data: any) => api.post('/sessions', data),
  update: (id: string, data: any) =>
    api.put(`/sessions/${id}`, data),
  cancel: (
    id: string,
    data: { reason?: string; loggedByTherapist?: boolean }
  ) => api.delete(`/sessions/${id}`, { data }),
  start: (id: string) =>
    api.post(`/sessions/${id}/start`),
  complete: (id: string, notes?: string) =>
    api.post(`/sessions/${id}/complete`, { notes }),
  saveSoapNote: (id: string, soapNote: any) =>
    api.post(`/sessions/${id}/soap-note`, soapNote),
  saveTranscript: (
    id: string,
    data: {
      text: string;
      originalLanguage: string;
      translatedText?: any;
    }
  ) => api.post(`/sessions/${id}/transcript`, data),
  getTranscriptTranslation: (id: string, language: string) =>
    api.get(`/sessions/${id}/transcript/${language}`),
};

/* ===================== SUBSCRIPTION API ===================== */
export const subscriptionAPI = {
  getPricing: () => api.get('/subscriptions/pricing'),
  subscribe: (tier: string) =>
    api.post('/subscriptions/subscribe', { tier }),
  getCurrent: () => api.get('/subscriptions/current'),
  getRemainingSessions: () =>
    api.get('/subscriptions/remaining-sessions'),
  cancel: (reason?: string) =>
    api.delete('/subscriptions/cancel', {
      data: { reason },
    }),
  getHistory: () => api.get('/subscriptions/history'),
};

/* ===================== STRIPE API ===================== */
export const stripeAPI = {
  getConfig: () => api.get('/stripe/config'),
  createCheckoutSession: (tier: string) =>
    api.post('/stripe/create-checkout-session', { tier }),
  createPaymentIntent: (sessionId: string) =>
    api.post('/stripe/create-payment-intent', { sessionId }),
  createCancellationPayment: (sessionId: string) =>
    api.post('/stripe/create-cancellation-payment', { sessionId }),
  confirmPayment: (paymentIntentId: string) =>
    api.post('/stripe/confirm-payment', { paymentIntentId }),
  processSessionPayment: (sessionId: string) =>
    api.post('/stripe/process-session-payment', { sessionId }),
  verifyCheckoutSession: (sessionId: string) =>
    api.post('/stripe/verify-checkout', { sessionId }),
  refundPayment: (
    paymentId: string,
    amount?: number,
    reason?: string
  ) =>
    api.post('/stripe/refund', {
      paymentId,
      amount,
      reason,
    }),
};

/* ===================== ASSIGNMENT API ===================== */
export const assignmentAPI = {
  getAll: (params?: any) => api.get('/assignments', { params }),
  getById: (id: string) => api.get(`/assignments/${id}`),
  create: (data: any) => api.post('/assignments', data),
  update: (id: string, data: any) =>
    api.put(`/assignments/${id}`, data),
  markComplete: (id: string) =>
    api.put(`/assignments/${id}`, { completed: true }),
  addFeedback: (
    id: string,
    data: { feedback: string; rating?: number }
  ) => api.post(`/assignments/${id}/feedback`, data),
  delete: (id: string) =>
    api.delete(`/assignments/${id}`),
};

/* ===================== FORUM API ===================== */
export const forumAPI = {
  getPosts: (params?: any) =>
    api.get('/forum/posts', { params }),
  getPost: (id: string) =>
    api.get(`/forum/posts/${id}`),
  createPost: (data: any) =>
    api.post('/forum/posts', data),
  updatePost: (id: string, data: any) =>
    api.put(`/forum/posts/${id}`, data),
  deletePost: (id: string) =>
    api.delete(`/forum/posts/${id}`),
  likePost: (id: string) =>
    api.post(`/forum/posts/${id}/like`),
  pinPost: (id: string) =>
    api.post(`/forum/posts/${id}/pin`),
  createReply: (postId: string, data: any) =>
    api.post(`/forum/posts/${postId}/replies`, data),
  updateReply: (id: string, data: any) =>
    api.put(`/forum/replies/${id}`, data),
  deleteReply: (id: string) =>
    api.delete(`/forum/replies/${id}`),
  likeReply: (id: string) =>
    api.post(`/forum/replies/${id}/like`),
};

/* ===================== MESSAGE API ===================== */
export const messageAPI = {
  getSupportAgent: () =>
    api.get('/messages/support-agent'),
  getConversations: () =>
    api.get('/messages/conversations'),
  getMessages: (userId: string) =>
    api.get(`/messages/${userId}`),
  sendMessage: (
    receiverId: string,
    content: string,
    type?: string,
    attachments?: any[]
  ) =>
    api.post('/messages', {
      receiverId,
      content,
      type,
      attachments,
    }),
  sendMessageWithFiles: (formData: FormData) =>
    api.post('/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  markAsRead: (messageIds?: string[], senderId?: string) =>
    api.put('/messages/read', { messageIds, senderId }),
  deleteMessage: (id: string) =>
    api.delete(`/messages/${id}`),
};

/* ===================== RESOURCE API ===================== */
export const resourceAPI = {
  getAll: (params?: any) =>
    api.get('/resources', { params }),
  aiSearch: (query: string, params?: any) =>
    api.get('/resources/ai-search', {
      params: { query, ...params },
    }),
  getById: (id: string) =>
    api.get(`/resources/${id}`),
  create: (data: any) =>
    api.post('/resources', data),
  update: (id: string, data: any) =>
    api.put(`/resources/${id}`, data),
  delete: (id: string) =>
    api.delete(`/resources/${id}`),
};

/* ===================== 🔥 TRANSLATION API (UPDATED) ===================== */
export const translationAPI = {
  getLanguages: () =>
    api.get('/translation/languages'),

  // ✅ ADDED FOR WEBSITE TRANSLATION
  getTranslations: (languageCode: string) =>
    api.get(`/translation/translations?lang=${languageCode}`),

  translateText: (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ) =>
    api.post('/translation/translate', {
      text,
      sourceLanguage,
      targetLanguage,
    }),

  detectLanguage: (text: string) =>
    api.post('/translation/detect', { text }),

  getPreferences: () =>
    api.get('/translation/preferences'),

  updatePreferences: (data: any) =>
    api.put('/translation/preferences', data),

  getBilingualTherapists: (language: string) =>
    api.get('/translation/bilingual-therapists', {
      params: { language },
    }),

  realtime: (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ) =>
    api.post('/translation/realtime', {
      text,
      sourceLanguage,
      targetLanguage,
    }),

  interpret: (
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    context?: string
  ) =>
    api.post('/translation/interpret', {
      text,
      sourceLanguage,
      targetLanguage,
      context,
    }),

  translateTranscript: (
    transcript: string,
    originalLanguage: string,
    targetLanguage: string
  ) =>
    api.post('/translation/transcript', {
      transcript,
      originalLanguage,
      targetLanguage,
    }),
};

/* ===================== CALENDAR API ===================== */
export const calendarAPI = {
  getEvents: (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => api.get('/calendar/events', { params }),
  getEvent: (eventId: string) =>
    api.get(`/calendar/events/${eventId}`),
  getStatus: () => api.get('/calendar/status'),
  connectGoogle: (data: any) =>
    api.post('/calendar/connect/google', data),
  connectOutlook: (data: any) =>
    api.post('/calendar/connect/outlook', data),
  disconnect: () =>
    api.post('/calendar/disconnect'),
  getEventUrl: (sessionId: string, provider?: string) =>
    api.get(`/calendar/event-url/${sessionId}`, {
      params: { provider },
    }),
  syncSession: (sessionId: string) =>
    api.post(`/calendar/sync-session/${sessionId}`),
};

/* ===================== PUSH API ===================== */
export const pushAPI = {
  getVapidPublicKey: () =>
    api.get('/push/vapid-public-key'),
  subscribe: (subscription: any) =>
    api.post('/push/subscribe', subscription),
  unsubscribe: () =>
    api.post('/push/unsubscribe'),
};

/* ===================== FAMILY COACHING API ===================== */
export const familyCoachingAPI = {
  getSessions: (params?: any) =>
    api.get('/family-coaching', { params }),
  getSession: (id: string) =>
    api.get(`/family-coaching/${id}`),
  createSession: (data: any) =>
    api.post('/family-coaching', data),
  updateSession: (id: string, data: any) =>
    api.put(`/family-coaching/${id}`, data),
  cancelSession: (
    id: string,
    cancellationReason?: string
  ) =>
    api.delete(`/family-coaching/${id}`, {
      data: { cancellationReason },
    }),
};

/* ===================== HEALTH CHECK ===================== */
export const healthCheck = () => api.get('/health');

export default api;
