const faker = require('faker');

module.exports = function (overrides) {
    const post = {
        post: faker.lorem.paragraphs(2),
        title: faker.lorem.paragraphs(1),
        ownerId: faker.random.uuid(),
        createdOn: Date.now(),
        likes: faker.random.arrayElements(),
        reviews: faker.random.arrayElements(),
        published: false,
        comments: faker.random.arrayElements(),
        deletedOn: Date.now(),
        id: faker.random.uuid(),
        source: {
            ip: faker.internet.ip(),
            referrer: faker.internet.url(),
            browser: faker.internet.userAgent()
        },
        fullname: 'Emmanuel'
    }

    return {
        ...post,
        ...overrides
    }
};