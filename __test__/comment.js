const faker = require('faker');

module.exports = function (overrides) {
    const comment = {
        postId: faker.random.uuid(), 
        ownerId: faker.random.uuid(), 
        comment: faker.lorem.paragraphs(3), 
        likes: [faker.random.arrayElements()],
        createdOn: Date.now(),
        published: true,
        fullname: faker.name.findName(),
        source: {
            ip: faker.internet.ip(),
            referrer: faker.internet.url(),
            browser: faker.internet.userAgent()
        }
    }

    return {
        ...comment,
        ...overrides
    }
};