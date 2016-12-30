export default class DomOperation {
    constructor()
    {
        this.GRID_STYLE = "GRID";
        this.LIST_STYLE = "LIST";
        this.PAGE_NO = 1;
        this.product_list = "";

        this.next_page_dom_list = "";
        this.item_index = 0;
        this.page_size = 44;
        this.next_page_count = 0;
        this.next_page_url = "";
        this.initNextPageData();
        this.getNextPage();

        // 存储过往操作的黑白名单，在填补空白时对product_list中的商品进行过滤
        this.WHITE_LIST = [];
        this.BLACK_LIST = [];

        // 不同的笔迹类型
        this.SIGN_WHITE = "SIGN_WHITE";	// 大圈
        this.SIGN_BLACK = "SIGN_BLACK";	// 大叉

        //根据插件页面发出的消息进行回应
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        	// 根据黑白名单对页面dom元素进行重排序，并利用API返回的商品列表进行页面空白补全
            if (request.command == "filter") {
            	//filterDom(request);
            	//getProductListAndFilter(request);
            	sendResponse({result: "filtering done"});
            }
            // 获取异步API调用的返回值：商品列表
            if (request.command == "product_list") {
            	this.product_list = $.parseJSON(request.list).tbk_item_get_response.results.n_tbk_item;
            }
        });
    }

    /*
     * 根据当前页数初始化下一页数据
     * 包括下一页的页数，下一页的URL，以及页大小
     */
    initNextPageData() {
      let next_page = $('ul.items li.item.active').next();
      let a = next_page.children();
      this.next_page_count = a[0].innerText;
      this.next_page_url = this.getNextPageURL();

      console.debug("next_page_count: " + this.next_page_count);
      console.debug("page_size: " + this.page_size);

      let iframe_div = document.createElement('div');
      iframe_div.id = "iframe_div";
      iframe_div.style.visibility = "hidden";
      document.body.appendChild(iframe_div);
    }

    getNextPageURL() {
      let cur_url = $(document)[0].URL;
      let s_para = cur_url.match(/&s=([^& ]*)/);

      let s_value = this.page_size * (this.next_page_count - 1);
      if (s_para == null) {
        return cur_url + "&s=" + s_value;
      }
      else {
        return cur_url.replace(/&s=([^& ]*)/, "&s=" + s_value);
      }
    }

    getNextPage() {
      if ($('#next_page_iframe').length != 0) {
        $('#next_page_iframe').remove();
      }

      console.debug("next_url: ", this.next_page_url);

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

          console.debug("item_list", this.next_page_dom_list);
        });
      }, 3000);
    }

    /*
     * 供笔记识别部分调用的接口
     */
    filter(containerDivList, imgDivList, typeList) {
      this.filterDom(containerDivList, imgDivList, typeList);

    	// if (this.product_list == "") {
    	// 	console.debug("calling API to get product list ...");
      //
    	// 	// 获得当前页面商品排序方式
    	// 	//let sorts = $('li.sort');
      //
    	// 	this.requestForProductList();
      //
    	// 	// 等待异步API调用的返回结果
    	// 	setTimeout(() => {
    	// 		console.debug(this.product_list);
      //
    	// 		//this.filterDom(containerDivList, imgDivList, typeList);
    	// 	}, 1000);
    	// }
    	// else {
    	// 	// 已获取商品列表，直接过滤
    	// 	//this.filterDom(containerDivList, imgDivList, typeList);
    	// }
    }

    /*
     * 供识别模块进行调用
     * 根据识别出的大圈大叉的dom元素对页面进行过滤
     * 若无用于填补空白的商品列表，则调用API获取
     */
    filterDom(containerDivList, imgDivList, typeList) {
    	let page_style = this.getPageStyle();
      console.debug(containerDivList, imgDivList, typeList);

    	for (let i = 0; i < containerDivList.length; i++) {
    		let cur_item = containerDivList[i];
    		let cur_img = imgDivList[i];
    		let cur_type = typeList[i];

    		let cur_id = this.getProductIdFromImg(cur_img);
        console.debug("cur_id: " + cur_id);
    		if (cur_id == "")
    			continue;

    		// 大叉，黑名单，直接删除商品，并填补造成的页面空缺
    		if (cur_type == this.SIGN_BLACK) {
    			this.updateItem(cur_item, cur_id);

    			if ($('#' + cur_id).length > 0) {
    				$('#' + cur_id).remove();
    				this.BLACK_LIST.push(cur_id);

    				this.fillInBlank(page_style);
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
        if (this.item_index == this.page_size) {
          this.getNextPage();
          setTimeout(() => {
            this.fillInBlank(page_style);
          }, 5000);

          break;
        }
        else {
          console.debug("item index: " + this.item_index);
          let product = this.next_page_dom_list.eq(this.item_index);
          this.item_index++;
      		console.debug("product", product);

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
     * 利用API结果填补页面空缺
     */
    fillInBlankByAPI(page_style) {
    	// 当前商品列表最后一个元素，将新商品添加在其后即可
    	let lastProduct = this.getLastProduct(page_style);

    	let newProduct = this.getNewProductByAPI();

    	// 替换商品信息
    	let item = lastProduct.clone();
    	if (page_style == this.GRID_STYLE) {
    		let pic_inner_box = item.children().eq(0).children().children();
    		let icon_msg = item.children().eq(1).children();

    		// 删除“找同款”  “找相似”
    		pic_inner_box.eq(2).remove();
    		pic_inner_box.eq(1).remove();

    		// 替换商品图片和链接
    		let a = pic_inner_box.children().eq(0);
    		a[0].href = newProduct.item_url;
    		a[0].id = "J_Itemlist_PLink_" + newProduct.num_iid;
    		a[0].search = "?id=" + newProduct.num_iid;

    		let img = a.children().eq(0);
    		img[0].id = "J_Itemlist_Pic_" + newProduct.num_iid;
    		img[0].src = newProduct.pict_url;
    		img[0].alt = newProduct.title;

    		// 删除天猫，保险理赔，旺旺等信息
    		icon_msg.eq(3).remove();

    		// 替换价格信息
    		let price = icon_msg.eq(0).children().eq(0).children().eq(1);
    		price[0].textContent = newProduct.zk_final_price;

    		// 替换销量信息
    		let volume = icon_msg.eq(0).children().eq(1);
    		volume[0].textContent = newProduct.volume + "人付款";

    		// 替换标题信息
    		let title = icon_msg.eq(1).children();
    		title[0].search = "?id=" + newProduct.num_iid;
    		title[0].id = "J_Itemlist_TLink_" + newProduct.num_iid;
    		title[0].href = newProduct.item_url;
    		title[0].textContent = newProduct.title;

    		// 替换店铺信息
    		let shop = icon_msg.eq(2).children().eq(0).children();
    		shop[0].search = "?user_number_id=" + newProduct.seller_id;
    		shop[0].href = "https://store.taobao.com/shop/view_shop.htm?user_number_id=" + newProduct.seller_id;
    		let shop_name = shop.children().eq(1);
    		shop_name[0].textContent = newProduct.nick;
    		shop.bind("mouseover",(e) => {
            	return false;
        	});

    		// 替换地址信息
    		let location = icon_msg.eq(2).children().eq(1);
    		location[0].textContent = newProduct.provcity;

    		lastProduct.after(item);
    	}
    	else {
    		let pic_box = item.children().eq(0).children().children();

    		// 删除“找同款”  “找相似”
    		pic_box.children().eq(2).remove();
    		pic_box.children().eq(1).remove();

    		// 替换商品图片和链接
    		let a = pic_box.children().children().eq(0);
    		a[0].href = newProduct.item_url;
    		a[0].id = "J_Itemlist_PLink_" + newProduct.num_iid;
    		a[0].search = "?id=" + newProduct.num_iid;

    		let img = a.children().eq(0);
    		img[0].id = "J_Itemlist_Pic_" + newProduct.num_iid;
    		img[0].src = newProduct.pict_url;
    		img[0].alt = newProduct.title;
    		img.bind("mouseover",(e) => {
            	return false;
        	});

    		item.children().eq(2).children().eq(1).remove();

    		// 替换价格信息
    		let price = item.children().eq(2).children().eq(0);
    		// 删除包邮信息
    		price.children().eq(1).remove();
    		price.children().eq(0).children()[1].textContent = newProduct.zk_final_price;

    		// 删除评论数信息
    		item.children().eq(3).children().eq(1).remove();

    		// 替换销量信息
    		let volume = item.children().eq(3).children();
    		volume[0].textContent = newProduct.volume + "人付款";

    		let icon_msg = item.children().eq(1).children();

    		// 替换标题信息
    		let title = icon_msg.eq(0).children();
    		title[0].search = "?id=" + newProduct.num_iid;
    		title[0].id = "J_Itemlist_TLink_" + newProduct.num_iid;
    		title[0].href = newProduct.item_url;
    		title[0].textContent = newProduct.title;

    		// 替换店铺信息
    		let shop = icon_msg.eq(2).children().eq(0).children();
    		shop[0].search = "?user_number_id=" + newProduct.seller_id;
    		shop[0].href = "https://store.taobao.com/shop/view_shop.htm?user_number_id=" + newProduct.seller_id;
    		let shop_name = shop.children().eq(1);
    		shop_name[0].textContent = newProduct.nick;
    		shop.bind("mouseover",(e) => {
            	return false;
        	});

    		// 替换地址信息
    		let location = icon_msg.eq(2).children().eq(2);
    		location[0].textContent = newProduct.provcity;

    		// 删除运费险等信息
    		item.children().eq(4).remove();
    		icon_msg.eq(1).children().remove();
    		icon_msg.eq(2).children().eq(1).children().remove();

    		lastProduct.after(item);
    	}
    }

    /*
     * 从API获得的商品列表中获取填充的下一个商品
     */
    getNewProductByAPI() {
    	while (true) {
    		let product = this.product_list.shift();
    		console.debug("product", product);

    		// 商品列表为空，调用API取下一页商品
    		if (product == undefined) {
    			this.PAGE_NO++;
    			this.requestForProductList();

    			// 等待异步API调用的返回结果
    			setTimeout(() => {
    				//console.debug(this.product_list);
    				product = this.product_list.shift();

    				if (this.checkProduct(product.num_iid)) {
    					return product;
    				}
    			}, 1000);
    		}
    		else {
    			if (this.checkProduct(product.num_iid)) {
    				return product;
    			}
    		}
    	}
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
    		console.log(response.result);
    	});
    }

    /*
     * 与background页面通信，发送请求以根据当前页面URL获取完整商品列表
     */
    requestForProductList() {
    	// 获得当前页面URL
    	let page_url = $(document)[0].URL;
    	console.debug("page_url", page_url);

    	chrome.runtime.sendMessage({command: "getProductList", url: page_url, page_no: this.PAGE_NO}, (response) => {

    	});
    }
}
