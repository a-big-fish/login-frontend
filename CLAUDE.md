# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue.js 2 login application built with Vue CLI. The project uses the standard Vue.js ecosystem with Babel for transpilation and ESLint for code quality.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with hot-reload
npm run serve

# Build for production
npm run build

# Lint and fix code issues
npm run lint
```

## Project Structure

```
src/
├── main.js          # Entry point - Vue app initialization
├── App.vue          # Root component
├── components/      # Reusable Vue components
│   └── HelloWorld.vue
├── page/           # Page-specific components
│   └── loginPage.vue
└── assets/         # Static assets (images, etc.)
```

## Key Configuration

- **Vue Config**: `vue.config.js` - Basic Vue CLI configuration with transpile dependencies enabled
- **JS Config**: `jsconfig.json` - TypeScript-style path mapping with `@/*` pointing to `src/*`
- **Babel**: `babel.config.js` - Standard Babel configuration for Vue projects
- **ESLint**: Configured in `package.json` with Vue essential and recommended rules

## Architecture Notes

- Vue 2.x application using Options API
- Path alias `@` maps to `src/` directory for cleaner imports
- Standard Vue CLI project structure with minimal custom configuration
- Login page component exists at `src/page/loginPage.vue` but is not currently integrated into the main App