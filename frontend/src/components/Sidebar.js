import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUserPlus, FiUsers, FiSettings, FiMessageSquare } from 'react-icons/fi';

const Sidebar = ({ onChatbotToggle, isChatbotOpen }) => {
  return (
    <aside className="sidebar">
      <h2 className="text-center mb-8">Hospital MS</h2>
      <nav>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FiHome className="nav-icon" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add" className="nav-link">
              <FiUserPlus className="nav-icon" />
              Add Patient
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FiUsers className="nav-icon" />
              Patients
            </Link>
          </li>
          
          <li className="nav-item">
            <a href="#settings" className="nav-link">
              <FiSettings className="nav-icon" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;