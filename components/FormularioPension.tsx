'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calculator, AlertCircle, Info, HelpCircle } from 'lucide-react'
import { type FormularioPension, TipoJubilacion, Sexo, SolicitudPension } from '@/types/pension'
import { pensionApi } from '@/lib/api'
import { 
  anosADias, 
  calcularEdad, 
  validarDiasCotizados, 
  getFechaMinimaNacimiento,
  getFechaMaximaNacimiento,
  getFechaMinimaJubilacion,
  getFechaMaximaJubilacion
} from '@/utils/calculations'
import toast from 'react-hot-toast'

// Schema de validación
const formularioSchema = z.object({
  fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento requerida'),
  sexo: z.enum(['M', 'F'], { required_error: 'Sexo requerido' }),
  dias_cotizados_total: z.number().min(0, 'Debe ser mayor a 0').max(18250, 'Máximo 18,250 días (50 años)'),
  dias_cotizados_ultimos_15: z.number().min(0, 'Debe ser mayor a 0').max(5475, 'Máximo 5,475 días (15 años)'),
  base_reguladora: z.number().min(1, 'Debe ser mayor a 0').max(10000, 'Máximo €10,000'),
  otras_rentas_anuales: z.number().min(0, 'Debe ser 0 o mayor'),
  fecha_jubilacion_deseada: z.string().min(1, 'Fecha de jubilación requerida'),
  tipo_jubilacion: z.enum(['ordinaria', 'anticipada_involuntaria', 'anticipada_voluntaria', 'parcial', 'demorada']),
  
  // Campos opcionales para parcial
  parcial_porcentaje_reduccion: z.number().optional(),
  parcial_contrato_relevo: z.boolean().optional(),
  parcial_salario_compatible: z.number().optional(),
  parcial_antiguedad_empresa: z.number().optional(),
  parcial_base_relevista: z.number().optional(),
  parcial_meses_relevo: z.number().optional(),
  
  // Campos opcionales para demorada
  demorada_meses_retraso: z.number().optional(),
  demorada_opcion_incremento: z.enum(['porcentual', 'tanto_alzado', 'mixto']).optional(),
})

interface Props {
  onSimulacion: (resultado: any, datosFormulario: FormularioPension) => void
  loading?: boolean
  disabled?: boolean
}

