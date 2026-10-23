//============================================================
// GLOBAL CONFIG
//============================================================

const props = PropertiesService.getScriptProperties();
const SHEET_ID = (props.getProperty("SPREADSHEETS_ID") || "").trim();
const URL_UTAMA = (props.getProperty("URL_UTAMA") || "https://www.aturdompet.my.id").trim();

const MAX_SITEMAP_LINKS = 30;
const URL_BATCH_SIZE = 10;
const UPTIME_SHEET_NAME = "Uptime";
const LINK_SHEET_NAME = "Link";
const LOG_RETENTION_DAYS = 7;

function getWibTimestamp(date) {
  var d = date || new Date();
  return Utilities.formatDate(d, "GMT+7", "yyyy-MM-dd HH:mm:ss");
}


function validateSheetId(sheetId) {
  if (!sheetId) {
    throw new Error("SPREADSHEETS_ID belum di-set di Script Properties.");
  }

  var normalized = sheetId.trim();
  if (!normalized || normalized.length < 10 || /\s/.test(normalized)) {
    throw new Error("SPREADSHEETS_ID tidak valid. Pastikan ID spreadsheet benar dan tidak mengandung spasi.");
  }
}

function isValidHostname(hostname) {
  if (!hostname) {
    return false;
  }

  var host = hostname.toLowerCase().replace(/\.\s*$/, "");
  if (!host || /\s/.test(host)) {
    return false;
  }

  if (host === "localhost") {
    return true;
  }

  if (!/^\w[\w.-]*\.[a-z]{2,}$/i.test(host)) {
    return false;
  }

  if (host.indexOf("..") !== -1 || host.startsWith("-") || host.endsWith("-")) {
    return false;
  }

  var labels = host.split(".");
  if (labels.length < 2) {
    return false;
  }

  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    if (!label || label.length > 63 || /-/.test(label) || !/^[a-z0-9-]+$/i.test(label)) {
      return false;
    }
  }

  var lastLabel = labels[labels.length - 1];
  if (!/^[a-z]{2,}$/i.test(lastLabel)) {
    return false;
  }

  return true;
}

function validateUrl(urlValue, name) {
  if (!urlValue) {
    throw new Error(name + " belum di-set di Script Properties.");
  }

  var normalizedUrl = urlValue.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    throw new Error(name + " harus memakai protokol http atau https.");
  }

  if (/\s/.test(normalizedUrl)) {
    throw new Error(name + " tidak valid. URL tidak boleh mengandung spasi.");
  }

  var hostnameMatch = normalizedUrl.match(/^https?:\/\/([^\/?#]+)/i);
  var hostnamePort = hostnameMatch ? hostnameMatch[1] : "";
  var hostname = hostnamePort ? hostnamePort.split(":")[0] : "";

  if (!isValidHostname(hostname)) {
    throw new Error(name + " tidak memiliki hostname yang valid.");
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
  Logger.log("[validateConfig] Memulai validasi konfigurasi...");
  Logger.log("[validateConfig] SHEET_ID=" + SHEET_ID);
  Logger.log("[validateConfig] URL_UTAMA=" + URL_UTAMA);

  try {
    validateSheetId(SHEET_ID);
    validateUrl(URL_UTAMA, "URL_UTAMA");
    Logger.log("[validateConfig] Validasi konfigurasi berhasil.");
  } catch (e) {
    Logger.log("[validateConfig] Validasi konfigurasi gagal: " + e.message);
    throw e;
  }
}
