# Contributing to Modern Teletext

Thank you for your interest in contributing to Modern Teletext! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Areas for Contribution](#areas-for-contribution)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or discriminatory comments
- Personal attacks or insults
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase CLI
- A Firebase project (for testing)
- Basic knowledge of TypeScript, React, and Next.js

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/modern-teletext.git
   cd modern-teletext
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/modern-teletext.git
   ```

### Set Up Development Environment

1. Install dependencies:
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure Firebase:
   ```bash
   firebase use --add
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## Development Process

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring
- `test/*`: Test additions or improvements

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/my-awesome-feature
```

### Making Changes

1. Make your changes in small, logical commits
2. Write or update tests for your changes
3. Ensure all tests pass: `npm test`
4. Run linter: `npm run lint`
5. Test manually in the browser

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# If there are conflicts, resolve them and continue
git rebase --continue
```

## Coding Standards

### TypeScript

- **Strict Mode**: Always use TypeScript strict mode
- **Type Safety**: Avoid `any` types; use proper type definitions
- **Interfaces**: Prefer interfaces over types for object shapes
- **Null Safety**: Handle null/undefined explicitly

**Example:**
```typescript
// Good
interface PageData {
  id: string;
  title: string;
  rows: string[];
}

function getPage(id: string): PageData | null {
  // Implementation
}

// Bad
function getPage(id: any): any {
  // Implementation
}
```

### React Components

- **Functional Components**: Use functional components with hooks
- **Props Interface**: Define props interface for all components
- **Naming**: Use PascalCase for components
- **File Structure**: One component per file

**Example:**
```typescript
interface TeletextScreenProps {
  page: TeletextPage;
  loading: boolean;
  theme: ThemeConfig;
}

export function TeletextScreen({ page, loading, theme }: TeletextScreenProps) {
  // Implementation
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TeletextScreen` |
| Functions | camelCase | `wrapText()` |
| Variables | camelCase | `pageNumber` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_NUMBER` |
| Types/Interfaces | PascalCase | `TeletextPage` |
| Files (components) | PascalCase | `TeletextScreen.tsx` |
| Files (utilities) | kebab-case | `teletext-utils.ts` |

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line Length**: Max 100 characters (soft limit)
- **Trailing Commas**: Use in multi-line arrays/objects

**Example:**
```typescript
const page: TeletextPage = {
  id: '100',
  title: 'Main Index',
  rows: [
    'MAIN INDEX                      100',
    '────────────────────────────────────',
  ],
  links: [
    { label: 'News', targetPage: '200', color: 'red' },
  ],
};
```

### Project-Specific Conventions

#### 40×24 Grid Constraint

All pages must render exactly 24 rows of 40 characters:

```typescript
// Validate page dimensions
function validatePage(page: TeletextPage): boolean {
  if (page.rows.length !== 24) return false;
  return page.rows.every(row => row.length <= 40);
}
```

#### Page Number Validation

Valid page numbers are 100-899:

```typescript
function isValidPageNumber(pageId: string): boolean {
  const num = parseInt(pageId, 10);
  return num >= 100 && num <= 899;
}
```

#### Error Handling

Always return teletext-formatted error pages:

```typescript
function createErrorPage(error: string): TeletextPage {
  return {
    id: '404',
    title: 'Error',
    rows: [
      'ERROR                          404',
      '────────────────────────────────────',
      '',
      error,
      '',
      // ... fill to 24 rows
    ],
    links: [
      { label: 'Index', targetPage: '100', color: 'red' },
    ],
  };
}
```

## Testing Guidelines

### Test Structure

```
├── __tests__/
│   ├── ComponentName.test.tsx    # Component tests
│   ├── utilityName.test.ts       # Utility tests
│   └── integration.test.ts       # Integration tests
```

### Writing Tests

#### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TeletextScreen } from '../TeletextScreen';

describe('TeletextScreen', () => {
  it('renders exactly 24 rows', () => {
    const page = createMockPage();
    render(<TeletextScreen page={page} loading={false} />);
    
    const rows = screen.getAllByTestId('teletext-row');
    expect(rows).toHaveLength(24);
  });

  it('applies theme colors correctly', () => {
    const page = createMockPage();
    const theme = createMockTheme();
    
    render(<TeletextScreen page={page} loading={false} theme={theme} />);
    
    const screen = screen.getByTestId('teletext-screen');
    expect(screen).toHaveStyle({ backgroundColor: theme.colors.background });
  });
});
```

#### Utility Tests

```typescript
import { wrapText } from '../teletext-utils';

describe('wrapText', () => {
  it('wraps long text at word boundaries', () => {
    const input = 'This is a very long sentence that exceeds forty characters';
    const result = wrapText(input, 40);
    
    expect(result.every(line => line.length <= 40)).toBe(true);
  });

  it('hard-wraps words longer than 40 characters', () => {
    const input = 'Supercalifragilisticexpialidocious';
    const result = wrapText(input, 40);
    
    expect(result[0].length).toBe(40);
  });

  it('preserves multiple spaces', () => {
    const input = 'Text    with    spaces';
    const result = wrapText(input, 40);
    
    expect(result[0]).toContain('    ');
  });
});
```

#### Adapter Tests

```typescript
import { NewsAdapter } from '../NewsAdapter';

describe('NewsAdapter', () => {
  let adapter: NewsAdapter;

  beforeEach(() => {
    adapter = new NewsAdapter();
  });

  it('returns valid page structure', async () => {
    const page = await adapter.getPage('201');
    
    expect(page.id).toBe('201');
    expect(page.rows).toHaveLength(24);
    expect(page.rows.every(row => row.length <= 40)).toBe(true);
  });

  it('handles API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));
    
    const page = await adapter.getPage('201');
    
    expect(page.title).toContain('Error');
  });
});
```

### Test Coverage

- **Minimum Coverage**: 80% overall
- **Critical Paths**: 90%+ coverage
- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage

Run coverage report:
```bash
npm run test:coverage
```

### Testing Checklist

Before submitting a PR:
- [ ] All tests pass
- [ ] New features have tests
- [ ] Edge cases are tested
- [ ] Error conditions are tested
- [ ] Coverage meets minimum requirements
- [ ] No console errors or warnings

## Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config)
- `perf`: Performance improvements

### Examples

```
feat(news): add pagination for news articles

Implement pagination to handle news content that exceeds 24 rows.
Split long articles across multiple pages with navigation links.

Closes #123
```

```
fix(teletext): correct text wrapping at word boundaries

Fix issue where words were incorrectly split mid-word when wrapping
text to 40-character width. Now properly detects word boundaries.

Fixes #456
```

```
docs(api): update API documentation with new endpoints

Add documentation for POST /api/ai endpoint including request/response
examples and error codes.
```

### Commit Best Practices

- **Atomic Commits**: One logical change per commit
- **Clear Messages**: Describe what and why, not how
- **Present Tense**: "Add feature" not "Added feature"
- **Imperative Mood**: "Fix bug" not "Fixes bug"
- **Reference Issues**: Include issue numbers when applicable

## Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Update documentation**:
   - Update README if adding features
   - Add JSDoc comments to new functions
   - Create usage guides for new adapters

4. **Test manually**:
   - Test in development mode
   - Test with Firebase emulators
   - Test edge cases

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/my-awesome-feature
   ```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Testing**: How you tested the changes
   - **Screenshots**: For UI changes
   - **Related Issues**: Link to related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added for new functionality
- [ ] All tests pass
```

### Review Process

1. **Automated Checks**: CI runs tests and linting
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"
git push origin feature/my-awesome-feature
```

## Areas for Contribution

### High Priority

- **Bug Fixes**: Fix reported issues
- **Performance**: Optimize loading and rendering
- **Accessibility**: Improve keyboard navigation
- **Test Coverage**: Increase test coverage
- **Documentation**: Improve guides and examples

### New Features

- **New Adapters**: Add support for new content sources
- **Themes**: Create new color palettes
- **Games**: Implement new interactive games
- **AI Features**: Enhance AI capabilities
- **Visualizations**: Add data visualizations

### Good First Issues

Look for issues labeled `good-first-issue`:
- Documentation improvements
- Simple bug fixes
- Test additions
- Code cleanup

### Advanced Contributions

- **Architecture**: Improve system design
- **Performance**: Advanced optimizations
- **Security**: Security enhancements
- **Infrastructure**: CI/CD improvements

## Documentation

### Types of Documentation

1. **Code Comments**: JSDoc for functions and classes
2. **README**: Project overview and setup
3. **API Docs**: Endpoint documentation
4. **Usage Guides**: Feature-specific guides
5. **Architecture Docs**: System design documents

### Writing Documentation

- **Clear and Concise**: Use simple language
- **Examples**: Include code examples
- **Up-to-Date**: Keep docs synchronized with code
- **Structured**: Use headings and lists
- **Searchable**: Use descriptive titles

### JSDoc Example

```typescript
/**
 * Wraps text to fit within specified width, breaking at word boundaries.
 * 
 * @param text - The text to wrap
 * @param width - Maximum line width in characters
 * @returns Array of wrapped lines, each ≤ width characters
 * 
 * @example
 * ```typescript
 * const lines = wrapText('This is a long sentence', 10);
 * // Returns: ['This is a', 'long', 'sentence']
 * ```
 */
export function wrapText(text: string, width: number): string[] {
  // Implementation
}
```

## Community

### Getting Help

- **GitHub Issues**: Ask questions or report bugs
- **Discussions**: Join community discussions
- **Documentation**: Check existing docs first

### Staying Updated

- **Watch Repository**: Get notifications for updates
- **Read Changelog**: Stay informed about changes
- **Follow Releases**: Track new versions

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with the `question` label

Thank you for contributing to Modern Teletext! 🎉

---

**Last Updated**: January 2024
