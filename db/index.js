const Firestore = require('@google-cloud/firestore')

const PROJECTID = process.env.PROJECT_ID
const COLLECTION_NAME = process.env.COLLECTION_NAME
const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
})
// const db = firestore.collection(COLLECTION_NAME)

module.exports = function dbSetup () {
    return {db: firestore}
}
   