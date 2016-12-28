/**
 * 提供访问Google API的接口
 */

var gdapi = {
    'list': null,
    'get': null,
    'search': null,
    'upload': null,
    'update': null,
    'createFolder': null
};

!function(){
    /**
     * 获取所有文件列表
     * @param  {String}   token    token
     * @param  {Function} callback callback(err, files)
     */
    var list = gdapi.list = function(token, callback){
        http.get(token, null, function(err, text){
            if(err) return callback(err);

            var result = JSON.parse(text);
            if( result && result.items ){
                return callback(null, result.items);
            }

            callback(new Error('list操作返回异常：', result));
        });
    }

    /**
    * 搜索指定名称的文件（夹）
    * @param  {String}   token    token
    * @param  {String}   fileName 要搜索的文件名
    * @param  {String}   parentId 指定其父目录，默认root
    * @param  {Function} callback callback(err, fileId)
    * @return {[type]}            [description]
    */
    var search = gdapi.search = function(token, fileName, parentId, callback){
        parentId = parentId || 'root';
        // 这里简单地使用list全遍历一遍
        // 如果有需要可以改为使用专门的search API
        list(token, function(err, files){
            if(err) return callback(err);

            for(var i in files){
                var file = files[i];
                for(var i in file.parents){
                    var parent = file.parents[i];
                    // 父目录对上且文件名相同才行
                    if( (parent.id === parentId || (parentId === 'root' && parent.isRoot))
                    && file.title === fileName ){
                        return callback(null, file.id);
                    }
                }
            }

            callback(null, null);
        });
    };

    /**
     * 创建目录
     * @param  {String}   token      token
     * @param  {String}   folderName 要创建的目录名称
     * @param  {String}   parentId   在指定父目录下创建目录
     * @param  {Function} callback   callback(err, fileId)
     * @return {[type]}              [description]
     */
    var createFolder = gdapi.createFolder = function(token, folderName, parentId, callback){
        http.post(token, {
            "mode": "folder",
            // 注意这里是创建文件夹，并没有元数据
            "data":{
                "title": folderName,
                "parents": [{"id":parentId}],
                "mimeType": "application/vnd.google-apps.folder"
            }
        }, function(err, text){
            if(err) return callback(err);
            callback(null, JSON.parse(text).id);
        });
    }

    /**
     * 根据文件id获取文件内容
     * @param  {String}   token    token
     * @param  {String}   fileId   文件id
     * @param  {Function} callback callback(err, fileObject)
     */
    var get = gdapi.get = function(token, fileId, callback){
        http.get(token, fileId, function(err, text){
            if(err) return callback(err);

            var result = (text === '')?{}:JSON.parse(text);
            // 由于返回的是文件文本，因此这里需要转成对应的js对象
            callback(null, result);
        });
    };

    /**
     * 上传文件
     * @param  {String}   token    token
     * @param  {Object}   package  要上传的文件的数据打包对象，可以包含metadata, data两种字段
     * @param  {Function} callback callback(err, fileId)
     */
    var upload = gdapi.upload = function(token, package, callback){
        var postObj = {};
        postObj.data = package.data;//实际数据json对象

        // 如果有元数据，那么模式设置为multipart
        // 上传模式目前有media和multipart
        if(package.metadata){
            postObj.metadata = package.metadata;
            postObj.mode = 'multipart';
        }else{
            postObj.mode = 'media'; // 否则就是简单的media
        }

        http.post(token, postObj, function(err, text){
            if(err) return callback(err);
            callback(null, JSON.parse(text).id);
        });
    };

    /**
     * 更新文件
     * @param  {String}   token    token
     * @param  {Object}   package  要更新的文件的数据打包对象, 必须包含fileId字段和data字段
     * @param  {Function} callback callback(err, fileId)
     */
    var update = gdapi.update = function(token, package, callback){
        if(!package.fileId) return callback(new Error('更新文件时找不到fileId'));

        var putObj = {};
        putObj.fileId = package.fileId;
        putObj.data = package.data; //实际数据json对象

        http.put(token, putObj, function(err, text){
            if(err) return callback(err);
            callback(null, JSON.parse(text).id);
        });
    };


}();
