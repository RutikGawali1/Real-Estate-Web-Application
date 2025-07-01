const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinaryController = require('../controllers/cloudinaryController');

router.post('/upload', upload.single('file'), cloudinaryController.uploadFile);

router.post('/get', cloudinaryController.getFile);

router.post('/delete', cloudinaryController.deleteFile);

module.exports = router;