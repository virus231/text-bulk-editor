# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the React + TypeScript source code.
  - Entry point: `src/main.tsx`
  - Main UI component: `src/App.tsx`
  - Styles: `src/index.css`, `src/App.css`
  - Static assets: `src/logo.svg`, `src/favicon.svg`
- Root config files: `vite.config.ts`, `tsconfig.json`, `package.json`, `bun.lock`.
- No dedicated `tests/` directory exists yet.

## Build, Test, and Development Commands
Run commands with Bun:
- `bun install` — install dependencies.
- `bun run dev` — start the Vite dev server.
- `bun run build` — type-check with `tsc` and build the production bundle.
- `bun run preview` — serve the production build locally for a quick smoke test.
There is no `test` script configured.

## Coding Style & Naming Conventions
- Language: TypeScript + React with JSX in `.tsx` files.
- Indentation: 2 spaces (follow existing files).
- Naming: React components use `PascalCase` (e.g., `App`), functions and variables use `camelCase`.
- No formatter or linter configuration is present; keep changes consistent with existing style.

## Testing Guidelines
- No testing framework is configured and no test files are present.
- If adding tests, also add a `test` script in `package.json` and document how to run it.
- Prefer naming tests alongside components (e.g., `App.test.tsx`) or add a `tests/` folder with clear structure.

## Commit & Pull Request Guidelines
- Commit conventions are not discoverable here (no Git history in this workspace). If you introduce a convention, document it in this file.
- PRs should include a short description of the change, any relevant screenshots for UI updates, and steps to verify (e.g., `bun run dev` or `bun run build`).

## Configuration Tips
- If you need environment variables, add a `.env.example` file and list required keys with brief descriptions.
