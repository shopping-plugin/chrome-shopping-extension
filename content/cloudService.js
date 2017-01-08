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
}