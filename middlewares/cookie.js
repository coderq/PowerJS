/**
 * Created by CoderQ on 2015/3/18.
 */
"use strict";

var cookieParser = require('cookie-parser');

module.exports = function (app) {
    app.use(cookieParser());
};