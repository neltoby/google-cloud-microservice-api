const crypto = require('crypto')
const EmailValidator = require('email-validator')
const buildUsers = require('./user');

const sha256 = password => {
    return crypto.createHash('sha256')
    .update(password,'binary')
    .digest('base64')
}

const validator = email => {
    return EmailValidator.validate(email)
}

const makeUser = buildUsers({hash: sha256,  emailMatch: validator})
module.exports = { makeUser, validator, sha256 }