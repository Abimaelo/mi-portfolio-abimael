// Admin Panel JavaScript
let siteData = {};
let oauthToken = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check OAuth authentication
    oauthToken = localStorage.getItem('oauth_token');
    if (!oauthToken) {
        window.location.href = 'index.html';
        return;
    }

    // Load site data
    loadSiteData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load content into forms
    loadContentIntoForms();
});

// Load site data from JSON
async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
        updateDashboardStats();
    } catch (error) {
        console.error('Error loading site data:', error);
        showMessage('Error cargando datos del sitio', 'error');
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav
            document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submissions
    document.getElementById('siteConfigForm').addEventListener('submit', handleSiteConfigSubmit);
    document.getElementById('heroForm').addEventListener('submit', handleHeroSubmit);
    document.getElementById('aboutForm').addEventListener('submit', handleAboutSubmit);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Image upload
    document.getElementById('imageUploadArea').addEventListener('click', () => {
        document.getElementById('imageFileInput').click();
    });

    document.getElementById('imageFileInput').addEventListener('change', handleImageUpload);
    document.getElementById('imageUploadArea').addEventListener('dragover', handleDragOver);
    document.getElementById('imageUploadArea').addEventListener('drop', handleImageDrop);
}

// Show specific admin section
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    // Load section-specific content
    switch(sectionName) {
        case 'portfolio':
            loadPortfolioItems();
            break;
        case 'blog':
            loadBlogPosts();
            break;
        case 'social':
            loadSocialLinks();
            break;
        case 'images':
            loadImageGrid();
            break;
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('statProjects').textContent = siteData.portfolio ? siteData.portfolio.length : 0;
    document.getElementById('statBlogPosts').textContent = siteData.blog ? siteData.blog.length : 0;
    document.getElementById('statSocialLinks').textContent = siteData.social ? siteData.social.length : 0;
    // Image count would need to be calculated from actual images
    document.getElementById('statImages').textContent = 'N/A';
}

// Load content into forms
function loadContentIntoForms() {
    // Site config
    if (siteData.site) {
        document.getElementById('siteTitle').value = siteData.site.title || '';
        document.getElementById('siteAuthor').value = siteData.site.author || '';
        document.getElementById('siteDescription').value = siteData.site.description || '';
        document.getElementById('siteCopyright').value = siteData.site.copyright || '';
    }

    // Hero
    if (siteData.hero) {
        document.getElementById('heroTitle').value = siteData.hero.title || '';
        document.getElementById('heroName').value = siteData.hero.name || '';
        document.getElementById('heroSubtitle').value = siteData.hero.subtitle || '';
        document.getElementById('heroDescription').value = siteData.hero.description || '';
        document.getElementById('heroImage').value = siteData.hero.image || '';
    }

    // About
    if (siteData.about) {
        document.getElementById('aboutDescription').value = siteData.about.description || '';
        document.getElementById('aboutImage').value = siteData.about.image || '';
        if (siteData.about.stats) {
            document.getElementById('aboutStatProjects').value = siteData.about.stats.projects || '';
            document.getElementById('aboutStatExhibitions').value = siteData.about.stats.exhibitions || '';
            document.getElementById('aboutStatYears').value = siteData.about.stats.years || '';
        }
    }

    // Contact
    if (siteData.contact) {
        document.getElementById('contactEmail').value = siteData.contact.email || '';
        document.getElementById('contactPhone').value = siteData.contact.phone || '';
        document.getElementById('contactLocation').value = siteData.contact.location || '';
    }
}

// Form handlers
async function handleSiteConfigSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        copyright: formData.get('copyright')
    };

    const success = await updateSiteContent('site', data);
    if (success) {
        showMessage('Configuración del sitio guardada exitosamente', 'success');
        loadSiteData(); // Reload data
    }
}

async function handleHeroSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        name: formData.get('name'),
        subtitle: formData.get('subtitle'),
        description: formData.get('description'),
        image: formData.get('image')
    };

    const success = await updateSiteContent('hero', data);
    if (success) {
        showMessage('Hero section guardada exitosamente', 'success');
        loadSiteData();
    }
}

async function handleAboutSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        description: formData.get('description'),
        image: formData.get('image'),
        stats: {
            projects: formData.get('projects'),
            exhibitions: formData.get('exhibitions'),
            years: formData.get('years')
        }
    };

    const success = await updateSiteContent('about', data);
    if (success) {
        showMessage('Sección Sobre Mí guardada exitosamente', 'success');
        loadSiteData();
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location')
    };

    const success = await updateSiteContent('contact', data);
    if (success) {
        showMessage('Información de contacto guardada exitosamente', 'success');
        loadSiteData();
    }
}

