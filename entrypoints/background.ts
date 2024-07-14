export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });
  // console.log('Hello background!2 ', chrome.action);

  const setIcon = (tab) => {
    const storageKey = 'chromeBookmarks';
    chrome.storage.local.get(storageKey, (result) => {
      const data = result[storageKey] || [];
      const hasBookmark = data.some((bookmark: any) => bookmark.url === tab.url);

      if (hasBookmark) {
        chrome.action.setIcon({ path: 'icon/128x128.png' });
      } else {
        chrome.action.setIcon({ path: 'icon/128.png' });
      }
    })
  }

  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      if (tab.url) {
        setIcon(tab)
      }
    });
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    setIcon(tab)
  });
})