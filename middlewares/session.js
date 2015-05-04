/**
 * Created by CoderQ on 2015/3/18.
 */
"use strict";

var session = require('express-session');

module.exports = function (app) {
    C.session = C.session || {};

    var store, link;
    switch (C.session.store && C.db[C.session.store].type) {
        case undefined:
            app.use(session({
                resave: false,
                saveUninitialized: false,
                secret: 'keyboard cat'
            }));
            break;
        case 'mongodb':
            store = require('connect-mongo')(session);
            link = C.db[C.session.store];
            app.use(session({
                resave: false,
                saveUninitialized: false,
                secret: 'keyboard cat',
                store: new store({
                    host: link.host,
                    port: link.port,
                    db: link.database,
                    username: link.username,
                    password: link.password
                })
            }));
            break;
        case 'redis':
            store = require('connect-redis')(session);
            link = C.db[C.session.store.link];
            // 设置 Session
            app.use(session({
                store: new store({
                    host: link.host,
                    port: link.port,
                    db: link.database,
                    username: link.username,
                    password: link.password
                }),
                resave:false,
                saveUninitialized:false,
                secret: 'keyboard cat'
            }));
            break;
        default:
            throw '未知的SESSION存储方式';
    }

};