// Portfolio management
function loadPortfolioItems() {
    const container = document.getElementById('portfolioList');
    container.innerHTML = '';

    if (!siteData.portfolio) {
        siteData.portfolio = [];
    }

    siteData.portfolio.forEach((item, index) => {
        const itemEditor = createPortfolioItemEditor(item, index);
        container.appendChild(itemEditor);
    });
}

function createPortfolioItemEditor(item, index) {
    const editor = document.createElement('div');
    editor.className = 'portfolio-item-editor';
    editor.innerHTML = `
        <div class="form-group">
            <label>Título del Proyecto</label>
            <input type="text" value="${item.title}" onchange="updatePortfolioItem(${index}, 'title', this.value)">
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea rows="3" onchange="updatePortfolioItem(${index}, 'description', this.value)">${item.description}</textarea>
        </div>
        <div class="form-group">
            <label>Categoría</label>
            <select onchange="updatePortfolioItem(${index}, 'category', this.value)">
                <option value="fotografia" ${item.category === 'fotografia' ? 'selected' : ''}>Fotografía</option>
                <option value="pintura" ${item.category === 'pintura' ? 'selected' : ''}>Pintura</option>
                <option value="dibujo" ${item.category === 'dibujo' ? 'selected' : ''}>Dibujo</option>
                <option value="mixto" ${item.category === 'mixto' ? 'selected' : ''}>Medio Mixto</option>
            </select>
        </div>
        <div class="form-group">
            <label>Imagen</label>
            <input type="text" value="${item.image}" onchange="updatePortfolioItem(${index}, 'image', this.value)">
        </div>
        <button class="btn btn-danger" onclick="removePortfolioItem(${index})">Eliminar</button>
    `;
    return editor;
}

function addPortfolioItem() {
    if (!siteData.portfolio) {
        siteData.portfolio = [];
    }
    
    siteData.portfolio.push({
        title: 'Nuevo Proyecto',
        description: 'Descripción del proyecto',
        category: 'fotografia',
        image: ''
    });
    
    savePortfolioChanges();
    loadPortfolioItems();
}

function updatePortfolioItem(index, field, value) {
    if (siteData.portfolio[index]) {
        siteData.portfolio[index][field] = value;
    }
}

async function removePortfolioItem(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        siteData.portfolio.splice(index, 1);
        await savePortfolioChanges();
        loadPortfolioItems();
    }
}

async function savePortfolioChanges() {
    const success = await updateSiteContent('portfolio', siteData.portfolio);
    if (success) {
        showMessage('Portfolio actualizado exitosamente', 'success');
        loadSiteData();
    }
}

// Blog management
function loadBlogPosts() {
    const container = document.getElementById('blogList');
    container.innerHTML = '';

    if (!siteData.blog) {
        siteData.blog = [];
    }

    siteData.blog.forEach((post, index) => {
        const postEditor = createBlogPostEditor(post, index);
        container.appendChild(postEditor);
    });
}

function createBlogPostEditor(post, index) {
    const editor = document.createElement('div');
    editor.className = 'blog-item-editor';
    editor.innerHTML = `
        <div class="form-group">
            <label>Título del Artículo</label>
            <input type="text" value="${post.title}" onchange="updateBlogPost(${index}, 'title', this.value)">
        </div>
        <div class="form-group">
            <label>Fecha</label>
            <input type="date" value="${post.date}" onchange="updateBlogPost(${index}, 'date', this.value)">
        </div>
        <div class="form-group">
            <label>Resumen</label>
            <textarea rows="3" onchange="updateBlogPost(${index}, 'excerpt', this.value)">${post.excerpt}</textarea>
        </div>
        <div class="form-group">
            <label>Imagen</label>
            <input type="text" value="${post.image}" onchange="updateBlogPost(${index}, 'image', this.value)">
        </div>
        <button class="btn btn-danger" onclick="removeBlogPost(${index})">Eliminar</button>
    `;
    return editor;
}

function addBlogPost() {
    if (!siteData.blog) {
        siteData.blog = [];
    }
    
    siteData.blog.push({
        title: 'Nuevo Artículo',
        date: new Date().toISOString().split('T')[0],
        excerpt: 'Resumen del artículo',
        image: ''
    });
    
    saveBlogChanges();
    loadBlogPosts();
}

function updateBlogPost(index, field, value) {
    if (siteData.blog[index]) {
        siteData.blog[index][field] = value;
    }
}

