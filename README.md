# 🏛️ Frontend Simulador de Pensiones - España

Frontend moderno y responsive para el Simulador de Pensiones de Jubilación del Sistema de Seguridad Social español.

## 🚀 Características

### ✨ **Interfaz de Usuario**
- **Diseño moderno** con Tailwind CSS
- **Totalmente responsive** (móvil, tablet, desktop)
- **Interfaz intuitiva** y fácil de usar
- **Animaciones suaves** con Framer Motion
- **Feedback visual** con toast notifications

### 📊 **Funcionalidades**
- **Todos los tipos de jubilación**:
  - Ordinaria
  - Anticipada Voluntaria
  - Anticipada Involuntaria
  - Parcial (con/sin contrato de relevo)
  - Demorada (con opciones de incremento)
  
- **Validación en tiempo real** de formularios
- **Simulación completa** con la API de Heroku
- **Resultados detallados** con métricas visuales
- **Generación de PDF** con informe completo
- **Información contextual** sobre requisitos

### 🔧 **Tecnologías**
- **Next.js 14** con App Router
- **TypeScript** para tipado fuerte
- **Tailwind CSS** para estilos
- **React Hook Form** + Zod para formularios
- **Axios** para llamadas a la API
- **jsPDF** para generación de informes
- **Lucide React** para iconos

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Configuración Local

```bash
# 1. Navegar al directorio del frontend
cd front

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
# Copiar .env.example a .env.local si es necesario

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción  
npm run build        # Build para producción
npm run start        # Servidor de producción

# Calidad de código
npm run lint         # Linting con ESLint
```

## 🌐 Despliegue en Vercel

### Opción 1: Despliegue Automático

1. **Subir a GitHub**:
   ```bash
   git add .
   git commit -m "Frontend ready for deployment"
   git push origin main
   ```

2. **Conectar con Vercel**:
   - Ir a [vercel.com](https://vercel.com)
   - "New Project" → Importar desde Git
   - Seleccionar el repositorio
   - **IMPORTANTE**: Configurar el directorio raíz como `front/`

3. **Configurar**:
   - Framework: Next.js (detectado automáticamente)
   - Root Directory: `front`
   - Variables de entorno: Se configuran automáticamente

4. **Deploy** → ¡Listo!

### Variables de Entorno en Vercel

```bash
NEXT_PUBLIC_API_URL=https://pension-calculator-2729dd945347.herokuapp.com
```

## 📱 Uso de la Aplicación

### 1. **Datos Personales**
- Fecha de nacimiento
- Sexo
- Cálculo automático de edad

### 2. **Datos Laborales**
- Años cotizados total
- Años cotizados en últimos 15
- Base reguladora mensual
- Otras rentas anuales

### 3. **Tipo de Jubilación**
- Selección del tipo deseado
- Campos específicos según tipo
- Validación de requisitos

### 4. **Resultados**
- Pensión mensual calculada
- Detalles del cálculo
- Reglas aplicadas
- Descarga de informe PDF

## 🔌 Integración con API

La aplicación consume la API desplegada en Heroku:
- **URL Base**: `https://pension-calculator-2729dd945347.herokuapp.com`
- **Health Check**: Verificación automática de conectividad
- **Manejo de errores**: Feedback claro al usuario
- **Timeout**: 30 segundos para evitar bloqueos

## 📄 Generación de PDFs

### Características del Informe
- **Datos completos** del solicitante
- **Resultado de validación** con errores detallados
- **Cálculo completo** con todos los pasos
- **Reglas aplicadas** y observaciones
- **Formato profesional** con logo y pie de página
- **Descarga automática** con nombre descriptivo

## 🚀 Estructura del Proyecto

```
front/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── FormularioPension.tsx     # Formulario principal
│   ├── ResultadosSimulacion.tsx  # Resultados detallados
│   └── InformacionTipos.tsx      # Info tipos de jubilación
├── lib/                   # Configuración y utilidades
│   └── api.ts            # Cliente API
├── types/                 # Definiciones TypeScript
│   └── pension.ts        # Tipos de datos
├── utils/                 # Utilidades
│   ├── calculations.ts   # Cálculos y conversiones
│   └── pdf-generator.ts  # Generación de PDFs
├── public/               # Assets estáticos
│   └── favicon.ico       # Favicon
└── ...archivos de config
```

## 🎯 Próximos Pasos

1. **Instalar dependencias**: `npm install`
2. **Ejecutar en desarrollo**: `npm run dev`
3. **Probar la aplicación**: Abrir http://localhost:3000
4. **Desplegar en Vercel**: Seguir guía en DEPLOYMENT_VERCEL.md

¡Frontend listo para producción! 🎉
