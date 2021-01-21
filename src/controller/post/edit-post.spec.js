const {add_post} = require('../../../__test__/add-post');
const { auth } = require('../../../__test__/test.token');
const { httpRequests } = require('../../../__test__/httpRequest');

const buildEditPostController = require('./edit-post');
const editPostController = buildEditPostController({ editPost: add_post, auth });

describe('edit controllerr', () => {

    let httpRequest

    beforeEach(() => {
        httpRequest  = httpRequests()
    })

    test('should authenticate user', async () => {
        delete httpRequest.headers.Authorization
        const res = await editPostController(httpRequest)
        const expected = {
            headers: {
                'Content-Type': 'application/json',
            }, 
            statusCode: 401,
            body: {
                error: 'Unauthorized'
            }
        }
        expect(res).toEqual(expected)
    })

    test('only post owner can edit post', async () => {
        httpRequest.params.ownerId = '5375368ttey54635'
        const res = await editPostController(httpRequest)
        const expected = {
            headers: {
                'Content-Type': 'application/json',
            }, 
            statusCode: 401,
            body: {
                error: 'Unauthorized. You do not have an edit privilege on this resource'
            }
        }
        expect(res).toEqual(expected)
    })

    test('user should be able to edit post', async () => {
        const res = await editPostController(httpRequest)
        const { headers, body, statusCode } = res
        expect(headers).toHaveProperty('Last-Modified')
        expect(body).not.toHaveProperty('error')
        expect(statusCode).toBe(201)
    })
})