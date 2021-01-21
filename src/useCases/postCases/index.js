const buildMakePost = require('./createPost');
const buildDeletePost = require('./deletePost');
const buildEditPost = require('./editPost');
const buildFindPost = require('./findAllPost');
const buildFindPostById = require('./findPostById');
const buildLikePost = require('./likePost');
const buildUnlikePost = require('./unlikePost');
const { makeSource } = require('../../posts');
const buildModeratedPost = require('../../moderatePost');
const { commentDb, postDb } = require('../../dataAccess');

const moderatePost = buildModeratedPost()

const addPost = buildMakePost({ postDb, moderatePost })
const deletePost = buildDeletePost({ postDb, commentDb, makeSource })
const editPost = buildEditPost({ postDb, commentDb, moderatePost })
const findAllPost = buildFindPost({ postDb, commentDb })
const findPostById = buildFindPostById({ postDb, commentDb })
const likePost = buildLikePost({ postDb, makeSource })
const unlikePost = buildUnlikePost({ postDb, makeSource })

module.exports = Object.freeze({
    addPost, 
    deletePost,
    editPost,
    findAllPost,
    findPostById,
    likePost,
    unlikePost
})
