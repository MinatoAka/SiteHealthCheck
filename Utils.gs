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
  var columnCount = rows[0].length;
  sheet.getRange(startRow, 1, rows.length, columnCount).setValues(rows);
}

function safeToString(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function normalizeSitemapUrls(xmlText) {
  if (!xmlText) {
    return [];
  }

  var matches = xmlText.match(/<loc>(.*?)<\/loc>/gi) || [];
  return matches
    .map(function (item) {
      return item.replace(/<\/?loc>/gi, "").trim();
    })
    .filter(function (item) {
      return item && item.indexOf("http") === 0;
    })
    .slice(0, MAX_SITEMAP_LINKS);
}

// DELETE LOG - tiap 7 hari
function autoDeleteLog() {
  var ss = getSiteSpreadsheet();
  var sheetNames = [UPTIME_SHEET_NAME, LINK_SHEET_NAME];
  var sekarang = new Date();
  var millisPerDay = 1000 * 60 * 60 * 24;

  sheetNames.forEach(function (namaSheet) {
    var sheet = ss.getSheetByName(namaSheet);
    if (!sheet || sheet.getLastRow() <= 1) {
      return;
    }

    var data = sheet.getDataRange().getValues();
    var header = data[0];
    var keepRows = [header];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawDate = row[0];

      if (!rawDate) {
        keepRows.push(row);
        continue;
      }

      var tglLog = new Date(rawDate);
      if (isNaN(tglLog.getTime())) {
        keepRows.push(row);
        continue;
      }

      var selisihHari = (sekarang - tglLog) / millisPerDay;
      if (selisihHari <= LOG_RETENTION_DAYS) {
        keepRows.push(row);
      }
    }

    if (keepRows.length !== data.length) {
      sheet.clearContents();
      if (keepRows.length > 0) {
        sheet.getRange(1, 1, keepRows.length, keepRows[0].length).setValues(keepRows);
      }
    }
  });
}

// JALANKAN INI 1x AJA BUAT PASANG JADWAL
function pasangTriggerOtomatis() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    ScriptApp.deleteTrigger(trigger);
  });

  ScriptApp.newTrigger("cekUptimeKeSheet").timeBased().everyHours(6).create();
  ScriptApp.newTrigger("cekLinkMatiKeSheet").timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger("autoDeleteLog").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
}
