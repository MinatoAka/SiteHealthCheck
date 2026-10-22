# SiteHealthCheck

<p align="center">
  <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License: GPL v3" />
  <img src="https://img.shields.io/badge/JavaScript-100%25-yellow.svg" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Google%20Apps%20Script-Automation-green.svg" alt="Google Apps Script" />
  <img src="https://img.shields.io/badge/Status-Website%20Monitoring-success.svg" alt="Website Monitoring" />
</p>

SiteHealthCheck adalah proyek open source berbasis Google Apps Script yang membantu memantau kesehatan website secara otomatis. Proyek ini memeriksa uptime situs utama, mengecek URL dari sitemap, dan menyimpan hasil pemantauan ke spreadsheet Google untuk analisis dan pelacakan lebih lanjut.

## Fitur

- Monitoring uptime situs utama
- Pemeriksaan URL dari sitemap
- Validasi status HTTP dan error
- Penyimpanan hasil ke sheet Google Spreadsheet
- Trigger otomatis berbasis jadwal
- Struktur ringan dan mudah dikustomisasi

## Struktur Proyek

```text
SiteHealthCheck/
├── Config.gs
├── Main.gs
├── SitemapUtils.gs
├── SpreadsheetUtils.gs
├── TriggerUtils.gs
├── README.md
├── LICENSE
```

## Persyaratan

- Akun Google
- Project Google Apps Script
- Spreadsheet Google
- URL situs yang ingin dipantau

## Setup

### 1. Buka project di Google Apps Script
Impor semua file `.gs` ke project Apps Script Anda.

### 2. Set Script Properties
Tambahkan properti berikut di Google Apps Script:

```text
SPREADSHEETS_ID = ID_SPREADSHEET_ANDA
URL_UTAMA = https://example.com
```

### 3. Jalankan validasi

```javascript
validateConfig();
```

### 4. Pasang trigger otomatis

```javascript
pasangTriggerOtomatis();
```

## Cara Kerja

1. Script membaca konfigurasi dari `Script Properties`.
2. Script membuka spreadsheet target.
3. Script mengirim request ke `URL_UTAMA` dan mengecek status HTTP.
4. Script mengambil `sitemap.xml` dan memvalidasi URL yang ada di dalamnya.
5. Hasil pengecekan disimpan ke sheet `Uptime` dan `Link`.

## Output

- `Uptime`: status utama situs dan durasi respon
- `Link`: hasil pengecekan URL dari sitemap

## Dukungan

Jika Anda ingin mendukung pengembangan proyek ini, silakan dukung melalui:

- Saweria: https://saweria.co/AKaAturDompet

## Kontribusi

Kontribusi sangat terbuka. Anda dapat melakukan fork, membuat branch baru, dan mengirim pull request.

## Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).

## Repository

https://github.com/MinatoAka/SiteHealthCheck
