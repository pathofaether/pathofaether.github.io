// Netlify serverless function to fetch horoscope data
// This bypasses CORS by making the API call server-side

exports.handler = async (event, context) => {
  // Get the sign from query parameters
  const sign = event.queryStringParameters?.sign;
  
  if (!sign) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing sign parameter' })
    };
  }

  const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  if (!validSigns.includes(sign.toLowerCase())) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid zodiac sign' })
    };
  }

  try {
    // Call the Aztro API
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error fetching horoscope:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch horoscope',
        details: error.message 
      })
    };
  }
};
