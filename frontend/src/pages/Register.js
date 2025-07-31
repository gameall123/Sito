import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUserTag, FaGamepad } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username richiesto';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve essere almeno 3 caratteri';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome completo richiesto';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Conferma password richiesta';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const result = await register({
      username: formData.username,
      email: formData.email,
      full_name: formData.full_name,
      password: formData.password
    });
    
    if (result.success) {
      navigate('/login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 page-transition">
      <div className="absolute inset-0 bg-gradient-to-br from-modern-blue/5 to-modern-blue-light/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-modern-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-modern-blue-light/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center fade-in">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <FaGamepad className="text-4xl text-modern-blue animate-pulse" />
            <h1 className="text-3xl font-gaming font-bold gradient-text">
              Gaming Store
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-blur-blue mb-2">
            Unisciti a noi!
          </h2>
          <p className="text-text-muted">
            Crea il tuo account per iniziare
          </p>
        </div>

        <div className="card slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blur-blue mb-2">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`input-field pl-10 w-full ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Scegli un username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blur-blue mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`input-field pl-10 w-full ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Il tuo indirizzo email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-blur-blue mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`input-field pl-10 w-full ${errors.full_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Il tuo nome completo"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blur-blue mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input-field pl-10 pr-10 w-full ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Scegli una password sicura"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-modern-blue transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-blur-blue mb-2">
                Conferma Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input-field pl-10 pr-10 w-full ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Ripeti la password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-modern-blue transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-modern-blue focus:ring-modern-blue/20 border-slate-600 rounded bg-bg-card"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-text-muted">
                Accetto i{' '}
                <a href="#" className="text-blur-blue hover:text-modern-blue-light transition-colors">
                  Termini di Servizio
                </a>{' '}
                e la{' '}
                <a href="#" className="text-blur-blue hover:text-modern-blue-light transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Registrazione in corso...</span>
                  </>
                ) : (
                  <span>Registrati</span>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-text-muted">
                Hai già un account?{' '}
                <Link
                  to="/login"
                  className="text-blur-blue hover:text-modern-blue-light font-medium transition-colors"
                >
                  Accedi ora
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;