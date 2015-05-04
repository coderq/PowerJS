/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

var _ = require('underscore');

var extend = function () {
    var params = Array.prototype.slice.call(arguments)
        , method = 'number' == typeof params[params.length - 1] ? params.pop() : 0
        , ret = method & extend.replaceFirst ? params.shift() : {}
        , deep = method & extend.deepExtend
        , rmNull = method & extend.removeNull, obj;

    while (params.length) {
        obj = params.shift();
        for (var k in obj) {
            if (null === obj[k]) {
                rmNull ? delete ret[k] : ret[k] = obj[k];
            } else if (!ret[k] || ret[k].constructor !== Object || obj[k].constructor !== Object) {
                ret[k] = obj[k];
            } else {
                ret[k] = deep ? extend(ret[k], obj[k], method) : obj[k];
            }
        }
    }
    return ret;
};
/**
 * 将结果赋值给第一个对象
 */
extend.replaceFirst = 1;
/**
 * 深度合并
 */
extend.deepExtend = 2;
/**
 * 删除值为null的键
 */
extend.removeNull = 4;

/**
 * 字符串格式化方法
 * @params null
 * @example _.format('我是{0}', 'CoderQ') => '我是CoderQ'; '我是{name}'.format({name:'CoderQ'}) => '我是CoderQ';
 * @depends null
 * @return string
 */
var string_format = function () {
    var args = Array.prototype.slice.call(arguments),
        string = args.shift(),
        params = 'object' == typeof args[0] ? args[0] : args;
    return string.replace(/\{(\w+)(\|([^}]+))?\}/g, function ($, $1, $2, $3) {
        return 'undefined' == typeof params[$1] ? eval($3) : params[$1];
    });
};

/**
 * 时间格式化函数
 * @params
 *    format 格式
 *    language 语言
 * @example new Date().format('Y-m-d H:i:s')
 * @depends toString
 * @return string
 */
var date_format = function (format, date, lang) {
    var _format = format || '';
    var _lang = lang || 'zh';
    var _month_text = {
        'zh': ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    var _day_text = {
        'zh': ['日', '一', '二', '三', '四', '五', '六'],
        'en': ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
    };
    var _year = date.getFullYear();
    var _month = date.getMonth() + 1;
    var _date = date.getDate();
    var _day = date.getDay();
    var _hour = date.getHours();
    var _minute = date.getMinutes();
    var _second = date.getSeconds();
    return _format.replace(/Y/g, _year)
        .replace(/y/g, _year.toString().substr(2))
        .replace(/M/g, _month_text[_lang][_month - 1])
        .replace(/m/g, _month > 9 ? _month : '0' + _month)
        .replace(/n/g, _month)
        .replace(/D/g, _day_text[_lang][_day])
        .replace(/d/g, _date > 9 ? _date : '0' + _date)
        .replace(/j/g, _date)
        .replace(/H/g, _hour > 9 ? _hour : '0' + _hour)
        .replace(/G/g, _hour)
        .replace(/h/g, (_hour % 12) > 9 ? (_hour % 12) : '0' + (_hour % 12))
        .replace(/g/g, _hour % 12)
        .replace(/i/g, _minute > 9 ? _minute : '0' + _minute)
        .replace(/s/g, _second > 9 ? _second : '0' + _second);
};

/**
 * 数据格式化
 * @param format
 * @param obj
 * @return string
 */
var format = function (format, obj) {
    if (Object.prototype.toString.call(obj) == '[object Date]') {
        return date_format.apply(null, arguments);
    } else {
        return string_format.apply(null, arguments);
    }
};

/**
 * 命名空间
 *
 * @param obj
 * @param namespace
 * @param value
 * @returns {*}
 */
var namespace = function (obj, namespace, value) {
    var ary = namespace.split(/\s?\.\s?/), o = obj || {}, item;

    while (ary.length) {
        item = ary.shift();
        if (!_.isEmpty(item)) {
            o = o[item] = o[item] || {};
        }
    }
    if (!_.isUndefined(value)) {
        o = value;
    }

    return o;
};

_.extend = extend;
_.format = format;
_.namespace = namespace;

extend(_, require('./util_ext/file'), extend.replaceFirst);
extend(_, require('./util_ext/security'), extend.replaceFirst);

module.exports = _;