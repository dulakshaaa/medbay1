const express = require('express');
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  uploadReport,
  updatePatientStatus,
  deleteReport // Added new controller
} = require('../controllers/patientController');
const multer = require('multer');

// Configure Multer for file uploads (unchanged)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Patient routes
router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.post('/:id/reports', upload.single('report'), uploadReport);
router.put('/:id/status', updatePatientStatus);
router.delete('/:patientId/reports/:reportId', deleteReport); // New DELETE route

module.exports = router;