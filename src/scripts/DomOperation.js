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

        setTimeout(() => {
          this.cur_page_url = $(document)[0].URL;
          this.initNextPageData();
          this.getNextPage();
        }, 1000);

        // 存储过往操作的黑白名单，在填补空白时对商品进行过滤
        this.WHITE_LIST = [];
        this.BLACK_LIST = [];

        // 不同的笔迹类型
        this.SIGN_WHITE = "SIGN_WHITE";	// 大圈
        this.SIGN_BLACK = "SIGN_BLACK";	// 大叉

        this.nlp_result = "";

        // 接收background发送过来的分词结果
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.command == "nlp_result") {
            console.debug(request.result);

            if (!request.result.nlp_word_response == undefined) {
              this.nlp_result = request.result.nlp_word_response.wordresult;
            }
          }
        });
    }

    /*
     * 根据当前页数初始化下一页数据
     * 包括下一页的页数，下一页的URL
     */
    initNextPageData() {
      let next_page = $('ul.items li.item.active').next();
      let a = next_page.children();

      this.next_page_count = a[0].innerText;
      this.next_page_url = this.getNextPageURL();

      let iframe_div = document.createElement('div');
      iframe_div.id = "iframe_div";
      iframe_div.style.visibility = "hidden";
      document.body.appendChild(iframe_div);
    }

    /*
     * 得到待获取的下一页面的URL
     */
    getNextPageURL() {
      let cur_url = this.cur_page_url;
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

      this.next_page_dom_list = "";

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
        }, 2000, () => {
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
        });
      }, 3000);
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
        if (this.nlp_result == "" || this.nlp_result.top_status == false) {
          this.filterKeyword(wordList, typeList, false);
        }
        // 使用分词结果过滤
        else {
          wordList = this.nlp_result.top_result.split("-");
          this.filterKeyword(wordList, typeList, true);
        }
      }, 1000);
    }

    /*
     * 对分词过后的关键字进行处理
     */
    filterKeyword(wordList, typeList, isNLP) {
      let filter_url = this.getFilterURL(wordList, typeList, isNLP);
      this.createTab(filter_url);
      //this.loadFilterPage(filter_url);
    }

    /*
     * 根据小圈小叉结果构造新的URL
     */
    getFilterURL(wordList, typeList, isNLP) {
      let cur_url = this.cur_page_url;
      let q_para = cur_url.match(/[&?]q=([^& ]*)/)[0];

      for (let i = 0; i < wordList.length; i++) {
        let keyword = "";

        if (isNLP) {
          let nlp_array = wordList[i].split("\t");
          for (let j = 0; j < nlp_array.length; j++) {
            if (nlp_array[j] == "") {
              continue;
            }

            keyword += "+";

            if (typeList[i] == "-") {
              keyword += "-";
            }

            keyword += encodeURI(nlp_array[j]);
          }
        }
        else {
          keyword += "+";
          if (typeList[i] == "-") {
            keyword += "-";
          }
          keyword += encodeURI(wordList[i]);
        }

        q_para += keyword;
      }

      let new_url = cur_url.replace(/[&?]q=([^& ]*)/, q_para);

      return new_url;
    }

    /*
     * 根据构造出的URL加载增加关键字后的新页面内容
     */
    loadFilterPage(filter_url) {
      if ($('#filter_page_iframe').length != 0) {
        $('#filter_page_iframe').remove();
      }

      let iframe = document.createElement('iframe');
      iframe.id = "filter_page_iframe";
      iframe.name = "filter_page_iframe"
      iframe.src = filter_url;
      iframe.width = $(document).width();
      $('#iframe_div').append(iframe);

      setTimeout(() => {
        this.replaceDom();
        this.cur_page_url = filter_url;

        this.next_page_count = 2;
        this.next_page_url = this.getNextPageURL();
        this.getNextPage();
      }, 3000);
    }

    /*
     * 根据重新过滤得到的结果替换当前页面商品
     * 保留白名单
     */
    replaceDom() {
      let iframe_window = $(window.frames["filter_page_iframe"].document);

      iframe_window.find('html body').animate({
        scrollTop: $(iframe_window).height()
      }, 3000, () => {
        let new_item_list;
        let page_style = this.getPageStyle();

        if (page_style == this.GRID_STYLE) {
          $(".item.activity.activity-tpl-theme").remove();
          new_item_list = iframe_window.find("div.grid.g-clearfix").children().eq(0).children();

          let prev_item_list = $('div.item.J_MouserOnverReq');
          for (let i = 0; i < prev_item_list.length; i++) {
            let item = prev_item_list.eq(i);
            // 跳过白名单商品
            if (!item.hasClass("white")) {
              item.remove();
            }
          }

          for (let i = 0; i < new_item_list.length; i++) {
            let new_item = new_item_list.eq(i);
            let new_item_id = this.getProductIdFromDom(new_item);
            if (!this.checkProduct(new_item_id)) {
              continue;
            }

            let last_item = this.getLastProduct(page_style);

            if (last_item.length == 0) {
              $('div.grid.g-clearfix').children().eq(0).append(new_item);
            }
            else {
              last_item.after(new_item);
            }
          }
        }
        else {
          new_item_list = iframe_window.find("div.items.g-clearfix").children();

          let prev_item_list = $('div.item.g-clearfix');
          for (let i = 0; i < prev_item_list.length; i++) {
            let item = prev_item_list.eq(i);
            // 跳过白名单商品
            if (!item.hasClass("white")) {
              item.remove();
            }
          }

          for (let i = 0; i < new_item_list.length; i++) {
            let new_item = new_item_list.eq(i);
            let new_item_id = this.getProductIdFromDom(new_item);
            if (!this.checkProduct(new_item_id)) {
              continue;
            }

            let last_item = this.getLastProduct(page_style);

            if (last_item.length == 0) {
              $('div.items.g-clearfix').append(new_item);
            }
            else {
              last_item.after(new_item);
            }
          }
        }
      });
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

    		// 大叉，黑名单，直接删除商品，并填补造成的页面空缺
    		if (cur_type == this.SIGN_BLACK) {
    			this.updateItem(cur_item, cur_id);

    			if ($('#' + cur_id).length > 0) {
    				$('#' + cur_id).remove();
    				this.BLACK_LIST.push(cur_id);

    				if (this.next_page_dom_list != "") {
              this.fillInBlank(page_style);
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
    				this.WHITE_LIST.push(cur_id);

    				// 新开标签页，显示该商品的商品详情
    				this.createTab(cur_img.parentNode.href);
    			}
    		}
    	}
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
       增加id属性；增加背景色样式
     */
    updateItem(item, p_id) {
    	item.id = p_id;
    	item.style.backgroundColor = "#FFCCCC";
      item.className += " white";
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
          }, 5000);

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
    	if ($.inArray(numiid, this.WHITE_LIST) != -1 || $.inArray(numiid, this.BLACK_LIST) != -1) {
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
     * 返回当前页面列表中第一个商品dom元素
     */
    getFirstProduct(page_style) {
    	if (page_style == this.GRID_STYLE) {
    		return $('div.item.J_MouserOnverReq').eq(0);
    	}
    	else {
    		return $('div.item.g-clearfix').eq(0);
    	}
    }

    /*
     * 返回当前页面列表中最后一个商品dom元素
     */
    getLastProduct(page_style) {
    	let container;
    	if (page_style == this.GRID_STYLE) {
    		container = $('div.item.J_MouserOnverReq');
    	}
    	else {
    		container = $('div.item.g-clearfix');
    	}

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
}
