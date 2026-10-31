# Header/Navbar Component Documentation

## Overview
A modern, professional, fully responsive Header/Navbar component for SmartSell Digital Platform. Built with React, Tailwind CSS, Framer Motion, and Lucide React Icons.

**Note**: This is a public header designed for non-authenticated users. It does not include cart, notifications, or user account features.

---

## Component Architecture

### Folder Structure
```
src/components/common/
├── Header.jsx              # Main Header component
├── SearchBar.jsx           # Search input component
├── NavLinks.jsx            # Navigation links component
├── UserMenu.jsx            # Theme toggle and login/register buttons
└── MobileMenu.jsx          # Mobile slide-in menu component
```

---

## Component Breakdown

### 1. Header.jsx
**Purpose**: Main Header component that orchestrates all sub-components

**Features**:
- Sticky navbar with scroll detection
- Glassmorphism effect on scroll (backdrop blur)
- Responsive layout with mobile/desktop variants
- Logo with hover animation
- Integration of all sub-components

**State Management**:
- `isScrolled`: Tracks scroll position to apply glassmorphism effect

**Props**: None (uses mock local state)

**Key Features**:
- Sticky positioning with `top-0 z-50`
- Smooth transition between scrolled and non-scrolled states
- Responsive breakpoints: hidden on mobile, visible on desktop for most elements
- Framer Motion entrance animation (slide down from top)

---

### 2. SearchBar.jsx
**Purpose**: Modern search input with expandable width and clear functionality

**Props**:
- `isMobile` (boolean): Determines mobile vs desktop styling
- `onClose` (function): Callback for mobile menu close

**State Management**:
- `query`: Search input value
- `isFocused`: Tracks input focus state

**Features**:
- Animated width expansion on focus (256px → 320px on desktop)
- Search icon that changes color on focus
- Clear button with animation when query exists
- Keyboard support (Escape key to close/focus out)
- Accessible with ARIA labels

**Responsive Behavior**:
- Desktop: Expands from 256px to 320px on focus
- Mobile: Full width with larger padding

**Accessibility**:
- `aria-label` for screen readers
- `aria-expanded` for focus state
- Keyboard navigation support
- Focus ring on focus

---

### 3. NavLinks.jsx
**Purpose**: Navigation links with active state and hover animations

**Props**:
- `isMobile` (boolean): Determines mobile vs desktop styling
- `onClose` (function): Callback for mobile menu close

**Features**:
- Active route highlighting with React Router
- Hover underline animation on desktop
- Full-width block links on mobile
- Smooth color transitions

**Navigation Links**:
- Home (/)
- Marketplace (/products)
- Categories (/categories)
- Sellers (/sellers)
- About (/about)

**Responsive Behavior**:
- Desktop: Horizontal layout with hover underline animation
- Mobile: Vertical stack with hover background color

**Accessibility**:
- Semantic `<nav>` with `aria-label`
- Active state indication
- Keyboard navigation support

---

### 4. UserMenu.jsx
**Purpose**: Theme toggle and authentication buttons for public header

**State Management**:
- `isDark`: Controls theme toggle state

**Features**:
- Theme toggle button (dark/light mode)
- Login button
- Register button
- Icon-only buttons on mobile for space efficiency
- Animated hover/tap effects

**Responsive Behavior**:
- Desktop: Shows text labels on buttons
- Mobile: Shows icons only on buttons to save space

**Animations**:
- Button: scale on hover/tap (105%/95%)

**Accessibility**:
- `aria-label` for all buttons
- Keyboard navigation support
- Focus ring on focus

---

### 5. MobileMenu.jsx
**Purpose**: Slide-in mobile drawer with full navigation

**State Management**:
- `isOpen`: Controls drawer visibility
- `isDark`: Controls theme toggle state

**Features**:
- Slide-in animation from right
- Backdrop overlay with click to close
- Body scroll lock when open
- Escape key to close
- Mobile-optimized search bar
- Full navigation links
- Theme toggle button
- Login/Register buttons

**Layout**:
- Header with close button
- Search bar section
- Navigation links
- Theme toggle button
- Login/Register buttons
- Footer with copyright

**Animations**:
- Drawer: spring animation from right
- Backdrop: fade in/out
- Button: scale on tap (95%)

**Accessibility**:
- `role="dialog"` for drawer
- `aria-modal="true"`
- `aria-labelledby` for title
- Keyboard navigation
- Focus trap (implicit with backdrop)
- Body scroll lock for screen readers

---

## Responsive Behavior

### Desktop (lg breakpoint: 1024px+)
**Layout**:
```
[Logo] [NavLinks] [SearchBar] [Theme Toggle] [Login] [Register]
```

**Features**:
- Full navigation visible
- Expandable search bar
- Theme toggle visible
- Login and Register buttons with text labels

---

### Tablet (md breakpoint: 768px - 1023px)
**Layout**:
```
[Logo] [SearchBar] [Theme Toggle] [Login] [Register] [MobileMenu]
```

**Features**:
- Navigation hidden (use mobile menu)
- Search bar visible
- Theme toggle visible
- Login/Register buttons visible
- Hamburger menu for navigation

---

### Mobile (sm breakpoint: < 768px)
**Layout**:
```
[Logo] [MobileMenu]
```

