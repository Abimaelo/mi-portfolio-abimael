// Global variables
let siteData = {};
let oauthToken = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadSiteData();
    initializeOAuth();
    renderContent();
    initializeEventListeners();
});

// Load site data from JSON
async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
    } catch (error) {
        console.error('Error loading site data:', error);
        // Fallback to default data if JSON fails to load
        siteData = getDefaultData();
    }
}

// Default data fallback
function getDefaultData() {
    return {
        site: {
            title: "Portfolio Abimael",
            author: "Abimael Ortiz Álvarez",
            description: "Portfolio profesional de Abimael Ortiz Álvarez",
            copyright: "2025 Abimael Ortiz Álvarez. Todos los derechos reservados."
        },
        hero: {
            title: "Hola, soy",
            name: "Abimael Ortiz Álvarez",
            subtitle: "Artista Visual & Fotógrafo",
            description: "Exploro la intersección entre luz, forma y emoción a través de fotografía artística, pintura y medios mixtos.",
            image: "images/profile/about-photo.jpg"
        },
        about: {
            description: "Soy un artista visual apasionado por explorar la naturaleza de la percepción y la emoción a través de diferentes medios artísticos. Mi trabajo abarca desde fotografía conceptual hasta pintura al óleo, siempre buscando esa conexión única entre el observador y la obra.",
            image: "images/profile/about-photo.jpg",
            stats: {
                projects: "50+",
                exhibitions: "15",
                years: "8"
            }
        },
        portfolio: [],
        blog: [],
        social: [],
        contact: {
            email: "abimael@example.com",
            phone: "+1 (555) 123-4567",
            location: "Madrid, España"
        }
    };
}

// Initialize OAuth functionality
function initializeOAuth() {
    // Check for existing token
    oauthToken = localStorage.getItem('oauth_token');
    
    // Admin button click handler
    document.getElementById('adminBtn').addEventListener('click', function() {
        if (oauthToken) {
            // Redirect to admin panel if authenticated
            window.location.href = 'admin.html';
        } else {
            // Show OAuth modal
            showOAuthModal();
        }
    });

    // GitHub login button
    document.getElementById('githubLoginBtn').addEventListener('click', initiateGitHubOAuth);

    // Modal close handlers
    document.querySelector('.oauth-close').addEventListener('click', hideOAuthModal);
    document.getElementById('oauthModal').addEventListener('click', function(e) {
        if (e.target === this) hideOAuthModal();
    });
}

// Show OAuth modal
function showOAuthModal() {
    document.getElementById('oauthModal').style.display = 'block';
}

// Hide OAuth modal
function hideOAuthModal() {
    document.getElementById('oauthModal').style.display = 'none';
}

// Initiate GitHub OAuth flow
function initiateGitHubOAuth() {
    const clientId = 'Ov23liAelcbN51Po10ep'; // This should be replaced with actual client ID
    const redirectUri = encodeURIComponent(window.location.origin + '/callback.html');
    const scope = 'repo'; // Adjust scope as needed
    const state = generateRandomString(32);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    // Store state for verification
    sessionStorage.setItem('oauth_state', state);
    
    // Redirect to GitHub
    window.location.href = githubAuthUrl;
}

// Handle OAuth callback (should be in callback.html)
function handleOAuthCallback(code, state) {
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
        console.error('Invalid state parameter');
        return;
    }

    // Exchange code for token using Netlify Function
    fetch('/.netlify/functions/exchange-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            localStorage.setItem('oauth_token', data.access_token);
            window.location.href = 'admin.html';
        } else {
            console.error('Token exchange failed:', data);
        }
    })
    .catch(error => {
        console.error('OAuth error:', error);
    });
}

// Logout function
function logout() {
    localStorage.removeItem('oauth_token');
    window.location.href = 'index.html';
}

// Generate random string for state parameter
function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Render content dynamically
function renderContent() {
    // Site metadata
    document.getElementById('siteTitle').textContent = siteData.site.title;
    document.getElementById('siteDescription').content = siteData.site.description;
    document.getElementById('siteAuthor').content = siteData.site.author;

    // Navigation
    document.getElementById('navName').textContent = siteData.site.author;

    // Hero section
    document.getElementById('heroTitle').innerHTML = `${siteData.hero.title} <span id="heroName">${siteData.hero.name}</span>`;
    document.getElementById('heroSubtitle').textContent = siteData.hero.subtitle;
    document.getElementById('heroDescription').textContent = siteData.hero.description;
    document.getElementById('heroImage').src = siteData.hero.image;

    // About section
    document.getElementById('aboutDescription').textContent = siteData.about.description;
    document.getElementById('aboutImage').src = siteData.about.image;
    document.getElementById('statProjects').textContent = siteData.about.stats.projects;
    document.getElementById('statExhibitions').textContent = siteData.about.stats.exhibitions;
    document.getElementById('statYears').textContent = siteData.about.stats.years;

    // Contact section
    document.getElementById('contactEmail').textContent = siteData.contact.email;
    document.getElementById('contactPhone').textContent = siteData.contact.phone;

    // Footer
    document.getElementById('footerName').textContent = siteData.site.author;
    document.getElementById('footerDescription').textContent = siteData.hero.subtitle;
    document.getElementById('copyright').textContent = siteData.site.copyright;

    // Social links
    renderSocialLinks();

    // Portfolio
    renderPortfolio();

    // Blog
    renderBlog();
}

// Render social links
function renderSocialLinks() {
    const socialContainer = document.getElementById('socialLinks');
    socialContainer.innerHTML = '';

    siteData.social.forEach(social => {
        const link = document.createElement('a');
        link.href = social.url;
        link.className = 'social-link';
        link.innerHTML = `<i class="${social.icon}"></i>`;
        socialContainer.appendChild(link);
    });
}

// Render portfolio items
function renderPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';

    siteData.portfolio.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item ${item.category}`;
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.image}" class="portfolio-link">Ver Más</a>
            </div>
        `;
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Render blog posts
function renderBlog() {
    const blogGrid = document.getElementById('blogGrid');
    blogGrid.innerHTML = '';

    siteData.blog.forEach(post => {
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';
        blogItem.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-content">
                <h3>${post.title}</h3>
                <p class="blog-date">${post.date}</p>
                <p>${post.excerpt}</p>
                <a href="#" class="blog-link">Leer Más</a>
            </div>
        `;
        blogGrid.appendChild(blogItem);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Portfolio filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            document.querySelectorAll('.portfolio-item').forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// API functions for admin panel
window.SiteAPI = {
    updateContent: async function(section, data) {
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
                // Update local data and re-render
                siteData[section] = data;
                renderContent();
                return true;
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating content:', error);
            return false;
        }
    },

    uploadImage: async function(file, category) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('category', category);

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
    },

    getSiteData: function() {
        return siteData;
    }
};
