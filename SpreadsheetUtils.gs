// Spreadsheet helpers
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
