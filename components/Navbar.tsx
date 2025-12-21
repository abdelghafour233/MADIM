
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="text-2xl font-bold text-emerald-600 cursor-pointer"
          onClick={() => setView('home')}
        >
          سوق المغرب
        </div>

        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <button 
            onClick={() => setView('home')}
            className={`font-semibold ${currentView === 'home' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
          >
            الرئيسية
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`font-semibold ${currentView === 'dashboard' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
          >
            لوحة التحكم
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('cart')}
            className="relative p-2 text-gray-600 hover:text-emerald-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="md:hidden p-2 text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
