import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./home.css";
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaTimes, FaChevronDown } from "react-icons/fa";
import Navbar from './components/navbar';

function App() {
  const [searchActive, setSearchActive] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate(); // Add this hook
  const [userData, setUserData] = useState({
    name: "cosita", // placeholder, will come from DB
    username: "cosita123" // placeholder, will come from DB
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
        <button className="path-button">
          <div className="path-content">
            <div className="path-text">
              <div className="path-title">Tvoje cesta</div>
              <div className="path-subtitle">nevíš co dál? zde ti pomůžem</div>
            </div>
            <div className="path-arrow">→</div>
          </div>
        </button>

        <button className="path-button">
          <div className="path-content">
            <div className="path-text">
              <div className="path-title">Informační kanál</div>
              <div className="path-subtitle">důležité informace pro tebe</div>
            </div>
            <div className="path-arrow">→</div>
          </div>
        </button>
      </div>
      <Navbar />
    </div>
  );
}

export default App;