import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://http://192.168.254.110:1106/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (attach auth token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('my-app-store') 
      ? JSON.parse(localStorage.getItem('my-app-store'))?.token 
      : null
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.error('Unauthorized - redirecting to login')
    }
    return Promise.reject(error)
  }
)

export default api