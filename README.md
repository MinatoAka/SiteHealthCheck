# SiteHealthCheck

SiteHealthCheck adalah proyek otomatisasi berbasis Google Apps Script yang dirancang untuk memantau kesehatan situs web secara berkala. Proyek ini membantu pengguna untuk memeriksa kondisi situs utama, mengevaluasi validitas URL yang terdapat dalam sitemap, serta mencatat hasil monitoring ke Google Spreadsheet secara otomatis.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow.svg)](https://developer.mozilla.org/id/docs/Web/JavaScript)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Automation-green.svg)](https://developers.google.com/apps-script)
[![Status](https://img.shields.io/badge/Status-Website%20Monitoring-success.svg)](https://github.com/MinatoAka/SiteHealthCheck)
[![Support Me](https://img.shields.io/badge/Support%20Me-Saweria-orange?logo=paypal&logoColor=white)](https://saweria.co/AKaAturDompet)

## Overview

Proyek ini dibuat untuk menyediakan solusi monitoring website yang sederhana, efisien, dan mudah diintegrasikan dengan ekosistem Google Workspace. Dengan SiteHealthCheck, pengguna dapat memantau:

- status uptime situs utama
- keberhasilan akses URL dari sitemap
- status HTTP dan error yang terjadi
- hasil monitoring yang tersimpan secara rapi di spreadsheet
- eksekusi otomatis berdasarkan jadwal tertentu

## Fitur Utama

- Pemantauan uptime situs utama setiap 6 jam
- Pemeriksaan URL dari sitemap setiap 24 jam
- Pencatatan hasil monitoring ke sheet `Uptime` dan `Link`
- Pembersihan log lama agar spreadsheet tetap ringkas
- Pengaturan konfigurasi melalui Script Properties
- Validasi input dasar untuk mencegah error runtime
- Optimasi performa dengan proses batch dan pembatasan jumlah URL yang diproses

## Struktur Proyek

Repository ini terdiri dari beberapa file utama dengan tugas yang jelas:

- `Config.gs` — konfigurasi global, validasi URL, serta validasi parameter penting seperti `SPREADSHEETS_ID`
- `Main.gs` — fungsi utama untuk pengecekan uptime dan pemeriksaan link mati
- `SitemapUtils.gs` — normalisasi dan ekstraksi URL dari file `sitemap.xml`
- `SpreadsheetUtils.gs` — helper untuk membuka, membuat, dan menulis data ke sheet spreadsheet
- `TriggerUtils.gs` — pendaftaran trigger otomatis berdasarkan jadwal
- `README.md` — dokumentasi proyek
- `LICENSE` — lisensi proyek

## Cara Kerja

1. Script membaca konfigurasi dari `Script Properties`, termasuk `SPREADSHEETS_ID` dan `URL_UTAMA`.
2. Script membuka spreadsheet target dengan `SpreadsheetApp.openById()`.
3. Script mengakses URL utama menggunakan `UrlFetchApp.fetch()`.
4. Script menyimpan status HTTP, durasi respon, dan keterangan kondisi situs.
5. Script mengambil isi `sitemap.xml` dari situs target, memvalidasi formatnya, lalu mengekstrak URL yang valid.
6. Script mengecek setiap URL dari sitemap dan menyimpan hasil akhirnya di sheet `Link`.
7. Log lama dibersihkan secara otomatis berdasarkan parameter `LOG_RETENTION_DAYS`.
8. Trigger otomatis dijalankan sesuai jadwal yang telah ditentukan.

## Persyaratan

Untuk menjalankan proyek ini, diperlukan:

- Akun Google
- Spreadsheet Google yang akan digunakan sebagai sumber data monitoring
- Project Google Apps Script
- Akses ke situs yang akan dipantau
- Koneksi internet aktif saat script berjalan

## Setup

### 1. Siapkan spreadsheet target

Buat spreadsheet baru atau gunakan spreadsheet yang sudah ada, lalu salin ID spreadsheet Anda.

### 2. Buka project Google Apps Script

Buka proyek ini di Google Apps Script, lalu masuk ke menu:

- Project Settings
- Script Properties

Tambahkan properti berikut:

```text
SPREADSHEETS_ID = ID_SPREADSHEET_ANDA
URL_UTAMA = https://www.aturdompet.my.id
```

### 3. Sesuaikan konfigurasi

Jika diperlukan, edit file `Config.gs` untuk menyesuaikan nilai URL utama dan parameter monitoring:

```javascript
const URL_UTAMA = "https://www.aturdompet.my.id";
const MAX_SITEMAP_LINKS = 30;
const URL_BATCH_SIZE = 10;
const LOG_RETENTION_DAYS = 7;
```

### 4. Pasang trigger otomatis

Jalankan fungsi berikut satu kali untuk mendaftarkan jadwal otomatis:

```javascript
pasangTriggerOtomatis()
```

Fungsi ini akan membuat trigger untuk:

- pengecekan uptime setiap 6 jam
- pengecekan sitemap dan URL setiap 24 jam pada pukul 07.00
- pembersihan log otomatis setiap minggu pada hari Senin pukul 08.00

## Validasi yang Ditambahkan

Proyek ini telah dilengkapi dengan beberapa mekanisme validasi untuk mengurangi risiko error runtime, di antaranya:

- validasi `SPREADSHEETS_ID`
- validasi `URL_UTAMA`
- validasi format protokol HTTP/HTTPS
- validasi hostname
- validasi status code hasil fetch
- validasi struktur sitemap agar tidak kosong atau tidak memiliki tag `<loc>`
- validasi URL yang diambil dari sitemap agar sesuai format yang benar

## Contoh Output

### Sheet `Uptime`

| Waktu | URL | Status Code | Keterangan |
|---|---|---:|---|
| 2026-10-22 08:00:00 | https://www.aturdompet.my.id | 200 | AMAN - 420ms |

### Sheet `Link`

| Waktu Cek | URL Artikel | Status | Catatan |
|---|---|---:|---|
| 2026-10-22 07:00:00 | https://www.aturdompet.my.id/artikel/abc | 200 | OK |

## Catatan Performa

Versi terbaru dirancang untuk mengurangi bottleneck dan meningkatkan efisiensi, termasuk:

- mengurangi pembukaan spreadsheet yang berulang
- mengumpulkan data dalam batch untuk proses penulisan yang lebih cepat
- membatasi jumlah URL yang diproses dari sitemap agar beban tetap terkendali
- menggunakan `muteHttpExceptions` agar error HTTP dapat ditangani tanpa menghentikan seluruh proses
- membersihkan log secara berkala agar sheet tetap ringan dan mudah dikelola

## Troubleshooting

### 1. Spreadsheet ID tidak valid

Pastikan nilai `SPREADSHEETS_ID` benar dan tidak mengandung spasi maupun karakter yang tidak valid.

### 2. URL utama tidak bisa diakses

Periksa beberapa kemungkinan berikut:

- URL sudah benar
- domain sedang aktif
- situs tidak dalam kondisi down
- protokol yang digunakan adalah `http` atau `https`

### 3. Sitemap tidak valid

Beberapa situs mungkin menggunakan struktur sitemap yang berbeda atau tidak menampilkan tag `<loc>`. Dalam kondisi seperti ini, script akan mencatat error dan menolak proses eksekusi URL.

### 4. Trigger tidak berjalan

Periksa apakah trigger sudah terpasang dengan benar serta apakah project Google Apps Script memiliki izin untuk menjalankan fungsi yang dijadwalkan.

## Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).

## Kontak

Untuk pertanyaan, laporan, atau dukungan, silakan kunjungi halaman [Issue GitHub](https://github.com/MinatoAka/SiteHealthCheck/issues) atau dukung pengembangan proyek melalui [Saweria](https://saweria.co/AKaAturDompet).

## Repository

https://github.com/MinatoAka/SiteHealthCheck
