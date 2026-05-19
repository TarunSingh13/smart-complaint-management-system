const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  addComplaint,
  getAllComplaints,
  updateStatus,
  searchByLocation,
  deleteComplaint,
  saveAiAnalysis
} = require('../controllers/complaintController');

router.post('/', protect, addComplaint);
router.get('/', protect, getAllComplaints);
router.put('/:id', protect, updateStatus);
router.get('/search', protect, searchByLocation);
router.delete('/:id', protect, deleteComplaint);
router.put('/:id/ai', protect, saveAiAnalysis);

module.exports = router;