import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComments, FaHome, FaQuestionCircle, FaCommentDots, FaSearch, FaFilter } from 'react-icons/fa';
import Navbar from './components/navbar';
import './forum.css';

const Forum = () => {
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'likes', 'comments'
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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
  try {
    // Fetch the posts, comments, and likes data
    const [postsResponse, commentsCountResponse, likesCountResponse] = await Promise.all([
      fetch(`http://127.0.0.1:8000/forum/posts/fetchall/${postId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }),
      fetch(`http://127.0.0.1:8000/forum/posts/count/comments/${categoryId}&${postId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }),
      fetch(`http://127.0.0.1:8000/forum/posts/count/likes/${categoryId}&${postId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }),
    ]);

    if (!postsResponse.ok || !commentsCountResponse.ok || !likesCountResponse.ok) {
      setError('Failed to fetch data');
      return;
    }

    // Parse the responses
    const postsData = await postsResponse.json();
    const commentsCountData = await commentsCountResponse.json();
    const likesCountData = await likesCountResponse.json();

    // Check if postsData is an object (not an array)
    if (typeof postsData === 'object') {
      // Optionally, you can iterate over the categories (e.g., 'general', 'faktpokus')
      Object.keys(postsData).forEach((category) => {
        const postsInCategory = postsData[category];

        // Add each post to the state (assuming the posts are within each category object)
        addPost(
          postsInCategory.post_id,
          postsInCategory.title,
          postsInCategory.text,
          postsInCategory.author_id,
          likesCountData.likes, // Likes count from the likes endpoint
          commentsCountData.comments, // Comments count from the comments endpoint
          postsInCategory.date
        );
      });
    } else {
      console.error('Expected postsData to be an object, but got:', postsData);
      setError('Failed to fetch posts.');
    }

    // Log or use comments count and likes count data if needed
    console.log('Comments count:', commentsCountData);
    console.log('Likes count:', likesCountData);

    // Update your state with the posts data or other state if needed
    setPosts(postsData);
  } catch (error) {
    console.error('Error fetching posts:', error);
    setError('Error fetching posts. Please try again later.');
  }
};

    fetchPosts(); // Call fetchPosts when the component mounts
  }, []); // Empty dependency array ensures this runs only once

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
    // {
    //   id: 3,
    //   title: "Tipy na aktivity s dětmiXXXXX   @workspace Zarit aby se ve forumu dalo seradit podle a vyhladavani (pridej ten search uplne stejnej jako je je v home.jsx) XXXXX",
    //   content: "Sestavil jsem seznam osvědčených aktivit, které pomáhají budovat vztah s přijatým dítětem. Patří mezi ně společné vaření, výlety do přírody, hraní společenských her...",
    //   author: "Martin V.",
    //   likes: 42,
    //   comments: 16,
    //   date: new Date('2024-01-05')
    // }
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

      <Navbar />
    </div>
  );
};

export default Forum;