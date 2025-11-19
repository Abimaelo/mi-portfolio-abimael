// Global variables
let siteData = {};
let oauthToken = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    initializeOAuth();
    initializeEventListeners();
});

// Site data loading not needed for static template
// Data is embedded in HTML and admin functions
async function loadSiteData() {
    // Placeholder function for API compatibility
    console.log('Site data already embedded in HTML');
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
    const clientId = 'YOUR_CLIENT_ID_HERE'; // This should be replaced with actual client ID
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

// Content rendering not needed for static template
// All content is defined directly in HTML
function renderContent() {
    // This function is kept for API compatibility
    // but content is already rendered in the HTML
    // No action needed - all content is static in HTML
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
                // Update local data
                siteData[section] = data;
                console.log(`Content updated for section: ${section}`);
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
