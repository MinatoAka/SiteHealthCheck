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

  var normalized = sheetId.trim();
  if (!normalized || /\s/.test(normalized)) {
    throw new Error("SPREADSHEETS_ID tidak valid. Pastikan ID spreadsheet benar dan tidak mengandung spasi.");
  }

  if (normalized.length < 10 || !/^[A-Za-z0-9-_]+$/.test(normalized)) {
    throw new Error("SPREADSHEETS_ID tidak valid. ID spreadsheet biasanya berisi kombinasi huruf, angka, tanda '-' atau '_'.");
  }
}

function isValidHostname(hostname) {
  if (!hostname) {
    return false;
  }

  var host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host || /\s/.test(host)) {
    return false;
  }

  if (host === "localhost") {
    return true;
  }

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    return true;
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
    if (!label || label.length > 63 || /^-/.test(label) || /-$/.test(label)) {
      return false;
    }
    if (!/^[a-z0-9-]+$/i.test(label)) {
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
  var hostPort = hostnameMatch ? hostnameMatch[1] : "";
  var hostname = hostPort ? hostPort.split(":")[0] : "";

  if (!isValidHostname(hostname)) {
    throw new Error(name + " tidak valid: " + normalizedUrl + " (hostname tidak sesuai format domain/URL yang valid)");
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
