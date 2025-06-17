# EmoTrackEd - JavaScript Version

## Konversi dari TypeScript ke JavaScript

Aplikasi EmoTrackEd telah berhasil dikonversi dari TypeScript ke JavaScript vanilla, dengan mempertahankan semua fungsionalitas dan tampilan yang sama.

## Perubahan yang Dilakukan

1. Menghapus anotasi tipe TypeScript dari semua file
2. Mengubah ekstensi file dari `.tsx` dan `.ts` menjadi `.js`
3. Mengupdate konfigurasi proyek:
   - Menghapus dependensi TypeScript dari `package.json`
   - Mengganti `tsconfig.json` dengan `jsconfig.json`
   - Mengupdate `next.config.js` (dari `next.config.mjs`)
   - Menyesuaikan `.gitignore`
4. Mengkonversi semua komponen UI
   - Komponen di `components/ui/` (button, card, toast, dll)
   - Komponen khusus aplikasi (chart, notification-bell, header, dll)
5. Mengkonversi file halaman dan layout
6. Memastikan semua komponen React berfungsi dengan benar dengan JavaScript

## Cara Menjalankan Aplikasi

1. Pastikan Node.js dan npm sudah terinstall
2. Jalankan file `start-app.bat` atau gunakan perintah berikut:
   ```
   npm install
   npm run dev
   ```
3. Buka browser dan kunjungi `http://localhost:3000`

## Struktur Folder

Struktur folder aplikasi tetap dipertahankan seperti aslinya, hanya dengan perubahan ekstensi file:

- `app/` - Folder utama aplikasi Next.js
- `components/` - Komponen React yang digunakan dalam aplikasi
- `hooks/` - Hook custom React
- `lib/` - Utilitas dan fungsi pembantu
- `public/` - Aset statis
- `styles/` - CSS global

## Fitur yang Dipertahankan

- Autentikasi dan manajemen pengguna
- Dashboard untuk dua peran (Fasilitator, Siswa)
- Pelacakan emosi secara real-time
- Manajemen kelas dan sesi pembelajaran
- Forum diskusi komunitas
- UI responsif dan tema gelap/terang

Untuk pertanyaan atau masalah, silakan hubungi tim pengembang.
