const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { analyzeComplaint } = require('../controllers/aiController');

router.post('/analyze', protect, analyzeComplaint);

module.exports = router;