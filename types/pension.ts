// Tipos de datos para la API de pensiones

export enum TipoJubilacion {
  ORDINARIA = 'ordinaria',
  ANTICIPADA_INVOLUNTARIA = 'anticipada_involuntaria',
  ANTICIPADA_VOLUNTARIA = 'anticipada_voluntaria',
  PARCIAL = 'parcial',
  DEMORADA = 'demorada'
}

export enum Sexo {
  MASCULINO = 'M',
  FEMENINO = 'F'
}

export interface DatosParcial {
  porcentaje_reduccion_jornada: number
  contrato_relevo: boolean
  salario_compatible?: number
  antiguedad_empresa_anios?: number
  base_cotizacion_relevista_pct?: number
  mantenimiento_relevo_meses?: number
}

export interface DatosDemorada {
  meses_retraso: number
  opcion_incremento: 'porcentual' | 'tanto_alzado' | 'mixto'
}

export interface SolicitudPension {
  fecha_nacimiento: string
  fecha_jubilacion_deseada: string
  sexo: Sexo
  carencia_generica: number
  carencia_especifica: number
  base_reguladora: number
  tipo_jubilacion: TipoJubilacion
  otras_rentas_anuales: number
  datos_parcial?: DatosParcial
  datos_demorada?: DatosDemorada
}

export interface ErrorValidacion {
  codigo: string
  mensaje: string
  regla_aplicada: string
}

export interface ResultadoValidacion {
  es_valido: boolean
  errores: ErrorValidacion[]
  advertencias: string[]
}

export interface DetalleCalculo {
  porcentaje_anos_cotizados: number
  porcentaje_anticipacion_demora: number
  pension_antes_topes: number
  pension_minima_aplicable: number
  pension_maxima_aplicable: number
  complemento_minimos: number
  pension_final: number
  datos_especificos?: Record<string, any>
}

export interface RespuestaSimulacion {
  validacion: ResultadoValidacion
  calculo?: DetalleCalculo
  edad_jubilacion_anos: number
  anos_cotizados: number
  reglas_aplicadas: string[]
  observaciones: string[]
  fecha_calculo: string
  version_sistema: string
}

// Tipos para el formulario
export interface FormularioPension {
  // Datos personales
  fecha_nacimiento: string
  sexo: Sexo
  
  // Datos laborales
  anos_cotizados_total: number // Se convertirá a días
  anos_cotizados_ultimos_15: number // Se convertirá a días
  base_reguladora: number
  otras_rentas_anuales: number
  
  // Datos de jubilación
  fecha_jubilacion_deseada: string
  tipo_jubilacion: TipoJubilacion
  
  // Datos específicos para parcial
  parcial_porcentaje_reduccion?: number
  parcial_contrato_relevo?: boolean
  parcial_salario_compatible?: number
  parcial_antiguedad_empresa?: number
  parcial_base_relevista?: number
  parcial_meses_relevo?: number
  
  // Datos específicos para demorada
  demorada_meses_retraso?: number
  demorada_opcion_incremento?: 'porcentual' | 'tanto_alzado' | 'mixto'
}

// Tipos para la información de la API
export interface TipoJubilacionInfo {
  tipo: string
  nombre: string
  descripcion: string
  edad_minima: string
  requisitos: string[]
}

export interface RequisitosTipo {
  carencia_generica: string
  carencia_especifica: string
  edad: string
  observaciones: string
  [key: string]: string
}
