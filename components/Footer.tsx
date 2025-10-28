
import React from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, PhoneIcon, LocationIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Scolay Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">Scolay</Link>
            <p className="text-gray-600 text-sm">
              Making school supply shopping simple and stress-free for parents across Morocco.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-blue-600">Shop</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-blue-600">How It Works</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 text-gray-500 mr-3" />
                <a href="mailto:contact@scolay.ma" className="text-gray-600 hover:text-blue-600">contact@scolay.ma</a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-600">+212 5XX-XXXXXX</span>
              </li>
              <li className="flex items-start">
                <LocationIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <span className="text-gray-600">Rabat, Morocco</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Scolay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
