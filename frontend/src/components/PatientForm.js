import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../services/api';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient(formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <div className="card animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-primary">Register New Patient</h2>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-outline"
        >
          <FiArrowLeft className="btn-icon" />
          Back
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className="form-control"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-control"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary mt-4">
          <FiSave className="btn-icon" />
          Register Patient
        </button>
      </form>
    </div>
  );
};

export default PatientForm;