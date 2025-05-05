import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPatients, generateReport } from '../services/api';
import { FiUser, FiPlus, FiFileText, FiSearch, FiFilePlus } from 'react-icons/fi';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingReports, setGeneratingReports] = useState({}); // Track generating state per patient
  const [message, setMessage] = useState({ text: '', type: '' }); // Success/error messages

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        setPatients(response.data);
        setFilteredPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const results = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const handleGenerateReport = async (patientId, patientName) => {
    setGeneratingReports(prev => ({ ...prev, [patientId]: true }));
    
    try {
      const reportData = {
        description: `Medical Report for ${patientName}`,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      
      await generateReport(patientId, reportData);
      setMessage({ text: `Report generated for ${patientName}`, type: 'success' });
      
      // Refresh patient list
      const response = await getAllPatients();
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      setMessage({ text: `Failed to generate report for ${patientName}`, type: 'error' });
    } finally {
      setGeneratingReports(prev => ({ ...prev, [patientId]: false }));
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h1>Patient Records</h1>
        <Link to="/add" className="btn btn-primary">
          <FiPlus className="btn-icon" />
          Add New Patient
        </Link>
      </div>

      {/* Message Notification */}
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="card mb-4">
        <div style={{
          position: 'relative',
          width: '100%'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            paddingLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <FiSearch style={{ color: '#9CA3AF' }} />
          </div>
          <input
            type="text"
            placeholder="Search patients by name..."
            style={{
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              width: '100%',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#3B82F6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <tr key={patient._id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="rounded-full" style={{ backgroundColor: '#e6f0ff', padding: '0.5rem' }}>
                          <FiUser style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{patient.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.875rem' }}>{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{patient.age}</td>
                    <td>{patient.phone}</td>
                    <td>
                      <span className={patient.active ? 'text-success' : 'text-danger'}>
                        {patient.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/patient/${patient._id}`} className="btn btn-outline">
                          <FiFileText className="btn-icon" />
                          View
                        </Link>
                        <button
                          onClick={() => handleGenerateReport(patient._id, patient.name)}
                          className="btn btn-primary"
                          disabled={generatingReports[patient._id]}
                        >
                          <FiFilePlus className="btn-icon" />
                          {generatingReports[patient._id] ? 'Generating...' : 'Report'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;