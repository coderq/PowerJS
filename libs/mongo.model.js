/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

module.exports = {
    dereference: function (dbref, callback, scope) {
        if (!this.db) {
            throw Error('Invalid db.');
        }

        this.db.dereference(dbref, function (err, item) {
            if (err) throw err;
            callback && callback.call(scope, item);
        });
    },
    insert: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.values = param.values || param.value;
        if (!param.values) {
            throw Error('Insert operation requires \'values\'.');
        }

        this.collection.insert(param.values, function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data ? U.isArray(param.values) ? data : data[0] : null);
        });
    },
    push: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        if (!param.where) {
            throw Error('Update operation requires \'where\'.');
        }
        param.values = param.values || param.value;
        if (!param.values) {
            throw Error('Insert operation requires \'values\'.');
        }
        if (!U.isArray(param.values)) {
            param.values = [param.values];
        }
        if (!param.field) {
            throw Error('Insert operation requires \'field\'.');
        }

        var push = {};
        push[param.field] = {$each: param.values};
        this.collection.update(param.where, {$push: push}, function (err, ret) {
            if (err) throw err;
            callback && callback.call(scope, ret);
        });
    },
    remove: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        if (!param.where) {
            throw Error('Remove operation requires \'where\'.');
        }

        this.collection.remove(param.where, function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data);
        });
    },
    update: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        if (!param.where) {
            throw Error('Update operation requires \'where\'.');
        }
        if (!param.update) {
            throw Error('Update operation requires \'update\'.');
        }

        this.collection.update(param.where, param.update, {
            upsert: !!param.upsert,
            multi: !!param.multi || true
        }, function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data);
        });
    },
    count: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.where = param.where || {};

        this.collection.count(param.where, function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data);
        });
    },
    group: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.where = param.where || {};
        param.initial = param.initial || {};
        if (!param.group) {
            throw Error('Update operation requires \'group\'.');
        }
        if (!param.reduce) {
            throw Error('Update operation requires \'reduce\'.');
        }

        this.collection.group(param.group, param.where, param.initial, param.reduce, function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data);
        });
    },
    fetchRows: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.where = param.where || {};
        param.fields = param.fields || param.field && [param.field];

        this.collection.find(param.where, {
            fields: param.fields,
            skip: param.page && (param.page - 1) * param.limit,
            limit: param.limit,
            sort: param.sort
        }).toArray(function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data);
        });
    },
    fetchRowsWithCount: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.where = param.where || {};

        this.count(param, function (count) {
            this.fetchRows(param, function (list) {
                callback && callback.call(scope, {
                    total: count,
                    data: list
                });
            }, this);
        }, this);
    },
    fetchRow: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.where = param.where || {};

        this.collection.findOne(param.where, {
            fields: param.fields,
            skip: param.skip,
            limit: param.limit,
            sort: param.sort
        }, function (err, data) {
            if (err) throw err;
            callback && callback.call(scope, data);
        });
    },
    fetchOne: function (param, callback, scope) {
        if (!this.collection) {
            throw Error('Invalid collection.');
        }

        param.where = param.where || {};
        if (!param.field) {
            throw Error('Fetch one operation requires \'field\'.');
        }
        if (!U.isString(param.field)) {
            throw Error('The parameter \'field\' must be character.');
        }

        this.fetchRow(param, function (data) {
            var ret = U.namespace(data, param.field);
            callback && callback.call(scope, U.isEmpty(ret) ? null : ret);
        });
    }
};