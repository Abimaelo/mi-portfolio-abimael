# 🔐 INSTRUCCIONES OAUTH GITHUB - CONFIGURACIÓN PASO A PASO

## 🎯 Objetivo

Configurar la autenticación OAuth de GitHub para el CMS del portfolio. Este sistema permite que los administradores accedan de forma segura usando sus credenciales de GitHub.

## 📋 PASO 1: Crear GitHub OAuth Application

### 1.1 Ir a Configuración de GitHub
1. Acceder a [GitHub](https://github.com)
2. Hacer clic en tu avatar (esquina superior derecha)
3. Seleccionar **"Settings"**
4. En el menú lateral izquierdo, buscar **"Developer settings"**

### 1.2 Crear Nueva OAuth App
1. En **"Developer settings"**, hacer clic en **"OAuth Apps"**
2. Hacer clic en **"New OAuth App"**
3. Completar el formulario:

```
Application name: Portfolio Abimael CMS
Homepage URL: https://tu-sitio.netlify.app
Authorization callback URL: https://tu-sitio.netlify.app/callback
```

⚠️ **IMPORTANTE:** Si planeas usar GitHub Pages en lugar de Netlify, necesitarás modificar la configuración porque el sistema OAuth requiere Netlify Functions para el backend.

⚠️ **IMPORTANTE:** 
- Usar URLs reales de tu deployment
- El callback URL debe terminar exactamente en `/callback`

### 1.3 Obtener Credenciales
Después de crear la aplicación, GitHub proporcionará:
- **Client ID** (público) - Copiar como está
- **Client Secret** (privado - guardarlo seguro) - **Copiar EXACTAMENTE como GitHub lo muestra, sin modificar nada**

⚠️ **IMPORTANTE - Client Secret:**
- **NO** agregar "gho_" ni ningún prefijo
- **NO** modificar caracteres
- **Copiar y pegar exactamente** como GitHub lo presenta
- El formato puede variar (algunos empiezan con letras, otros con números)

## ⚙️ PASO 2: Configurar Variables de Entorno en Netlify

### 2.1 Acceder a Netlify
1. Ir a [Netlify](https://netlify.com)
2. Seleccionar tu sitio del portfolio
3. Ir a **"Site settings" > "Environment variables"**

### 2.2 Agregar Variables
Configurar las siguientes variables de entorno:

```bash
# Variable pública (frontend)
GITHUB_CLIENT_ID=tu_client_id_aqui

# Variables privadas (backend)
GITHUB_CLIENT_SECRET=tu_client_secret_aqui
GITHUB_OWNER=tu_usuario_github
GITHUB_REPO=tu_repositorio_portfolio
GITHUB_BRANCH=main
```

### 2.3 Descripción de Variables

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | ID público de tu OAuth App | `1234567890abcdef` |
| `GITHUB_CLIENT_SECRET` | Secreto privado de tu OAuth App | Copiar exactamente como GitHub lo muestra (puede variar en formato) |
| `GITHUB_OWNER` | Tu nombre de usuario de GitHub | `abimael-ortiz` |
| `GITHUB_REPO` | Nombre del repositorio | `portfolio-abimael` |
| `GITHUB_BRANCH` | Rama donde está el código | `main` |

## 🔧 PASO 3: Configurar el Frontend

### 3.1 Actualizar Client ID en el Código

En el archivo `script.js`, línea donde dice:
```javascript
const clientId = 'YOUR_CLIENT_ID_HERE'; // This should be replaced with actual client ID
```

Reemplazar con tu Client ID real:
```javascript
const clientId = 'tu_client_id_real';
```

### 3.2 Configurar URLs de Callback

Las URLs de callback están configuradas para:
- Development: `http://localhost:8888/callback`
- Production: `https://tu-sitio.netlify.app/callback`

## 🧪 PASO 4: Probar la Configuración

### 4.1 Verificar OAuth Flow
1. Ir a tu sitio web
2. Hacer clic en el botón **"Admin"**
3. Debería aparecer el modal de OAuth
4. Hacer clic en **"Continuar con GitHub"**
5. GitHub debería mostrar la página de autorización
6. Después de autorizar, debería redirigir al panel admin

### 4.2 Verificar Token Storage
En las herramientas de desarrollador del navegador:
1. Ir a **"Application" > "Local Storage"**
2. Debería aparecer una entrada `oauth_token` después del login

### 4.3 Verificar Funciones Netlify
En **"Functions"** de Netlify:
1. Ver que todas las funciones estén deployadas:
   - `update-content`
   - `upload-image`  
   - `exchange-token`
2. Revisar logs de funciones para errores

## 🚨 PASO 5: Solución de Problemas Comunes

### 5.1 Error: "Invalid redirect_uri"
**Causa:** La URL de callback no coincide con GitHub App
**Solución:** 
- Verificar que la callback URL en GitHub App sea exacta
- Incluir protocolo (`https://`)
- Incluir dominio completo

### 5.2 Error: "Unauthorized"
**Causa:** Token no válido o expirado
**Solución:**
- Verificar Client Secret en variables de entorno
- Revisar que el repositorio sea accesible con el token
- Verificar permisos de la OAuth App

### 5.3 Error: "Application not authorized"
**Causa:** Usuario no ha autorizado la aplicación
**Solución:**
- El usuario debe autorizar manualmente en GitHub
- Verificar que el scope sea correcto (`repo`)

### 5.4 Error: "CORS policy"
**Causa:** Headers CORS mal configurados
**Solución:**
- Verificar que las funciones Netlify tengan headers CORS
- Revisar que la URL de origen esté permitida

## 🔒 PASO 6: Configuración de Seguridad

### 6.1 Scopes Recomendados
Configurar en GitHub OAuth App:
- `repo` - Acceso completo a repositorios privados y públicos
- `read:user` - Información de perfil de usuario
- `user:email` - Email del usuario

### 6.2 Rate Limiting
Las funciones Netlify incluyen rate limiting para prevenir abuso.

### 6.3 Token Security
- Los tokens se almacenan en `localStorage` (temporal)
- Los tokens se limpian al hacer logout
- Los tokens se verifican en cada operación

## 📊 PASO 7: Monitoreo y Logs

### 7.1 Netlify Functions Logs
En Netlify Dashboard > Functions > [Function Name]:
- Ver logs de ejecución
- Revisar errores y respuestas
- Monitorear uso de la API

### 7.2 GitHub API Usage
En GitHub > Settings > Developer settings > OAuth Apps:
- Monitorear uso de la API
- Ver tokens activos
- Revisar rate limits

## ✅ Checklist Final

- [ ] OAuth App creada en GitHub
- [ ] Client ID y Client Secret obtenidos
- [ ] Variables de entorno configuradas en Netlify
- [ ] Frontend actualizado con Client ID
- [ ] URLs de callback configuradas correctamente
- [ ] Funciones Netlify deployadas
- [ ] Test de login OAuth funcional
- [ ] Token se almacena correctamente
- [ ] Logout limpia el token
- [ ] Panel admin accesible solo con OAuth

## 🆘 Contacto para Soporte

Si tienes problemas con la configuración OAuth:

1. **Revisar logs** en Netlify Functions
2. **Verificar variables** de entorno
3. **Probar con diferentes usuarios** de GitHub
4. **Revisar permisos** de la OAuth App
5. **Consultar documentación** de GitHub OAuth

---

**Nota:** Esta configuración es crítica para la seguridad del CMS. Asegúrate de mantener las credenciales seguras y actualizar regularmente los tokens.
