import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter } from 'react-icons/fa';
import Navbar from './components/navbar';
import './forum.css';

const API_URL = 'http://localhost:8000';

const Forum = () => {
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'likes', 'comments'
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  function addPost(title, content, author, likes = 0, comments = 0, date = new Date()) {
    const newPost = {
      title: title,
      content: content,
      author: author,
      likes: likes,
      comments: comments,
      date: date
    };

    posts.push(newPost); // Přidání příspěvku do pole
    return newPost; // Vrátí vytvořený příspěvek
  }

  const postId = 'pokus';
  const categoryId = 'faktpokus';

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching posts...');
        const response = await fetch('http://localhost:8000/forum/posts/fetchall/pokus', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data) {
          console.log('No data received');
          setPosts([]);
          return;
        }

        const transformedPosts = await Promise.all(
          Object.entries(data).map(async ([id, post]) => {
            console.log('Processing post:', id, post);
            return {
              id,
              title: post.title || 'Untitled',
              content: post.text || 'No content', 
              author: post.author_id || 'Anonymous',
              likes: 5, // Temporarily hardcoded for testing
              comments: 5,
              createdAt: post.date || Date.now()
            };
          })
        );

        console.log('Transformed posts:', transformedPosts);
        setPosts(transformedPosts);
        setFilteredPosts(transformedPosts);

      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handleFilterClick = (option) => {
    setSelectedFilter(option); // Set the selected filter
    setIsDropdownOpen(false); // Close the dropdown
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

      <Navbar />
    </div>
  );
};

export default Forum;