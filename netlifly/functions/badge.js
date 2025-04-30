const axios = require('axios');

exports.handler = async (event) => {
  try {
    console.log('Received path:', event.path);
    console.log('Received query:', event.queryStringParameters);

    let packageName, version, filename;

    if (event.queryStringParameters?.package) {
      // Fallback for query param input
      packageName = event.queryStringParameters.package;
      version = event.queryStringParameters.version;
      filename = event.queryStringParameters.filename;
    } else {
      // Existing path-based logic
      let pathSegments;
      if (event.path.includes('/.netlify/functions/badge/')) {
        pathSegments = event.path.split('/.netlify/functions/badge/')[1];
      } else if (event.path.includes('/badge/')) {
        pathSegments = event.path.split('/badge/')[1];
      } else {
        pathSegments = event.path.replace('/functions/badge/', '');
      }

      const segments = pathSegments?.split('/');
      [packageName, version, filename] = segments || [];
    }

    if (!packageName || !version || !filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing parameters: package, version, filename' })
      };
    }

    // === Everything below here stays the same ===

    const attestationUrl = `https://pypi.org/integrity/${packageName}/${version}/${filename}/provenance`;
    let hasAttestation = false;
    let publisherInfo = null;

    try {
      const response = await axios.get(attestationUrl);
      if (response.status === 200) {
        hasAttestation = true;
        const publisher = response.data?.attestation_bundles?.[0]?.publisher;
        if (publisher?.kind === 'github') {
          const repo = publisher.claims?.repository?.split('/').pop() || '';
          const workflow = publisher.claims?.workflow?.replace('.yml', '') || '';
          publisherInfo = `${repo}_${workflow}`;
        }
      }
    } catch (error) {
      console.log('Attestation fetch error:', error.message);
    }

    let shieldUrl = hasAttestation
      ? `https://img.shields.io/badge/PyPI_Attestation-${publisherInfo ? `Verified_by_${publisherInfo}` : 'Verified'}-success.svg`
      : `https://img.shields.io/badge/PyPI_Attestation-None-red.svg`;

    if (event.queryStringParameters?.style) {
      shieldUrl += `?style=${event.queryStringParameters.style}`;
    }

    return {
      statusCode: 302,
      headers: {
        Location: shieldUrl
      },
      body: ''
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error', details: err.message })
    };
  }
};
