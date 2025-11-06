# Offline-First Todo App

A full-stack todo app with offline-first support. Work without internet and sync automatically when you're back online.

## Features

- **Offline First**: Create and edit todos/projects offline, syncs when online
- **Drag & Drop**: Organize todos by dragging between projects
- **Projects**: Group todos into projects
- **Auto Sync**: Changes sync to database with last-write-wins conflict resolution
- **PWA**: Install as app on desktop or mobile

## Tech Stack

- Next.js 16 (React)
- TypeScript
- PostgreSQL + Drizzle ORM
- IndexedDB

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Setup environment**

   ```bash
   cp .env.example .env.local
   ```

   Add your Neon database URL:

   ```
   DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/todo_app
   ```

3. **Run migrations**

   ```bash
   pnpm db:push
   ```

4. **Start dev server**
   ```bash
   pnpm dev
   ```

## How It Works

- All changes save to IndexedDB first (works offline)
- When online, pending changes sync to PostgreSQL
- Synced items are marked as `syncStatus: 'synced'`
- Conflict resolution: latest `updatedAt` timestamp wins

## Project Structure

```
lib/db/
├── schema.ts          # Drizzle schema
└── indexeddb.ts       # IndexedDB operations

app/api/
└── sync/route.ts      # Sync endpoint

components/
├── ProjectList.tsx
├── TodoList.tsx
└── DragDropProvider.tsx
```

## Testing Offline

1. Open DevTools (F12)
2. Network tab → check "Offline"
3. Create/edit todos
4. Uncheck "Offline" to sync
