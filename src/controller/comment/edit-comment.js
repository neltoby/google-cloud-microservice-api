module.exports = function buildEditCommentController ({ editComment, auth }) {
    return async function editCommentController (httpRequest) {
        try{
            const { headers, params, body, ip } = httpRequest;
            let token = auth.getToken(headers);
            const { uid } = await auth.verifyToken({token});
            if(!uid){
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. Missing userId'
                };
            }
            const { ownerId, postId, commentId } = params;
            const { newComment } = body;
            if(newComment === undefined){
                throw {
                    statusCode: 400,
                    message: 'Bad request.Comment content missing'
                };
            }
            const source = {};
            source.ip = ip;
            source.browser = headers['User-Agent'];
            if (headers['Referer']) {
                source.referrer = headers['Referer'];
            }
            const res = await editComment({ownerId, postId, userId: uid, commentId, newComment, source});
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Last-Modified': new Date(res.editedOn).toUTCString()
                }, 
                statusCode: 201,
                body: res
            };
        }catch(e) {
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
}