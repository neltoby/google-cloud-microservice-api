const { makePost } = require('../../posts')
module.exports = function buildUnlikePost ({ postDb, makeSource }) {
    return async function unlikePost ({ userId, ownerId, postId, source }) {
        if(!ownerId){
            throw {statusCode: 403, message: 'ownerId was not supplied' }
        }
        if(!postId){
            throw {statusCode: 403, message: 'postId was not supplied' }
        }
        if(!userId){
            throw {statusCode: 403, message: 'userId was not supplied' }
        }
        const r_source = makeSource(source)
        if(r_source){               
            const returnedPostFromDb = await postDb.findById({ ownerId, postId })
            if(returnedPostFromDb){
                const result = await postDb.unlikePost({ userId, ownerId, postId })
                if(result){
                    return {
                        ...result,
                        type: 'unlike',
                        unlike: true
                    }
                }else{
                    return {}
                }
            }
        }
    }
}