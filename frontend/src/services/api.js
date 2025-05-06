import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patients';
const API_URL2 = 'http://localhost:5000/api';

export const createPatient = (patientData) => axios.post(API_URL, patientData);
export const getAllPatients = () => axios.get(API_URL);
export const getPatientById = (id) => axios.get(`${API_URL}/${id}`);
export const updatePatient = (id, patientData) => axios.put(`${API_URL}/${id}`, patientData);
export const uploadReport = (id, formData) => {
  return axios.post(`${API_URL}/${id}/reports`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updatePatientStatus = (id, statusData) => {
  return axios.put(`${API_URL}/${id}/status`, statusData);
};
export const deleteReport = (patientId, reportId) => {
  return axios.delete(`${API_URL}/${patientId}/reports/${reportId}`);
};
export const generateReport = async (patientId, reportData) => {
  const response = await axios.post(`/patients/${patientId}/reports`, reportData);
  return response.data;
};

export const sendMessage = (message) => {
  return axios.post(`${API_URL2}/chat`, { message });
};

export const getChatHistory = () => {
  return axios.get(`${API_URL2}/chat/history`);
};

export const uploadPdf = (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return axios.post(`${API_URL2}/pdf/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const generatePDF = async (patientId) => {
  const response = await axios.get(`${API_URL}/${patientId}/pdf`, {
    responseType: 'blob' // Important for handling PDF binary data
  });
  return response.data;
};