// Content Generator - Generates HTML content based on data.json
class ContentGenerator {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.updatePageContent();
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError();
        }
    }

    updatePageContent() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.updateIndexPage();
                break;
            case 'about':
                this.updateAboutPage();
                break;
            case 'portfolio':
                this.updatePortfolioPage();
                break;
            case 'blog':
                this.updateBlogPage();
                break;
            case 'contact':
                this.updateContactPage();
                break;
        }
        
        this.updateNavigation();
        this.updateTheme();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    updateNavigation() {
        // Update logo
        const logoElements = document.querySelectorAll('.logo');
        logoElements.forEach(logo => {
            logo.textContent = this.data.navigation.logo || 'Abimael';
        });

        // Update menu items
        const menuItems = document.querySelectorAll('.nav-menu li a');
        menuItems.forEach((item, index) => {
            const navItem = this.data.navigation.menuItems[index];
            if (navItem) {
                item.textContent = navItem.name;
                item.href = navItem.url;
                if (!navItem.visible) {
                    item.closest('li').style.display = 'none';
                }
            }
        });
    }

    updateTheme() {
        const theme = this.data.settings?.theme;
        if (theme) {
            const root = document.documentElement;
            root.style.setProperty('--primary-color', theme.primaryColor || '#333333');
            root.style.setProperty('--secondary-color', theme.secondaryColor || '#f4f4f4');
            root.style.setProperty('--accent-color', theme.accentColor || '#d4af37');
        }

        // Update general visibility
        const general = this.data.settings?.general;
        if (general) {
            // Hide/show sections based on settings
            const portfolioSection = document.querySelector('.portfolio-section');
            const blogSection = document.querySelector('.blog-section');
            const aboutSection = document.querySelector('.about-section');
            
            if (portfolioSection && !general.showPortfolio) {
                portfolioSection.style.display = 'none';
            }
            if (blogSection && !general.showBlog) {
                blogSection.style.display = 'none';
            }
            if (aboutSection && !general.showAbout) {
                aboutSection.style.display = 'none';
            }
        }
    }

    updateIndexPage() {
        const indexData = this.data.pages.index;
        if (!indexData) return;

        // Update hero section
        const heroTitle = document.querySelector('.hero h1');
        const heroSubtitle = document.querySelector('.hero .subtitle');
        const heroDescription = document.querySelector('.hero .description');
        
        if (heroTitle) heroTitle.textContent = indexData.hero?.title || 'Portfolio Profesional';
        if (heroSubtitle) heroSubtitle.textContent = indexData.hero?.subtitle || 'Fotografía Artística & Visual';
        if (heroDescription) heroDescription.textContent = indexData.hero?.description || 'Explorando la belleza a través de la lente';
        
        if (indexData.hero?.backgroundImage) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.backgroundImage = `url(${indexData.hero.backgroundImage})`;
            }
        }

        // Update about section
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection && indexData.about) {
            const aboutTitle = aboutSection.querySelector('h2');
            const aboutText = aboutSection.querySelector('p');
            const aboutImage = aboutSection.querySelector('img');
            
            if (aboutTitle) aboutTitle.textContent = indexData.about.title || 'Sobre Mí';
            if (aboutText) aboutText.textContent = indexData.about.description || '';
            if (aboutImage && indexData.about.image) {
                aboutImage.src = indexData.about.image;
                aboutImage.alt = 'Sobre Mí';
            }
        }
    }

    updateAboutPage() {
        const aboutData = this.data.pages.about;
        if (!aboutData) return;

        // Update page title
        document.title = aboutData.title || 'Sobre Mí - Portfolio Abimael';

        // Update sections
        if (aboutData.sections) {
            Object.keys(aboutData.sections).forEach(sectionKey => {
                const section = aboutData.sections[sectionKey];
                const sectionElement = document.querySelector(`[data-section="${sectionKey}"]`) || 
                                     document.querySelector(`.${sectionKey}-section`);
                
                if (sectionElement) {
                    if (!section.visible) {
                        sectionElement.style.display = 'none';
                        return;
                    }

                    const titleElement = sectionElement.querySelector('h2') || sectionElement.querySelector('h3');
                    const contentElement = sectionElement.querySelector('p') || sectionElement.querySelector('.content');
                    const imageElement = sectionElement.querySelector('img');
                    
                    if (titleElement) titleElement.textContent = section.title || '';
                    if (contentElement) contentElement.textContent = section.content || '';
                    if (imageElement && section.image) {
                        imageElement.src = section.image;
                        imageElement.alt = section.title || '';
                    }
                }
            });
        }
    }

    updatePortfolioPage() {
        const portfolioData = this.data.pages.portfolio;
        if (!portfolioData) return;

        // Update page title
        document.title = portfolioData.title || 'Portfolio - Portfolio Abimael';

        // Update categories
        const categoriesContainer = document.querySelector('.categories-container');
        if (categoriesContainer && portfolioData.categories) {
            categoriesContainer.innerHTML = '';
            
            portfolioData.categories.forEach(category => {
                if (!category.visible) return;
                
                const categoryElement = this.createCategoryElement(category);
                categoriesContainer.appendChild(categoryElement);
            });
        }

        // Update series
        const seriesContainer = document.querySelector('.series-container');
        if (seriesContainer && portfolioData.series) {
            seriesContainer.innerHTML = '';
            
            portfolioData.series.forEach(serie => {
                if (!serie.visible) return;
                
                const seriesElement = this.createSeriesElement(serie);
                seriesContainer.appendChild(seriesElement);
            });
        }
    }

    createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'portfolio-item category-item';
        div.innerHTML = `
            <div class="item-image">
                ${category.images && category.images.length > 0 ? 
                    `<img src="${category.images[0]}" alt="${category.name}">` : 
                    '<div class="placeholder-image">Sin imagen</div>'
                }
            </div>
            <div class="item-info">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <span class="image-count">${category.images?.length || 0} imágenes</span>
            </div>
        `;
        
        div.addEventListener('click', () => this.showCategoryModal(category));
        return div;
    }

    createSeriesElement(serie) {
        const div = document.createElement('div');
        div.className = 'portfolio-item series-item';
        div.innerHTML = `
            <div class="item-image">
                ${serie.images && serie.images.length > 0 ? 
                    `<img src="${serie.images[0]}" alt="${serie.name}">` : 
                    '<div class="placeholder-image">Sin imagen</div>'
                }
            </div>
            <div class="item-info">
                <h3>${serie.name}</h3>
                <p>${serie.description}</p>
                <span class="image-count">${serie.images?.length || 0} imágenes</span>
            </div>
        `;
        
        div.addEventListener('click', () => this.showSeriesModal(serie));
        return div;
    }

    showCategoryModal(category) {
        this.showModal('category-modal', category);
    }

    showSeriesModal(serie) {
        this.showModal('series-modal', serie);
    }

    showModal(modalId, data) {
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = this.createModal(modalId);
        }
        
        this.populateModal(modal, data);
        modal.style.display = 'flex';
    }

    createModal(modalId) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-description"></div>
                    <div class="gallery-grid"></div>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                modal.style.display = 'none';
            }
        });
        
        document.body.appendChild(modal);
        return modal;
    }

    populateModal(modal, data) {
        const titleElement = modal.querySelector('.modal-title');
        const descriptionElement = modal.querySelector('.modal-description');
        const gridElement = modal.querySelector('.gallery-grid');
        
        if (titleElement) titleElement.textContent = data.name;
        if (descriptionElement) descriptionElement.textContent = data.description;
        
        if (gridElement && data.images) {
            gridElement.innerHTML = '';
            data.images.forEach(imagePath => {
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = data.name;
                img.addEventListener('click', () => this.openLightbox(imagePath, data.images));
                gridElement.appendChild(img);
            });
        }
    }

    updateBlogPage() {
        const blogData = this.data.pages.blog;
        if (!blogData) return;

        // Update page title
        document.title = blogData.title || 'Blog - Portfolio Abimael';

        // Update posts
        const blogPosts = document.querySelector('.blog-posts');
        if (blogPosts && blogData.posts) {
            blogPosts.innerHTML = '';
            
            blogData.posts.forEach(post => {
                if (!post.visible) return;
                
                const postElement = this.createBlogPostElement(post);
                blogPosts.appendChild(postElement);
            });
        }
    }

    createBlogPostElement(post) {
        const article = document.createElement('article');
        article.className = 'blog-post';
        article.innerHTML = `
            <div class="post-image">
                ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
            </div>
            <div class="post-content">
                <h2>${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date">${this.formatDate(post.date)}</span>
                    <span class="post-category">${post.category}</span>
                </div>
                <div class="post-content-full" style="display: none;">
                    ${this.formatContent(post.content)}
                </div>
                <button class="read-more-btn">Leer más</button>
            </div>
        `;
        
        const readMoreBtn = article.querySelector('.read-more-btn');
        const contentFull = article.querySelector('.post-content-full');
        const excerpt = article.querySelector('.post-excerpt');
        
        readMoreBtn.addEventListener('click', () => {
            if (contentFull.style.display === 'none') {
                contentFull.style.display = 'block';
                excerpt.style.display = 'none';
                readMoreBtn.textContent = 'Leer menos';
            } else {
                contentFull.style.display = 'none';
                excerpt.style.display = 'block';
                readMoreBtn.textContent = 'Leer más';
            }
        });
        
        return article;
    }

    updateContactPage() {
        const contactData = this.data.pages.contact;
        if (!contactData) return;

        // Update page title
        document.title = contactData.title || 'Contacto - Portfolio Abimael';

        // Update contact info
        if (contactData.info) {
            const emailElement = document.querySelector('.contact-email');
            const phoneElement = document.querySelector('.contact-phone');
            const locationElement = document.querySelector('.contact-location');
            const availabilityElement = document.querySelector('.contact-availability');
            
            if (emailElement) emailElement.textContent = contactData.info.email || '';
            if (phoneElement) phoneElement.textContent = contactData.info.phone || '';
            if (locationElement) locationElement.textContent = contactData.info.location || '';
            if (availabilityElement) availabilityElement.textContent = contactData.info.availability || '';
        }

        // Update social media
        const socialLinks = document.querySelectorAll('.social-links a');
        if (contactData.socialMedia) {
            socialLinks.forEach((link, index) => {
                const social = contactData.socialMedia[index];
                if (social && social.visible) {
                    link.href = social.url;
                    link.title = social.name;
                    
                    // Update icon class
                    const icon = link.querySelector('i');
                    if (icon) {
                        icon.className = `fab fa-${social.icon}`;
                    }
                } else {
                    link.style.display = 'none';
                }
            });
        }
    }

    openLightbox(imageSrc, allImages) {
        const lightbox = this.createLightbox();
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'flex';
        
        // Add navigation if there are multiple images
        if (allImages && allImages.length > 1) {
            this.addLightboxNavigation(lightbox, imageSrc, allImages);
        }
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Imagen ampliada">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.style.display = 'none';
                document.body.removeChild(lightbox);
            }
        });
        
        document.body.appendChild(lightbox);
        return lightbox;
    }

    addLightboxNavigation(lightbox, currentImage, allImages) {
        const prevBtn = document.createElement('button');
        const nextBtn = document.createElement('button');
        
        prevBtn.className = 'lightbox-nav prev';
        nextBtn.className = 'lightbox-nav next';
        prevBtn.innerHTML = '&#8249;';
        nextBtn.innerHTML = '&#8250;';
        
        lightbox.querySelector('.lightbox-content').appendChild(prevBtn);
        lightbox.querySelector('.lightbox-content').appendChild(nextBtn);
        
        let currentIndex = allImages.indexOf(currentImage);
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
            lightbox.querySelector('img').src = allImages[currentIndex];
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
            lightbox.querySelector('img').src = allImages[currentIndex];
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatContent(content) {
        return content.replace(/\n/g, '<br>');
    }

    showError() {
        console.error('No se pudo cargar la configuración del sitio');
    }
}

// Initialize content generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contentGenerator = new ContentGenerator();
});