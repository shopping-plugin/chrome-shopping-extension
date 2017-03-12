export default class CouldServce {
    constructor() {

    }

    /**
     * 初始化一个事务
     * @param affairId 每次开始一个事务请根据当前的时间戳或者其他信息生成一个唯一的affairId
     * @param url 网页的url
     * @param keyword 关键词是一个数组 例如：["大衣","黑色","..."]
     */
    beginNewAffair(affairId, url, keyword) {
        var data = {
            "affairId": affairId,
            "url": url,
            "keyword": keyword
        }
        chrome.runtime.sendMessage({
            "command": "beginNewAffair",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 添加黑名单项
     * @param affairId
     * @param itemIds ['321332', '3321312'] 商品Id列表
     */
    addBlackListItem(affairId, itemIds) {
        var data = {
            "affairId": affairId,
            "itemIds": itemIds
        }
        chrome.runtime.sendMessage({
            "command": "addBlackListItem",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 删除黑名单项
     * @param affairId
     * @param itemIds
     */
    deleteBlackListItem(affairId, itemIds) {
        var data = {
            "affairId": affairId,
            "itemIds": itemIds
        }
        chrome.runtime.sendMessage({
            "command": "deleteBlackListItem",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 添加白名单项
     * @param affairId
     * @param itemIds
     */
    addWhiteListItem(affairId, itemIds) {
        var data = {
            "affairId": affairId,
            "itemIds": itemIds
        }
        chrome.runtime.sendMessage({
            "command": "addWhiteListItem",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 删除白名单项目
     * @param affairId
     * @param itemIds
     */
    deleteWhiteListItem(affairId, itemIds) {
        var data = {
            "affairId": affairId,
            "itemIds": itemIds
        }
        chrome.runtime.sendMessage({
            "command": "deleteWhiteListItem",
            "data": data
        }, function (res) {

        });
    }


    /**
     * 添加关键词
     * @param affairId
     * @param keyword  ['高领', '...'] 关键词列表
     * @param url
     */
    addKeyword(affairId, keyword, url) {
        var data = {
            "affairId": affairId,
            "keyword": keyword,
            "url": url
        }
        chrome.runtime.sendMessage({
            "command": "addKeyword",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 删除关键词
     * @param affairId
     * @param keyword
     * @param url
     */
    deleteKeyword(affairId, keyword, url) {
        var data = {
            "affairId": affairId,
            "keyword": keyword,
            "url": url
        }
        chrome.runtime.sendMessage({
            "command": "deleteKeyword",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 添加筛选条件
     * @param affairId
     * @param filters  筛选条件数组 ["长款", "..."]
     */
    addFilter(affairId, filters){
        var data={
            "affairId": affairId,
            "filters": filters
        }
        chrome.runtime.sendMessage({
            "command": "addFilter",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 删除筛选条件
     * @param affairId
     * @param filters
     */
    deleteFilter(affairId, filters){
        var data={
            "affairId": affairId,
            "filters": filters
        }
        chrome.runtime.sendMessage({
            "command": "deleteFilter",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 点击上一页
     * @param affairId
     * @param url
     */
    nextPage(affairId, url) {
        var data = {
            "affairId": affairId,
            "url": url
        }
        chrome.runtime.sendMessage({
            "command": "nextPage",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 点击下一页
     * @param affairId
     * @param url
     */
    previousPage(affairId, url) {
        var data = {
            "affairId": affairId,
            "url": url
        }
        chrome.runtime.sendMessage({
            "command": "previousPage",
            "data": data
        }, function (res) {

        });
    }

    /**
     * 根据url获得相应的事务信息
     * @param url
     * @param callback
     */
    getInfoByUrl(url, callback){
        var data = {
            "url": url
        }
        chrome.runtime.sendMessage({
            "command": "getInfoByUrl",
            "data": data
        }, function (res) {
            callback(res);//如果返回为{}说明没有相应的事务信息 如果返回的不是{}则可以获取其中的白名单和黑名单等信息
        });
    }

    /**
     * 用户提交低昂丹
     * @param itemIds 购物车中的物品Id列表
     */
    commitOrder(itemIds){
        var data = {
            "itemIds" : itemIds
        }
        chrome.runtime.sendMessage({
            "command": "commitOrder",
            "data": data
        }, function (res) {
        });
    }
}