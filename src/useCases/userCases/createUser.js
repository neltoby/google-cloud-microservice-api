const { makeUser } = require('../../user');

module.exports = function buildMakeUser ({ userDb }) {
    return async function makeUser ({user}) {
        if(user.constructor !== Object) {
            throw new Error('User details must be of type object')
        }

        const createUser = makeUser({...user})
        const insertUserToDb = await userDb.createUser({
            fullname: createUser.getName,
            email: createUser.getEmail,
            country: createUser.getCountry,
            state: createUser.getState,
            municipal: createUser.getMunicipal,
        })
        return {
            ...insertUserToDb
        }
    }
}