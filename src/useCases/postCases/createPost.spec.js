const firebase = require("@firebase/rules-unit-testing");
const makeFakePost = require('../../../__test__/post_test');
const makeFakeUser = require('../../../__test__/user');
const buildMakePost = require('./createPost');
const buildPostDb = require('../../dataAccess/post-trans');
const buildUserDb = require('../../dataAccess/user-trans');

const moderatePost = post => post

describe('create post', () => {
    let postDb
    let addPost
    let userDb
    let userId
    beforeEach(async () => {
        const db = firebase
            .initializeTestApp({ projectId: 'test-project', auth: null })
            .firestore()
        postDb = buildPostDb({db})
        addPost = buildMakePost({ postDb, moderatePost })
        userDb = buildUserDb({db})
        const fakeUser = makeFakeUser({})
        const newUser = await userDb.createUser(fakeUser)
        userId = newUser.id
    });
    afterEach(async () => {
        await firebase.clearFirestoreData({ projectId: 'test-project' });
    });
      
    afterAll(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()));
    });

    test('users can create post', async () => {
        const fakepost = makeFakePost({ownerId: userId})
        const {post, title, source} = fakepost
        const retVal = await addPost(fakepost)
        const expected = {
            post,
            postId: retVal.postId,
            title,
            createdOn: retVal.createdOn,
            fullname: retVal.fullname,
            ownerId: userId,
            noOfLikes: 0,
            deletedOn: null,
            comments: [], 
            reviews: [], 
            published: false, 
            edited: false, 
            editedOn: null, 
            editedType: null,
            source
        }
        expect(retVal).toEqual(expected)
    })
})