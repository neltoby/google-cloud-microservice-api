module.exports = function buildUnlikePostController ({ unlikePost, auth }) {
    return async function unlikePostController (httpRequest) {
        try{
            const { headers, ip, params} = httpRequest
            let token = auth.getToken(headers)
            const { uid } = await auth.verifyToken({token})
            if(!uid){
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. Missing userId'
                }
            }
            const source = {}
            source.ip = ip
            source.browser = headers['User-Agent']
            if (headers['Referer']) {
                source.referrer = headers['Referer']
            }
            const { ownerId, postId } = params
            const res = await unlikePost({ userId: uid, ownerId, postId, source })
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Last-Modified': new Date(res.deletedOn).toUTCString()
                }, 
                statusCode: 204,
                body: res
            }
        } catch (e) {
            return {
                headers: {
                    'Content-Type': 'application/json',
                }, 
                statusCode: e.statusCode,
                body: {
                    error: e.message
                }
            }
        }
    }
}