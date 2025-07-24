import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PBN Manager - Управление сетью сайтов',
  description: 'Система управления PBN (Private Blog Network) с автоматизацией развертывания, индексации и мониторинга',
  keywords: 'PBN, SEO, автоматизация, управление сайтами, индексация',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
} 