import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter, FaPlus, FaTimes } from 'react-icons/fa';
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
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const token = localStorage.getItem("token");

  // Definice kategorií
  const categories = [
    { id: 'general', name: 'General', icon: FaComments },
    { id: 'questions', name: 'Questions', icon: FaQuestionCircle },
    { id: 'announcements', name: 'Announcements', icon: FaCommentDots },
    { id: 'other', name: 'Other', icon: FaComments }
  ];

  // Fetch posts
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Handle post click to open detail view
  const handlePostClick = async (post) => {
    try {
      const response = await fetch(`http://localhost:8000/forum/posts/fetchall/${post.id.split('-')[0]}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch post details');
      
      const data = await response.json();
      const postDetails = data[post.id.split('-')[1]];
      setSelectedPost({
        ...post,
        details: postDetails,
        likes: await fetchLikeCount(post.id),
        comments: await fetchCommentCount(post.id)
      });
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  // Helper functions to fetch additional data
  const fetchLikeCount = async (postId) => {
    const [catId, postId2] = postId.split('-');
    const response = await fetch(`http://localhost:8000/forum/posts/count/likes/${catId}&${postId2}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok ? await response.json() : 0;
  };

  const fetchCommentCount = async (postId) => {
    const [catId, postId2] = postId.split('-');
    const response = await fetch(`http://localhost:8000/forum/posts/count/comments/${catId}&${postId2}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok ? await response.json() : 0;
  };

  if (error) return <div className="error-message">{error}</div>;
  if (isLoading) return <div className="loading">Loading...</div>;

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
            <div key={post.id} 
                 className="post-card"
                 onClick={() => handlePostClick(post)}>
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

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="post-modal-overlay">
          <div className="post-modal">
            <button className="close-modal" onClick={() => setSelectedPost(null)}>
              <FaTimes />
            </button>
            <div className="post-modal-content">
              <h2>{selectedPost.title}</h2>
              <div className="post-meta">
                <span className="post-author">
                  <FaUser /> {selectedPost.author}
                </span>
                <span className="post-date">
                  {new Date(selectedPost.details?.date || selectedPost.createdAt).toLocaleString()}
                </span>
                <span className="post-category">
                  {selectedPost.category}
                </span>
              </div>
              <div className="post-body">
                {selectedPost.content}
              </div>
              <div className="post-stats">
                <span className="likes">👍 {selectedPost.likes}</span>
                <span className="comments">💬 {selectedPost.comments}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Forum;