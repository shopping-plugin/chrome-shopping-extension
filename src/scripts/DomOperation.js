import cloudService from "./cloudService"

export default class DomOperation {
    constructor()
    {
        this.GRID_STYLE = "GRID";
        this.LIST_STYLE = "LIST";

        this.next_page_dom_list = "";
        this.item_index = 0;
        this.data_value = 44;
        this.next_page_count = 0;
        this.next_page_url = "";

        this.KEYWORD_LIST = [];
        this.KEYWORD_TYPE_LIST = [];

        setTimeout(() => {
          this.initKeywordList();
          this.initPageData();
          this.getNextPage();
        }, 1000);

        // 存储过往操作的黑白名单，在填补空白时对商品进行过滤
        this.WHITE_ID_LIST = [];
        this.BLACK_ID_LIST = [];
        this.WHITE_DOM_LIST = [];

        // 不同的笔迹类型
        this.SIGN_WHITE = "SIGN_WHITE";	// 大圈
        this.SIGN_BLACK = "SIGN_BLACK";	// 大叉

        this.nlp_result = "";

        // 接收background发送过来的分词结果
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.command == "nlp_result") {
            if (request.result.success == true) {
              this.nlp_result = this.getWordListFromNLPResult(request.result.data);
            }
            else {
              console.debug(request.result.errMsg);
            }

            console.debug(this.nlp_result);
          }
          if (request.command == "keyword") {
            // console.debug(this.KEYWORD_LIST);
            // console.debug(this.KEYWORD_TYPE_LIST);

            sendResponse({wordList: this.KEYWORD_LIST, typeList: this.KEYWORD_TYPE_LIST, cur_url: $(document)[0].URL});
          }
        });
    }

    initKeywordList() {
      let q = $(document)[0].URL.match(/[&?]q=([^& ]*)/)[1];
      let q_array = this.getCharFromUtf8(q).split("+");

      for (let i = 0; i < q_array.length; i++) {
        this.KEYWORD_LIST.push(q_array[i]);

        if (q_array[i].indexOf("-") == -1) {
          this.KEYWORD_TYPE_LIST.push("+");
        }
        else {
          this.KEYWORD_TYPE_LIST.push("-");
        }
      }
    }

    /*
     * 根据当前页数初始化下一页数据
     * 包括下一页的页数，下一页的URL
     */
    initPageData() {
      let next_page = $('ul.items li.item.active').next();
      let a = next_page.children();

      this.next_page_count = a[0].innerText;
      this.next_page_url = this.getNextPageURL();

      if ($('#iframe_div').length != 0) {
        $('#iframe_div').remove();
      }

      let iframe_div = document.createElement('div');
      iframe_div.id = "iframe_div";
      iframe_div.style.visibility = "hidden";
      document.body.appendChild(iframe_div);
    }

    /*
     * 得到待获取的下一页面的URL
     */
    getNextPageURL() {
      let cur_url = $(document)[0].URL;
      let s_para = cur_url.match(/&s=([^& ]*)/);

      let s_value = this.data_value * (this.next_page_count - 1);
      if (s_para == null) {
        return cur_url + "&s=" + s_value;
      }
      else {
        return cur_url.replace(/&s=([^& ]*)/, "&s=" + s_value);
      }
    }

    /*
     * 根据URL加载下一页商品信息
     */
    getNextPage() {
      if ($('#next_page_iframe').length != 0) {
        $('#next_page_iframe').remove();
      }

      let iframe = document.createElement('iframe');
      iframe.id = "next_page_iframe";
      iframe.name = "next_page_iframe"
      iframe.src = this.next_page_url;
      iframe.width = $(document).width();
      $('#iframe_div').append(iframe);

      setTimeout(() => {
        let iframe_window = $(window.frames["next_page_iframe"].document);

        iframe_window.find('html body').animate({
          scrollTop: $(iframe_window).height()
        }, 3000, () => {
          // Animation complete
          let item_list;
          if (this.getPageStyle() == this.GRID_STYLE) {
            item_list = iframe_window.find("div.grid.g-clearfix").children().eq(0);
          }
          else {
            item_list = iframe_window.find("div.items.g-clearfix");
          }

          this.next_page_dom_list = item_list.children();
          this.item_index = 0;
          this.next_page_count++;
          this.next_page_url = this.getNextPageURL();

          //console.debug(this.next_page_dom_list);
        });
      }, 3000);
    }

    /*
     * 从服务器返回的分词结果中提取出词组
     */
    getWordListFromNLPResult(nlp_result) {
      let wordList = [];
      let nlp_word = [];

      for (let i = 0; i < nlp_result.length; i++) {
        let result = nlp_result[i];

        if (result.word == "-") {
          wordList.push(nlp_word.join("\t"));
          nlp_word = [];
        }
        else {
          nlp_word.push(result.word);
        }
      }

      wordList.push(nlp_word.join("\t"));

      return wordList;
    }

    /*
     * 供笔迹识别部分调用的接口 - 关键字过滤
     */
    filterText(wordList, typeList) {
      this.nlp_result = "";

      // 进行分词
      let wordStr = wordList.join("-");
      this.nlp(wordStr);

      setTimeout(() => {
        // 未获取到分词结果或分词失败，则使用未分词的word进行过滤
        if (this.nlp_result == "") {
          this.filterKeyword(wordList, typeList, false);
        }
        // 使用分词结果过滤
        else {
          this.filterKeyword(this.nlp_result, typeList, true);
        }
      }, 2000);
    }

    /*
     * 对分词过后的关键字进行处理
     */
    filterKeyword(wordList, typeList, isNLP) {
      let filter_url = this.getFilterURL(wordList, typeList, isNLP);
      //console.debug(wordList, typeList, isNLP);
      this.createTab(filter_url);
    }

    /*
     * 根据小圈小叉结果构造新的URL
     */
    getFilterURL(wordList, typeList, isNLP) {
      let cur_url = $(document)[0].URL;
      let q_para = cur_url.match(/[&?]q=([^& ]*)/)[0];

      for (let i = 0; i < wordList.length; i++) {
        let keyword = "";

        if (isNLP) {
          let nlp_array = wordList[i].split("\t");
          for (let j = 0; j < nlp_array.length; j++) {
            let nlp_word = nlp_array[j].replace(/(^\s*)|(\s*$)/g, "");

            if (nlp_word.length == 0) {
              continue;
            }

            keyword += "+";

            if (typeList[i] == "-") {
              keyword += "-";
              this.KEYWORD_LIST.push("-" + nlp_word);
            }
            else {
              this.KEYWORD_LIST.push(nlp_word);
            }

            keyword += encodeURI(nlp_word);

            this.KEYWORD_TYPE_LIST.push(typeList[i]);
          }
        }
        else {
          keyword += "+";

          let w = wordList[i].replace(/(^\s*)|(\s*$)/g, "");

          if (w.length == 0) {
            continue;
          }

          if (typeList[i] == "-") {
            keyword += "-";
            this.KEYWORD_LIST.push("-" + w);
          }
          else {
            this.KEYWORD_LIST.push(w);
          }

          keyword += encodeURI(w);

          this.KEYWORD_TYPE_LIST.push(typeList[i]);
        }

        q_para += keyword;
      }

      let new_url = cur_url.replace(/[&?]q=([^& ]*)/, q_para);

      return new_url;
    }

    /*
     * 供笔迹识别部分调用的接口 - 大圈大叉
     * 根据识别出的大圈大叉的dom元素对页面进行过滤
     * 并用下一页数据填补空白
     */
    filterDom(containerDivList, imgDivList, typeList) {
    	let page_style = this.getPageStyle();

    	for (let i = 0; i < containerDivList.length; i++) {
    		let cur_item = containerDivList[i];
    		let cur_img = imgDivList[i];
    		let cur_type = typeList[i];

    		let cur_id = this.getProductIdFromImg(cur_img);
    		if (cur_id == "")
    			continue;

    		// 大叉，黑名单，
        // 若是白名单商品，则从WHITE_LIST中去除，并将该商品移到现有白名单商品之后
        // 否则，删除商品，并填补造成的页面空缺
    		if (cur_type == this.SIGN_BLACK) {
          if ($.inArray(cur_id, this.WHITE_ID_LIST) != -1) {
            let first_gray_product = this.getFirstGrayProduct(page_style);

            this.removeItemFromWhite(cur_item, cur_id);
            $('#' + cur_id).insertBefore(first_gray_product);
          }
          else {
            this.updateItem(cur_item, cur_id);

      			if ($('#' + cur_id).length > 0) {
      				$('#' + cur_id).remove();
      				this.BLACK_ID_LIST.push(cur_id);

      				if (this.next_page_dom_list != "") {
                this.fillInBlank(page_style);
              }
      			}
          }
    		}
    		// 将白名单内商品排列到最前
    		else if (cur_type == this.SIGN_WHITE) {
    			// 当前商品列表第一个元素，将白名单商品添加在其前即可
    			let first_product = this.getFirstProduct(page_style);

    			this.updateItem(cur_item, cur_id);

    			if ($('#' + cur_id).length > 0) {
    				$('#' + cur_id).insertBefore(first_product);
    				this.WHITE_ID_LIST.push(cur_id);
            this.WHITE_DOM_LIST.push($('#' + cur_id));

    				// 新开标签页，显示该商品的商品详情
    				this.createTab(cur_img.parentNode.href);
    			}
    		}
    	}
    }

    /*
     * 当页面URL变更（点击过滤条件或下一页）时刷新页面内容
     * 同时更新next_page_iframe
     */
    handleURLChange(new_url) {
      console.debug(new_url, this.WHITE_ID_LIST, this.BLACK_ID_LIST, this.WHITE_DOM_LIST);

      let page_style = this.getPageStyle();

      // 删除页面中已有的黑白名单商品
      let item_list = this.getPageItemList(page_style);
      for (let i = 0; i < item_list.length; i++) {
        let item = item_list.eq(i);
        let item_id = this.getProductIdFromDom(item);

        if ($.inArray(item_id, this.BLACK_ID_LIST) != -1 || $.inArray(item_id, this.WHITE_ID_LIST) != -1) {
          this.updateItem(item, item_id);

          if ($('#' + item_id).length > 0) {
            $('#' + item_id).remove();
          }
        }
      }

      // 添加白名单商品至最前
      let first_product = this.getFirstProduct(page_style);
      for (let i = 0; i < this.WHITE_DOM_LIST.length; i++) {
        let item = this.WHITE_DOM_LIST[i];
        item.insertBefore(first_product);
      }

      this.initPageData();
      this.getNextPage();
    }

    /*
     * 根据图片dom元素获取商品id
     */
     getProductIdFromImg(imgDom) {
    	let nid = imgDom.parentNode.dataset["nid"];
    	if (nid == undefined || nid == null) {
    		return "";
    	}

    	return nid;
    }

    /*
     * 根据商品id更新该商品所在dom元素
     * 增加id属性；增加背景色样式
     */
    updateItem(item, p_id) {
      $(item).attr("id", p_id);
      $(item).css("background-color","#FFCCCC");
      $(item).addClass("white");
    }

    /*
     * 从白名单列表中删除商品
     * 去除商品的背景色样式
     */
    removeItemFromWhite(item, p_id) {
      let index = this.WHITE_ID_LIST.indexOf(p_id);
      if (index > -1) {
         this.WHITE_ID_LIST.splice(index, 1);
         this.WHITE_DOM_LIST.splice(index, 1);
      }

      $(item).css("background-color","");
      $(item).removeClass("white");
    }

    /*
     * 利用淘宝URL填补页面空缺
     */
    fillInBlank(page_style) {
      // 当前商品列表最后一个元素，将新商品添加在其后即可
    	let lastProduct = this.getLastProduct(page_style);
      let newProduct = this.getNewProduct(page_style);

      lastProduct.after(newProduct);
    }

    /*
     * 从淘宝URL获得的商品列表中获取填充的下一个商品
     */
    getNewProduct(page_style) {
      while (true) {
        // 下一页商品用完，继续获取下下页商品
        if (this.item_index == this.next_page_dom_list.length) {
          this.getNextPage();
          setTimeout(() => {
            this.fillInBlank(page_style);
          }, 6000);

          break;
        }
        else {
          let product = this.next_page_dom_list.eq(this.item_index);
          this.item_index++;

          // 检测是否为商品
          if (page_style == this.GRID_STYLE && !product.hasClass("item J_MouserOnverReq")) {
            continue;
          }
          if (page_style == this.LIST_STYLE && !product.hasClass("item g-clearfix")) {
            continue;
          }

          let p_id = this.getProductIdFromDom(product);
          if (this.checkProduct(p_id)) {
            return product;
          }
        }
      }
    }

    /*
     * 从商品dom中获取商品id
     */
    getProductIdFromDom(product_dom) {
      let p_id;
      if (this.getPageStyle() == this.GRID_STYLE) {
        let a_id = product_dom[0].childNodes[1].childNodes[1].childNodes[1].childNodes[1].id;
        let a_id_array = a_id.split("_");
        p_id = a_id_array[a_id_array.length - 1];
      }
      else {
        p_id = product_dom[0].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].dataset["nid"];
      }

      return p_id;
    }

    /*
     * 检测商品是否可填充：不与页面已有商品重复；不是黑白名单商品
     */
    checkProduct(numiid) {
    	// 是否是黑白名单商品
    	if ($.inArray(numiid, this.WHITE_ID_LIST) != -1 || $.inArray(numiid, this.BLACK_ID_LIST) != -1) {
    		return false;
    	}

    	// 是否与页面其他商品重复
    	let item;

    	if (this.getPageStyle() == this.GRID_STYLE) {
    		let a_id = "J_Itemlist_PLink_" + numiid;
    		item = $('#' + a_id);
    	}
    	else {
    		item = $('a[data-nid="' + numiid +'"]').eq(0);
    	}

    	if (item.length > 0) {
    		return false;
    	}

    	return true;
    }

    /*
     * 获取当前页面显示方式：网格 OR 列表
     */
    getPageStyle() {
    	let grid_class = $('div.styles ul li')[0].childNodes[1].classList;

    	let cur_style;
    	if ($.inArray("active", grid_class) != -1) {
    		cur_style = this.GRID_STYLE;
    	}
    	else {
    		cur_style = this.LIST_STYLE;
    	}

    	return cur_style;
    }

    /*
     * 获取当前页面的商品列表
     */
    getPageItemList(page_style) {
      if (page_style == this.GRID_STYLE) {
        return $('div.item.J_MouserOnverReq');
      }
      else {
        return $('div.item.g-clearfix');
      }
    }

    /*
     * 返回当前页面列表中第一个商品dom元素
     */
    getFirstProduct(page_style) {
      return this.getPageItemList(page_style).eq(0);
    }

    /*
     * 返回当前页面列表中第一个非白名单商品dom元素
     */
    getFirstGrayProduct(page_style) {
      let item_list = this.getPageItemList(page_style);

      for (let i = 0; i < item_list.length; i++) {
        let item = item_list.eq(i);
        if (!item.hasClass("white")) {
          return item;
        }
      }
    }

    /*
     * 返回当前页面列表中最后一个商品dom元素
     */
    getLastProduct(page_style) {
    	let container = this.getPageItemList(page_style);
    	return container.eq(container.length - 1);
    }

    /*
     * 与background页面通信，以实现新开标签页
     */
    createTab(url) {
    	chrome.runtime.sendMessage({command: "createTab", target: url}, (response) => {
    		//console.log(response.result);
    	});
    }

    /*
     * 与background页面通信，调用淘宝API对圈中的关键字进行分词
     */
    nlp(word) {
      chrome.runtime.sendMessage({command: "nlp", word: word}, (response) => {

    	});
    }

    //将URL中的UTF-8字符串转成中文字符串
    getCharFromUtf8(str) {
        let cstr = "";
        let nOffset = 0;
        if (str == "")
            return "";
        str = str.toLowerCase();
        nOffset = str.indexOf("%e");
        if (nOffset == -1)
            return str;
        while (nOffset != -1) {
            cstr += str.substr(0, nOffset);
            str = str.substr(nOffset, str.length - nOffset);
            if (str == "" || str.length < 9)
                return cstr;
            cstr += this.utf8ToChar(str.substr(0, 9));
            str = str.substr(9, str.length - 9);
            nOffset = str.indexOf("%e");
        }
        return cstr + str;
    }

    //将编码转换成字符
    utf8ToChar(str) {
        var iCode, iCode1, iCode2;
        iCode = parseInt("0x" + str.substr(1, 2));
        iCode1 = parseInt("0x" + str.substr(4, 2));
        iCode2 = parseInt("0x" + str.substr(7, 2));
        return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
    }
}
