module.exports = function buildDeleteController ({ deletePost, auth }) {
    return async function deleteController (httpRequest) {
        try{
            const { headers, ip, params} = httpRequest;
            let token = auth.getToken(headers);
            const { uid } = await auth.verifyToken({token});
            if(!uid){
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. Missing userId'
                };
            }
            const { ownerId, postId } = params;
            if(ownerId !== uid) {
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. You do not have a delete privilege on this resource'
                };
            }
            const source = {};
            source.ip = ip;
            source.browser = headers['User-Agent'];
            if (headers['Referer']) {
                source.referrer = headers['Referer'];
            }
                  
            const res = await deletePost({ownerId, postId, source});
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Last-Modified': new Date(res.deletedOn).toUTCString()
                }, 
                statusCode: 204,
                body: res
            };
        } catch (e) {
            return {
                headers: {
                    'Content-Type': 'application/json',
                }, 
                statusCode: e.statusCode,
                body: {
                    error: e.message
                }
            };
        }
    }
};