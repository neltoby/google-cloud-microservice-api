module.exports = function buildCommentDb ({db}) {
    const COLLECTION_NAME = process.env.NODE_ENV !== 'production' ? 'posts' : process.env.COLLECTION_NAME
    const dbCol = db.collection(COLLECTION_NAME)
    const postCollection = process.env.NODE_ENV !== 'production' ? 'posts' : process.env.POST_COLLECTION
    const commentCollection = process.env.NODE_ENV !== 'production' ? 'comments' : process.env.COMMENT_COLLECTION
    const likeCommentCollection = process.env.NODE_ENV !== 'production' ? 'like_comment' : process.env.LIKE_COMMENT_COLLECTION

    const createComment = async ({ownerId, postId, post}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
        const doc = await docRef.add(post)
        return {
            id: doc.id,
            ...post
        }
    }

    const findAllComment = async ({ownerId, postId}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
        const doc = await docRef.get()
        const allComment = []
        doc.forEach(item => {
            allComment.push({
                id: item.id,
                ...item.data()
            })
        })
        return allComment
    }

    const findCommentById = async ({ ownerId, postId, commentId }) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
            .doc(commentId)
        const doc = await docRef.get()
        if(doc.exists){
            return {
                postId,
                commentId,
                ...doc.data()
            }
        }else{
            return null
        }        
    }

    const likeComment = async ({ownerId, postId, userId, commentId}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
            .doc(commentId)
            .collection(likeCommentCollection)
        const doc = await docRef.add({userId})
        return{
            commentId: doc.id
        }
        
    }
    const unlikeComment = async ({ownerId, postId, userId, commentId}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
            .doc(commentId)
            .collection(likeCommentCollection)
            .doc(userId)
        const doc = await docRef.delete()
        return{
            commentId: doc.id, 
            deleted: true
        }       
    }

    const updateComment = async ({ownerId, postId, commentId, changed}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
            .doc(commentId)
        const doc = await docRef.update(changed)
        return {
            ...changed
        }
    }

    const getCommentLikes = async ({ownerId, postId, commentId}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
            .doc(commentId)
            .collection(likeCommentCollection)
        const doc = await docRef.get()
        const allLike = []
        doc.forEach(item => {
            allLike.push({
                id: item.id,
                ...item.data()
            })
        })
        return allLike
    }

    const deleteComment = async ({ownerId, postId, commentId}) => {
        const docRef = dbCol.doc(ownerId)
            .collection(postCollection)
            .doc(postId)
            .collection(commentCollection)
            .doc(commentId)
        const doc = await docRef.delete()
        const query = docRef.collection(likeCommentCollection).limit(1000)
        const del = await deleteCollect(db, query)
        return {
            deleted: true,
            object: 'collection'
        }
    }

    const deleteCollect = async (db, query) => {
        // const collectionRef = db.collection(collectionPath);
        // const query = collectionRef.limit(batchSize);
      
        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        });
      }

    const deleteQueryBatch = async (db, query, resolve) => {
        const snapshot = await query.get();
      
        const batchSize = snapshot.size;
        if (batchSize === 0) {
          // When there are no documents left, we are done
          resolve();
          return;
        }
      
        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(db, query, resolve);
        });
    }

    return Object.freeze({
        createComment,
        findAllComment,
        findCommentById,
        likeComment,
        unlikeComment,
        updateComment,
        getCommentLikes,
        deleteComment
    })
}