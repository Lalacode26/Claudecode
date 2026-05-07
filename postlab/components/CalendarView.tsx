'use client'

import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Post } from '@/types'
import { cn, CATEGORY_COLORS } from '@/lib/utils'

const STATUS_DOT: Record<string, string> = {
  idea: 'bg-slate-400',
  draft: 'bg-yellow-400',
  ready: 'bg-green-400',
  posted: 'bg-blue-500',
}

const STATUS_LABELS: Record<string, string> = {
  idea: 'Ý tưởng',
  draft: 'Bản nháp',
  ready: 'Sẵn sàng',
  posted: 'Đã đăng',
}

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export default function CalendarView({ posts }: { posts: Post[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days: Date[] = []
  let d = calStart
  while (d <= calEnd) { days.push(d); d = addDays(d, 1) }

  const getPostsForDay = (date: Date) =>
    posts.filter(p => p.scheduled_at && isSameDay(new Date(p.scheduled_at), date))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-bold text-slate-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: vi })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEK_DAYS.map(day => (
          <div key={day} className="py-2.5 text-center text-xs font-semibold text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayPosts = getPostsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={idx}
              className={cn(
                'min-h-[90px] p-1.5 border-b border-r border-slate-50 last:border-r-0',
                !isCurrentMonth && 'bg-slate-50/60 opacity-60',
                isToday && 'bg-violet-50/50'
              )}
            >
              <div className={cn(
                'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1',
                isToday ? 'bg-violet-600 text-white' : 'text-slate-500'
              )}>
                {format(day, 'd')}
              </div>

              {dayPosts.slice(0, 2).map(post => (
                <div
                  key={post.id}
                  title={post.title}
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded mb-0.5 truncate flex items-center gap-1',
                    CATEGORY_COLORS[post.category]
                  )}
                >
                  <span className={cn('shrink-0 w-1.5 h-1.5 rounded-full', STATUS_DOT[post.status])} />
                  <span className="truncate">{post.title}</span>
                </div>
              ))}

              {dayPosts.length > 2 && (
                <div className="text-xs text-slate-400 pl-1">+{dayPosts.length - 2}</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-full">Trạng thái</span>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_DOT[key])} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
