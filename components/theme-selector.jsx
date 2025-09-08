'use client'

import { useState } from 'react'
import { Monitor, Moon, Sun, Contrast } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export function ThemeSelector() {
  const { theme, setTheme, language } = useUIStore()
  const t = translations[language]

  const themes = [
    { value: 'light', label: t.light_mode, icon: Sun },
    { value: 'dark', label: t.dark_mode, icon: Moon },
    { value: 'high-contrast', label: t.high_contrast, icon: Contrast },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <currentTheme.icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center space-x-2"
          >
            <themeOption.icon className="h-4 w-4" />
            <span>{themeOption.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}