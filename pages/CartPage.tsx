
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { TrashIcon } from '../components/icons';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, itemCount, totalPrice } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any school supplies yet.</p>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          <section className="lg:col-span-8">
            <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {cart.map((item) => (
                <li key={item.product.id} className="flex py-6 bg-white px-4 sm:px-6">
                   <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.product.image_url || `https://picsum.photos/seed/${item.product.id}/200`}
                      alt={item.product.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product.name}</h3>
                        <p className="ml-4">{item.product.price * item.selectedQuantity} MAD</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Unit Price: {item.product.price} MAD</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.selectedQuantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="w-12 text-center border-l border-r border-gray-300"
                          value={item.selectedQuantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value, 10) || 1)}
                          min="1"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.selectedQuantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="font-medium text-red-600 hover:text-red-500 flex items-center"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section className="lg:col-span-4 mt-8 lg:mt-0 bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">{totalPrice.toFixed(2)} MAD</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">{totalPrice.toFixed(2)} MAD</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full flex justify-center items-center bg-orange-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
