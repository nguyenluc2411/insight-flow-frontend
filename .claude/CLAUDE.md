# CLAUDE.md — Frontend Engineering Context

> Read FRONTEND_CONTEXT.md at repo root for full product context.
> This file focuses on how to work in this codebase.

## Stack Summary
- Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui
- State: Zustand | Data: TanStack Query | Forms: React Hook Form + Zod
- Backend API: http://localhost:8080 (insight-flow-backend repo)

## Folder Conventions
- /app → Next.js routes (grouped by auth state)
- /components → UI components organized by domain
- /services → API calls only (no business logic)
- /hooks → Custom hooks (wrap TanStack Query + Zustand)
- /stores → Zustand stores (auth, ui, onboarding)
- /types → TypeScript interfaces
- /lib → Utilities (cn, formatters, constants, validations)

## Component Rules
1. Server component by default, "use client" only when needed
2. Always type props with interface
3. Use cn() from lib/utils for conditional classes
4. Loading + Error states required for all data fetching
5. Mobile-first responsive design

## API Integration Rules
1. All API calls go through /services/*.service.ts
2. Use TanStack Query for GET, useMutation for POST/PUT/DELETE
3. Auth token from Zustand auth.store
4. Errors are RFC 7807 from backend — show toast with `detail` field
5. Never call fetch/axios directly in components

## Design System Rules
1. Colors: primary (#6366f1), secondary (#a855f7), bg-base (#F8FAFC)
2. Brand gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)
3. Font: Inter only
4. Risk colors: high=red-500, medium=amber-500, low=green-500
5. Cards: use GlassCard or shadcn Card component
6. Dark mode: every component needs dark: variant

## When Asking AI For Help
Provide:
1. Which page/component you're working on
2. Which screen from Stitch UI it matches
3. The specific task
4. Current code if debugging

Do NOT:
- Ask to build entire pages at once
- Skip TypeScript types
- Use inline styles
