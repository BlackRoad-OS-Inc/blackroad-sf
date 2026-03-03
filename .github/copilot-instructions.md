# BlackRoad SF - Copilot Instructions

## Project Overview

BlackRoad SF is the Salesforce DX project for BlackRoad OS. It contains custom objects, Apex classes, and Lightning Web Components for agent management, deployment tracking, task orchestration, and memory storage within the Salesforce platform.

**Key components:**

- **Custom Objects**: Agent**c, AgentModel**c, AgentRelationship**c, AgentDeployment**c, AgentTask**c, AgentMemory**c
- **Apex Classes**: Service layer for agent operations
- **Lightning Web Components**: UI components for agent management
- **Configuration**: Scratch org definitions, environment setup

## Architecture

### Salesforce DX Structure

```
force-app/main/default/
├── classes/          # Apex classes
├── lwc/              # Lightning Web Components
├── objects/          # Custom object definitions
└── applications/     # App configurations
```

### Custom Object Model

- **Agent\_\_c**: Core agent configuration (AgentId, Status, Role, Domain, Platform)
- **AgentModel\_\_c**: AI model tracking (HostIP, ModelId, MonthlyCost, OllamaEndpoint)
- **AgentRelationship\_\_c**: Agent-to-agent bonds (BondStrength, Nature, Interactions)
- **AgentDeployment\_\_c**: Deploy tracking (TargetOrg, DeployType, Status, Cost, CommitSHA)
- **AgentTask\_\_c**: Task management (TaskId, AssignedTo, Priority, Model, Result)
- **AgentMemory\_\_c**: Memory storage (MemoryType, MemoryHash, Content, Confidence)

## Build & Test Commands

```bash
# Install dependencies
npm ci

# Test
npm test                    # Run all unit tests
npm run test:unit:watch     # Watch mode
npm run test:unit:coverage  # With coverage

# Lint
npm run lint                # ESLint for LWC/Aura

# Format
npm run prettier            # Format all files
npm run prettier:verify     # Check formatting
```

## Key Conventions

### Apex Standards

- Follow Salesforce Apex best practices
- Use bulkification patterns for triggers
- Document public methods with Apex doc comments
- Use custom exceptions for error handling

### LWC Standards

- Follow Lightning Web Component best practices
- Prefer `@wire` over imperative Apex calls
- Keep components small and focused
- Use custom events for component communication

### Naming Conventions

- Custom objects: `PascalCase__c` (e.g., `AgentTask__c`)
- Custom fields: `PascalCase__c` (e.g., `AgentId__c`)
- Apex classes: `PascalCase` (e.g., `AgentService`)
- LWC components: `camelCase` (e.g., `agentDashboard`)

### Testing

- All Apex classes must have corresponding test classes
- LWC components tested with `sfdx-lwc-jest`
- Minimum 75% code coverage for Apex (Salesforce requirement)

## Environment Variables

- `SFDX_AUTH_URL` - Salesforce authentication URL
- `SALESFORCE_INSTANCE_URL` - Salesforce instance URL
- `SALESFORCE_ACCESS_TOKEN` - Salesforce access token

## Security Considerations

- Never commit `.env` files or Salesforce credentials
- Use named credentials in Salesforce for external callouts
- Follow Salesforce security review guidelines
- Apply CRUD/FLS checks in Apex code
