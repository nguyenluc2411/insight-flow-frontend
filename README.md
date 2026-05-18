# Insight Flow AI — Frontend

Dashboard SaaS giúp shop thời trang VN phân tích tồn kho và dự báo xu hướng.

**Brand**: Forecastly | **Backend**: insight-flow-backend (port 8080)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

## Stack
- Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- TanStack Query + Zustand + React Hook Form

## Key Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/onboarding` | Thiết lập hồ sơ (3 steps) |
| `/dashboard` | Trang chủ |
| `/market` | Cơ hội thị trường |
| `/health-check` | Kiểm tra sức khỏe |
| `/forecast` | Dự báo xu hướng |
| `/recommendations` | Đề xuất AI |

## Backend API
All requests go to `NEXT_PUBLIC_API_URL` (default: http://localhost:8080)
Auth: JWT Bearer token from /api/v1/auth/login

## Context Files
- `FRONTEND_CONTEXT.md` — Product + design system + screen details
- `.claude/CLAUDE.md` — Engineering conventions for AI assistants
