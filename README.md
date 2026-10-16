# BukuNusa Digital (redesign tahap 2)
Vanilla JS + localStorage + PWA, semua file di root. Lokal: `python3 -m http.server`. GitHub Pages: ganti semua file di repo dengan isi ZIP (termasuk `panel.js` baru), commit, tunggu deploy, lalu hard-refresh (service worker sudah naik ke `bn-v2`).
Akun demo (bukan keamanan produksi): pembaca@demo.id, penulis@demo.id, admin@demo.id — password `demo123`.
Data lama pengguna tidak direset; key localStorage tidak berubah. Field baru (`owner`, `ch`, `cover`) bersifat opsional.
**Batasan:** localStorage per browser dan tidak aman; pembayaran hanya simulasi; belum ada versi konten buku terjual, ulasan, wishlist terpisah, pengelolaan kategori. Belum diuji di browser.

## Pembayaran QRIS (manual)
Pilih QRIS → scan `qris.webp` → "Saya Sudah Bayar" → transaksi berstatus *Menunggu pembayaran* (akses belum terbuka) → kirim bukti ke WhatsApp admin (+6287743600616). Admin mengonfirmasi di `#/admin/transaksi`. **Karena localStorage per-browser, konfirmasi hanya bekerja jika admin memakai browser yang sama; untuk produksi wajib backend (Firebase/Cloud Functions atau payment gateway dengan webhook).**
Tombol "Masuk akun demo" harus dihapus sebelum rilis publik. Pengembang: benyoriki.com.
