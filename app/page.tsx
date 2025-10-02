'use client'

import { useState, useEffect } from 'react'
import { Calculator, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react'
import FormularioPension from '@/components/FormularioPension'
import ResultadosSimulacion from '@/components/ResultadosSimulacion'
import InformacionTipos from '@/components/InformacionTipos'
import { RespuestaSimulacion, FormularioPension as FormularioPensionType } from '@/types/pension'
import { pensionApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [resultado, setResultado] = useState<RespuestaSimulacion | null>(null)
  const [datosFormulario, setDatosFormulario] = useState<FormularioPensionType | null>(null)
  const [loading, setLoading] = useState(false)
  const [mostrarInfo, setMostrarInfo] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  // Verificar estado de la API al cargar
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await pensionApi.healthCheck()
        setApiStatus('online')
      } catch (error) {
        setApiStatus('offline')
        toast.error('No se pudo conectar con la API. Verifique su conexión.')
      }
    }

    checkApiStatus()
  }, [])

  const handleSimulacion = async (resultado: RespuestaSimulacion, datosFormulario: FormularioPensionType) => {
    setResultado(resultado)
    setDatosFormulario(datosFormulario)
    
    // Scroll suave a los resultados
    setTimeout(() => {
      const resultadosElement = document.getElementById('resultados')
      if (resultadosElement) {
        resultadosElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleNuevaSimulacion = () => {
    setResultado(null)
    setDatosFormulario(null)
    // Scroll al inicio del formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simulador de Pensiones de Jubilación
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Calcule su pensión de jubilación según la normativa española del Sistema de Seguridad Social
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Normativa oficial 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Todos los tipos de jubilación</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Informe PDF descargable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de la API */}
      <div className="flex justify-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          apiStatus === 'online' 
            ? 'bg-green-100 text-green-800' 
            : apiStatus === 'offline'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {apiStatus === 'checking' && (
            <>
              <div className="loading-spinner mr-2"></div>
              Verificando conexión...
            </>
          )}
          {apiStatus === 'online' && (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              API conectada y funcionando
            </>
          )}
          {apiStatus === 'offline' && (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Sin conexión con la API
            </>
          )}
        </div>
      </div>

      {/* Botones de información */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setMostrarInfo(!mostrarInfo)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Info className="w-4 h-4 mr-2" />
          {mostrarInfo ? 'Ocultar información' : 'Ver tipos de jubilación'}
        </button>
      </div>

      {/* Información de tipos */}
      {mostrarInfo && (
        <div className="animate-slide-up">
          <InformacionTipos />
        </div>
      )}

      {/* Formulario principal */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Datos para la simulación
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Complete todos los campos para obtener una simulación precisa de su pensión
          </p>
        </div>
        
        <FormularioPension 
          onSimulacion={handleSimulacion}
          loading={loading}
          disabled={apiStatus === 'offline'}
        />
      </div>

      {/* Resultados */}
      {resultado && datosFormulario && (
        <div id="resultados" className="animate-fade-in">
          <ResultadosSimulacion 
            resultado={resultado}
            datosFormulario={datosFormulario}
            onNuevaSimulacion={handleNuevaSimulacion}
          />
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Información importante
            </h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Esta simulación es orientativa y no constituye resolución administrativa oficial</p>
              <p>• Los resultados se basan en la normativa vigente del Sistema de Seguridad Social</p>
              <p>• Para información oficial, consulte con la Seguridad Social o un asesor especializado</p>
              <p>• Los cálculos pueden variar según cambios normativos futuros</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
