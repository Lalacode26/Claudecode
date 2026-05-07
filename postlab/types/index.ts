export type PostStatus = 'idea' | 'draft' | 'ready' | 'posted'
export type PostCategory = 'tips' | 'announcement' | 'quote' | 'testimonial' | 'event' | 'other'

export interface Post {
  id: string
  user_id: string
  title: string
  caption: string | null
  hashtags: string[] | null
  status: PostStatus
  scheduled_at: string | null
  category: PostCategory
  created_at: string
}

export interface AIIdea {
  title: string
  angle: string
}
