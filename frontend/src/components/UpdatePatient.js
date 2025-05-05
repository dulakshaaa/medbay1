import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, updatePatient, uploadReport } from '../services/api';
import { FiSave, FiUpload, FiArrowLeft } from 'react-icons/fi';

function UpdatePatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    address: '',
    phone: '',
    email: ''
  });
  const [reportData, setReportData] = useState({
    description: '',
    expirationDate: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // New state for success/failure message

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatientById(id);
        setPatient(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handlePatientChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleReportChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(id, patient);
      setMessage('Update successful');
      setTimeout(() => {
        setMessage('');
        navigate(`/patient/${id}`);
      }, 2000); // Clear message and navigate after 2 seconds
    } catch (error) {
      console.error('Error updating patient:', error);
      setMessage('Update unsuccessful');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    const formData = new FormData();
    formData.append('report', file);
    formData.append('description', reportData.description);
    formData.append('expirationDate', reportData.expirationDate);

    try {
      await uploadReport(id, formData);
      const response = await getPatientById(id);
      setPatient(response.data);
      setReportData({ description: '', expirationDate: '' });
      setFile(null);
      document.getElementById('report-form').reset();
      setMessage('Report upload successful');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    } catch (error) {
      console.error('Error uploading report:', error);
      setMessage('Report upload unsuccessful');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h1>Update Patient</h1>
        <button 
          onClick={() => navigate(`/patient/${id}`)} 
          className="btn btn-outline"
        >
          <FiArrowLeft className="btn-icon" />
          Back to View
        </button>
      </div>

      <div className="card mb-4">
        <div className="p-4" style={{ borderBottom: '1px solid var(--gray-light)' }}>
          <h2>Basic Information</h2>
        </div>
        <form onSubmit={handlePatientSubmit} className="p-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={patient.name}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                value={patient.age}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={patient.address}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={patient.phone}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={patient.email}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-8">
            <FiSave className="btn-icon" />
            Update Information
          </button>
          {message && (
            <div 
              className={`mt-4 text-center ${message.includes('successful') ? 'text-success' : 'text-danger'}`}
            >
              {message}
            </div>
          )}
        </form>
      </div>

      <div className="card">
        <div className="p-4" style={{ borderBottom: '1px solid var(--gray-light)' }}>
          <h2>Upload New Report</h2>
        </div>
        <form id="report-form" onSubmit={handleReportSubmit} className="p-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={reportData.description}
                onChange={handleReportChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={reportData.expirationDate}
                onChange={handleReportChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Report File (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="form-control"
                style={{ padding: '0.5rem' }}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-8">
            <FiUpload className="btn-icon" />
            Upload Report
          </button>
          {message && (
            <div 
              className={`mt-4 text-center ${message.includes('successful') ? 'text-success' : 'text-danger'}`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UpdatePatient;