import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaFilter, 
  FaTimes,
  FaSearch,
  FaSort,
  FaGamepad
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    platform: searchParams.get('platform') || '',
    genre: searchParams.get('genre') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sortBy: searchParams.get('sortBy') || 'title'
  });

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    loadProducts();
    loadCategories();
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.genre) params.append('genre', filters.genre);
      
      const response = await axios.get(`${API_BASE_URL}/api/products?${params.toString()}`);
      let filteredProducts = response.data;

      // Client-side filtering for search and price
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.priceMin) {
        filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(filters.priceMin));
      }

      if (filters.priceMax) {
        filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(filters.priceMax));
      }

      // Sorting
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.average_rating - a.average_rating;
          case 'newest':
            return new Date(b.release_date) - new Date(a.release_date);
          default:
            return a.title.localeCompare(b.title);
        }
      });

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`);
      setWishlist(response.data.items?.map(item => item.id) || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      platform: '',
      genre: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'title'
    };
    setFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Devi essere registrato per aggiungere alla wishlist');
      return;
    }

    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        await axios.delete(`${API_BASE_URL}/api/wishlist/remove/${productId}`);
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success('Rimosso dalla wishlist');
      } else {
        await axios.post(`${API_BASE_URL}/api/wishlist/add`, { product_id: productId });
        setWishlist(prev => [...prev, productId]);
        toast.success('Aggiunto alla wishlist');
      }
    } catch (error) {
      toast.error('Errore nella gestione della wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId);
    if (!result.success && !isAuthenticated) {
      // Redirect to login would be handled in the context
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

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-gaming font-bold gradient-text mb-2">
            Catalogo Videogiochi
          </h1>
          <p className="text-text-muted">
            {products.length} {products.length === 1 ? 'risultato' : 'risultati'} trovati
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2 lg:hidden"
          >
            <FaFilter />
            <span>Filtri</span>
          </button>

          <div className="flex items-center space-x-2">
            <FaSort className="text-text-muted" />
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="title">Nome A-Z</option>
              <option value="price_asc">Prezzo crescente</option>
              <option value="price_desc">Prezzo decrescente</option>
              <option value="rating">Valutazione</option>
              <option value="newest">Più recenti</option>
            </select>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-blur-blue">Filtri</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-text-muted hover:text-modern-blue transition-colors"
              >
                Pulisci tutto
              </button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">Cerca</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Cerca videogiochi..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">Tutte le categorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">Piattaforma</label>
                <div className="space-y-2">
                  {['PC', 'PlayStation', 'Xbox', 'Nintendo'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="radio"
                        name="platform"
                        value={platform}
                        checked={filters.platform === platform}
                        onChange={(e) => handleFilterChange('platform', e.target.value)}
                        className="text-modern-blue focus:ring-modern-blue/20 border-slate-600"
                      />
                      <span className="ml-2 text-text-light">{platform}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="platform"
                      value=""
                      checked={filters.platform === ''}
                      onChange={(e) => handleFilterChange('platform', e.target.value)}
                      className="text-modern-blue focus:ring-modern-blue/20 border-slate-600"
                    />
                    <span className="ml-2 text-text-light">Tutte</span>
                  </label>
                </div>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">Genere</label>
                <div className="space-y-2">
                  {['Action', 'RPG', 'Sports', 'Racing', 'Adventure', 'Strategy'].map(genre => (
                    <label key={genre} className="flex items-center">
                      <input
                        type="radio"
                        name="genre"
                        value={genre}
                        checked={filters.genre === genre}
                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                        className="text-modern-blue focus:ring-modern-blue/20 border-slate-600"
                      />
                      <span className="ml-2 text-text-light">{genre}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="genre"
                      value=""
                      checked={filters.genre === ''}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="text-modern-blue focus:ring-modern-blue/20 border-slate-600"
                    />
                    <span className="ml-2 text-text-light">Tutti</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">Prezzo</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min €"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max €"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="product-card animate-pulse">
                  <div className="h-64 bg-slate-700 shimmer"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-700 shimmer rounded"></div>
                    <div className="h-3 bg-slate-700 shimmer rounded w-3/4"></div>
                    <div className="h-6 bg-slate-700 shimmer rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <FaGamepad className="text-6xl text-text-muted mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-blur-blue mb-2">
                Nessun prodotto trovato
              </h2>
              <p className="text-text-muted mb-6">
                Prova a modificare i filtri di ricerca
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Pulisci filtri
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => (
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
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-bg-dark/80 backdrop-blur-sm rounded-lg text-white hover:bg-bg-dark transition-colors"
                    >
                      {wishlist.includes(product.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>

                    {product.average_rating > 0 && (
                      <div className="absolute top-4 left-4 bg-bg-dark/80 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="star-rating text-xs">
                          {renderStars(product.average_rating)}
                        </div>
                      </div>
                    )}
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
                          ({product.total_reviews})
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/products/${product.id}`}
                        className="flex-1 btn-secondary text-center"
                      >
                        Dettagli
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="btn-primary flex items-center justify-center px-4"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-bg-card p-6 overflow-y-auto">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-modern-blue"
            >
              <FaTimes />
            </button>
            {/* Filter content would be here - same as sidebar */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;