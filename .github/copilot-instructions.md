# Copilot Instructions — BlackRoad SF

This is the Salesforce metadata repository for **BlackRoad OS**, an AI agent orchestration platform.

## Repository Context

- **Platform:** Salesforce (Developer Edition, free forever)
- **API Version:** 65.0
- **Key objects:** `Agent__c`, `AgentTask__c`, `AgentDeployment__c`, `AgentMemory__c`, `AgentModel__c`, `AgentRelationship__c`
- **LWC components:** agentDashboard (main control center)
- **Apex services:** AgentRegistryService (agent CRUD, task logging, memory, deployments)
- **External integrations:** Cloudflare Workers gateway, Pi fleet (Ollama)

## Conventions

- Apex: `with sharing`, bulkified DML/SOQL, AgentId\_\_c as external ID
- LWC: `@wire` for Apex, `@track` for reactive objects, jest tests in `__tests__/`
- CI: GitHub Actions on `ubuntu-latest`, SHA-pinned actions
- Cost: Everything runs at $0 — Dev Edition + free-tier workers + local Pi hardware

## Key References

- Operator repo: `BlackRoad-OS-Inc/blackroad-operator`
- Agents repo: `BlackRoad-OS-Inc/blackroad-agents`
- Gateway: `https://blackroad-agents.blackroad.workers.dev`
