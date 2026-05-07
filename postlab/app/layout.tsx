import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PostLab — AI Content Planner',
  description: 'Lên kế hoạch content fanpage lập trình với AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
