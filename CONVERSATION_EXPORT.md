# Conversation Export — PostLab Planning Session

**Ngày:** 07/05/2026  
**Công cụ:** Claude Code (claude-sonnet-4-6)  
**Mục đích:** Lên kế hoạch và xây dựng PostLab web app

---

## Tóm tắt cuộc trò chuyện

### Yêu cầu ban đầu của người dùng

> "Tôi đang cần xây dựng một web app fullstack. Tiêu chí bao gồm: Full-stack, Code nằm trên Github, Có đường link URL ai cũng truy cập được. Tôi làm content fanpage cho trung tâm dạy lập trình. Hãy gợi ý web app có thể hỗ trợ công việc của tôi tốt nhất."

### Phân tích nhu cầu

Claude hỏi 2 câu hỏi:
1. Điểm khó khăn nhất trong công việc content?
2. Làm một mình hay có team?

**Người dùng trả lời:**
- Khó khăn: Lên ý tưởng bài + Lập lịch theo dõi + Viết caption
- Team size: Một mình

### Đề xuất được chọn

**"PostLab" — AI Content Planner** với:
- Kanban Board (4 cột: Ý tưởng → Bản nháp → Sẵn sàng → Đã đăng)
- AI Idea Generator (Claude sinh 5 ý tưởng)
- AI Caption Writer (caption + hashtags theo tone)
- Content Calendar (lịch tháng)

**Tech stack:** Next.js 14 + Supabase + Claude API + Vercel

---

## Quyết định thiết kế quan trọng

1. **Dùng Supabase thay vì tự build backend** — tiết kiệm thời gian, free tier đủ dùng
2. **AI calls qua API routes** — giữ ANTHROPIC_API_KEY server-side, bảo mật
3. **Kanban + drag-drop** — trực quan hơn list view cho content workflow
4. **@dnd-kit thay vì react-beautiful-dnd** — hiện đại hơn, hỗ trợ TypeScript tốt hơn
5. **claude-sonnet-4-6** — chất lượng tốt nhất cho tiếng Việt, cân bằng speed/cost

---

## Files được tạo

```
postlab/
├── app/login/page.tsx
├── app/dashboard/page.tsx
├── app/ai/page.tsx
├── app/calendar/page.tsx
├── app/api/posts/route.ts
├── app/api/ai/ideas/route.ts
├── app/api/ai/caption/route.ts
├── components/KanbanBoard.tsx
├── components/PostCard.tsx
├── components/PostModal.tsx
├── components/AIIdeaGenerator.tsx
├── components/AICaptionWriter.tsx
├── components/CalendarView.tsx
├── components/Navbar.tsx
├── lib/supabase.ts
├── lib/supabase-server.ts
├── lib/utils.ts
├── types/index.ts
├── middleware.ts
├── supabase/schema.sql
├── README.md
├── CLAUDE.md
├── PLAN.md
└── CONVERSATION_EXPORT.md (file này)
```
