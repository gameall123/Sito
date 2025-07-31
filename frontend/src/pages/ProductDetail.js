import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaGamepad,
  FaCalendar,
  FaTag,
  FaUser,
  FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    loadProduct();
    loadReviews();
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Prodotto non trovato');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`);
      const wishlistItems = response.data.items || [];
      setIsInWishlist(wishlistItems.some(item => item.id === id));
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Devi essere registrato per aggiungere alla wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`${API_BASE_URL}/api/wishlist/remove/${id}`);
        setIsInWishlist(false);
        toast.success('Rimosso dalla wishlist');
      } else {
        await axios.post(`${API_BASE_URL}/api/wishlist/add`, { product_id: id });
        setIsInWishlist(true);
        toast.success('Aggiunto alla wishlist');
      }
    } catch (error) {
      toast.error('Errore nella gestione della wishlist');
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(id);
    if (!result.success && !isAuthenticated) {
      // Redirect to login would be handled in the context
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Devi essere registrato per lasciare una recensione');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/products/${id}/reviews`, newReview);
      toast.success('Recensione aggiunta con successo!');
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      loadReviews();
      loadProduct(); // Reload to get updated rating
    } catch (error) {
      const message = error.response?.data?.detail || 'Errore nell\'aggiungere la recensione';
      toast.error(message);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= rating ? 'star-filled' : 'star-empty'
          } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
          onClick={interactive ? () => onRatingChange?.(i) : undefined}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-slate-700 shimmer rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-slate-700 shimmer rounded"></div>
              <div className="h-4 bg-slate-700 shimmer rounded w-3/4"></div>
              <div className="h-6 bg-slate-700 shimmer rounded w-1/2"></div>
              <div className="h-12 bg-slate-700 shimmer rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaGamepad className="text-6xl text-text-muted mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-blur-blue mb-2">Prodotto non trovato</h2>
        <Link to="/products" className="btn-primary">
          Torna ai prodotti
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-text-muted mb-8">
        <Link to="/products" className="btn-secondary flex items-center space-x-2">
          <FaArrowLeft />
          <span>Torna ai prodotti</span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl">
            <img 
              src={product.image_url || '/api/placeholder/600/800'} 
              alt={product.title}
              className="w-full h-96 lg:h-[600px] object-cover"
            />
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 p-3 bg-bg-dark/80 backdrop-blur-sm rounded-xl text-white hover:bg-bg-dark transition-colors"
            >
              {isInWishlist ? (
                <FaHeart className="text-xl text-red-500" />
              ) : (
                <FaRegHeart className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-gaming font-bold gradient-text mb-4">
              {product.title}
            </h1>
            <p className="text-lg text-text-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="flex items-center space-x-4">
              <div className="star-rating">
                {renderStars(product.average_rating)}
              </div>
              <span className="text-text-muted">
                {product.average_rating.toFixed(1)} ({product.total_reviews} recensioni)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-4xl font-bold text-toast-green">
            €{product.price}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <FaGamepad className="text-modern-blue" />
                <span className="text-blur-blue font-medium">Piattaforme</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.platform?.map(platform => (
                  <span key={platform} className="filter-pill text-xs">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <FaTag className="text-modern-blue" />
                <span className="text-blur-blue font-medium">Generi</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.genre?.map(genre => (
                  <span key={genre} className="filter-pill text-xs">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <FaCalendar className="text-modern-blue" />
                <span className="text-blur-blue font-medium">Data di uscita</span>
              </div>
              <span className="text-text-light">
                {new Date(product.release_date).toLocaleDateString('it-IT')}
              </span>
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <FaUser className="text-modern-blue" />
                <span className="text-blur-blue font-medium">Sviluppatore</span>
              </div>
              <span className="text-text-light">{product.developer}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 text-lg py-4"
            >
              <FaShoppingCart />
              <span>Aggiungi al Carrello</span>
            </button>
            <button
              onClick={toggleWishlist}
              className="btn-secondary px-6 py-4"
            >
              {isInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>

          {/* Stock Status */}
          <div className={`p-4 rounded-xl border ${
            product.in_stock > 0 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {product.in_stock > 0 
              ? `✓ Disponibile (${product.in_stock} pezzi)`
              : '✗ Esaurito'
            }
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-gaming font-bold gradient-text">
            Recensioni
          </h2>
          {isAuthenticated && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary"
            >
              Scrivi una recensione
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="card">
            <h3 className="text-xl font-semibold text-blur-blue mb-4">
              Lascia una recensione
            </h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">
                  Valutazione
                </label>
                <div className="star-rating">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">
                  Commento
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="input-field w-full h-32 resize-none"
                  placeholder="Condividi la tua esperienza con questo gioco..."
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Pubblica recensione
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="text-4xl text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">
                Nessuna recensione ancora. Sii il primo a recensire questo gioco!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="star-rating mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-text-muted text-sm">
                      {new Date(review.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
                <p className="text-text-light leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;