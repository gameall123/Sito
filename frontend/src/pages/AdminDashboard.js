import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaGamepad, 
  FaUsers, 
  FaShoppingCart, 
  FaStar,
  FaEye,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { user, isAuthenticated, isAdmin } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Product form state
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    platform: [],
    genre: [],
    rating: 'E',
    release_date: '',
    developer: '',
    publisher: '',
    in_stock: '',
    featured: false
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadProducts();
      loadCategories();
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 page-transition">
        <div className="text-center py-20">
          <FaGamepad className="text-6xl text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            Accesso Negato
          </h2>
          <p className="text-text-muted mb-6">
            Solo gli amministratori possono accedere a questa sezione
          </p>
        </div>
      </div>
    );
  }

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/products?limit=100`);
      setProducts(response.data);
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        in_stock: parseInt(productForm.in_stock),
        release_date: new Date(productForm.release_date).toISOString(),
        platform: Array.isArray(productForm.platform) ? productForm.platform : productForm.platform.split(',').map(p => p.trim()),
        genre: Array.isArray(productForm.genre) ? productForm.genre : productForm.genre.split(',').map(g => g.trim())
      };

      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/api/products/${editingProduct.id}`, productData);
        toast.success('Prodotto aggiornato con successo!');
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, productData);
        toast.success('Prodotto creato con successo!');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      loadProducts();
    } catch (error) {
      const message = error.response?.data?.detail || 'Errore nel salvare il prodotto';
      toast.error(message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      platform: Array.isArray(product.platform) ? product.platform.join(', ') : product.platform,
      genre: Array.isArray(product.genre) ? product.genre.join(', ') : product.genre,
      release_date: product.release_date ? new Date(product.release_date).toISOString().split('T')[0] : ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`);
      toast.success('Prodotto eliminato con successo!');
      loadProducts();
    } catch (error) {
      toast.error('Errore nell\'eliminazione del prodotto');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      title: '',
      description: '',
      price: '',
      image_url: '',
      category_id: '',
      platform: [],
      genre: [],
      rating: 'E',
      release_date: '',
      developer: '',
      publisher: '',
      in_stock: '',
      featured: false
    });
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.developer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: FaGamepad },
    { id: 'products', label: 'Prodotti', icon: FaShoppingCart },
    { id: 'categories', label: 'Categorie', icon: FaFilter },
    { id: 'users', label: 'Utenti', icon: FaUsers }
  ];

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-gaming font-bold gradient-text">
            Dashboard Amministratore
          </h1>
          <p className="text-text-muted">
            Benvenuto, {user?.full_name || user?.username}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <FaShoppingCart className="text-3xl text-modern-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">{products.length}</div>
          <div className="text-text-muted">Prodotti Totali</div>
        </div>

        <div className="card text-center">
          <FaUsers className="text-3xl text-modern-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">0</div>
          <div className="text-text-muted">Utenti Registrati</div>
        </div>

        <div className="card text-center">
          <FaGamepad className="text-3xl text-modern-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">{categories.length}</div>
          <div className="text-text-muted">Categorie</div>
        </div>

        <div className="card text-center">
          <FaStar className="text-3xl text-modern-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">0</div>
          <div className="text-text-muted">Recensioni</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-modern-blue text-white'
                : 'bg-bg-card text-blur-blue hover:bg-modern-blue/10 hover:text-modern-blue-light'
            }`}
          >
            <tab.icon className="text-sm" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-blur-blue mb-4">
                Attività Recente
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <FaPlus className="text-toast-green" />
                  <div>
                    <p className="text-text-light text-sm">Sistema inizializzato</p>
                    <p className="text-text-muted text-xs">Oggi</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-blur-blue mb-4">
                Prodotti in Evidenza
              </h2>
              <div className="space-y-3">
                {products.filter(p => p.featured).slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <img 
                      src={product.image_url || '/api/placeholder/50/50'} 
                      className="w-12 h-12 object-cover rounded-lg"
                      alt={product.title}
                    />
                    <div className="flex-1">
                      <p className="text-text-light text-sm font-medium">{product.title}</p>
                      <p className="text-toast-green text-xs">€{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Cerca prodotti..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetProductForm();
                  setShowProductForm(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <FaPlus />
                <span>Nuovo Prodotto</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-blur-blue font-medium">Prodotto</th>
                    <th className="text-left py-3 text-blur-blue font-medium">Prezzo</th>
                    <th className="text-left py-3 text-blur-blue font-medium">Stock</th>
                    <th className="text-left py-3 text-blur-blue font-medium">Rating</th>
                    <th className="text-left py-3 text-blur-blue font-medium">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-slate-700/50">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image_url || '/api/placeholder/50/50'} 
                            className="w-12 h-12 object-cover rounded-lg"
                            alt={product.title}
                          />
                          <div>
                            <p className="font-medium text-text-light">{product.title}</p>
                            <p className="text-sm text-text-muted">{product.developer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-toast-green font-semibold">€{product.price}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.in_stock > 0 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {product.in_stock > 0 ? `${product.in_stock} pezzi` : 'Esaurito'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-sm text-text-light">
                            {product.average_rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-modern-blue hover:bg-modern-blue/10 rounded-lg transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-blur-blue mb-6">
              Gestione Categorie
            </h2>
            <div className="text-center py-12">
              <FaFilter className="text-4xl text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">
                Funzionalità di gestione categorie in arrivo.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-blur-blue mb-6">
              Gestione Utenti
            </h2>
            <div className="text-center py-12">
              <FaUsers className="text-4xl text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">
                Funzionalità di gestione utenti in arrivo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-blur-blue mb-6">
              {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
            </h2>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Titolo</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Sviluppatore</label>
                  <input
                    type="text"
                    value={productForm.developer}
                    onChange={(e) => setProductForm(prev => ({ ...prev, developer: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Editore</label>
                  <input
                    type="text"
                    value={productForm.publisher}
                    onChange={(e) => setProductForm(prev => ({ ...prev, publisher: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Stock</label>
                  <input
                    type="number"
                    value={productForm.in_stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, in_stock: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Data di Uscita</label>
                  <input
                    type="date"
                    value={productForm.release_date}
                    onChange={(e) => setProductForm(prev => ({ ...prev, release_date: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">Descrizione</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field w-full h-32 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">URL Immagine</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="input-field w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Piattaforme (separate da virgola)</label>
                  <input
                    type="text"
                    value={productForm.platform}
                    onChange={(e) => setProductForm(prev => ({ ...prev, platform: e.target.value }))}
                    className="input-field w-full"
                    placeholder="PC, PlayStation, Xbox"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blur-blue mb-2">Generi (separati da virgola)</label>
                  <input
                    type="text"
                    value={productForm.genre}
                    onChange={(e) => setProductForm(prev => ({ ...prev, genre: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Action, RPG, Adventure"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="text-modern-blue focus:ring-modern-blue/20 border-slate-600 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-text-light">
                  Prodotto in evidenza
                </label>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Aggiorna' : 'Crea'} Prodotto
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;