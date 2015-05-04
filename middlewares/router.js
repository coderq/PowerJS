/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

var express = require('express');
var fs = require('fs');

var router = function (req, res, next) {
    var url_info = req.params[0].match(/(\/service)?\/([^\/]*)(\/([^\/]*)(\/([^\/]*))?)?/);
    var is_service = !!url_info[1];
    var pkg = url_info[2] || C.router.default.package;
    var clr = (url_info[4] || C.router.default.controller) + (C.router.tag.controller ? '.controller' : '');
    var act = (url_info[6] || C.router.default.action) + (is_service ? (C.router.tag.service ? 'Service' : '') : (C.router.tag.action ? 'Action' : ''));

    if (!pkg) throw '未知的包';
    if (!clr) throw '未知的控制器';
    if (!act) throw '未知的执行方法';

    var cf = C.root + '/apps/' + pkg + '/controller/' + clr + '.js';
    var sf = C.root + '/static/' + pkg;
    var uf = C.root + '/static/404.html';
    var ef = C.root + '/static/500.html';

    try {
        if (fs.existsSync(cf)) {
            var controller = new (require(cf))(req, res);
            if (!controller.__sent) controller[act]();
        } else if (fs.existsSync(sf)) {
            res.end(fs.readFileSync(sf));
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            fs.existsSync(uf) ? res.end(fs.readFileSync(uf)) : res.end();
        }
    } catch (e) {
        if (C.env == 'develop') {
            throw e;
        } else {
            L.debug(e);
            res.writeHead(500, {"Content-Type": "text/html"});
            fs.existsSync(ef) ? res.end(fs.readFileSync(ef)) : res.end();
        }
    }
};

module.exports = function (app) {
    if (!C.router) {
        throw '缺少ROUTER相关属性配置';
    }

    app.all('*', router);
};