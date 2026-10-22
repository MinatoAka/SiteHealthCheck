# SiteHealthCheck

SiteHealthCheck adalah proyek otomatisasi berbasis Google Apps Script untuk memantau kesehatan situs web secara berkala. Script ini memeriksa uptime halaman utama dan validitas URL yang terdaftar di sitemap, lalu menyimpan hasilnya ke dalamGoogle Spreadsheet untuk kebutuhan monitoring dan audit.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow.svg)](https://developer.mozilla.org/id/docs/Web/JavaScript)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Automation-green.svg)](https://developers.google.com/apps-script)
[![Status](https://img.shields.io/badge/Status-Website%20Monitoring-success.svg)](https://github.com/MinatoAka/SiteHealthCheck)
[![Support Me](https://img.shields.io/badge/Support%20Me-Saweria-orange?logo=paypal&logoColor=white)](https://saweria.co/AKaAturDompet)

## Ringkasan

Proyek ini dirancang untuk membantu Anda memantau website secara otomatis dengan cara yang sederhana dan efisien. Fungsinya mencakup:

- pengecekan uptime situs utama
- pengecekan link rusak dari sitemap
- pencatatan hasil monitoring ke spreadsheet
- pembersihan log secara otomatis agar file tetap ringkas
- pengaturan trigger otomatis berbasis jadwal

## Fitur Utama

- Cek uptime situs utama setiap 6 jam
- Cek URL dari sitemap setiap 24 jam
- Simpan hasil monitoring ke sheet `Uptime` dan `Link`
- Hapus log lama secara otomatis agar sheet tetap ringan
- Konfigurasi via Google Apps Script Script Properties
- Validasi konfigurasi dasar untuk mencegah error runtime
- Optimasi performa dengan batch processing dan pembatasan jumlah URL

## Arsitektur Proyek

- `Config.gs` — konfigurasi global, validasi URL, dan validasi spreadsheet ID
- `Main.gs` — fungsi utama untuk pengecekan uptime dan link mati
- `Utils.gs` — helper, normalisasi sitemap, batch fetch, cleanup log, dan trigger otomatis

## Cara Kerja

1. Script membaca `SPREADSHEETS_ID` dan `URL_UTAMA` dari Script Properties.
2. Script membuka spreadsheet target menggunakan `SpreadsheetApp.openById()`.
3. Script mengecek URL utama dengan `UrlFetchApp.fetch()` dan menyimpan status HTTP serta durasi respon.
4. Script mengambil `sitemap.xml` dari website target, memvalidasi formatnya, lalu mengekstrak URL yang valid.
5. Script memeriksa tiap URL dari sitemap dan menyimpan hasilnya ke sheet `Link`.
6. Script secara otomatis membuang log lama berdasarkan `LOG_RETENTION_DAYS`.
7. Trigger dijalankan sesuai jadwal yang ditetapkan agar proses monitoring berjalan otomatis.

## Persyaratan

- Akun Google
- Google Spreadsheet yang akan dipakai sebagai database monitoring
- Google Apps Script project
- Akses ke situs yang akan dipantau
- Koneksi internet aktif saat script berjalan

## Setup

### 1. Siapkan spreadsheet target

Buat atau siapkan spreadsheet baru dan salin ID spreadsheet Anda.

### 2. Buka project Google Apps Script

Buka proyek ini di Google Apps Script, lalu buka menu:

- Project Settings
- Script Properties

Tambahkan properti berikut:

```text
SPREADSHEETS_ID = ID_SPREADSHEET_ANDA
URL_UTAMA = https://www.aturdompet.my.id
```

### 3. Sesuaikan konfigurasi

Jika perlu, edit file `Config.gs` untuk menyesuaikan URL utama dan parameter monitoring:

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

Fungsi tersebut akan membuat trigger untuk:

- cek uptime setiap 6 jam
- cek sitemap/link setiap 24 jam pada pukul 07.00
- auto cleanup log setiap minggu pada hari Senin pukul 08.00

## Validasi yang Sudah Ditambahkan

Script ini telah dilengkapi dengan beberapa validasi untuk mengurangi error runtime:

- validasi `SPREADSHEETS_ID`
- validasi `URL_UTAMA`
- validasi protokol HTTP/HTTPS
- validasi hostname
- validasi hasil fetch status code
- validasi sitemap agar tidak kosong atau tidak memiliki tag `<loc>`
- validasi URL yang diambil dari sitemap untuk memastikan formatnya benar

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

Versi terbaru sudah mengurangi beberapa bottleneck, antara lain:

- mengurangi pembukaan spreadsheet berulang kali
- menyimpan data dalam batch agar lebih efisien
- membatasi jumlah URL dari sitemap agar tidak terlalu berat
- menggunakan `muteHttpExceptions` untuk menangani error HTTP tanpa menghentikan proses
- membersihkan log secara berkala agar sheet tetap ringan

## Troubleshooting

### 1. Spreadsheet ID tidak valid

Pastikan nilai `SPREADSHEETS_ID` benar dan tidak mengandung spasi atau karakter yang salah.

### 2. URL utama tidak bisa diakses

Periksa apakah:

- URL sudah benar
- domain aktif
- situs tidak sedang down
- protokol yang dipakai adalah `http` atau `https`

### 3. Sitemap tidak valid

Beberapa situs mungkin memakai struktur sitemap yang berbeda atau tidak menampilkan tag `<loc>`. Dalam kasus ini, script akan mencatat error dan menolak pemrosesan URL.

### 4. Trigger tidak berjalan

Cek apakah trigger sudah terpasang dan apakah project Google Apps Script memiliki izin untuk menjalankan fungsi berjadwal.

## Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).

## Kontak

Untuk pertanyaan, laporan, atau dukungan, silakan buka [halaman issue GitHub](https://github.com/MinatoAka/SiteHealthCheck/issues) atau dukung pengembangan proyek melalui [Saweria](https://saweria.co/AKaAturDompet).

## Repository

https://github.com/MinatoAka/SiteHealthCheck
