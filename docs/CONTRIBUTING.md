# Contributing to ChatPDFPilot

Thank you for your interest in contributing to ChatPDFPilot! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/ChatPDFPilot.git
   cd ChatPDFPilot
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** (see README.md)

## 🔧 Development Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:
   ```bash
   npm run dev
   # Test the application thoroughly
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Use interfaces for object shapes
- Prefer `const` over `let` when possible

### React Components
- Use functional components with hooks
- Follow React best practices
- Use proper prop types with TypeScript
- Keep components focused and reusable

### File Organization
- Place components in `apps/web/src/components/`
- Place hooks in `apps/web/src/hooks/`
- Place utilities in `apps/web/src/lib/`
- Place API services in `apps/api/src/services/`

### Naming Conventions
- Use PascalCase for React components
- Use camelCase for functions and variables
- Use kebab-case for file names
- Use SCREAMING_SNAKE_CASE for constants

## 🧪 Testing

- Test all new features thoroughly
- Ensure WebSocket connections work properly
- Test PDF upload and processing
- Verify AI chat functionality
- Test on different browsers and devices

## 📋 Pull Request Guidelines

### PR Title Format
Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: improve code structure`

### PR Description
Include:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Implementation approach
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### Review Process
- Ensure all checks pass
- Address reviewer feedback promptly
- Keep PRs focused and atomic
- Rebase if needed to maintain clean history

## 🐛 Bug Reports

When reporting bugs, include:
- **Environment**: OS, browser, Node.js version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console logs**: Any error messages

## 💡 Feature Requests

For new features:
- Check existing issues first
- Provide clear use case
- Explain the problem it solves
- Consider implementation complexity
- Be open to discussion and alternatives

## 📞 Getting Help

- Check the [README.md](../README.md) first
- Search existing issues
- Join discussions in issues
- Contact maintainers if needed

## 🙏 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

Thank you for contributing to ChatPDFPilot! 🚀
