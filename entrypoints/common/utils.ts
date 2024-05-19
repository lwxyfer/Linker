

// get facicon
// https://github.com/faviconkit/javascript-api
export const getFavicon = (url, size = 32) => {
    const favIconUrl = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${32}`;

    return favIconUrl
}