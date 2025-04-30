/**
 * NotaryPy Badge Generator - Cloudflare Worker
 * 
 * Generates badges for Python package attestations on PyPI
 * Redirects to shields.io for badge rendering
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Check if it's a badge request
      if (!path.startsWith('/badge/')) {
        return new Response('NotaryPy Badge Generator - Use /badge/package/version/filename', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // Parse path parameters
      const pathSegments = path.replace('/badge/', '').split('/');
      
      if (pathSegments.length < 3) {
        return new Response(JSON.stringify({ 
          error: 'Missing parameters. Format: /badge/[package]/[version]/[filename]' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const [packageName, version, filename] = pathSegments;
      
      // Check if the package has attestations
      const attestationUrl = `https://pypi.org/integrity/${packageName}/${version}/${filename}/provenance`;
      
      let hasAttestation = false;
      let publisherInfo = null;
      
      try {
        const response = await fetch(attestationUrl);
        if (response.status === 200) {
          hasAttestation = true;
          
          // Try to extract publisher info if available
          const data = await response.json();
          if (data && 
              data.attestation_bundles && 
              data.attestation_bundles.length > 0) {
            const publisher = data.attestation_bundles[0].publisher;
            if (publisher && publisher.kind === 'github') {
              const repo = publisher.claims?.repository?.split('/').pop() || '';
              const workflow = publisher.claims?.workflow?.replace('.yml', '') || '';
              publisherInfo = `${repo}_${workflow}`;
            }
          }
        }
      } catch (error) {
        // Assume no attestation if there's an error
        console.error('Attestation check error:', error.message);
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
      const style = url.searchParams.get('style');
      if (style) {
        shieldUrl += `?style=${style}`;
      }
      
      // Log request details for monitoring
      console.log({
        packageName,
        version,
        filename,
        hasAttestation,
        publisherInfo,
        redirectUrl: shieldUrl
      });
      
      // Redirect to shields.io
      return Response.redirect(shieldUrl, 302);
    } catch (error) {
      console.error('Unexpected error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};