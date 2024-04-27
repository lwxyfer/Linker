export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');

    // 获取页面上的所有OG标签
    function getAllOGTags() {
      const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"]'));
      const ogInfo = {};
      ogTags.forEach(tag => {
        const property = tag.getAttribute('property');
        const content = tag.getAttribute('content');
        if (property && content) {
          ogInfo[property] = content;
        }
      });
      return ogInfo;
    }

    // 向扩展发送获取到的OG信息
    function sendOGInfoToExtension() {
      const ogInfo = getAllOGTags();
      chrome.runtime.sendMessage({ ogInfo: ogInfo });
    }

    // 监听来自扩展的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'getOGInfo') {
        sendOGInfoToExtension();
      }
    });
  },
});
