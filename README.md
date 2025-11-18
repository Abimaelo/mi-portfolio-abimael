# Portfolio Abimael - CMS Integrado con OAuth GitHub

## 📋 Descripción del Proyecto

Este es un portfolio profesional completamente funcional integrado con un sistema CMS (Content Management System) protegido por autenticación OAuth de GitHub. El proyecto permite gestionar todo el contenido del sitio web de manera visual y profesional, sin necesidad de conocimientos técnicos.

## ✨ Características Principales

### 🔐 **Autenticación OAuth GitHub**
- Login seguro con GitHub OAuth 2.0
- Token JWT para sesiones seguras
- Protección completa del panel de administración
- Logout seguro que limpia las sesiones

### 🎨 **Panel de Administración Completo**
- Dashboard con estadísticas del sitio
- Editor visual para todas las secciones
- Gestión de imágenes con drag & drop
- CRUD completo para portfolio y blog
- Vista previa en tiempo real de los cambios

### 📱 **Template Responsive**
- Diseño completamente adaptable
- Compatible con todos los dispositivos
- Optimizado para SEO
- Performance optimizada

### ⚡ **Backend Serverless**
- Netlify Functions para operaciones backend
- Actualización automática del contenido
- Subida de imágenes a GitHub
- Manejo seguro de archivos

## 🚀 Funcionalidades del CMS

### 📊 **Dashboard**
- Estadísticas en tiempo real
- Vista general del contenido
- Navegación intuitiva

### ⚙️ **Configuración del Sitio**
- Título y descripción del sitio
- Información del autor
- Copyright y metadatos SEO

### 🏠 **Gestión de Contenido**
- **Hero Section:** Título, subtítulo, descripción e imagen
- **Sobre Mí:** Biografía, imagen y estadísticas
- **Portfolio:** CRUD completo de proyectos con imágenes
- **Blog:** Gestión de artículos con fechas y contenido
- **Redes Sociales:** Enlaces a todas las redes sociales
- **Contacto:** Información de contacto actualizada

### 📸 **Gestión de Imágenes**
- Subida múltiple con drag & drop
- Organización automática por categorías
- Compresión y optimización
- Galería de imágenes integrada

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** Netlify Functions (Serverless)
- **Autenticación:** GitHub OAuth 2.0
- **Hosting:** Netlify + GitHub Pages
- **APIs:** GitHub REST API
- **Base de Datos:** JSON + GitHub Repository

## 📁 Estructura del Proyecto

```
proyecto-integrado/
├── index.html              # Página principal del template
├── admin.html              # Panel de administración
├── script.js               # JavaScript principal del template
├── admin.js                # JavaScript del panel admin
├── styles.css              # Estilos principales
├── data.json               # Contenido del sitio en JSON
├── package.json            # Dependencias del proyecto
├── netlify.toml            # Configuración de Netlify
├── callback.html           # Página de callback OAuth
├── netlify/functions/      # Funciones serverless
│   ├── update-content.js   # Actualización de contenido
│   ├── upload-image.js     # Subida de imágenes
│   └── exchange-token.js   # Intercambio de tokens OAuth
├── css/                    # Estilos adicionales
├── images/                 # Imágenes del portfolio
│   ├── portfolio/          # Imágenes de proyectos
│   ├── profile/            # Fotos de perfil
│   ├── blog/               # Imágenes del blog
│   └── [otras categorías]  # Más imágenes organizadas
└── [documentación]         # Guías de uso y deployment
```

## 🔧 Configuración Inicial

### 1. **Requisitos Previos**
- Cuenta de GitHub
- Cuenta de Netlify
- Aplicación OAuth de GitHub configurada

### 2. **Instalación**
```bash
# Clonar o descomprimir el proyecto
cd proyecto-integrado

# Instalar dependencias (opcional para Netlify)
npm install
```

### 3. **Configuración OAuth**
- Configurar GitHub OAuth App
- Obtener Client ID y Client Secret
- Configurar variables de entorno en Netlify

### 4. **Deployment**
- Subir a GitHub
- Conectar con Netlify
- Configurar variables de entorno
- ¡Listo para usar!

## 📖 Documentación Adicional

- **[INSTRUCCIONES-OAUTH.md](INSTRUCCIONES-OAUTH.md)** - Configuración OAuth paso a paso
- **[GUIA-DEPLOYMENT.md](GUIA-DEPLOYMENT.md)** - Deployment en Netlify y GitHub Pages
- **[MANUAL-ADMIN.md](MANUAL-ADMIN.md)** - Guía completa del panel de administración
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solución de problemas comunes

## 🎯 Uso del Sistema

### **Para Visitantes:**
1. Acceder al sitio web público
2. Navegar por el portfolio, blog y contacto
3. Contactar mediante formularios (protegidos por Netlify Forms)

### **Para Administradores:**
1. Click en botón "Admin" en la navegación
2. Autenticarse con GitHub OAuth
3. Gestionar todo el contenido desde el panel
4. Los cambios se reflejan automáticamente en el sitio

## 🔒 Seguridad

- **OAuth 2.0** para autenticación segura
- **Tokens JWT** para sesiones
- **Verificación de tokens** en todas las funciones
- **Rate limiting** implementado
- **Input sanitization** en frontend y backend

## 📈 Características Avanzadas

- **Vista previa en tiempo real** de los cambios
- **Backup automático** de versiones
- **Compresión de imágenes** automática
- **SEO optimizado** con metadatos dinámicos
- **Performance optimizada** para carga rápida

## 🆘 Soporte

Para soporte técnico o preguntas:
1. Revisar la documentación en `TROUBLESHOOTING.md`
2. Verificar la configuración OAuth en `INSTRUCCIONES-OAUTH.md`
3. Consultar la guía de deployment en `GUIA-DEPLOYMENT.md`

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**Desarrollado por:** MiniMax Agent  
**Versión:** 1.0.0  
**Última actualización:** 19 de Noviembre, 2025
