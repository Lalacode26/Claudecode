import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_LABELS: Record<string, string> = {
  tips: 'Tips',
  announcement: 'Thông báo',
  quote: 'Quotes',
  testimonial: 'Học viên',
  event: 'Sự kiện',
  other: 'Khác',
}

export const CATEGORY_COLORS: Record<string, string> = {
  tips: 'bg-blue-100 text-blue-700',
  announcement: 'bg-orange-100 text-orange-700',
  quote: 'bg-purple-100 text-purple-700',
  testimonial: 'bg-green-100 text-green-700',
  event: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
}

export const STATUS_COLUMNS = [
  { id: 'idea', label: 'Ý tưởng', color: 'bg-slate-100', headerColor: 'bg-slate-200 text-slate-700' },
  { id: 'draft', label: 'Bản nháp', color: 'bg-yellow-50', headerColor: 'bg-yellow-100 text-yellow-700' },
  { id: 'ready', label: 'Sẵn sàng', color: 'bg-green-50', headerColor: 'bg-green-100 text-green-700' },
  { id: 'posted', label: 'Đã đăng', color: 'bg-blue-50', headerColor: 'bg-blue-100 text-blue-700' },
] as const
