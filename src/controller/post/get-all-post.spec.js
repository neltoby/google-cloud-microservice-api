const {add_post} = require('../../../__test__/add-post');
const { auth } = require('../../../__test__/test.token');
const { httpRequests } = require('../../../__test__/httpRequest');

const buildFindAllPostController = require('./get-all-post');
const findAllPostController = buildFindAllPostController({ findAllPost: add_post, auth });

describe('get all controller', () => {

    let httpRequest

    beforeEach(() => {
        httpRequest  = httpRequests()
    })

    test('should authenticate user', async () => {
        delete httpRequest.headers.Authorization
        const res = await findAllPostController(httpRequest)
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

    test('user should be able to get all post', async () => {
        const res = await findAllPostController(httpRequest)
        const { headers, body, statusCode } = res
        expect(body).not.toHaveProperty('error')
        expect(statusCode).toBe(200)
    })
})