/**
 * file对象
 */

var NoteFile;

!function(){
    NoteFile = function(fileData){
        // 如果传入的已经是NoteFile对象，那么就直接返回本身
        if(fileData && fileData.constructor.toString().match(/NoteFile/)){
            return fileData;
        }

        // 云端关联的文件Id
        this.__localId__ = undefined;
        // 本地关联的id，这两个同时只会有一个有值
        this.__fileId__ = undefined;

        // 文件类型名
        this.__dataName__ = undefined;
        // 同步状态flag
        this.__isSyncing__ = false;

        // 如果有传入数据（且不是NoteFile对象），那么就用这个数据来构建NoteFile对象
        if(fileData && !fileData.constructor.toString().match(/NoteFile/)){
            for(var key in fileData){
                this[key] = fileData[key];
            }
        }
    };

    // 将另一个file对象合并到自己身上
    // 别人有自己没有则加上，否则忽略
    NoteFile.prototype.__merge__ = function(other){
        for(var key in other){
            if(!other.hasOwnProperty(key) // 继承属性
                || key.indexOf('__') >= 0 // 忽略元属性
                || this[key] !== undefined) // 自己有的属性
                    continue;

            this[key] = other[key];
        }
    };
}();
