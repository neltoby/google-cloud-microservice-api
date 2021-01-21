const firebase = require('@firebase/testing');

const db = firebase.initializeTestApp({
    projectId: 'complete-sector-300008',
    auth: null
}).firestore();

exports.testDb = db.collection('test_collection');