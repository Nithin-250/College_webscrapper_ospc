const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;
  
  // Only handle GET requests
  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Build the backend URL with query parameters
    const backendUrl = new URL('https://college-webscrapper-ospc.onrender.com/api/events');
    
    // Add query parameters if they exist
    if (queryStringParameters) {
      Object.entries(queryStringParameters).forEach(([key, value]) => {
        if (value) backendUrl.searchParams.append(key, value);
      });
    }

    console.log('Proxying request to:', backendUrl.toString());

    // Make the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Netlify-Function-Proxy',
      },
    });

    // Get the response data
    const data = await response.text();
    
    // Return the response with the same status and headers
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};
