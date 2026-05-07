# PLAN.md — PostLab: AI Content Planner cho Fanpage Trung Tâm Lập Trình

## Bối cảnh

Người dùng quản lý content fanpage cho trung tâm dạy lập trình, làm việc một mình. Ba điểm đau chính cần giải quyết:

1. Bí ý tưởng bài đăng hằng ngày
2. Không có chỗ lên lịch và theo dõi tiến độ bài
3. Mất thời gian viết caption hấp dẫn

**Mục tiêu:** Xây fullstack web app public trên GitHub + Vercel (URL ai cũng truy cập được).

---

## App: "PostLab" — AI Content Planner for Fanpage

### Tính năng chính

| # | Tính năng | Mô tả |
|---|---|---|
| 1 | **Post Board (Kanban)** | Quản lý bài theo trạng thái: Ý tưởng → Bản nháp → Sẵn sàng → Đã đăng |
| 2 | **AI Idea Generator** | Nhập chủ đề, Claude sinh 5 ý tưởng bài cụ thể |
| 3 | **AI Caption Writer** | Nhập ý tưởng, Claude viết caption + hashtags phù hợp fanpage lập trình |
| 4 | **Content Calendar** | Xem lịch đăng bài theo tuần/tháng |
| 5 | **Thư viện nội dung** | Lưu bài nháp, caption đã tạo để tái sử dụng |

---

## Tech Stack

| Layer | Công nghệ | Lý do |
|---|---|---|
| Frontend + API | Next.js 14 (App Router) | Full-stack 1 repo, deploy Vercel dễ |
| Database + Auth | Supabase (PostgreSQL) | Free tier, auth có sẵn |
| AI | Claude API (`claude-sonnet-4-6`) | Viết caption + sinh ý tưởng |
| Styling | Tailwind CSS + shadcn/ui | Đẹp nhanh, không cần design nhiều |
| Deploy | Vercel (free tier) | URL public ngay lập tức |

---

## Cấu trúc thư mục

```
postlab/
├── app/
│   ├── (auth)/          # Login/signup pages
│   ├── dashboard/       # Kanban board chính
│   ├── calendar/        # Content calendar
│   ├── ai/              # AI idea + caption tools
│   └── api/
│       ├── posts/       # CRUD bài viết
│       └── ai/          # Proxy Claude API calls
├── components/
│   ├── PostCard.tsx
│   ├── KanbanBoard.tsx
│   ├── AIIdeaGenerator.tsx
│   ├── AICaptionWriter.tsx
│   └── Calendar.tsx
├── lib/
│   ├── supabase.ts
│   └── claude.ts        # Anthropic SDK wrapper
├── README.md
├── CLAUDE.md
└── PLAN.md
```

---

## Database Schema (Supabase)

```sql
-- Bảng posts
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES auth.users
title         text NOT NULL
caption       text
hashtags      text[]
status        text CHECK (status IN ('idea','draft','ready','posted'))
scheduled_at  timestamptz
category      text  -- tips | announcement | quote | testimonial | event
created_at    timestamptz DEFAULT now()
```

---

## AI Prompts

### Idea Generator
```
Bạn là content strategist cho fanpage trung tâm lập trình.
Sinh 5 ý tưởng bài đăng Facebook về chủ đề: {topic}.
Mỗi ý tưởng gồm: tiêu đề ngắn + góc tiếp cận độc đáo.
Trả về JSON array.
```

### Caption Writer
```
Viết caption Facebook hấp dẫn cho fanpage trung tâm dạy lập trình,
về chủ đề: {idea}.
Yêu cầu:
- Hook mạnh ở câu đầu tiên
- Nội dung có giá trị thực tế
- CTA rõ ràng ở cuối
- 5-8 hashtags (tiếng Việt + tiếng Anh)
Tone: thân thiện, chuyên nghiệp, truyền cảm hứng.
```

---

## Các bước triển khai

1. `npx create-next-app@latest postlab` — scaffold dự án
2. Cài dependencies: `@supabase/supabase-js`, `@anthropic-ai/sdk`, `shadcn/ui`, `@dnd-kit/core`
3. Setup Supabase project + tạo tables + enable Auth
4. Build Kanban board với drag-drop (thay đổi status)
5. Build AI Idea Generator (gọi Claude API)
6. Build AI Caption Writer (gọi Claude API)
7. Build Calendar view (hiển thị bài theo ngày)
8. Tạo README.md, CLAUDE.md, PLAN.md trong project
9. Khởi tạo git, push lên GitHub (public repo)
10. Deploy lên Vercel + cấu hình env vars

---

## Files bắt buộc trong project

| File | Nội dung |
|---|---|
| `README.md` | Mô tả app, hướng dẫn cài đặt, screenshots, live URL |
| `CLAUDE.md` | Hướng dẫn cho Claude Code khi làm việc với repo |
| `PLAN.md` | Kế hoạch dự án, roadmap tính năng (file này) |
| `CONVERSATION_EXPORT.md` | Export cuộc trò chuyện lên kế hoạch với Claude |

---

## Kết quả mong đợi

- **GitHub URL:** `https://github.com/{username}/postlab` (public)
- **Live URL:** `https://postlab.vercel.app` (hoặc tương tự)
- Bất kỳ ai cũng có thể đăng ký tài khoản và dùng app

---

## Kiểm tra hoàn thành

- [ ] Truy cập Vercel URL → thấy trang login
- [ ] Đăng ký tài khoản → vào được dashboard
- [ ] Tạo bài mới, kéo thả qua các cột Kanban
- [ ] AI Idea Generator trả về 5 ý tưởng
- [ ] AI Caption Writer trả về caption + hashtags
- [ ] Calendar hiển thị bài đã lên lịch
- [ ] GitHub repo ở trạng thái public
- [ ] Có đủ 4 files: README.md, CLAUDE.md, PLAN.md, CONVERSATION_EXPORT.md
