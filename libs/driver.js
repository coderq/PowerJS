/**
 * Created by CoderQ on 2015/3/18.
 */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

module.exports = function (callback, scope) {

    if (C.middleware) {
        var middleware_path = path.join(__dirname, '../middlewares/');
        C.middleware.forEach(function (item, i, ary) {
            var middleware = middleware_path + item + '.js';
            if (fs.existsSync(middleware)) {
                require(middleware)(app);
            }
        });
    }

    app.set('env', C.env);

    app.listen(C.port, function() {
        callback && callback.call(scope, {
            result: 'success',
            port: C.port
        })
    });
};