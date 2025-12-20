import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
    paymentMethod: 'card'
  });

  useEffect(() => {
    loadCart();
    loadUserData();
  }, []);

  const loadCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      const parsed = stored && stored !== 'undefined' ? JSON.parse(stored) : [];
      
      if (parsed.length === 0) {
        navigate('/cart');
      }
      
      setCartItems(parsed);
    } catch (error) {
      console.error('Invalid cart data:', error);
      navigate('/cart');
    }
  };

  const loadUserData = () => {
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        const user = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          fullName: user.username || '',
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          bookId: item.id,
          title: item.title,
          author: item.author,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        tax,
        total
      };

      const response = await api.post('/orders', orderData);
      
      if (response.data) {
        // Show success alert
        setSuccessAlert(true);
        localStorage.removeItem('cart');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/orders', { 
            state: { message: 'Order placed successfully!' } 
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate('/cart')}>
            <ArrowLeft size={18} />
            Back to Cart
          </button>
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successAlert && (
          <div className="success-alert-banner">
            <div className="success-alert-content">
              <CheckCircle size={32} className="success-check" />
              <div className="success-text">
                <h3>Order Placed Successfully! 🎉</h3>
                <p>Thank you for your purchase. Redirecting to your orders...</p>
              </div>
            </div>
            <div className="success-progress"></div>
          </div>
        )}

        <div className="checkout-content">
          {/* Checkout Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="form-section">
              <div className="section-header">
                <User size={24} />
                <h2>Shipping Information</h2>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    disabled={successAlert}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    disabled={successAlert}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+94 77 123 4567"
                  disabled={successAlert}
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="form-section">
              <div className="section-header">
                <MapPin size={24} />
                <h2>Delivery Address</h2>
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main Street"
                  disabled={successAlert}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Colombo"
                    disabled={successAlert}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="10000"
                    disabled={successAlert}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  readOnly
                  disabled={successAlert}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <div className="section-header">
                <CreditCard size={24} />
                <h2>Payment Method</h2>
              </div>

              <div className="payment-options">
                <label className={`payment-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    disabled={successAlert}
                  />
                  <div className="option-content">
                    <CreditCard size={24} />
                    <div>
                      <strong>Credit/Debit Card</strong>
                      <p>Pay securely with your card</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'cash' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    disabled={successAlert}
                  />
                  <div className="option-content">
                    <ShoppingBag size={24} />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when you receive</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading || successAlert}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : successAlert ? (
                <>
                  <CheckCircle size={20} />
                  Order Placed!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Place Order - ${total.toFixed(2)}
                </>
              )}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cartItems.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <img 
                    src={item.image || 'https://via.placeholder.com/60x90?text=No+Image'} 
                    alt={item.title} 
                  />
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              <div className="total-row">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-divider"></div>
              <div className="total-row final">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="secure-badge">
              🔒 Secure SSL Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;