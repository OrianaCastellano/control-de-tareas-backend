const express = require('express')
const api = express.Router()
const mdAuth = require('../middlewares/auth')
const TaskController = require('../controllers/task')
const multer = require('multer');
const upload = multer();

api.get('/task', [mdAuth.ensureUser], TaskController.getTask);
api.get('/task/text', [mdAuth.ensureUser], TaskController.getTaskByText);
api.get('/task/id/:id', [mdAuth.ensureUser], TaskController.getTaskById);
api.post('/task', [mdAuth.ensureUser], upload.array('files'), TaskController.createTask);
api.put('/task', [mdAuth.ensureUser], upload.array('files_new'), TaskController.updateTask);
api.put('/task/tag', [mdAuth.ensureUser], TaskController.assignTagByTask);
api.put('/task/position', [mdAuth.ensureUser], TaskController.updatePositionTask);
api.put('/task/pinned', [mdAuth.ensureUser], TaskController.updatePinnedTask);
api.put('/task/finish', [mdAuth.ensureUser], TaskController.updateStatusTask);
api.delete('/task/id/:id', [mdAuth.ensureUser], TaskController.deleteTask);

module.exports = api
