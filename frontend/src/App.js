import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientView from './components/PatientView';
import UpdatePatient from './components/UpdatePatient';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PatientList />} />
            <Route path="/add" element={<PatientForm />} />
            <Route path="/chat" element={<Chat />} />
            
            <Route path="/patient/:id" element={<PatientView />} />
            <Route path="/patient/:id/update" element={<UpdatePatient />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;