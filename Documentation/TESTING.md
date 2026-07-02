# Testing Guide

## Test Structure

```
tests/
├── unit/
│   ├── ExcelService.test.ts
│   ├── SyncService.test.ts
│   ├── ConflictResolver.test.ts
│   └── OfflineQueue.test.ts
├── integration/
│   └── api.integration.test.ts
└── e2e/
    └── addin.e2e.test.ts
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test:unit

# Run with coverage
npm test:unit -- --coverage

# Run specific test
npm test:unit -- ExcelService.test.ts

# Watch mode
npm test:unit -- --watch
```

### Integration Tests

```bash
# Ensure backend is running
# npm run start:api

# Run integration tests
npm test:integration

# Run specific test
npm test:integration -- api.integration.test.ts
```

### E2E Tests

```bash
# Ensure frontend and backend are running
# npm run start & npm run start:api

# Run E2E tests
npm test:e2e

# Run with UI
npm test:e2e -- --ui

# Run specific test
npm test:e2e -- addin.e2e.test.ts
```

## Test Coverage Goals

- Unit Tests: 80% code coverage
- Integration Tests: All critical paths
- E2E Tests: User workflows

## Continuous Integration

Tests run automatically on:
- Push to develop branch
- Pull requests
- Before release

## Debugging Tests

```bash
# Debug unit tests
node --inspect-brk ./node_modules/.bin/vitest

# Debug E2E tests with headed mode
npm test:e2e -- --headed

# Debug E2E tests with slow motion
npm test:e2e -- --slow-mo=1000
```
