const props = PropertiesService.getScriptProperties();
const SHEET_ID = (props.getProperty("SPREADSHEETS_ID") || "").trim();
const URL_UTAMA = "https://www.aturdompet.my.id";
const MAX_SITEMAP_LINKS = 30;
const UPTIME_SHEET_NAME = "Uptime";
const LINK_SHEET_NAME = "Link";
