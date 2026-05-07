'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Post, PostStatus, PostCategory } from '@/types'
import { CATEGORY_LABELS, STATUS_COLUMNS } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

interface PostModalProps {
  post: Post | null
  defaultStatus: PostStatus
  userId: string
  onSave: (post: Post) => void
  onClose: () => void
}

export default function PostModal({ post, defaultStatus, userId, onSave, onClose }: PostModalProps) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [caption, setCaption] = useState(post?.caption ?? '')
  const [hashtags, setHashtags] = useState(post?.hashtags?.join(' ') ?? '')
  const [status, setStatus] = useState<PostStatus>(post?.status ?? defaultStatus)
  const [category, setCategory] = useState<PostCategory>(post?.category ?? 'tips')
  const [scheduledAt, setScheduledAt] = useState(
    post?.scheduled_at ? post.scheduled_at.substring(0, 16) : ''
  )
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const data = {
      title: title.trim(),
      caption: caption.trim() || null,
      hashtags: hashtags.trim() ? hashtags.trim().split(/\s+/) : null,
      status,
      category,
      scheduled_at: scheduledAt || null,
      user_id: userId,
    }

    let savedPost: Post | null = null

    if (post) {
      const { data: updated } = await supabase
        .from('posts').update(data).eq('id', post.id).select().single()
      savedPost = updated
    } else {
      const { data: created } = await supabase
        .from('posts').insert(data).select().single()
      savedPost = created
    }

    if (savedPost) onSave(savedPost)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">{post ? 'Chỉnh sửa bài' : 'Tạo bài mới'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Tên bài hoặc ý tưởng..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as PostCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as PostStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {STATUS_COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Nội dung caption..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hashtags</label>
            <input
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="#laptrình #coding #hoclaptrinh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày đăng</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu bài'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
