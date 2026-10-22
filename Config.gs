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

  var normalizedUrl = urlValue.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    throw new Error(name + " harus memakai protokol http atau https.");
  }

  try {
    var parsed = Utilities.parseUrl(normalizedUrl);
    var hostname = (parsed && parsed.host) ? parsed.host : "";
    if (!hostname || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(hostname)) {
      throw new Error(name + " tidak memiliki hostname yang valid.");
    }
  } catch (e) {
    throw new Error(name + " tidak valid: " + normalizedUrl + " (" + e.message + ")");
  }
}

function isValidHttpStatusCode(code) {
  return typeof code === "number" && code >= 100 && code < 600;
}

function describeHttpStatus(code) {
  if (!isValidHttpStatusCode(code)) {
    return "INVALID_STATUS";
  }
  if (code >= 200 && code < 300) {
    return "OK";
  }
  if (code >= 300 && code < 400) {
    return "REDIRECT";
  }
  if (code >= 400 && code < 500) {
    return "CLIENT_ERROR";
  }
  return "SERVER_ERROR";
}

function validateConfig() {
  validateSheetId(SHEET_ID);
  validateUrl(URL_UTAMA, "URL_UTAMA");
}
