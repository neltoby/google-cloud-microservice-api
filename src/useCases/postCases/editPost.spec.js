const firebase = require("@firebase/rules-unit-testing");
const faker = require('faker');
const makeFakePost = require('../../../__test__/post_test');
const makeFakeUser = require('../../../__test__/user');
const buildMakePost = require('./createPost');
const buildEditPost = require('./editPost');
const buildPostDb = require('../../dataAccess/post-trans');
const buildUserDb = require('../../dataAccess/user-trans');
const buildCommentDb = require('../../dataAccess/comment-trans');

const moderatePost = post => post

describe('edit post', () => {
    let postDb
    let addPost
    let userDb
    let userId
    let editPost
    let commentDb
    beforeEach(async () => {
        const db = firebase
            .initializeTestApp({ projectId: 'test-project', auth: null })
            .firestore()
        postDb = buildPostDb({db})
        commentDb = buildCommentDb({db})
        addPost = buildMakePost({ postDb, moderatePost })
        editPost = buildEditPost({ postDb, commentDb, moderatePost })
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

    test('post and title can be edited', async () => {
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
    })

    test('post alone can be edited', async () => {
        const fakepost = makeFakePost({ownerId: userId})
        const {post, id, title, createdOn, fullname, source} = fakepost
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
        const desired_update = {post: 'new Post Only'}
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
        expect(edited.title).toBe(retVal.title)
        expect(edited.editedSource).toEqual(newSource)
    })

    test('post alone can be edited', async () => {
        const fakepost = makeFakePost({ownerId: userId})
        const {post, id, title, createdOn, fullname, source} = fakepost
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
        const desired_update = {title: 'new Title Only'}
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
        expect(edited.title).toBe(desired_update.title)
        expect(edited.post).toBe(retVal.post)
        expect(edited.editedSource).toEqual(newSource)
    })

})