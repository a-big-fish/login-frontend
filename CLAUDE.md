# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue.js 2.x authentication application with user registration, login, and session management. The app uses Element UI for components and implements token-based authentication with password hashing.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:8080)
npm run serve

# Build for production
npm run build

# Lint and fix code issues
npm run lint
```

## Architecture & Key Patterns

### Authentication Flow
1. **Password Security**: Passwords are hashed with SHA-256 using CryptoJS before API transmission
2. **Token Management**: Bearer tokens stored in both Vuex state and localStorage for persistence
3. **Request Interceptors**: Axios automatically attaches Authorization header with token
4. **Route Protection**: Navigation guards check authentication status before accessing protected routes
5. **Error Handling**: 401 responses trigger automatic logout and redirect to login

### State Management (Vuex)
- **Location**: `src/store/index.js`
- **Key State**: `user` object, `isLoggedIn` boolean, `loading` and `error` states
- **Persistence**: State initializes from localStorage on app startup
- **Actions**: `login`, `logout`, `checkAuthStatus`

### API Communication
- **Base Configuration**: `src/api/request.js` - Axios instance with interceptors
- **Environment Variable**: Set `VUE_APP_API_URL` for API endpoint
- **Response Format**: All API responses follow `{code: 200, data: {}, message: ""}` structure
- **Error Codes**: 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

### Routing Structure
- **Public Routes**: `/`, `/login`, `/register`, `/error`, `/404`
- **Protected Routes**: All routes except public ones require authentication
- **Navigation Guards**: Implemented in `src/router/index.js`

### Component Organization
- **Pages**: `src/page/` - Full page components (login, register, home, error)
- **Components**: `src/components/` - Reusable components (Nav.vue)
- **API Layer**: `src/api/` - Login, register, and request configuration
- **Utils**: `src/utils/` - Password hashing utilities

### Key Implementation Details

**Login Process** (`src/page/loginPage.vue`):
- Form validation with Element UI rules
- Password hashing before submission
- Auto-redirect to home on success
- Error message display

**Registration Process** (`src/page/registerPage.vue`):
- Username, email, phone validation with regex patterns
- Password confirmation matching
- Auto-login after successful registration
- Comprehensive form validation

**Navigation Component** (`src/components/Nav.vue`):
- Reactive auth state display
- User dropdown with avatar
- Click-outside handling
- Logout functionality

## Important Considerations

1. **Path Aliases**: Use `@/` for `src/` directory imports
2. **Element UI**: All form components and validation use Element UI
3. **Options API**: Vue 2.x with Options API (not Composition API)
4. **Local Storage Keys**: User data stored as `user` in localStorage
5. **Console Logging**: Extensive logging for debugging - check browser console
6. **Mobile Responsive**: Registration page includes mobile-specific styling

## Common Tasks

### Adding a New Protected Route
1. Add route definition to `src/router/routers.js`
2. Ensure route requires auth (not in publicRoutes array)
3. Navigation guard will automatically protect it

### Modifying API Endpoints
1. Update base URL in environment variable `VUE_APP_API_URL`
2. Modify specific endpoints in `src/api/login.js` or `src/api/register.js`
3. Ensure response format matches expected structure

### Customizing Form Validation
1. Edit validation rules in component data() function
2. Use Element UI form validation patterns
3. Add custom validators as needed