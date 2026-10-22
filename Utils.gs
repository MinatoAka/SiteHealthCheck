function getSiteSpreadsheet() {
  validateConfig();
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

function safeGetResponseCode(response) {
  if (!response) {
    return null;
  }

  try {
    return response.getResponseCode();
  } catch (e) {
    return null;
  }
}

function normalizeSitemapUrls(xmlText) {
  if (!xmlText) {
    return [];
  }

  if (!/<loc>/i.test(xmlText)) {
    return [];
  }

  var matches = xmlText.match(/<loc[^>]*>([\s\S]*?)<\/loc>/gi) || [];
  var seen = {};

  return matches
    .map(function (item) {
      return item.replace(/<\/?loc[^>]*>/gi, "").trim();
    })
    .filter(function (item) {
      return !!item && item.indexOf("http") === 0 && !seen[item] && (seen[item] = true);
    })
    .slice(0, MAX_SITEMAP_LINKS);
}

function resolveUrlCatatan(statusCode) {
  if (!isValidHttpStatusCode(statusCode)) {
    return "INVALID_STATUS";
  }
  if (statusCode === 200) {
    return "OK";
  }
  if (statusCode >= 300 && statusCode < 400) {
    return "REDIRECT";
  }
  if (statusCode >= 400 && statusCode < 500) {
    return "CLIENT_ERROR";
  }
  return "SERVER_ERROR";
}

function fetchUrlBatch(urls) {
  if (!urls || !urls.length) {
    return [];
  }

  var rows = [];
  for (var i = 0; i < urls.length; i += URL_BATCH_SIZE) {
    var batch = urls.slice(i, i + URL_BATCH_SIZE).map(function (url) {
      return {
        url: url,
        muteHttpExceptions: true,
        followRedirects: true
      };
    });

    var responses = UrlFetchApp.fetchAll(batch);
    for (var j = 0; j < responses.length; j++) {
      rows.push({
        url: urls[i + j],
        response: responses[j]
      });
    }
  }

  return rows;
}

function getSheetRowsWithoutOldLogs(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data.length) {
    return [];
  }

  var header = data[0];
  var keepRows = [header];
  var now = new Date();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rawDate = row[0];

    if (!rawDate) {
      keepRows.push(row);
      continue;
    }

    var parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      keepRows.push(row);
      continue;
    }

    var diffDays = (now - parsedDate) / (1000 * 60 * 60 * 24);
    if (diffDays <= LOG_RETENTION_DAYS) {
      keepRows.push(row);
    }
  }

  return keepRows;
}

// DELETE LOG - tiap 7 hari
function autoDeleteLog() {
  var ss = getSiteSpreadsheet();
  var sheetNames = [UPTIME_SHEET_NAME, LINK_SHEET_NAME];

  sheetNames.forEach(function (namaSheet) {
    var sheet = ss.getSheetByName(namaSheet);
    if (!sheet || sheet.getLastRow() <= 1) {
      return;
    }

    var keepRows = getSheetRowsWithoutOldLogs(sheet);
    if (keepRows.length !== sheet.getLastRow()) {
      sheet.clearContents();
      if (keepRows.length > 0) {
        sheet.getRange(1, 1, keepRows.length, keepRows[0].length).setValues(keepRows);
      }
    }
  });
}

// JALANKAN INI 1x AJA BUAT PASANG JADWAL
function pasangTriggerOtomatis() {
  var managedFunctions = ["cekUptimeKeSheet", "cekLinkMatiKeSheet", "autoDeleteLog"];

  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    var handler = trigger.getHandlerFunction ? trigger.getHandlerFunction() : "";
    if (managedFunctions.indexOf(handler) !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("cekUptimeKeSheet").timeBased().everyHours(6).create();
  ScriptApp.newTrigger("cekLinkMatiKeSheet").timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger("autoDeleteLog").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
}
