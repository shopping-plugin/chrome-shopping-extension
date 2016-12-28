/**
 * 提供底层的http通讯服务
 */

var http = {
    'get': null,
    'post': null,
    'put': null
};

!function(){
    /**
     * 获取文件的文本内容
     * @param  {String}   token    token
     * @param  {String}   fileId   文件id
     * @param  {Function} callback callback(err, text)
     */
    http.get = function(token, fileId, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            if(this.readyState !== 4 || this.status !== 200 )
                return callback(new Error('GET请求异常:' + this.responseText));

            // 返回原始文本
            callback(null, this.responseText);
        };

        var url = 'https://www.googleapis.com/drive/v2/files/';
        if(fileId)
            url = url + fileId+'?alt=media';

        xhr.open('get', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token); // 认证字段
        xhr.send();
    };

    http.post = function(token, package, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            if(this.readyState !== 4 || this.status !== 200 )
                return callback(new Error('POST请求异常:' + this.responseText));

            // 返回原始文本
            callback(null, this.responseText);
        };

        var mode = package.mode;
        var data = package.data;
        var metadata = package.metadata;

        // POST url设定
        var url = 'https://www.googleapis.com/upload/drive/v2/files';
        if(mode == 'folder') // 文件夹上传使用的是另一个url
            url = 'https://www.googleapis.com/drive/v2/files';

        // 针对不同的上传模式决定数据的组织方式与上传参数
        var content = null;
        if(mode == 'multipart'){
            url  = url + '?uploadType=multipart';
            xhr.open('post', url);

            var boundary = "abrownquickfoxjumpsoveralazydog";
            xhr.setRequestHeader('Content-type', 'multipart/related; boundary='+boundary);
            content = buildMultipartContent(metadata, data, boundary);
        }else{
            // 如果是media就加个post后缀，否则不管
            if(mode == 'media') url = url + '?uploadType=media';

            xhr.open('post', url);
            xhr.setRequestHeader('Content-type', 'application/json');
            content = JSON.stringify(data);
        }

        xhr.setRequestHeader('Authorization', 'Bearer ' + token); // 认证字段
        xhr.send(content);
    };

    http.put = function(token, package, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            if(this.readyState !== 4 || this.status !== 200 )
                return callback(new Error('PUT请求异常:' + this.responseText));

            // 返回原始文本
            callback(null, this.responseText);
        };

        var fileId = package.fileId;
        var data = package.data;

        var url = 'https://www.googleapis.com/upload/drive/v2/files/' + fileId;
        var content = JSON.stringify(data);

        xhr.open('put', url);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token); // 认证字段
        xhr.send(content);
    };

    /**
     * 将要传送的文件转化成能放在multipart的post请求里面的字符串
     * @param  {Object} metadata 传给google drive的文件元数据
     * @param  {Object} data json文件本体的js对象
     * @param  {String} boundary multipart方式所需要的分界符
     * @return {String}          拼接好的响应字符串
     */
    function buildMultipartContent(metadata, data, boundary){
        var parts = [];
    	parts.push('--' + boundary);
    	parts.push('Content-Type: application/json; charset=UTF-8');
    	parts.push('');
    	parts.push(JSON.stringify(metadata));
    	parts.push('--' + boundary);
    	parts.push('Content-Type: application/json; charset=UTF-8');
    	parts.push('');
    	parts.push(JSON.stringify(data));
    	parts.push('--' + boundary + '--');

        return parts.join('\r\n');
    }
}();
