'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Download, RefreshCw, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { RespuestaSimulacion, FormularioPension } from '@/types/pension'
import { formatearEuros, formatearPorcentaje, getColorPorcentaje, diasAAanos } from '@/utils/calculations'
import { generarPDFResultados, DatosInforme } from '@/utils/pdf-generator'
import toast from 'react-hot-toast'

interface Props {
  resultado: RespuestaSimulacion
  datosFormulario: FormularioPension
  onNuevaSimulacion: () => void
}

export default function ResultadosSimulacion({ resultado, datosFormulario, onNuevaSimulacion }: Props) {
  const [generandoPDF, setGenerandoPDF] = useState(false)

  const handleDescargarPDF = async () => {
    setGenerandoPDF(true)
    
    try {
      // Usar los datos reales del formulario
      const datosInforme: DatosInforme = {
        simulacion: resultado,
        datosPersonales: {
          fechaNacimiento: datosFormulario.fecha_nacimiento,
          sexo: datosFormulario.sexo,
          tipoJubilacion: datosFormulario.tipo_jubilacion,
          fechaJubilacion: datosFormulario.fecha_jubilacion_deseada
        },
        datosLaborales: {
          diasTotal: datosFormulario.dias_cotizados_total,
          diasUltimos15: datosFormulario.dias_cotizados_ultimos_15,
          baseReguladora: datosFormulario.base_reguladora,
          otrasRentas: datosFormulario.otras_rentas_anuales
        }
      }
      
      generarPDFResultados(datosInforme)
      toast.success('PDF generado correctamente')
      
    } catch (error) {
      toast.error('Error al generar el PDF')
      console.error('Error generando PDF:', error)
    } finally {
      setGenerandoPDF(false)
    }
  }

  const esValido = resultado.validacion.es_valido
  const calculo = resultado.calculo

  return (
    <div className="space-y-6">
      {/* Encabezado de resultados */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`px-6 py-4 ${esValido ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {esValido ? (
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 mr-3" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${esValido ? 'text-green-800' : 'text-red-800'}`}>
                  {esValido ? 'Simulación Válida' : 'Simulación Inválida'}
                </h2>
                <p className={`text-sm ${esValido ? 'text-green-600' : 'text-red-600'}`}>
                  {esValido 
                    ? 'Su solicitud cumple todos los requisitos legales'
                    : 'Su solicitud no cumple los requisitos necesarios'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {esValido && (
                <button
                  onClick={handleDescargarPDF}
                  disabled={generandoPDF}
                  className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {generandoPDF ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={onNuevaSimulacion}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nueva Simulación
              </button>
            </div>
          </div>
        </div>

        {/* Información básica */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Edad de jubilación:</span>
              <span className="ml-2 font-semibold">{resultado.edad_jubilacion_anos.toFixed(1)} años</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Años cotizados:</span>
              <span className="ml-2 font-semibold">{resultado.anos_cotizados.toFixed(1)} años</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Fecha del cálculo:</span>
              <span className="ml-2 font-semibold">{new Date(resultado.fecha_calculo).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Errores de validación */}
      {!esValido && resultado.validacion.errores.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Errores encontrados
          </h3>
          <div className="space-y-3">
            {resultado.validacion.errores.map((error, index) => (
              <div key={index} className="bg-white rounded-md p-4 border border-red-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">{error.codigo}</p>
                    <p className="text-red-700 mt-1">{error.mensaje}</p>
                    {error.regla_aplicada && (
                      <p className="text-sm text-red-600 mt-2 italic">
                        Regla: {error.regla_aplicada}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advertencias */}
      {resultado.validacion.advertencias.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Advertencias
          </h3>
          <div className="space-y-2">
            {resultado.validacion.advertencias.map((advertencia, index) => (
              <div key={index} className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-700">{advertencia}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultado del cálculo */}
      {esValido && calculo && (
        <div className="result-card">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Resultado de la Simulación
            </h3>
            <div className="bg-white rounded-lg shadow-md p-6 inline-block">
              <p className="text-sm text-gray-600 mb-2">Pensión mensual estimada</p>
              <p className="text-4xl font-bold text-green-600">
                {formatearEuros(calculo.pension_final)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Pensión anual: {formatearEuros(calculo.pension_final * 14)}
              </p>
            </div>
          </div>

          {/* Porcentaje total aplicable */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="text-center">
              <h4 className="text-lg font-medium text-blue-800 mb-2">Porcentaje Total Aplicable</h4>
              <p className="text-3xl font-bold text-blue-600">
                {formatearPorcentaje((calculo.porcentaje_anos_cotizados * calculo.porcentaje_anticipacion_demora) / 100)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {formatearPorcentaje(calculo.porcentaje_anos_cotizados)} × {formatearPorcentaje(calculo.porcentaje_anticipacion_demora)} = {formatearPorcentaje((calculo.porcentaje_anos_cotizados * calculo.porcentaje_anticipacion_demora) / 100)}
              </p>
            </div>
          </div>

          {/* Detalles del cálculo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-600">% por años cotizados</h4>
                <TrendingUp className={`w-4 h-4 ${getColorPorcentaje(calculo.porcentaje_anos_cotizados)}`} />
              </div>
              <p className={`text-2xl font-bold ${getColorPorcentaje(calculo.porcentaje_anos_cotizados)}`}>
                {formatearPorcentaje(calculo.porcentaje_anos_cotizados)}
              </p>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-600">% anticipación/demora</h4>
                {calculo.porcentaje_anticipacion_demora < 100 ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className={`text-2xl font-bold ${
                calculo.porcentaje_anticipacion_demora < 100 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatearPorcentaje(calculo.porcentaje_anticipacion_demora)}
              </p>
            </div>

            <div className="metric-card">
              <h4 className="text-sm font-medium text-gray-600">Pensión antes de topes</h4>
              <p className="text-2xl font-bold text-gray-800">
                {formatearEuros(calculo.pension_antes_topes)}
              </p>
            </div>

            <div className="metric-card">
              <h4 className="text-sm font-medium text-gray-600">Pensión mínima</h4>
              <p className="text-lg font-semibold text-gray-600">
                {formatearEuros(calculo.pension_minima_aplicable)}
              </p>
            </div>

            <div className="metric-card">
              <h4 className="text-sm font-medium text-gray-600">Pensión máxima</h4>
              <p className="text-lg font-semibold text-gray-600">
                {formatearEuros(calculo.pension_maxima_aplicable)}
              </p>
            </div>

            {calculo.complemento_minimos > 0 && (
              <div className="metric-card">
                <h4 className="text-sm font-medium text-gray-600">Complemento a mínimos</h4>
                <p className="text-lg font-semibold text-green-600">
                  {formatearEuros(calculo.complemento_minimos)}
                </p>
              </div>
            )}
          </div>

          {/* Datos específicos */}
          {calculo.datos_especificos && Object.keys(calculo.datos_especificos).length > 0 && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Información específica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(calculo.datos_especificos).map(([clave, valor]) => (
                  <div key={clave} className="flex justify-between">
                    <span className="font-medium text-blue-700">
                      {clave === 'tanto_alzado' && 'Tanto alzado (pago único):'}
                      {clave === 'meses_demora' && 'Meses de demora:'}
                      {clave === 'meses_anticipacion' && 'Meses de anticipación:'}
                      {clave === 'opcion_incremento' && 'Opción de incremento:'}
                      {!['tanto_alzado', 'meses_demora', 'meses_anticipacion', 'opcion_incremento'].includes(clave) && `${clave}:`}
                    </span>
                    <span className="font-semibold text-blue-800">
                      {clave === 'tanto_alzado' && typeof valor === 'number' ? formatearEuros(valor) : String(valor)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reglas aplicadas */}
      {resultado.reglas_aplicadas.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            📋 Reglas aplicadas en el cálculo
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {resultado.reglas_aplicadas.map((regla, index) => (
              <div key={index} className="text-sm text-gray-700 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                {regla}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observaciones */}
      {resultado.observaciones.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            💬 Observaciones adicionales
          </h3>
          <div className="space-y-2">
            {resultado.observaciones.map((obs, index) => (
              <div key={index} className="flex items-start">
                <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{obs}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información del sistema */}
      <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
        <p>
          Simulación realizada con el sistema versión {resultado.version_sistema} el{' '}
          {new Date(resultado.fecha_calculo).toLocaleDateString('es-ES')}
        </p>
        <p className="mt-1">
          Este resultado es orientativo y no constituye resolución administrativa oficial
        </p>
      </div>
    </div>
  )
}
