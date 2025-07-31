import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaGamepad, FaHeart, FaShoppingCart, FaCog } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 page-transition">
        <div className="text-center py-20">
          <FaUser className="text-6xl text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            Accedi per vedere il tuo profilo
          </h2>
          <p className="text-text-muted mb-6">
            Devi essere registrato per accedere al profilo
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

  const tabs = [
    { id: 'profile', label: 'Profilo', icon: FaUser },
    { id: 'orders', label: 'Ordini', icon: FaShoppingCart },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
    { id: 'settings', label: 'Impostazioni', icon: FaCog }
  ];

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <div className="flex items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-modern-blue to-modern-blue-light rounded-full flex items-center justify-center">
            <FaUser className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-gaming font-bold gradient-text">
              {user?.full_name || user?.username}
            </h1>
            <p className="text-text-muted">
              {user?.is_admin ? 'Amministratore' : 'Utente'} • Membro da {new Date(user?.created_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <FaShoppingCart className="text-3xl text-modern-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">{cartCount}</div>
          <div className="text-text-muted">Articoli nel carrello</div>
        </div>

        <div className="card text-center">
          <FaHeart className="text-3xl text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">0</div>
          <div className="text-text-muted">Articoli nella wishlist</div>
        </div>

        <div className="card text-center">
          <FaGamepad className="text-3xl text-modern-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-toast-green mb-1">0</div>
          <div className="text-text-muted">Ordini completati</div>
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
        {activeTab === 'profile' && (
          <div className="card">
            <h2 className="text-2xl font-semibold text-blur-blue mb-6">
              Informazioni Profilo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">
                  Nome Completo
                </label>
                <div className="input-field bg-slate-700/50 cursor-not-allowed">
                  {user?.full_name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">
                  Username
                </label>
                <div className="input-field bg-slate-700/50 cursor-not-allowed">
                  {user?.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">
                  Email
                </label>
                <div className="input-field bg-slate-700/50 cursor-not-allowed">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blur-blue mb-2">
                  Data Registrazione
                </label>
                <div className="input-field bg-slate-700/50 cursor-not-allowed">
                  {new Date(user?.created_at).toLocaleDateString('it-IT')}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-modern-blue/10 border border-modern-blue/20 rounded-xl">
              <p className="text-sm text-blur-blue">
                <FaCog className="inline mr-2" />
                Per modificare le informazioni del profilo, contatta il supporto clienti.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card">
            <h2 className="text-2xl font-semibold text-blur-blue mb-6">
              I tuoi Ordini
            </h2>
            <div className="text-center py-12">
              <FaShoppingCart className="text-4xl text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">
                Non hai ancora effettuato nessun ordine.
              </p>
              <Link to="/products" className="btn-primary mt-4">
                Inizia a fare shopping
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="card">
            <h2 className="text-2xl font-semibold text-blur-blue mb-6">
              La tua Wishlist
            </h2>
            <div className="text-center py-12">
              <FaHeart className="text-4xl text-text-muted mx-auto mb-4" />
              <p className="text-text-muted mb-4">
                La tua wishlist è vuota.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary">
                  Esplora prodotti
                </Link>
                <Link to="/wishlist" className="btn-secondary">
                  Vai alla wishlist
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-semibold text-blur-blue mb-6">
                Impostazioni Account
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <h3 className="font-medium text-text-light">Notifiche Email</h3>
                    <p className="text-sm text-text-muted">Ricevi aggiornamenti sui tuoi ordini</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="text-modern-blue focus:ring-modern-blue/20 border-slate-600 rounded"
                    defaultChecked
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <h3 className="font-medium text-text-light">Newsletter</h3>
                    <p className="text-sm text-text-muted">Ricevi offerte e novità sui videogiochi</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="text-modern-blue focus:ring-modern-blue/20 border-slate-600 rounded"
                    defaultChecked
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <h3 className="font-medium text-text-light">Profilazione</h3>
                    <p className="text-sm text-text-muted">Migliora i suggerimenti personalizzati</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="text-modern-blue focus:ring-modern-blue/20 border-slate-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold text-blur-blue mb-6">
                Sicurezza
              </h2>
              
              <div className="space-y-4">
                <button className="w-full btn-secondary text-left">
                  Cambia Password
                </button>
                
                <button className="w-full btn-secondary text-left">
                  Scarica i tuoi dati
                </button>

                <button className="w-full btn-logout text-left">
                  Elimina Account
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-sm text-yellow-400">
                  ⚠️ Alcune operazioni richiedono la verifica dell'identità.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;