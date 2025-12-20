import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import './BookCard.css';

const BookCard = ({ book, onAddToCart, isLoading }) => {
  const info = book?.volumeInfo || {};
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(book);
    setTimeout(() => setIsAdding(false), 600);
  };

  if (isLoading) {
    return (
      <div className="book-card loading">
        <div className="skeleton-image"></div>
        <div className="book-info">
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
        <div className="skeleton-button"></div>
      </div>
    );
  }

  return (
    <div className="book-card">
      <div className="book-image-wrapper">
        {!imageLoaded && <div className="image-placeholder"></div>}
        <img
          src={info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
          alt={info.title || 'Book cover'}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {info.averageRating && (
          <div className="rating-badge">
            <Star size={12} fill="currentColor" />
            <span>{info.averageRating}</span>
          </div>
        )}
      </div>
      <div className="book-info">
        <h3 className="book-title">{info.title || 'Unknown Title'}</h3>
        <p className="book-author">{info.authors?.join(', ') || 'Unknown Author'}</p>
        <div className="book-meta">
          {info.publishedDate && (
            <span className="publish-year">{info.publishedDate.split('-')[0]}</span>
          )}
          {info.categories && (
            <span className="category">{info.categories[0]}</span>
          )}
        </div>
      </div>
      <button 
        onClick={handleAddToCart} 
        className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        disabled={isAdding}
      >
        <ShoppingCart size={18} />
        <span>{isAdding ? 'Added!' : 'Add to Cart'}</span>
      </button>
    </div>
  );
};

export default BookCard;