import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import Navbar from './components/navbar';
import './forum.css';

const API_URL = 'http://localhost:8000';

const Forum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
            <div key={post.id} className="post-card">
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
      <Navbar />
    </div>
  );
};

export default Forum;