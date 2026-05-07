'use client'

import { useState } from 'react'
import { Sparkles, Plus, Loader2, Check } from 'lucide-react'
import type { AIIdea, PostCategory } from '@/types'
import { CATEGORY_LABELS } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

const QUICK_TOPICS = [
  'Tips lập trình Python',
  'Lỗi thường gặp khi học code',
  'Lộ trình học Frontend 2025',
  'Học lập trình và tìm việc IT',
  'Thông báo khai giảng khóa học',
  'Câu chuyện học viên thành công',
]

export default function AIIdeaGenerator({ userId }: { userId: string }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState<PostCategory>('tips')
  const [ideas, setIdeas] = useState<AIIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const supabase = createClient()

  const generateIdeas = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setIdeas([])

    try {
      const res = await fetch('/api/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setIdeas(data.ideas ?? [])
    } catch {
      setError('Không thể kết nối AI. Kiểm tra ANTHROPIC_API_KEY trong .env.local')
    }
    setLoading(false)
  }

  const saveIdea = async (idea: AIIdea, index: number) => {
    await supabase.from('posts').insert({
      user_id: userId,
      title: idea.title,
      caption: idea.angle,
      status: 'idea',
      category,
    })
    setSavedIds(prev => new Set(prev).add(index))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-violet-500" />
          <h2 className="font-bold text-slate-800">Sinh Ý Tưởng Bài</h2>
        </div>
        <p className="text-xs text-slate-500">AI đề xuất 5 ý tưởng theo chủ đề</p>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Gợi ý nhanh
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TOPICS.map(t => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  topic === t
                    ? 'bg-violet-100 border-violet-300 text-violet-700 font-medium'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề tùy chỉnh</label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generateIdeas()}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Nhập chủ đề bất kỳ..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Loại bài</label>
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

        <button
          onClick={generateIdeas}
          disabled={loading || !topic.trim()}
          className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Đang sinh ý tưởng...</>
            : <><Sparkles size={14} /> Sinh 5 ý tưởng</>
          }
        </button>

        {error && (
          <p className="text-red-500 text-xs bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        {ideas.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kết quả</p>
            {ideas.map((idea, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-violet-200 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 leading-snug">{idea.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{idea.angle}</p>
                  </div>
                  <button
                    onClick={() => saveIdea(idea, i)}
                    disabled={savedIds.has(i)}
                    className={`shrink-0 p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                      savedIds.has(i)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                    }`}
                  >
                    {savedIds.has(i) ? <Check size={12} /> : <Plus size={12} />}
                    {savedIds.has(i) ? 'Đã lưu' : 'Lưu'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
