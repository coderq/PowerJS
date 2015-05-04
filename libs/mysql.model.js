/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

module.exports = {
    query: function (sql, callback, scope) {
        this.db.query(sql, function (err) {
            if (err) throw err;
            callback && callback.apply(scope, Array.prototype.slice.call(arguments, 1));
        });
    },
    fetchRows: function (sql, callback, scope) {
        this.db.query(sql, function (err, data, fields) {
            if (err) throw err;
            callback && callback.apply(scope, data, fields);
        });
    },
    fetchRow: function (sql, callback, scope) {
        this.db.query(sql, function (err, data, fields) {
            if (err) throw err;
            callback && callback.apply(scope, data && data[0]);
        });
    },
    fetchOne: function (sql, callback, scope) {
        this.db.query(sql, function (err, data, fields) {
            if (err) throw err;
            callback && callback.apply(scope, data && data[0] && data[0][Object.keys(data[0]).shift()]);
        });
    }
};