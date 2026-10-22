// GLOBAL CONFIG
const props = PropertiesService.getScriptProperties();
const SHEET_ID = (props.getProperty("SPREADSHEETS_ID") || "").trim();
const URL_UTAMA = (props.getProperty("URL_UTAMA") || "https://www.aturdompet.my.id").trim();

const MAX_SITEMAP_LINKS = 30;
const URL_BATCH_SIZE = 10;
const UPTIME_SHEET_NAME = "Uptime";
const LINK_SHEET_NAME = "Link";
const LOG_RETENTION_DAYS = 7;
