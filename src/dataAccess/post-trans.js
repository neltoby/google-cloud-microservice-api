module.exports = function buildPostDb({db}) {
    const COLLECTION_NAME = process.env.NODE_ENV !== 'production' ? 'posts' : process.env.COLLECTION_NAME
    const dbCol = db.collection(COLLECTION_NAME)
    const postCollection = process.env.NODE_ENV !== 'production' ? 'posts' : process.env.POST_COLLECTION
    const likeCollection = process.env.NODE_ENV !== 'production' ? 'like' : process.env.LIKE_COLLECTION
    const createPost = async ({ownerId, post}) => {
        const doc = await dbCol.doc(ownerId).collection(postCollection).add(post)
        const user = await dbCol.doc(ownerId).get()
        const fullname = user.data().fullname
        return {
            postId: doc.id,
            ...post,
            fullname,
        }
    }

    const updatePost = async ({ownerId, postId, changed}) => {
        const docRef = dbCol.doc(ownerId).collection(postCollection).doc(postId)
        const doc = await docRef.update(changed)
        return {
            ...changed,
        }
    }

    const deletePost = async ({ownerId, postId}) => {
        const doc = await dbCol.doc(ownerId)
        .collection(postCollection)
        .doc(postId).delete()
        return {
            postId,           
        }
    }

    const likePost = async ({ userId, ownerId, postId, createdOn, ip, browser, referrer }) => {
        const docRef = dbCol.doc(ownerId)
        .collection(postCollection)
        .doc(postId)
        .collection(likeCollection)
        const doc = await docRef.add({userId, createdOn, ip, browser, referrer})  
        return{
            likeId: doc.id
        }     
    }

    const unlikePost = async ({ userId, ownerId, postId }) => {
        const docRef = dbCol.doc(ownerId)
        .collection(postCollection)
        .doc(postId)
        .collection(likeCollection)
        .doc(userId)
        const doc = await docRef.delete()  
        return{
            deleted: true
        }     
    }
    const getLikePost = async ({ownerId, postId}) => {
        const docRef = dbCol.doc(ownerId)
        .collection(postCollection)
        .doc(postId)
        .collection(likeCollection)
        const allLikes = []
        const doc = await docRef.get()
        doc.forEach(item => {
            allLikes.push({
                id: item.id,
                ...item.data()
            })
        })
        return allLikes
    }

    const findAllPost = async ({ownerId}) => {
        const docRef = dbCol.doc(ownerId)
        .collection(postCollection)
        const doc = await docRef.get()
        const allPost = []
        doc.forEach(item => {
            allPost.push({
                id: item.id,
                ...item.data()
            })
        });
        return allPost
    }

    const findById = async ({ownerId, postId}) => {
        const docRef = dbCol.doc(ownerId)
        .collection(postCollection).doc(postId)
        const doc = await docRef.get()
        if(doc.exists){
            return {postId, ...doc.data()}
        }else{
            return null
        }
    }

    const userByName = async ({ ownerId }) => {
        const docRef = dbCol.doc(ownerId)
        const doc = await docRef.get()       
        if(doc.exists){
            const fullname = doc.data().name
            return {
                fullname
            }
        }else{
            return null
        }
    }

    return Object.freeze({
        createPost,
        updatePost,
        deletePost,
        likePost,
        unlikePost,
        getLikePost,
        findAllPost,
        findById,
        userByName
    })

}