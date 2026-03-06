# BlackRoad SF

Salesforce metadata repository for **BlackRoad OS** — an AI agent orchestration platform that manages 193+ agents across Cloudflare Workers and a local Raspberry Pi fleet running Ollama. Everything runs at **$0/month** using Salesforce Developer Edition (free forever), free-tier workers, and your own hardware.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Salesforce Developer Edition (this repo)                   │
│  ├── Agent__c            — 193+ agent registry              │
│  ├── AgentTask__c        — task queue & tracking            │
│  ├── AgentDeployment__c  — deployment log                   │
│  ├── AgentMemory__c      — PS-SHA∞ memory chain             │
│  ├── AgentModel__c       — Ollama model catalog             │
│  └── AgentRelationship__c — agent bond graph                │
├─────────────────────────────────────────────────────────────┤
│  LWC: Agent Dashboard (control center UI)                   │
│  Apex: AgentRegistryService (CRUD, bulk load, memory)       │
├─────────────────────────────────────────────────────────────┤
│  Cloudflare Workers Gateway                                 │
│  → blackroad-agents.blackroad.workers.dev                   │
├─────────────────────────────────────────────────────────────┤
│  Pi Fleet (Hailo-8 + Ollama)                                │
│  → Octavia (192.168.x.38) · Lucidia (192.168.x.81)          │
│  → Cecilia (192.168.x.89)                                   │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Clone
git clone https://github.com/BlackRoad-OS-Inc/blackroad-sf.git
cd blackroad-sf

# Install dependencies
npm install

# Lint
npm run lint

# Run LWC Jest tests
npm test

# Format code
npm run prettier
```

### Salesforce Org Setup

```bash
# Authenticate to your org
sf org login web --alias blackroad-dev

# Create a scratch org (optional)
sf org create scratch -f config/project-scratch-def.json -a blackroad-scratch -d 30

# Deploy metadata
sf project deploy start --target-org blackroad-dev

# Open the org
sf org open --target-org blackroad-dev
```

## Project Structure

```
blackroad-sf/
├── force-app/main/default/
│   ├── classes/          # Apex — AgentRegistryService
│   ├── lwc/              # Lightning Web Components
│   │   └── agentDashboard/
│   │       ├── agentDashboard.js
│   │       ├── agentDashboard.html
│   │       ├── agentDashboard.css
│   │       └── __tests__/
│   ├── objects/          # Custom objects (Agent__c, etc.)
│   └── applications/    # Lightning apps
├── .github/
│   ├── workflows/        # CI, automerge, CF dispatch
│   ├── ISSUE_TEMPLATE/   # Bug, feature, agent task, infra
│   └── dependabot.yml
├── config/               # Scratch org definition
├── scripts/              # Apex & SOQL scripts
└── package.json          # Node tooling (ESLint, Jest, Prettier)
```

## CI / Workflows

| Workflow        | Trigger           | Purpose                                     |
| --------------- | ----------------- | ------------------------------------------- |
| **CI**          | Push to main, PRs | Lint + LWC Jest tests on `ubuntu-latest`    |
| **Automerge**   | PR opened         | Auto-squash-merge Dependabot & Copilot PRs  |
| **CF Dispatch** | Manual            | Dispatch tasks to Cloudflare Worker gateway |

All GitHub Actions are pinned to commit SHAs for supply-chain security.

## Local Ollama Setup

The Pi fleet runs [Ollama](https://ollama.com) for local inference. To test locally:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the default model
ollama pull qwen2.5:7b

# Verify
ollama list
```

The Agent Dashboard LWC communicates with the Pi fleet via the Cloudflare Workers gateway.

## Related Repositories

| Repo                                                                         | Purpose                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------- |
| [blackroad-operator](https://github.com/BlackRoad-OS-Inc/blackroad-operator) | Infrastructure operator & universe sync  |
| [blackroad-agents](https://github.com/BlackRoad-OS-Inc/blackroad-agents)     | Agent catalog & Cloudflare Worker source |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and PR process.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

See [LICENSE](LICENSE) for details.
