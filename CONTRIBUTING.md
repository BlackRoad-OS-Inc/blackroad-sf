# Contributing to BlackRoad SF

Thank you for contributing to BlackRoad OS. This guide covers conventions for working with the Salesforce metadata in this repository.

## Getting Started

1. **Fork & clone** the repository
2. **Install dependencies:** `npm install`
3. **Create a scratch org** (optional): `sf org create scratch -f config/project-scratch-def.json -a blackroad-dev`
4. **Push source:** `sf project deploy start`

## Branch Naming

| Prefix   | Use                       |
| -------- | ------------------------- |
| `feat/`  | New feature or component  |
| `fix/`   | Bug fix                   |
| `chore/` | Tooling, CI, dependencies |
| `docs/`  | Documentation only        |

## Commit Messages

Use concise, imperative messages:

```
fix: correct repo reference in agentDashboard
feat: add bulk-load dispatch workflow
chore: pin CI actions to SHA
```

## Coding Standards

### Apex

- Use `with sharing` by default
- Bulkify all DML and SOQL
- Prefix test methods with `@IsTest`

### LWC

- Follow `eslint-config-lwc` rules
- Use `@track` only when needed for object/array reactivity
- Write Jest tests for every component in `__tests__/`

### Formatting

- Run `npm run prettier` before committing
- Husky pre-commit hook runs lint-staged automatically

## Pull Request Process

1. Create your branch from `main`
2. Ensure `npm run lint` and `npm test` pass
3. Fill out the PR template completely
4. Request review from `@blackboxprogramming`

## Code of Conduct

Be respectful. Collaborate openly. Ship quality code.
