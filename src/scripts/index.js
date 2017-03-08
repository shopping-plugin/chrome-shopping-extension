import Recognize from "./Recognize";
import setting from "../setting/setting";
import Capture from "../logic/Capture";
import BuyAction from "./BuyAction";

const state = {
    "webType": null
}

let recognizeInstance = null;

// chrome 事件监听 相关代码
//根据popup页面发出的消息进行回应
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command == "brush") {
    recognizeInstance.domToggle();
  }
  if (request.command == "buttonStatus") {
    sendResponse({brush: recognizeInstance.markingDomState});
  }
  if (request.command == "url_change") {
    recognizeInstance.domOperation.handleURLChange(request.url);

    setTimeout(() => {
        let webConfig = getWebConfig();

        if (!state.webType)
        {
            console.log("this webpage is not  a matched target webpage. ");
        }
        else
        {
            recognizeInstance.capture = new Capture({
                "webConfig": webConfig
            });;
            recognizeInstance.webConfig = webConfig;
            recognizeInstance._init();
        }
    }, 300);
  }
});


$(document).keydown((event) => {
    if (recognizeInstance)
    {
        if (event.shiftKey && event.ctrlKey && event.keyCode === 77)
        {
            recognizeInstance.domDetach();
        }

        if (event.shiftKey && event.ctrlKey && event.keyCode === 78)
        {
            recognizeInstance.domAttach();
        }
    }
});

$(document).ready(function() {
    setTimeout(() => {
        let webConfig = getWebConfig();

        if (!state.webType)
        {
            console.log("this webpage is not  a matched target webpage. ");
        }
        else
        {
            recognizeInstance = new Recognize({
                webConfig,
                state
            });
        }
    }, 300);

    /*
     * 添加对立即购买或加入购物车的点击事件
     */
    let url = $(document)[0].URL;
    let index = url.indexOf("item.htm?");
    // 商品详情页面
    if (index != -1) {
      let p_id = url.match(/[&?]id=([^& ]*)/)[1];
      let a_buy;
      let a_add;

      // 淘宝
      if (url.indexOf("item.taobao.com/item.htm?") != -1) {
        a_buy = $('a.J_LinkBuy');
        a_add = $('a.J_LinkAdd');
      }
      // 天猫
      else {
        //a_buy = $('a#J_LinkBuy');
        //a_add = $('a#J_LinkBasket');
      }

      let action = new BuyAction();
      a_buy.click(() => {
        action.handleBuyAction(p_id);
      });
      a_add.click(() => {
        action.handleBuyAction(p_id);
      });
    }
});

function getWebConfig() {
  let webConfig = null;
  for( let key in setting )
  {
      const dom = $( setting[key].identification );
      if (dom && dom.length === 1) {
          // dom 存在
          state.webType = key;
          webConfig = setting[key].webConfig;
          break;
      }
  }

  return webConfig;
}
