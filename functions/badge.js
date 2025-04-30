const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    console.log('Received event path:', event.path);
    
    // Parse path parameters - fixed to work with Netlify's path format
    let pathSegments;
    if (event.path.includes('/.netlify/functions/badge/')) {
      pathSegments = event.path.split('/.netlify/functions/badge/')[1];
    } else if (event.path.includes('/badge/')) {
      // Handle direct access to /badge/ path
      pathSegments = event.path.split('/badge/')[1];
    } else {
      // Fallback for direct function calls without the redirect
      pathSegments = event.path.replace('/functions/badge/', '');
    }
    
    if (!pathSegments) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid path format' })
      };
    }
    
    const [packageName, version, filename] = pathSegments.split('/');
    
    console.log('Parsed parameters:', { packageName, version, filename });
    
    if (!packageName || !version || !filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing parameters. Format: /badge/[package]/[version]/[filename]' })
      };
    }

    // Check if the package has attestations
    const attestationUrl = `https://pypi.org/integrity/${packageName}/${version}/${filename}/provenance`;
    
    let hasAttestation = false;
    let publisherInfo = null;
    
    try {
      const response = await axios.get(attestationUrl);
      if (response.status === 200) {
        hasAttestation = true;
        
        // Try to extract publisher info if available
        if (response.data && 
            response.data.attestation_bundles && 
            response.data.attestation_bundles.length > 0) {
          const publisher = response.data.attestation_bundles[0].publisher;
          if (publisher && publisher.kind === 'github') {
            const repo = publisher.claims?.repository?.split('/').pop() || '';
            const workflow = publisher.claims?.workflow?.replace('.yml', '') || '';
            publisherInfo = `${repo}_${workflow}`;
          }
        }
      }
    } catch (error) {
      // Assume no attestation if there's an error
      console.log('Attestation error:', error.message);
      hasAttestation = false;
    }
    
    // Build the shield.io URL
    let shieldUrl;
    if (hasAttestation) {
      const message = publisherInfo ? `Verified_by_${publisherInfo}` : 'Verified';
      shieldUrl = `https://img.shields.io/badge/PyPI_Attestation-${message}-success.svg`;
    } else {
      shieldUrl = `https://img.shields.io/badge/PyPI_Attestation-None-red.svg`;
    }
    
    // Get any query parameters
    const style = event.queryStringParameters?.style || '';
    if (style) {
      shieldUrl += `?style=${style}`;
    }
    
    console.log('Redirecting to:', shieldUrl);
    
    // Redirect to shields.io
    return {
      statusCode: 302,
      headers: {
        Location: shieldUrl,
      },
      body: ''
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
