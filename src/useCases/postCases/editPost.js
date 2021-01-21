const { makePost } = require('../../posts')
module.exports = function buildEditPost ({ postDb, commentDb, moderatePost }) {
    return async function editPost ({ownerId, postId, post, source}) {

        if(!ownerId){
            throw {statusCode: 403, message: 'ownerId was not supplied' }
        }
        if(!postId){
            throw {statusCode: 403, message: 'postId was not supplied' }
        }
        if(!post){
            throw {statusCode: 403, message: 'post was not supplied' }
        }
        if(post.constructor !== Object){
            throw {statusCode: 403, message: 'Invalid post type' }
        }
        const postContent = await postDb.findById({ ownerId, postId })
        const { fullname } = await postDb.userByName({ ownerId })
        if(postContent){
            const {ip, browser, referrer} = postContent
            const postSource = {
                ip,
                browser,
                referrer
            }
            const comments = await commentDb.findAllComment({ownerId, postId})
            const likes = await postDb.getLikePost({ ownerId, postId })
            const builtPost = makePost({ ...postContent, fullname, ownerId, source: postSource, comments, likes })
            builtPost.setId(postId)
            builtPost.setEditedSource(source)

            if(post.post && !post.title){
                builtPost.setPost(post.post)
            }
            if(post.title && !post.post){
                builtPost.setTitle(post.title)
            }
            if(post.title && post.post){
                builtPost.setPostAndTitle(post)
            }
            post.edited = builtPost.getEdited
            post.editedOn = builtPost.getEditedOn
            post.editedType = builtPost.editedType
            post.edited_Ip = builtPost.getEditedSource.getIp()
            post.edited_Browser = builtPost.getEditedSource.getBrowser()
            post.edited_Referrer = builtPost.getEditedSource.getReferrer()
            const moderated = await moderatePost(builtPost)
            const result = await postDb.updatePost({ownerId, postId, changed: post})
            delete result.edited_Ip
            delete result.edited_Browser
            delete result.edited_Referrer
            return {
                postId,
                post: moderated.getPost,
                title: moderated.getTitle,
                ownerId: moderated.getOwnerId,
                createdOn: moderated.getCreatedOn,
                reviews: [],
                comments: moderated.getComments,
                noOfLikes: moderated.getNoOfLikes,
                fullname: moderated.getFullname,
                deletedOn: moderated.getDeletedOn,
                published: moderated.getPublished,
                source: {
                    ip: moderated.getSource.getIp(),
                    referrer: moderated.getSource.getReferrer(),
                    browser: moderated.getSource.getBrowser()
                },
                editedSource: {
                    ip: moderated.getEditedSource.getIp(),
                    referrer: moderated.getEditedSource.getReferrer(),
                    browser: moderated.getEditedSource.getBrowser()
                },
                ...result
            }
        }else{
            throw {statusCode: 403, message: `Post with id '${postId}' do not exist` }
        }
    }
}