import { useState
   } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaTimes, FaChevronDown } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import './Navbar.css';

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
  const [searchActive, setSearchActive] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "cosita",
    username: "cosita123" 
  });
  const [showToast, setShowToast] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('PINK');

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
    const theme = e.target.value;
    setCurrentTheme(theme);
    
    // Get userId from localStorage
    const userId = localStorage.getItem('userId');
    
    try {
      await fetch(`/set/${userId}&settings&theme&${theme}`, {
        method: 'PATCH'
      });
      
      document.body.style.background = `linear-gradient(45deg, ${THEMES[theme].from}, ${THEMES[theme].to})`;
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
        <div className="nav-item">
          <FaCommentDots />
        </div>
        <div className="nav-item">
          <FaQuestionCircle />
        </div>
        <div className="nav-item" onClick={toggleSettings}>
          <FiSettings />
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
                      <option value="BLACK">Černá (coming soon)</option>
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