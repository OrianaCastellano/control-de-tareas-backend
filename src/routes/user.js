const express = require('express')
const api = express.Router()
const mdAuth = require('../middlewares/auth')
const UserController = require('../controllers/user')


// public routes
api.post('/user/signin', UserController.signin)
api.post('/user/signup', UserController.signup)

// restricted routes user
api.get('/user/stats',[mdAuth.ensureUser], UserController.getStats);

module.exports = api
