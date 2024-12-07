import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./home.css";
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaTimes, FaChevronDown } from "react-icons/fa";

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
      <div className="navbar">
        <div className="nav-item" onClick={() => setAccountMenuOpen(true)}>
          <FaUser />
        </div>
        <div className="nav-item" onClick={() => navigate('/forum')}>
          <FaComments />
        </div>
        <div className="nav-item" onClick={() => navigate('/')}> {/* Add onClick here */}
          <FaHome />
        </div>
        <div className="nav-item">
          <FaCommentDots />
        </div>
        <div className="nav-item">
          <FaQuestionCircle />
        </div>
      </div>
      <form className={`search-container ${searchActive ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
        <button type="submit" className="search-button" onClick={handleSearchClick}>
          <FaSearch />
        </button>
        <input type="text" className="search-input" placeholder="Search..." autoFocus={searchActive} />
      </form>
      <div className={`account-menu ${accountMenuOpen ? 'active' : ''}`}>
        <div className="account-menu-content">
          <div className="account-menu-close" onClick={() => setAccountMenuOpen(false)}>
            <FaChevronDown />
          </div>
          
          <div className="account-header">
            <h1 className="account-title">Účet</h1>
            <div className="profile-circle">
              {/* TODO: Profile image */}
            </div>
          </div>
          
          <div className="profile-section">
            <div className="profile-fields">
              <div className="field-group">
                <label>Jméno</label>
                <div className="input-with-button">
                  <input 
                    type="text" 
                    value={userData.name} 
                    readOnly 
                    onClick={() => copyToClipboard(userData.name)}
                    style={{ cursor: 'pointer' }}
                  />
                  <button className="edit-button">
                    Upravit
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label>Uživatelské jméno</label>
                <div className="input-with-button">
                  <input 
                    type="text" 
                    value={userData.username} 
                    readOnly 
                    onClick={() => copyToClipboard(userData.username)}
                    style={{ cursor: 'pointer' }}
                  />
                  <button className="edit-button">
                    Upravit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        Zkopírováno do schránky
      </div>
    </div>
  );
}

export default App;