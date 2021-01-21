const makeComment = require('../../comment')
module.exports = function buildFindComments ({ commentDb, postDb }) {
    return async function findComment({postId, ownerId}) {
        if(!postId){
            throw { statusCode: 403, message: 'Comment must have a post identifier'}
        }
        const getComment = await commentDb.findAllComment({ownerId, postId})
        if(getComment.length){
            const allComment = getComment.map(async(item, i) => {
                const { fullname } = await postDb.userByName({ ownerId: item.ownerId })
                const commentSource = {
                    ip: item.ip,
                    browser: item.browser,
                    referrer: item.referrer
                }
                const { comment, createdOn, published } = item
                const likes = await commentDb.getCommentLikes({ownerId, postId, commentId: item.id})
                const madeComment = makeComment({ postId, ownerId: item.ownerId, fullname, comment, createdOn, likes, source: commentSource, published })
                madeComment.setId(item.id)
                const commentObj = {
                    comment_Id: madeComment.getId,
                    comment: madeComment.getComment,
                    ownerId: madeComment.getOwnerId,
                    fullname: madeComment.getFullname,
                    source: {
                        ip: madeComment.getSource.getIp(),
                        browser: madeComment.getSource.getBrowser(),
                        referrer: madeComment.getSource.getReferrer(),
                    },
                    createdOn: madeComment.getCreatedOn,
                    edited: madeComment.getEdited,
                    editedOn: madeComment.getEditedOn,
                    deleted: madeComment.getDeleted,
                    deletedOn: madeComment.getDeletedOn,
                    published: madeComment.getPublished
                }
                return madeComment.getEdited ? {
                    ...commentSource,
                    editedSource: {
                        ip: madeComment.getEditedSource.getIp(),
                        browser: madeComment.getEditedSource.getBrowser(),
                        referrer: madeComment.getEditedSource.getReferrer(),
                    }
                } : commentSource
            })
            return allComment
        }
        return getComment
    }
}