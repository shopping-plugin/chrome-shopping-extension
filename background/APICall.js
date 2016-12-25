/*
 * 调用淘宝API
 */

var product_list = "";
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 	// 获取商品列表
 	if (request.command == "getProductList") {
 		var page_url = request.url;
 		getProductList(page_url, request.page_no);
 	}
});


/*
 * 将页面URL转换为淘宝API调用，获取完整商品列表
 */
function getProductList(page_url, page_no) {
	var q_para = page_url.match(/q=([^&]*)&/)[1];
	q_para = getCharFromUtf8(q_para);
	console.debug(q_para);

	var xhr = new XMLHttpRequest();
	var query_str = "http://gw.api.taobao.com/router/rest?";
	query_str += getRequestParaStr(q_para, page_no);
	console.debug(query_str);
	
	xhr.open("GET", query_str);
	xhr.send(null);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			product_list = xhr.responseText;
			console.debug(product_list);

			// 将异步获取的商品列表传给contentScript
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {command: "product_list", list: product_list}, function(response) {
					//console.log(response.farewell);
				});
			});
		}
	}
}

/*
 * 获得POST请求的参数
 */
function getRequestParaStr(q, page_no) {
	// 参数列表
	var timestamp = new Date().Format("yyyy-MM-dd hh:mm:ss");
	var field_list = "num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick";//"num_iid,title,nick,pic_url,cid,price,type,post_fee,location,score,volume,has_discount,num,is_prepay,promoted_service,category_id,count,ww_status,detail_url";
	
	var para_map = {};
	para_map["method"] = "taobao.tbk.item.get";
	para_map["app_key"] = 23567718;
	para_map["partner_id"] = "top-apitools";
	para_map["sign_method"] = "md5";
	para_map["timestamp"] = timestamp;
	para_map["format"] = "json";
	para_map["v"] = "2.0";
	para_map["fields"] = field_list;
	para_map["q"] = q;
	para_map["page_size"] = 100;
	para_map["page_no"] = page_no;

	// 第一步：把字典按Key的字母顺序排序
	var a = [];
	for (var key in para_map) {
		a[a.length] = key;
	}
	a.sort();
	var sorted_map = {};
	for (var i = 0; i < a.length; i++) {
		var key = a[i];
		sorted_map[key] = para_map[key];
	}
	console.debug(sorted_map);

    // 第二步：把所有参数名和参数值串在一起
    var app_secret = "272eb7e611222b3800631440986c1f8e";
    var query = "";
    query += app_secret;
    for (var key in sorted_map) {
    	query = query + key + sorted_map[key];
    }
    query += app_secret;
    console.debug(query);

    // 第三步：使用MD5/HMAC加密，并将结果转化为大写的十六进制
	var hash = CryptoJS.MD5(query);
	console.debug(hash);
	var hex_result = hash.toString(CryptoJS.enc.Hex).toUpperCase();
	console.debug(hex_result);

	// 组装HTTP请求参数
	var para_str = "";
    for (var key in sorted_map) {
    	para_str = para_str + key + "=" + sorted_map[key] + "&";
    }
    para_str = para_str + "sign=" + hex_result;
    para_str = encodeURI(para_str);
    console.debug(para_str);

    return para_str;
}

//将URL中的UTF-8字符串转成中文字符串  
function getCharFromUtf8(str) {  
    var cstr = "";  
    var nOffset = 0;  
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
        cstr += utf8ToChar(str.substr(0, 9));  
        str = str.substr(9, str.length - 9);  
        nOffset = str.indexOf("%e");  
    }  
    return cstr + str;  
} 

//将编码转换成字符  
function utf8ToChar(str) {  
    var iCode, iCode1, iCode2;  
    iCode = parseInt("0x" + str.substr(1, 2));  
    iCode1 = parseInt("0x" + str.substr(4, 2));  
    iCode2 = parseInt("0x" + str.substr(7, 2));  
    return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));  
}

/*
 * 对日期进行格式化
 */
Date.prototype.Format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	}

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	}

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 

	return format; 
}
