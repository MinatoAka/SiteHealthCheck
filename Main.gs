// CEK UPTIME - tiap 6 jam
function cekUptimeKeSheet() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Uptime") || SpreadsheetApp.openById(SHEET_ID).insertSheet("Uptime");
  if(sheet.getLastRow() == 0) sheet.appendRow(["Waktu", "URL", "Status Code", "Keterangan"]);

  var waktu = new Date();
  try {
    var start = new Date();
    var res = UrlFetchApp.fetch(URL_UTAMA, { muteHttpExceptions: true });
    var kode = res.getResponseCode();
    var durasi = new Date() - start;
    sheet.appendRow([waktu, URL_UTAMA, kode, kode == 200? "AMAN - " + durasi + "ms" : "DOWN"]);
  } catch (e) {
    sheet.appendRow([waktu, URL_UTAMA, "ERROR", e.toString()]);
  }
}

// CEK LINK MATI - tiap 24 jam
function cekLinkMatiKeSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Link") || ss.insertSheet("Link");
  if(sheet.getLastRow() == 0) sheet.appendRow(["Waktu Cek", "URL Artikel", "Status", "Catatan"]);

  var sitemap = URL_UTAMA + "/sitemap.xml";
  try {
    var xml = UrlFetchApp.fetch(sitemap).getContentText();
    var urls = xml.match(/<loc>(.*?)<\/loc>/g).map(u => u.replace(/<\/?loc>/g,'')).slice(0, 30);
    var waktu = new Date();
    urls.forEach(function(link){
      var r = UrlFetchApp.fetch(link, { muteHttpExceptions: true });
      sheet.appendRow([waktu, link, r.getResponseCode(), r.getResponseCode() == 200? "OK" : "MATI"]);
      Utilities.sleep(1000);
    });
  } catch (e) {
    sheet.appendRow([new Date(), sitemap, "ERROR", e.toString()]);
  }
}
