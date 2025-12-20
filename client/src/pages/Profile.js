import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, BookOpen, ShoppingBag, LogOut,} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-content">
          {/* User Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Account Information</h2>
            </div>
            <div className="profile-info">
              <div className="info-item">
                <div className="info-icon">
                  <User size={20} />
                </div>
                <div className="info-content">
                  <label>Username</label>
                  <p>{user.username || 'Not provided'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-content">
                  <label>Email Address</label>
                  <p>{user.email || 'Not provided'}</p>
                </div>
              </div>

              {user.phone && (
                <div className="info-item">
                  <div className="info-icon">
                    <Phone size={20} />
                  </div>
                  <div className="info-content">
                    <label>Phone Number</label>
                    <p>{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button 
                className="action-btn primary"
                onClick={() => navigate('/explore')}
              >
                <BookOpen size={20} />
                <span>Browse Books</span>
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag size={20} />
                <span>View Cart</span>
              </button>
              <button 
                className="action-btn danger"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Card (Optional - for future enhancement) */}
          <div className="profile-card stats-card">
            <div className="card-header">
              <h2>Your Activity</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Books Purchased</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Wishlist Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Reviews Written</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;