const { makePost } = require('../../posts')
module.exports = function buildMakePost ({ postDb, moderatePost }) {
    return async function addPost (postInfo) {
        try{
            if(postInfo.constructor !== Object){
                throw {
                    statusCode: 400,
                    message: 'supplied data must be of type object',
                    status: 'Bad request'
                }
            }
            const { ownerId } = postInfo
            if(!ownerId){
                throw {
                    statusCode: 400,
                    message: 'Missing owner Id',
                    status: 'Bad request'
                }
            }

            const { fullname } = await postDb.userByName({ ownerId })
            const post = makePost({...postInfo, createdOn: Date.now(), fullname, comments: [], likes: [], published: false, edited: false, editedOn: null, editedType: null})
            const moderated = await moderatePost(post)
            const result = await postDb.createPost({
                ownerId: moderated.getOwnerId,
                post: {
                    post: moderated.getPost,
                    title: moderated.getTitle,
                    createdOn: moderated.getCreatedOn,
                    published: moderated.getPublished,
                    deletedOn: moderated.getDeletedOn,
                    ip: moderated.getSource.getIp(),
                    browser: moderated.getSource.getBrowser(),
                    referrer: moderated.getSource.getReferrer(),
                    edited: moderated.getEdited,
                    editedOn: moderated.getEditedOn,
                    editedType: moderated.getEditedType,
                }
            })
            delete result.ip
            delete result.browser
            delete result.referrer
            return {
                ...result,
                fullname: moderated.getFullname,
                ownerId: moderated.getOwnerId,
                noOfLikes: moderated.getNoOfLikes,
                reviews: [],
                comments: moderated.getComments,
                source: {
                    ip: moderated.getSource.getIp(),
                    referrer: moderated.getSource.getReferrer(),
                    browser: moderated.getSource.getBrowser()
                }
            }
        }catch(e){
            throw e
        }
    }
}