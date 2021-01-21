module.exports = function jwtAuthentication ({ admin }) {
    return function auth () {
        const getToken = headers => {
            if(!headers['Authorization']){
                throw {
                    statusCode: 401,
                    status: 'Unauthorized',
                    message: 'Unauthorized'
                }
            }
            return headers['Authorization'].split(' ')[1]
        }

        const verifyToken = async ({token}) => {           
            try{
                if(!token){
                    throw new Error({
                        statusCode: 401,
                        message: 'Token not supplied',
                        status: 'Unauthorized'
                    })
                }
                const decoded = await admin.auth().verifyIdToken(token)
                return decoded
            }catch(e){
                throw new Error(e)
            }           
        }

        return Object.freeze({
            verifyToken,
            getToken
        })
    }
}