import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById, updatePatientStatus, deleteReport } from '../services/api';
import { FiUser, FiEdit, FiArrowLeft, FiFileText, FiPower, FiTrash2, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';

function PatientView() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  const handleToggleStatus = async () => {
    try {
      const newStatus = !patient.active;
      await updatePatientStatus(id, { active: newStatus });
      setPatient({ ...patient, active: newStatus });
    } catch (error) {
      console.error('Error toggling patient status:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await deleteReport(id, reportId);
      setPatient(response.data);
      setMessage('Report deleted successfully');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error deleting report:', error);
      setMessage('Failed to delete report');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleGeneratePDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Add title
      doc.setFontSize(18);
      doc.text('Patient Medical Report', 20, yPosition);
      yPosition += 10;

      // Add patient details
      doc.setFontSize(12);
      doc.text(`Name: ${patient.name}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Email: ${patient.email}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Age: ${patient.age}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Phone: ${patient.phone}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Address: ${patient.address}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Status: ${patient.active ? 'Active' : 'Deactivated'}`, 20, yPosition);
      yPosition += 20;

      // Add medical reports section
      doc.setFontSize(14);
      doc.text('Medical Reports', 20, yPosition);
      yPosition += 10;

      if (patient.reports && patient.reports.length > 0) {
        doc.setFontSize(12);
        patient.reports.forEach((report, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`Report ${index + 1}: ${report.description}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Expires: ${new Date(report.expirationDate).toLocaleDateString()}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Path: http://localhost:5000/${report.path}`, 20, yPosition);
          yPosition += 10;
        });
      } else {
        doc.setFontSize(12);
        doc.text('No reports available', 20, yPosition);
        yPosition += 10;
      }

      // Add footer with generation date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);

      // Download the PDF
      doc.save(`patient_${id}_details.pdf`);
      setMessage('PDF generated and downloaded successfully');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage('Failed to generate PDF');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (!patient) return <div className="card text-danger">Patient not found</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h1>Patient Details</h1>
        <Link to="/" className="btn btn-outline">
          <FiArrowLeft className="btn-icon" />
          Back to List
        </Link>
      </div>

      <div className="card mb-4">
        <div className="flex items-center p-4" style={{ borderBottom: '1px solid var(--gray-light)' }}>
          <div className="rounded-full" style={{ backgroundColor: '#e6f0ff', padding: '0.75rem' }}>
            <FiUser style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <h2>{patient.name}</h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>{patient.email}</p>
            <p className={patient.active ? 'text-success' : 'text-danger'} style={{ fontSize: '0.875rem' }}>
              Status: {patient.active ? 'Active' : 'Deactivated'}
            </p>
          </div>
        </div>
        
        <div className="p-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Age</span>
            <div style={{ fontWeight: 500 }}>{patient.age}</div>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Phone</span>
            <div style={{ fontWeight: 500 }}>{patient.phone}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Address</span>
            <div style={{ fontWeight: 500 }}>{patient.address}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4" style={{ borderBottom: '1px solid var(--gray-light)' }}>
          <h2>Medical Reports</h2>
        </div>
        {patient.reports && patient.reports.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--gray-light)' }}>
            {patient.reports.map((report, index) => (
              <div 
                key={index} 
                className="p-4"
                style={{ 
                  borderBottom: index < patient.reports.length - 1 ? '1px solid var(--gray-light)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p style={{ fontWeight: 500 }}>{report.description}</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                      Expires: {new Date(report.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`http://localhost:5000/${report.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      <FiFileText className="btn-icon" />
                      View Report
                    </a>
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="btn btn-danger"
                    >
                      <FiTrash2 className="btn-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-muted">No reports available</div>
        )}
        {message && (
          <div 
            className={`p-4 text-center ${message.includes('successfully') ? 'text-success' : 'text-danger'}`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link to={`/patient/${id}/update`} className="btn btn-primary">
          <FiEdit className="btn-icon" />
          Update Patient
        </Link>
        <button 
          onClick={handleToggleStatus} 
          className={`btn ${patient.active ? 'btn-danger' : 'btn-success'}`}
        >
          <FiPower className="btn-icon" />
          {patient.active ? 'Deactivate' : 'Activate'}
        </button>
        <button 
          onClick={handleGeneratePDF} 
          className="btn btn-primary"
        >
          <FiDownload className="btn-icon" />
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default PatientView;