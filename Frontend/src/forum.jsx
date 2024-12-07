import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter } from 'react-icons/fa';
import './forum.css';

const Forum = () => {
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'likes', 'comments'
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Example posts data - would normally come from an API
  const [posts] = useState([
    {
      id: 1,
      title: "Jak zvládnout první dny v náhradní rodině?",
      content: "Nedávno jsme přijali dítě do naší rodiny a chtěla bych se podělit o několik tipů, které nám velmi pomohly během prvních dnů. Především je důležité dát dítěti prostor a čas na adaptaci...",
      author: "Jana K.",
      likes: 24,
      comments: 8,
      date: Date('2024-01-15')
    },
    {
      id: 2,
      title: "Zkušenosti s podporou od státu",
      content: "Chtěl bych se podělit o své zkušenosti s žádostí o podporu od státu při pěstounské péči. Celý proces trval přibližně 3 měsíce a zahrnoval několik návštěv sociálních pracovníků...",
      author: "Petr M.",
      likes: 15,
      comments: 12,
      date: new Date('2024-01-10')
    },
    {
      id: 3,
      title: "Tipy na aktivity s dětmiXXXXX   @workspace Zarit aby se ve forumu dalo seradit podle a vyhladavani (pridej ten search uplne stejnej jako je je v home.jsx) XXXXX",
      content: "Sestavil jsem seznam osvědčených aktivit, které pomáhají budovat vztah s přijatým dítětem. Patří mezi ně společné vaření, výlety do přírody, hraní společenských her...",
      author: "Martin V.",
      likes: 42,
      comments: 16,
      date: new Date('2024-01-05')
    }
  ]);

  useEffect(() => {
    let filtered = [...posts];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostLiked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  
    setFilteredPosts(filtered);
  }, [posts, searchQuery, sortBy]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.filter-container')) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleSearchClick = (e) => {
    if (!searchActive) {
      e.preventDefault();
    }
    setSearchActive(!searchActive);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
  };

  return (
    <div className="forum-page">
      <form className={`search-container ${searchActive ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
        <button type="submit" className="search-button" onClick={handleSearchClick}>
          <FaSearch />
        </button>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus={searchActive} 
        />
      </form>

      <div className="forum-content">
        <h1 className="forum-title">Diskuzní fórum</h1>
        
        <div className="filter-container">
          <button 
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter /> Filter & Sort
          </button>
          
          <div className={`filter-dropdown ${isFilterOpen ? 'active' : ''}`}>
            <div className="filter-option" onClick={() => setSortBy('newest')}>
              Newest First
            </div>
            <div className="filter-option" onClick={() => setSortBy('oldest')}>
              Oldest First
            </div>
            <div className="filter-option" onClick={() => setSortBy('mostLiked')}>
              Most Liked
            </div>
          </div>
        </div>

        <div className="posts-container">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <span className="post-author">Autor: {post.author}</span>
              </div>
              <p className="post-content">{truncateText(post.content)}</p>
              <p className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="post-stats">
                <span>{post.likes} líbí se</span>
                <span>{post.comments} komentářů</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="navbar">
        <div className="nav-item">
          <FaUser />
        </div>
        <div className="nav-item">
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
      </div>
    </div>
  );
};

export default Forum;