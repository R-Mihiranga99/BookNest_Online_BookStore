import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import BookDetails from './pages/BookDetails';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import BookExplorer from './pages/BookExplorer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<BookExplorer />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
