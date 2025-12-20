import React from 'react';
import { Link } from 'react-router-dom';
import {  
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  MapPin,
  Heart
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Browse Books' },
    { path: '/cart', label: 'Shopping Cart' },
    { path: '/profile', label: 'My Profile' }
  ];

  const accountLinks = [
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
    { path: '/profile', label: 'My Account' },
    { path: '/orders', label: 'Order History' }
  ];

  const supportLinks = [
    { path: '/faq', label: 'FAQ' },
    { path: '/shipping', label: 'Shipping Policy' },
    { path: '/returns', label: 'Returns & Refunds' },
    { path: '/privacy', label: 'Privacy Policy' }
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook', color: '#1877f2' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', color: '#1da1f2' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', color: '#e4405f' }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand-section">
          <div className="footer-brand">
            <h3>📚 BookNest</h3>
          </div>
          <p className="footer-description">
            Your gateway to endless stories and knowledge. Discover bestsellers, 
            hidden gems, and timeless classics.
          </p>
          <div className="social-links">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ '--hover-color': social.color }}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div className="footer-section">
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            {accountLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            {supportLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <div className="contact-info">
            <a href="mailto:contact@booknest.com" className="contact-item">
              <Mail size={18} />
              <span>contact@booknest.com</span>
            </a>
            <a href="tel:+94771234567" className="contact-item">
              <Phone size={18} />
              <span>+94 77 123 4567</span>
            </a>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} BookNest. All rights reserved.
          </p>
          <p className="made-with">
            Made with <Heart size={14} fill="currentColor" /> by BookNest Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;