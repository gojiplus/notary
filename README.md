# Notary: PyPI Digital Attestation Shield Generation Service

App: https://notarypy.soodoku.workers.devb/badge/{python-library}/{version}/{file}
Example: https://notarypy.soodoku.workers.devb/badge/pydantic/2.7.2/pydantic-2.7.2-py3-none-any.whl

## Securing the Python Package Supply Chain

Notary is a verification service that helps secure your Python projects by providing cryptographic validation for Python packages. This tool addresses critical security gaps in the Python ecosystem, helping to protect against supply chain attacks.

## 🛡️ Why Notary?

The Python supply chain is vulnerable to attacks, including typosquatting, malware in pre-built binaries, and dependency confusion. Attackers increasingly target the software supply chain by manipulating the package installation process and exploiting the trust users place in the Python package ecosystem. 

NotaryPy provides:

- **Package Verification**: Verify the integrity and authenticity of Python packages
- **Badge System**: Easy visual indicators of verified packages
- **API Access**: Integrate verification into your CI/CD pipelines
- **Transparency**: Public records of package verification

## 🚀 Getting Started

### Verify a Package

```bash
curl https://notarypy.netlify.app/verify/PACKAGE_NAME/VERSION/FILENAME
```

### Display a Badge

Add this to your README.md to show your package is verified:

```markdown
[![NotaryPy Verified](https://notarypy.netlify.app/badge/PACKAGE_NAME/VERSION/FILENAME)](https://notarypy.netlify.app/verify/PACKAGE_NAME/VERSION/FILENAME)
```

## 🔧 How It Works

NotaryPy addresses the fact that "checking the integrity [of packages] is not sufficient" by providing both integrity checking and authentication of packages. The service works by:

1. **Verification**: Packages are cryptographically verified using their hash and signature
2. **Validation**: The source and build process of packages are validated
3. **Certification**: Verified packages receive a badge that can be displayed in documentation

This helps defend against attacks like dependency confusion and typosquatting by providing a way to "verify the integrity of the package" beyond simple hash validation.

## 🧩 API Reference

### Verification Endpoint

```
GET /verify/:package/:version/:filename
```

**Response:**
```json
{
  "verified": true,
  "package": "package_name",
  "version": "1.0.0",
  "hash": "sha256:abcdef...",
  "signed_by": "NotaryPy Authority",
  "timestamp": "2025-04-29T12:00:00Z"
}
```

### Badge Endpoint

```
GET /badge/:package/:version/:filename
```

Returns an SVG badge indicating verification status.

## 🔐 Security Considerations

NotaryPy helps address several security issues:

Recent attacks have used tactics like fake dependencies and exploiting the trust in Python package ecosystems. NotaryPy provides an additional layer of verification beyond what standard tools offer.

While tools like pip-audit can scan for "known vulnerabilities," they "cannot guarantee that arbitrary dependency resolutions occur statically." NotaryPy complements these tools with cryptographic verification.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [pip-audit](https://pypi.org/project/pip-audit/): A tool for scanning Python environments for vulnerabilities
- [Notary Project](https://notaryproject.dev/): A set of specifications for securing software supply chains
- [PyPI](https://pypi.org): The Python Package Index

---

Made with ❤️ by GojiPlus
