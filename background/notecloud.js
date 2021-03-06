/**
 * notecloud装配文件
 * 用于将notecloud功能挂载到eventPage页上
 * 是系统与notecloud之间的中间层
 */



// 注册云存储消息监听
!function (cloud) {

    // 监听page消息
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        console.debug("收到指令" + msg.command);

        cloud[msg.command](msg.data, function (err, log) {
            if (err) {
                sendResponse(err);
                console.log(err);
            } else {
                sendResponse(log);
                console.debug(log);
                console.debug(msg.command + "请求的响应已发送");
            }
        });

/*        //增加日志的请求
        if (msg.command === 'addBlackListItem') {

            cloud.addBlackListItem(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("addBlackListItem请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'deleteBlackListItem') {
            cloud.deleteBlackListItem(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("deleteBlackListItem请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'addWhiteListItem') {
            cloud.addWhiteListItem(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("addWhiteListItem请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'deleteWhiteListItem') {
            cloud.deleteWhiteListItem(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("deleteWhiteListItem请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'addKeyword') {
            cloud.addKeyword(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("addKeyword请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'deleteKeyword') {
            cloud.deleteKeyword(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("deleteKeyword请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'addFilter') {
            cloud.addFilter(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("addFilter请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'deleteFilter') {
            cloud.deleteFilter(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("deleteFilter请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'nextPage') {
            cloud.nextPage(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("nextPage请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'previousPage') {
            cloud.previousPage(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("previousPage请求的响应已发送");
                }
            });

            return true;
        }
        else if (msg.command === 'beginNewAffair') {
            cloud.beginNewAffair(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("beginNewAffair请求的响应已发送");
                }
            });

            return true;
        } else if (msg.command === 'appendLog') {
            cloud.appendLog(msg.data, function (err, log) {
                if (err) {
                    sendResponse(err);
                    console.log(err);
                } else {
                    sendResponse(log);
                    console.debug(log);
                    console.debug("appendLog请求的响应已发送");
                }
            });

            return true;
        }*/
    });


}(cloud);
