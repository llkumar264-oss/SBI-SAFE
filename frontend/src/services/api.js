import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── URL Scanning ────────────────────────────────────────────────────────────
export const scanUrl = (url) => api.post('/scan-url', { url })
export const getScanHistory = (limit = 20) => api.get(`/scan-url/history?limit=${limit}`)
export const getScanStats = () => api.get('/scan-url/stats')

// ─── Text Analysis ────────────────────────────────────────────────────────────
export const analyzeText = (text) => api.post('/analyze-text', { text })

// ─── Fraud Reports ────────────────────────────────────────────────────────────
export const submitReport = (data) => api.post('/report-fraud', data)
export const getReports = (params = {}) => api.get('/report-fraud', { params })
export const upvoteReport = (id) => api.post(`/report-fraud/${id}/upvote`)

// ─── Fraud Map ────────────────────────────────────────────────────────────────
export const getFraudHeatmap = () => api.get('/fraud-map/heatmap')
export const getFraudMapStats = () => api.get('/fraud-map/stats')

// ─── Risk Scoring ─────────────────────────────────────────────────────────────
export const getRiskScore = (data) => api.post('/risk-score', data)
export const analyzeApk = (data) => api.post('/analyze-apk', data)
export const getAlerts = () => api.get('/alerts')

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

export default api
