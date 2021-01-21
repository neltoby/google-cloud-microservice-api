module.exports = function buildEditPostController ({ editPost, auth }) {
    return async function editPostController (httpRequest) {
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
            const { ownerId, postId } = params;
            const { updates } = body;
            if(ownerId !== uid) {
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. You do not have an edit privilege on this resource'
                };
            }
            if(updates === undefined){
                throw {
                    statusCode: 400,
                    message: 'Post content is missing'
                };
            }
            const source = {};
            source.ip = ip;
            source.browser = headers['User-Agent'];
            if (headers['Referer']) {
                source.referrer = headers['Referer'];
            }
            const res = await editPost({ownerId: uid, postId: postId, post: updates, source});
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
};