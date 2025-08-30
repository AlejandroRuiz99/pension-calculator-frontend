// Utilidades para cálculos y conversiones

/**
 * Convierte años a días (usando 365 días por año)
 */
export const anosADias = (anos: number): number => {
  return Math.round(anos * 365)
}

/**
 * Convierte días a años
 */
export const diasAAanos = (dias: number): number => {
  return Number((dias / 365).toFixed(2))
}

/**
 * Calcula la edad actual en años
 */
export const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  
  return edad
}

/**
 * Calcula la edad en una fecha específica
 */
export const calcularEdadEnFecha = (fechaNacimiento: string, fechaObjetivo: string): number => {
  const objetivo = new Date(fechaObjetivo)
  const nacimiento = new Date(fechaNacimiento)
  let edad = objetivo.getFullYear() - nacimiento.getFullYear()
  const mes = objetivo.getMonth() - nacimiento.getMonth()
  
  if (mes < 0 || (mes === 0 && objetivo.getDate() < nacimiento.getDate())) {
    edad--
  }
  
  return edad
}

/**
 * Formatea una cantidad en euros
 */
export const formatearEuros = (cantidad: number, decimales: number = 2): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(cantidad)
}

/**
 * Formatea un porcentaje
 */
export const formatearPorcentaje = (porcentaje: number, decimales: number = 1): string => {
  return `${porcentaje.toFixed(decimales)}%`
}

/**
 * Valida si una fecha es válida
 */
export const esFechaValida = (fecha: string): boolean => {
  const date = new Date(fecha)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Obtiene la fecha mínima para nacimiento (por ejemplo, hace 100 años)
 */
export const getFechaMinimaNacimiento = (): string => {
  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() - 100)
  return fecha.toISOString().split('T')[0]
}

/**
 * Obtiene la fecha máxima para nacimiento (por ejemplo, hace 16 años)
 */
export const getFechaMaximaNacimiento = (): string => {
  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() - 16)
  return fecha.toISOString().split('T')[0]
}

/**
 * Obtiene la fecha mínima para jubilación (hoy)
 */
export const getFechaMinimaJubilacion = (): string => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Obtiene la fecha máxima para jubilación (en 30 años)
 */
export const getFechaMaximaJubilacion = (): string => {
  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() + 30)
  return fecha.toISOString().split('T')[0]
}

/**
 * Calcula los meses entre dos fechas
 */
export const calcularMesesEntreFechas = (fechaInicio: string, fechaFin: string): number => {
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  
  const años = fin.getFullYear() - inicio.getFullYear()
  const meses = fin.getMonth() - inicio.getMonth()
  
  return años * 12 + meses
}

/**
 * Valida que los años cotizados sean coherentes
 */
export const validarAnosCotizados = (
  anosTotal: number, 
  anosUltimos15: number, 
  edadActual: number
): string | null => {
  if (anosTotal < 0) return 'Los años cotizados no pueden ser negativos'
  if (anosUltimos15 < 0) return 'Los años en últimos 15 no pueden ser negativos'
  if (anosUltimos15 > 15) return 'No se puede cotizar más de 15 años en los últimos 15'
  if (anosUltimos15 > anosTotal) return 'Los años en últimos 15 no pueden ser superiores al total'
  if (anosTotal > edadActual - 16) return 'No se puede cotizar más años que la edad laboral posible'
  
  return null
}

/**
 * Obtiene el color para un porcentaje (verde = bueno, rojo = malo)
 */
export const getColorPorcentaje = (porcentaje: number): string => {
  if (porcentaje >= 100) return 'text-green-600'
  if (porcentaje >= 80) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Genera sugerencias basadas en la edad y años cotizados
 */
export const generarSugerencias = (
  edad: number, 
  anosTotal: number, 
  tipoJubilacion: string
): string[] => {
  const sugerencias: string[] = []
  
  if (anosTotal < 15) {
    sugerencias.push('Necesita al menos 15 años cotizados para cualquier tipo de jubilación')
  }
  
  if (tipoJubilacion === 'anticipada_voluntaria' && anosTotal < 35) {
    sugerencias.push('Para jubilación anticipada voluntaria necesita al menos 35 años cotizados')
  }
  
  if (tipoJubilacion === 'anticipada_involuntaria' && anosTotal < 33) {
    sugerencias.push('Para jubilación anticipada involuntaria necesita al menos 33 años cotizados')
  }
  
  if (edad < 60) {
    sugerencias.push('Considere seguir cotizando para mejorar su futuro porcentaje de pensión')
  }
  
  if (edad >= 67 && tipoJubilacion !== 'demorada') {
    sugerencias.push('Podría considerar la jubilación demorada para obtener incrementos en su pensión')
  }
  
  return sugerencias
}
