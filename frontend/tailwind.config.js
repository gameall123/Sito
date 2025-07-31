/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'modern-blue': '#3B82F6',
        'modern-blue-light': '#60A5FA',
        'modern-blue-dark': '#1D4ED8',
        'blur-blue': 'rgba(59, 130, 246, 0.8)',
        'logout-red': '#EF4444',
        'toast-green': '#10B981',
        'bg-dark': '#0F172A',
        'bg-card': '#1E293B',
        'text-light': '#F1F5F9',
        'text-muted': '#94A3B8'
      },
      fontFamily: {
        'gaming': ['Orbitron', 'sans-serif'],
        'modern': ['Inter', 'sans-serif']
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}