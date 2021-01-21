module.exports = function buildCommentDeleteController ({ deleteComment, auth }) {
    return async function deleteCommentController (httpRequest) {
        try{
            const { headers, ip, params } = httpRequest;
            let token = auth.getToken(headers);
            const { uid } = await auth.verifyToken({token});
            if(!uid){
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. Missing userId'
                };
            }
            const { ownerId, postId, commentId } = params;
            const source = {};
            source.ip = ip;
            source.browser = headers['User-Agent'];
            if (headers['Referer']) {
                source.referrer = headers['Referer'];
            }      
            const res = await deleteComment({ownerId, postId, userId: uid, commentId, source});
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