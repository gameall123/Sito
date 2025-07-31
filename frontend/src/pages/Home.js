import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaGamepad, FaFire, FaArrowRight, FaPlay } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        // Load featured products
        const response = await axios.get(`${API_BASE_URL}/api/products?featured=true&limit=8`);
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [API_BASE_URL]);

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
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-dark via-bg-card to-bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-modern-blue/10 to-modern-blue-light/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-modern-blue/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-modern-blue-light/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8 fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-gaming font-bold gradient-text text-shadow">
                Gaming Store
              </h1>
              <p className="text-xl md:text-2xl text-text-muted font-light">
                Il futuro del gaming è qui
              </p>
            </div>
            
            <p className="text-lg md:text-xl text-text-light max-w-2xl mx-auto leading-relaxed">
              Scopri i migliori videogiochi per tutte le piattaforme. 
              Dalle ultime uscite ai grandi classici, tutto quello che cerchi in un unico posto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/products" 
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <FaGamepad className="text-xl group-hover:animate-bounce" />
                <span>Esplora Prodotti</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/products?featured=true" 
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <FaFire className="text-xl group-hover:animate-pulse" />
                <span>In Evidenza</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Gaming Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <FaGamepad className="absolute top-1/4 left-1/4 text-modern-blue/20 text-6xl animate-bounce delay-500" />
          <FaPlay className="absolute top-1/3 right-1/4 text-modern-blue-light/20 text-4xl animate-pulse delay-1000" />
          <FaStar className="absolute bottom-1/3 left-1/3 text-modern-blue/30 text-5xl animate-bounce delay-1500" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-bg-dark to-bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-gaming font-bold gradient-text mb-6">
              Prodotti in Evidenza
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              I videogiochi più popolari e le ultime uscite selezionate per te
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="product-card hover-lift slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image_url || '/api/placeholder/300/400'} 
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-toast-green text-white text-xs font-bold px-3 py-1 rounded-full">
                        IN EVIDENZA
                      </span>
                    </div>
                    {product.average_rating > 0 && (
                      <div className="absolute top-4 right-4 bg-bg-dark/80 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="star-rating text-xs">
                          {renderStars(product.average_rating)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blur-blue mb-2 group-hover:text-modern-blue-light transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-4 line-clamp-2">
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
                    
                    <Link 
                      to={`/products/${product.id}`}
                      className="w-full btn-primary text-center block"
                    >
                      Dettagli
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 fade-in">
            <Link 
              to="/products" 
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
            >
              <span>Vedi Tutti i Prodotti</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-gaming font-bold gradient-text mb-6">
              Esplora per Categoria
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Trova i tuoi generi preferiti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Action', icon: '⚔️', link: '/products?category=action', color: 'from-red-500/20 to-orange-500/20' },
              { name: 'RPG', icon: '🧙‍♂️', link: '/products?category=rpg', color: 'from-purple-500/20 to-pink-500/20' },
              { name: 'Sports', icon: '⚽', link: '/products?category=sports', color: 'from-green-500/20 to-emerald-500/20' },
              { name: 'Racing', icon: '🏎️', link: '/products?category=racing', color: 'from-blue-500/20 to-cyan-500/20' }
            ].map((category, index) => (
              <Link 
                key={category.name}
                to={category.link}
                className={`card hover-lift slide-up bg-gradient-to-br ${category.color} group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-gaming font-bold text-blur-blue group-hover:text-modern-blue-light transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-text-muted">
                    Scopri i migliori giochi {category.name.toLowerCase()}
                  </p>
                  <div className="pt-4">
                    <span className="btn-secondary inline-flex items-center space-x-2 group-hover:bg-modern-blue/20">
                      <span>Esplora</span>
                      <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-modern-blue/10 to-modern-blue-light/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Videogiochi Disponibili', icon: FaGamepad },
              { number: '50,000+', label: 'Clienti Soddisfatti', icon: FaStar },
              { number: '24/7', label: 'Supporto Clienti', icon: FaPlay }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="space-y-4 fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <stat.icon className="text-5xl text-modern-blue mx-auto" />
                <div className="text-4xl font-gaming font-bold gradient-text">
                  {stat.number}
                </div>
                <p className="text-xl text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;