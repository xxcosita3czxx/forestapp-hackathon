import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
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
  const [categories, setCategories] = useState([]); // Přidáno pro kategorie
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: ''
  });
const token = localStorage.getItem("token")
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
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
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
  
    fetchColor();
  }, [userId]); // Závislost na `userId`

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching posts...');
        const response = await fetch('http://localhost:8000/forum/category/fetchall/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
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

  // Nový useEffect pro získání kategorií z API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/forum/category/fetchall`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories); // Předpokládáme, že API vrací { categories: [...] }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
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

  const handleCreatePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/forum/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          authorId: userId
        }),
      });
      if (!response.ok) throw new Error('Failed to create post');
      const createdPost = await response.json();
      setPosts([createdPost, ...posts]);
      setIsCreatePostOpen(false);
      setNewPost({ title: '', content: '', category: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
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
        
        <div className="forum-header">
          <div className="filter-container">
            <div className="filter-wrapper">
              <button 
                className="filter-btn" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FaFilter /> Seřazení
              </button>
              
              <button 
                className="create-post-btn"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <FaPlus /> Vytvořit
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

      {isCreatePostOpen && (
        <div className="create-post-modal">
          <div className="modal-content">
            <h2>Vytvořit Nový Příspěvek</h2>
            <form onSubmit={handleCreatePostSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Název Příspěvku"
                className="post-title-input"
                value={newPost.title}
                onChange={handleCreatePostChange}
                required
              />
              <textarea
                name="content"
                placeholder="Obsah Příspěvku"
                className="post-content-input"
                value={newPost.content}
                onChange={handleCreatePostChange}
                required
              />
              <select
                name="category"
                className="post-category-select"
                value={newPost.category}
                onChange={handleCreatePostChange}
                required
              >
                <option value="">Vyberte kategorii</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="modal-buttons">
                <button type="button" onClick={() => setIsCreatePostOpen(false)}>
                  Zrušit
                </button>
                <button type="submit">Vytvořit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Forum;