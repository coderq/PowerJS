var fs = require('fs');

module.exports = {
    /**
     * 判断是否为路径
     * @param dir <string> 路径
     * @return <boolean>
     */
    isDir: function (dir) {
        try{
            return fs.lstatSync(dir).isDirectory();
        } catch (e) {
            return false;
        }
    },
    /**
     * 创建文件夹
     * @param dir
     * @param mode
     * @returns {*}
     */
    mkDir: function (dir, mode) {
        try {
            fs.mkdirSync(dir, mode);
            return this.isDir(dir);
        } catch (e) {
            return false;
        }
    },
    /**
     * 判断是否为文件
     * @param file <string> 文件名
     * @return <boolean>
     */
    isFile: function (file) {
        try{
            return fs.existsSync(file) && fs.lstatSync(file).isFile();
        } catch (e) {
            return false;
        }
    },
    /**
     * 列出文件夹下所有文件
     * @param dir <string> 文件夹地址
     * @param callback <function> 回调函数
     * @param scope <object> 回调函数引用对象
     * @param <array> 文件列表
     */
    listFolder: function (dir, callback, scope) {
        var args = Array.prototype.slice.call(arguments, 3);
        fs.exists(dir, function(exists){
            if (!exists) {
                args.unshift(1);
                callback && callback.apply(scope, args);
            } else {
                fs.readdir(dir, function(err, files){
                    if (err) throw err;
                    callback && callback.call(scope, files);
                });
            }
        })
    },
    /**
     * 读取文件
     * @param file <string> 文件名称
     * @param opts <object>
     */
    readFile: function (file, opts) {
        try {
            return fs.readFileSync(file, opts);
        } catch (e) {
            return null;
        }
    },
    /**
     * 写入文件
     * @param path
     * @param file
     * @param opts
     * @returns {*}
     */
    writeFile: function (path, file, opts) {
        try {
            return fs.writeFileSync(path, file, opts);
        } catch (e) {
            return false;
        }
    },
    /**
     * 复制文件
     * @param from <string> 源文件地址
     * @param to <string> 目的文件地址
     */
    copyFile: function(from, to){
        var is = fs.createReadStream(from)
            , os = fs.createWriteStream(to);
        try {
            is.pipe(os);
            return true;
        } catch (e) {
            return false;
        }
    },
    /**
     * 复制文件
     * @param from <string> 源文件地址
     * @param to <string> 目的文件地址
     */
    moveFile: function(from, to){
        if (!from || !to) {
            return false;
        }

        fs.renameSync(from, to);
        return true;
    },
    /**
     * 删除文件
     * @param file
     * @returns {*}
     */
    removeFile: function (file) {
        try {
            return fs.unlinkSync(file);
        } catch (e) {
            return false;
        }
    }
};