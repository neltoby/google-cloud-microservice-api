const {add_post} = require('../../../__test__/add-post');
const { auth } = require('../../../__test__/test.token');
const { httpRequests } = require('../../../__test__/httpRequest');

const buildEditCommentController = require('./edit-comment');
const editCommentController = buildEditCommentController({ editComment: add_post, auth });

describe('edit comment controllerr', () => {

    let httpRequest;

    beforeEach(() => {
        httpRequest  = httpRequests();
    });

    test('should authenticate user', async () => {
        delete httpRequest.headers.Authorization;
        const res = await editCommentController(httpRequest);
        const expected = {
            headers: {
                'Content-Type': 'application/json',
            }, 
            statusCode: 401,
            body: {
                error: 'Unauthorized'
            }
        };
        expect(res).toEqual(expected);
    });

    test('newComment must be present', async () => {
        delete httpRequest.body.newComment;
        const res = await editCommentController(httpRequest);
        const expected = {
            headers: {
                'Content-Type': 'application/json',
            }, 
            statusCode: 400,
            body: {
                error: 'Bad request.Comment content missing'
            }
        };
        expect(res).toEqual(expected);
    });

    test('user should be able to edit comment', async () => {
        const res = await editCommentController(httpRequest);
        const { headers, body, statusCode } = res;
        expect(headers).toHaveProperty('Last-Modified');
        expect(body).not.toHaveProperty('error');
        expect(statusCode).toBe(201);
    });
});