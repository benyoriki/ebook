# BukuNusa Digital (prototipe tahap 1)
Vanilla JS + localStorage + PWA. Semua file di root; jalankan dengan `python3 -m http.server` lalu buka localhost, atau unggah ke GitHub Pages (Settings → Pages → branch main / root).
**Akun demo** (bukan keamanan produksi): pembaca@demo.id, penulis@demo.id, admin@demo.id — password `demo123`.
**Sudah ada:** beranda, katalog (filter/urut/cari), detail, reader (font, tema, progres), bab premium terkunci, checkout simulasi, akses tersimpan, akun, koleksi, backup/reset, dark mode, PWA.
**Belum ada:** dashboard penulis/admin, pengajuan penulis, moderasi, ulasan, ekspor CSV, ikon PNG, rules Firebase. Layer data ada di objek `DB` (app.js) untuk migrasi Firebase.
**Batasan:** localStorage per browser, tidak aman; pembayaran hanya simulasi. GitHub Pages tidak punya backend. Belum diuji di browser.
