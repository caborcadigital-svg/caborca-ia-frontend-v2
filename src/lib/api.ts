import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('caborca_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('caborca_token');
      localStorage.removeItem('caborca_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;

export const chatAPI = {
  mensaje: (data: { mensaje: string; conversacion_id?: string; usuario_id?: string }) =>
    api.post('/chat/mensaje', data).then(r => r.data),
  crearConversacion: () => api.post('/chat/conversacion').then(r => r.data),
  getConversaciones: () => api.get('/chat/conversaciones').then(r => r.data),
  getMensajes: (id: string) => api.get(`/chat/conversacion/${id}`).then(r => r.data),
  eliminarConversacion: (id: string) => api.delete(`/chat/conversacion/${id}`).then(r => r.data),
};

export const climaAPI = {
  getCurrent: () => api.get('/clima').then(r => r.data),
  getPronostico: () => api.get('/clima/pronostico').then(r => r.data),
};

export const noticiasAPI = {
  getAll: (params?: { limit?: number; categoria?: string; page?: number }) =>
    api.get('/noticias', { params }).then(r => r.data),
  getById: (id: string) => api.get(`/noticias/${id}`).then(r => r.data),
};

export const eventosAPI = {
  getAll: (params?: { proximos?: boolean; limit?: number }) =>
    api.get('/eventos', { params }).then(r => r.data),
};

export const reportesAPI = {
  getAll: (params?: { tipo?: string }) => api.get('/reportes', { params }).then(r => r.data),
  crear: (data: { tipo: string; descripcion: string; ubicacion: string }) =>
    api.post('/reportes', data).then(r => r.data),
};

export const deportesAPI = {
  getPartidos: (params?: { deporte?: string; liga?: string }) =>
    api.get('/deportes/partidos', { params }).then(r => r.data),
  getProximos: () => api.get('/deportes/proximos').then(r => r.data),
  getLigas: () => api.get('/deportes/ligas').then(r => r.data),
};

export const negociosAPI = {
  getAll: (params?: { categoria?: string; q?: string }) =>
    api.get('/negocios', { params }).then(r => r.data),
};

export const authAPI = {
  login: (data: { identificador: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),
  registro: (data: { nombre: string; username: string; email: string; password: string; codigo_admin?: string }) =>
    api.post('/auth/registro', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats').then(r => r.data),
  crearNoticia: (data: object) => api.post('/admin/noticias', data).then(r => r.data),
  actualizarNoticia: (id: string, data: object) => api.put(`/admin/noticias/${id}`, data).then(r => r.data),
  eliminarNoticia: (id: string) => api.delete(`/admin/noticias/${id}`).then(r => r.data),
  crearEvento: (data: object) => api.post('/admin/eventos', data).then(r => r.data),
  eliminarEvento: (id: string) => api.delete(`/admin/eventos/${id}`).then(r => r.data),
  getReportesPendientes: () => api.get('/admin/reportes/pendientes').then(r => r.data),
  actualizarReporte: (id: string, estado: string) => api.put(`/admin/reportes/${id}/estado`, { estado }).then(r => r.data),
  crearPartido: (data: object) => api.post('/admin/deportes/partidos', data).then(r => r.data),
  actualizarPartido: (id: string, data: object) => api.put(`/admin/deportes/partidos/${id}`, data).then(r => r.data),
};
