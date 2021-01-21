const buildAddPostController = require('./add-post');
const buildDeleteController = require('./delete-post');
const buildEditPostController = require('./edit-post');
const buildFindAllPostController = require('./get-all-post');
const buildGetController = require('./get-post');
const buildLikePostController = require('./like-post');
const buildUnlikePostController = require('./unlike-post');
const auth = require('../../authentication');
const {
    addPost, 
    deletePost, 
    editPost, 
    findAllPost, 
    findPostById, 
    likePost, 
    unlikePost} = require('../../useCases')

const addPostController = buildAddPostController({ addPost, auth })
const deleteController = buildDeleteController({ deletePost, auth })
const editPostController = buildEditPostController({ editPost, auth })
const findAllPostController = buildFindAllPostController({ findAllPost, auth })
const findPostByIdController = buildGetController({ findPostById, auth })
const likePostController = buildLikePostController({ likePost, auth })
const unlikePostController = buildUnlikePostController({ unlikePost, auth })

module.exports = Object.freeze({
    addPostController,
    deleteController, 
    editPostController,
    findAllPostController,
    findPostByIdController, 
    likePostController,
    unlikePostController
})