const { makePost } = require('../../posts')
module.exports = function buildLikePost ({ postDb, makeSource }) {
    return async function likePost ({ userId, ownerId, postId, source }) {
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
                const result = await postDb.likePost({ userId, ownerId, postId, createdOn: Date.now(), ip: r_source.getIp(), browser: r_source.getBrowser(), referrer: r_source.getReferrer()})
                if(result){
                    return {
                        ...result,
                        type: 'like',
                        like: true,
                        source: {
                            ip: r_source.getIp(),
                            browser: r_source.getBrowser(),
                            referrer: r_source.getReferrer()
                        }
                    }
                }else{
                    return {}
                }
            }
        }
    }
}