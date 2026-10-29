import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './frontend/index.html',
    './frontend/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B9DCFF',
          300: '#7CB9FF',
          400: '#3897F0',
          500: '#2F80ED',
          600: '#1D6BD6',
          700: '#1652AC',
          800: '#15448C',
          900: '#153B73',
          DEFAULT: '#3897F0',
        },
        campus: {
          blue: '#3B82F6',
          sky: '#60A5FA',
          light: '#F4F9FF',
          card: '#FFFFFF',
          dark: '#111827',
          gray: '#6B7280',
          border: '#E5E7EB',
          success: '#10B981',
          successBg: '#ECFDF5',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'float': '0 12px 36px rgba(47, 128, 237, 0.25)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
