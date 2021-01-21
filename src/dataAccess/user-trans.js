module.exports = function buildUserDb ({ db }) {
    const COLLECTION_NAME = process.env.NODE_ENV !== 'production' ? 'posts' : process.env.COLLECTION_NAME
    // console.log(COLLECTION_NAME, 'from user-trans')
    // console.log(db, 'db from user-trans')
    const dbCol = db.collection(COLLECTION_NAME)
    const createUser = async (user) => {
        const newUser = await dbCol.add(user)
        return {
            ...user,
            id: newUser.id
        }
    }
    return Object.freeze({
        createUser
    })
}