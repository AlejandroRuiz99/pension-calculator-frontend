'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Clock, Users, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { TipoJubilacionInfo, RequisitosTipo } from '@/types/pension'
import { pensionApi } from '@/lib/api'

export default function InformacionTipos() {
  const [tiposJubilacion, setTiposJubilacion] = useState<TipoJubilacionInfo[]>([])
  const [tipoExpandido, setTipoExpandido] = useState<string | null>(null)
  const [requisitos, setRequisitos] = useState<Record<string, RequisitosTipo>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarInformacion = async () => {
      try {
        const response = await pensionApi.obtenerTiposJubilacion()
        setTiposJubilacion(response.tipos_jubilacion)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    cargarInformacion()
  }, [])

  const cargarRequisitos = async (tipo: string) => {
    if (requisitos[tipo]) return // Ya está cargado

    try {
      const response = await pensionApi.obtenerRequisitos(tipo)
      setRequisitos(prev => ({
        ...prev,
        [tipo]: response.requisitos
      }))
    } catch (error) {
      console.error('Error cargando requisitos:', error)
    }
  }

  const toggleTipo = (tipo: string) => {
    if (tipoExpandido === tipo) {
      setTipoExpandido(null)
    } else {
      setTipoExpandido(tipo)
      cargarRequisitos(tipo)
    }
  }

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'ordinaria':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'anticipada_voluntaria':
        return <TrendingDown className="w-5 h-5 text-orange-500" />
      case 'anticipada_involuntaria':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'parcial':
        return <Users className="w-5 h-5 text-purple-500" />
      case 'demorada':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'ordinaria':
        return 'border-blue-200 bg-blue-50'
      case 'anticipada_voluntaria':
        return 'border-orange-200 bg-orange-50'
      case 'anticipada_involuntaria':
        return 'border-red-200 bg-red-50'
      case 'parcial':
        return 'border-purple-200 bg-purple-50'
      case 'demorada':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="loading-spinner mr-2"></div>
          <span>Cargando información de tipos de jubilación...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error al cargar información</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          📚 Tipos de Jubilación Disponibles
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Información sobre los diferentes tipos de jubilación y sus requisitos
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {tiposJubilacion.map((tipo) => (
          <div key={tipo.tipo} className="transition-all duration-200">
            <button
              onClick={() => toggleTipo(tipo.tipo)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIconoTipo(tipo.tipo)}
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {tipo.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tipo.descripcion}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {tipo.edad_minima}
                  </span>
                  {tipoExpandido === tipo.tipo ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>

            {tipoExpandido === tipo.tipo && (
              <div className={`px-6 py-4 ${getColorTipo(tipo.tipo)} border-t border-gray-200 animate-slide-up`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Requisitos básicos */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">
                      Requisitos Básicos
                    </h4>
                    <ul className="space-y-2">
                      {tipo.requisitos.map((requisito, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <span className="w-2 h-2 bg-current rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {requisito}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requisitos detallados */}
                  {requisitos[tipo.tipo] && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">
                        Requisitos Específicos
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Carencia genérica:</span>
                          <span className="text-gray-800">{requisitos[tipo.tipo].carencia_generica}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Carencia específica:</span>
                          <span className="text-gray-800">{requisitos[tipo.tipo].carencia_especifica}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Edad:</span>
                          <span className="text-gray-800">{requisitos[tipo.tipo].edad}</span>
                        </div>
                        
                        {/* Requisitos adicionales específicos */}
                        {Object.entries(requisitos[tipo.tipo]).map(([clave, valor]) => {
                          if (!['carencia_generica', 'carencia_especifica', 'edad', 'observaciones'].includes(clave)) {
                            return (
                              <div key={clave} className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                  {clave.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}:
                                </span>
                                <span className="text-gray-800">{valor}</span>
                              </div>
                            )
                          }
                          return null
                        })}
                        
                        {requisitos[tipo.tipo].observaciones && (
                          <div className="mt-4 p-3 bg-white rounded border border-gray-300">
                            <p className="text-xs text-gray-600 font-medium mb-1">Observaciones:</p>
                            <p className="text-xs text-gray-700">{requisitos[tipo.tipo].observaciones}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Consejos específicos por tipo */}
                <div className="mt-4 p-3 bg-white rounded border border-gray-300">
                  <h5 className="text-xs font-semibold text-gray-800 mb-2">💡 Consejos:</h5>
                  <div className="text-xs text-gray-600 space-y-1">
                    {tipo.tipo === 'ordinaria' && (
                      <>
                        <p>• La edad ordinaria varía según el año de jubilación y años cotizados</p>
                        <p>• A partir de 37 años cotizados, la edad se reduce progresivamente</p>
                      </>
                    )}
                    {tipo.tipo === 'anticipada_voluntaria' && (
                      <>
                        <p>• Se aplican coeficientes reductores que varían según años cotizados</p>
                        <p>• La pensión debe superar la mínima que correspondería a los 65 años</p>
                      </>
                    )}
                    {tipo.tipo === 'anticipada_involuntaria' && (
                      <>
                        <p>• Coeficientes reductores más favorables que la voluntaria</p>
                        <p>• Requiere acreditar cese involuntario en el trabajo</p>
                      </>
                    )}
                    {tipo.tipo === 'parcial' && (
                      <>
                        <p>• Permite compatibilizar pensión con trabajo a tiempo parcial</p>
                        <p>• Con contrato de relevo se puede anticipar desde los 62 años</p>
                      </>
                    )}
                    {tipo.tipo === 'demorada' && (
                      <>
                        <p>• Incremento del 4% anual por cada año de demora</p>
                        <p>• Opción de cobro en forma de tanto alzado</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          💡 Haga clic en cada tipo para ver información detallada sobre requisitos y características específicas
        </p>
      </div>
    </div>
  )
}
