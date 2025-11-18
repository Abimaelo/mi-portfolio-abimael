# 🛠️ TROUBLESHOOTING - SOLUCIÓN DE PROBLEMAS COMUNES

## 🎯 Introducción

Esta guía resuelve los problemas más comunes que puedes encontrar al usar el Portfolio Abimael CMS. Si sigues estos pasos y el problema persiste, revisa los logs en Netlify o contacta al desarrollador.

## 🔐 PROBLEMAS DE AUTENTICACIÓN OAUTH

### ❌ Error: "Invalid redirect_uri"

#### Síntomas:
- Modal OAuth no se abre
- GitHub muestra error al hacer clic en "Continuar con GitHub"
- Mensaje: "The redirect_uri does not match"

#### Causa:
La URL de callback configurada en la OAuth App de GitHub no coincide con tu sitio real.

#### Solución:
1. **Ir a GitHub > Settings > Developer settings > OAuth Apps**
2. **Editar tu OAuth App**
3. **Actualizar "Authorization callback URL" a:**
   ```
   https://tu-sitio.netlify.app/callback
   ```
4. **Verificar que sea exactamente igual** (incluyendo https:// y /callback)

#### Verificación:
```bash
# Tu callback URL debe coincidir exactamente con:
https://[tu-usuario].netlify.app/callback

# No debe tener:
# - Espacios extra
# - Subdominios incorrectos
# - Protocolo http (debe ser https)
```

---

### ❌ Error: "Application not authorized"

#### Síntomas:
- GitHub pide autorización pero después redirige a error
- Mensaje: "You have already authorized this application"

#### Causa:
El usuario no ha autorizado la OAuth App o la autorización expiró.

#### Solución:
1. **Ir a GitHub.com**
2. **Settings > Applications > Authorized OAuth Apps**
3. **Buscar tu "Portfolio Abimael CMS"**
4. **Hacer clic en "Revoke"**
5. **Intentar hacer login nuevamente**
6. **Autorizar la aplicación de nuevo**

---

### ❌ Error: "Unauthorized" o Token Expirado

#### Síntomas:
- Panel admin muestra error al cargar
- Formularios no funcionan
- Mensaje: "401 Unauthorized"

#### Causa:
El token OAuth expiró o es inválido.

#### Solución:
1. **Hacer logout del panel admin**
2. **Cerrar todas las pestañas del navegador**
3. **Limpiar localStorage:**
   - Abrir herramientas de desarrollador (F12)
   - Ir a Application > Local Storage
   - Eliminar `oauth_token`
4. **Intentar login nuevamente**

---

## 🌐 PROBLEMAS DE NETWORK Y SERVIDOR

### ❌ Error: "Failed to fetch" o "Network Error"

#### Síntomas:
- Los botones del panel admin no responden
- No se guardan los cambios
- Mensaje de error de red

#### Causa:
Problemas de conectividad o funciones Netlify no disponibles.

#### Solución:
1. **Verificar conexión a internet**
2. **Probar desde otra red/ISP**
3. **Revisar estado de Netlify:**
   - Ir a https://netlifystatus.com
   - Verificar si hay incidentes activos
4. **Revisar Functions en Netlify Dashboard:**
   - Site > Functions > [function-name]
   - Verificar que estén deployadas

---

### ❌ Error: "CORS policy" o "Access to fetch blocked"

#### Síntomas:
- Error en consola del navegador
- Request blocked by CORS policy
- Funciones devuelven error 403

#### Causa:
Headers CORS mal configurados o falta de configuración.

#### Solución:
1. **Verificar netlify.toml:**
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

2. **Redeploy el sitio en Netlify:**
   - Site > Deploys > Trigger deploy > Deploy site

---

## 📸 PROBLEMAS CON IMÁGENES

### ❌ Error: "Upload failed" en subida de imágenes

#### Síntomas:
- Las imágenes no se suben
- Error en la función `upload-image`
- Mensaje de error al arrastrar imágenes

#### Causa:
Problemas con la función serverless o permisos del repositorio.

#### Solución:
1. **Verificar tamaño de imagen:**
   - Máximo 2MB por imagen
   - Usar formatos JPG o PNG

2. **Revisar logs de función:**
   - Netlify > Functions > upload-image > Logs
   - Buscar errores específicos

3. **Verificar permisos de OAuth App:**
   - La OAuth App debe tener scope `repo`
   - El usuario debe tener permisos de escritura en el repositorio

4. **Probar imagen más pequeña:**
   - Reducir resolución o compresión
   - Intentar con formato JPG en lugar de PNG

---

### ❌ Error: "Image not found" o broken images

#### Síntomas:
- Imágenes no se cargan en el sitio
- 404 errors para imágenes
- Placeholder o imagen rota

#### Causa:
Rutas de imágenes incorrectas o imágenes no subidas correctamente.

#### Solución:
1. **Verificar ruta en data.json:**
```json
{
  "hero": {
    "image": "images/profile/about-photo.jpg"
  }
}
```

2. **Verificar que la imagen existe:**
   - Revisar en tu repositorio GitHub
   - Confirmar ruta exacta

3. **Re-subir imagen:**
   - Usar el panel admin para re-subir
   - Verificar categoría correcta

---

## 📝 PROBLEMAS DE CONTENIDO

### ❌ Error: "Changes not saved" o contenido no se actualiza

#### Síntomas:
- Formularios muestran éxito pero cambios no se ven
- El sitio web no refleja modificaciones
- data.json no se actualiza

#### Causa:
Problemas con la función `update-content` o permisos de GitHub.

#### Solución:
1. **Revisar logs de función update-content:**
   - Netlify > Functions > update-content > Logs
   - Buscar errores de GitHub API

2. **Verificar variables de entorno:**
   - GITHUB_OWNER debe ser tu username exacto
   - GITHUB_REPO debe coincidir con el nombre del repositorio
   - GITHUB_BRANCH debe ser la rama correcta (main o master)

3. **Verificar permisos de OAuth:**
   - El usuario debe tener permisos de escritura en el repositorio
   - La OAuth App debe incluir scope `repo`

4. **Probar actualización manual:**
   - Modificar un campo pequeño
   - Guardar y verificar inmediatamente

---

### ❌ Error: "JSON parse error" o contenido corrupto

#### Síntomas:
- El sitio web no carga correctamente
- Errores en consola del navegador
- Contenido no se muestra

#### Causa:
El archivo `data.json` se corrupto o tiene sintaxis inválida.

#### Solución:
1. **Verificar sintaxis JSON:**
   - Usar un validador JSON online
   - Revisar que no falten comas o comillas

2. **Restaurar desde backup:**
   - GitHub > History de data.json
   - Restaurar a versión anterior que funcionaba

3. **Validar estructura completa:**
```json
{
  "site": { ... },
  "hero": { ... },
  "about": { ... },
  "portfolio": [ ... ],
  "blog": [ ... ],
  "social": [ ... ],
  "contact": { ... }
}
```

---

## 🚀 PROBLEMAS DE DEPLOYMENT

### ❌ Error: Functions not found

#### Síntomas:
- Error 404 al acceder a funciones
- Funciones no aparecen en Netlify Dashboard
- "Function not found" en logs

#### Solución:
1. **Verificar estructura de directorios:**
```
proyecto-integrado/
├── netlify/
│   └── functions/
│       ├── update-content.js
│       ├── upload-image.js
│       └── exchange-token.js
```

2. **Verificar netlify.toml:**
```toml
[functions]
  directory = "netlify/functions"
```

3. **Redeploy completo:**
   - Netlify > Site settings > Build & deploy
   - "Trigger deploy" > "Deploy site"

---

### ❌ Error: Environment variables not working

#### Síntomas:
- Funciones devuelven errores de configuración
- Variables aparecen como undefined
- OAuth no funciona

#### Solución:
1. **Verificar nombres exactos en Netlify:**
```bash
GITHUB_CLIENT_ID     ✅ Correcto
github_client_id      ❌ Incorrecto
github-client-id      ❌ Incorrecto
```

2. **Verificar que las variables estén en Production:**
   - Site settings > Environment variables
   - Verificar que estén marcadas para "Production"

3. **Redeploy después de agregar variables:**
   - Las variables nuevas requieren redeploy

---

## 🧪 HERRAMIENTAS DE DIAGNÓSTICO

### 🔍 Verificar Estado de Funciones
```bash
# En Netlify Dashboard:
1. Functions > [function-name]
2. Ver "Function Status"
3. Revisar "Function Logs"
4. Probar "Test function"
```

### 🔍 Verificar OAuth
```javascript
// En consola del navegador:
localStorage.getItem('oauth_token')
// Debe devolver un token si estás logueado

// Para probar OAuth:
fetch('/.netlify/functions/exchange-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'test' })
})
```

### 🔍 Verificar Variables de Entorno
```bash
# En Netlify Functions, las variables están en:
process.env.GITHUB_CLIENT_ID
process.env.GITHUB_CLIENT_SECRET
process.env.GITHUB_OWNER
process.env.GITHUB_REPO
```

---

## 📊 MONITOREO Y LOGS

### 📝 Netlify Functions Logs
Para revisar logs detallados:
1. **Netlify Dashboard > Functions**
2. **Seleccionar función específica**
3. **Click "Logs"**
4. **Revisar errores y requests**

### 📝 GitHub API Logs
Para monitorear actividad de GitHub:
1. **GitHub > Settings > Developer settings**
2. **OAuth Apps > Tu App**
3. **Revisar "Recent activity"**

### 📝 Browser Console
Para errores de frontend:
1. **Abrir sitio en navegador**
2. **F12 > Console**
3. **Revisar errores rojos**
4. **Reproducir problema**

---

## 🆘 CONTACTAR SOPORTE

### 📋 Información a Incluir en Tickets

#### Para Problemas de OAuth:
- URL del sitio web
- Pasos exactos para reproducir
- Screenshots del error
- Usuario de GitHub que está probando

#### Para Problemas de Funciones:
- URL específica que falla
- Log completo de la función
- Variables de entorno (sin secretos)
- Hora aproximada del error

#### Para Problemas de Imágenes:
- Tamaño y formato de imagen
- Error específico en logs
- URL de la imagen que falla
- Método usado para subir

### 📞 Escalación de Problemas
1. **Nivel 1:** Revisar esta guía de troubleshooting
2. **Nivel 2:** Revisar logs de Netlify Functions
3. **Nivel 3:** Verificar configuración OAuth completa
4. **Nivel 4:** Contactar desarrollador con logs detallados

---

## ✅ PREVENCIÓN DE PROBLEMAS

### 🛡️ Mejores Prácticas
1. **Backup Regular:** Exportar contenido regularmente
2. **Testing:** Probar cambios en ambiente de desarrollo
3. **Monitoring:** Revisar logs semanalmente
4. **Updates:** Mantener dependencias actualizadas

### 📅 Mantenimiento Preventivo
- **Mensual:** Revisar logs de Netlify Functions
- **Semanal:** Verificar estado de OAuth y permisos
- **Diario:** Monitorear errores en producción

---

**¡La mayoría de problemas se resuelven verificando la configuración OAuth y las variables de entorno!**
