const User = require('.');
const { makeUser, validator, sha256 } = User;
const makeFakeUser = require('../../__test__/user');

describe('user', () => {
    test('name not included', () => {
        const name = makeFakeUser({ name: null})
        expect(() => makeUser(name)).toThrow('Name cannot be empty')
    })
    test('email not included', () => {
        const email = makeFakeUser({ email: null})
        expect(() => makeUser(email)).toThrow('Email cannot be empty')
    })
    test('email must be valid', () => {
        const email = makeFakeUser({ email: 'nelly'})
        expect(() => makeUser(email)).toThrow('Email is not valid')
    })
    // test('password not included', () => {
    //     const password = makeFakeUser({ password: null })
    //     expect(() => makeUser(password)).toThrow('Password cannot be empty')
    // })
    // test('password hashed', () => {
    //     const password = makeFakeUser({})
    //     const user_details = makeUser(password)
    //     user_details.setPassword(password.password)
    //     expect(user_details.getPassword).not.toBe(password.password)
    // })
    test('country not included', () => {
        const country = makeFakeUser({ country: null })
        expect(() => makeUser(country)).toThrow('Country cannot be empty')
    })
    test('state not included', () => {
        const state = makeFakeUser({ state: null })
        expect(() => makeUser(state)).toThrow('State cannot be empty')
    })
    test('municipal not included', () => {
        const municipal = makeFakeUser({ municipal: null})
        expect(() => makeUser(municipal)).toThrow('Municipal cannot be empty')
    })
    test('id can be set', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(user.getId).toBeNull()
        user.setId(2)
        expect(user.getId).toBe(2)
    })
    test('name can be set', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(user.getName).toBe(fakeuser.name)
        user.setName('Tobechukwu Emmanuel')
        expect(user.getName).toBe('Tobechukwu Emmanuel')
    })
    test('email reset must not be empty', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(() => user.setEmail('')).toThrow('Email cannot be empty')
        expect(user.getEmail).toBe(fakeuser.email)
    })
    test('email reset must be valid', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(() => user.setEmail('neltoby')).toThrow('Email is not valid')
        expect(user.getEmail).toBe(fakeuser.email)
    })
    test('email can be reset', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(user.getEmail).toBe(fakeuser.email)
        user.setEmail('neltoby@gmail.com')
        expect(user.getEmail).toBe('neltoby@gmail.com')
    })
    test('password reset must not be empty', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(() => user.setPassword('')).toThrow('Password cannot be empty')
        expect(user.getPassword).toBeNull()
    })
    test('password reset must be hashed', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        user.setPassword('new_password')
        expect(user.getPassword).not.toBe('new_password')
        const hashed_password = sha256('new_password')
        expect(user.getPassword).toBe(hashed_password)
    })
    test('country reset must not be empty', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(() => user.setCountry('')).toThrow('Country cannot be empty')
        expect(user.getCountry).toBe(fakeuser.country)
    })
    test('country can be reset', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(user.getCountry).toBe(fakeuser.country)
        user.setCountry('Nigeria')
        expect(user.getCountry).toBe('Nigeria')
    })
    test('state reset must not be empty', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(() => user.setState('')).toThrow('State cannot be empty')
        expect(user.getState).toBe(fakeuser.state)
    })
    test('state can be reset', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(user.getState).toBe(fakeuser.state)
        user.setState('Lagos')
        expect(user.getState).toBe('Lagos')
    })
    test('municipal reset must not be empty', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(() => user.setMunicipal('')).toThrow('Municipal cannot be empty')
        expect(user.getMunicipal).toBe(fakeuser.municipal)
    })
    test('municipal can be reset', () => {
        const fakeuser = makeFakeUser({})
        const user = makeUser(fakeuser)
        expect(user.getMunicipal).toBe(fakeuser.municipal)
        user.setMunicipal('Lagos island')
        expect(user.getMunicipal).toBe('Lagos island')
    })
})