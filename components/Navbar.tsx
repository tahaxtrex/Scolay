
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartIcon } from './icons';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Scolay
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/schools" className="text-gray-600 hover:text-blue-600 transition-colors">Schools</Link>
            <Link to="/suppliers" className="text-gray-600 hover:text-blue-600 transition-colors">Suppliers</Link>
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">Admin</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
              <CartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
               <button onClick={handleSignOut} className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                  Logout
               </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                 <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Login</Link>
                 <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;