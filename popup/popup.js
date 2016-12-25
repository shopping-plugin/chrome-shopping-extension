// 点击按钮向contentScript发送黑白名单，触发过滤事件
$('#search').click(function(){
  console.log("start filtering...");

  var white_list = $("#white_list").val().split(" ");
  var black_list = $("#black_list").val().split(" ");

  // 发送数据
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {command: "filter", white: white_list, black: black_list}, function(response) {
      console.log(response.result);
    });
  });

  // 清空表单
  refreshForm();
});

// 清空表单数据
function refreshForm(){
  $("#white_list").val("");
  $("#black_list").val("");
}

// 在特定时间后关闭popup页面
// $(function(){
//   var closeTimeout = [];

//   $('body').mouseout(function(){
//       closeTimeout.push(setTimeout(function(){
//           window.close();
//       }, 5000));
//   });

//   $('body').mouseover(function(){
//       while(closeTimeout.length > 0){
//           var to = closeTimeout.pop();
//           clearTimeout(to);
//       }
//   });
// });
