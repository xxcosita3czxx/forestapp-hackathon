import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./home.css";
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaTimes, FaChevronDown, FaArrowRight } from "react-icons/fa";
import Navbar from './components/navbar';

function App() {  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/settings/set/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json(); // 
        console.log('Response Data:', data);
  
        const theme = data.theme || 'default';
        console.log('Theme:', theme);
  
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, [userId]); // Závislost na `userId`

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