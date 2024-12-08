import { useState, useEffect } from 'react';
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
            // Handle different category types
            let category = null;
            let content = post.text || post.description || 'No content';
            
            // Check for specific categories
            if (postId === 'general') {
              category = 'general';
            } else if (postId === 'questions') {
              category = 'questions';
            } else if (postId === 'announcements') {
              category = 'announcements';
            } else if (postId === 'other') {
              category = 'other';
            }

            return {
              id: `${groupId}-${postId}`,
              title: post.title || 'Untitled',
              content: content,
              author: post.author_id || 'Anonymous',
              category: category,
              createdAt: Date.now()
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
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="post-category-tag">
                  {post.category || 'none'}
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