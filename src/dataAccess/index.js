const dbSetup = require('../../db');
const buildPostDb = require('./post-trans');
const buildCommentDb = require('./comment-trans');
const buildUserDb = require('./user-trans');

const { db } = dbSetup()
const commentDb = buildCommentDb({ db })
const postDb = buildPostDb({ db })
const userDb = buildUserDb({ db })

module.exports = {
    commentDb,
    postDb,
    userDb
}
