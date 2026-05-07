'use client'

import { useState } from 'react'
import { Wand2, Copy, Loader2, Check } from 'lucide-react'

const TONES = [
  { value: 'friendly', label: 'Thân thiện' },
  { value: 'professional', label: 'Chuyên nghiệp' },
  { value: 'inspiring', label: 'Truyền cảm hứng' },
]

export default function AICaptionWriter() {
  const [idea, setIdea] = useState('')
  const [tone, setTone] = useState('friendly')
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [copiedHashtags, setCopiedHashtags] = useState(false)

  const generate = async () => {
    if (!idea.trim()) return
    setLoading(true)
    setError('')
    setCaption('')
    setHashtags('')

    try {
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, tone }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCaption(data.caption)
      setHashtags(data.hashtags)
    } catch {
      setError('Không thể kết nối AI. Kiểm tra ANTHROPIC_API_KEY trong .env.local')
    }
    setLoading(false)
  }

  const copy = async (text: string, type: 'caption' | 'hashtags') => {
    await navigator.clipboard.writeText(text)
    if (type === 'caption') {
      setCopiedCaption(true)
      setTimeout(() => setCopiedCaption(false), 2000)
    } else {
      setCopiedHashtags(true)
      setTimeout(() => setCopiedHashtags(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 size={18} className="text-violet-500" />
          <h2 className="font-bold text-slate-800">Viết Caption</h2>
        </div>
        <p className="text-xs text-slate-500">AI viết caption hấp dẫn + hashtags tự động</p>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ý tưởng / Chủ đề bài</label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Ví dụ: 5 lý do nên học Python năm 2025, hoặc dán ý tưởng từ AI bên trái..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tone giọng</label>
          <div className="flex gap-2">
            {TONES.map(t => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  tone === t.value
                    ? 'bg-violet-100 text-violet-700 border border-violet-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !idea.trim()}
          className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Đang viết caption...</>
            : <><Wand2 size={14} /> Viết Caption</>
          }
        </button>

        {error && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-lg">{error}</p>}

        {caption && (
          <div className="space-y-3">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Caption
              </label>
              <div className="p-3 pr-10 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {caption}
              </div>
              <button
                onClick={() => copy(caption, 'caption')}
                className="absolute top-8 right-2 p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
                title="Sao chép"
              >
                {copiedCaption
                  ? <Check size={12} className="text-green-500" />
                  : <Copy size={12} className="text-slate-400" />
                }
              </button>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Hashtags
              </label>
              <div className="p-3 pr-10 bg-violet-50 rounded-lg border border-violet-100 text-sm text-violet-700 leading-relaxed">
                {hashtags}
              </div>
              <button
                onClick={() => copy(hashtags, 'hashtags')}
                className="absolute top-8 right-2 p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
                title="Sao chép"
              >
                {copiedHashtags
                  ? <Check size={12} className="text-green-500" />
                  : <Copy size={12} className="text-slate-400" />
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
