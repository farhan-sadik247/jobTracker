import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Job Tracker',
  description: 'Track your job applications and optimize your CV with AI suggestions',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
