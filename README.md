# Bank of America — Online Banking (Demo)

Mock Angular 14 monorepo modeling a customer-facing retail banking application. Built to demonstrate the structure and integration surface of a large, regulated front-end codebase ahead of a framework upgrade engagement.

> **This is a demo.** It is not affiliated with Bank of America. All credentials, accounts, transactions, and market data are fabricated.

## Workspace layout

```
projects/
├── boa-banking-app/         # Customer-facing application (login → dashboard → transfer)
├── boa-design-system/       # Shared UI component library (Material + BofA theming)
├── boa-auth/                # SSO/MFA client library
├── boa-analytics/           # Proprietary analytics SDK wrapper
└── boa-data-providers/      # Adapters for third-party financial data feeds
```

Each library publishes independently. Downstream apps (modeled by `boa-banking-app`) consume them through the `@boa/*` package aliases defined in `tsconfig.base.json`.

## Run locally

Requires Node 18 (see `.nvmrc`).

```bash
nvm use
npm install
npm run build:libs
npm start
```

The app serves at http://localhost:4200.

**Demo credentials:** `demo` / `demo`  ·  **MFA code:** `123456`

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Serve `boa-banking-app` (dev) |
| `npm run build` | Build the app for production |
| `npm run build:libs` | Build all four libraries |
| `npm run build:all` | Build libs then app |
| `npm test` | Run unit tests |

## Integration surfaces

The four libraries each represent an integration boundary that becomes a focal point during a framework upgrade:

- **`boa-design-system`** — consumed by every internal app. Versioned independently so downstream teams can adopt a new major on their own timeline.
- **`boa-auth`** — wraps the internal SSO/MFA provider. Exposes `AuthService`, `AuthGuard`, and a strongly-typed login → MFA flow.
- **`boa-analytics`** — wraps the proprietary analytics SDK behind a single `track()` interface, isolated by an `InjectionToken` config.
- **`boa-data-providers`** — adapters for third-party financial data feeds (accounts, transactions, market data). Insulates app code from third-party SDK churn.
