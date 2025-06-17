import { Inter } from "next/font/google"
import "./globals.css"
import "./fix-borders.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EmoTrackEd - Empowering Learning Through Emotions",
  description: "Aplikasi edukasi berbasis pelacakan emosi",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
