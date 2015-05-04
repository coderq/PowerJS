/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

/**
 * md5
 *
 * @param string
 * @returns {*}
 */
var md5 = function (string, type) {
    var crypto = require('crypto');
    var hash = crypto.createHash('md5');
    var is_file = type & md5.file;

    if (is_file) {
        var fs = require('fs');
        if (!fs.existsSync(string) || !fs.openSync(string)) {
            throw Error('无效的文件');
        }
        string = fs.readFileSync(string);
    }
    hash.update(string);
    return hash.digest('hex');
};
md5.string = 0;
md5.file = 1;

/**
 * base64
 *
 * @param string
 * @param decode
 * @returns {string}
 */
var base64 = function (string, decode) {
    var buffer = decode ? new Buffer(string, 'base64') : new Buffer(string);
    return decode ? buffer.toString() : buffer.toString('base64');
};
base64.encode = 0;
base64.decode = 1;

/**
 * sha1
 *
 * @param string
 * @returns {string}
 */
var sha1 = function (string) {
    var crypto = require('crypto');
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('hex');
};

module.exports = {
    md5: md5,
    base64: base64,
    sha1: sha1
};