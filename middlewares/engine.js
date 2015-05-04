/**
 * Created by CoderQ on 2015/3/20.
 */
"use strict";

module.exports = function (app) {
    if (!C.engine) return;

    var engine;

    switch (C.engine.type) {
        case 'jade':
            engine = require('jade');
            engine.setDefaults(C.engine.config || {});
            app.engine('jade', engine.__express);
            break;
        case 'ejs':
            engine = require('ejs');
            engine.setDefaults(C.engine.config || {});
            app.engine('ejs', engine.renderFile);
            break;
        case 'swig':
            engine = require('swig');
            engine.setDefaults(C.engine.config || {});
            app.engine('swig', engine.renderFile);
            break;
        default:
    }
};