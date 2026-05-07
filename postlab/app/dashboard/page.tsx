import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import KanbanBoard from '@/components/KanbanBoard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">Bảng Content</h1>
            <p className="text-slate-500 text-sm">Kéo thả bài qua các cột để thay đổi trạng thái</p>
          </div>
          <KanbanBoard initialPosts={posts ?? []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
