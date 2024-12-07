import React, { useState } from "react";
import "./home.css";
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch } from "react-icons/fa";

function App() {
  const [searchActive, setSearchActive] = useState(false);

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

  return (
    <div className="app">
      <div className="header">
        <h1>Home1</h1>
      </div>
      <div className="content">
        <form className={`search-container ${searchActive ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
          <button
            type="submit"
            className="search-button"
            onClick={handleSearchClick}
          >
            <FaSearch />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            autoFocus={searchActive}
          />
        </form>
      </div>
      <div className="navbar">
        <div className="nav-item">
          <FaUser />
        </div>
        <div className="nav-item">
          <FaComments />
        </div>
        <div className="nav-item">
          <FaHome />
        </div>
        <div className="nav-item">
          <FaCommentDots />
        </div>
        <div className="nav-item">
          <FaQuestionCircle />
        </div>
      </div>
    </div>
  );
}

export default App;