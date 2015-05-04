/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

var fs = require('fs');
var log4js = require('log4js');

module.exports = function (app) {
    if (!C.root) {
        throw '未知的项目根目录';
    }
    var path = C.root + '/logs';
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    log4js.configure({
        appenders: [
            { type: 'console' },
            { type: 'dateFile', filename: 'logs/', "pattern": "yyyy-MM-dd.log", category: 'cheese', "alwaysIncludePattern": true }
        ]
    });
    global.L = log4js.getLogger('cheese');
    app.use(log4js.connectLogger(L, {level: log4js.levels.INFO}));
};