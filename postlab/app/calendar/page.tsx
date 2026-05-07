import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import CalendarView from '@/components/CalendarView'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .not('scheduled_at', 'is', null)
    .order('scheduled_at', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">Lịch Đăng Bài</h1>
            <p className="text-slate-500 text-sm">Bài nào có ngày đăng sẽ hiển thị ở đây</p>
          </div>
          <CalendarView posts={posts ?? []} />
        </div>
      </main>
    </div>
  )
}
