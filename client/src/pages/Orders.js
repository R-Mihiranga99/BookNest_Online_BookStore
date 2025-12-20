import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import api from '../utils/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      case 'processing':
        return <Package size={20} className="status-icon processing" />;
      case 'shipped':
        return <Truck size={20} className="status-icon shipped" />;
      case 'delivered':
        return <CheckCircle size={20} className="status-icon delivered" />;
      case 'cancelled':
        return <XCircle size={20} className="status-icon cancelled" />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusClass = (status) => {
    return `order-status ${status}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <Package size={32} />
          <div>
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
          </div>
        </div>

        {/* Success Message */}
        {location.state?.message && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>{location.state.message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="empty-orders">
            <ShoppingBag size={80} />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <button className="shop-btn" onClick={() => navigate('/explore')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <div className="order-meta">
                      <span className="order-date">
                        <Calendar size={14} />
                        {formatDate(order.orderDate)}
                      </span>
                      <span className={getStatusClass(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img 
                        src={item.image || 'https://via.placeholder.com/60x90?text=No+Image'} 
                        alt={item.title}
                      />
                      <div className="item-details">
                        <h4>{item.title}</h4>
                        <p>{item.author}</p>
                        <div className="item-price-qty">
                          <span>${item.price.toFixed(2)}</span>
                          <span>×</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="order-footer">
                  <div className="shipping-info">
                    <h4>Shipping Address</h4>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                  <div className="order-actions">
                    <button className="view-details-btn">
                      View Details
                    </button>
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button className="cancel-order-btn">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;