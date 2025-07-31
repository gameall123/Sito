import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  // Update cart count and total when items change
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/cart`);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Errore nel caricamento del carrello');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Devi essere registrato per aggiungere prodotti al carrello');
      return { success: false };
    }

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add`, {
        product_id: productId,
        quantity: quantity
      });
      
      await loadCart(); // Reload cart to get updated data
      toast.success('Prodotto aggiunto al carrello!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Errore nell\'aggiungere il prodotto al carrello';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false };

    try {
      await axios.put(`${API_BASE_URL}/api/cart/update`, {
        product_id: productId,
        quantity: quantity
      });
      
      await loadCart();
      toast.success('Carrello aggiornato!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Errore nell\'aggiornamento del carrello';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false };

    try {
      await axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`);
      await loadCart();
      toast.success('Prodotto rimosso dal carrello');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Errore nella rimozione del prodotto';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false };

    try {
      // Remove all items one by one (since we don't have a clear all endpoint)
      for (const item of cartItems) {
        await axios.delete(`${API_BASE_URL}/api/cart/remove/${item.product.id}`);
      }
      await loadCart();
      toast.success('Carrello svuotato');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Errore nello svuotamento del carrello';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};