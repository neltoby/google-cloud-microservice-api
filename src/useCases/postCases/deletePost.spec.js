const firebase = require("@firebase/rules-unit-testing");
const faker = require('faker');
const makeFakePost = require('../../../__test__/post_test');
const makeFakeUser = require('../../../__test__/user');
const buildMakePost = require('./createPost');
const buildDeletePost = require('./deletePost');
const buildPostDb = require('../../dataAccess/post-trans');
const buildUserDb = require('../../dataAccess/user-trans');
const buildCommentDb = require('../../dataAccess/comment-trans');

const moderatePost = post => post

describe('delete post', () => {
    let postDb
    let addPost
    let userDb
    let userId
    let commentDb
    let deletePost
    beforeEach(async () => {
        const db = firebase
            .initializeTestApp({ projectId: 'test-project', auth: null })
            .firestore()
        const dbObj = {db}
        postDb = buildPostDb(dbObj)
        addPost = buildMakePost({ postDb, moderatePost })
        commentDb = buildCommentDb(dbObj)
        userDb = buildUserDb(dbObj)
        deletePost = buildDeletePost({postDb, commentDb})
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

    test('users can delete post', async () => {
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
        const deletedSource = {
            ip: faker.internet.ip(),
            referrer: faker.internet.url(),
            browser: faker.internet.userAgent()
        }
        const deleted = await deletePost({ ownerId: userId, postId: retVal.postId, source: deletedSource })
        const expectedDelete = {
            post: null,
            title: null,
            createdOn: retVal.createdOn,
            published: retVal.published,
            edited: retVal.edited,
            editedOn: retVal.editedOn,
            editedType: retVal.editedType,
            source,
            deleted: deleted.deleted,
            deletedOn: deleted.deletedOn,
            deleteType: deleted.deleteType,
            fullname: null,
            ownerId: null,
            noOfLikes: retVal.noOfLikes,
            reviews: [],
            comments: [],
            deletedSource: deleted.deletedSource
        }
        expect(deleted).toEqual(expectedDelete)
    })
})