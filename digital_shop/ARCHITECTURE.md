# SmartSell - Frontend Architecture Documentation

## Project Overview
SmartSell is an enterprise-grade digital marketplace platform for selling digital products (ebooks, templates, audio files, mini courses, graphics, downloadable assets). The frontend is built with React, Vite, and follows clean architecture principles for scalability and maintainability.

---

## Technology Stack

### Core Framework
- **React**: UI library for building interactive user interfaces
- **Vite**: Build tool for fast development and optimized production builds
- **JavaScript**: Language choice for rapid development and ease of onboarding

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible component library built on Radix UI
- **clsx & tailwind-merge**: Utility functions for conditional class merging

### Routing & Navigation
- **React Router DOM**: Client-side routing for SPA navigation

### Data Management
- **Axios**: HTTP client for API communication with interceptors
- **Context API**: Built-in React state management for global state (auth, cart)

### Forms & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library for runtime type checking

### Animation & Visualization
- **Framer Motion**: Production-ready animation library for React
- **Recharts**: Composable charting library for data visualization

---

## Folder Structure

```
ariana-marketplace/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, fonts
│   │   ├── images/        # Image assets
│   │   └── icons/         # Icon assets
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── common/       # Shared components (Header, Footer)
│   │   └── forms/        # Form components
│   ├── contexts/         # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   └── useForm.js
│   ├── layouts/          # Layout components
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── pages/            # Page components organized by role
│   │   ├── public/       # Public pages (Home, Products)
│   │   ├── auth/         # Authentication pages
│   │   ├── buyer/        # Buyer-specific pages
│   │   ├── seller/       # Seller-specific pages
│   │   └── admin/        # Admin-specific pages
│   ├── routes/           # Route configuration
│   │   └── index.jsx
│   ├── services/         # API service layers
│   │   ├── api/          # Axios configuration
│   │   ├── auth/         # Authentication services
│   │   ├── products/     # Product services
│   │   ├── cart/         # Cart services
│   │   └── payment/      # Payment services
│   ├── utils/            # Utility functions
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   ├── validateEmail.js
│   │   └── generateSlug.js
│   ├── constants/        # Application constants
│   │   ├── roles.js
│   │   ├── endpoints.js
│   │   └── productTypes.js
│   ├── types/            # Type definitions
│   │   └── index.js
│   ├── lib/              # Library utilities
│   │   └── utils.js      # cn() utility for class merging
│   ├── App.jsx           # Root component with RouterProvider
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles with Tailwind
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── components.json       # shadcn/ui configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration with path aliases
└── package.json          # Dependencies and scripts
```

---

## Architecture Decisions

### 1. Clean Architecture & Separation of Concerns

**Why**: Separates business logic from UI, making the codebase testable, maintainable, and scalable.

**Implementation**:
- **Services Layer**: All API calls are abstracted into service modules (`src/services/`). This allows easy mocking for testing and changing API implementations without affecting UI components.
- **Context API**: Global state (auth, cart) is managed through React Context, avoiding prop drilling and providing a centralized state management solution.
- **Custom Hooks**: Reusable logic is extracted into custom hooks (`src/hooks/`) for composition and reusability across components.

### 2. Role-Based Routing Structure

**Why**: Different user roles (Buyer, Seller, Admin) have different permissions and access patterns. Organizing routes by role improves security and maintainability.

**Implementation**:
- Routes are organized under role-specific page directories (`src/pages/buyer/`, `src/pages/seller/`, `src/pages/admin/`)
- Route guards can be implemented at the layout level to enforce role-based access
- Clear separation makes it easy to add new role-specific features

### 3. API-First Design with Axios Interceptors

**Why**: Ensures consistent API communication, automatic token management, and centralized error handling.

**Implementation**:
- **Request Interceptor**: Automatically attaches JWT access tokens to all requests
- **Response Interceptor**: Handles token refresh automatically on 401 errors, redirecting to login on refresh failure
- **Centralized Configuration**: Base URL, timeout, and headers are configured in one place (`src/services/api/axiosConfig.js`)

### 4. Import Aliases for Clean Imports

**Why**: Improves code readability and makes refactoring easier by using semantic aliases instead of relative paths.

**Implementation**:
- Configured in `vite.config.js` with path aliases like `@components`, `@services`, `@hooks`
- Enables imports like `import { Header } from '@components/common/Header'` instead of `import { Header } from '../../../components/common/Header'`

### 5. Component Organization

**Why**: Logical grouping of components improves discoverability and maintainability.

