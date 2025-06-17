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

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Bagaimana Ini Bekerja</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Gabung Kelas</h3>
              <p className="text-muted-foreground">
                Pilih dan gabung kelas sesuai dengan materi pembelajaran yang kamu butuhkan.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Belajar & Pantau</h3>
              <p className="text-muted-foreground">
                Ikuti pembelajaran sambil aplikasi memantau respon emosi secara real-time.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Dapatkan Wawasan</h3>
              <p className="text-muted-foreground">
                Akses laporan dan analisis tentang pola emosi untuk meningkatkan pengalaman belajar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Mulai Perjalanan Belajarmu</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas kami dan rasakan pengalaman belajar yang lebih personal dan efektif dengan
            dukungan teknologi pelacakan emosi.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Mereka</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 mr-3"></div>
                <div>
                  <h4 className="font-semibold">Ahmad S.</h4>
                  <p className="text-sm text-muted-foreground">Siswa SMA</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "EmoTrackEd membantu saya menyadari pola emosi saat belajar matematika. Sekarang saya tahu kapan harus
                istirahat sejenak untuk hasil yang lebih baik."
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 mr-3"></div>
                <div>
                  <h4 className="font-semibold">Dr. Siti R.</h4>
                  <p className="text-sm text-muted-foreground">Pengajar Universitas</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Sebagai pengajar, platform ini memberikan wawasan berharga tentang bagaimana siswa saya merespons
                materi. Saya bisa menyesuaikan metode pengajaran dengan lebih efektif."
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 mr-3"></div>
                <div>
                  <h4 className="font-semibold">Dewi P.</h4>
                  <p className="text-sm text-muted-foreground">Orang Tua</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Melihat perkembangan emosional anak saya selama belajar sangat mencerahkan. Kami sekarang tahu kapan
                dia frustrasi dan kapan dia merasa percaya diri."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Brain className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-bold">EmoTrackEd</h2>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-2">Platform</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/features" className="text-muted-foreground hover:text-foreground">
                      Fitur
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                      Harga
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Perusahaan</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      Tentang
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                      Karir
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kontak</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/support" className="text-muted-foreground hover:text-foreground">
                      Dukungan
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      Hubungi Kami
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EmoTrackEd. Hak cipta dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
