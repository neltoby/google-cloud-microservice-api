const faker = require('faker');

module.exports = function (overrides) {
    const post = {
        post: faker.lorem.paragraphs(2),
        title: faker.lorem.paragraphs(1),
        ownerId: faker.random.uuid(),
        fullname: 'Emmanuel',
        createdOn: Date.now(),
        reviews: faker.random.arrayElements(),
        source: {
            ip: faker.internet.ip(),
            referrer: faker.internet.url(),
            browser: faker.internet.userAgent()
        }
    }

    return {
        ...post,
        ...overrides
    }
};