import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'Guff Ghar - Your Digital Home',
  description: 'The All-in-One Nepali Social Hub - Chat, Share, and Connect',
  keywords: 'social media, nepal, chat, reels, friends, guff ghar',
  openGraph: {
    title: 'Guff Ghar - Your Digital Home',
    description: 'The All-in-One Nepali Social Hub - Chat, Share, and Connect',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}