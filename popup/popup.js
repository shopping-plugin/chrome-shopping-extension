/*
 * “画笔”功能
 */
!function(){
    refreshButtons();
    refreshKeywords();

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

function refreshKeywords() {
  console.debug("keywords");

  var keyword_array = [{"type": "+", "word": "羊毛呢"},
                      {"type": "+", "word": "修身"},
                      {"type": "-", "word": "-宽松"},
                      {"type": "-", "word": "-大毛领"}];

  var keywords = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('word'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: keyword_array
  });
  keywords.initialize();

  var elt = $('#keyword');
  elt.tagsinput({
    tagClass: function(item) {
      switch (item.type) {
        case '-'  : return 'label label-danger label-important';
        case '+': return 'label label-success';
      }
    },
    itemValue: 'word',
    itemText: 'word',
    typeaheadjs: {
      name: 'keywords',
      displayKey: 'word',
      source: keywords.ttAdapter()
    }
  });

  elt.tagsinput('add', {"type": "+", "word": "羊毛呢"});
  elt.tagsinput('add', {"type": "+", "word": "修身"});
  elt.tagsinput('add', {"type": "-", "word": "-宽松"});
  elt.tagsinput('add', {"type": "-", "word": "-大毛领"});
}

// 在特定时间后关闭popup页面
$(function(){
    var closeTimeout = [];

    $('body').mouseout(function(){
        closeTimeout.push(setTimeout(function(){
            window.close();
        }, 3000));
    });

    $('body').mouseover(function(){
        while(closeTimeout.length > 0){
            var to = closeTimeout.pop();
            clearTimeout(to);
        }
    });
});
