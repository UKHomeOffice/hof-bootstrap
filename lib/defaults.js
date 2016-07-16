'use strict';

const hof = require('hof');
const path = require('path');

/* eslint no-process-env: "off" */
const caller = process.env.NODE_ENV === 'test' ? 'test/' : path.dirname(module.parent.parent.filename);

const defaults = {
  assetPath: 'public',
  translations: 'translations',
  views: 'views',
  fields: 'fields',
  caller: caller,
  start: true,
  getCookies: true,
  getTerms: true,
  viewEngine: 'html',
  baseController: hof.controllers.base,
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8080',
  env: process.env.NODE_ENV || 'development',
  redis: {
    port: process.env.REDIS_PORT || '6379',
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  session: {
    ttl: process.env.SESSION_TTL || 1800,
    secret: process.env.SESSION_SECRET || 'changethis',
    name: process.env.SESSION_NAME || 'hod.sid'
  },
};

module.exports = defaults;
