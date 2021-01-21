const Post = require('.')
const { makePost, makeSource } = Post
const faker = require('faker')
const makeFakePost = require('../../__test__/post')

describe('post', () => {
    test('post must not be empty', () => {
        const fakePost = makeFakePost({post: undefined})
        expect(() => makePost(fakePost)).toThrow('You did not have a content')
    })
    test('ownerId must not be empty', () => {
        const fakePost = makeFakePost({ownerId: undefined})
        expect(() => makePost(fakePost)).toThrow('Unknown identifier')
    })
    test('source must not be empty', () => {
        const fakePost = makeFakePost({source: undefined})
        expect(() => makePost(fakePost)).toThrow()
    })
    test('ip must not be empty', () => {
        const source = {
            ip: '',
            browser: faker.internet.userAgent(),
            referrer: faker.internet.url()
        }
        expect(() => makeSource(source)).toThrow()
    })
    test('referrer must not be empty', () => {
        const source = {
            ip: 'faker.internet.ip()',
            browser: faker.internet.userAgent(),
            referrer: faker.internet.url()
        }
        expect(() => makeSource(source)).toThrow()
    })
    test('browser must not be empty', () => {
        const source = {
            ip: faker.internet.ip(),
            browser: undefined,
            referrer: faker.internet.url()
        }
        expect(() => makeSource(source)).toThrow()
    })
    test('referrer must not be empty', () => {
        const source = {
            ip: faker.internet.ip(),
            browser: faker.internet.userAgent(),
            referrer: undefined
        }
        expect(() => makeSource(source)).toThrow()
    })
    test('ip must not be empty in a post', () => {
        const source = {
            ip: '',
            browser: faker.internet.userAgent(),
            referrer: faker.internet.url()
        }
        const fakePost = makeFakePost({source})
        expect(() => makePost(fakePost)).toThrow()
    })
    test('browser must not be empty in a post', () => {
        const source = {
            ip: faker.internet.ip(),
            browser: '',
            referrer: faker.internet.url()
        }
        const fakePost = makeFakePost({source})
        expect(() => makePost(fakePost)).toThrow()
    })
    test('referrer must not be empty in a post', () => {
        const source = {
            ip: faker.internet.ip(),
            browser: faker.internet.userAgent(),
            referrer: ''
        }
        const fakePost = makeFakePost({source})
        expect(() => makePost(fakePost)).toThrow()
    })
    test('getters', () => {
        const fakePost = makeFakePost({})
        const post = makePost(fakePost)
        expect(post.getPost).toBe(fakePost.post)
        expect(post.getOwnerId).toBe(fakePost.ownerId)
        expect(post.getCreatedOn).toBe(fakePost.createdOn)
        expect(post.getNoOfLikes).toBe(fakePost.likes.length)
        expect(post.getReviews).toBe(fakePost.reviews)
        expect(post.getPublished).toBe(fakePost.published)
        expect(post.getComments).toBe(fakePost.comments)
        const source = post.getSource
        expect(source.getIp()).toBe(fakePost.source.ip)
        expect(post.getDeletedOn).toBeNull()
        expect(post.getId).toBeNull()
    })
    test('post setter must accept a string', ()=> {
        const fakePost = makeFakePost({})
        const post = makePost(fakePost)
        expect(() => post.setPost(undefined)).toThrow('You did not have a content')
        expect(post.getPost).toBe(fakePost.post)
    })
    test('post must accept only string', ()=> {
        const fakePost = makeFakePost({ post: '<script>alert("I came")</script>'})
        expect(() => makePost(fakePost)).toThrow('Invalid string type')
    })
    test('post setter must sanitize string', ()=> {
        const fakePost = makeFakePost({})
        const post = makePost(fakePost)
        const str = '<script>alert("I came")</script>'
        expect(() => post.setPost(str)).toThrow('Invalid string type')
        expect(post.getPost).toBe(fakePost.post)
    })
    test('post setter must sanitize string', ()=> {
        const fakePost = makeFakePost({})
        const post = makePost(fakePost)
        const str = '<script>alert("I came")</script>'
        expect(() => post.setPost(str)).toThrow('Invalid string type')
        expect(post.getPost).toBe(fakePost.post)
    })
    test('post can be deleted', ()=> {
        const fakePost = makeFakePost({})
        const post = makePost(fakePost)
        expect(post.getPost).toBe(fakePost.post)
        expect(post.getOwnerId).toBe(fakePost.ownerId)
        expect(post.getDeletedOn).toBeNull()
        post.deletePost(fakePost.source)
        expect(post.getPost).toBeNull()
        // expect(post.getOwnerId).toBeNull()
        expect(post.getDeletedOn).not.toBeNull()
    })
    test('post can be published', ()=> {
        const fakePost = makeFakePost()
        const post = makePost(fakePost)
        expect(post.getPublished).toBe(false)
        post.setPublished()
        expect(post.getPublished).toBe(true)
    })
    test('post can be unpublished', ()=> {
        const fakePost = makeFakePost({published: true})
        const post = makePost(fakePost)
        expect(post.getPublished).toBe(true)
        post.unpublished()
        expect(post.getPublished).toBe(false)
    })
    test('post id can be set', ()=> {
        const fakePost = makeFakePost({})
        const post = makePost(fakePost)
        expect(post.getId).toBeNull()
        post.setId(2)
        expect(post.getId).toBe(2)
    })
})
