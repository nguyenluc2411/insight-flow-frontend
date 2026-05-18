# Insight Flow AI — Frontend Project Context

> Repo: insight-flow-frontend
> Backend: insight-flow-backend (repo riêng, port 8080)
> Brand name: Forecastly (hiển thị với user) / InsightFlow AI (brand chính thức)

---

## 1. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | latest |
| Icons | Material Symbols Outlined | latest |
| Font | Inter (Google Fonts) | variable |
| State | Zustand | 4.x |
| Data fetching | TanStack Query | 5.x |
| Charts | Recharts | 2.x |
| Forms | React Hook Form + Zod | latest |
| HTTP Client | Axios | 1.x |
| i18n | next-intl | 3.x |
| Animation | Framer Motion | 11.x |
| File upload | react-dropzone | 14.x |

## 2. Design System

### Colors (tailwind.config.ts)
primary: "#6366f1"
primary-dark: "#4f46e5"  
secondary: "#a855f7"
bg-base: "#F8FAFC"
bg-dark: "#0f172a"
Brand gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)

### Typography
Font: Inter
h1 (page): text-3xl font-bold text-slate-900
h2 (section): text-xl font-bold text-slate-800
KPI: text-3xl font-black
body: text-sm text-slate-600
caption: text-xs text-slate-500
badge: text-[11px] font-bold uppercase tracking-wider

### Special CSS
glass-card: background rgba(255,255,255,0.9) + backdrop-filter blur(10px)
brand-gradient: linear-gradient(135deg, #4F46E5, #7C3AED)
shadow-soft: box-shadow 0 4px 20px rgba(0,0,0,0.05)

### Border Radius
rounded-lg: cards, inputs
rounded-xl: large cards
rounded-2xl: hero sections
rounded-3xl: CTA buttons
rounded-full: pills, chips, avatars

## 3. All Routes

### Public
/ → Landing page
/login → Dang nhap
/register → Dang ky
/forgot-password → Quen mat khau
/reset-password → Reset mat khau

### Onboarding (auth required, no profile)
/onboarding → Profile Setup (3 steps)

### App (auth + profile required)
/dashboard → Trang chu
/market → Co hoi Thi truong
/health-check → Kiem tra Suc khoe
/health-check/import → Tai du lieu
/forecast → Du bao Xu huong
/recommendations → De xuat AI
/settings → Cai dat
/settings/profile → Thong tin
/settings/integrations → Ket noi KiotViet/Sapo
/settings/billing → Goi dich vu

## 4. Screens From Stitch (7 screens)

1. Landing page - InsightFlow AI brand - hero gradient purple
2. Profile Setup - 3 step onboarding - progress 33%
3. Import Data - dropzone + workflow 3 steps
4. Market Overview - 92/100 score + product cards + AI insight
5. Health Check - 4 KPIs + category risk chart + AI diagnosis
6. Forecast - 89% confidence + trend bars + product grid
7. Recommendations - 12 actions + priority cards + table

## 5. Additional Screens To Create

8. Login - centered card + gradient bg
9. Register - 2 column (form + benefits)
10. Forgot Password - email input
11. Reset Password - new password form  
12. Dashboard Home - quick overview all modules
13. Import Processing - progress animation
14. Settings Profile - form chinh sua thong tin
15. Settings Integrations - KiotViet/Sapo connect
16. Settings Billing - plan + payment
17. 404 Not Found

## 6. Component Map

### Layout
Header.tsx - sticky nav + lang + avatar
MobileNav.tsx
PageWrapper.tsx
LandingLayout.tsx
OnboardingLayout.tsx

### Common (reusable)
KPICard.tsx - metric card (45%, 89%)
RiskBadge.tsx - RUI RO CAO/TRUNG BINH/CHIEN LUOC
StatusBadge.tsx - PHAN TICH HOAN TAT / SAN SANG
ProgressBar.tsx - horizontal
GlassCard.tsx
AIInsightBox.tsx - purple AI box
ConfidenceBadge.tsx - 89%, 92%
TrendIndicator.tsx - +18%, -12%
AIChat.tsx - inline chat
EmptyState.tsx

### Per-page components
auth/ - LoginForm, RegisterForm, ForgotPasswordForm
landing/ - HeroSection, FeaturesSection, StepsSection, CTASection, Footer
onboarding/ - ProgressBar, LocationStep, CategoryStep, BusinessModelStep
health-check/ - KPIGrid, CategoryRiskChart, ChannelPerformance, RiskItemTable, AIAnalysisBox
import/ - FileDropzone, FormatCards, WorkflowSteps, FieldsGuide, ImportProgress
market/ - MarketScoreCard, ProductOpportunityCard, ChannelOpportunity, TrendHighlights
forecast/ - ForecastScoreCard, CategoryTrendChart, ProductPriorityGrid, ImportDirection, AIStrategyBox
recommendations/ - RecommendationKPIs, TopActionCards, RecommendationTable, SimulationPreview

## 7. API Endpoints

Base: process.env.NEXT_PUBLIC_API_URL (default: http://localhost:8080)
Auth header: Authorization: Bearer {accessToken}

Auth: POST /api/v1/auth/login|register-tenant|refresh|logout, GET /api/v1/auth/me
Catalog: GET/POST /api/v1/catalog/products, GET /api/v1/catalog/inventory/variants/{id}
Sales: GET/POST /api/v1/sales/orders, GET /api/v1/sales/customers
ML: GET /api/v1/ml/forecast/{id}, GET /api/v1/ml/recommendations, POST /api/v1/ml/recommendations/refresh

## 8. Conventions

Components: interface Props + named export
API: TanStack Query for GET, useMutation for POST/PUT/DELETE
Error: RFC 7807 from backend, show toast with detail
Responsive: mobile-first, sm/md/lg/xl breakpoints
TypeScript: no any, strict mode

## 9. Anti-patterns

NO inline API calls in components (use service layer)
NO hardcode URLs/tokens
NO inline style (use Tailwind)
NO any type
NO "use client" unless state/event needed
NO missing loading/error states
NO business logic in UI components