export default function FormularioPension({ onSimulacion, loading = false, disabled = false }: Props) {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [mostrarAyuda, setMostrarAyuda] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormularioPension>({
    resolver: zodResolver(formularioSchema),
    defaultValues: {
      sexo: Sexo.MASCULINO,
      tipo_jubilacion: TipoJubilacion.ORDINARIA,
      otras_rentas_anuales: 0,
      parcial_contrato_relevo: false,
      demorada_opcion_incremento: 'porcentual'
    }
  })

  const tipoJubilacion = watch('tipo_jubilacion')
  const fechaNacimiento = watch('fecha_nacimiento')
  const diasTotal = watch('dias_cotizados_total')
  const diasUltimos15 = watch('dias_cotizados_ultimos_15')

  // Validaciones dinámicas
  useEffect(() => {
    if (fechaNacimiento && diasTotal && diasUltimos15) {
      const edad = calcularEdad(fechaNacimiento)
      const errorValidacion = validarDiasCotizados(diasTotal, diasUltimos15, edad)
      if (errorValidacion) {
        toast.error(errorValidacion)
      }
    }
  }, [fechaNacimiento, diasTotal, diasUltimos15])

  const onSubmit = async (data: FormularioPension) => {
    setLoadingSubmit(true)
    
    try {
      // Convertir el formulario al formato de la API
      const solicitud: SolicitudPension = {
        fecha_nacimiento: data.fecha_nacimiento,
        fecha_jubilacion_deseada: data.fecha_jubilacion_deseada,
        sexo: data.sexo,
        carencia_generica: data.dias_cotizados_total,
        carencia_especifica: data.dias_cotizados_ultimos_15,
        base_reguladora: data.base_reguladora,
        tipo_jubilacion: data.tipo_jubilacion,
        otras_rentas_anuales: data.otras_rentas_anuales,
      }

      // Añadir datos específicos según tipo
      if (data.tipo_jubilacion === 'parcial') {
        solicitud.datos_parcial = {
          porcentaje_reduccion_jornada: data.parcial_porcentaje_reduccion || 25,
          contrato_relevo: data.parcial_contrato_relevo || false,
          salario_compatible: data.parcial_salario_compatible,
          antiguedad_empresa_anios: data.parcial_antiguedad_empresa,
          base_cotizacion_relevista_pct: data.parcial_base_relevista,
          mantenimiento_relevo_meses: data.parcial_meses_relevo,
        }
      }

      if (data.tipo_jubilacion === 'demorada') {
        solicitud.datos_demorada = {
          meses_retraso: data.demorada_meses_retraso || 12,
          opcion_incremento: data.demorada_opcion_incremento || 'porcentual',
        }
      }

      const resultado = await pensionApi.simularPension(solicitud)
      
      toast.success('Simulación completada correctamente')
      onSimulacion(resultado, data)
      
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la simulación')
      console.error('Error en simulación:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const HelpTooltip = ({ field, content }: { field: string, content: string }) => (
    <div className="relative">
      <button
        type="button"
        className="ml-1 text-gray-400 hover:text-gray-600"
        onMouseEnter={() => setMostrarAyuda(field)}
        onMouseLeave={() => setMostrarAyuda(null)}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {mostrarAyuda === field && (
        <div className="absolute z-10 w-64 p-2 text-xs text-white bg-gray-800 rounded shadow-lg -top-2 left-6">
          {content}
        </div>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* Datos Personales */}
      <div className="form-section">
        <h3 className="form-title">📋 Datos Personales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-field">
            <label className="form-label flex items-center">
              Fecha de Nacimiento
              <HelpTooltip 
                field="fecha_nacimiento" 
                content="Fecha de nacimiento del solicitante de la pensión" 
              />
            </label>
            <input
              type="date"
              {...register('fecha_nacimiento')}
              className="form-input"
              min={getFechaMinimaNacimiento()}
              max={getFechaMaximaNacimiento()}
              disabled={disabled}
            />
            {errors.fecha_nacimiento && (
              <p className="form-error">{errors.fecha_nacimiento.message}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Sexo</label>
            <select {...register('sexo')} className="form-select" disabled={disabled}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.sexo && (
              <p className="form-error">{errors.sexo.message}</p>
            )}
          </div>
        </div>

        {fechaNacimiento && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              <Info className="w-4 h-4 inline mr-1" />
              Edad actual: {calcularEdad(fechaNacimiento)} años
            </p>
          </div>
        )}
      </div>

      {/* Datos Laborales */}
      <div className="form-section">
        <h3 className="form-title">💼 Datos Laborales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-field">
            <label className="form-label flex items-center">
              Días Cotizados (Total)
              <HelpTooltip 
                field="dias_total" 
                content="Total de días cotizados a la Seguridad Social a lo largo de toda su vida laboral" 
              />
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="18250"
              {...register('dias_cotizados_total', { valueAsNumber: true })}
              className="form-input"
              disabled={disabled}
            />
            {errors.dias_cotizados_total && (
              <p className="form-error">{errors.dias_cotizados_total.message}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label flex items-center">
              Días Cotizados (Últimos 15 años)
              <HelpTooltip 
                field="dias_ultimos15" 
                content="Días cotizados en los últimos 15 años anteriores a la jubilación (máximo 5,475 días)" 
              />
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="5475"
              {...register('dias_cotizados_ultimos_15', { valueAsNumber: true })}
              className="form-input"
              disabled={disabled}
            />
            {errors.dias_cotizados_ultimos_15 && (
              <p className="form-error">{errors.dias_cotizados_ultimos_15.message}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label flex items-center">
              Base Reguladora (€/mes)
              <HelpTooltip 
                field="base_reguladora" 
                content="Base reguladora calculada según sus cotizaciones (promedio de las bases de cotización)" 
              />
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              max="10000"
              {...register('base_reguladora', { valueAsNumber: true })}
              className="form-input"
              disabled={disabled}
            />
            {errors.base_reguladora && (
              <p className="form-error">{errors.base_reguladora.message}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label flex items-center">
              Otras Rentas Anuales (€)
              <HelpTooltip 
                field="otras_rentas" 
                content="Otras rentas anuales del solicitante (trabajo, alquileres, etc.)" 
              />
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('otras_rentas_anuales', { valueAsNumber: true })}
              className="form-input"
              disabled={disabled}
            />
            {errors.otras_rentas_anuales && (
              <p className="form-error">{errors.otras_rentas_anuales.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Datos de Jubilación */}
      <div className="form-section">
        <h3 className="form-title">🎯 Datos de Jubilación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-field">
            <label className="form-label">Fecha de Jubilación Deseada</label>
            <input
              type="date"
              {...register('fecha_jubilacion_deseada')}
              className="form-input"
              min={getFechaMinimaJubilacion()}
              max={getFechaMaximaJubilacion()}
              disabled={disabled}
            />
            {errors.fecha_jubilacion_deseada && (
              <p className="form-error">{errors.fecha_jubilacion_deseada.message}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Tipo de Jubilación</label>
            <select {...register('tipo_jubilacion')} className="form-select" disabled={disabled}>
              <option value="ordinaria">Jubilación Ordinaria</option>
              <option value="anticipada_voluntaria">Anticipada Voluntaria</option>
              <option value="anticipada_involuntaria">Anticipada Involuntaria</option>
              <option value="parcial">Jubilación Parcial</option>
              <option value="demorada">Jubilación Demorada</option>
            </select>
            {errors.tipo_jubilacion && (
              <p className="form-error">{errors.tipo_jubilacion.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Campos específicos para Jubilación Parcial */}
      {tipoJubilacion === 'parcial' && (
        <div className="form-section">
          <h3 className="form-title">⏰ Datos Específicos - Jubilación Parcial</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Porcentaje de Reducción de Jornada (%)</label>
              <input
                type="number"
                min="25"
                max="75"
                {...register('parcial_porcentaje_reduccion', { valueAsNumber: true })}
                className="form-input"
                placeholder="25"
                disabled={disabled}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Antigüedad en la Empresa (años)</label>
              <input
                type="number"
                min="0"
                max="50"
                {...register('parcial_antiguedad_empresa', { valueAsNumber: true })}
                className="form-input"
                disabled={disabled}
              />
            </div>

            <div className="form-field">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('parcial_contrato_relevo')}
                  disabled={disabled}
                />
                <span className="text-sm font-medium text-gray-700">¿Tiene contrato de relevo?</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Campos específicos para Jubilación Demorada */}
      {tipoJubilacion === 'demorada' && (
        <div className="form-section">
          <h3 className="form-title">⏳ Datos Específicos - Jubilación Demorada</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Meses de Retraso</label>
              <input
                type="number"
                min="1"
                max="120"
                {...register('demorada_meses_retraso', { valueAsNumber: true })}
                className="form-input"
                placeholder="12"
                disabled={disabled}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Opción de Incremento</label>
              <select {...register('demorada_opcion_incremento')} className="form-select" disabled={disabled}>
                <option value="porcentual">Incremento Porcentual</option>
                <option value="tanto_alzado">Tanto Alzado (Pago Único)</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          disabled={disabled || loadingSubmit}
        >
          Limpiar
        </button>
        
        <button
          type="submit"
          className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || loadingSubmit}
        >
          {loadingSubmit ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Simular Pensión
            </>
          )}
        </button>
      </div>

      {disabled && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Sin conexión con la API</p>
              <p>No se pueden realizar simulaciones en este momento. Verifique su conexión a internet.</p>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
