const express = require('express')
const api = express.Router()
const mdAuth = require('../middlewares/auth')
const TagController = require('../controllers/tag')

api.get('/tag', [mdAuth.ensureUser], TagController.getTag);
api.post('/tag', [mdAuth.ensureUser], TagController.createTag);
api.put('/tag', [mdAuth.ensureUser], TagController.updateTag);
api.delete('/tag/id/:id', [mdAuth.ensureUser], TagController.deleteTag);

module.exports = api
