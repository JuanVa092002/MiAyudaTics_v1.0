# Repository Map: MiAyudaTics

## High-Level Architecture
- **client/**: React + Vite Frontend (Deploy to Vercel)
- **server/**: Node + Express + TS Backend (Deploy to Render)
- **.agent/**: Operational rules and mission templates.
- **openspec/**: Technical specifications and archive.

## Detailed Structure (Post-Migration)

### 🖥️ Client
```text
client/
├── public/              # Static assets
└── src/
    ├── assets/          # Global styles/images
    ├── components/      # Shared UI components
    ├── features/        # Domain-driven features (auth, tickets)
    ├── hooks/           # Custom React hooks
    ├── layouts/         # Page wrappers
    ├── pages/           # Route views
    ├── services/        # API clients
    └── context/         # React Context providers
```

### ⚙️ Server
```text
server/
├── storage/             # File uploads (media)
└── src/
    ├── core/            # Entrypoint (app.ts, routes.ts)
    ├── features/        # Domain features (controllers, models, routes)
    ├── shared/          # Global logic
    │   ├── middleware/
    │   ├── utils/
    │   ├── validators/
    │   ├── config/
    │   └── types/
    └── index.ts         # Server entrypoint
```

## Maintenance Rules
1. **Zero Noise**: All linting errors must be fixed before commit.
2. **Feature First**: New logic goes into `src/features` within its respective module.
3. **Shared Core**: Shared logic across features must live in `src/shared`.
