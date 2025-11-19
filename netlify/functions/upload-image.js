// upload-image.js - Netlify Function
// Handles image uploads and stores them in the repository

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Verify OAuth token
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }),
            };
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const octokit = new Octokit({
            auth: token,
        });

        // Get environment variables
        const { 
            GITHUB_OWNER, 
            GITHUB_REPO, 
            GITHUB_BRANCH = 'main' 
        } = process.env;

        if (!GITHUB_OWNER || !GITHUB_REPO) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' }),
            };
        }

        // Parse multipart form data
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        if (!contentType.includes('multipart/form-data')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Content-Type must be multipart/form-data' }),
            };
        }

        // Get the boundary from content-type
        const boundary = contentType.split('boundary=')[1];
        if (!boundary) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid multipart form data' }),
            };
        }

        // Parse form data manually (simple version)
        const body = event.body;
        const parts = body.split(`--${boundary}`);
        
        let imageData = null;
        let filename = null;
        let category = 'general';

        for (const part of parts) {
            if (part.includes('Content-Disposition: form-data; name="image"')) {
                // Extract image data
                const lines = part.split('\r\n');
                let dataStart = false;
                let imageBuffer = [];

                for (const line of lines) {
                    if (dataStart && line.trim() && !line.includes('--')) {
                        imageBuffer.push(line);
                    } else if (line.includes('filename=')) {
                        filename = line.split('filename="')[1].split('"')[0];
                    }
                    dataStart = true;
                }

                if (imageBuffer.length > 0) {
                    imageData = Buffer.from(imageBuffer.join('\r\n'), 'utf8');
                }
            } else if (part.includes('Content-Disposition: form-data; name="category"')) {
                const lines = part.split('\r\n');
                for (const line of lines) {
                    if (line.trim() && !line.startsWith('--') && !line.includes('Content-')) {
                        category = line.trim();
                        break;
                    }
                }
            }
        }

        if (!imageData || !filename) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing image data or filename' }),
            };
        }

        // Generate unique filename to avoid conflicts
        const fileExtension = path.extname(filename);
        const baseName = path.basename(filename, fileExtension);
        const timestamp = Date.now();
        const uniqueFilename = `${baseName}_${timestamp}${fileExtension}`;

        // Determine target path based on category
        let targetPath;
        switch (category) {
            case 'portfolio':
                targetPath = `images/portfolio/${uniqueFilename}`;
                break;
            case 'blog':
                targetPath = `images/blog/${uniqueFilename}`;
                break;
            case 'profile':
                targetPath = `images/profile/${uniqueFilename}`;
                break;
            default:
                targetPath = `images/uploads/${uniqueFilename}`;
        }

        // Convert image data to base64
        const base64Image = Buffer.from(imageData).toString('base64');

        // Upload to GitHub
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: targetPath,
            message: `Upload image: ${uniqueFilename}`,
            content: base64Image,
            branch: GITHUB_BRANCH,
            committer: {
                name: 'Portfolio CMS',
                email: 'cms@portfolio.com'
            },
            author: {
                name: 'Portfolio CMS',
                email: 'cms@portfolio.com'
            }
        });

        // Generate public URL
        const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${targetPath}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                url: imageUrl,
                path: targetPath,
                filename: uniqueFilename,
                message: 'Image uploaded successfully'
            }),
        };

    } catch (error) {
        console.error('Error uploading image:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message
            }),
        };
    }
};
