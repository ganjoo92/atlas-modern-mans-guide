# Security Policy

## Supported Versions

We actively support the following versions of Atlas Modern Man's Guide:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Atlas, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to [security@atlasapp.com] with:
   - A clear description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (if available)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Investigation**: We'll investigate and provide updates within 7 days
- **Resolution**: Critical vulnerabilities will be patched within 30 days
- **Disclosure**: We'll coordinate responsible disclosure after the fix is deployed

### Security Best Practices

When using Atlas:

1. **Environment Variables**: Never commit API keys or secrets to version control
2. **HTTPS**: Always use HTTPS in production deployments
3. **Updates**: Keep dependencies updated using `npm audit`
4. **Access Control**: Implement proper authentication for sensitive features
5. **Data Privacy**: Ensure user data is handled according to privacy laws

### Scope

This security policy covers:
- The Atlas web application
- Docker containers and deployment configurations
- API integrations (Gemini AI, Supabase)
- User data handling and storage

### Out of Scope

- Third-party services (Google AI, Supabase infrastructure)
- User device security
- Social engineering attacks
- Physical security of deployment infrastructure

## Security Features

Atlas includes several security features:

- **Row Level Security**: Database access is restricted per user
- **Input Validation**: All user inputs are sanitized
- **Secure Headers**: Security headers are configured in production
- **Environment Isolation**: Development and production environments are separate
- **Data Encryption**: User data is encrypted at rest and in transit

Thank you for helping keep Atlas secure!