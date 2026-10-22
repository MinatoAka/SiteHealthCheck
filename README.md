# SiteHealthCheck

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow.svg)](https://developer.mozilla.org/id/docs/Web/JavaScript)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Automation-green.svg)](https://developers.google.com/apps-script)
[![Status](https://img.shields.io/badge/Status-Website%20Monitoring-success.svg)](https://github.com/MinatoAka/SiteHealthCheck)
[![Support Me](https://img.shields.io/badge/Support%20Me-Saweria-orange?logo=paypal&logoColor=white)](https://saweria.co/AKaAturDompet)

SiteHealthCheck adalah proyek otomatisasi berbasis Google Apps Script untuk memantau kesehatan situs web secara berkala. Script ini akan mengecek uptime utama website, memvalidasi URL dari sitemap, dan menyimpan hasilnya ke Google Sheets secara otomatis.

## Fitur

- Cek uptime situs utama setiap 6 jam
- Cek link rusak dari sitemap setiap 24 jam
- Simpan hasil monitoring ke sheet bernama `Uptime` dan `Link`
- Otomatis hapus log lama setiap minggu
- Mudah dikonfigurasi menggunakan Google Apps Script dan Script Properties
- Optimasi performa: mengurangi operasi spreadsheet yang berulang, validasi sitemap, dan batch write untuk efisiensi runtime

## Arsitektur Proyek

- `Config.gs` — konfigurasi global seperti ID spreadsheet, URL utama, dan parameter pengaturan log
- `Main.gs` — fungsi utama monitoring uptime dan link mati
- `Utils.gs` — helper, auto cleanup log, dan setup trigger otomatis

## Cara Kerja

1. Script membuka Google Spreadsheet berdasarkan `SPREADSHEETS_ID`
2. Mengecek URL utama menggunakan `UrlFetchApp.fetch()`
3. Menyimpan status HTTP, waktu, dan keterangan ke sheet `Uptime`
4. Mengambil `sitemap.xml` dari website, lalu memeriksa setiap URL yang ada
5. Menyimpan hasil pengecekan ke sheet `Link`
6. Trigger otomatis dijalankan sesuai jadwal yang sudah diatur
7. Data lama otomatis dibersihkan agar sheet tetap ringkas dan cepat

## Persyaratan

- Akun Google
- Google Spreadsheet
- Google Apps Script
- Akses ke situs yang akan dipantau

## Setup

1. Buka proyek ini di Google Apps Script.
2. Buat atau siapkan spreadsheet target.
3. Salin ID spreadsheet Anda.
4. Pada Script Properties, tambahkan properti berikut:

```text
SPREADSHEETS_ID = ID_SPREADSHEET_ANDA
```

5. Edit file `Config.gs` untuk menyesuaikan URL utama:

```javascript
const URL_UTAMA = "https://www.aturdompet.my.id";
```

6. Jalankan fungsi berikut untuk mengatur trigger otomatis:

```javascript
pasangTriggerOtomatis()
```

## Catatan Optimasi

Versi terbaru sudah termasuk beberapa perbaikan performa, di antaranya:

- Mengurangi pembukaan spreadsheet berulang kali
- Menggunakan helper agar sheet dibuat sekali dan data ditulis dalam batch
- Validasi sitemap sebelum memproses URL-nya
- Mengurangi penggunaan `sleep` yang memperlambat eksekusi
- Menjaga sheet tetap ringkas dengan auto cleanup log

## Contoh Output

### Sheet `Uptime`

| Waktu | URL | Status Code | Keterangan |
|---|---|---:|---|
| 2026-10-22 08:00:00 | https://www.aturdompet.my.id | 200 | AMAN - 420ms |

### Sheet `Link`

| Waktu Cek | URL Artikel | Status | Catatan |
|---|---|---:|---|
| 2026-10-22 07:00:00 | https://www.aturdompet.my.id/artikel/abc | 200 | OK |

## Catatan

- Script ini dibuat untuk kebutuhan monitoring website sederhana dan otomatis.
- Untuk kebutuhan produksi yang lebih kompleks, disarankan menambahkan notifikasi email, Slack, atau Telegram ketika suatu halaman down.

## Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).

## Kontak

Untuk pertanyaan atau dukungan, silakan buka [halaman issue GitHub](https://github.com/MinatoAka/SiteHealthCheck/issues) atau dukung proyek melalui [Saweria](https://saweria.co/AKaAturDompet).

Repository GitHub:

https://github.com/MinatoAka/SiteHealthCheck
