import axios from 'axios'
import { SolicitudPension, RespuestaSimulacion, TipoJubilacionInfo, RequisitosTipo } from '@/types/pension'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pension-calculator-2729dd945347.herokuapp.com'

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// Funciones de la API
export const pensionApi = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error('No se pudo conectar con la API')
    }
  },

  // Simular pensión
  async simularPension(solicitud: SolicitudPension): Promise<RespuestaSimulacion> {
    try {
      const response = await api.post<RespuestaSimulacion>('/simular-pension', solicitud)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(`Error de validación: ${error.response.data.detail || 'Datos incorrectos'}`)
      }
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Por favor, inténtelo más tarde.')
      }
      throw new Error(`Error de conexión: ${error.message}`)
    }
  },

  // Obtener tipos de jubilación
  async obtenerTiposJubilacion(): Promise<{ tipos_jubilacion: TipoJubilacionInfo[] }> {
    try {
      const response = await api.get('/info/tipos-jubilacion')
      return response.data
    } catch (error) {
      throw new Error('No se pudieron obtener los tipos de jubilación')
    }
  },

  // Obtener requisitos específicos
  async obtenerRequisitos(tipo: string): Promise<{ tipo: string, requisitos: RequisitosTipo }> {
    try {
      const response = await api.get(`/info/requisitos/${tipo}`)
      return response.data
    } catch (error) {
      throw new Error(`No se pudieron obtener los requisitos para ${tipo}`)
    }
  },

  // Validar solo requisitos
  async validarRequisitos(solicitud: SolicitudPension) {
    try {
      const response = await api.post('/validar-requisitos', solicitud)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(`Error de validación: ${error.response.data.detail}`)
      }
      throw new Error(`Error al validar requisitos: ${error.message}`)
    }
  },

  // Obtener información general
  async obtenerInfoGeneral() {
    try {
      const response = await api.get('/')
      return response.data
    } catch (error) {
      throw new Error('No se pudo obtener la información general')
    }
  }
}

export default api
