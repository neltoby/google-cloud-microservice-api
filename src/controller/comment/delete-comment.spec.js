const {add_post} = require('../../../__test__/add-post');
const { auth } = require('../../../__test__/test.token');
const { httpRequests } = require('../../../__test__/httpRequest');

const buildCommentDeleteController = require('./delete-comment');
const deleteCommentController = buildCommentDeleteController({ deleteComment: add_post, auth });

describe('delete comment controller', () => {
    let httpRequest;

    beforeEach(() => {
        httpRequest = httpRequests();
    });

    test('userId should be returned ', async () => {
        const res = await deleteCommentController(httpRequest);
        const { body: { commentId, ownerId, postId }, headers, statusCode } = res;
        expect(ownerId).not.toBeNull();
        expect(commentId).not.toBeNull();
        expect(postId).not.toBeNull();
        expect(headers).toHaveProperty('Content-Type', 'application/json');
        expect(headers).toHaveProperty('Last-Modified');
        expect(statusCode).toBe(204);
    });

    test('No authorization', async () => {
        delete httpRequest.headers.Authorization;
        const res = await deleteCommentController(httpRequest);
        const {  headers, statusCode, body } = res;
        expect(headers).toHaveProperty('Content-Type', 'application/json');
        expect(body).toEqual({error: 'Unauthorized'});
        expect(statusCode).toBe(401);
    });
});
