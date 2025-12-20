import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, BookOpen, ShoppingCart, Star, Calendar } from 'lucide-react';
import axios from 'axios';
import './BookExplorer.css';

const genres = [
  'Fiction',
  'Technology',
  'Romance',
  'Science',
  'History',
  'Biography',
  'Mystery',
  'Fantasy',
  'Business',
  'Self-Help'
];

const BookExplorer = () => {
  const [selectedGenre, setSelectedGenre] = useState('Fiction');
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedGenre}&maxResults=20&orderBy=relevance`
        );
        setBooks(res.data.items || []);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [selectedGenre]);

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === book.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: book.id,
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail,
        author: book.volumeInfo.authors?.join(', '),
        price: Math.floor(Math.random() * 30) + 10,
        quantity: 1,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setNotification(`${book.volumeInfo.title} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredBooks = books
    .filter((book) =>
      book.volumeInfo.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'title') {
        return (a.volumeInfo.title || '').localeCompare(b.volumeInfo.title || '');
      } else if (sortOption === 'date') {
        const dateA = new Date(a.volumeInfo.publishedDate || '1900');
        const dateB = new Date(b.volumeInfo.publishedDate || '1900');
        return dateB - dateA;
      } else if (sortOption === 'rating') {
        return (b.volumeInfo.averageRating || 0) - (a.volumeInfo.averageRating || 0);
      }
      return 0;
    });

  return (
    <div className="explorer-page">
      <div className="explorer-container">
        {/* Header */}
        <div className="explorer-header">
          <div className="header-content">
            <BookOpen size={32} className="header-icon" />
            <div>
              <h1>Explore Books</h1>
              <p>Discover your next favorite read from our vast collection</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="explorer-controls">
          <div className="control-group">
            <Filter size={18} />
            <select 
              className="control-select"
              onChange={(e) => setSelectedGenre(e.target.value)} 
              value={selectedGenre}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group search-group">
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="control-group">
            <SortAsc size={18} />
            <select 
              className="control-select"
              onChange={(e) => setSortOption(e.target.value)} 
              value={sortOption}
            >
              <option value="title">Sort by Title</option>
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            {loading ? 'Loading...' : `${filteredBooks.length} books found`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="book-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="book-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && (
          <div className="book-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                const info = book.volumeInfo;
                return (
                  <div key={book.id} className="book-card">
                    <div className="book-image-container">
                      <img
                        src={info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
                        alt={info.title}
                      />
                      {info.averageRating && (
                        <div className="rating-badge">
                          <Star size={12} fill="currentColor" />
                          <span>{info.averageRating}</span>
                        </div>
                      )}
                    </div>
                    <div className="book-details">
                      <h4 className="book-title">{info.title}</h4>
                      <p className="book-author">{info.authors?.join(', ') || 'Unknown Author'}</p>
                      <div className="book-meta">
                        {info.publishedDate && (
                          <span className="publish-date">
                            <Calendar size={12} />
                            {info.publishedDate.split('-')[0]}
                          </span>
                        )}
                        {info.pageCount && (
                          <span className="page-count">{info.pageCount} pages</span>
                        )}
                      </div>
                    </div>
                    <button 
                      className="add-cart-btn"
                      onClick={() => addToCart(book)}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <BookOpen size={64} />
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookExplorer;