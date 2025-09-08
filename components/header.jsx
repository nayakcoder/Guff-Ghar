'use client'

import { Home, MessageCircle, Users, Video, User, Search, Bell, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore, useAuthStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeSelector } from '@/components/theme-selector'

export function Header() {
  const pathname = usePathname()
  const language = useUIStore((state) => state.language)
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const user = useAuthStore((state) => state.user)
  const t = translations[language]

  const navItems = [
    { href: '/feed', icon: Home, label: t.feed },
    { href: '/reels', icon: Video, label: t.reels },
    { href: '/friends', icon: Users, label: t.friends },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <Link href="/feed" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">GG</span>
            </div>
            <span className="hidden sm:inline-block font-bold text-xl">{t.app_name}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'flex items-center space-x-2 px-4',
                  pathname === item.href && 'bg-secondary'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label={t.search}>
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" aria-label={t.notifications}>
            <Bell className="h-4 w-4" />
          </Button>

          <ThemeSelector />

          {user ? (
            <Link href={`/profile/${user.id}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} alt={user.username} />
                <AvatarFallback>
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm">{t.login}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}