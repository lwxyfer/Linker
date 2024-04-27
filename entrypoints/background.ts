export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  console.log('Hello background!2 ', chrome.action);


  chrome.action.onClicked.addListener((tab) => {
    // 在当前活动标签页执行Content Script来获取OG信息
    console.log('send message ？？？？？？？？')

    chrome.tabs.executeScript(tab.id, { file: 'content.ts' }, () => {
      // 向Content Script发送消息以获取OG信息
      chrome.tabs.sendMessage(tab.id, { action: 'getOGInfo' });
    });
  });

});
