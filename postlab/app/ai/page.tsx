import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import AIIdeaGenerator from '@/components/AIIdeaGenerator'
import AICaptionWriter from '@/components/AICaptionWriter'

export default async function AIPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">AI Tools</h1>
            <p className="text-slate-500 text-sm">Sinh ý tưởng và viết caption với Claude AI</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIIdeaGenerator userId={user.id} />
            <AICaptionWriter />
          </div>
        </div>
      </main>
    </div>
  )
}
