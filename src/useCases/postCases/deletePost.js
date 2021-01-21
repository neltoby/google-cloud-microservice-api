const { makePost } = require('../../posts')
module.exports = function buildDeletePost ({ postDb, commentDb }) {
    return async function deletePost ({ ownerId, postId, source }) {
        if(!postId){
            throw {statusCode: 403, messsage: 'postId was not supplied' }
        }   
        const result = await postDb.findById({ ownerId, postId })             
        if(result){
            const retrievedSource = {
                ip: result.ip,
                browser: result.browser,
                referrer: result.referrer
            }
            const comments = await commentDb.findAllComment({ownerId, postId})
            const likes = await postDb.getLikePost({ ownerId, postId })
            const { fullname } = await postDb.userByName({ ownerId })
            const deletedPost = makePost({...result, ownerId, fullname, comments, likes, source: retrievedSource})
            deletedPost.setId(postId)
            deletedPost.deletePost(source)
            const updates = {
                post: deletedPost.getPost,
                title: deletedPost.getTitle,
                deleted: deletedPost.getDeleted,
                deleteType: deletedPost.getDeleteType,
                deletedOn: deletedPost.getDeletedOn,
                deleted_Ip: deletedPost.getDeletedSource.getIp(),
                deleted_Browser: deletedPost.getDeletedSource.getBrowser(),
                deleted_Referrer: deletedPost.getDeletedSource.getReferrer()
            }
            const retVal = {
                post: deletedPost.getPost,
                title: deletedPost.getTitle,
                createdOn: deletedPost.getCreatedOn,
                published: deletedPost.getPublished,
                edited: deletedPost.getEdited,
                editedOn: deletedPost.getEditedOn,
                editedType: deletedPost.getEditedType,
                source: {
                    ip: deletedPost.getSource.getIp(),
                    referrer: deletedPost.getSource.getReferrer(),
                    browser: deletedPost.getSource.getBrowser()
                },
                deleted: deletedPost.getDeleted,
                deletedOn: deletedPost.getDeletedOn,
                deleteType: deletedPost.getDeleteType,
                fullname: deletedPost.getFullname,
                ownerId: deletedPost.getOwnerId,
                noOfLikes: deletedPost.getNoOfLikes,
                reviews: [],
                comments: deletedPost.getComments,
                deletedSource: {
                    ip: deletedPost.getDeletedSource.getIp(),
                    referrer: deletedPost.getDeletedSource.getReferrer(),
                    browser: deletedPost.getDeletedSource.getBrowser()
                }
            }
            if(deletedPost.getComments.length){
                const result = await postDb.updatePost({ownerId, postId, changed: updates})
                return deletedPost.getEdited ? {
                    ...retVal,
                    editedSource: {
                        ip: deletedPost.getEditedSource.getIp(),
                        referrer: deletedPost.getEditedSource.getReferrer(),
                        browser: deletedPost.getEditedSource.getBrowser()
                    }
                } : retVal
            }else{
                const deleted = await postDb.deletePost({ ownerId, postId })
                if(deleted){
                    return retVal
                }
            }               
        }
    }
}