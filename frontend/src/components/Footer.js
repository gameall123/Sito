import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGamepad, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaDiscord
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      toast.success('Iscrizione alla newsletter completata!');
      setEmail('');
    } else {
      toast.error('Inserisci un indirizzo email valido');
    }
  };

  return (
    <footer className="bg-bg-card border-t border-slate-700/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-modern-blue/10 to-modern-blue-light/10 rounded-2xl p-8 mb-12 border border-modern-blue/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Rimani Aggiornato
            </h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Iscriviti alla nostra newsletter per ricevere le ultime novità sui videogiochi e offerte esclusive.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="newsletter-container">
                <input
                  type="email"
                  placeholder="Il tuo indirizzo email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary ml-2 whitespace-nowrap"
                >
                  Iscriviti
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaGamepad className="text-2xl text-modern-blue" />
              <span className="text-xl font-gaming font-bold gradient-text">
                Gaming Store
              </span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Il tuo negozio di fiducia per i migliori videogiochi. Scopri le ultime uscite e i grandi classici a prezzi imbattibili.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-lg"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a 
                href="#" 
                className="p-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-lg"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a 
                href="#" 
                className="p-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-lg"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="#" 
                className="p-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-lg"
                aria-label="YouTube"
              >
                <FaYoutube className="text-xl" />
              </a>
              <a 
                href="#" 
                className="p-2 text-blur-blue hover:text-modern-blue-light transition-colors duration-300 hover:bg-modern-blue/10 rounded-lg"
                aria-label="Discord"
              >
                <FaDiscord className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blur-blue">Link Rapidi</h3>
            <div className="space-y-2">
              <Link 
                to="/products" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Tutti i Prodotti
              </Link>
              <Link 
                to="/products?featured=true" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Prodotti in Evidenza
              </Link>
              <Link 
                to="/products?category=action" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Giochi Action
              </Link>
              <Link 
                to="/products?category=rpg" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Giochi RPG
              </Link>
              <Link 
                to="/products?platform=PC" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Giochi PC
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blur-blue">Servizio Clienti</h3>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                FAQ
              </a>
              <a 
                href="#" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Spedizioni e Resi
              </a>
              <a 
                href="#" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Termini di Servizio
              </a>
              <a 
                href="#" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="block text-text-muted hover:text-modern-blue-light transition-colors duration-300"
              >
                Contattaci
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blur-blue">Contatti</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-modern-blue" />
                <span className="text-text-muted">info@gamingstore.it</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-modern-blue" />
                <span className="text-text-muted">+39 123 456 7890</span>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-modern-blue mt-1" />
                <span className="text-text-muted">
                  Via Roma 123<br />
                  00100 Roma, Italia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-muted text-sm">
              © 2024 Gaming Store. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-text-muted hover:text-modern-blue-light text-sm transition-colors duration-300"
              >
                Cookie Policy
              </a>
              <a 
                href="#" 
                className="text-text-muted hover:text-modern-blue-light text-sm transition-colors duration-300"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;