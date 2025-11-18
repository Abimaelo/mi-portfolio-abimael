# 🚀 GUÍA DE DEPLOYMENT - NETLIFY Y GITHUB PAGES

## 🎯 Objetivo

Esta guía te ayudará a desplegar el Portfolio Abimael CMS en **Netlify** (recomendado) o **GitHub Pages**, incluyendo la configuración completa de OAuth y las funciones serverless.

## 📋 OPCIÓN A: DEPLOYMENT EN NETLIFY (RECOMENDADO)

### ✅ Ventajas de Netlify:
- Funciones serverless incluidas
- SSL automático
- Deploy automático desde GitHub
- Netlify Forms integrado
- Variables de entorno fáciles
- CDN global

### 🚀 PASO 1: Preparar el Repositorio

#### 1.1 Crear Repositorio en GitHub
```bash
# Opción 1: Desde la interfaz web de GitHub
# 1. Ir a github.com
# 2. New repository
# 3. Nombre: "portfolio-abimael"
# 4. Public (o Private si prefieres)
# 5. Initialize with README: No (ya tienes archivos)
```

#### 1.2 Subir Archivos
```bash
# Opción 2: Desde línea de comandos
git init
git add .
git commit -m "Initial commit: Portfolio CMS"
git remote add origin https://github.com/TU-USUARIO/portfolio-abimael.git
git branch -M main
git push -u origin main
```

### 🌐 PASO 2: Conectar con Netlify

