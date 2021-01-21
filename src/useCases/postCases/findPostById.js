const { makePost } = require('../../posts')
module.exports = function buildFindPostById ({ postDb, commentDb }) {
    return async function findPostById ({ ownerId, postId, source }) {
        if(!source){
            throw { statusCode: 403, message: 'Request must have a source'}
        }
        if(source.constructor !== Object){
            throw { statusCode: 403, message: `Source must bee of type of 'Object', ${typeof source} given`}
        }
        const result = await postDb.findById({ ownerId, postId })
        const postSource = {
            ip: result.ip,
            browser: result.browser,
            referrer: result.referrer
        }
        const comments = await commentDb.findAllComment({ownerId, postId})
        const likes = await postDb.getLikePost({ ownerId, postId })
        const { fullname } = await postDb.userByName({ ownerId })
        const builtPost = makePost({...result, ownerId, fullname, source: postSource, comments, likes})
        if(builtPost.getEdited){
            const editSource = {
                ip: result.edited_Ip,
                browser: result.edited_Browser,
                referrer: result.edited_Referrer,
            }
            builtPost.setEditedSource(editSource)
        }
        builtPost.setId(postId)
        if(result){
            const retVal = {
                post: builtPost.getPost,
                title: builtPost.getTitle,
                createdOn: builtPost.getCreatedOn,
                published: builtPost.getPublished,
                deletedOn: builtPost.getDeletedOn,
                source: {
                    ip: builtPost.getSource.getIp(),
                    referrer: builtPost.getSource.getReferrer(),
                    browser: builtPost.getSource.getBrowser()
                },
                edited: builtPost.getEdited,
                editedOn: builtPost.getEditedOn,
                editedType: builtPost.getEditedType,
                fullname: builtPost.getFullname,
                ownerId: builtPost.getOwnerId,
                noOfLikes: builtPost.getNoOfLikes,
                reviews: [],
                comments: builtPost.getComments,
            }
            return builtPost.getEdited ? {
                ...retVal,
                editedSource: {
                    ip: builtPost.getEditedSource.getIp(),
                    referrer: builtPost.getEditedSource.getReferrer(),
                    browser: builtPost.getEditedSource.getBrowser()
                }
            } : retVal
        }else{
            return {}
        }
    }
}