import { useState, useContext, useRef, useEffect, startTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Navbar.css';
import { assets } from '../../assets/assets';
import NotificationPopup from '../NotificationPopup/NotificationPopup';
import { ThemeContext } from '../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://yummiz.up.railway.app';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { foodList, isLoading: contextLoading } = useContext(StoreContext);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestDescription, setRequestDescription] = useState('');
  const [requestingRecipe, setRequestingRecipe] = useState('');
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleNavigation = (menuItem, sectionId) => {
    startTransition(() => {
      setMenu(menuItem);
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      setMenu("home");
      window.location.reload(); // Refresh to update state
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/${userName}`);
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`);
      if (response.data.success) {
        setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleSearch = (query) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    setSearchQuery(query);
    setIsLoading(true);

    try {
      if (query.trim() && foodList && foodList.length > 0) {
        const searchTerm = query.trim().toLowerCase();
        const filtered = foodList.filter(item =>
          item?.name?.toLowerCase().includes(searchTerm)
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      toast.error('Error while searching recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    setShowSearch(!showSearch);
  };

  const handleRecipeClick = (recipe) => {
    startTransition(() => {
      navigate('/recipedetails', { state: recipe });
      setShowSearch(false);
      setSearchQuery('');
    });
  };

  const handleRecipeRequest = async (recipeName) => {
    setRequestingRecipe(recipeName);
    setShowRequestModal(true);
  };

  const submitRecipeRequest = async () => {
    try {
      if (!requestingRecipe || !requestDescription) {
        toast.error('Please fill in all required fields');
        return;
      }

      const data = {
        recipeName: requestingRecipe,
        description: requestDescription,
        requestedBy: userName || 'Anonymous'
      };

      console.log('Submitting request:', data); // Debug log

      const response = await axios.post(`${API_BASE_URL}/api/recipe-requests/submit`, data);

      if (response.data.success) {
        toast.success('Recipe request submitted successfully!');
        setRequestDescription('');
        setShowRequestModal(false);
        setSearchQuery('');
        setShowSearch(false);
      }
    } catch (error) {
      console.error('Recipe request error:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <>
      <div className='navbar'>
        <Link to="/" onClick={() => handleNavigation("home", "top")}>
          <img src={assets.logo} alt="" className='logo' />
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to='/' onClick={() => handleNavigation("home", "top")} className={menu === "home" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to='/#explore-dishes' onClick={() => handleNavigation("Recipes", "explore-dishes")} className={menu === "Recipes" ? "active" : ""}>
              Recipes
            </Link>
          </li>
          <li>
            <Link to='/#app-download' onClick={() => handleNavigation("mobile-app", "app-download")} className={menu === "mobile-app" ? "active" : ""}>
              Mobile-app
            </Link>
          </li>
          <li>
            <Link to='/#footer' onClick={() => handleNavigation("contact", "footer")} className={menu === "contact" ? "active" : ""}>
              Contact
            </Link>
          </li>
        </ul>
        <div className="navbar-right">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            <img 
              src={darkMode ? assets.sun_icon : assets.moon_icon} 
              alt="Toggle theme"
            />
          </div>
          <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <img 
                src={assets.search_icon} 
                alt="search"
                onClick={handleSearchIconClick}
                title={!token ? "Login to search recipes" : "Search recipes"}
              />
              {showSearch && token && (
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              )}
            </div>
            {showSearch && token && (
              <div className="search-results">
                {isLoading || contextLoading ? (
                  <div className="loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="search-result-item"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = assets.default_food_image;
                        }}
                      />
                      <span className="recipe-name">{recipe.name}</span>
                    </div>
                  ))
                ) : searchQuery && (
                  <div className="no-results">
                    <p>Recipe not found!</p>
                    <button 
                      className="request-recipe-btn"
                      onClick={() => handleRecipeRequest(searchQuery)}
                    >
                      Request this recipe
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {token && (
            <div className="navbar-search-icon">
              <Link to="/my-recipes">
                <img 
                  src={assets.basket_icon} 
                  alt="My Recipes" 
                />
              </Link>
            </div>
          )}
          <div className="navbar-notification-icon" ref={notificationRef}>
            <div className="notification-container" onClick={handleNotificationClick}>
              <img src={assets.bell_icon} alt="Notifications" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
            {showNotifications && (
              <NotificationPopup 
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            )}
          </div>
          {!token ? (
            <button onClick={() => setShowLogin(true)}> Login </button>
          ) : (
            <div className="navbar-profile">
              <span>Hello, {userName}!</span>
              <button onClick={handleLogout} className="logout-btn"> Logout </button>
            </div>
          )}
        </div>
      </div>

      {showRequestModal && (
        <div className="recipe-request-modal">
          <div className="modal-content">
            <h3>Request Recipe: {requestingRecipe}</h3>
            <textarea
              placeholder="Please provide additional details about the recipe you're looking for..."
              value={requestDescription}
              onChange={(e) => setRequestDescription(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => setShowRequestModal(false)}>Cancel</button>
              <button onClick={submitRecipeRequest}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
