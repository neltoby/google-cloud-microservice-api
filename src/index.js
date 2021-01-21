require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const httpRequest = require('./httpRequest')

const {
    addPostController,
    deleteController,
    editPostController,
    findAllPostController,
    findPostByIdController,
    likePostController,
    unlikePostController,
} = require('./controller')

const app = express()

const apiRoute = process.env.API_ROUTE

app.get(`${apiRoute}`, httpRequest(findAllPostController))

app.get(`${apiRoute}/:postId`, httpRequest(findPostByIdController))

app.post(`${apiRoute}`, httpRequest(addPostController))

app.put(`${apiRoute}/:postId`, httpRequest(editPostController))

app.post(`${apiRoute}/like/:postId`, httpRequest(likePostController))

app.delete(`${apiRoute}/unlike/:postId`, httpRequest(unlikePostController))

app.delete(`${apiRoute}/:postId`, httpRequest(deleteController))

module.exports = app