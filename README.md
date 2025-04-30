# Notary: PyPI Digital Attestation Shield Generation Service

Example: https://notarypy.soodoku.workers.devb/badge/pydantic/2.7.2/pydantic-2.7.2-py3-none-any.whl

# NotaryPy Badge Generator

A badge generator for Python package attestations on PyPI, deployed as a Cloudflare Worker.

## What it does

This service generates badges that indicate whether a Python package on PyPI has provenance attestations. It uses Shields.io to render the badges and provides a simple API endpoint to check attestation status.

## Usage

Add a badge to your README by using this URL format:

```markdown
![PyPI Attestation](https://notarypy.soodoku.workers.dev/badge/PACKAGE_NAME/VERSION/FILENAME)
```

For example:

```markdown
![PyPI Attestation](https://notarypy.soodoku.workers.dev/badge/pydantic/2.7.2/pydantic-2.7.2-py3-none-any.whl)
```

## Badge States

- **Verified** (green): Package has provenance attestations
- **None** (red): Package does not have provenance attestations

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account

### Local Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the worker locally:
   ```
   npm run dev
   ```
4. Test the badge endpoint at http://localhost:8787/badge/pydantic/2.7.2/pydantic-2.7.2-py3-none-any.whl

### Deployment

Deploy to Cloudflare Workers:

```
npm run deploy
```

## License

MIT

Made with ❤️ by GojiPlus
