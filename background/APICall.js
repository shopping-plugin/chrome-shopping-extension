/*
 * 调用淘宝API
 */

var APP_KEY = 23567718;
var APP_SECRET = "272eb7e611222b3800631440986c1f8e";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 	if (request.command == "nlp") {
 		var word = request.word;
 		getNLPResult(word);
 	}
});

/*
 * 调用淘宝中文分词服务
 */
function getNLPResult(word) {
  var xhr = new XMLHttpRequest();
	var query_str = "http://gw.api.taobao.com/router/rest?";
	query_str += getNLPParaStr(word);
	console.debug(query_str);

	xhr.open("GET", query_str);
	xhr.send(null);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			result = xhr.responseText;
			console.debug(result);

			// 将异步获取的分词结果传给contentScript
			// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			// 	chrome.tabs.sendMessage(tabs[0].id, {command: "product_list", list: product_list}, function(response) {
			// 		//console.log(response.farewell);
			// 	});
			// });
		}
	}
}

function getNLPParaStr(word) {
	// 参数列表
	var timestamp = new Date().Format("yyyy-MM-dd hh:mm:ss");

	var para_map = {};
  // public para
	para_map["method"] = "taobao.nlp.word";
	para_map["app_key"] = APP_KEY;
	para_map["partner_id"] = "top-apitools";
	para_map["sign_method"] = "md5";
	para_map["timestamp"] = timestamp;
	para_map["format"] = "json";
	para_map["v"] = "2.0";
  // request para
  para_map["w_type"] = 1;
  para_map["text"] = "{id: 123, content: " + word + ", type: 1}";

  var sorted_map = sortMap(para_map);
  var query = concatPara(sorted_map);
	var hex_result = sign(query);
  return formParaStr(sorted_map, hex_result);
}

/*
 * 第一步：把字典按Key的字母顺序排序
 */
function sortMap(para_map) {
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

  return sorted_map;
}

/*
 * 第二步：把所有参数名和参数值串在一起
 */
function concatPara(sorted_map) {
  var query = "";
  query += APP_SECRET;

  for (var key in sorted_map) {
    var value = sorted_map[key];
    query = query + key + value;
  }

  query += APP_SECRET;

  return query;
}

/*
 * 第三步：使用MD5/HMAC加密，并将结果转化为大写的十六进制
 */
function sign(query) {
  var hash = CryptoJS.MD5(query);
	var hex_result = hash.toString(CryptoJS.enc.Hex).toUpperCase();

  return hex_result;
}

/*
 * 第四步，组装HTTP请求参数
 */
function formParaStr(sorted_map, hex_result) {
  var para_str = "";
  for (var key in sorted_map) {
    var value = sorted_map[key];
  	para_str = para_str + key + "=" + value + "&";
  }
  para_str = para_str + "sign=" + hex_result;
  para_str = encodeURI(para_str);

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
