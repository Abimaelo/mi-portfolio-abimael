# 🎨 PORTFOLIO ABIMAEL - SISTEMA OAUTH

## 📁 ARCHIVOS INCLUIDOS (Solo lo Esencial)

### Páginas Principales
- `index.html` - Página principal (template específico con dos columnas)
- `about.html` - Sobre mí
- `portfolio.html` - Portfolio  
- `blog.html` - Blog
- `contact.html` - Contacto

### Sistema OAuth
- `admin.html` - Panel de administración
- `callback.html` - Procesamiento OAuth
- `admin.js` - Lógica del admin panel
- `script.js` - Sistema OAuth (GitHub)

### Configuración
- `netlify.toml` - Configuración Netlify
- `package.json` - Dependencias
- `netlify/functions/` - 3 funciones para OAuth backend

### Estilos y JavaScript
- `css/styles.css` - Estilos principales (template completo)
- `main.js` - JavaScript del template original

### Imágenes Esenciales
- `images/hero-main.jpg` - Imagen principal
- `images/profile/about-photo.jpg` - Foto de perfil  
- `images/favicon.svg` - Favicon

## 🚀 INSTRUCCIONES RÁPIDAS

### 1. Deployment en Netlify
1. Arrastrar carpeta `portfolio-limpio/` a Netlify
2. ✅ Obtendrás URL como `https://tu-sitio.netlify.app`

### 2. Configurar OAuth GitHub
1. **GitHub**: Settings > Developer settings > OAuth Apps > New OAuth App
2. **Configuración**:
   ```
   Application name: Portfolio Abimael CMS
   Homepage URL: https://tu-sitio.netlify.app
   Authorization callback URL: https://tu-sitio.netlify.app/callback
   ```
3. **Copiar Client ID y Client Secret**

### 3. Variables de Entorno en Netlify
Ir a Site Settings > Environment Variables:
```bash
GITHUB_CLIENT_ID=tu_client_id_aqui
GITHUB_CLIENT_SECRET=tu_client_secret_exacto
GITHUB_OWNER=tu_usuario_github
GITHUB_REPO=tu_repositorio
GITHUB_BRANCH=main
```

### 4. Configurar Frontend
En `script.js`, línea 99, cambiar:
```javascript
const clientId = 'YOUR_CLIENT_ID_HERE'; 
// Por:
const clientId = 'tu_client_id_real';
```

### 5. Actualizar Content (Opcional)
- Editar directamente los archivos HTML para cambios
- O usar el panel admin OAuth para cambios dinámicos

## ✅ VERIFICACIÓN

1. **Sitio carga**: `https://tu-sitio.netlify.app`
2. **Botón Admin**: Aparece en esquina inferior derecha
3. **OAuth funciona**: Clic en Admin → Modal OAuth → GitHub
4. **Admin panel**: Acceso después de OAuth exitoso

## 📋 DIFERENCIAS CON VERSIÓN ANTERIOR

### ❌ ELIMINADO (Archivos Innecesarios):
- Archivos `-dynamic.html` (no se usan)
- `data-*.json` (template estático)
- `dynamic-styles.css`
- `content-generator.js`
- Imágenes de portfolio (80+ archivos)
- Documentación extensa

### ✅ CONSERVADO (Solo Esencial):
- Template original con diseño específico
- Sistema OAuth completo
- Funcionalidad admin
- Todas las páginas necesarias
- Netlify Functions operativas

**Resultado**: Portfolio funcional con **~15-20 archivos** en lugar de 95+ archivos.