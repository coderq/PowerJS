/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

var favicon = require('serve-favicon');

module.exports = function (app) {
    if (!C.favicon) {
        throw '缺少FAVICON相关属性配置';
    }
    var favicon = require('serve-favicon');

    app.use(favicon(C.favicon));
};