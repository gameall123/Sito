import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, cartTotal, cartCount, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 page-transition">
        <div className="text-center py-20">
          <FaShoppingCart className="text-6xl text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            Accedi per vedere il tuo carrello
          </h2>
          <p className="text-text-muted mb-6">
            Devi essere registrato per utilizzare il carrello
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
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="h-32 bg-slate-700 shimmer rounded"></div>
              <div className="md:col-span-2 space-y-3">
                <div className="h-4 bg-slate-700 shimmer rounded"></div>
                <div className="h-3 bg-slate-700 shimmer rounded w-3/4"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-slate-700 shimmer rounded w-1/2"></div>
                <div className="h-8 bg-slate-700 shimmer rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-gaming font-bold gradient-text">
          Il tuo Carrello
        </h1>
        <div className="text-text-muted">
          {cartCount} {cartCount === 1 ? 'articolo' : 'articoli'}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <FaShoppingCart className="text-6xl text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            Il tuo carrello è vuoto
          </h2>
          <p className="text-text-muted mb-6">
            Scopri i nostri fantastici videogiochi e inizia a fare shopping!
          </p>
          <Link to="/products" className="btn-primary">
            Inizia a fare shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product.id} className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Product Image */}
                  <div className="md:col-span-1">
                    <Link to={`/products/${item.product.id}`}>
                      <img 
                        src={item.product.image_url || '/api/placeholder/200/250'} 
                        alt={item.product.title}
                        className="w-full h-32 md:h-40 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="md:col-span-2 space-y-3">
                    <Link 
                      to={`/products/${item.product.id}`}
                      className="block"
                    >
                      <h3 className="text-xl font-semibold text-blur-blue hover:text-modern-blue-light transition-colors line-clamp-2">
                        {item.product.title}
                      </h3>
                    </Link>
                    
                    <p className="text-text-muted text-sm line-clamp-2">
                      {item.product.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.product.platform?.slice(0, 2).map(platform => (
                        <span key={platform} className="filter-pill text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 md:hidden">
                      <span className="text-2xl font-bold text-toast-green">
                        €{item.product.price}
                      </span>
                    </div>
                  </div>

                  {/* Price and Quantity Controls */}
                  <div className="md:col-span-1 space-y-4">
                    <div className="hidden md:block text-2xl font-bold text-toast-green">
                      €{item.product.price}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      
                      <span className="text-lg font-semibold text-text-light min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-lg font-semibold text-text-light">
                      Subtotale: €{item.subtotal.toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="w-full btn-logout text-sm py-2 flex items-center justify-center space-x-2"
                    >
                      <FaTrash />
                      <span>Rimuovi</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-semibold text-blur-blue mb-6">
                Riepilogo Ordine
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-light">
                  <span>Subtotale ({cartCount} articoli)</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-text-light">
                  <span>Spedizione</span>
                  <span className="text-toast-green">Gratuita</span>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-blur-blue">Totale</span>
                    <span className="text-toast-green">€{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2">
                  <span>Procedi al Checkout</span>
                  <FaArrowRight />
                </button>

                <Link 
                  to="/products" 
                  className="w-full btn-secondary text-center block"
                >
                  Continua Shopping
                </Link>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-modern-blue/10 border border-modern-blue/20 rounded-xl">
                <p className="text-sm text-blur-blue text-center">
                  🔒 Pagamento sicuro al 100%<br />
                  I tuoi dati sono protetti
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;