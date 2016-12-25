/**
 * 负责处理contentScript发送过来的请求
 */

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//  	// 新开商品详情页面
//  	if (request.command == "createTab") {
//  		var target_url = request.target;
//  		chrome.tabs.create({'url': target_url, 'active': false});
//
//  		sendResponse({result: "tab created: " + target_url});
//  	}
// });
