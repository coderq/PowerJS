/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

var fs = require('fs');
var express = require('express');

module.exports = function (app) {
    if(!fs.existsSync(C.root + '/static')) {
        fs.mkdirSync(C.root + '/static');
    }
    app.use('/static', express.static(C.root + '/static'));
    var dirs = fs.readdirSync(C.root + '/apps');
    dirs.forEach(function (dir, i, ary) {
        app.use('/apps/' + dir + '/static', express.static(C.root + '/apps' + '/' + dir + '/static'));
    });
};