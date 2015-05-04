/**
 * Created by CoderQ on 2015/3/17.
 */
"use strict";

module.exports = {
    root: __dirname,
    version: require('./package').version,
    port: 3000,
    theme: 'default',
    env: 'production',
    favicon: __dirname + '/favicon.ico',
    cookie: {
        expires: 7 * 24 * 60 * 60 * 1000
    },
    middleware: [
        'bodyParser', 'upload', 'cookie', 'session', 'logger', 'engine', 'favicon', 'static', 'router'
    ],
    router: {
        default: {
            package: 'main',
            controller: 'index',
            action: 'index'
        },
        tag: {
            controller: true,
            view: true,
            action: true,
            service: true
        }
    }
};