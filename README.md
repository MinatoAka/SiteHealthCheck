# SiteHealthCheck

<p align="center">
  <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License: GPL v3" />
  <img src="https://img.shields.io/badge/JavaScript-100%25-yellow.svg" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Google%20Apps%20Script-Automation-green.svg" alt="Google Apps Script" />
  <img src="https://img.shields.io/badge/Status-Website%20Monitoring-success.svg" alt="Status: Website Monitoring" />
</p>

SiteHealthCheck adalah proyek open source berbasis Google Apps Script yang dirancang untuk memantau kesehatan website secara otomatis dan berkelanjutan. Dengan pendekatan yang sederhana namun efektif, proyek ini membantu Anda melacak uptime, mengecek sitemap, mengidentifikasi URL yang rusak, dan menyimpan hasil pemantauan ke spreadsheet Google secara terstruktur.

## Mengapa proyek ini dibuat?

Banyak website, terutama yang dikelola secara mandiri atau oleh tim kecil, sering kali tidak memiliki sistem monitoring yang terintegrasi. SiteHealthCheck hadir sebagai solusi ringan dan murah untuk membantu:

- memantau status uptime situs utama;
- mengecek URL dari sitemap secara otomatis;
- mendeteksi status HTTP dan error yang terjadi;
- menyimpan hasil monitoring ke spreadsheet;
- menjalankan pengecekan secara berkala tanpa intervensi manual.

## Fitur utama

- Monitoring uptime situs utama secara otomatis
- Pemeriksaan URL dari sitemap setiap hari
- Pencatatan hasil ke sheet `Uptime` dan `Link`
- Validasi konfigurasi dasar untuk mencegah error runtime
- Pembersihan log lama agar spreadsheet tetap rapi dan ringan
- Integrasi dengan Google Apps Script dan Spreadsheet
- Trigger otomatis berbasis jadwal

## Diagram alur kerja

```text
[Script Properties]
        |
        v
[Config.gs]
        |
        v
[Main.gs]
  |-------------------|
  |                   |
  v                   v
Cek uptime         Cek sitemap & URL
  |                   |
  v                   v
Spreadsheet (Uptime)  Spreadsheet (Link)
```

## Struktur proyek

```text
SiteHealthCheck/
├── Config.gs          # Konfigurasi global, validasi URL, dan parameter monitoring
├── Main.gs            # Fungsi utama pengecekan uptime dan link mati
├── SitemapUtils.gs    # Normalisasi dan ekstraksi URL dari sitemap.xml
├── SpreadsheetUtils.gs # Helper untuk membuka, membuat, dan menulis data ke spreadsheet
├── TriggerUtils.gs    # Registrasi trigger otomatis
├── README.md         # Dokumentasi proyek
├── LICENSE           # Lisensi proyek
└── .clasp.json       # Konfigurasi project Apps Script (jika tersedia)
```

## Persyaratan

Sebelum menggunakan proyek ini, pastikan Anda sudah memiliki:

- Akun Google
- Project Google Apps Script
- Spreadsheet Google yang akan dipakai sebagai media penyimpanan data
- Akses ke situs yang ingin dipantau
- Koneksi internet aktif

## Instalasi dan setup

### 1. Clone atau salin repositori

```bash
git clone https://github.com/MinatoAka/SiteHealthCheck.git
cd SiteHealthCheck
```

### 2. Buka project di Google Apps Script

- Buka Google Apps Script
- Impor file-file `.gs` ke dalam project Anda
- Pastikan nama project Anda sudah sesuai

### 3. Set variabel Script Properties

Masuk ke menu:

- Project Settings
- Script Properties

Tambahkan properti berikut:

```text
SPREADSHEETS_ID = ID_SPREADSHEET_ANDA
URL_UTAMA = https://example.com
```

Contoh:

```javascript
const URL_UTAMA = "https://www.aturdompet.my.id";
const MAX_SITEMAP_LINKS = 30;
const URL_BATCH_SIZE = 10;
const LOG_RETENTION_DAYS = 7;
```

### 4. Validasi konfigurasi

Jalankan fungsi berikut untuk memastikan konfigurasi sudah benar:

```javascript
validateConfig();
```

### 5. Pasang trigger otomatis

Daftarkan trigger agar monitoring berjalan otomatis:

```javascript
pasangTriggerOtomatis();
```

