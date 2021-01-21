const firebase = require("@firebase/rules-unit-testing");
const faker = require('faker');
const makeFakePost = require('../../../__test__/post_test');
const makeFakeUser = require('../../../__test__/user');
const buildMakePost = require('./createPost');
const buildLikePost = require('./likePost');
const { makeSource } = require('../../posts');
const buildPostDb = require('../../dataAccess/post-trans');
const buildUserDb = require('../../dataAccess/user-trans');

const moderatePost = post => post

describe('like post', () => {
    let postDb
    let addPost
    let userDb
    let userId
    let likePost
    beforeEach(async () => {
        const db = firebase
            .initializeTestApp({ projectId: 'test-project', auth: null })
            .firestore()
        postDb = buildPostDb({db: db})
        addPost = buildMakePost({ postDb, moderatePost })
        likePost = buildLikePost({ postDb, makeSource })
        userDb = buildUserDb({db: db})
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

    test('users can like a post', async () => {
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
        const newSource = {
            ip: faker.internet.ip(),
            referrer: faker.internet.url(),
            browser: faker.internet.userAgent()
        }
        const newUser = faker.random.uuid()
        const expectedLiked = {
            type: 'like',
            like: true,
            source: newSource
        }
        const liked = await likePost({ userId: newUser, ownerId: userId, postId: retVal.postId, source: newSource })
        expect(liked.id).not.toBeNull()
        expect(liked.createdOn).not.toBeNull()
        expect(liked.source).toEqual(newSource)
    })
})