# Contributing to BlackRoad OS

> Thank you for your interest in contributing to BlackRoad OS!

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behaviors:**
- Trolling, insulting comments, personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could be considered inappropriate

---

## Getting Started

### Types of Contributions

| Type | Description | Difficulty |
|------|-------------|------------|
| 🐛 Bug fixes | Fix reported issues | Easy-Medium |
| 📝 Documentation | Improve docs, fix typos | Easy |
| ✨ Features | Add new functionality | Medium-Hard |
| 🧪 Tests | Add test coverage | Medium |
| 🔧 Tooling | Improve dev experience | Medium |
| 🎨 Design | UI/UX improvements | Medium |

### Good First Issues

Look for issues labeled:
- `good first issue` - Great for newcomers
- `help wanted` - We need help!
- `documentation` - Doc improvements
- `bug` - Confirmed bugs

---

## Development Setup

### Prerequisites

```bash
# Required
node >= 20.0.0
sf CLI (Salesforce CLI)

# Recommended
VS Code with Salesforce Extension Pack
```

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/BlackRoad-OS-Inc/blackroad-sf.git
cd blackroad-sf

# Install dependencies
npm ci

# Set up environment (do not commit any .env* files)
cp .env.example .env.local
# Edit .env.local with your Salesforce credentials
# Ensure .env and .env.* are listed in your .gitignore so secrets are never committed

# Verify setup
npm run lint
npm test
```

---

## Making Changes

### Branch Naming

```
feature/short-description    # New features
fix/issue-number-description # Bug fixes
docs/what-changed           # Documentation
refactor/what-changed       # Code refactoring
test/what-testing           # Test additions
```

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(lwc): add AgentDashboard component

fix(apex): resolve SOQL governor limit in AgentService
Closes #123

docs(readme): update installation instructions
```

### Code Changes Workflow

```
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Run linting & tests
7. Commit with good messages
8. Push to your fork
9. Open a Pull Request
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### Review Process

1. **Automated checks** run (lint, test, build)
2. **Code review** by maintainer
3. **Changes requested** or **approved**
4. **Merged** to main branch

### Review Timeline

| PR Size | Expected Review Time |
|---------|---------------------|
| Small (<100 lines) | 1-2 days |
| Medium (100-500 lines) | 2-5 days |
| Large (>500 lines) | 5-10 days |

---

## Coding Standards

### Apex

```apex
// Follow Salesforce Apex conventions
// Use bulkification patterns
// Document public methods with comments

/**
 * Creates a new agent record with the specified configuration.
 * @param config Agent configuration options
 * @return The created Agent__c record
 */
public static Agent__c createAgent(AgentConfig config) {
    // Implementation
}
```

### Lightning Web Components

```javascript
// Use LWC best practices
// Prefer @wire over imperative calls
// Keep components small and focused

/**
 * Displays agent status dashboard.
 * @fires agentselected - When an agent is selected
 */
export default class AgentDashboard extends LightningElement {
    @wire(getAgents)
    agents;
}
```

### General Guidelines

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **Single Responsibility**: One thing per function/class
- **Meaningful Names**: Clear, descriptive identifiers

---

## Testing Guidelines

### Writing Tests

```javascript
describe('AgentDashboard', () => {
    it('should display agent list', () => {
        const element = createElement('c-agent-dashboard', {
            is: AgentDashboard
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const items = element.shadowRoot.querySelectorAll('li');
            expect(items.length).toBeGreaterThan(0);
        });
    });
});
```

### Running Tests

```bash
npm test                    # Run all unit tests
npm run test:unit:watch     # Watch mode
npm run test:unit:coverage  # With coverage
```

---

## Documentation

### What to Document

- **README.md**: Project overview, quick start
- **Code comments**: Complex logic only
- **Apex doc comments**: All public methods

### Documentation Style

- Use clear, concise language
- Include code examples
- Keep examples up to date
- Use proper formatting

---

## Community

### Communication Channels

| Channel | Purpose |
|---------|---------|
| GitHub Issues | Bug reports, features |
| GitHub Discussions | Questions, ideas |

### Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Open a new issue

---

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

*Thank you for contributing to BlackRoad OS! 🖤🛣️*
