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
- TanStack Query + Zustand + React Hook Form + Zod
- Axios (single instance, gateway-routed)

## Key Pages
| Route | Mô tả | API |
|-------|-------|-----|
| `/` | Landing page | — |
| `/login` | Đăng nhập | POST /auth/login |
| `/register` | Đăng ký | POST /auth/register-tenant |
| `/onboarding` | Thiết lập hồ sơ (3 steps) | PUT /auth/me |
| `/dashboard` | Trang chủ — KPI tổng quan | GET /dashboard/overview |
| `/market` | Cơ hội thị trường | — (BFF planned) |
| `/health-check` | Kiểm tra sức khỏe tồn kho | GET /dashboard/health-summary + /catalog/inventory/summary |
| `/forecast` | Dự báo xu hướng | GET /dashboard/forecast-summary |
| `/recommendations` | Đề xuất AI | GET /ml/recommendations |
| `/settings/profile` | Thông tin tài khoản | PUT /auth/me |
| `/settings/integrations` | Kết nối KiotViet/Sapo | GET/POST/DELETE /integrations |

## Backend API
- Base URL: `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`)
- Auth: JWT Bearer token — inject tự động qua Axios interceptor
- Refresh: tự động retry khi 401

## Service Layer (`/src/services/`)
| File | Endpoints |
|------|-----------|
| `auth.service.ts` | login, register, refresh, logout, me, updateProfile |
| `catalog.service.ts` | products CRUD, categories, locations, inventory, variants |
| `sales.service.ts` | orders, customers, suppliers |
| `ml.service.ts` | forecast, batch forecast, recommendations, refresh |
| `bff.service.ts` | dashboard overview, health-summary, forecast-summary, recommendations-summary |
| `notification.service.ts` | list, unread-count, markRead, markAllRead, preferences |
| `integration.service.ts` | listConnectors, create, delete, triggerSync, getSyncJobs |

## Hooks (`/src/hooks/`)
`useAuth` · `useProducts` · `useDashboard` · `useHealthCheck` · `useForecast` · `useRecommendations` · `useCatalog` · `useNotifications`

## Backend Services (local dev)
| Service | Port | Ghi chú |
|---------|------|---------|
| API Gateway | 8080 | Entry point — tất cả calls qua đây |
| Auth | 8081 | JWT + Redis |
| Catalog | 8082 | Products, inventory |
| Sales | 8083 | Orders, customers |
| Integration | 8084 | KiotViet/Sapo connectors |
| Dashboard BFF | 8090 | Aggregated dashboard data |
| Notification | 8091 | In-app alerts |
| Config Server | 8888 | Spring Cloud Config |
| Eureka | 8761 | Service discovery |
| ML Service | 8000 | Python/FastAPI — cũng qua gateway |

## Context Files
- `FRONTEND_CONTEXT.md` — Product + design system + screen details
- `.claude/CLAUDE.md` — Engineering conventions for AI assistants
