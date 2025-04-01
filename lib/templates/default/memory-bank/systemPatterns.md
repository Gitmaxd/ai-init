# System Patterns

## Coding Conventions

### Naming Conventions
- **React Components:** PascalCase for both filenames and component names (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Pages and Routes:** 
  - kebab-case for page files (e.g., `about-us.tsx`)
  - snake_case for dynamic route segments (e.g., `[product_id].tsx`)
  - lowercase for special Next.js files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- **Utility Files:** kebab-case (e.g., `api-helpers.ts`, `date-utils.ts`)
- **Documentation Files:** kebab-case (e.g., `getting-started.md`)
- **Variables:** camelCase
- **Classes:** PascalCase
- **Constants:** UPPER_SNAKE_CASE

### File Structure Patterns
- Component folders with index files for complex components
- Co-located tests with `.test.js` or `.spec.js` suffix
- Separate directories for utilities, hooks, and context providers

### Code Organization
- Single responsibility functions and components
- Clear separation of concerns
- Consistent import ordering
- State management patterns

## Architecture Patterns

### Data Flow
- [Describe your data flow patterns]

### Component Composition
- [Describe your component composition patterns]

### Error Handling
- [Describe your error handling patterns]

### State Management
- [Describe your state management patterns]
