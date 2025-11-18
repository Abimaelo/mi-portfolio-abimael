// ===== MAIN JAVASCRIPT FOR ABIMAEL ORTIZ ÁLVAREZ PORTFOLIO =====
// OPTIMIZED AND CLEAN VERSION

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing portfolio JavaScript...');
    
    // Initialize core functionality
    initNavigation();
    initSmoothScrolling();
    initHamburgerMenu();
    initFormHandling();
    initScrollAnimations();
    initNewsletterForm();
    
    // Initialize features that may not exist on all pages (with checks)
    const hasPortfolioFilters = document.querySelector('.filter-btn');
    if (hasPortfolioFilters) {
        console.log('📊 Found portfolio filters, initializing...');
        initPortfolioFilters();
        initPhotographyArtFilters();
    }
    
    // Initialize portfolio tabs (portfolio.html)
    const hasViewTabs = document.querySelector('.view-tab');
    if (hasViewTabs) {
        console.log('📋 Found view tabs, initializing...');
        initPortfolioTabs();
        initPortfolioSeriesLightbox();
    }
    
    // Initialize lightbox (if lightbox elements exist)
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        console.log('🖼️ Found lightbox, initializing...');
        initLightbox();
    }
    
    console.log('✅ Portfolio initialization complete');
});

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(248, 249, 250, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(248, 249, 250, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== PORTFOLIO FILTERING (PORTFOLIO.HTML) =====
function initPortfolioFilters() {
    console.log('🔍 Initializing portfolio filters...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) {
        console.log('⚠️ Portfolio filters: No elements found');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== PHOTOGRAPHY ARTISTIC FILTERING (FOTOGRAFIA-ARTISTICA.HTML) =====
function initPhotographyArtFilters() {
    console.log('🔍 Initializing photography art filters...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const artWorks = document.querySelectorAll('.art-work');
    
    if (filterButtons.length === 0 || artWorks.length === 0) {
        console.log('⚠️ Photography filters: No elements found');
        return;
    }
    
    filterButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter art works
            artWorks.forEach(work => {
                const categories = work.getAttribute('data-category');
                const categoryList = categories ? categories.split(' ') : [];
                const shouldShow = filter === 'all' || categoryList.includes(filter);
                
                if (shouldShow) {
                    work.style.visibility = 'visible';
                    work.style.opacity = '1';
                    work.style.height = 'auto';
                    work.style.overflow = 'visible';
                    work.style.maxHeight = 'none';
                    work.classList.remove('filtered-out');
                    work.classList.add('filtered-in');
                } else {
                    work.style.opacity = '0';
                    work.style.height = '0';
                    work.style.overflow = 'hidden';
                    work.style.maxHeight = '0';
                    work.classList.remove('filtered-in');
                    work.classList.add('filtered-out');
                    setTimeout(() => {
                        work.style.visibility = 'hidden';
                    }, 300);
                }
            });
        });
    });
    
    // Show all art works by default
    artWorks.forEach(work => {
        work.style.visibility = 'visible';
        work.style.opacity = '1';
        work.style.height = 'auto';
        work.style.overflow = 'visible';
        work.style.maxHeight = 'none';
        work.classList.remove('filtered-out');
        work.classList.add('filtered-in');
    });
}

// ===== PORTFOLIO TABS (PORTFOLIO.HTML) =====
function initPortfolioTabs() {
    console.log('🔍 Initializing portfolio tabs...');
    
    const viewTabs = document.querySelectorAll('.view-tab');
    const individualView = document.querySelector('.portfolio-individual-view');
    const seriesView = document.querySelector('.portfolio-series-view');
    
    if (viewTabs.length === 0) {
        console.log('⚠️ Portfolio tabs: No tabs found');
        return;
    }
    
    viewTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetView = this.getAttribute('data-view');
            
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide appropriate views
            if (targetView === 'individual') {
                if (individualView) individualView.classList.add('active');
                if (seriesView) seriesView.classList.remove('active');
            } else if (targetView === 'series') {
                if (seriesView) seriesView.classList.add('active');
                if (individualView) individualView.classList.remove('active');
            }
        });
    });
}

