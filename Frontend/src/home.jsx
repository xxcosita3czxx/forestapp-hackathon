import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./home.css";
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaTimes, FaChevronDown, FaArrowRight } from "react-icons/fa";
import Navbar from './components/navbar';

function App() {  
  const userId = localStorage.getItem('userId');
  const sessionId = localStorage.getItem("sessionId")
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:8000/auth/verify/${sessionId}&${userId}`, {
          method: 'POST',
          headers: {
            'Accept':"application/json",
          }
        });
          
        if (response.status !== 200) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/login");
      }
    };

    verify();
  }, [navigate]);

  const [searchActive, setSearchActive] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "name", // placeholder, will come from DB
    username: "username" // placeholder, will come from DB
  });
  const [showToast, setShowToast] = useState(false); // Add new state for toast

  useEffect(() => {
    const fetchTheme = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:8000/users/settings/set/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) return;

        const data = await response.json();
        const theme = data.settings.theme;

        // Apply theme
        const gradients = {
          PINK: 'linear-gradient(45deg, #FF55E3, #F3C1EE)',
          BLUE: 'linear-gradient(45deg, #55B4FF, #C1E4EE)',
          GREEN: 'linear-gradient(45deg, #55FF7E, #C1EED3)',
          BLACK: 'linear-gradient(45deg, #333333, #666666)'
        };

        document.body.style.background = gradients[theme];

      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  }, [userId]);

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