import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Brain, ArrowRight, Smile, Lightbulb } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              EmoTrackEd
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm hover:text-primary transition-colors">
                Fitur
              </Link>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">
                Tentang
              </Link>
            </nav>
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Empowering Learning
            </span>{" "}
            Through Emotions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Platform edukasi inovatif yang mengintegrasikan pelacakan emosi untuk meningkatkan pengalaman belajar dan
            mengoptimalkan hasil pembelajaran.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/login">
                Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-primary/10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emotional Tracking</h3>
              <p className="text-muted-foreground">
                Lacak dan analisis emosi melalui ekspresi wajah, suara, dan teks untuk memahami pola emosional dalam
                proses pembelajaran.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-primary/10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Education Support</h3>
              <p className="text-muted-foreground">
                Dapatkan wawasan tentang bagaimana emosi memengaruhi pembelajaran dan strategi untuk mengoptimalkan
                kondisi belajar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-primary/10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Adaptive Feedback</h3>
              <p className="text-muted-foreground">
                Terima umpan balik yang disesuaikan berdasarkan keadaan emosional untuk meningkatkan efektivitas
                pembelajaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Meningkatkan Pengalaman Belajar?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan EmoTrackEd dan temukan cara baru untuk memahami dan memanfaatkan emosi dalam proses
            pembelajaran.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">
              Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* New Footer */}
      <footer className="bg-gradient-to-r from-primary/10 via-background to-purple-400/10 py-16 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  EmoTrackEd
                </h2>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Platform edukasi inovatif yang mengintegrasikan pelacakan emosi untuk meningkatkan pengalaman belajar
                dan mengoptimalkan hasil pembelajaran.
              </p>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Masuk
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-muted-foreground">Panduan Pengguna</span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">FAQ</span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">Bantuan Teknis</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} EmoTrackEd. All rights reserved. Empowering Learning Through Emotions.
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
