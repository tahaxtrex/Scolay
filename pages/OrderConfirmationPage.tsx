
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '../components/icons';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="bg-gray-50 flex-grow flex items-center justify-center">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-lg mx-auto">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank you for your order!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. You will receive an email confirmation shortly.
        </p>
        {orderId && (
          <div className="bg-gray-100 p-3 rounded-md mb-8">
            <p className="text-sm text-gray-500">Your Order ID is:</p>
            <p className="text-lg font-mono text-gray-800 break-all">{orderId}</p>
          </div>
        )}
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
