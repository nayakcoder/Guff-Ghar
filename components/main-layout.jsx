'use client'

import { BottomNav } from '@/components/bottom-nav'

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <main id="main-content" className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}