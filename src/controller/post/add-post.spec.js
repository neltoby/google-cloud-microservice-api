const {add_post} = require('../../../__test__/add-post');
const { auth } = require('../../../__test__/test.token');
const { httpRequests } = require('../../../__test__/httpRequest');

const buildAddPostController = require('./add-post');
const addPostController = buildAddPostController({ addPost: add_post, auth });

describe('add-post controller', () => {

    let httpRequest;
    
    beforeEach(() => {
        httpRequest = httpRequests();
    });

    test('should authenticate user', async () => {
        delete httpRequest.headers.Authorization;
        const res = await addPostController(httpRequest);
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

    test('userId should be present in httpRequest', async () => {
        const res = await addPostController(httpRequest);
        const { body: { userId, post}, headers, statusCode } = res;
        expect(userId).not.toBeNull();
        expect(post).not.toBeNull();
        expect(headers).toHaveProperty('Content-Type', 'application/json');
        expect(headers).toHaveProperty('Last-Modified');
        expect(statusCode).toBe(201);
    });
});