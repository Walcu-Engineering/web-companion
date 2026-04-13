# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

`web-companion` is a multi-framework demo project for a browser-embeddable phone call SDK. It consists of:

- **`packages/sdk-ui`** — `UICallWidget`: renders a floating phone button and modal using Shadow DOM
- **`packages/sdk-call`** — `CallWidget`: handles token fetching, device state, and call logic
- **`token-server`** — Express service (port 4000) that issues signed JWT tokens for calls
- **`apps/app-react`** — React + Vite demo app integrating both SDKs (port 5173)
- **`apps/app-vue`** — Vue 3 + Vite demo app integrating both SDKs
- **`apps/server-html`** — Vanilla HTML/JS demo app served by Express (port 3001)

## Running the project

Each piece runs independently. Start whatever combination you need:

```bash
# Token service (required for call flow)
cd token-server && node server.js          # http://localhost:4000

# HTML demo
cd apps/server-html && node server.js      # http://localhost:3001

# React demo
cd apps/app-react && npm run dev           # http://localhost:5173

# Vue demo
cd apps/app-vue && npm run dev
```

## Architecture

### Communication flow

```
UICallWidget  --[sdk:call-requested event]-->  CallWidget  --[GET /token]-->  token-server
   (sdk-ui)                                    (sdk-call)                     (port 4000)
```

1. `UICallWidget` injects a Shadow DOM phone button into the host page
2. When the user clicks "Llamar ahora", it dispatches a `sdk:call-requested` custom event
3. `CallWidget` listens for that event, fetches a JWT from `token-server`, and manages the call

### SDK design rules

- Both SDKs expose a single class attached to `window` (`window.UICallWidget`, `window.CallWidget`)
- `UICallWidget` uses Shadow DOM (`all: initial`) to prevent style leakage — never break this isolation
- SDKs communicate via custom DOM events, not direct method calls between classes
- `CallWidget` fetches tokens from `http://localhost:4000/token` — this URL is configurable via `_config`

### Demo apps

The three apps (`app-react`, `app-vue`, `server-html`) are parallel implementations of the same coches.net-inspired UI. They share the same mock car data structure (`cars.js`). Changes to the UI design should be applied consistently across all three.

- `server-html` serves SDKs directly from `packages/` via Express routes — no manual copying needed
- React and Vue apps import the SDKs directly from `packages/`

### Token server

- Single endpoint: `GET /token` → `{ token: "<jwt>" }`
- JWT payload: `{ scope: "phone-call" }`, expires 1h
- CORS is open (`*`) — intentional for local development, do not tighten without discussion
- Secret is in `token-server/.env` (gitignored)

## Adding new SDK features

- UI changes (button, modal, styles) → `packages/sdk-ui/UICallWidget.js`
- Call logic, token handling, device state → `packages/sdk-call/CallWidget.js`
- New events between SDK layers → use custom DOM events, document the event name and payload here
- After editing `packages/sdk-*`, copy the updated files to `apps/server-html/public/js/`

## Commits

- Never add `Co-Authored-By: Claude` or any co-author trailer to commits
- Use the user's commit style: short prefix (`feat`, `refactor`, `fix`) + brief description, no scope in parentheses

## Code style

- Vanilla JS (no TypeScript, no bundler) for SDK packages — they must work as plain `<script>` tags
- React and Vue apps use Vite; follow existing component structure (no new routing libraries)
- No shared `package.json` at the root — each module manages its own dependencies
- Mock car data lives in `cars.js` inside each app; keep both copies in sync
