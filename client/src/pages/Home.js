import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import BookCard from '../components/BookCard';
import './Home.css';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('https://www.googleapis.com/books/v1/volumes?q=bestseller+fiction&maxResults=8&orderBy=relevance')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data) => {
        setFeaturedBooks(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch featured books:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addToCart = (book) => {
    const newItem = {
      id: book.id,
      title: book.volumeInfo?.title || 'Unknown Book',
      image: book.volumeInfo?.imageLinks?.thumbnail,
      author: book.volumeInfo?.authors?.join(', '),
      price: Math.floor(Math.random() * 30) + 10,
      quantity: 1,
    };
    
    setCart([...cart, newItem]);
    setNotification(`${newItem.title} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const categories = [
    { name: 'Technology', count: '2,450' },
    { name: 'Fiction', count: '8,320' },
    { name: 'Science', count: '3,890' },
    { name: 'Business', count: '1,670' },
  ];

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Great Read</h1>
          <p>Explore thousands of books from bestselling authors and hidden gems</p>
          <button className="cta-button">
            <BookOpen size={20} />
            <span>Browse Collection</span>
          </button>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <p>Handpicked selections just for you</p>
        </div>

        {error && (
          <div className="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {!error && (
          <div className="books-grid">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <BookCard key={i} isLoading={true} />
              ))
            ) : featuredBooks.length > 0 ? (
              featuredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={() => addToCart(book)}
                />
              ))
            ) : (
              <div className="empty-state">
                <BookOpen size={64} />
                <p>No books found. Try again later.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find books that match your interests</p>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.name} className="category-card">
              <div className="category-icon">
                <BookOpen size={28} />
              </div>
              <h3>{category.name}</h3>
              <p>{category.count} books</p>
              <div className="category-hover-overlay">
                <span>Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </main>
  );
};

export default Home;