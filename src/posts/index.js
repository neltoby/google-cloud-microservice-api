const sanitizeHtml = require('sanitize-html');
const isIp = require('is-ip');
const buildPosts = require('./posts');
const buildmakeSource = require('../source');

const sanitize = str => {
    return sanitizeHtml(str)
}

const makeSource = buildmakeSource({ validateIp: isIp})

const makePost = buildPosts({ sanitize, makeSource})

module.exports = { makePost, makeSource, sanitize }