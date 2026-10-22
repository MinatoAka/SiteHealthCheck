# SiteHealthCheck

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow.svg)](https://developer.mozilla.org/id/docs/Web/JavaScript)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Automation-green.svg)](https://developers.google.com/apps-script)
[![Status](https://img.shields.io/badge/Status-Website%20Monitoring-success.svg)](https://github.com/MinatoAka/SiteHealthCheck)

SiteHealthCheck adalah proyek otomatisasi berbasis Google Apps Script untuk memantau kesehatan situs web secara berkala. Script ini akan mengecek uptime utama website dan memvalidasi URL dari sitemap, lalu menyimpan hasilnya ke Google Sheets agar mudah dipantau dan dianalisis.

## Fitur

- Cek uptime situs utama setiap 6 jam
- Cek link rusak dari sitemap setiap 24 jam
- Simpan hasil monitoring ke sheet bernama `Uptime` dan `Link`
- Otomatis hapus log lama setiap minggu
- Mudah dikonfigurasi menggunakan Google Apps Script dan Properties

## Arsitektur Proyek

- `Config.gs` — konfigurasi global seperti ID spreadsheet dan URL utama
- `Main.gs` — fungsi utama monitoring uptime dan link mati
- `Utils.gs` — fungsi trigger otomatis dan cleanup log

## Cara Kerja

1. Script membuka Google Spreadsheet berdasarkan `SPREADSHEETS_ID`
2. Mengecek URL utama menggunakan `UrlFetchApp.fetch()`
3. Menyimpan status HTTP, waktu, dan keterangan ke sheet `Uptime`
4. Mengambil `sitemap.xml` dari website, lalu memeriksa setiap URL yang ada
5. Menyimpan hasil pengecekan ke sheet `Link`
6. Trigger otomatis dijalankan sesuai jadwal yang sudah diatur

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

Untuk pertanyaan atau dukungan, silakan buka halaman repository ini di GitHub:

https://github.com/MinatoAka/SiteHealthCheck
