# blackroad-sf

> Salesforce platform integration, custom objects, Lightning Web Components, and Apex services for BlackRoad OS.

[![CI](https://github.com/BlackRoad-OS-Inc/blackroad-sf/actions/workflows/ci.yml/badge.svg)](https://github.com/BlackRoad-OS-Inc/blackroad-sf/actions/workflows/ci.yml)

## Overview

The Salesforce DX project for BlackRoad OS. Contains custom objects for agent management, deployment tracking, task orchestration, and memory storage — all wired into the BlackRoad agent ecosystem.

## Structure

```
blackroad-sf/
├── force-app/main/default/
│   ├── classes/          # Apex classes
│   ├── lwc/              # Lightning Web Components
│   ├── objects/           # Custom objects (Agent, AgentModel, etc.)
│   └── applications/     # App configurations
├── config/               # Scratch org definitions
├── scripts/              # Apex & SOQL samples
└── .github/              # CI/CD & templates
```

## Quick Start

```bash
# Install dependencies
npm ci

# Lint
npm run lint

# Run tests
npm test

# Format code
npm run prettier
```

## Custom Objects

| Object | Description |
|--------|-------------|
| `Agent__c` | Agent configurations (status, role, domain, platform) |
| `AgentModel__c` | AI model tracking (host, costs, endpoints) |
| `AgentRelationship__c` | Agent-to-agent relationships |
| `AgentDeployment__c` | Deployment tracking (target, status, cost) |
| `AgentTask__c` | Task management (priority, assignment, results) |
| `AgentMemory__c` | Memory storage (type, content, confidence) |

## Development

```bash
# Create a scratch org
sf org create scratch -f config/project-scratch-def.json -a blackroad-dev

# Push source
sf project deploy start

# Run Apex tests
sf apex run test --code-coverage
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

© BlackRoad OS, Inc. — All rights reserved. Proprietary.
