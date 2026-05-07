'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import type { Post, PostStatus } from '@/types'
import { STATUS_COLUMNS } from '@/lib/utils'
import PostCard from './PostCard'
import PostModal from './PostModal'
import { createClient } from '@/lib/supabase'

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[200px] rounded-xl p-2 border-2 border-dashed transition-colors ${
        isOver ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-transparent'
      }`}
    >
      {children}
    </div>
  )
}

interface KanbanBoardProps {
  initialPosts: Post[]
  userId: string
}

export default function KanbanBoard({ initialPosts, userId }: KanbanBoardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<PostStatus>('idea')
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getPostsByStatus = (status: PostStatus) => posts.filter(p => p.status === status)

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activePost = posts.find(p => p.id === active.id)
    if (!activePost) return

    const overId = over.id as string
    const targetColumn = STATUS_COLUMNS.find(col => col.id === overId)
    const newStatus = targetColumn?.id ?? posts.find(p => p.id === overId)?.status

    if (!newStatus || newStatus === activePost.status) return

    setPosts(prev => prev.map(p => p.id === activePost.id ? { ...p, status: newStatus as PostStatus } : p))
    await supabase.from('posts').update({ status: newStatus }).eq('id', activePost.id)
  }

  const openNewPost = (status: PostStatus) => {
    setEditingPost(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const openEditPost = (post: Post) => {
    setEditingPost(post)
    setModalOpen(true)
  }

  const handleSave = (post: Post) => {
    setPosts(prev => {
      const exists = prev.find(p => p.id === post.id)
      return exists ? prev.map(p => p.id === post.id ? post : p) : [post, ...prev]
    })
  }

  const handleDelete = (postId: string) => setPosts(prev => prev.filter(p => p.id !== postId))

  const activePost = posts.find(p => p.id === activeId)

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map(column => {
            const columnPosts = getPostsByStatus(column.id as PostStatus)
            return (
              <div key={column.id} className="flex flex-col gap-2">
                <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${column.headerColor}`}>
                  <span className="font-semibold text-sm">{column.label}</span>
                  <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full font-medium">
                    {columnPosts.length}
                  </span>
                </div>
                <DroppableColumn id={column.id}>
                  <SortableContext items={columnPosts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {columnPosts.map(post => (
                      <PostCard key={post.id} post={post} onEdit={openEditPost} onDelete={handleDelete} />
                    ))}
                  </SortableContext>
                  <button
                    onClick={() => openNewPost(column.id as PostStatus)}
                    className="mt-1 w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 text-xs py-2 rounded-lg hover:bg-white/70 transition"
                  >
                    <Plus size={12} /> Thêm bài
                  </button>
                </DroppableColumn>
              </div>
            )
          })}
        </div>

        <DragOverlay>
          {activePost ? (
            <PostCard post={activePost} onEdit={() => {}} onDelete={() => {}} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {modalOpen && (
        <PostModal
          post={editingPost}
          defaultStatus={defaultStatus}
          userId={userId}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
