var page_url = "";

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

    // 搜索事件触发
    $('#search_btn').click(function(){
        console.debug($("#keyword").val());
        createSearchTab($("#keyword").val().split(","));
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

// 点亮画笔
function on(selector){
    $(selector).removeClass('disabled');
}

// 熄灭画笔
function off(selector){
    $(selector).addClass('disabled');
}

// 更新关键字
function refreshKeywords() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "keyword"},function(response){
        console.debug(response);
        page_url = response.cur_url;
        updateInputText(response.wordList, response.typeList);
      });
  });
}

function updateInputText(wordList, typeList) {
  let keyword_array = [];

  for (let i = 0; i < wordList.length; i++) {
    keyword_array.push({"type": typeList[i], "word": wordList[i]});
  }

  console.debug(keyword_array);

  let keywords = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('word'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: keyword_array
  });
  keywords.initialize();

  let elt = $('#keyword');
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

  for (let i = 0; i < wordList.length; i++) {
    elt.tagsinput('add', {"type": typeList[i], "word": wordList[i]});
  }
}

// 根据关键字内容新开搜索页面
function createSearchTab(keyword_array) {
  let q_para = "";
  for (let i = 0; i < keyword_array.length; i++) {
    if (i != 0) {
      q_para += "+";
    }

    q_para += encodeURI(keyword_array[i]);
  }

  let target_url = page_url.replace(/([&?]q=)([^& ]*)/, '$1' + q_para);

  console.debug(target_url);

  chrome.tabs.create({'url': target_url, 'active': false});
}

// 在特定时间后关闭popup页面
$(function(){
    let closeTimeout = [];

    $('body').mouseout(function(){
        closeTimeout.push(setTimeout(function(){
            window.close();
        }, 3000));
    });

    $('body').mouseover(function(){
        while(closeTimeout.length > 0){
            let to = closeTimeout.pop();
            clearTimeout(to);
        }
    });
});
