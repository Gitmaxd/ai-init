# Next.js System Patterns

## Naming Conventions

### React Components
- Use **PascalCase** for both filenames and component names
  - Examples: `Button.tsx`, `UserProfile.tsx`
- For complex components, use folder structure with PascalCase index files
  - Example: `UserProfile/index.tsx` + other component files

### Pages and Routes
- Use **kebab-case** for page files 
  - Example: `about-us.tsx`
- Use **snake_case** for dynamic route segments 
  - Example: `[product_id].tsx`
- Use **lowercase** for special Next.js files
  - Examples: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Utility and Config Files
- Use **kebab-case** for utility files
  - Examples: `api-helpers.ts`, `date-utils.ts`

### Documentation Files
- Use **kebab-case** for markdown files
  - Example: `getting-started.md`

## Next.js App Router Patterns

### Component Types
- **Server Components** (default): Use for components that:
  - Fetch data
  - Access backend resources directly
  - Handle sensitive information
  - Don't need client-side interactivity
  ```tsx
  // Example server component
  async function ProductList() {
    const products = await getProducts();
    
    return (
      <div>
        {products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    );
  }
  ```

- **Client Components**: Use for components that:
  - Use React hooks
  - Add event listeners
  - Use browser-only APIs
  - Maintain client-side state
  ```tsx
  'use client';
  
  import { useState } from 'react';
  
  export default function Counter() {
    const [count, setCount] = useState(0);
    
    return (
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    );
  }
  ```

### Data Fetching Patterns
- **Server Components** - Use direct async/await:
  ```tsx
  async function ProductPage({ params }) {
    const product = await getProduct(params.id);
    return <ProductDetails product={product} />;
  }
  ```

- **Server Actions** - Use for data mutations:
  ```tsx
  'use server';
  
  export async function updateProduct(formData) {
    const product = formDataToProduct(formData);
    await db.products.update(product);
    revalidatePath('/products');
  }
  ```

### Routing Patterns
- Use **layout.tsx** for shared UI across routes
- Use **loading.tsx** for loading states
- Use **error.tsx** for error boundaries
- Use **not-found.tsx** for 404 handling
- Use **route.ts/js** for API endpoints
- Use route groups with **(folder)** for organization without affecting URL structure

### State Management
- Server components: Fetch data directly
- Client components: React hooks, context, or minimal state libraries
- Cross-component state: React Context with client components
- Server-client state: Form actions with useFormState/useOptimistic

## TypeScript Patterns

### Type Definitions
- Keep types close to where they're used
- Use interface for public APIs, type for internal
- Export shared types from dedicated files

```tsx
// types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Usage in component
import type { Product } from '@/types';
```

### Props Typing
```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  onClick
}: ButtonProps) {
  // Component implementation
}
```

## CSS and Styling

### CSS Modules
- Use CSS modules for component-specific styling
- File naming: `ComponentName.module.css`

```tsx
// Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.primary {
  background-color: var(--color-primary);
  color: white;
}

// Button.tsx
import styles from './Button.module.css';

export function Button({ variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      Click me
    </button>
  );
}
```

### Tailwind CSS
- Use utility classes for rapid styling
- Extract common patterns to components

```tsx
export function Card({ title, children }) {
  return (
    <div className="rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
```

## Testing Patterns

### Component Testing
```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Page Testing
```tsx
// page.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock server component data
jest.mock('@/lib/api', () => ({
  getData: () => Promise.resolve({ title: 'Test data' })
}));

describe('HomePage', () => {
  it('renders page with data', async () => {
    render(await HomePage());
    expect(screen.getByText('Test data')).toBeInTheDocument();
  });
});
```
