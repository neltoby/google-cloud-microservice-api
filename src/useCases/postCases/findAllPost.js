const { makePost } = require('../../posts')
module.exports = function buildFindPost ({ postDb, commentDb }) {
    return async function findAllPost ({ ownerId }) {
        const retrievedPost = await postDb.findAllPost({ ownerId })
        const { fullname } = await postDb.userByName({ ownerId })
        const allPost = retrievedPost.map((item, i) => {
            const itemSource = {
                ip: item.ip,
                browser: item.browser,
                referrer: item.referrer
            }
            const comments = await commentDb.findAllComment({ownerId, postId: item.id})
            const likes = await postDb.getLikePost({ ownerId, postId: item.id })
            const singlePost = makePost({...item, fullname, ownerId, comments, likes, source: itemSource})
            singlePost.setId(item.id)
            const retVal = {
                post: singlePost.getPost,
                title: singlePost.getTitle,
                createdOn: singlePost.getCreatedOn,
                published: singlePost.getPublished,
                deletedOn: singlePost.getDeletedOn,
                source: {
                    ip: singlePost.getSource.getIp(),
                    referrer: singlePost.getSource.getReferrer(),
                    browser: singlePost.getSource.getBrowser()
                },
                edited: singlePost.getEdited,
                editedOn: singlePost.getEditedOn,
                editedType: singlePost.getEditedType,
                fullname: singlePost.getFullname,
                ownerId: singlePost.getOwnerId,
                noOfLikes: singlePost.getNoOfLikes,
                reviews: [],
                comments: singlePost.getComments,
            }
            return singlePost.getEdited ? {
                ...retVal,
                editedSource: {
                    ip: singlePost.getEditedSource.getIp(),
                    referrer: singlePost.getEditedSource.getReferrer(),
                    browser: singlePost.getEditedSource.getBrowser()
                }
            } : retVal
        })
        return allPost
    }
}