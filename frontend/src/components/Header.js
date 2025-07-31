import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaSearch, 
  FaBars, 
  FaTimes,
  FaGamepad,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <FaGamepad className="text-3xl text-modern-blue group-hover:text-modern-blue-light transition-colors duration-300" />
              <div className="absolute inset-0 text-3xl text-modern-blue animate-pulse opacity-50"></div>
            </div>
            <span className="text-2xl font-gaming font-bold gradient-text hidden sm:block">
              Gaming Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-blur-blue hover:text-modern-blue-light transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-blur-blue hover:text-modern-blue-light transition-colors duration-300 font-medium"
            >
              Prodotti
            </Link>
            <div className="relative group">
              <button className="text-blur-blue hover:text-modern-blue-light transition-colors duration-300 font-medium">
                Categorie
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-bg-card border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-2 space-y-1">
                  <Link to="/products?category=action" className="block px-4 py-2 text-blur-blue hover:bg-modern-blue/10 rounded-lg transition-colors">Action</Link>
                  <Link to="/products?category=rpg" className="block px-4 py-2 text-blur-blue hover:bg-modern-blue/10 rounded-lg transition-colors">RPG</Link>
                  <Link to="/products?category=sports" className="block px-4 py-2 text-blur-blue hover:bg-modern-blue/10 rounded-lg transition-colors">Sports</Link>
                  <Link to="/products?category=racing" className="block px-4 py-2 text-blur-blue hover:bg-modern-blue/10 rounded-lg transition-colors">Racing</Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cerca videogiochi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full search-bar pl-12"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-3 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-xl"
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link 
                to="/wishlist" 
                className="p-3 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-xl"
              >
                <FaHeart className="text-xl" />
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-3 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-xl">
                  <FaUser className="text-xl" />
                  <span className="hidden sm:block font-medium">{user?.username}</span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-bg-card border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2 space-y-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 px-4 py-2 text-blur-blue hover:bg-modern-blue/10 rounded-lg transition-colors"
                    >
                      <FaUser className="text-sm" />
                      <span>Profilo</span>
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-2 px-4 py-2 text-blur-blue hover:bg-modern-blue/10 rounded-lg transition-colors"
                      >
                        <FaCog className="text-sm" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-logout-red hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt className="text-sm" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Accedi
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm py-2 px-4"
                >
                  Registrati
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-blur-blue hover:text-modern-blue-light transition-colors duration-300"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4 animate-slide-up">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Cerca videogiochi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full search-bar pl-12"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block py-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="block py-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Prodotti
                </Link>
                <div className="py-2">
                  <span className="text-blur-blue font-medium">Categorie:</span>
                  <div className="ml-4 mt-2 space-y-1">
                    <Link to="/products?category=action" className="block py-1 text-blur-blue hover:text-modern-blue-light transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Action</Link>
                    <Link to="/products?category=rpg" className="block py-1 text-blur-blue hover:text-modern-blue-light transition-colors" onClick={() => setIsMobileMenuOpen(false)}>RPG</Link>
                    <Link to="/products?category=sports" className="block py-1 text-blur-blue hover:text-modern-blue-light transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sports</Link>
                    <Link to="/products?category=racing" className="block py-1 text-blur-blue hover:text-modern-blue-light transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Racing</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;