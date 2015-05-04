/**
 * Created by CoderQ on 2015/3/31.
 */
"use strict";

var bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
};