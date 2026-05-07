# PLAN.md — PostLab

## Bối cảnh & Mục tiêu

**Người dùng:** Content creator cho fanpage trung tâm dạy lập trình, làm việc một mình.

**Vấn đề cần giải quyết:**
1. Bí ý tưởng bài đăng hằng ngày
2. Không có chỗ lên lịch và theo dõi tiến độ bài
3. Mất thời gian viết caption hấp dẫn

**Mục tiêu:** Fullstack web app public trên GitHub + Vercel.

---

## Giải pháp: PostLab

App gồm 3 tính năng chính giải quyết đúng 3 điểm đau:

| Điểm đau | Giải pháp |
|---|---|
| Bí ý tưởng | AI Idea Generator — Claude sinh 5 ý tưởng theo chủ đề |
| Quản lý tiến độ | Kanban Board — kéo thả bài qua 4 trạng thái |
| Viết caption | AI Caption Writer — Claude viết caption + hashtags |

---

## Tech Stack

| Layer | Công nghệ | Lý do chọn |
|---|---|---|
| Frontend + API | Next.js 14 App Router | Full-stack 1 repo, deploy Vercel dễ |
| Database + Auth | Supabase | Free tier, RLS built-in, auth có sẵn |
| AI | Claude API (`claude-sonnet-4-6`) | Chất lượng tốt nhất cho viết tiếng Việt |
| Styling | Tailwind CSS | Nhanh, responsive |
| Deploy | Vercel | Free, CI/CD tự động từ GitHub |

---

## Roadmap

### v1.0 (MVP — hiện tại)
- [x] Auth (đăng ký/đăng nhập email)
- [x] Kanban Board 4 cột, drag-drop
- [x] CRUD bài viết (tạo, sửa, xóa)
- [x] AI Idea Generator
- [x] AI Caption Writer (3 tone giọng)
- [x] Content Calendar (monthly view)

### v1.1 (sau khi deploy)
- [ ] Thêm ảnh/media vào bài
- [ ] Export caption ra clipboard định dạng đẹp
- [ ] Thống kê: số bài theo trạng thái, theo tháng
- [ ] Nhắc nhở lịch đăng bài

### v2.0 (tương lai)
- [ ] Team collaboration (nhiều thành viên)
- [ ] Kết nối Facebook API để đăng bài trực tiếp
- [ ] AI phân tích hiệu quả bài đăng
