# AGENTS.md

## Cursor Cloud specific instructions

### Overview

LINE Beer Bot — a LINE Messaging API chatbot that recommends Japanese beers based on user mood. Single-service TypeScript/Express app with no database (static JSON data).

### Key commands

Standard npm scripts are defined in `package.json`:

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (tsx watch, port 3000) |
| Tests | `npm test` (vitest, no env vars needed) |
| Type-check | `npm run type-check` |
| Build | `npm run build` |

### Non-obvious caveats

- **ESLint is not installed**: `npm run lint` is defined in `package.json` but `eslint` is not in `devDependencies`. The lint script will fail with `eslint: not found`.
- **Type-check has pre-existing errors**: `npm run type-check` exits with errors in `src/lambda/handler.test.ts` (APIGatewayProxyResultV2 property access) and `src/services/beerService.ts` (import assertions vs attributes). These are pre-existing and do not block tests or builds.
- **Dev server requires LINE credentials**: The Express server (`npm run dev`) calls `process.exit(1)` if `LINE_CHANNEL_ACCESS_TOKEN` or `LINE_CHANNEL_SECRET` are not set. For local testing without real LINE integration, copy `.env.example` to `.env` — the placeholder values are sufficient to start the server and test the `/health` endpoint.
- **Health endpoint**: `GET /health` returns `{"status":"ok"}` and does not require LINE credentials validation.
- **Webhook endpoint**: `POST /webhook` requires a valid LINE signature header (`x-line-signature`). Without it, the LINE SDK middleware returns 500.
- **Unit tests run without any env vars or external services** — `npm test` is fully self-contained.
