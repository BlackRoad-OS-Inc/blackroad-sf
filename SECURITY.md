# Security Policy

> Security is a top priority for BlackRoad OS

---

## 🔐 Supported Versions

This project currently identifies as version `1.0.0` and does not maintain multiple active major versions.

- ✅ The latest published release is supported for security issues.
- ⚠️ Older releases may receive security fixes at the maintainers' discretion.

---
## 🚨 Reporting a Vulnerability

### DO NOT

- ❌ Open a public GitHub issue
- ❌ Post on social media
- ❌ Share in public channels

### DO

1. **Email** security@blackroad.io (or blackroad.systems@gmail.com)
2. **Encrypt** using our PGP key (below)
3. **Include** detailed information

### What to Include

```
Subject: [SECURITY] Brief description

1. Description of vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)
5. Your contact info (for follow-up)
```

### PGP Key

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[Contact us for PGP key]
-----END PGP PUBLIC KEY BLOCK-----
```

### Response Timeline

| Phase | Timeline |
|-------|----------|
| Initial response | 24 hours |
| Triage & assessment | 72 hours |
| Fix development | 7-14 days |
| Coordinated disclosure | 90 days |

---

## 🛡️ Security Measures

### Authentication

| Component | Method |
|-----------|--------|
| API | JWT + API Keys |
| Web | OAuth2 / OIDC |
| CLI | Token-based |
| Agent-to-Agent | mTLS |

### Encryption

| Data State | Method |
|------------|--------|
| In Transit | TLS 1.3 |
| At Rest | AES-256-GCM |
| Secrets | HashiCorp Vault |

### Access Control

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCESS CONTROL MODEL                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ROLE              PERMISSIONS                              │
│  ──────────────────────────────────────────────────────────│
│  Admin             Full access to all resources             │
│  Developer         Read/write to assigned repos             │
│  Operator          Deploy, monitor, manage agents           │
│  Viewer            Read-only access                         │
│  Agent             Scoped to assigned tasks                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Security Scanning

### Automated Scans

| Scan Type | Frequency | Tool |
|-----------|-----------|------|
| SAST | Every PR | CodeQL |
| DAST | Weekly | OWASP ZAP |
| Dependencies | Daily | Dependabot |
| Secrets | Every commit | GitLeaks |

---

## 🔒 Security Best Practices

### For Contributors

1. **Never commit secrets**
   ```bash
   # Use environment variables
   export SFDX_AUTH_URL="your-url"

   # Or .env files (gitignored)
   echo "SFDX_AUTH_URL=your-url" >> .env
   ```

2. **Validate all input**

3. **Keep dependencies updated**
   ```bash
   # Check for updates
   npm audit
   ```

### For Operators

1. **Rotate credentials regularly**
2. **Use least-privilege access**
3. **Enable audit logging**
4. **Monitor for anomalies**
5. **Keep systems patched**

---

## 📞 Security Contacts

| Role | Contact |
|------|---------|
| Security Lead | security@blackroad.io |
| Backup | blackroad.systems@gmail.com |
| Emergency | [On-call rotation] |

---

*Last updated: 2026-02-28*
