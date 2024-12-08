import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaTimes, FaChevronDown } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import './navbar.css';


const token = localStorage.getItem("token");
const THEMES = {
  PINK: {
    from: '#FF55E3',
    to: '#F3C1EE'
  },
  BLUE: {
    from: '#55A2FF',
    to: '#C1DBF3'
  },
  GREEN: {
    from: '#74FF55',
    to: '#CEF3C1'
  },
  BLACK: {
    from: '#696969',
    to: '#151515'
  }
};

const Navbar = () => {
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchColor = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/settings/set/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json(); // 
        console.log('Response Data:', data);
  
        const theme = data.settings.theme;
        console.log('Theme:', theme);
  
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchColor();
  }, [userId]); // Závislost na `userId`

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "cosita",
    username: "cosita123" 
  });
  const [showToast, setShowToast] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('PINK');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const toggleSettings = () => {
    if (accountMenuOpen) {
      setAccountMenuOpen(false);
      setTimeout(() => setSettingsOpen(true), 300); // Wait for account menu animation to finish
    } else {
      setSettingsOpen(true);
    }
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setTimeout(() => setAccountMenuOpen(true), 300); // Wait for settings animation to finish
  };
  
  const handleThemeChange = async (e) => {
    const selectedTheme = e.target.value;
    setCurrentTheme(selectedTheme);
    
    // Define gradients
    const gradients = {
      PINK: 'linear-gradient(45deg, #FF55E3, #F3C1EE)',
      BLUE: 'linear-gradient(45deg, #55B4FF, #C1E4EE)', 
      GREEN: 'linear-gradient(45deg, #55FF7E, #C1EED3)',
      BLACK: 'linear-gradient(45deg, #333333, #666666)'
    };

    // Update background
    document.body.style.background = gradients[selectedTheme];
    document.body.style.transition = 'background 0.3s ease';

    // Save to backend
    try {
      await fetch(`http://localhost:8000/users/settings/set/${userId}&settings&theme&${selectedTheme}`, {
        method: 'PATCH',
        headers: {
          'Accept': "application/json",
          'Authorization': `Bearer ${token}`,
        }
      });
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  

  return (
    <>
      <div className="navbar">
        <div className="nav-item" onClick={() => setAccountMenuOpen(true)}>
          <FaUser />
        </div>
        <div className="nav-item" onClick={() => navigate('/forum')}>
          <FaComments />
        </div>
        <div className="nav-item" onClick={() => navigate('/')}>
          <FaHome />
        </div>
        <div className="nav-item" onClick={() => navigate('/chathistory')}>
          <FaCommentDots />
        </div>
        <div className="nav-item">
          <FaQuestionCircle />
        </div>
      </div>

      <div className={`account-menu ${accountMenuOpen ? 'active' : ''}`}>
        <div className="account-menu-content">
          <div className="account-menu-close" onClick={() => setAccountMenuOpen(false)}>
            <FaChevronDown />
          </div>
          
          <div className="account-header">
            <h1 className="account-title">Účet</h1>
            <div className="account-settings-icon" onClick={toggleSettings}>
              <FiSettings />
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
            <button
              className="logout-button"
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </div>

      <div className={`account-menu ${settingsOpen ? 'active' : ''}`}>
        <div className="account-menu-content">
          <div className="account-menu-close" onClick={handleSettingsClose}>
            <FaChevronDown />
          </div>
          
          <div className="account-header">
            <h1 className="account-title">Nastavení</h1>
          </div>
          
          <div className="profile-section">
            <div className="profile-fields">
              <div className="profile-fields">
                <div className="field-group">
                  <label>Motiv aplikace</label>
                  <div className="input-with-button">
                    <select 
                      className="settings-select"
                      value={currentTheme}
                      onChange={handleThemeChange}
                    >
                      <option value="PINK">Růžová</option>
                      <option value="BLUE">Modrá</option> 
                      <option value="GREEN">Zelená</option>
                      <option value="BLACK">Černá (experimental)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        Zkopírováno do schránky
      </div>
    </>
  );
};

export default Navbar;