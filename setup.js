#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE CONFIGURACIÓN AUTOMÁTICA
 * Frontend Simulador de Pensiones
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🏛️  Frontend Simulador de Pensiones - Setup')
console.log('=' .repeat(50))

// Verificar Node.js version
const nodeVersion = process.version
const requiredVersion = 'v18'
console.log(`📋 Node.js version: ${nodeVersion}`)

if (nodeVersion < requiredVersion) {
  console.error(`❌ Se requiere Node.js ${requiredVersion} o superior`)
  process.exit(1)
}

console.log('✅ Node.js version compatible')

// Instalar dependencias
console.log('\n📦 Instalando dependencias...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencias instaladas correctamente')
} catch (error) {
  console.error('❌ Error instalando dependencias:', error.message)
  process.exit(1)
}

// Verificar estructura de archivos
console.log('\n📁 Verificando estructura del proyecto...')
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'components/FormularioPension.tsx',
  'components/ResultadosSimulacion.tsx',
  'components/InformacionTipos.tsx',
  'lib/api.ts',
  'types/pension.ts',
  'utils/calculations.ts',
  'utils/pdf-generator.ts',
  'vercel.json'
]

let missingFiles = []
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    missingFiles.push(file)
  }
})

if (missingFiles.length > 0) {
  console.error('❌ Archivos faltantes:')
  missingFiles.forEach(file => console.error(`   - ${file}`))
  process.exit(1)
}

console.log('✅ Estructura del proyecto verificada')

// Verificar conectividad con la API
console.log('\n🌐 Verificando conectividad con la API...')
const apiUrl = 'https://pension-calculator-2729dd945347.herokuapp.com'

try {
  execSync(`curl -s ${apiUrl}/health`, { stdio: 'pipe' })
  console.log(`✅ API conectada: ${apiUrl}`)
} catch (error) {
  console.warn(`⚠️  No se pudo verificar la API: ${apiUrl}`)
  console.warn('   Esto es normal si la API está dormida en Heroku')
}

// Crear archivo .env.local si no existe
const envPath = '.env.local'
if (!fs.existsSync(envPath)) {
  console.log('\n⚙️  Creando archivo de configuración local...')
  const envContent = `# Configuración local del Frontend
NEXT_PUBLIC_API_URL=https://pension-calculator-2729dd945347.herokuapp.com

# Para desarrollo con API local (descomenta la línea siguiente)
# NEXT_PUBLIC_API_URL=http://localhost:8000
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado')
}

// Test de build
console.log('\n🔨 Probando build del proyecto...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build exitoso')
} catch (error) {
  console.error('❌ Error en build:', error.message)
  console.error('   Revise los archivos TypeScript y dependencias')
  process.exit(1)
}

// Información final
console.log('\n' + '🎉'.repeat(20))
console.log('✅ CONFIGURACIÓN COMPLETADA')
console.log('🎉'.repeat(20))

console.log('\n📋 PRÓXIMOS PASOS:')
console.log('\n1. 🚀 DESARROLLO LOCAL:')
console.log('   npm run dev')
console.log('   → http://localhost:3000')

console.log('\n2. 🌐 DESPLIEGUE EN VERCEL:')
console.log('   • Subir a GitHub/GitLab')
console.log('   • Conectar con Vercel')
console.log('   • Configurar variables de entorno')
console.log('   • ¡Deploy automático!')

console.log('\n3. 📖 DOCUMENTACIÓN:')
console.log('   • README.md - Información general')
console.log('   • DEPLOYMENT_VERCEL.md - Guía de despliegue')

console.log('\n4. 🔗 ENLACES:')
console.log(`   • API: ${apiUrl}`)
console.log(`   • Swagger: ${apiUrl}/docs`)
console.log('   • Frontend: https://tu-proyecto.vercel.app')

console.log('\n💡 COMANDOS ÚTILES:')
console.log('   npm run dev      # Desarrollo')
console.log('   npm run build    # Build producción')
console.log('   npm run start    # Servidor producción')
console.log('   npm run lint     # Linting')

console.log('\n🆘 SOPORTE:')
console.log('   • Revisar logs con: npm run dev')
console.log('   • Verificar API: curl ' + apiUrl + '/health')
console.log('   • Documentación en README.md')

console.log('\n¡Frontend listo para usar! 🎯')
