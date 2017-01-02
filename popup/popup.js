/*
 * “画笔”功能
 */
!function(){
    refreshButtons();

    // 画笔事件触发
    $('#brush').click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
           chrome.tabs.sendMessage(tabs[0].id, {command: "brush"});
        });
        refreshButtons();
    });
}();

// 更新各按钮状态
function refreshButtons(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "buttonStatus"},function(status){
          console.debug(status);
            status.brush ? on('#brush') : off('#brush');
        });
    });
}

function on(selector){
    $(selector).removeClass('disabled');
}

function off(selector){
    $(selector).addClass('disabled');
}

// 在特定时间后关闭popup页面
// $(function(){
//     var closeTimeout = [];
//
//     $('body').mouseout(function(){
//         closeTimeout.push(setTimeout(function(){
//             window.close();
//         }, 800));
//     });
//
//     $('body').mouseover(function(){
//         while(closeTimeout.length > 0){
//             var to = closeTimeout.pop();
//             clearTimeout(to);
//         }
//     });
// });
