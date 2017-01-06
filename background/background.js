// 设置插件仅匹配淘宝搜索页面
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 's.taobao.com/search?' },
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
 		var target_url = request.target;
    console.log(target_url);
 		chrome.tabs.create({'url': target_url, 'active': false});

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
