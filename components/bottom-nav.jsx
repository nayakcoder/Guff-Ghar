'use client'

import { Home, Search, MessageCircle, User, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const language = useUIStore((state) => state.language)
  const t = translations[language]

  const navItems = [
    { href: '/feed', icon: Home, label: 'Home' },
    { href: '/explore', icon: Search, label: 'Explore' },
    { href: '/create', icon: Plus, label: 'Create', isCenter: true },
    { href: '/chat', icon: MessageCircle, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop */}
      <div className="bg-black/95 backdrop-blur-lg border-t border-gray-900">
        <div className="flex items-center justify-around px-4 py-2 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            if (item.isCenter) {
              return (
                <Link key={item.href} href={item.href} className="relative">
                  <Button
                    size="icon"
                    className={cn(
                      'w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transform transition-all duration-200',
                      'absolute -top-6 left-1/2 transform -translate-x-1/2',
                      'hover:scale-110 active:scale-95'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                  </Button>
                </Link>
              )
            }
            
            return (
              <Link key={item.href} href={item.href} className="flex-1 max-w-[80px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'w-full h-12 flex flex-col items-center justify-center space-y-1 rounded-lg transition-colors',
                    isActive 
                      ? 'text-green-400 bg-green-500/10' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-black/95"></div>
    </nav>
  )
}