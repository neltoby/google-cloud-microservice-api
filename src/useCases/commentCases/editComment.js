const makeComment = require('../../comment')
module.exports = function buildEditComment ({ postDb, commentDb, moderateComment }) {
    return async function editComment ({ownerId, postId, userId, commentId, newComment, source}) {

        if(!newComment){
            throw { statusCode: 403, message: 'Comment update must have a content'}
        }
        if(!commentId){
            throw { statusCode: 403, message: 'Comment must have an identifier'}
        }
        if(!userId){
            throw { statusCode: 403, message: 'Comment must have user identifier'}
        }
        const getComment = await commentDb.findCommentById({ownerId, postId, commentId})
        if(getComment.ownerId !== userId){
            throw { statusCode: 401, message: 'Unauthorized access'}
        }
        const { fullname } = await postDb.userByName({ ownerId: userId })
        const likes = await commentDb.getCommentLikes({ownerId, postId, commentId})
        const commentSource = {
            ip: getComment.ip,
            browser: getComment.browser,
            referrer: getComment.referrer
        }
        const madeComment = makeComment({...getComment, postId, fullname, source: commentSource, likes})
        madeComment.setComment(newComment, source)
        const moderated = await moderateComment(madeComment)
        const changed = {
            comment: moderated.getComment,
            edited_Ip: moderated.getEditedSource.getIp(),
            edited_Browser: moderated.getEditedSource.getBrowser(),
            edited_Referrer: moderated.getEditedSource.getReferrer(),
            edited: moderated.getEdited,
            editedOn: moderated.getEditedOn,
        }
        const result = await commentDb.updateComment({ownerId, postId, commentId, changed})
        return {
            comment: moderated.getComment,
            ownerId: moderated.getOwnerId,
            source: {
                ip: moderated.getSource.getIp(),
                browser: moderated.getSource.getBrowser(),
                referrer: moderated.getSource.getReferrer(),
            },
            createdOn: moderated.getCreatedOn,
            edited: moderated.getEdited,
            editedOn: moderated.getEditedOn,
            deleted: moderated.getDeleted,
            deletedOn: moderated.getDeletedOn,
            published: moderated.getPublished, 
            editedSource: {
                ip: moderated.getEditedSource.getIp(),
                browser: moderated.getEditedSource.getBrowser(),
                referrer: moderated.getEditedSource.getReferrer(),
            }
        }
    }
} 