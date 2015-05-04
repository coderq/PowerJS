/**
 * Created by CoderQ on 2015/4/6.
 */
"use strict";

var connectMultiparty = require('connect-multiparty');

module.exports = function (app) {
    app.use(connectMultiparty({uploadDir: C.tmp}));
};