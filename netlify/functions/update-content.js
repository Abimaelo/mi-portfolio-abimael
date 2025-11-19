// update-content.js - Netlify Function
// Updates site content and writes to GitHub repository

const { Octokit } = require('@octokit/rest');

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

        // Parse request body
        const { section, data } = JSON.parse(event.body);
        
        if (!section || !data) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing section or data' }),
            };
        }

        // Load current data.json
        let currentData;
        try {
            const fileResponse = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'data.json',
                ref: GITHUB_BRANCH,
            });

            if (fileResponse.data.content) {
                const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf8');
                currentData = JSON.parse(fileContent);
            } else {
                currentData = {};
            }
        } catch (error) {
            // If file doesn't exist, create new data structure
            currentData = {
                site: {},
                hero: {},
                about: {},
                portfolio: [],
                blog: [],
                social: [],
                contact: {}
            };
        }

        // Update the specific section
        currentData[section] = data;

        // Write updated data back to GitHub
        const updatedContent = JSON.stringify(currentData, null, 2);
        const base64Content = Buffer.from(updatedContent, 'utf8').toString('base64');

        // Check if file exists to use correct API method
        let response;
        try {
            await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'data.json',
                ref: GITHUB_BRANCH,
            });

            // File exists, use update
            response = await octokit.repos.createOrUpdateFileContents({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'data.json',
                message: `Update ${section} section via CMS`,
                content: base64Content,
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
        } catch (error) {
            // File doesn't exist, create it
            response = await octokit.repos.createOrUpdateFileContents({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'data.json',
                message: `Initial data.json via CMS`,
                content: base64Content,
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
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: `${section} updated successfully`,
                commit: response.data.commit?.sha 
            }),
        };

    } catch (error) {
        console.error('Error updating content:', error);
        
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