#### 2.1 Importar Repositorio
1. Ir a [netlify.com](https://netlify.com)
2. Click **"Add new site" > "Import from Git"**
3. Seleccionar **"GitHub"**
4. Autorizar Netlify a acceder a GitHub (si no está autorizado)
5. Seleccionar tu repositorio `portfolio-abimael`

#### 2.2 Configurar Build
En la configuración de build:
```
Build command: (dejar vacío para sitio estático)
Publish directory: /
Node version: 16.x o superior
```

#### 2.3 Deploy Inicial
1. Click **"Deploy site"**
2. Netlify construirá y desplegará automáticamente
3. ✅ **Éxito:** Obtendrás una URL como `https://amazing-name-123456.netlify.app`

### ⚙️ PASO 3: Configurar Variables de Entorno

#### 3.1 Acceder a Variables
1. En Netlify Dashboard > **"Site settings"**
2. **"Environment variables"**
3. Click **"Add a variable"**

#### 3.2 Agregar Variables OAuth
```bash
# Variables Públicas
GITHUB_CLIENT_ID=tu_client_id_real

# Variables Privadas (secretas)
GITHUB_CLIENT_SECRET=tu_client_secret_real
GITHUB_OWNER=tu_usuario_github
GITHUB_REPO=portfolio-abimael
GITHUB_BRANCH=main
```

#### 3.3 Agregar Variables para Funciones
```bash
# Si usas funciones adicionales
NODE_VERSION=16
NPM_FLAGS=--production=false
```

### 📡 PASO 4: Verificar Funciones Netlify

#### 4.1 Revisar Deploy de Funciones
1. **"Functions"** en el sidebar de Netlify
2. Verificar que aparezcan:
   - `update-content`
   - `upload-image`
   - `exchange-token`

#### 4.2 Probar Funciones
Probar cada función desde el dashboard de Netlify para asegurar que se deployaron correctamente.

### 🔧 PASO 5: Configuración Final Netlify

#### 5.1 Configurar Dominio Personalizado (Opcional)
1. **"Domain settings"** en Netlify
2. **"Add custom domain"**
3. Seguir instrucciones para configurar DNS

#### 5.2 Configurar Redirects (ya incluido en netlify.toml)
El archivo `netlify.toml` incluye redirects para:
- OAuth callback
- Admin panel access

#### 5.3 Habilitar Netlify Forms (ya configurado)
El formulario de contacto ya está configurado con `data-netlify="true"`

---

## 📋 OPCIÓN B: DEPLOYMENT EN GITHUB PAGES

### ⚠️ Limitaciones de GitHub Pages:
- ❌ Sin funciones serverless
- ❌ Sin OAuth backend real
- ⚠️ Solo frontend estático
- ⚠️ Limitado para CMS completo

### 🚀 PASO 1: Activar GitHub Pages

#### 1.1 Configurar en Repositorio
1. Ir a tu repositorio en GitHub
2. **"Settings" > "Pages"**
3. **Source:** Deploy from a branch
4. **Branch:** main / root folder
5. **Folder:** / (root)

#### 1.2 Verificar Deploy
- GitHub creará tu sitio en: `https://tu-usuario.github.io/portfolio-abimael`
- Puede tardar 5-10 minutos en estar disponible

### ⚙️ PASO 2: Configuración OAuth Alternativa

Como GitHub Pages no soporta Netlify Functions, necesitas una solución alternativa para OAuth:

#### 2.1 Usar Netlify para OAuth + GitHub Pages para Frontend
```bash
# Configurar dos deploys:
# 1. Netlify: Solo para funciones OAuth
# 2. GitHub Pages: Para el sitio frontend
```

#### 2.2 Variables de Entorno en GitHub Pages
Las variables deben estar en el código fuente:
```javascript
// En script.js - NO recomendado para producción
const CLIENT_ID = 'tu_client_id_publico';
```

---

## 🔧 CONFIGURACIÓN ESPECÍFICA OAUTH

### 🌐 Para Netlify (Completo)
```bash
# Frontend (script.js)
const clientId = 'GITHUB_CLIENT_ID'; // Variable de entorno

# Backend (Netlify Functions)
# Todas las variables secretas están protegidas
```

### 📄 Para GitHub Pages (Limitado)
```javascript
// En script.js - Solo para demo/testing
const CLIENT_ID = 'tu_client_id_publico';

// Nota: Sin backend real, OAuth será limitado
```

---

## 🧪 PRUEBAS DE DEPLOYMENT

### ✅ Checklist Pre-Deployment
- [ ] Todos los archivos subidos al repositorio
- [ ] Variables de entorno configuradas
- [ ] Funciones Netlify deployadas
- [ ] OAuth App configurada en GitHub
- [ ] URLs de callback actualizadas

### 🧪 Tests Post-Deployment
```bash
# 1. Test básico del sitio
curl https://tu-sitio.netlify.app
# Debería retornar 200 OK

# 2. Test OAuth
# - Ir al sitio
# - Click "Admin"
# - Debería aparecer modal OAuth

# 3. Test Netlify Functions
# - Probar desde panel admin
# - Verificar logs en Netlify

# 4. Test formularios
# - Enviar mensaje desde contacto
# - Ver en Netlify Forms dashboard
```

### 🚨 Troubleshooting Común

#### Error 404 en Funciones
**Causa:** Funciones no deployadas correctamente
**Solución:**
```bash
# Verificar en netlify.toml:
[functions]
  directory = "netlify/functions"

# Redeploy desde Netlify
```

#### Error OAuth "Invalid redirect_uri"
**Causa:** URL de callback incorrecta
**Solución:**
```bash
# Actualizar en GitHub OAuth App:
Authorization callback URL: https://tu-sitio.netlify.app/callback
```

#### Variables de Entorno No Funcionan
**Causa:** Variables no configuradas o mal nombradas
**Solución:**
```bash
# Verificar nombres exactos en Netlify:
GITHUB_CLIENT_ID     ✅ Correcto
github_client_id      ❌ Incorrecto
```

---

## 📊 MONITOREO Y MANTENIMIENTO

### 📈 Analytics en Netlify
1. **"Analytics"** en Netlify Dashboard
2. Ver estadísticas de uso
3. Monitorear performance

### 📝 Logs y Debugging
1. **"Functions"** > [Function Name] > **"Logs"**
2. Revisar errores en tiempo real
3. Ver requests y responses

### 🔄 Updates y Deployment
```bash
# Para actualizar el sitio:
git add .
git commit -m "Update content"
git push origin main

# Netlify redeployará automáticamente
```

---

## 🎯 COMPARACIÓN FINAL

| Característica | Netlify | GitHub Pages |
|---------------|---------|--------------|
| **OAuth Completo** | ✅ Sí | ❌ No |
| **Serverless Functions** | ✅ Sí | ❌ No |
| **SSL Automático** | ✅ Sí | ✅ Sí |
| **Deploy Automático** | ✅ Sí | ✅ Sí |
| **Variables de Entorno** | ✅ Sí | ❌ No |
| **Forms Integrados** | ✅ Sí | ❌ No |
| **Performance** | ✅ Excelente | ✅ Buena |
| **Costo** | ✅ Gratis | ✅ Gratis |

---

## ✅ RECOMENDACIÓN FINAL

**Para este proyecto, se recomienda NETLIFY** porque:

1. ✅ Soporte completo para OAuth
2. ✅ Funciones serverless necesarias
3. ✅ Variables de entorno seguras
4. ✅ Deploy automático desde GitHub
5. ✅ Integración perfecta con Netlify Forms
6. ✅ Performance optimizada

---

**¡Tu Portfolio CMS estará funcionando en menos de 30 minutos!**