Trigger yang dipasang biasanya mencakup:

- pengecekan uptime setiap 6 jam;
- pengecekan sitemap dan URL setiap 24 jam;
- pembersihan log secara berkala.

## Cara kerja

1. Script membaca konfigurasi dari `Script Properties`.
2. Script membuka spreadsheet target menggunakan `SpreadsheetApp.openById()`.
3. Script melakukan request ke `URL_UTAMA` menggunakan `UrlFetchApp.fetch()`.
4. Hasil status HTTP, durasi respon, dan keterangan kondisi situs disimpan ke sheet `Uptime`.
5. Script mengambil `sitemap.xml` dari situs target dan mengekstrak URL yang valid.
6. Setiap URL diperiksa dan hasilnya dicatat ke sheet `Link`.
7. Log lama dihapus secara otomatis berdasarkan parameter `LOG_RETENTION_DAYS`.
8. Proses berjalan secara otomatis sesuai jadwal trigger.

## Output yang dihasilkan

### Sheet `Uptime`

| Waktu | URL | Status Code | Keterangan |
| --- | --- | ---: | --- |
| 2026-10-22 08:00:00 | https://example.com | 200 | AMAN - 420ms |

### Sheet `Link`

| Waktu Cek | URL Artikel | Status | Catatan |
| --- | --- | ---: | --- |
| 2026-10-22 07:00:00 | https://example.com/article/example | 200 | OK |

## Validasi yang diterapkan

Proyek ini sudah menambahkan validasi untuk mengurangi risiko error di runtime, misalnya:

- validasi `SPREADSHEETS_ID`
- validasi `URL_UTAMA`
- validasi format HTTP/HTTPS
- validasi hostname
- validasi status code HTTP
- validasi struktur sitemap agar tidak kosong atau tidak mengandung tag `<loc>`
- validasi URL hasil parsing sitemap

## Penggunaan

Setelah konfigurasi selesai, Anda hanya perlu:

- memastikan spreadsheet tujuan sudah tersedia;
- memastikan script property sudah terisi dengan benar;
- menjalankan fungsi pemantauan atau menunggu trigger otomatis aktif.

## Kontribusi

Kontribusi sangat terbuka untuk pengembangan proyek ini. Jika Anda ingin berkontribusi, silakan:

1. Fork repositori ini.
2. Buat branch fitur baru.
3. Lakukan perubahan yang relevan.
4. Kirimkan pull request dengan deskripsi yang jelas.

Beberapa area yang dapat dikembangkan antara lain:

- dashboard monitoring yang lebih interaktif;
- notifikasi email atau Slack;
- integrasi dengan Google Chat / Telegram;
- pengolahan hasil monitoring yang lebih kaya dan terstruktur.

## Roadmap

- meningkatkan kualitas validasi input;
- menambahkan fitur notifikasi otomatis;
- menyempurnakan output spreadsheet dan laporan;
- mendukung monitoring multi-domain;
- memperluas evaluasi performa dan status website.

## Troubleshooting

### Spreadsheet ID tidak valid

Pastikan nilai `SPREADSHEETS_ID` benar dan tidak mengandung spasi atau karakter aneh.

### URL utama tidak bisa diakses

Periksa:

- URL sudah benar;
- domain aktif;
- situs tidak sedang down;
- protokol yang digunakan `http` atau `https`.

### Sitemap tidak valid

Beberapa situs dapat menggunakan format sitemap yang berbeda atau sama sekali tidak menyertakan tag `<loc>`. Script akan menolak proses tersebut dan mencatat error.

### Trigger tidak berjalan

Pastikan trigger sudah dibuat dengan benar dan project Apps Script memiliki izin yang cukup untuk menjalankan fungsi yang dijadwalkan.

## Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).

## Kontak dan dukungan

- Repository: https://github.com/MinatoAka/SiteHealthCheck
- Issues: https://github.com/MinatoAka/SiteHealthCheck/issues
- Dukungan: https://saweria.co/AKaAturDompet

## Status proyek

Proyek ini aktif dikembangkan untuk mendukung kebutuhan monitoring website yang sederhana, andal, dan mudah dijalankan di ekosistem Google Workspace.

---

Jika Anda ingin, saya juga bisa bantu membuat versi README yang lebih singkat untuk GitHub profile, atau versi yang lebih teknis untuk komunitas open source.
