const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.chat);
router.get('/history', chatController.getHistory);

module.exports = router;