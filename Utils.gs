// DELETE LOG - tiap 7 hari
function autoDeleteLog() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  ["Uptime", "Link"].forEach(function(namaSheet){
    var sheet = ss.getSheetByName(namaSheet);
    if(!sheet) return;
    var data = sheet.getDataRange().getValues();
    var sekarang = new Date();
    for (var i = data.length - 1; i >= 1; i--) {
      var tglLog = new Date(data[i][0]);
      var selisihHari = (sekarang - tglLog) / (1000 * 60 * 60 * 24);
      if (selisihHari > 7) {
        sheet.deleteRow(i + 1);
      }
    }
  });
}

// JALANKAN INI 1x AJA BUAT PASANG JADWAL
function pasangTriggerOtomatis() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger("cekUptimeKeSheet").timeBased().everyHours(6).create(); // 6 jam
  ScriptApp.newTrigger("cekLinkMatiKeSheet").timeBased().everyDays(1).atHour(7).create(); // 1x24 jam jam 7 pagi
  ScriptApp.newTrigger("autoDeleteLog").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create(); // 1x7 hari tiap senin jam 8
}
