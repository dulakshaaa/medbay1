const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  reports: [{
    filename: String,
    path: String,
    description: String,
    expirationDate: Date,
    uploadedAt: { type: Date, default: Date.now }
  }],
  active: { type: Boolean, default: true } // Added active field with default true
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);