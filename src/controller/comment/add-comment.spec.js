const {add_post} = require('../../../__test__/add-post');
const { auth } = require('../../../__test__/test.token');
const { httpRequests } = require('../../../__test__/httpRequest');

const buildAddCommentController = require('./add-comment');
const addCommentController = buildAddCommentController({ createComment: add_post, auth });

describe('add-comment controller', () => {

    let httpRequest;
    
    beforeEach(() => {
        httpRequest = httpRequests();
    });

    test('No authorization', async () => {
        delete httpRequest.headers.Authorization;
        const res = await addCommentController(httpRequest);
        const {  headers, statusCode, body } = res;
        expect(headers).toHaveProperty('Content-Type', 'application/json');
        expect(body).toEqual({error: 'Unauthorized'});
        expect(statusCode).toBe(401);
    });

    test('userId should be present in httpRequest', async () => {
        const res = await addCommentController(httpRequest);
        const { body: { userId, comment}, headers, statusCode } = res;
        expect(userId).not.toBeNull();
        expect(comment).not.toBeNull();
        expect(headers).toHaveProperty('Content-Type', 'application/json');
        expect(headers).toHaveProperty('Last-Modified');
        expect(statusCode).toBe(201);
    });
});