const faker = require('faker');

module.exports = function makeFakeUser (overrides) {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        country: faker.address.country(),
        state: faker.address.state(),
        municipal: faker.address.county(),
    }
    
    return {
        ...user,
        ...overrides
    }
};