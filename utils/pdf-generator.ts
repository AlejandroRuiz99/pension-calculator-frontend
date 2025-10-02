import jsPDF from 'jspdf'
import { RespuestaSimulacion } from '@/types/pension'
import { formatearEuros, formatearPorcentaje } from './calculations'

export interface DatosInforme {
  simulacion: RespuestaSimulacion
  datosPersonales: {
    fechaNacimiento: string
    sexo: string
    tipoJubilacion: string
    fechaJubilacion: string
  }
  datosLaborales: {
    diasTotal: number
    diasUltimos15: number
    baseReguladora: number
    otrasRentas: number
  }
}

export const generarPDFResultados = (datos: DatosInforme): void => {
  const doc = new jsPDF()
  const { simulacion, datosPersonales, datosLaborales } = datos
  
  // Configuración
  const margenIzquierdo = 20
  const margenSuperior = 20
  let yPos = margenSuperior
  
  // Función auxiliar para añadir texto
  const addText = (text: string, x: number = margenIzquierdo, fontSize: number = 12, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    doc.text(text, x, yPos)
    yPos += fontSize * 0.5 + 2
  }
  
  // Función auxiliar para añadir línea
  const addLine = () => {
    yPos += 5
    doc.line(margenIzquierdo, yPos, 190, yPos)
    yPos += 10
  }
  
  // Función auxiliar para nueva página
  const checkNewPage = (spaceNeeded: number = 20) => {
    if (yPos + spaceNeeded > 280) {
      doc.addPage()
      yPos = margenSuperior
    }
  }
  
  // CABECERA
  doc.setFillColor(59, 130, 246) // Azul
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('SIMULACIÓN DE PENSIÓN DE JUBILACIÓN', margenIzquierdo, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('España - Sistema de Seguridad Social', margenIzquierdo, 35)
  
  // Fecha del informe
  doc.setTextColor(0, 0, 0)
  yPos = 60
  addText(`Fecha del informe: ${new Date().toLocaleDateString('es-ES')}`, 140, 10)
  addText(`Versión del sistema: ${simulacion.version_sistema}`, 140, 10)
  
  yPos = 80
  
  // DATOS PERSONALES
  addText('DATOS PERSONALES', margenIzquierdo, 14, 'bold')
  addLine()
  
  addText(`Fecha de nacimiento: ${new Date(datosPersonales.fechaNacimiento).toLocaleDateString('es-ES')}`)
  addText(`Sexo: ${datosPersonales.sexo === 'M' ? 'Masculino' : 'Femenino'}`)
  addText(`Edad actual: ${simulacion.edad_jubilacion_anos.toFixed(1)} años`)
  addText(`Fecha de jubilación deseada: ${new Date(datosPersonales.fechaJubilacion).toLocaleDateString('es-ES')}`)
  addText(`Tipo de jubilación: ${obtenerNombreTipoJubilacion(datosPersonales.tipoJubilacion)}`)
  
  yPos += 10
  
  // DATOS LABORALES
  checkNewPage(60)
  addText('DATOS LABORALES', margenIzquierdo, 14, 'bold')
  addLine()
  
  addText(`Días cotizados (total): ${datosLaborales.diasTotal} días (${(datosLaborales.diasTotal / 365).toFixed(1)} años)`)
  addText(`Días cotizados (últimos 15 años): ${datosLaborales.diasUltimos15} días (${(datosLaborales.diasUltimos15 / 365).toFixed(1)} años)`)
  addText(`Base reguladora: ${formatearEuros(datosLaborales.baseReguladora)}`)
  if (datosLaborales.otrasRentas > 0) {
    addText(`Otras rentas anuales: ${formatearEuros(datosLaborales.otrasRentas)}`)
  }
  
  yPos += 10
  
  // RESULTADO DE LA VALIDACIÓN
  checkNewPage(60)
  addText('RESULTADO DE LA VALIDACIÓN', margenIzquierdo, 14, 'bold')
  addLine()
  
  if (simulacion.validacion.es_valido) {
    doc.setTextColor(34, 197, 94) // Verde
    addText('✓ SOLICITUD VÁLIDA - Cumple todos los requisitos', margenIzquierdo, 12, 'bold')
  } else {
    doc.setTextColor(239, 68, 68) // Rojo
    addText('✗ SOLICITUD INVÁLIDA - No cumple los requisitos', margenIzquierdo, 12, 'bold')
  }
  
  doc.setTextColor(0, 0, 0)
  
  // Errores si los hay
  if (simulacion.validacion.errores.length > 0) {
    yPos += 5
    addText('Errores encontrados:', margenIzquierdo, 12, 'bold')
    simulacion.validacion.errores.forEach(error => {
      addText(`• ${error.mensaje}`, margenIzquierdo + 10, 10)
    })
  }
  
  // CÁLCULO DE LA PENSIÓN
  if (simulacion.validacion.es_valido && simulacion.calculo) {
    yPos += 10
    checkNewPage(80)
    
    addText('CÁLCULO DE LA PENSIÓN', margenIzquierdo, 14, 'bold')
    addLine()
    
    const calculo = simulacion.calculo
    
    // Resultado principal
    doc.setFillColor(240, 253, 244) // Verde claro
    doc.rect(margenIzquierdo - 5, yPos - 5, 170, 25, 'F')
    
    doc.setTextColor(34, 197, 94)
    addText(`PENSIÓN MENSUAL: ${formatearEuros(calculo.pension_final)}`, margenIzquierdo, 16, 'bold')
    doc.setTextColor(0, 0, 0)
    
    yPos += 10
    
    // Detalles del cálculo
    addText('Detalles del cálculo:', margenIzquierdo, 12, 'bold')
    yPos += 5
    
    // Porcentaje total aplicable
    const porcentajeTotal = (calculo.porcentaje_anos_cotizados * calculo.porcentaje_anticipacion_demora) / 100
    addText(`• PORCENTAJE TOTAL APLICABLE: ${formatearPorcentaje(porcentajeTotal)}`, margenIzquierdo, 12, 'bold')
    addText(`  (${formatearPorcentaje(calculo.porcentaje_anos_cotizados)} × ${formatearPorcentaje(calculo.porcentaje_anticipacion_demora)})`, margenIzquierdo + 5, 10)
    yPos += 3
    
    addText(`• Porcentaje por años cotizados: ${formatearPorcentaje(calculo.porcentaje_anos_cotizados)}`)
    addText(`• Porcentaje por anticipación/demora: ${formatearPorcentaje(calculo.porcentaje_anticipacion_demora)}`)
    addText(`• Pensión antes de topes: ${formatearEuros(calculo.pension_antes_topes)}`)
    addText(`• Pensión mínima aplicable: ${formatearEuros(calculo.pension_minima_aplicable)}`)
    addText(`• Pensión máxima aplicable: ${formatearEuros(calculo.pension_maxima_aplicable)}`)
    
    if (calculo.complemento_minimos > 0) {
      addText(`• Complemento a mínimos: ${formatearEuros(calculo.complemento_minimos)}`)
    }
    
    // Datos específicos
    if (calculo.datos_especificos) {
      yPos += 10
      checkNewPage(40)
      addText('Información específica:', margenIzquierdo, 12, 'bold')
      
      Object.entries(calculo.datos_especificos).forEach(([clave, valor]) => {
        if (clave === 'tanto_alzado' && valor > 0) {
          addText(`• Tanto alzado (pago único): ${formatearEuros(valor as number)}`, margenIzquierdo + 5)
        } else if (clave === 'meses_demora') {
          addText(`• Meses de demora: ${valor}`, margenIzquierdo + 5)
        } else if (clave === 'meses_anticipacion') {
          addText(`• Meses de anticipación: ${valor}`, margenIzquierdo + 5)
        }
      })
    }
  }
  
  // REGLAS APLICADAS
  if (simulacion.reglas_aplicadas.length > 0) {
    yPos += 15
    checkNewPage(60)
    
    addText('REGLAS APLICADAS', margenIzquierdo, 14, 'bold')
    addLine()
    
    simulacion.reglas_aplicadas.forEach(regla => {
      checkNewPage(15)
      addText(`• ${regla}`, margenIzquierdo, 9)
    })
  }
  
  // OBSERVACIONES
  if (simulacion.observaciones.length > 0) {
    yPos += 15
    checkNewPage(40)
    
    addText('OBSERVACIONES', margenIzquierdo, 14, 'bold')
    addLine()
    
    simulacion.observaciones.forEach(obs => {
      checkNewPage(15)
      addText(`• ${obs}`, margenIzquierdo, 10)
    })
  }
  
  // PIE DE PÁGINA
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Simulador de Pensiones - España', margenIzquierdo, 290)
    doc.text(`Página ${i} de ${totalPages}`, 180, 290)
    doc.text('Este informe es orientativo y no constituye resolución administrativa', margenIzquierdo, 285)
  }
  
  // Generar nombre del archivo
  const fechaActual = new Date().toISOString().split('T')[0]
  const tipoJub = datosPersonales.tipoJubilacion.replace('_', '-')
  const nombreArchivo = `simulacion-pension-${tipoJub}-${fechaActual}.pdf`
  
  // Descargar
  doc.save(nombreArchivo)
}

// Función auxiliar para obtener nombre legible del tipo de jubilación
const obtenerNombreTipoJubilacion = (tipo: string): string => {
  const nombres: Record<string, string> = {
    'ordinaria': 'Jubilación Ordinaria',
    'anticipada_voluntaria': 'Jubilación Anticipada Voluntaria',
    'anticipada_involuntaria': 'Jubilación Anticipada Involuntaria',
    'parcial': 'Jubilación Parcial',
    'demorada': 'Jubilación Demorada'
  }
  
  return nombres[tipo] || tipo
}
