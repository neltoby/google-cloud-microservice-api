module.exports = function buildFindAllPostController ({ findAllPost, auth }) {
    return async  function findAllPostController (httpRequest) {
        try{
            const { headers } = httpRequest
            let token = auth.getToken(headers)
            const { uid } = await auth.verifyToken({token})
            if(!uid){
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. Missing userId'
                }
            }
            const res = await findAllPost({ ownerId: uid })
            return {
                headers: {
                    'Content-Type': 'application/json',
                }, 
                statusCode: 200,
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