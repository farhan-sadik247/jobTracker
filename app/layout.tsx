import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Job Tracker App',
  description: 'Track your job applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      border: "hsl(214.3 31.8% 91.4%)",
                      input: "hsl(214.3 31.8% 91.4%)",
                      ring: "hsl(221.2 83.2% 53.3%)",
                      background: "hsl(0 0% 100%)",
                      foreground: "hsl(222.2 84% 4.9%)",
                      primary: {
                        DEFAULT: "hsl(221.2 83.2% 53.3%)",
                        foreground: "hsl(210 40% 98%)",
                      },
                      secondary: {
                        DEFAULT: "hsl(210 40% 96%)",
                        foreground: "hsl(222.2 84% 4.9%)",
                      },
                      destructive: {
                        DEFAULT: "hsl(0 84.2% 60.2%)",
                        foreground: "hsl(210 40% 98%)",
                      },
                      muted: {
                        DEFAULT: "hsl(210 40% 96%)",
                        foreground: "hsl(215.4 16.3% 46.9%)",
                      },
                      accent: {
                        DEFAULT: "hsl(210 40% 96%)",
                        foreground: "hsl(222.2 84% 4.9%)",
                      },
                      popover: {
                        DEFAULT: "hsl(0 0% 100%)",
                        foreground: "hsl(222.2 84% 4.9%)",
                      },
                      card: {
                        DEFAULT: "hsl(0 0% 100%)",
                        foreground: "hsl(222.2 84% 4.9%)",
                      },
                    },
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}