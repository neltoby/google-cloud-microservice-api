module.exports = function makeFirebase ({ admin }) {
    const firebaseCreateUser = async ({email, phoneNumber, password, displayName, photoUrl}) => {
        const data = await admin.auth.createUser({
            email,
            emailVerified: false,
            phoneNumber,
            password,
            displayName,
            photoUrl,
            disabled: false
        })
        if(data.uid){
            return data
        }
    }
    const firebaseGetUser = async ({uid}) => {
        if(!uid){
            throw new Error({
                statusCode: 400,
                mesage: 'Bad request'
            })
        }
        const data = await admin.auth.getUser(uid)
        if(data){
            return data
        }
    }
    const firebaseGetUserByEmail = async ({email}) => {
        if(!email){
            throw new Error({
                statusCode: 400,
                mesage: 'Bad request'
            })
        }
        const data = await admin.auth.getUserByEmail(email)
        if(data) {
            return data
        }
    }
    const firebaseUpdateUser = async (dataToUpdate) => {
        if(!dataToUpdate){
            throw new Error({
                statusCode: 400,
                mesage: 'Bad request'
            })
        }

    }
    return {
        firebaseCreateUser,
    }
}