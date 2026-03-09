# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| main    | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in BlackRoad SF, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email **security@blackroad.dev** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
3. You will receive acknowledgment within 48 hours
4. We will work with you to understand the scope and develop a fix

## Scope

This policy covers:

- Apex classes and triggers in `force-app/`
- LWC components and their API interactions
- GitHub Actions workflows
- Cloudflare Worker integrations

## Security Best Practices

- Never commit `.env` files or Salesforce auth tokens
- All Apex classes use `with sharing` for field-level security
- API calls to the Cloudflare gateway use HTTPS
- GitHub Actions workflows use SHA-pinned actions
