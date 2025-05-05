const Patient = require('../models/Patient');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail App Password (not regular password)
  }
});

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Your Information Has Been Updated',
      text: `Dear ${patient.name},\n\nYour information has been updated:\nName: ${patient.name}\nAge: ${patient.age}\nAddress: ${patient.address}\nPhone: ${patient.phone}\nEmail: ${patient.email}\n\nBest regards,\nYour Healthcare Team`
    };
    await transporter.sendMail(mailOptions);

    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upload report for a patient
exports.uploadReport = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const report = {
      filename: req.file.originalname,
      path: req.file.path,
      description: req.body.description,
      expirationDate: req.body.expirationDate
    };
    patient.reports.push(report);
    await patient.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'New Report Uploaded',
      text: `Dear ${patient.name},\n\nA new report has been uploaded:\nDescription: ${report.description}\nExpiration Date: ${new Date(report.expirationDate).toLocaleDateString()}\n\nBest regards,\nYour Healthcare Team`
    };
    await transporter.sendMail(mailOptions);

    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Existing updatePatientStatus (unchanged)
exports.updatePatientStatus = async (req, res) => {
  try {
    const { active } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteReport = async (req, res) => {
    try {
      const { patientId, reportId } = req.params;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      const reportIndex = patient.reports.findIndex(report => report._id.toString() === reportId);
      if (reportIndex === -1) {
        return res.status(404).json({ error: 'Report not found' });
      }
  
      // Remove the report file from the server (optional)
      const reportPath = patient.reports[reportIndex].path;
      if (fs.existsSync(reportPath)) {
        fs.unlinkSync(reportPath);
      }
  
      // Remove the report from the array
      patient.reports.splice(reportIndex, 1);
      await patient.save();
  
      res.json(patient);
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({ error: error.message });
    }
  };


// Existing functions (unchanged except for brevity)

