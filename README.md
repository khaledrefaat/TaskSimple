# Todo App

A full-stack todo app with offline support. Work as a guest locally or sign up to save to the cloud.

## Features

- **Offline First**: Create todos and projects without internet
- **Guest Mode**: Start using immediately, no account needed
- **Accounts**: Sign up to save your data to the cloud
- **Projects**: Organize todos into projects
- **Dark Mode**: Built-in dark/light theme
- **PWA**: Install on desktop or mobile

## Tech Stack

- Next.js 16 + React + TypeScript
- PostgreSQL + Drizzle ORM
- IndexedDB
- TailwindCSS

## Quick Start

1. **Install**

   ```bash
   pnpm install
   ```

2. **Setup environment**

   ```bash
   cp .env.example .env.local
   ```

   Add your database URL:

   ```
   DATABASE_URL=postgresql://...
   ```

3. **Run migrations**

   ```bash
   pnpm db:push
   ```

4. **Start**
   ```bash
   pnpm dev
   ```

## How It Works

**Guests**: Data stored in IndexedDB (your browser)  
**Logged In**: Data stored in PostgreSQL (cloud)

No account needed to get started!

## Project Structure

```
lib/db/
├── auth.ts            # Auth utility functions
└── indexeddb.ts       # Browser storage
└── dal.ts             # Data Access Layer

db/
├── index.ts           # drizzel setup
└── schema.ts          # Database schema

app/api/
├── projects/          # Project endpoints
└── todos/             # Todo endpoints

app/actions/
├── actions/           # Auth Actions

components/
├── auth/              # Auth forms
├── todos/             # Todos components
└── ...
```

## Future Ideas

- Sync between devices (cloud backup for offline data)
- Collaborate on projects with other users
- Todo templates
- Export & import data as JSON
