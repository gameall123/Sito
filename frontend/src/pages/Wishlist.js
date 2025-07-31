import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`);
      setWishlistItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Errore nel caricamento della wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/wishlist/remove/${productId}`);
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast.success('Rimosso dalla wishlist');
    } catch (error) {
      toast.error('Errore nella rimozione dalla wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId);
    if (result.success) {
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(productId);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star-filled opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star-empty" />);
    }

    return stars;
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 page-transition">
        <div className="text-center py-20">
          <FaHeart className="text-6xl text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            Accedi per vedere la tua wishlist
          </h2>
          <p className="text-text-muted mb-6">
            Devi essere registrato per salvare i tuoi giochi preferiti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Accedi
            </Link>
            <Link to="/register" className="btn-secondary">
              Registrati
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 shimmer rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="product-card">
                <div className="h-64 bg-slate-700 shimmer"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-700 shimmer rounded"></div>
                  <div className="h-3 bg-slate-700 shimmer rounded w-3/4"></div>
                  <div className="h-6 bg-slate-700 shimmer rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-gaming font-bold gradient-text">
          La tua Wishlist
        </h1>
        <div className="text-text-muted">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'articolo' : 'articoli'}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <FaHeart className="text-6xl text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            La tua wishlist è vuota
          </h2>
          <p className="text-text-muted mb-6">
            Inizia ad aggiungere i tuoi videogiochi preferiti alla wishlist!
          </p>
          <Link to="/products" className="btn-primary">
            Esplora i prodotti
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card hover-lift slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img 
                    src={product.image_url || '/api/placeholder/300/400'} 
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white hover:bg-red-500 transition-colors"
                >
                  <FaTrash className="text-sm" />
                </button>

                {product.average_rating > 0 && (
                  <div className="absolute top-4 left-4 bg-bg-dark/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="star-rating text-xs">
                      {renderStars(product.average_rating)}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-bg-dark/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex flex-wrap gap-1">
                      {product.platform?.slice(0, 2).map(platform => (
                        <span key={platform} className="text-xs bg-modern-blue/20 text-modern-blue px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-xl font-semibold text-blur-blue mb-2 group-hover:text-modern-blue-light transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </Link>
                
                <p className="text-text-muted text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-toast-green">
                    €{product.price}
                  </span>
                  {product.total_reviews > 0 && (
                    <span className="text-text-muted text-sm">
                      ({product.total_reviews} recensioni)
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/products/${product.id}`}
                    className="flex-1 btn-secondary text-center text-sm py-2"
                  >
                    Dettagli
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="btn-primary flex items-center justify-center px-4 py-2"
                  >
                    <FaShoppingCart className="text-sm" />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="btn-logout px-4 py-2"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {wishlistItems.length > 0 && (
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={async () => {
                for (const product of wishlistItems) {
                  await handleAddToCart(product.id);
                }
                toast.success('Tutti gli articoli aggiunti al carrello!');
              }}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <FaShoppingCart />
              <span>Aggiungi tutto al carrello</span>
            </button>
            
            <Link to="/products" className="btn-secondary">
              Continua shopping
            </Link>
          </div>

          <p className="text-text-muted text-sm">
            💡 Suggerimento: I prodotti nella wishlist potrebbero cambiare prezzo o disponibilità
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;