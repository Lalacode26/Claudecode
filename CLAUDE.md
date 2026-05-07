# CLAUDE.md — PostLab

## Tổng quan

PostLab là AI Content Planner cho fanpage trung tâm lập trình. Full-stack Next.js 14 + Supabase + Claude API.

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- **Supabase** — PostgreSQL database + auth (cookie-based sessions với `@supabase/ssr`)
- **Claude API** — `claude-sonnet-4-6` cho AI features
- **@dnd-kit** — drag-and-drop Kanban board

## Cấu trúc thư mục quan trọng

```
app/
  login/page.tsx            # Auth (client component)
  dashboard/page.tsx        # Kanban board (server component, fetch posts)
  ai/page.tsx               # AI tools page
  calendar/page.tsx         # Calendar view
  api/posts/route.ts        # CRUD posts API
  api/ai/ideas/route.ts     # Claude idea generation
  api/ai/caption/route.ts   # Claude caption writing
components/
  KanbanBoard.tsx           # Drag-drop board (client)
  PostCard.tsx              # Sortable card (client)
  PostModal.tsx             # Create/edit modal (client)
  AIIdeaGenerator.tsx       # AI idea tool (client)
  AICaptionWriter.tsx       # AI caption tool (client)
  CalendarView.tsx          # Monthly calendar (client)
  Navbar.tsx                # Navigation (client)
lib/
  supabase.ts               # Browser client
  supabase-server.ts        # Server client (dùng trong Server Components)
  utils.ts                  # cn(), constants
types/index.ts              # Post, PostStatus, PostCategory, AIIdea
middleware.ts               # Auth protection cho /dashboard, /ai, /calendar
```

## Quy tắc bảo mật

- **ANTHROPIC_API_KEY** chỉ được dùng trong API routes (`app/api/ai/`) — KHÔNG dùng ở client
- Supabase dùng **Row Level Security** — users chỉ thấy posts của mình (`user_id = auth.uid()`)
- Middleware bảo vệ tất cả routes protected, redirect về `/login` nếu chưa auth

## AI Model

Dùng `claude-sonnet-4-6` cho tất cả AI calls. Không thay đổi model.

## Database

Table `posts` có các cột: `id`, `user_id`, `title`, `caption`, `hashtags` (text[]), `status`, `scheduled_at`, `category`, `created_at`.

`status` enum: `idea | draft | ready | posted`  
`category` enum: `tips | announcement | quote | testimonial | event | other`

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint check
```

## Env vars cần thiết

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
```