async function removeBlogPost(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
        siteData.blog.splice(index, 1);
        await saveBlogChanges();
        loadBlogPosts();
    }
}

async function saveBlogChanges() {
    const success = await updateSiteContent('blog', siteData.blog);
    if (success) {
        showMessage('Blog actualizado exitosamente', 'success');
        loadSiteData();
    }
}

// Social media management
function loadSocialLinks() {
    const container = document.getElementById('socialList');
    container.innerHTML = '';

    if (!siteData.social) {
        siteData.social = [];
    }

    siteData.social.forEach((social, index) => {
        const socialEditor = createSocialEditor(social, index);
        container.appendChild(socialEditor);
    });
}

function createSocialEditor(social, index) {
    const editor = document.createElement('div');
    editor.className = 'blog-item-editor';
    editor.innerHTML = `
        <div class="form-group">
            <label>Nombre de la Red Social</label>
            <input type="text" value="${social.name}" onchange="updateSocialLink(${index}, 'name', this.value)">
        </div>
        <div class="form-group">
            <label>URL</label>
            <input type="url" value="${social.url}" onchange="updateSocialLink(${index}, 'url', this.value)">
        </div>
        <div class="form-group">
            <label>Icono (clase CSS)</label>
            <input type="text" value="${social.icon}" onchange="updateSocialLink(${index}, 'icon', this.value)" placeholder="ej: fab fa-instagram">
        </div>
        <button class="btn btn-danger" onclick="removeSocialLink(${index})">Eliminar</button>
    `;
    return editor;
}

function addSocialLink() {
    if (!siteData.social) {
        siteData.social = [];
    }
    
    siteData.social.push({
        name: 'Nueva Red Social',
        url: 'https://',
        icon: 'fab fa-twitter'
    });
    
    saveSocialChanges();
    loadSocialLinks();
}

function updateSocialLink(index, field, value) {
    if (siteData.social[index]) {
        siteData.social[index][field] = value;
    }
}

async function removeSocialLink(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta red social?')) {
        siteData.social.splice(index, 1);
        await saveSocialChanges();
        loadSocialLinks();
    }
}

async function saveSocialChanges() {
    const success = await updateSiteContent('social', siteData.social);
    if (success) {
        showMessage('Redes sociales actualizadas exitosamente', 'success');
        loadSiteData();
    }
}

// Image management
function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('imageUploadArea').classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    document.getElementById('imageUploadArea').classList.remove('dragover');
}

function handleImageDrop(e) {
    e.preventDefault();
    document.getElementById('imageUploadArea').classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    uploadImages(files);
}

function handleImageUpload(e) {
    const files = e.target.files;
    uploadImages(files);
}

async function uploadImages(files) {
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            try {
                const imageUrl = await uploadImageToServer(file);
                if (imageUrl) {
                    showMessage(`Imagen ${file.name} subida exitosamente`, 'success');
                    loadImageGrid(); // Refresh image grid
                }
            } catch (error) {
                showMessage(`Error subiendo ${file.name}`, 'error');
            }
        }
    }
}

async function uploadImageToServer(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'general');

    try {
        const response = await fetch('/.netlify/functions/upload-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${oauthToken}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            return result.url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

function loadImageGrid() {
    const container = document.getElementById('imageGrid');
    // This would typically load from your image storage
    // For now, we'll show a placeholder
    container.innerHTML = '<p>Funcionalidad de carga de imágenes disponible en versión completa</p>';
}

// API helper functions
async function updateSiteContent(section, data) {
    try {
        const response = await fetch('/.netlify/functions/update-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${oauthToken}`
            },
            body: JSON.stringify({ section, data })
        });

        if (response.ok) {
            siteData[section] = data; // Update local data
            return true;
        } else {
            throw new Error('Update failed');
        }
    } catch (error) {
        console.error('Error updating content:', error);
        showMessage('Error guardando cambios', 'error');
        return false;
    }
}

// Utility functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    // Insert at top of main content
    const adminContent = document.querySelector('.admin-content');
    adminContent.insertBefore(messageDiv, adminContent.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('oauth_token');
        window.location.href = 'index.html';
    }
}

// Global functions for inline handlers
window.updatePortfolioItem = updatePortfolioItem;
window.removePortfolioItem = removePortfolioItem;
window.updateBlogPost = updateBlogPost;
window.removeBlogPost = removeBlogPost;
window.updateSocialLink = updateSocialLink;
window.removeSocialLink = removeSocialLink;
window.addPortfolioItem = addPortfolioItem;
window.addBlogPost = addBlogPost;
window.addSocialLink = addSocialLink;
