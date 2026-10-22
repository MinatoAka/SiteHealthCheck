// Network and data normalization helpers
function safeToString(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function safeGetResponseCode(response) {
  if (!response) {
    return null;
  }

  try {
    return response.getResponseCode();
  } catch (e) {
    return null;
  }
}

function normalizeSitemapUrls(xmlText) {
  if (!xmlText) {
    return [];
  }

  if (!/<loc>/i.test(xmlText)) {
    return [];
  }

  var matches = xmlText.match(/<loc[^>]*>([\s\S]*?)<\/loc>/gi) || [];
  var seen = {};

  return matches
    .map(function (item) {
      return item.replace(/<\/?loc[^>]*>/gi, "").trim();
    })
    .filter(function (item) {
      return !!item && item.indexOf("http") === 0 && !seen[item] && (seen[item] = true);
    })
    .slice(0, MAX_SITEMAP_LINKS);
}

function resolveUrlCatatan(statusCode) {
  if (!isValidHttpStatusCode(statusCode)) {
    return "INVALID_STATUS";
  }
  if (statusCode === 200) {
    return "OK";
  }
  if (statusCode >= 300 && statusCode < 400) {
    return "REDIRECT";
  }
  if (statusCode >= 400 && statusCode < 500) {
    return "CLIENT_ERROR";
  }
  return "SERVER_ERROR";
}

function fetchUrlBatch(urls) {
  if (!urls || !urls.length) {
    return [];
  }

  var rows = [];
  for (var i = 0; i < urls.length; i += URL_BATCH_SIZE) {
    var batch = urls.slice(i, i + URL_BATCH_SIZE).map(function (url) {
      return {
        url: url,
        muteHttpExceptions: true,
        followRedirects: true
      };
    });

    var responses = UrlFetchApp.fetchAll(batch);
    for (var j = 0; j < responses.length; j++) {
      rows.push({
        url: urls[i + j],
        response: responses[j]
      });
    }
  }

  return rows;
}
