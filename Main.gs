function getSiteSpreadsheet() {
  if (!SHEET_ID) {
    throw new Error("SPREADSHEETS_ID belum di-set di Script Properties.");
  }
  return SpreadsheetApp.openById(SHEET_ID);
}

function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function appendRowsToSheet(sheet, rows) {
  if (!rows || !rows.length) {
    return;
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
}

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
    var durasi = new Date() - start;
    row[2] = kode;
    row[3] = kode === 200 ? "AMAN - " + durasi + "ms" : "DOWN";
  } catch (e) {
    row[2] = "ERROR";
    row[3] = e && e.toString ? e.toString() : String(e);
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
    var matches = sitemapText.match(/<loc>(.*?)<\/loc>/gi) || [];
    var urls = matches
      .map(function(item) {
        return item.replace(/<\/?loc>/gi, "").trim();
      })
      .filter(Boolean)
      .slice(0, MAX_SITEMAP_LINKS);

    if (!urls.length) {
      sheet.appendRow([waktu, sitemap, "ERROR", "Sitemap tidak memiliki tag <loc>"]);
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
        rows.push([waktu, link, "ERROR", e && e.toString ? e.toString() : String(e)]);
      }
    }

    if (rows.length) {
      appendRowsToSheet(sheet, rows);
    }
  } catch (e) {
    sheet.appendRow([waktu, sitemap, "ERROR", e && e.toString ? e.toString() : String(e)]);
  }
}
