import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Brain, ArrowLeft, Users, Target, Lightbulb, Heart, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Kembali</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Tentang EmoTrackEd
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            EmoTrackEd adalah platform edukasi inovatif yang mengintegrasikan teknologi pelacakan emosi untuk
            meningkatkan pengalaman belajar dan mengoptimalkan hasil pembelajaran siswa.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Misi Kami
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menciptakan lingkungan pembelajaran yang adaptif dan responsif terhadap kebutuhan emosional siswa,
                  sehingga setiap individu dapat mencapai potensi maksimal mereka dalam belajar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Visi Kami
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menjadi platform edukasi terdepan yang menggabungkan kecerdasan emosional dan teknologi untuk
                  menciptakan generasi pembelajar yang lebih bahagia dan sukses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih EmoTrackEd?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  Pendekatan Emosional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Memahami bahwa emosi memainkan peran penting dalam pembelajaran dan memberikan dukungan yang tepat.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  Kolaborasi Tim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menghubungkan siswa, guru, dan administrator dalam satu platform yang terintegrasi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-green-500" />
                  Pembelajaran Adaptif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menyesuaikan metode pembelajaran berdasarkan kondisi emosional dan kebutuhan individual siswa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tim Pengembang</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Tim Teknologi</h3>
                <p className="text-sm text-muted-foreground">
                  Ahli dalam pengembangan AI dan machine learning untuk deteksi emosi
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Tim Edukasi</h3>
                <p className="text-sm text-muted-foreground">
                  Pakar pendidikan dan psikologi pembelajaran yang berpengalaman
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Tim Psikologi</h3>
                <p className="text-sm text-muted-foreground">
                  Spesialis dalam psikologi emosional dan perkembangan anak
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Bergabung dengan EmoTrackEd?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Mulai perjalanan pembelajaran yang lebih bermakna dan efektif dengan memahami emosi sebagai kunci sukses.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Mulai Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">EmoTrackEd</h2>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EmoTrackEd. Empowering Learning Through Emotions.
          </div>
        </div>
      </footer>
    </div>
  )
}
