const { makeUser } = require('../../user');

module.exports = function buildEditUser ({ userDb, auth }) {
    return async function editUser (user) {
        if(user.constructor !== Object){
            throw new Error({statusCode: 403, message: `User object must be of type object, ${typeof(user)} given`})
        }
        if(!user.ownerId) {
            throw new Error({statusCode: 403, message: `User identifier missing`})
        }
        const getUser = userDb.findUserById({ownerId: user.ownerId})
        const { name, email, country, state, municipal } = getUser
        const createUserObj = makeUser({name, email, country, state, municipal})
        if(user.country){
            if(user.state){
                if(user.municipal){
                    createUserObj.setCountry(user.country)
                    createUserObj.setState(user.state)
                    createUserObj.setMunicipal(user.municipal)
                }else{
                    throw new Error('Municpal has not been set')
                }
            }else{
                throw new Error('State has not been set')
            }
        }
        if(user.name){
            createUserObj.setName(user.name)
        }
        if(user.email){
            createUserObj.setEmail(user.email)
        }
        const updateUser = await userDb.updateUserById({ownerId: user.ownerId, updates: {
            name: createUserObj.getName,
            email: createUserObj.getEmail,
            country: createUserObj.getCountry,
            state: createUserObj.getState,
            municipal: createUserObj.getMunicipal
        }})
        return {
            ...updateUser
        }
    }
}