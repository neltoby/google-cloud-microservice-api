const makeComment = require('../../comment')
module.exports = function buildMakeComment({ commentDb, postDb, moderateComment}) {
    return async function createComment ({ownerId, userId, postId, comment, source}){
        if(!userId){
            throw {statusCode: 403, message: 'No user identifier specified'}
        }
        const { fullname } = await postDb.userByName({ ownerId: userId })
        const createdComment = makeComment({ postId, ownerId: userId, fullname, comment, createdOn: Date.now(), likes: [], source, published: false })
        const moderated = await moderateComment(createdComment)
        const commentObj = {
            comment,
            ownerId: moderated.getOwnerId,
            ip: moderated.getSource.getIp(),
            browser: moderated.getSource.getBrowser(),
            referrer: moderated.getSource.getReferrer(),
            createdOn: moderated.getCreatedOn,
            edited: moderated.getEdited,
            editedOn: moderated.getEditedOn,
            deleted: moderated.getDeleted,
            deletedOn: moderated.getDeletedOn,
            published: moderated.getPublished
        }
        const result = await commentDb.createComment({ownerId, postId, post: commentObj})
        if(result){
            delete result.ip
            delete result.browser
            delete result.referrer
            moderated.setId(result.id)
            return {
                ...result,
                comment_id: moderated.getId,
                fullname: moderated.getFullname,
                source: {
                    ip: moderated.getSource.getIp(),
                    browser: moderated.getSource.getBrowser(),
                    referrer: moderated.getSource.getReferrer(),
                }
            }
        }else{
            throw { statusCode: 500, message: 'Server Error'}
        }
    }
}