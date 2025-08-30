# 🚀 Guía de Despliegue en Vercel

## 📋 Pasos para Desplegar el Frontend

### 1. **Preparar el Repositorio**

```bash
# En el directorio pension-calculator-frontend
git init
git add .
git commit -m "Initial commit - Frontend Simulador Pensiones"

# Subir a GitHub (recomendado)
# Crear repositorio en GitHub y conectar:
git remote add origin https://github.com/tu-usuario/pension-frontend.git
git branch -M main
git push -u origin main
```

### 2. **Configurar en Vercel**

#### Opción A: Dashboard Web
1. Ir a [vercel.com](https://vercel.com) y hacer login
2. Hacer clic en "New Project"
3. Importar desde GitHub/GitLab/Bitbucket
4. Seleccionar el repositorio `pension-frontend`
5. Configurar:
   - **Framework**: Next.js (detectado automáticamente)
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build` (por defecto)
   - **Output Directory**: `.next` (por defecto)

#### Opción B: Vercel CLI
```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# En el directorio del frontend
vercel

# Seguir las instrucciones:
# - Link to existing project? N
# - Project name: pension-calculator-frontend
# - Directory: ./
# - Settings detected: Yes
```

### 3. **Variables de Entorno**

En el dashboard de Vercel:
1. Ir a Project Settings → Environment Variables
2. Añadir:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://pension-calculator-2729dd945347.herokuapp.com
   Environment: Production, Preview, Development
   ```

### 4. **Configuración Automática**

El archivo `vercel.json` ya está configurado con:
- Headers de seguridad
- Variables de entorno
- Configuración de build optimizada

### 5. **Verificar Despliegue**

1. **URL del proyecto**: `https://tu-proyecto.vercel.app`
2. **Verificar conectividad**: Estado "API conectada" en la página
3. **Probar simulación**: Completar formulario y verificar resultados
4. **Descargar PDF**: Verificar generación de informe

## 🔧 Configuración Avanzada

### Dominio Personalizado

1. En Vercel Dashboard → Domains
2. Añadir dominio personalizado:
   ```
   ejemplo: pensiones.midominio.com
   ```
3. Configurar DNS según instrucciones de Vercel

### Variables de Entorno Avanzadas

```bash
# Para diferentes entornos
NEXT_PUBLIC_API_URL=https://pension-calculator-2729dd945347.herokuapp.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_VERSION=1.0.0
```

### Headers de Seguridad Personalizados

Modificar `vercel.json` si es necesario:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval'"
        }
      ]
    }
  ]
}
```

## 📊 Monitoreo y Analytics

### Vercel Analytics
1. En Dashboard → Analytics
2. Habilitar Web Analytics
3. Ver métricas de rendimiento y uso

### Logs y Debugging
```bash
# Ver logs en tiempo real
vercel logs https://tu-proyecto.vercel.app

# Ver builds
vercel ls
```

## 🔄 Actualizaciones

### Despliegue Automático
- Cada `git push` a la rama main despliega automáticamente
- Preview deployments para otras ramas

### Despliegue Manual
```bash
# Desplegar desde CLI
vercel --prod

# Promover preview a producción
vercel promote https://pension-frontend-abc123.vercel.app
```

## 🛠️ Troubleshooting

### Problemas Comunes

#### Error de Build
```bash
# Verificar localmente
npm run build
npm run start

# Ver logs detallados en Vercel Dashboard
```

#### Error de API Connection
- Verificar que la API de Heroku esté activa
- Comprobar URL en variables de entorno
- Revisar CORS en la API

#### Error de Timeout
- La API tiene timeout de 30 segundos
- Verificar conectividad de red
- Comprobar logs de Heroku

### Comandos de Diagnóstico

```bash
# Test de conectividad local
curl https://pension-calculator-2729dd945347.herokuapp.com/health

# Verificar variables de entorno
vercel env ls

# Verificar configuración del proyecto
vercel inspect
```

## 📈 Optimizaciones de Producción

### Performance
- **Next.js Image Optimization**: Habilitado por defecto
- **Static Generation**: Para páginas estáticas
- **Edge Functions**: Para API routes si es necesario

### SEO
```javascript
// En layout.tsx ya configurado
export const metadata = {
  title: 'Simulador de Pensiones - España',
  description: '...',
  keywords: '...'
}
```

### PWA (Opcional)
```bash
# Instalar next-pwa
npm install next-pwa

# Configurar en next.config.js
const withPWA = require('next-pwa')({
  dest: 'public'
})
```

## 🎯 URLs Finales

Después del despliegue:

- **Frontend**: `https://tu-proyecto.vercel.app`
- **API Backend**: `https://pension-calculator-2729dd945347.herokuapp.com`
- **Documentación API**: `https://pension-calculator-2729dd945347.herokuapp.com/docs`

## 🔐 Seguridad en Producción

### Headers Configurados
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### HTTPS
- Forzado automáticamente por Vercel
- Certificados SSL automáticos

### Rate Limiting
- Manejado por la API de Heroku
- Frontend maneja timeouts y errores

## ✅ Checklist de Despliegue

- [ ] Repositorio subido a Git
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Conexión con API verificada
- [ ] Simulación de prueba realizada
- [ ] PDF generado correctamente
- [ ] Responsive design verificado
- [ ] Performance optimizada

¡Frontend listo en producción! 🎉

### URLs de Ejemplo
- **Demo**: `https://pension-calculator-frontend.vercel.app`
- **Staging**: `https://pension-calculator-frontend-git-develop.vercel.app`
- **API**: `https://pension-calculator-2729dd945347.herokuapp.com`
