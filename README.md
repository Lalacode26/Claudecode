# PostLab ✏️

AI-powered content planner cho fanpage trung tâm lập trình. Quản lý bài đăng, sinh ý tưởng, viết caption với Claude AI.

## Live Demo

**URL:** _Cập nhật sau khi deploy lên Vercel_  
**GitHub:** https://github.com/Lalacode26/postlab

---

## Tính năng

| Tính năng | Mô tả |
|---|---|
| **Kanban Board** | Kéo thả bài qua 4 trạng thái: Ý tưởng → Bản nháp → Sẵn sàng → Đã đăng |
| **AI Idea Generator** | Nhập chủ đề, Claude AI sinh 5 ý tưởng bài cụ thể |
| **AI Caption Writer** | Viết caption hấp dẫn + hashtags tự động theo tone giọng |
| **Content Calendar** | Xem lịch đăng bài theo tháng |
| **Auth** | Đăng ký/đăng nhập bảo mật qua Supabase |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database + Auth:** Supabase (PostgreSQL + Row Level Security)
- **AI:** Claude API — model `claude-sonnet-4-6` (Anthropic)
- **Styling:** Tailwind CSS
- **Drag & Drop:** @dnd-kit
- **Deploy:** Vercel (free tier)

---

## Cài đặt local

### Yêu cầu

- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Tài khoản Supabase ([supabase.com](https://supabase.com)) — free
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Bước 1: Clone và cài dependencies

```bash
git clone https://github.com/YOUR_USERNAME/postlab.git
cd postlab
npm install
```

### Bước 2: Setup Supabase

1. Tạo project mới tại [supabase.com](https://supabase.com)
2. Vào **SQL Editor** → chạy toàn bộ nội dung file `supabase/schema.sql`
3. Vào **Settings → API** → sao chép **Project URL** và **anon public key**

### Bước 3: Cấu hình environment variables

```bash
cp .env.local.example .env.local
```

Mở `.env.local` và điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
ANTHROPIC_API_KEY=sk-ant-...
```

### Bước 4: Chạy app

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — đăng ký tài khoản và bắt đầu dùng.

---

## Deploy lên Vercel

1. Push code lên GitHub (public repo)
2. Vào [vercel.com](https://vercel.com) → **Add New Project** → Import repo
3. Thêm 3 environment variables trong Vercel dashboard (giống `.env.local`)
4. Click **Deploy** — xong!

---

## Cấu trúc project

```
postlab/
├── app/                    # Next.js App Router
│   ├── login/              # Trang đăng nhập/đăng ký
│   ├── dashboard/          # Kanban board
│   ├── ai/                 # AI Tools
│   ├── calendar/           # Lịch đăng bài
│   └── api/                # API routes
│       ├── posts/          # CRUD bài viết
│       └── ai/             # Claude API proxy
├── components/             # React components
├── lib/                    # Supabase clients + utils
├── types/                  # TypeScript types
├── supabase/               # SQL schema
├── README.md
├── CLAUDE.md
└── PLAN.md
```
