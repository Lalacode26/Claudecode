'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { Post } from '@/types'
import { cn, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

interface PostCardProps {
  post: Post
  onEdit: (post: Post) => void
  onDelete: (postId: string) => void
  isDragging?: boolean
}

export default function PostCard({ post, onEdit, onDelete, isDragging }: PostCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } =
    useSortable({ id: post.id })

  const supabase = createClient()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Xóa bài này?')) return
    await supabase.from('posts').delete().eq('id', post.id)
    onDelete(post.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        'group bg-white rounded-lg p-3 mb-2 shadow-sm border border-slate-100',
        'cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow select-none',
        (isSortDragging || isDragging) && 'opacity-50 shadow-lg rotate-1 scale-105'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', CATEGORY_COLORS[post.category])}>
          {CATEGORY_LABELS[post.category]}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-700 leading-snug mb-1">{post.title}</p>

      {post.caption && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">{post.caption}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        {post.scheduled_at ? (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={10} />
            {format(new Date(post.scheduled_at), 'dd MMM', { locale: vi })}
          </div>
        ) : <span />}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); onEdit(post) }}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
