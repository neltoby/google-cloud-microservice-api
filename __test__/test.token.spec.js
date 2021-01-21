const { verifyToken } = require('../src/authentication')
const { auth } = require('./test.token');

describe('auth object test', () => {
    
    test('verifyToken should return object with uid property', async () => {
        const { uid } = await auth.verifyToken({token: 'token'})
        expect(uid).toBeDefined()
        expect(uid).toBe('43654e68468e5327ye78')
    })
});