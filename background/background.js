// 设置插件仅匹配淘宝搜索页面
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 淘宝搜索页面
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 's.taobao.com/search?' },
          }),
          // 淘宝详情页面
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'item.taobao.com/item.htm?' },
          }),
          // 天猫详情页面
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'detail.tmall.com/item.htm?' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 	// 新开商品详情页面
 	if (request.command == "createTab") {
    if (request.closeCurrent == true) {
      chrome.tabs.remove(sender.tab.id);
    }

 		var target_url = request.target;
    console.log(target_url);
 		chrome.tabs.create({'url': target_url, 'active': request.active});

 		sendResponse({result: "tab created: " + target_url});
 	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url != undefined && changeInfo.url.startsWith("https://s.taobao.com/search?")) {
    console.debug(changeInfo.url);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "url_change", url: changeInfo.url}, function(response) {
        //console.log(response.farewell);
      });
    });
  }
});
