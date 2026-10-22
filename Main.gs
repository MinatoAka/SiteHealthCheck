// CEK UPTIME - tiap 6 jam
function cekUptimeKeSheet() {
  var ss = getSiteSpreadsheet();
  var sheet = getOrCreateSheet(ss, UPTIME_SHEET_NAME, ["Waktu", "URL", "Status Code", "Keterangan"]);
  var waktu = new Date();
  var row = [waktu, URL_UTAMA, "", ""];

  try {
    var start = new Date();
    var res = UrlFetchApp.fetch(URL_UTAMA, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    var kode = res.getResponseCode();
    var durasi = Math.max(new Date() - start, 0);

    row[2] = kode;
    row[3] = kode === 200 ? "AMAN - " + durasi + "ms" : "DOWN";
  } catch (e) {
    row[2] = "ERROR";
    row[3] = safeToString(e);
  }

  appendRowsToSheet(sheet, [row]);
}

// CEK LINK MATI - tiap 24 jam
function cekLinkMatiKeSheet() {
  var ss = getSiteSpreadsheet();
  var sheet = getOrCreateSheet(ss, LINK_SHEET_NAME, ["Waktu Cek", "URL Artikel", "Status", "Catatan"]);
  var sitemap = URL_UTAMA + "/sitemap.xml";
  var waktu = new Date();

  try {
    var sitemapResponse = UrlFetchApp.fetch(sitemap, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    var sitemapText = sitemapResponse.getContentText();
    var urls = normalizeSitemapUrls(sitemapText);

    if (!urls.length) {
      sheet.appendRow([waktu, sitemap, "ERROR", "Sitemap tidak valid atau tidak ada tag <loc>"]);
      return;
    }

    var rows = [];

    for (var i = 0; i < urls.length; i++) {
      var link = urls[i];

      try {
        var response = UrlFetchApp.fetch(link, {
          muteHttpExceptions: true,
          followRedirects: true
        });

        var statusCode = response.getResponseCode();
        rows.push([waktu, link, statusCode, statusCode === 200 ? "OK" : "MATI"]);
      } catch (e) {
        rows.push([waktu, link, "ERROR", safeToString(e)]);
      }
    }

    if (rows.length) {
      appendRowsToSheet(sheet, rows);
    }
  } catch (e) {
    sheet.appendRow([waktu, sitemap, "ERROR", safeToString(e)]);
  }
}
