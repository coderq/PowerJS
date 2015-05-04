/**
 * Created by CoderQ on 2015/3/17.
 */
"use strict";

var defaults = require('./config');
var util = require('./libs/util');
var db = require('./libs/db');
var controller = require('./libs/controller');
var mongo_model = require('./libs/mongo.model');
var mysql_model = require('./libs/mysql.model');
var driver = require('./libs/driver');

module.exports = {
    mongodb: (function () {
        try {
            return require('mongodb');
        } catch (e) {
            return undefined;
        }
    })(),
    mysql: (function () {
        try {
            return require('mysql');
        } catch (e) {
            return undefined;
        }
    })(),
    controller: controller,
    model: {
        mongo: mongo_model,
        mysql: mysql_model
    },
    run: function (options, callback, scope) {
        options = options || {};

        // 配置信息
        global.C = util.extend(defaults, options, util.extend.deepExtend);

        // 通用函数
        global.U = util;
        if (C.util) {
            C.util.forEach(function (pck) {
                U.extend(U, require(pck), U.extend.replaceFirst);
            });
        }

        // 数据库
        global.D = {};
        db(D, C.db);

        driver(callback, scope);
    }
};