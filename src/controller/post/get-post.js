module.exports = function buildGetController ({ findPostById, auth}) {
    return async function findPostByIdController (httpRequest) {
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
            const res = await findPostById({ownerId: uid, postId: params.postId})
            return {
                headers: {
                    'Content-Type': 'application/json'
                }, 
                statusCode: 200,
                body: res
            }
        }catch(e) {
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