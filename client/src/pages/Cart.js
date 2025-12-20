import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      const parsed = stored && stored !== 'undefined' ? JSON.parse(stored) : [];
      setCartItems(parsed);
    } catch (error) {
      console.error('Invalid cart data in localStorage:', error);
      setCartItems([]);
    }
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, change) => {
    const newCart = [...cartItems];
    newCart[index].quantity = Math.max(1, newCart[index].quantity + change);
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      updateCart([]);
    }
  };

  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <div className="header-content">
            <ShoppingCart size={32} className="header-icon" />
            <div>
              <h1>Shopping Cart</h1>
              <p>
                {cartItems.length === 0 
                  ? 'Your cart is empty'
                  : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`
                }
              </p>
            </div>
          </div>
          <button className="back-btn" onClick={() => navigate('/explore')}>
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="empty-cart">
            <ShoppingBag size={80} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any books yet</p>
            <button className="shop-btn" onClick={() => navigate('/explore')}>
              Start Shopping
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="cart-content">
            <div className="cart-items">
              <div className="items-header">
                <h2>Cart Items</h2>
                <button className="clear-btn" onClick={clearCart}>
                  <Trash2 size={16} />
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item, idx) => (
                <div className="cart-item" key={idx}>
                  <div className="item-image">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80x120?text=No+Image'} 
                      alt={item.title} 
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="item-author">{item.author || 'Unknown Author'}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(idx, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(idx, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(idx)}
                      title="Remove from cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free">Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                <ShoppingBag size={20} />
                Proceed to Checkout
              </button>

              <div className="secure-notice">
                🔒 Secure checkout powered by SSL encryption
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;