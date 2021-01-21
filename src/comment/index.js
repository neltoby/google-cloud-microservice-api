const { sanitize, makeSource } = require('../posts');
const isIp = require('is-ip');
const buildMakeComment = require('./comment');
const buildmakeSource = require('../source');

const makeComment = buildMakeComment({sanitize, makeSource});

module.exports = makeComment;