/**
 * Created by CoderQ on 2015/3/18.
 */
"use strict";
var MongoClient;
var Mysql;

var loadMongodb = function (link, callback, scope) {
    var auth_info = link.username ? U.format('{username}:{password}@', link) : '';
    var db_url = U.format('mongodb://{auth}{host}:{port}/{database}', U.extend(link, {auth: auth_info}));

    MongoClient.connect(db_url, function(err, db) {
        if (err) throw err;
        callback && callback.call(scope, db);
    });
};

var loadMysql = function (link, callback, scope) {
    var db = Mysql.createConnection({
        host: link.host,
        user: link.username,
        password: link.password,
        database: link.database,
        port: link.port
    });
    db.connect(function (err) {
        if (err) throw err;
        callback && callback.call(scope, db);
    });
};

module.exports = function (DB, links) {
    if (!links) return;

    Object.keys(links).forEach(function (item, i, ary) {
        switch (links[item].type) {
            case 'mongodb':
                if (!MongoClient) {
                    MongoClient = require('mongodb').MongoClient;
                }
                loadMongodb(links[item], function (db) {
                    DB[item] = db;
                });
                break;
            case 'mysql':
                if (!Mysql) {
                    Mysql = require('mysql');
                }
                loadMysql(links[item], function (db) {
                    DB[item] = db;
                });
                break;
            default:
                throw new Error('未知的数据库链接');
        }
    });
};