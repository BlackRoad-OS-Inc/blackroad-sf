# blackroad-sf

> Salesforce platform integration, custom objects, Lightning Web Components, and Apex services for BlackRoad OS.

[![CI](https://github.com/BlackRoad-OS-Inc/blackroad-sf/actions/workflows/ci.yml/badge.svg)](https://github.com/BlackRoad-OS-Inc/blackroad-sf/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://BlackRoad-OS-Inc.github.io/blackroad-sf/)

## Overview

The Salesforce DX project for BlackRoad OS. Contains custom objects for agent management, deployment tracking, task orchestration, and memory storage — all wired into the BlackRoad agent ecosystem powered by **local Ollama** running on Pi fleet hardware.

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
├── docs/                 # GitHub Pages site
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

## Local Ollama Execution

BlackRoad agents run **100% locally** on your Raspberry Pi fleet via [Ollama](https://ollama.ai). No cloud AI spend.

### Prerequisites

```bash
# Install Ollama on your Pi (ARM64)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the models used by BlackRoad agents
ollama pull llama3        # Lucidia (Coordinator)
ollama pull mistral       # Octavia (Compute)
ollama pull codellama     # Alice (Router / Code)
```

### Pi Fleet Setup

| Agent   | Host         | Model   | Port  |
| ------- | ------------ | ------- | ----- |
| Lucidia | 192.168.4.81 | llama3  | 11434 |
| Octavia | 192.168.4.38 | mistral | 11434 |

Agents are exposed via **Cloudflare Tunnel** so Salesforce can reach them without opening firewall ports:

```bash
# Install cloudflared
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared.deb

# Authenticate and create tunnel
cloudflared tunnel login
cloudflared tunnel create blackroad-pi
cloudflared tunnel route dns blackroad-pi agents.blackroad.io

# Run tunnel (add to systemd for persistence)
cloudflared tunnel run blackroad-pi
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                  | Description                   |
| ------------------------- | ----------------------------- |
| `SFDX_AUTH_URL`           | Salesforce authentication URL |
| `SALESFORCE_INSTANCE_URL` | Your Salesforce org URL       |
| `SALESFORCE_ACCESS_TOKEN` | Salesforce access token       |

> **Never commit `.env` files.** They are listed in `.gitignore`.

## Custom Objects

| Object                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `Agent__c`             | Agent configurations (status, role, domain, platform) |
| `AgentModel__c`        | AI model tracking (host, costs, Ollama endpoints)     |
| `AgentRelationship__c` | Agent-to-agent relationships                          |
| `AgentDeployment__c`   | Deployment tracking (target, status, cost)            |
| `AgentTask__c`         | Task management (priority, assignment, results)       |
| `AgentMemory__c`       | Memory storage (type, content, confidence)            |

## Development

```bash
# Create a scratch org
sf org create scratch -f config/project-scratch-def.json -a blackroad-dev

# Push source
sf project deploy start

# Run Apex tests
sf apex run test --code-coverage
```

## Dynamic Dashboard

The `agentDashboard` LWC component auto-refreshes from live Salesforce data via `@wire` adapters:

- **Active agents** — polled from `AgentRegistryService.getActiveAgents`
- **Pending tasks** — from `AgentRegistryService.getPendingTasks`
- **Stats** — from `AgentRegistryService.getDashboardStats`

The "Sync from Pi Fleet" button polls Ollama endpoints on your Pi nodes and updates `AgentModel__c` records in real-time.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Security

See [SECURITY.md](SECURITY.md)

---

© BlackRoad OS, Inc. — All rights reserved. Proprietary.
