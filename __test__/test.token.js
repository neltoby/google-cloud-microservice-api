exports.auth =  {
    getToken: (headers) => {
        if(!headers['Authorization']){
            throw {
                statusCode: 401,
                status: 'Unauthorized',
                message: 'Unauthorized'
            }
        }
        return headers['Authorization'].split(' ')[1]
    },
    verifyToken : async ({token}) => {           
        try{
            if(!token){
                throw new Error({
                    statusCode: 401,
                    message: 'Token not supplied',
                    status: 'Unauthorized'
                })
            }
            return {uid: '43654e68468e5327ye78'}
        }catch(e){
            throw new Error(e)
        }           
    }
};