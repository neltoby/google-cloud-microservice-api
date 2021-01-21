const faker = require('faker');

exports.httpRequests = () => ({
    body: {
        post: 'hi, i love my post',
        title: 'Hello, its my new title', 
        comment: 'Hi there, its a new comment',
        newComment: 'My new Comment',
        updates: {
            post: 'I love updates',
            title: 'I love titles'
        }
    },
    params: {
        postId: faker.random.uuid(),
        ownerId: '43654e68468e5327ye78',
        commentId: faker.random.uuid()
    },
    query: {},
    ip: faker.internet.ip(),
    path: '/',
    method: 'post',
    headers: {
        'Content-Type': 'appplication/json',
        Referer: faker.internet.url(),
        'User-Agent': faker.internet.userAgent(),
        'Authorization': 'Bearer eysrsteyey.teyeteyejdg.gdydkhdk'
    }
});