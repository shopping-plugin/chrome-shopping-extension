/**
 * notecloud装配文件
 * 用于将notecloud功能挂载到eventPage页上
 * 是系统与notecloud之间的中间层
 */

// 在每个页面文件夹中的页面数据文件名
var PAGE_DATA_FILE = 'pagedata';
// 在每个页面文件夹中的截图文件名
var PAGESHOT_DATA_FILE = 'pageshotdata';

// 注册云存储消息监听
!function(cloud){
    // 监听page消息
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
        console.debug("收到指令");
        //增加日志的请求
        if(msg.command === 'appendLog'){
            cloud.appendLog(msg.data, function (err, log) {
                if(err){
                    sendResponse(err);
                    console.log(err);
                }else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("appendLog请求的响应已发送");
                }
            });

            // 获取page对象
            return true;
        }
    });
}(cloud);
