const firebase = require("@firebase/rules-unit-testing");
const faker = require('faker');
const makeFakePost = require('../../../__test__/post_test');
const makeFakeUser = require('../../../__test__/user');
const buildMakePost = require('./createPost');
const buildFindPostById = require('./findPostById');
const buildEditPost = require('./editPost');
const buildPostDb = require('../../dataAccess/post-trans');
const buildCommentDb = require('../../dataAccess/comment-trans');
const buildUserDb = require('../../dataAccess/user-trans');

const moderatePost = post => post

describe('get post by id', () => {
    let postDb
    let addPost
    let editPost
    let userDb
    let userId
    let commentDb
    let findPostById
    beforeEach(async () => {
        const db = firebase
            .initializeTestApp({ projectId: 'test-project', auth: null })
            .firestore()
        const dbObj = {db}
        postDb = buildPostDb(dbObj)
        addPost = buildMakePost({ postDb, moderatePost })
        userDb = buildUserDb(dbObj)
        commentDb = buildCommentDb(dbObj)
        editPost = buildEditPost({ postDb, commentDb, moderatePost })
        const fakeUser = makeFakeUser({})
        const newUser = await userDb.createUser(fakeUser)
        findPostById = buildFindPostById({ postDb, commentDb})
        userId = newUser.id
    });
    afterEach(async () => {
        await firebase.clearFirestoreData({ projectId: 'test-project' });
    });
      
    afterAll(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()));
    });

    test('users can retrieve a single post by Id', async () => {
        const fakepost = makeFakePost({ownerId: userId})
        const {post, title, createdOn, source} = fakepost
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
        const retrievedPost = await findPostById({ ownerId: userId, postId: retVal.postId, source })
        const expectedRetrieved = {
            post: retVal.post,
            title: retVal.title,
            createdOn: retVal.createdOn,
            published: retVal.published,
            deletedOn: retVal.deletedOn,
            source,
            edited: retVal.edited,
            editedOn: retVal.editedOn,
            editedType: retVal.editedType,
            fullname: retVal.fullname,
            ownerId: retVal.ownerId,
            noOfLikes: retVal.noOfLikes,
            reviews: [],
            comments: retVal.comments,
        }
        expect(retrievedPost).toEqual(expectedRetrieved)
    })

    test('retrieves an edited post by Id', async () => {
        const fakepost = makeFakePost({ownerId: userId})
        const {post, title, createdOn, source} = fakepost
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
        const desired_update = {post: 'new Post', title: 'new Title'}
        const newSource = {
            ip: faker.internet.ip(),
            referrer: faker.internet.url(),
            browser: faker.internet.userAgent()
        }
        const edited = await editPost({
            ownerId: userId, 
            postId: retVal.postId, 
            post: desired_update, 
            source: newSource
        })
        expect(edited.post).toBe(desired_update.post)
        expect(edited.title).toBe(desired_update.title)
        expect(edited.editedSource).toEqual(newSource)
        const retrievedPost = await findPostById({ ownerId: userId, postId: retVal.postId, source })
        const expectedRetrieved = {
            post: edited.post,
            title: edited.title,
            createdOn: edited.createdOn,
            published: edited.published,
            deletedOn: edited.deletedOn,
            source: edited.source,
            edited: edited.edited,
            editedOn: edited.editedOn,
            editedType: edited.editedType,
            fullname: edited.fullname,
            ownerId: edited.ownerId,
            noOfLikes: edited.noOfLikes,
            reviews: [],
            comments: edited.comments,
            editedSource: newSource
        }
        expect(retrievedPost).toEqual(expectedRetrieved)
    })
})