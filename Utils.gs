// DELETE LOG - tiap 7 hari
function autoDeleteLog() {
  var ss = getSiteSpreadsheet();
  var sheetNames = [UPTIME_SHEET_NAME, LINK_SHEET_NAME];
  var sekarang = new Date();
  var millisPerDay = 1000 * 60 * 60 * 24;

  sheetNames.forEach(function(namaSheet) {
    var sheet = ss.getSheetByName(namaSheet);
    if (!sheet || sheet.getLastRow() <= 1) {
      return;
    }

    var rows = sheet.getDataRange().getValues();
    var keepRows = [rows[0]];

    for (var i = 1; i < rows.length; i++) {
      var rawDate = rows[i][0];
      if (!rawDate) {
        keepRows.push(rows[i]);
        continue;
      }

      var tglLog = new Date(rawDate);
      if (isNaN(tglLog.getTime())) {
        keepRows.push(rows[i]);
        continue;
      }

      var selisihHari = (sekarang - tglLog) / millisPerDay;
      if (selisihHari <= 7) {
        keepRows.push(rows[i]);
      }
    }

    if (keepRows.length !== rows.length) {
      sheet.clearContents();
      if (keepRows.length > 0) {
        sheet.getRange(1, 1, keepRows.length, keepRows[0].length).setValues(keepRows);
      }
    }
  });
}

// JALANKAN INI 1x AJA BUAT PASANG JADWAL
function pasangTriggerOtomatis() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });

  ScriptApp.newTrigger("cekUptimeKeSheet").timeBased().everyHours(6).create();
  ScriptApp.newTrigger("cekLinkMatiKeSheet").timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger("autoDeleteLog").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
}
