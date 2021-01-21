const makeComment = require('../../comment')
module.exports = function buildDeleteComment ({ postDb, commentDb }) {
    return async function deleteComment ({ownerId, postId, userId, commentId, source}) {
        if(!commentId){
            throw { statusCode: 403, message: 'Comment must have an identifier'}
        }
        if(!userId){
            throw { statusCode: 403, message: 'Comment must have user identifier'}
        }
        const getComment = await commentDb.findCommentById({ownerId, postId, commentId})
        if(getComment.ownerId !== userId){
            throw { statusCode: 401, message: 'Unauthorized access! You don not have the privilege to delete this resource'}
        }
        const { fullname } = await postDb.userByName({ ownerId: userId })
        const likes = await commentDb.getCommentLikes({ownerId, postId, commentId})
        const commentSource = {
            ip: getComment.ip,
            browser: getComment.browser,
            referrer: getComment.referrer
        }
        const madeComment = makeComment({...getComment, postId, fullname, source: commentSource, likes})
        madeComment.deleteComment(source)
        const result = await commentDb.deleteComment({ownerId, postId, commentId})
        if(result){
            const comRes = {
                comment: madeComment.getComment,
                ownerId: madeComment.getOwnerId,
                source: {
                    ip: madeComment.getSource.getIp(),
                    browser: madeComment.getSource.getBrowser(),
                    referrer: madeComment.getSource.getReferrer(),
                },
                deletedSource: {
                    ip: madeComment.getDeleteSource.getIp(),
                    browser: madeComment.getDeleteSource.getBrowser(),
                    referrer: madeComment.getDeleteSource.getReferrer(),
                },
                createdOn: madeComment.getCreatedOn,
                edited: madeComment.getEdited,
                editedOn: madeComment.getEditedOn,
                deleted: madeComment.getDeleted,
                deletedOn: madeComment.getDeletedOn,
                published: madeComment.getPublished, 
            }
            return madeComment.getEdited ? {
                ...comRes,
                editedSource: {
                    ip: madeComment.getEditedSource.getIp(),
                    browser: madeComment.getEditedSource.getBrowser(),
                    referrer: madeComment.getEditedSource.getReferrer(),
                }
            } : comRes
        }
    }
} 