//============================================================
// CEK UPTIME - tiap 6 jam
//============================================================

function cekUptimeKeSheet() {
  var ss = getSiteSpreadsheet();
  var sheet = getOrCreateSheet(ss, UPTIME_SHEET_NAME, ["Waktu", "URL", "Status Code", "Keterangan"]);
  var waktu = getWibTimestamp(); 
  var row = [waktu, URL_UTAMA, "", ""];

  try {
    var start = new Date();
    var res = UrlFetchApp.fetch(URL_UTAMA, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    var kode = safeGetResponseCode(res);
    var durasi = Math.max(new Date() - start, 0);

    row[2] = kode !== null ? kode : "ERROR";
    if (!isValidHttpStatusCode(kode)) {
      row[3] = "INVALID_STATUS";
    } else if (kode === 200) {
      row[3] = "AMAN - " + durasi + "ms";
    } else {
      row[3] = "DOWN - " + describeHttpStatus(kode);
    }
  } catch (e) {
    row[2] = "ERROR";
    row[3] = "FETCH_ERROR: " + safeToString(e);
  }

  appendRowsToSheet(sheet, [row]);
}

//============================================================
// CEK LINK MATI - tiap 24 jam
//============================================================

function cekLinkMatiKeSheet() {
  var ss = getSiteSpreadsheet();
  var sheet = getOrCreateSheet(ss, LINK_SHEET_NAME, ["Waktu Cek", "URL Artikel", "Status", "Catatan"]);
  var sitemap = URL_UTAMA.replace(/\/+$/, "") + "/sitemap.xml";
  var waktu = getWibTimestamp();

  try {
    validateUrl(sitemap, "Sitemap URL");
    var sitemapResponse = UrlFetchApp.fetch(sitemap, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    var sitemapStatus = safeGetResponseCode(sitemapResponse);
    if (!isValidHttpStatusCode(sitemapStatus)) {
      sheet.appendRow([waktu, sitemap, "ERROR", "SITEMAP_STATUS_INVALID"]);
      return;
    }

    if (sitemapStatus !== 200) {
      sheet.appendRow([waktu, sitemap, sitemapStatus, "SITEMAP_" + describeHttpStatus(sitemapStatus)]);
      return;
    }

    var sitemapText = sitemapResponse.getContentText();
    if (!sitemapText || !/<loc>/i.test(sitemapText)) {
      sheet.appendRow([waktu, sitemap, "ERROR", "Sitemap tidak valid atau tidak ada tag <loc>"]);
      return;
    }

    var urls = normalizeSitemapUrls(sitemapText);
    if (!urls.length) {
      sheet.appendRow([waktu, sitemap, "ERROR", "Sitemap valid tapi tidak ada URL HTTP yang bisa diproses"]);
      return;
    }

    var results = fetchUrlBatch(urls);
    var rows = [];

    results.forEach(function (item) {
      var link = item.url;
      var response = item.response;
      var statusCode = safeGetResponseCode(response);
      var catatan = "FETCH_ERROR";

      try {
        if (response && isValidHttpStatusCode(statusCode)) {
          catatan = resolveUrlCatatan(statusCode);
        } else if (response) {
          catatan = "INVALID_STATUS";
        }
      } catch (e) {
        catatan = safeToString(e);
      }

      rows.push([waktu, link, statusCode !== null ? statusCode : "ERROR", catatan]);
    });

    if (rows.length) {
      appendRowsToSheet(sheet, rows);
    }
  } catch (e) {
    sheet.appendRow([waktu, sitemap, "ERROR", safeToString(e)]);
  }
}