**Features**:
- Everything in slide-in drawer
- Mobile search in drawer
- Navigation links in drawer
- Theme toggle in drawer
- Login/Register buttons in drawer
- Touch-friendly tap targets
- Full-width components

---

## Animations

### Framer Motion Usage

**Header Entrance**:
- Initial: `y: -100` (above viewport)
- Animate: `y: 0` (in position)
- Duration: 500ms
- Easing: easeOut

**Scroll Effect**:
- Transition: 300ms
- Properties: background, backdrop blur, shadow, border

**Search Bar**:
- Width expansion: 300ms
- Clear button: scale animation
- Icon color: 200ms transition

**User Menu Buttons**:
- Hover: scale 1.05
- Tap: scale 0.95

**Mobile Menu**:
- Drawer: spring animation (damping: 25, stiffness: 200)
- Backdrop: fade in/out
- Button: scale on tap (95%)

**Nav Links**:
- Desktop: underline scale on hover (200ms)
- Mobile: background color transition (200ms)

---

## Accessibility Features

### Keyboard Navigation
- Tab order follows logical flow
- Escape key closes mobile menu
- Enter/Space activates buttons
- Arrow keys for menu navigation (future enhancement)

### ARIA Labels
- All buttons have descriptive labels
- Navigation has `aria-label="Main navigation"`
- Search has `aria-label="Search digital products"`
- Mobile menu has `aria-label="Open menu"` / `aria-label="Close menu"`
- Theme toggle has `aria-label="Toggle theme"`
- Login has `aria-label="Login to your account"`
- Register has `aria-label="Create a new account"`

### Focus States
- All interactive elements have focus rings
- Focus ring color: indigo-500/20
- Focus visible on all states

### Screen Reader Support
- Semantic HTML elements
- ARIA attributes for dynamic content
- Hidden text for icon-only buttons on mobile

### Color Contrast
- Text colors meet WCAG AA standards
- Focus indicators have sufficient contrast
- Hover states maintain readability

---

## State Handling

### Current Implementation
All components use mock local state with `useState` hooks. No backend integration yet.

### State Examples:
- SearchBar: `query`, `isFocused`
- UserMenu: `isDark`
- MobileMenu: `isOpen`, `isDark`
- Header: `isScrolled`

### Future Backend Integration
When connecting to backend:

**Authentication State**:
- Replace static buttons with AuthContext integration
- Redirect to login/register pages
- Handle authentication state changes
- Show authenticated user features when logged in

**Search Functionality**:
- Connect search to product API
- Implement debounced search queries
- Show search results dropdown
- Handle search history

**Theme**:
- Persist theme preference in localStorage
- Sync with system preference
- Apply theme to entire application

---

## Future Enhancements

### Short-term
1. Implement search results dropdown
2. Add breadcrumb navigation
3. Implement mega menu for categories
4. Add language selector
5. Add social media links

### Medium-term
1. Add voice search capability
2. Implement personalized recommendations
3. Add multi-language support
4. Implement A/B testing for layout
5. Add analytics tracking integration

### Long-term
1. Add AI-powered search suggestions
2. Implement collaborative filtering
3. Add real-time notifications
4. Implement progressive web app features
5. Add offline support

---

## Performance Considerations

### Optimizations Implemented
- Framer Motion for GPU-accelerated animations
- Conditional rendering for mobile/desktop
- Event listener cleanup in useEffect
- Body scroll lock for mobile menu

### Future Optimizations
1. Lazy load mobile menu
2. Debounce search input
3. Memoize component renders
4. Code split by route

---

## Browser Compatibility

### Supported Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Fallbacks
- CSS transitions for browsers without Framer Motion support
- Standard focus states for keyboard navigation
- Responsive layout without JavaScript (basic functionality)

---

## Testing Recommendations

### Unit Tests
- Test component rendering
- Test state changes
- Test event handlers
- Test accessibility attributes

### Integration Tests
- Test navigation flow
- Test mobile menu interactions
- Test search functionality
- Test theme toggle

### E2E Tests
- Test complete user flows
- Test responsive behavior
- Test keyboard navigation
- Test screen reader compatibility

---

## Usage Example

```jsx
import { Header } from '@components/common/Header'

function App() {
  return (
    <div>
      <Header />
      {/* Rest of application */}
    </div>
  )
}
```

---

## Customization

### Theme Colors
Edit Tailwind config to change primary colors:
- Primary: indigo-600
- Hover: indigo-700
- Focus ring: indigo-500/20

### Navigation Links
Edit `navLinks` array in NavLinks.jsx:
```jsx
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Marketplace', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'Sellers', path: '/sellers' },
  { name: 'About', path: '/about' },
]
```

### Button Labels
Edit button text in UserMenu.jsx and MobileMenu.jsx to match your authentication flow.

---

## Conclusion

The Header component provides a modern, accessible, and responsive navigation solution for Ariana Marketplace's public pages. It follows best practices for component architecture, state management, and user experience. The modular design allows for easy customization and future enhancements while maintaining clean code and scalability. As a public header, it focuses on navigation, search, and user acquisition through login/register buttons, while excluding authenticated user features like cart and notifications.
