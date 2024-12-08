import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./home.css";
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaTimes, FaChevronDown, FaArrowRight } from "react-icons/fa";
import Navbar from './components/navbar';

function App() {  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem("token");
  
  const [searchActive, setSearchActive] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate(); // Add this hook
  const [userData, setUserData] = useState({
    name: "name", // placeholder, will come from DB
    username: "username" // placeholder, will come from DB
  });
  const [showToast, setShowToast] = useState(false); // Add new state for toast

  const handleSearchClick = (e) => {
    if (!searchActive) {
      e.preventDefault();
    }
    setSearchActive(!searchActive);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted");
  };

  // Modified copyToClipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000); // Hide after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Home1</h1>
      </div>
      <div className="content">
        <div className="cards-container">
          <a 
            onClick={(e) => {
              e.preventDefault();
              navigate('/journey');
            }} 
            className="card journey"
          >
            <div className="card-content">
              <div>
                <h2>Tvoje cesta</h2>
                <p>Nevíš jak dál? Zde ti poradíme</p>
              </div>
              <FaArrowRight className="arrow-icon" />
            </div>
          </a>
          
          <a href="#" className="card info">
            <div className="card-content">
              <div>
                <h2>Informační kanál</h2>
                <p>Informace a oznámení</p>
              </div>
              <FaArrowRight className="arrow-icon" />
            </div>
          </a>
        </div>
      </div>
      <Navbar />
    </div>
  );
}

export default App;