// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.data = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.loadInitialFormData();
        this.renderDynamicLists();
        this.setupFileUpload();
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error cargando datos', 'error');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(link.dataset.section);
            });
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveData();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.confirmAction('¿Está seguro que desea cerrar sesión?', () => {
                window.location.href = 'index.html';
            });
        });

        // Add buttons for dynamic lists
        document.getElementById('addNavItem').addEventListener('click', () => {
            this.addNavItem();
        });

        document.getElementById('addCategory').addEventListener('click', () => {
            this.addCategory();
        });

        document.getElementById('addSeries').addEventListener('click', () => {
            this.addSeries();
        });

        document.getElementById('addBlogPost').addEventListener('click', () => {
            this.addBlogPost();
        });

        document.getElementById('addSocialMedia').addEventListener('click', () => {
            this.addSocialMedia();
        });

        // Data management
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        document.getElementById('importFileInput').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('resetData').addEventListener('click', () => {
            this.confirmAction('¿Está seguro que desea restaurar los datos por defecto? Se perderán todos los cambios.', () => {
                this.resetData();
            });
        });
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'general':
                this.loadGeneralData();
                break;
            case 'navigation':
                this.loadNavigationData();
                break;
            case 'home':
                this.loadHomeData();
                break;
            case 'about':
                this.loadAboutData();
                break;
            case 'portfolio':
                this.loadPortfolioData();
                break;
            case 'blog':
                this.loadBlogData();
                break;
            case 'contact':
                this.loadContactData();
                break;
            case 'social':
                this.loadSocialData();
                break;
            case 'media':
                this.loadMediaData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    loadInitialFormData() {
        this.loadGeneralData();
        this.loadNavigationData();
        this.loadHomeData();
        this.loadAboutData();
        this.loadPortfolioData();
        this.loadBlogData();
        this.loadContactData();
        this.loadSocialData();
        this.loadSettingsData();
    }

    loadGeneralData() {
        document.getElementById('siteTitle').value = this.data.general.siteTitle || '';
        document.getElementById('siteTagline').value = this.data.general.siteTagline || '';
        document.getElementById('siteDescription').value = this.data.general.siteDescription || '';
        document.getElementById('siteAuthor').value = this.data.general.siteAuthor || '';
        document.getElementById('siteCopyright').value = this.data.general.siteCopyright || '';
        document.getElementById('siteLogo').value = this.data.general.siteLogo || '';
    }

    loadNavigationData() {
        const container = document.getElementById('navigationList');
        if (!container || !this.data.navigation.mainMenu) return;
        
        const menuContainer = container.querySelector('#navigationContainer') || this.createElement('div', { id: 'navigationContainer' });
        container.appendChild(menuContainer);
        
        this.data.navigation.mainMenu.forEach((item, index) => {
            const navItem = this.createNavItemElement(item, index);
            menuContainer.appendChild(navItem);
        });
    }

    loadHomeData() {
        const home = this.data.index;
        if (!home) return;

        // Hero section
        if (home.hero) {
            if (home.hero.title) {
                document.getElementById('homeHeroTitle').value = home.hero.title.line1 + '\\n' + home.hero.title.line2 + '\\n' + home.hero.title.line3 || '';
            }
            document.getElementById('homeHeroScrollText').value = home.hero.scrollText || '';
            
            if (home.hero.heroImage) {
                document.getElementById('homeHeroImage').value = home.hero.heroImage.src || '';
            }
            
            // Navigation dots
            if (home.hero.navigationDots) {
                const dotsContainer = document.getElementById('navigationDotsContainer');
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    home.hero.navigationDots.forEach((dot, index) => {
                        const dotElement = this.createNavigationDotElement(dot, index);
                        dotsContainer.appendChild(dotElement);
                    });
                }
            }
        }

        // Footer
        if (home.footer) {
            document.getElementById('footerMainTitle').value = home.footer.mainTitle || '';
            document.getElementById('footerSubtitle').value = home.footer.subtitle || '';
            
            if (home.footer.contactInfo) {
                document.getElementById('footerEmail').value = home.footer.contactInfo.email || '';
                document.getElementById('footerPhone').value = home.footer.contactInfo.phone || '';
            }
        }
    }

    loadAboutData() {
        const about = this.data.about;
        if (!about) return;

        // Page metadata
        document.getElementById('aboutPageTitle').value = about.pageTitle || '';
        document.getElementById('aboutDescription').value = about.description || '';
    }

    loadPortfolioData() {
        const portfolio = this.data.portfolio;
        if (!portfolio) return;

        // Page metadata
        document.getElementById('portfolioPageTitle').value = portfolio.pageTitle || '';
        document.getElementById('portfolioDescription').value = portfolio.description || '';

        // Load categories
        if (portfolio.categories) {
            const categoriesContainer = document.getElementById('portfolioCategoriesContainer');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '';
                portfolio.categories.forEach((category, index) => {
                    const categoryElement = this.createCategoryElement(category, index);
                    categoriesContainer.appendChild(categoryElement);
                });
            }
        }

        // Load sections
        if (portfolio.sections && portfolio.sections.artPortfolio) {
            document.getElementById('artPortfolioTitle').value = portfolio.sections.artPortfolio.title || '';
            document.getElementById('artPortfolioSubtitle').value = portfolio.sections.artPortfolio.subtitle || '';
        }
    }

    loadSeriesData() {
        const container = document.getElementById('seriesContainer');
        container.innerHTML = '';

        if (!this.data.portfolio.series) {
            this.data.portfolio.series = [];
        }

        this.data.portfolio.series.forEach((serie, index) => {
            const seriesElement = this.createSeriesElement(serie, index);
            container.appendChild(seriesElement);
        });
    }

    createSeriesElement(serie, index) {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>${serie.title}</h4>
                <div class="item-actions">
                    <button type="button" class="btn btn-secondary" onclick="adminPanel.editSeries(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button type="button" class="btn btn-danger" onclick="adminPanel.deleteSeries(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label>ID:</label>
                <input type="text" value="${serie.id}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Título:</label>
                <input type="text" value="${serie.title}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Descripción:</label>
                <textarea class="form-control" rows="2" readonly>${serie.description}</textarea>
            </div>
            <div class="form-group">
                <label>Categoría:</label>
                <input type="text" value="${serie.category}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Imágenes (${serie.images?.length || 0}):</label>
                <div class="image-preview-list">
                    ${(serie.images || []).map(img => 
                        `<img src="${img}" alt="Imagen" style="width: 60px; height: 60px; object-fit: cover; margin: 2px; border-radius: 4px;">`
                    ).join('')}
                </div>
            </div>
        `;
        return div;
    }

    loadBlogData() {
        const blog = this.data.blog;
        if (!blog) return;

        // Page metadata
        document.getElementById('blogPageTitle').value = blog.pageTitle || '';
        document.getElementById('blogDescription').value = blog.description || '';
    }
            }
            if (blog.processSections.mixedMedia) {
                document.getElementById('blogMixedMediaTitle').value = blog.processSections.mixedMedia.title || '';
                document.getElementById('blogMixedMediaDescription').value = blog.processSections.mixedMedia.description || '';
            }
        }

        // Newsletter
        if (blog.newsletter) {
            document.getElementById('blogNewsletterTitle').value = blog.newsletter.title || '';
            document.getElementById('blogNewsletterDescription').value = blog.newsletter.description || '';
        }
    }

    loadContactData() {
        const contact = this.data.contact;
        if (!contact) return;

        // Page metadata
        document.getElementById('contactPageTitle').value = contact.pageTitle || '';
        document.getElementById('contactPageSubtitle').value = contact.pageSubtitle || '';

        // Contact form
        if (contact.form) {
            document.getElementById('contactFormTitle').value = contact.form.title || '';
            document.getElementById('contactFormDescription').value = contact.form.description || '';
        }

        // Contact info
        if (contact.info) {
            document.getElementById('contactInfoTitle').value = contact.info.title || '';
            
            if (contact.info.availability) {
                document.getElementById('contactAvailabilityStatus').value = contact.info.availability.status || '';
                document.getElementById('contactAvailabilityNote').value = contact.info.availability.note || '';
            }
        }
    }

    loadBlogData() {
        const blog = this.data.blog;
        if (!blog) return;

        // Title
        document.getElementById('blogTitle').value = blog.title || '';

        // Process creative
        if (blog.processCreative) {
            document.getElementById('blogProcessTitle').value = blog.processCreative.title || '';
            document.getElementById('blogProcessSubtitle').value = blog.processCreative.subtitle || '';
            
            if (blog.processCreative.cycles) {
                document.getElementById('blogProcessPhotography').value = blog.processCreative.cycles.find(c => c.title.includes('Fotografía'))?.content || '';
                document.getElementById('blogProcessDrawing').value = blog.processCreative.cycles.find(c => c.title.includes('Dibujo'))?.content || '';
                document.getElementById('blogProcessMixedMedia').value = blog.processCreative.cycles.find(c => c.title.includes('Medio Mixto'))?.content || '';
            }
        }

        // Reflections
        if (blog.reflections) {
            document.getElementById('blogReflectionsTitle').value = blog.reflections.title || '';
        }
    }

    loadContactData() {
        const contact = this.data.contact;
        if (!contact) return;

        // Hero
        if (contact.hero) {
            document.getElementById('contactTitle').value = contact.hero.title || '';
            document.getElementById('contactSubtitle').value = contact.hero.subtitle || '';
            document.getElementById('contactDescription').value = contact.hero.description || '';
        }

        // Contact form
        if (contact.contactForm) {
            document.getElementById('contactFormTitle').value = contact.contactForm.title || '';
            document.getElementById('contactFormDescription').value = contact.contactForm.description || '';
        }

        // Contact info
        if (contact.contactInfo) {
            document.getElementById('contactEmail').value = contact.contactInfo.email || '';
            document.getElementById('contactPhone').value = contact.contactInfo.phone || '';
            document.getElementById('contactLocation').value = contact.contactInfo.location || '';
            document.getElementById('contactAddress').value = contact.contactInfo.address || '';
            document.getElementById('contactAvailability').value = contact.contactInfo.availability || '';
            document.getElementById('contactResponseTime').value = contact.contactInfo.responseTime || '';
        }

        // FAQ
        if (contact.faq) {
            document.getElementById('contactFAQTitle').value = contact.faq.title || '';
        }

        // CTA
        if (contact.cta) {
            document.getElementById('contactCTATitle').value = contact.cta.title || '';
            document.getElementById('contactCTAContent').value = contact.cta.content || '';
        }
    }

    loadSocialData() {
        const container = document.getElementById('socialMediaContainer');
        container.innerHTML = '';

        if (!this.data.socialMedia) {
            this.data.socialMedia = [];
        }

        this.data.socialMedia.forEach((social, index) => {
            const socialElement = this.createSocialMediaElement(social, index);
            container.appendChild(socialElement);
        });
    }

    createSocialMediaElement(social, index) {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>${social.platform}</h4>
                <div class="item-actions">
                    <button type="button" class="btn btn-secondary" onclick="adminPanel.editSocialMedia(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button type="button" class="btn btn-danger" onclick="adminPanel.deleteSocialMedia(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label>Plataforma:</label>
                <input type="text" value="${social.platform}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>URL:</label>
                <input type="url" value="${social.url}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Usuario:</label>
                <input type="text" value="${social.username}" class="form-control" readonly>
            </div>
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" ${social.visible ? 'checked' : ''} readonly> Visible
                </label>
            </div>
        `;
        return div;
    }

    loadSettingsData() {
        if (this.data.theme) {
            const theme = this.data.theme;
            
            // Theme colors
            if (theme.colors) {
                document.getElementById('themePrimaryColor').value = theme.colors.primary || '#2563eb';
                document.getElementById('themeSecondaryColor').value = theme.colors.secondary || '#64748b';
                document.getElementById('themeAccentColor').value = theme.colors.accent || '#f59e0b';
                document.getElementById('themeTextColor').value = theme.colors.text || '#1e293b';
                document.getElementById('themeBackgroundColor').value = theme.colors.background || '#ffffff';
                document.getElementById('themeSurfaceColor').value = theme.colors.surface || '#f8fafc';
            }

            // Fonts
            if (theme.fonts) {
                document.getElementById('themeHeadingFont').value = theme.fonts.heading || 'Lora';
                document.getElementById('themeBodyFont').value = theme.fonts.body || 'Inter';
            }
        }
    }

    loadNavigationData() {
        const container = document.getElementById('navItemsContainer');
        container.innerHTML = '';

        this.data.navigation.forEach((item, index) => {
            const navItem = this.createNavItemElement(item, index);
            container.appendChild(navItem);
        });
    }

    createNavItemElement(item, index) {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>Elemento ${index + 1}</h4>
                <div class="item-actions">
                    <button type="button" class="btn btn-secondary" onclick="adminPanel.editNavItem(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button type="button" class="btn btn-danger" onclick="adminPanel.deleteNavItem(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" value="${item.name}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>URL:</label>
                <input type="text" value="${item.url}" class="form-control" readonly>
            </div>
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" ${item.visible ? 'checked' : ''} readonly> Visible
                </label>
            </div>
        `;
        return div;
    }







    loadMediaData() {
        this.loadExistingImages();
    }

    loadExistingImages() {
        const container = document.getElementById('existingImages');
        container.innerHTML = '';

        // Simulate existing images - in a real implementation, you'd scan the images directory
        const existingImages = [
            'images/hero-main.jpg',
            'images/profile/about-photo.jpg',
            'images/blog/process-article.jpg',
            'images/blog/light-article.jpg',
            'images/portfolio/intimate-01.jpg',
            'images/portfolio/nature-01.jpg',
            'images/portfolio/urban-01.jpg'
        ];

        existingImages.forEach(imagePath => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'grid-image';
            imageDiv.innerHTML = `
                <img src="${imagePath}" alt="Imagen" onerror="this.parentElement.style.display='none'">
                <div class="image-overlay">
                    <button type="button" class="btn btn-info" onclick="adminPanel.copyImagePath('${imagePath}')">
                        <i class="fas fa-copy"></i> Copiar Ruta
                    </button>
                </div>
            `;
            container.appendChild(imageDiv);
        });
    }



    setupFileUpload() {
        // Setup image upload previews
        const imageInputs = [
            'homeBackgroundImage',
            'aboutIntroImage'
        ];

        imageInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.handleImageUpload(e, inputId);
                });
            }
        });

        // Multiple image upload
        const multipleUpload = document.getElementById('multipleImageUpload');
        if (multipleUpload) {
            multipleUpload.addEventListener('change', (e) => {
                this.handleMultipleImageUpload(e);
            });
        }
    }

    handleImageUpload(event, inputId) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewId = inputId.replace('Image', 'Preview');
                const nameId = inputId.replace('Image', 'ImageName');
                
                this.showImagePreview(previewId, nameId, e.target.result, inputId);
            };
            reader.readAsDataURL(file);
        }
    }

    showImagePreview(previewId, nameId, src, inputId) {
        const preview = document.getElementById(previewId);
        const name = document.getElementById(nameId);
        
        if (preview) {
            preview.src = src;
            preview.style.display = 'block';
        }
        
        if (name && inputId) {
            const input = document.getElementById(inputId);
            if (input && input.files[0]) {
                name.textContent = input.files[0].name;
            } else if (typeof src === 'string' && !src.startsWith('data:')) {
                name.textContent = src.split('/').pop();
            }
        }
    }

    handleMultipleImageUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const progressBar = document.querySelector('.progress-bar');
        const progressContainer = document.getElementById('uploadProgress');
        
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        let uploaded = 0;
        files.forEach((file, index) => {
            setTimeout(() => {
                uploaded++;
                const progress = (uploaded / files.length) * 100;
                progressBar.style.width = progress + '%';

                if (uploaded === files.length) {
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                        this.showNotification(`${files.length} imágenes subidas correctamente`, 'success');
                        this.loadExistingImages();
                    }, 500);
                }
            }, (index + 1) * 500);
        });
    }

    // Navigation Item Management
    addNavItem() {
        const newItem = {
            id: 'nuevo-elemento',
            name: 'Nuevo Elemento',
            href: '#',
            icon: 'star'
        };
        
        this.data.navigation.push(newItem);
        this.loadNavigationData();
        this.showNotification('Elemento de navegación agregado', 'success');
    }

    editNavItem(index) {
        const item = this.data.navigation[index];
        const newName = prompt('Nombre del elemento:', item.name);
        if (newName !== null) {
            item.name = newName;
            item.id = newName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            this.loadNavigationData();
        }
    }

    deleteNavItem(index) {
        this.confirmAction('¿Está seguro que desea eliminar este elemento?', () => {
            this.data.navigation.splice(index, 1);
            this.loadNavigationData();
            this.showNotification('Elemento eliminado', 'success');
        });
    }

    // Series Management
    addSeries() {
        const newSeries = {
            id: 'nueva-serie',
            title: 'Nueva Serie',
            description: 'Descripción de la serie',
            count: 0,
            category: 'General',
            previewImage: '',
            images: []
        };
        
        if (!this.data.portfolio.series) {
            this.data.portfolio.series = [];
        }
        this.data.portfolio.series.push(newSeries);
        this.loadSeriesData();
        this.showNotification('Serie agregada', 'success');
    }

    editSeries(index) {
        const serie = this.data.portfolio.series[index];
        const newName = prompt('Nombre de la serie:', serie.title);
        if (newName !== null) {
            serie.title = newName;
            serie.id = newName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            this.loadSeriesData();
        }
    }

    deleteSeries(index) {
        this.confirmAction('¿Está seguro que desea eliminar esta serie?', () => {
            this.data.portfolio.series.splice(index, 1);
            this.loadSeriesData();
            this.showNotification('Serie eliminada', 'success');
        });
    }



    // Social Media Management
    addSocialMedia() {
        if (!this.data.socialMedia) {
            this.data.socialMedia = [];
        }
        
        const newSocial = {
            platform: 'Nueva Red',
            url: '#',
            username: 'usuario',
            visible: true
        };
        
        this.data.socialMedia.push(newSocial);
        this.loadSocialData();
        this.showNotification('Red social agregada', 'success');
    }

    editSocialMedia(index) {
        const social = this.data.socialMedia[index];
        const newName = prompt('Nombre de la red social:', social.platform);
        if (newName !== null) {
            social.platform = newName;
            this.loadSocialData();
        }
    }

    deleteSocialMedia(index) {
        this.confirmAction('¿Está seguro que desea eliminar esta red social?', () => {
            this.data.socialMedia.splice(index, 1);
            this.loadSocialData();
            this.showNotification('Red social eliminada', 'success');
        });
    }

    // Data Management
    async saveData() {
        this.showLoading(true);
        
        try {
            // Update data from forms
            this.updateDataFromForms();
            
            // In a real implementation, this would save to the server
            // For this demo, we'll save to localStorage
            localStorage.setItem('portfolio-data', JSON.stringify(this.data));
            
            this.showNotification('Datos guardados correctamente', 'success');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error guardando datos', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    updateDataFromForms() {
        // Update general settings
        this.data.general.title = document.getElementById('siteTitle').value;
        this.data.general.description = document.getElementById('siteDescription').value;
        this.data.general.author = document.getElementById('siteAuthor').value;

        // Update navigation
        if (!this.data.navigation) this.data.navigation = [];

        // Update home page data
        if (!this.data.homepage) this.data.homepage = {};
        
        // Hero section
        if (!this.data.homepage.hero) this.data.homepage.hero = {};
        this.data.homepage.hero.title = document.getElementById('homeHeroTitle').value;
        this.data.homepage.hero.subtitle = document.getElementById('homeHeroSubtitle').value;
        this.data.homepage.hero.description = document.getElementById('homeHeroDescription').value;
        this.data.homepage.hero.heroImage = this.getImagePath('homeHeroPreview') || this.data.general.heroImage;
        this.data.homepage.hero.scrollText = document.getElementById('homeHeroScrollText').value;

        // Featured content
        if (!this.data.homepage.featuredContent) this.data.homepage.featuredContent = {};
        this.data.homepage.featuredContent.title = document.getElementById('homeFeaturedTitle').value;
        this.data.homepage.featuredContent.subtitle = document.getElementById('homeFeaturedSubtitle').value;
        this.data.homepage.featuredContent.description = document.getElementById('homeFeaturedDescription').value;
        this.data.homepage.featuredContent.image = this.getImagePath('homeFeaturedPreview');
        this.data.homepage.featuredContent.linkText = document.getElementById('homeFeaturedLinkText').value;

        // Categories preview
        if (!this.data.homepage.categoriesPreview) this.data.homepage.categoriesPreview = {};
        this.data.homepage.categoriesPreview.title = document.getElementById('homeCategoriesTitle').value;
        this.data.homepage.categoriesPreview.subtitle = document.getElementById('homeCategoriesSubtitle').value;

        // Portfolio highlights
        if (!this.data.homepage.portfolioHighlights) this.data.homepage.portfolioHighlights = {};
        this.data.homepage.portfolioHighlights.title = document.getElementById('homePortfolioTitle').value;
        this.data.homepage.portfolioHighlights.subtitle = document.getElementById('homePortfolioSubtitle').value;

        // About preview
        if (!this.data.homepage.aboutPreview) this.data.homepage.aboutPreview = {};
        this.data.homepage.aboutPreview.title = document.getElementById('homeAboutTitle').value;
        this.data.homepage.aboutPreview.content = document.getElementById('homeAboutContent').value;
        this.data.homepage.aboutPreview.image = this.getImagePath('homeAboutPreview');
        this.data.homepage.aboutPreview.linkText = document.getElementById('homeAboutLinkText').value;

        // Call to action
        if (!this.data.homepage.cta) this.data.homepage.cta = {};
        this.data.homepage.cta.title = document.getElementById('homeCTATitle').value;
        this.data.homepage.cta.content = document.getElementById('homeCTAContent').value;
        this.data.homepage.cta.linkText = document.getElementById('homeCTALinkText').value;

        // Update about page data
        if (!this.data.about) this.data.about = {};

        // Introduction
        if (!this.data.about.introduction) this.data.about.introduction = {};
        this.data.about.introduction.title = document.getElementById('aboutIntroTitle').value;
        this.data.about.introduction.content = document.getElementById('aboutIntroContent').value;
        this.data.about.introduction.image = this.getImagePath('aboutIntroPreview');
        this.data.about.introduction.visible = document.getElementByById('aboutIntroVisible').checked;

        // Process
        if (!this.data.about.process) this.data.about.process = {};
        this.data.about.process.title = document.getElementById('aboutProcessTitle').value;
        this.data.about.process.content = document.getElementById('aboutProcessContent').value;
        this.data.about.process.visible = document.getElementById('aboutProcessVisible').checked;

        // Approach
        if (!this.data.about.approach) this.data.about.approach = {};
        this.data.about.approach.title = document.getElementById('aboutApproachTitle').value;
        this.data.about.approach.content = document.getElementById('aboutApproachContent').value;
        this.data.about.approach.visible = document.getElementById('aboutApproachVisible').checked;

        // Biography
        if (!this.data.about.biography) this.data.about.biography = {};
        this.data.about.biography.title = document.getElementById('aboutBiographyTitle').value;
        this.data.about.biography.content = document.getElementById('aboutBiographyContent').value;
        this.data.about.biography.image = this.getImagePath('aboutBiographyPreview');
        this.data.about.biography.visible = document.getElementById('aboutBiographyVisible').checked;

        // Statement
        if (!this.data.about.statement) this.data.about.statement = {};
        this.data.about.statement.title = document.getElementById('aboutStatementTitle').value;
        this.data.about.statement.content = document.getElementById('aboutStatementContent').value;
        this.data.about.statement.visible = document.getElementById('aboutStatementVisible').checked;

        // Series development
        if (!this.data.about.seriesDevelopment) this.data.about.seriesDevelopment = {};
        this.data.about.seriesDevelopment.title = document.getElementById('aboutSeriesTitle').value;
        this.data.about.seriesDevelopment.content = document.getElementById('aboutSeriesContent').value;
        this.data.about.seriesDevelopment.visible = document.getElementById('aboutSeriesVisible').checked;

        // Timeline
        if (!this.data.about.timeline) this.data.about.timeline = {};
        this.data.about.timeline.title = document.getElementById('aboutTimelineTitle').value;
        this.data.about.timeline.subtitle = document.getElementById('aboutTimelineSubtitle').value;
        this.data.about.timeline.visible = document.getElementById('aboutTimelineVisible').checked;

        // Cross influences
        if (!this.data.about.crossInfluences) this.data.about.crossInfluences = {};
        this.data.about.crossInfluences.title = document.getElementById('aboutInfluencesTitle').value;
        this.data.about.crossInfluences.subtitle = document.getElementById('aboutInfluencesSubtitle').value;
        this.data.about.crossInfluences.visible = document.getElementById('aboutInfluencesVisible').checked;

        // Collaborations
        if (!this.data.about.collaborations) this.data.about.collaborations = {};
        this.data.about.collaborations.title = document.getElementById('aboutCollaborationsTitle').value;
        this.data.about.collaborations.content = document.getElementById('aboutCollaborationsContent').value;
        this.data.about.collaborations.visible = document.getElementById('aboutCollaborationsVisible').checked;

        // Philosophy
        if (!this.data.about.philosophy) this.data.about.philosophy = {};
        this.data.about.philosophy.title = document.getElementById('aboutPhilosophyTitle').value;
        this.data.about.philosophy.content = document.getElementById('aboutPhilosophyContent').value;
        this.data.about.philosophy.visible = document.getElementById('aboutPhilosophyVisible').checked;

        // Update portfolio data
        if (!this.data.portfolio) this.data.portfolio = {};

        // Hero
        if (!this.data.portfolio.hero) this.data.portfolio.hero = {};
        this.data.portfolio.hero.title = document.getElementById('portfolioHeroTitle').value;
        this.data.portfolio.hero.subtitle = document.getElementById('portfolioHeroSubtitle').value;
        this.data.portfolio.hero.description = document.getElementById('portfolioHeroDescription').value;

        // Artistic portfolio
        if (!this.data.portfolio.artisticPortfolio) this.data.portfolio.artisticPortfolio = {};
        this.data.portfolio.artisticPortfolio.title = document.getElementById('portfolioArtisticTitle').value;
        this.data.portfolio.artisticPortfolio.description = document.getElementById('portfolioArtisticDescription').value;

        // Call to action
        if (!this.data.portfolio.cta) this.data.portfolio.cta = {};
        this.data.portfolio.cta.title = document.getElementById('portfolioCTATitle').value;
        this.data.portfolio.cta.content = document.getElementById('portfolioCTAContent').value;
        this.data.portfolio.cta.linkText = document.getElementById('portfolioCTALinkText').value;

        // Update blog data
        if (!this.data.blog) this.data.blog = {};
        this.data.blog.title = document.getElementById('blogTitle').value;

        // Process creative
        if (!this.data.blog.processCreative) this.data.blog.processCreative = {};
        this.data.blog.processCreative.title = document.getElementById('blogProcessTitle').value;
        this.data.blog.processCreative.subtitle = document.getElementById('blogProcessSubtitle').value;

        // Reflections
        if (!this.data.blog.reflections) this.data.blog.reflections = {};
        this.data.blog.reflections.title = document.getElementById('blogReflectionsTitle').value;

        // Update contact data
        if (!this.data.contact) this.data.contact = {};

        // Hero
        if (!this.data.contact.hero) this.data.contact.hero = {};
        this.data.contact.hero.title = document.getElementById('contactTitle').value;
        this.data.contact.hero.subtitle = document.getElementById('contactSubtitle').value;
        this.data.contact.hero.description = document.getElementById('contactDescription').value;

        // Contact form
        if (!this.data.contact.contactForm) this.data.contact.contactForm = {};
        this.data.contact.contactForm.title = document.getElementById('contactFormTitle').value;
        this.data.contact.contactForm.description = document.getElementById('contactFormDescription').value;

        // Contact info
        if (!this.data.contact.contactInfo) this.data.contact.contactInfo = {};
        this.data.contact.contactInfo.email = document.getElementById('contactEmail').value;
        this.data.contact.contactInfo.phone = document.getElementById('contactPhone').value;
        this.data.contact.contactInfo.location = document.getElementById('contactLocation').value;
        this.data.contact.contactInfo.address = document.getElementById('contactAddress').value;
        this.data.contact.contactInfo.availability = document.getElementById('contactAvailability').value;
        this.data.contact.contactInfo.responseTime = document.getElementById('contactResponseTime').value;

        // FAQ
        if (!this.data.contact.faq) this.data.contact.faq = {};
        this.data.contact.faq.title = document.getElementById('contactFAQTitle').value;

        // CTA
        if (!this.data.contact.cta) this.data.contact.cta = {};
        this.data.contact.cta.title = document.getElementById('contactCTATitle').value;
        this.data.contact.cta.content = document.getElementById('contactCTAContent').value;

        // Update settings
        if (!this.data.settings) this.data.settings = {};

        // Theme colors
        if (!this.data.settings.theme) this.data.settings.theme = {};
        this.data.settings.theme.primaryColor = document.getElementById('primaryColor').value;
        this.data.settings.theme.secondaryColor = document.getElementById('secondaryColor').value;
        this.data.settings.theme.accentColor = document.getElementById('accentColor').value;

        // Visibility settings
        if (!this.data.settings.visibility) this.data.settings.visibility = {};
        this.data.settings.visibility.showSocialMedia = document.getElementById('showSocialMedia').checked;
        this.data.settings.visibility.showBlog = document.getElementById('showBlog').checked;
        this.data.settings.visibility.showPortfolio = document.getElementById('showPortfolio').checked;
        this.data.settings.visibility.showAbout = document.getElementById('showAbout').checked;
    }

    getImagePath(previewId) {
        const preview = document.getElementById(previewId);
        if (preview && preview.style.display !== 'none') {
            return preview.src;
        }
        return '';
    }

    createNavItemElement(item, index) {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>${item.name}</h4>
                <div class="item-actions">
                    <button type="button" class="btn btn-secondary" onclick="adminPanel.editNavItem(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button type="button" class="btn btn-danger" onclick="adminPanel.deleteNavItem(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label>ID:</label>
                <input type="text" value="${item.id}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" value="${item.name}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>URL:</label>
                <input type="text" value="${item.href}" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Icono:</label>
                <input type="text" value="${item.icon}" class="form-control" readonly>
            </div>
        `;
        return div;
    }

    exportData() {
        this.updateDataFromForms();
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Datos exportados correctamente', 'success');
    }

    async importData(file) {
        if (!file) return;
        
        try {
            const text = await file.text();
            const importedData = JSON.parse(text);
            
            this.confirmAction('¿Está seguro que desea importar estos datos? Se sobrescribirán todos los datos actuales.', () => {
                this.data = importedData;
                this.loadInitialFormData();
                this.renderDynamicLists();
                this.showNotification('Datos importados correctamente', 'success');
            });
        } catch (error) {
            console.error('Error importing data:', error);
            this.showNotification('Error importando datos: archivo inválido', 'error');
        }
    }

    async resetData() {
        // Reset to default data structure
        localStorage.removeItem('portfolio-data');
        await this.loadData();
        this.loadInitialFormData();
        this.renderDynamicLists();
        this.showNotification('Datos restaurados al estado por defecto', 'success');
    }

    copyImagePath(path) {
        navigator.clipboard.writeText(path).then(() => {
            this.showNotification('Ruta copiada al portapapeles', 'success');
        }).catch(() => {
            this.showNotification('Error copiando ruta', 'error');
        });
    }

    // Utility Methods
    renderDynamicLists() {
        this.loadNavigationData();
        this.loadSeriesData();
        this.loadSocialData();
        this.loadMediaData();
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    confirmAction(message, callback) {
        const modal = document.getElementById('confirmModal');
        const messageElement = document.getElementById('confirmMessage');
        const yesButton = document.getElementById('confirmYes');
        const noButton = document.getElementById('confirmNo');
        
        messageElement.textContent = message;
        modal.style.display = 'flex';
        
        yesButton.onclick = () => {
            modal.style.display = 'none';
            callback();
        };
        
        noButton.onclick = () => {
            modal.style.display = 'none';
        };
    }
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});