**Implementation**:
- **ui/**: shadcn/ui base components (Button, Input, Card, etc.)
- **common/**: Shared application components (Header, Footer, Navigation)
- **forms/**: Reusable form components (LoginForm, ProductForm, etc.)

### 6. Environment Configuration

**Why**: Enables different configurations for development, staging, and production without code changes.

**Implementation**:
- `.env` file for local development
- `.env.example` as a template for team members
- Variables prefixed with `VITE_` are automatically exposed to the client

### 7. Utility Functions

**Why**: DRY principle - common operations are extracted into reusable utilities.

**Implementation**:
- `formatCurrency()`: Consistent currency formatting across the app
- `formatDate()`: Consistent date formatting with locale support
- `validateEmail()`: Email validation logic
- `generateSlug()`: URL-friendly slug generation

### 8. Constants Management

**Why**: Centralized configuration makes it easy to update values without searching through the codebase.

**Implementation**:
- `roles.js`: User roles and permissions
- `endpoints.js`: API endpoint definitions
- `productTypes.js`: Product type definitions and categories

---

## Scalability Considerations

### 1. Modular Service Architecture
Each domain (auth, products, cart, payment) has its own service module. This allows:
- Independent testing of each service
- Easy addition of new services
- Clear separation of concerns

### 2. Context API for Global State
Using React Context for auth and cart state:
- Avoids prop drilling
- Provides a simple state management solution without additional dependencies
- Can be easily replaced with Redux/Zustand if complexity grows

### 3. Lazy Loading Ready
The routing structure supports code splitting:
```javascript
const HomePage = lazy(() => import('@pages/public/HomePage'))
```
This can be implemented when the application grows to improve initial load time.

### 4. Component Reusability
shadcn/ui components provide:
- Accessible, customizable base components
- Consistent design system
- Reduced development time for common UI patterns

### 5. Type Safety Ready
While using JavaScript currently, the architecture supports easy migration to TypeScript:
- Clear interfaces in `src/types/`
- Structured data flow through services and contexts
- Component props are well-defined

---

## Backend Compatibility

### Django REST Framework Integration

The frontend is designed to work seamlessly with DRF:

1. **JWT Authentication**: 
   - Access/refresh token flow implemented in axios interceptors
   - Compatible with `dj-rest-auth` or custom JWT implementations

2. **API Response Format**:
   - Services expect standard DRF response format
   - Error handling supports DRF's validation error format

3. **CSRF Protection**:
   - Can be enabled in axios config if needed
   - Compatible with Django's CSRF middleware

4. **File Upload**:
   - Service structure supports multipart/form-data for product uploads
   - Compatible with DRF's `FileUploadParser`

---

## Development Workflow

### Adding a New Page
1. Create page component in appropriate `src/pages/` directory
2. Add route in `src/routes/index.jsx`
3. Add navigation link in `Header.jsx` if needed

### Adding a New Service
1. Create service file in `src/services/`
2. Export functions that use the configured axios instance
3. Import and use in components or contexts

### Adding a New Context
1. Create context file in `src/contexts/`
2. Wrap application or specific routes in provider in `main.jsx`
3. Create custom hook for consuming the context

### Adding a New Utility
1. Create utility function in `src/utils/`
2. Export as named export
3. Import where needed using alias

---

## Next Steps for Development

1. **Implement Authentication**: Complete the `AuthContext` with actual API calls
2. **Build UI Components**: Add shadcn/ui components as needed
3. **Implement Pages**: Replace placeholder pages with actual functionality
4. **Add Route Guards**: Implement protected routes based on user roles
5. **Error Handling**: Add global error boundary and toast notifications
6. **Loading States**: Add loading skeletons and spinners
7. **Form Validation**: Implement React Hook Form + Zod schemas
8. **Testing**: Add unit tests for services, components, and hooks
9. **Performance**: Implement code splitting and lazy loading
10. **SEO**: Add meta tags and OpenGraph support

---

## Summary

The Ariana Marketplace frontend foundation is now complete with:
- ✅ Enterprise-grade folder structure
- ✅ Clean architecture with separation of concerns
- ✅ API-first design with axios configuration
- ✅ Role-based routing structure
- ✅ Context API for global state management
- ✅ Reusable hooks and utilities
- ✅ Import aliases for clean code
- ✅ Tailwind CSS + shadcn/ui setup
- ✅ Environment configuration
- ✅ Backend-compatible with Django REST Framework

The project is ready for scalable development of business logic, UI components, and feature implementation.
