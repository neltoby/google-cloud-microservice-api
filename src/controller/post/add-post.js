module.exports = function buildAddPostController({ addPost, auth }){
    return async function addPostController (httpRequest) {
        try{
            const { headers, body, ip } = httpRequest;
            let token = auth.getToken(headers);
            if(!body){
                throw {
                    statusCode: 400,
                    status: 'Bad request',
                    message: 'Authorization header missing'
                };
            }
            const { uid } = await auth.verifyToken({token});
            if(!uid){
                throw {
                    statusCode: 401,
                    message: 'Unauthorized. Missing userId'
                };
            }
            body['userId'] = uid;
                     
            const source = {};
            source.ip = ip;
            source.browser = headers['User-Agent'];
            if (headers['Referer']) {
                source.referrer = headers['Referer'];
            }
            body['source'] = source;
            const res = await addPost(body);
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Last-Modified': new Date(res.createdOn).toUTCString()
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