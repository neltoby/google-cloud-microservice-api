const makeFakeComment = require('../../__test__/comment');
const makeComment = require('.');
const faker = require('faker');

describe('comment', () => {
    test('comment should have content', () => {
        const fakeComment = makeFakeComment({comment: undefined});
        expect(() => makeComment(fakeComment)).toThrow();
    })
    test('comment should have an owner', () => {
        const fakeComment = makeFakeComment({ownerId: undefined});
        expect(() => makeComment(fakeComment)).toThrow();
    })
    test('comment should have a post id', () => {
        const fakeComment = makeFakeComment({postId: undefined});
        expect(() => makeComment(fakeComment)).toThrow();
    })
    test('comment should have a post id', () => {
        const fakeComment = makeFakeComment({likes: undefined});
        expect(() => makeComment(fakeComment)).toThrow();
    })
    test('comment should have a valid content', () => {
        const fakeComment = makeFakeComment({comment: '<script> alert("I am an alert") </script>'});
        expect(() => makeComment(fakeComment)).toThrow();
    })
    test('all getters', () => {
        const fakeComment = makeFakeComment({});
        const comment = makeComment(fakeComment);
        expect(comment.getId).toBeNull();
        expect(comment.getPostId).toBe(fakeComment.postId);
        expect(comment.getOwnerId).toBe(fakeComment.ownerId);
        expect(comment.getComment).toBe(fakeComment.comment);
        expect(comment.getCreatedOn).toBe(fakeComment.createdOn);
        expect(comment.getLikes).toBe(fakeComment.likes);
        expect(comment.getDeletedOn).toBeNull();
        expect(comment.getEdited).toBe(false);
    })
    test('setId method must accept a value', () => {
        const fakeComment = makeFakeComment({});
        const comment = makeComment(fakeComment);
        expect(comment.getId).toBeNull();
        expect(() => comment.setId()).toThrow();
    })
    test('comment id can be set', () => {
        const fakeComment = makeFakeComment({});
        const comment = makeComment(fakeComment);
        expect(comment.getId).toBeNull();
        comment.setId(2);
        expect(comment.getId).toBe(2);
    })
    test('setComment method must accept a value', () => {
        const fakeComment = makeFakeComment({});
        const comment = makeComment(fakeComment);
        expect(() => comment.setId()).toThrow();
        expect(comment.getComment).toBe(fakeComment.comment);
    })
    test('setComment method must accept a valid value', () => {
        const fakeComment = makeFakeComment({});
        const comment = makeComment(fakeComment);
        const str = '<script> alert("I am an alert") </script>';
        expect(() => comment.setComment(str)).toThrow();
        expect(comment.getComment).toBe(fakeComment.comment);
    })
    test('comment can be set', () => {
        const fakeComment = makeFakeComment({comment: 'old string'});
        const comment = makeComment(fakeComment);
        expect(comment.getComment).toBe('old string');
        expect(comment.getEdited).toBe(false);   
        expect(comment.getEditedOn).toBeNull();
        const str = 'new string'
        comment.setComment(str, fakeComment.source);
        expect(comment.getComment).toBe(str);
        expect(comment.getEdited).toBe(true);      
        expect(comment.getEditedOn).not.toBeNull();
    })
    test('comment can be deleted', () => {
        const fakeComment = makeFakeComment({});
        const comment = makeComment(fakeComment);
        expect(comment.getComment).toBe(fakeComment.comment);
        expect(comment.getOwnerId).toBe(fakeComment.ownerId);
        expect(comment.getDeletedOn).toBeNull();
        comment.deleteComment(fakeComment.source);
        expect(comment.getComment).toBeNull();
        expect(comment.getOwnerId).toBeNull();
        expect(comment.getDeletedOn).not.toBeNull();
    })
    test('comment must have source', () => {
        const fakeComment = makeFakeComment({source: undefined});
        expect(() => makeComment(fakeComment)).toThrow();
    })
    test('comment must have an ip', () => {
        const fakeComment = makeFakeComment();
        const comment = makeComment(fakeComment);
        expect(comment.getSource.getIp()).toBe(fakeComment.source.ip);
    })
    test('comment must have an browser', () => {
        const fakeComment = makeFakeComment();
        const comment = makeComment(fakeComment);
        expect(comment.getSource.getBrowser()).toBe(fakeComment.source.browser);
    })
    test('comment must have a referrer', () => {
        const fakeComment = makeFakeComment();
        const comment = makeComment(fakeComment);
        expect(comment.getSource.getReferrer()).toBe(fakeComment.source.referrer);
    })
})