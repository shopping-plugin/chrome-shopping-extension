/**
 * 云端存储服务模块
 */

// 全局cloud命名空间
var cloud = {
    'gdtoken': null,
    'file': null,
    'sync': null,
    'configuration': null,
    'appendLog': null
};


// 立即执行函数
!function () {
    // 在google drive上存储的根目录名
    var ROOT = 'shopping_plugin_cloud';
    var OPERATION_LOG_FILE = 'operation_log';

    // 内部存储的token值
    var token = '';
    // notecloud是否在本地模拟
    var isLocal = false;
    // 自动同步的时间间隔
    var autoSyncInterval = null;

    /**
     * 向云端追加操作日志
     * @param data 需要追加的信息
     * @param callback
     */
    cloud.appendLog = function (appendData, callback) {
        //TODO isLocal
        identify(function () {
            console.debug('准备根目录...');
            prepareDir(token, ROOT, null, function (err, rootId) { // 这里的root指ROOT值的目录
                if (err) return callback(err);
                console.debug('准备文件数据目录...');
                prepareFile(token, OPERATION_LOG_FILE, rootId, function (err, fileId, fileData) {
                    if (err) return callback(err);

                    var file = new NoteFile(fileData);//使用云端的数据生成file
                    file.__fileId__ = fileId;
                    file.__merge__(appendData);//向file中加入新的log信息

                    gdapi.update(token, {//更新文件信息
                        'fileId': fileId,
                        'data': file
                    }, function (err, fileId) {
                        if(err){
                            callback(err);
                        }
                    });
                    callback(null, file);
                });

            });
        });

    }


    /**
     * 使用指定的url获取一个对应于fileName的存储对象
     * 如果云端没有这个页面的文件夹，则为其创建文件夹。否则加载文件夹中名为fileName文件的内容
     * 最后返回该存储对象
     * @param  {string}   url      url,对应于根目录下的一个文件夹
     * @param  {string}   fileName 在url文件夹下的数据文件名称
     * @param  {Function} callback callback(err, file)
     */
    var file = cloud.file = function (url, fileName, callback) {
        // 本地
        if (isLocal) return getLocalFile(url, fileName, callback);
        // 云端
        identify(function () {
            getCloudFile(url, fileName, callback);
        });
    };

    /**
     * 同步指定的页面数据
     * @param  {object}   file     要同步的页面数据
     * @param  {Function} callback callback(err, fileId)
     */
    var sync = cloud.sync = function (file, callback) {
        // 本地
        if (isLocal) return syncLocalFile(file, callback);
        // 云端
        identify(function () {
            syncCloudFile(file, callback);
        });
    };

    /**
     * 配置cloud
     * @param  {object} config 配置选项
     */
    var configuration = cloud.configuration = function (config) {
        // 读取配置选项
        var local = config.local;
        var interval = config.autoSyncInterval;

        // 设置对应的数值
        if (local) isLocal = local;
        if (interval) autoSyncInterval = interval;
    };

    /**
     * 设置或取出google drive的token
     * @param  {String} t token字符串
     */
    var gdtoken = cloud.gdtoken = function (t) {
        // 如果没有传入参数则返回当前token
        if (!t) return token;
        token = t;
    };

    // 身份验证，获取并设置token
    function identify(callback) {
        chrome.identity.getAuthToken({'interactive': true}, function (tk) {
            token = tk;
            callback();
        });
    }

    // 获取云端页面数据
    function getCloudFile(url, fileName, callback) {
        console.debug('准备根目录...');
        prepareDir(token, ROOT, null, function (err, rootId) { // 这里的root指ROOT值的目录
            if (err) return callback(err);
            console.debug('准备页面目录...');
            prepareDir(token, namify(url), rootId, function (err, fileDirId) {
                console.debug('准备文件数据...');
                prepareFile(token, fileName, fileDirId, function (err, fileId, fileData) {
                    if (err) return callback(err);

                    var file = new NoteFile();
                    file.__fileId__ = fileId;
                    file.__merge__(fileData);

                    callback(null, file);
                });
            });
        });
    }

    // 获取本地模拟页面数据
    // 注意由于chrome的限制，最大存储容量应该限制在5MB以内，因此请不要将file对象修改得太大，否则回存得时候可能会出现问题
    function getLocalFile(url, fileName, callback) {
        var localId = namify(url);
        // 有必要的话进行初始化
        if (!chrome.storage.local[localId]) {
            var local = chrome.storage.local[localId] = {};
            local[fileName] = {};
        } else if (!chrome.storage.local[localId][fileName]) {
            chrome.storage.local[localId][fileName] = {};
        }

        var localFile = chrome.storage.local[localId][fileName];
        var file = new NoteFile();

        // 设置localId，同步的时候要用到
        file.__localId__ = localId;
        file.__fileName__ = fileName;
        file.__merge__(localFile);

        callback(null, file);
    }

    // 同步云端数据页面
    function syncCloudFile(file, callback) {
        // 包装Page对象
        file = new NoteFile(file);

        var fileId = file.__fileId__;
        if (!fileId) return callback(new Error('file对象中找不到fileId'));

        console.debug("准备对%s进行同步...", fileId);
        gdapi.get(token, fileId, function (err, fileData) {
            if (err) return callback(err);

            gdapi.update(token, {
                'fileId': fileId,
                'data': file
            }, function (err, fileId) {
                callback(err, fileId);
            });
        });
    }

    // 在本地同步页面数据
    function syncLocalFile(file, callback) {
        file = new NoteFile(file);

        var localId = file.__localId__;
        var fileName = file.__fileName__;
        if (!localId || !fileName)
            return callback(new Error("本地同步时找不到localId或fileName"));

        console.debug("准备对%s进行同步...", localId);
        chrome.storage.local[localId][fileName] = file;
        callback(null, localId);
    }

    /**
     * 准备指定文件
     * @param  {[type]}   token    token
     * @param  {[type]}   fileName 要准备（创建）的文件名称
     * @param  {[type]}   parentId 在指定父目录下创建文件，默认为root
     * @param  {Function} callback callback(err, fileId, fileData)
     */
    function prepareFile(token, fileName, parentId, callback) {
        parentId = parentId || 'root';

        // 先搜索指定文件是否存在
        gdapi.search(token, fileName, parentId, function (err, fileId) {
            if (err) return callback(err);
            // 如果文件不存在则创建
            if (fileId == null) {
                console.debug('文件%s不存在，创建...', fileName);
                gdapi.upload(token, {
                    'metadata': {
                        'title': fileName,
                        'parents': [{'id': parentId}]
                    },
                    'data': {}, // 创建一个空文本
                }, function (err, newFileId) {
                    if (err) return callback(err);
                    callback(null, newFileId, {});
                });
            }
            // 如果存在则获取该文件，返回
            else {
                console.debug('文件%s(%s)已经存在，获取中...', fileName, fileId);
                gdapi.get(token, fileId, function (err, fileData) {
                    callback(null, fileId, fileData);
                });
            }
        });
    }

    /**
     * 准备指定目录，返回目录的id
     * 如果目录不存在则创建一个
     * @param  {String}   token         token
     * @param  {String}   dirName       要准备（创建）的目录名称
     * @param  {String}   parentId      在指定父目录下创建目录，默认为root
     * @param  {Function} callback      callback(err, fileId)
     */
    function prepareDir(token, dirName, parentId, callback) {
        parentId = parentId || 'root';
        // 先搜索指定目录是否存在
        gdapi.search(token, dirName, parentId, function (err, fileId) {
            if (err) return callback(err);
            // 如果目录不存在则创建
            if (fileId === null) {
                gdapi.createFolder(token, dirName, parentId, function (err, fileId) {
                    if (err) return callback(err);
                    callback(null, fileId);
                });
            }
            // 否则准备完成，返回
            else {
                callback(null, fileId);
            }
        });
    }

    /**
     * 将url转化为合法的文件名
     * @param  {String} url url地址字符串
     * @return {String}     文件名
     */
    function namify(url) {
        // 去掉头部http
        var matches = url.match(/(?:http(?:s)?:\/\/)?(.*)$/);
        var name = null;
        if (matches && matches.length > 1) {
            name = matches[1];
        } else {
            name = url;
        }

        // 去掉所有的奇怪字符
        return name.replace(/[^0-9a-zA-Z]/g, '')
    }
}();
