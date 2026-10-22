// GLOBAL CONFIG
const props = PropertiesService.getScriptProperties();
const SHEET_ID = (props.getProperty("SPREADSHEETS_ID") || "").trim();
const URL_UTAMA = (props.getProperty("URL_UTAMA") || "https://www.aturdompet.my.id").trim();

const MAX_SITEMAP_LINKS = 30;
const URL_BATCH_SIZE = 10;
const UPTIME_SHEET_NAME = "Uptime";
const LINK_SHEET_NAME = "Link";
const LOG_RETENTION_DAYS = 7;

function validateSheetId(sheetId) {
  if (!sheetId) {
    throw new Error("SPREADSHEETS_ID belum di-set di Script Properties.");
  }

  if (sheetId.length < 10 || /\s/.test(sheetId)) {
    throw new Error("SPREADSHEETS_ID tidak valid. Pastikan ID spreadsheet benar dan tidak mengandung spasi.");
  }
}

function validateUrl(urlValue, name) {
  if (!urlValue) {
    throw new Error(name + " belum di-set di Script Properties.");
  }

  try {
    var parsed = new URL(urlValue);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(name + " harus memakai protokol http atau https.");
    }
    if (!parsed.hostname) {
      throw new Error(name + " tidak memiliki hostname yang valid.");
    }
  } catch (e) {
    throw new Error(name + " tidak valid: " + urlValue + " (" + e.message + ")");
  }
}

function validateConfig() {
  validateSheetId(SHEET_ID);
  validateUrl(URL_UTAMA, "URL_UTAMA");
}
