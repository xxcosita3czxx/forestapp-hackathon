import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter, FaPlus, FaTimes } from 'react-icons/fa';
import Navbar from './components/navbar';
import './forum.css';

const API_URL = 'http://localhost:8000';

const Forum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem('userId');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Definice kategorií
  const categories = [
    { id: 'general', name: 'Obecné', icon: FaComments },
    { id: 'questions', name: 'Pomoc', icon: FaQuestionCircle },
    { id: 'announcements', name: 'Zdělení', icon: FaCommentDots },
    { id: 'other', name: 'Ostatní', icon: FaComments }
  ];

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/forum/category/fetchall/', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        
        const transformedPosts = Object.entries(data).flatMap(([groupId, group]) => {
          return Object.entries(group).map(([postId, post]) => {
            // Log for debugging
            console.log('Processing groupId:', groupId);
            
            // Explicitly check against all possible category IDs
            let category = 'none';
            if (groupId === 'general' || 
                groupId === 'questions' || 
                groupId === 'announcements' || 
                groupId === 'other') {
              category = groupId;
            }

            return {
              id: `${groupId}-${postId}`,
              title: post.title || 'Untitled',
              content: post.text || post.description || 'No content',
              author: post.author_id || 'Anonymous/Deleted user',
              category: category, // This will now properly set all categories
              createdAt: post.date
            };
          });
        });

        setPosts(transformedPosts);
      } catch (error) {
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:8000/users/settings/set/${userId}`, {
          method: 'GET',
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter posts by category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category && post.category === selectedCategory)
    : posts;

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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    try {
      // Verify category is valid
      if (!categories.find(cat => cat.id === newPost.category)) {
        throw new Error('Invalid category selected');
      }
  
      const post_id = `${newPost.category}-${Date.now()}`;
      
      const queryParams = new URLSearchParams({
        id: newPost.category, // Use category id from our defined categories
        post_id: post_id,
        title: newPost.title,
        text: newPost.content,
        author_id: userId
      }).toString();
  
      const url = `${API_URL}/forum/posts/create?${queryParams}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || errorData.error || 'Failed to create post');
      }
  
      setShowCreatePost(false);
      setNewPost({
        title: '',
        content: '',
        category: 'general'
      });
      
      window.location.reload();
  
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message);
    }
  };

  const handleSort = (sortType) => {
    let sortedPosts = [...posts];
    switch (sortType) {
      case 'newest':
        sortedPosts.sort((a, b) => {
          const dateA = new Date(b.createdAt);
          const dateB = new Date(a.createdAt);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'oldest':
        sortedPosts.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'az':
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setPosts(sortedPosts);
    setShowFilter(false); // Close dropdown after selection
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  if (error) return <div className="error-message">{error}</div>;
  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="forum-page">
      <div className="forum-content">
        <h1 className="forum-title">Diskuzní fórum</h1>
        
        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <category.icon />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="filter-wrapper">
          <div className="filter-container" ref={filterRef}>
            <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
              <FaFilter /> Sort
            </button>
            <div className={`filter-dropdown ${showFilter ? 'active' : ''}`}>
              <div className="filter-option" onClick={() => handleSort('newest')}>Newest First</div>
              <div className="filter-option" onClick={() => handleSort('oldest')}>Oldest First</div>
              <div className="filter-option" onClick={() => handleSort('az')}>A-Z</div>
              <div className="filter-option" onClick={() => handleSort('za')}>Z-A</div>
            </div>
          </div>


          <button className="create-post-btn" onClick={() => setShowCreatePost(true)}>
            <FaPlus /> Create Post
          </button>
        </div>

        {/* Posts List */}
        <div className="posts-container">
          {filteredPosts.map(post => (
            <div key={post.id} 
                className="post-card"
                onClick={() => handlePostClick(post)}>
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <span className="post-author">Author: {post.author}</span>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleString('cs-CZ', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="post-category-tag">
                  {getCategoryName(post.category)}
                </span>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="no-posts">
              No posts found {selectedCategory && `in ${selectedCategory} category`}
            </div>
          )}
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
                  {getCategoryName(selectedPost.category)}
                </span>
              </div>
              <div className="post-body">
                {selectedPost.content}
                <div className="post-category-name">
                  {getCategoryName(selectedPost.category)}
                </div>
              </div>
              <div className="post-stats">
                <span className="likes">👍 {selectedPost.likes}</span>
                <span className="comments">💬 {selectedPost.comments}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreatePost && (
        <div className="create-post-modal">
          <div className="modal-content">
            <h2>Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <select 
                className="post-category-select"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                className="post-title-input"
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required
              />
              <textarea
                className="post-content-input"
                placeholder="Write your post..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowCreatePost(false)}>Cancel</button>
                <button type="submit">Create Post</button>
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