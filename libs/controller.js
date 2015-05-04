/**
 * Created by CoderQ on 2015/3/18.
 */
"use strict";

/**
 * 控制器基类
 * @param req
 * @param res
 * @constructor
 */
var BaseController = function (req, res) {
    this.req = req;
    this.res = res;
    this.view = {C: C, U: U, Q: this.req.query};
    this.__cookies = [];
};

BaseController.prototype.cookie = function (key, value, expires, path, domain) {
    var cookie, k, v, e, p, d;
    if (U.isObject(key)) {
        for (var obj in key) {
            k = obj;
            if (U.isNull(key[obj])) {
                v = null;
            } else if (U.isObject(key[obj])) {
                v = key[obj].value;
                e = key[obj].expires;
                p = key[obj].path;
                d = key[obj].domain;
            } else {
                v = key[obj];
            }
            this.cookie(k, v, e, p, d);
        }
    } else if (U.isUndefined(value)) {
        return this.req.cookies[key];
    } else {
        expires = U.isNull(value) ? 0 : Date.now() + (expires || C.cookie.expires);

        cookie = U.format('{0}={1};', key, value);
        if (0 === expires || expires) cookie += U.format('expires={0};', new Date(expires).toGMTString());
        if (path) cookie += U.format('path={0};', path);
        if (domain) cookie += U.format('domain={0};', domain);

        this.__cookies.push(cookie);
    }
};

BaseController.prototype.session = function (key, value, expires) {
    if (U.isNull(key)) {
        this.req.session.destroy();
    } else if (U.isUndefined(value)) {
        return this.req.session[key];
    } else {
        this.req.session[key] = value;
        if (expires) {
            this.req.session.cookie.expires = new Date(Date.now() + expires);
        }
    }
};

BaseController.prototype.render = function (view, opts) {
    if (typeof view == 'object') {
        opts = view;
        view = undefined;
    }

    var _view = view;
    if (!_view) {
        var url_info = this.req.params[0].match(/(\/service)?\/([^\/]*)(\/([^\/]*)(\/([^\/]*))?)?/);
        var pkg = url_info[2] || C.router.default.package;
        var clr = url_info[4] || C.router.default.controller;
        var viw = (url_info[6] || C.router.default.action) + (C.router.tag.view ? '.view' : '');

        _view = clr + '/' + viw + '.' + C.engine.type;
    }
    _view = C.root + '/apps/' + pkg + '/view/' + C.theme + '/' + _view;
    if (!_view || !U.isFile(_view)) throw new Error('找不到视图文件');

    this.res.setHeader('Set-Cookie', this.__cookies);
    this.res.render(_view, opts ? U.extend(this.view, opts) : this.view);
    this.__sent = true;
};

BaseController.prototype.send = function (content, type) {
    this.res.setHeader('Set-Cookie', this.__cookies);

    type = type || 'json';
    switch (type) {
        case 'json':
            this.res.end(JSON.stringify(content));
            break;
        case 'string':
            this.res.end(String(content));
            break;
        default:
            throw Error('未知的输出类型');
    }
    this.__sent = true;
};

BaseController.prototype.redirect = function (url) {
    this.res.redirect(url);
    this.__sent = true;
};

BaseController.prototype.getClientIp = function () {
    return this.req.headers['x-forwarded-for'] ||
        this.req.connection.remoteAddress ||
        this.req.socket.remoteAddress ||
        this.req.connection.socket.remoteAddress;
};

module.exports = BaseController;