// ===== PORTFOLIO SERIES LIGHTBOX (PORTFOLIO.HTML) =====
function initPortfolioSeriesLightbox() {
    console.log('🔍 Initializing portfolio series lightbox...');
    
    const portfolioSeries = {
        'retratos-urbanos': {
            title: 'Retratos Urbanos',
            description: 'Explorando la humanidad en el paisaje urbano contemporáneo',
            images: [
                'images/portfolio/series/retratos-urbanos-01.jpg',
                'images/portfolio/series/retratos-urbanos-02.jpg',
                'images/portfolio/series/retratos-urbanos-03.jpg',
                'images/portfolio/series/retratos-urbanos-04.jpg',
                'images/portfolio/series/retratos-urbanos-05.jpg',
                'images/portfolio/series/retratos-urbanos-06.jpg'
            ]
        },
        'arquitecturas-liquidas': {
            title: 'Arquitecturas Líquidas',
            description: 'Geometrías y texturas que desafían la rigidez del concreto',
            images: [
                'images/portfolio/series/arquitecturas-liquidas-01.jpg',
                'images/portfolio/series/arquitecturas-liquidas-02.jpg',
                'images/portfolio/series/arquitecturas-liquidas-03.jpg',
                'images/portfolio/series/arquitecturas-liquidas-04.jpg',
                'images/portfolio/series/arquitecturas-liquidas-05.jpg'
            ]
        },
        'luz-natural': {
            title: 'Luz Natural',
            description: 'Momentos donde la luz transforma paisajes cotidianos',
            images: [
                'images/portfolio/series/luz-natural-01.jpg',
                'images/portfolio/series/luz-natural-02.jpg',
                'images/portfolio/series/luz-natural-03.jpg',
                'images/portfolio/series/luz-natural-04.jpg'
            ]
        }
    };
    
    // Make functions global
    window.openSeriesLightbox = function(seriesName) {
        const series = portfolioSeries[seriesName];
        if (!series) {
            console.error('Series not found:', seriesName);
            return;
        }
        
        const lightbox = document.getElementById('series-lightbox');
        const image = document.getElementById('series-lightbox-image');
        const title = document.getElementById('series-lightbox-title');
        const description = document.getElementById('series-lightbox-description');
        const current = document.getElementById('series-current');
        const total = document.getElementById('series-total');
        
        if (!lightbox || !image) {
            console.error('Series lightbox elements not found');
            return;
        }
        
        lightbox.dataset.seriesName = seriesName;
        lightbox.dataset.currentIndex = '0';
        lightbox.dataset.totalImages = series.images.length.toString();
        
        image.src = series.images[0];
        title.textContent = series.title;
        description.textContent = series.description;
        current.textContent = '1';
        total.textContent = series.images.length.toString();
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeSeriesLightbox = function() {
        const lightbox = document.getElementById('series-lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
    
    window.navigateSeries = function(direction) {
        const lightbox = document.getElementById('series-lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        const seriesName = lightbox.dataset.seriesName;
        const currentIndex = parseInt(lightbox.dataset.currentIndex);
        const series = portfolioSeries[seriesName];
        
        if (!series) return;
        
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) {
            newIndex = series.images.length - 1;
        } else if (newIndex >= series.images.length) {
            newIndex = 0;
        }
        
        lightbox.dataset.currentIndex = newIndex.toString();
        
        const image = document.getElementById('series-lightbox-image');
        const current = document.getElementById('series-current');
        
        if (image && current) {
            image.src = series.images[newIndex];
            current.textContent = (newIndex + 1).toString();
        }
    };
    
    // Close lightbox when clicking outside
    document.addEventListener('click', function(e) {
        const lightbox = document.getElementById('series-lightbox');
        if (lightbox && e.target === lightbox) {
            closeSeriesLightbox();
        }
    });
}

// ===== LIGHTBOX FUNCTIONALITY (PORTFOLIO.HTML INDIVIDUAL IMAGES) =====
function initLightbox() {
    console.log('🔍 Initializing lightbox...');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (!lightbox || !lightboxImage) {
        console.log('⚠️ Lightbox elements not found');
        return;
    }
    
    // Portfolio images for navigation
    const portfolioImages = [
        'images/portfolio/intimate-01.jpg',
        'images/portfolio/intimate-02.jpg', 
        'images/portfolio/intimate-03.jpg',
        'images/portfolio/urban-01.jpg',
        'images/portfolio/urban-02.jpg',
        'images/portfolio/urban-03.jpg',
        'images/portfolio/nature-01.jpg',
        'images/portfolio/nature-02.jpg',
        'images/portfolio/nature-03.jpg'
    ];
    
    window.currentLightboxIndex = 0;
    window.portfolioImages = portfolioImages;
}

// Global functions for lightbox (make them available)
window.openLightbox = function(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (!lightbox || !lightboxImage) return;
    
    // Find the index of the clicked image
    const index = window.portfolioImages.findIndex(img => img === imageSrc);
    window.currentLightboxIndex = index >= 0 ? index : 0;
    
    // Set the image source
    lightboxImage.src = imageSrc;
    lightboxImage.alt = 'Portfolio image';
    
    // Show lightbox
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
};

window.nextImage = function() {
    const lightboxImage = document.getElementById('lightbox-image');
    if (!lightboxImage) return;
    
    window.currentLightboxIndex = (window.currentLightboxIndex + 1) % window.portfolioImages.length;
    lightboxImage.src = window.portfolioImages[window.currentLightboxIndex];
};

window.prevImage = function() {
    const lightboxImage = document.getElementById('lightbox-image');
    if (!lightboxImage) return;
    
    window.currentLightboxIndex = (window.currentLightboxIndex - 1 + window.portfolioImages.length) % window.portfolioImages.length;
    lightboxImage.src = window.portfolioImages[window.currentLightboxIndex];
};

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORM HANDLING =====
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            showNotification('¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
            
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#212529'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== HAMBURGER MENU =====
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(6px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });
    
    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.featured-item, .blog-item, .portfolio-item, .approach-item, .faq-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('.newsletter-input').value;
        const button = this.querySelector('.newsletter-button');
        const originalText = button.textContent;
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, introduce un email válido.', 'error');
            return;
        }
        
        button.textContent = 'Suscribiendo...';
        button.disabled = true;
        
        setTimeout(() => {
            showNotification('¡Gracias por suscribirte! Te mantendré informado.', 'success');
            this.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    });
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== GLOBAL KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Series lightbox
    const seriesLightbox = document.getElementById('series-lightbox');
    if (seriesLightbox && seriesLightbox.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeSeriesLightbox();
                break;
            case 'ArrowLeft':
                navigateSeries(-1);
                break;
            case 'ArrowRight':
                navigateSeries(1);
                break;
        }
        return;
    }
    
    // Regular lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display !== 'none') {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

// Close lightbox when clicking outside image
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && e.target === lightbox) {
        closeLightbox();
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});
