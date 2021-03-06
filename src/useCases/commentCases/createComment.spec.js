const firebase = require("@firebase/rules-unit-testing");
const makeFakePost = require('../../../__test__/post_test');
const makeFakeUser = require('../../../__test__/user');
const makeFakeComment = require('../../../__test__/comment');
const buildMakePost = require('../postCases/createPost');
const buildMakeComment = require('./createComment');
const buildPostDb = require('../../dataAccess/post-trans');
const buildUserDb = require('../../dataAccess/user-trans');
const buildCommentDb = require('../../dataAccess/comment-trans');

const moderatePost = post => post

describe('create comment', () => {
    let postDb
    let addPost
    let userDb
    let userId
    let createComment
    let commentDb
    beforeEach(async () => {
        const db = firebase
            .initializeTestApp({ projectId: 'test-project', auth: null })
            .firestore()
        postDb = buildPostDb({db})
        addPost = buildMakePost({ postDb, moderatePost })
        userDb = buildUserDb({db})
        commentDb = buildCommentDb({db})
        createComment = buildMakeComment({commentDb, postDb, moderateComment: moderatePost})
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

    test('users can create comment', async () => {
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
        const madeComment = makeFakeComment({})
        const postComment = {
            ownerId: userId, 
            userId: userId, 
            postId: retVal.postId, 
            comment: 'I like this post',
            source: madeComment.source
        }
        const newComment = await createComment(postComment)
        expect(newComment.comment_id).not.toBeNull()
    })
})