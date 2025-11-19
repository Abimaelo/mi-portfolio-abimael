// exchange-token.js - Netlify Function
// Exchanges OAuth code for access token

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        // Get environment variables
        const { GITHUB_CLIENT_SECRET } = process.env;
        
        if (!GITHUB_CLIENT_SECRET) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' }),
            };
        }

        // Parse request body
        const { code } = JSON.parse(event.body);
        
        if (!code) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing authorization code' }),
            };
        }

        // Exchange code for token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Token exchange failed', 
                    details: tokenData.error_description 
                }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                access_token: tokenData.access_token,
                token_type: tokenData.token_type,
                scope: tokenData.scope
            }),
        };

    } catch (error) {
        console.error('Error exchanging token:', error);
        
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
