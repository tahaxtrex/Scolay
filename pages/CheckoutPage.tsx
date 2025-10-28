
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { CashIcon, CreditCardIcon } from '../components/icons';
import { useToast } from '../contexts/ToastContext';
import { Order, Database } from '../types';

type PaymentMethod = 'cash' | 'card';
type CardProvider = 'visa' | 'paypal';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

const CheckoutPage: React.FC = () => {
    const { user, profile } = useAuth();
    const { cart, totalPrice, clearCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        fullName: profile?.full_name || '',
        street: '',
        city: '',
        postalCode: '',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [cardProvider, setCardProvider] = useState<CardProvider | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return (
            address.fullName &&
            address.street &&
            address.city &&
            address.postalCode &&
            paymentMethod
        );
    };

    const handlePlaceOrder = async () => {
        if (!isFormValid() || !user) {
            setError('Please fill all required fields and select a payment method.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Create the order
            const deliveryAddress = `${address.fullName}, ${address.street}, ${address.city}, ${address.postalCode}`;
            const orderPayload: OrderInsert = {
                user_id: user.id,
                total_price: totalPrice,
                delivery_address: deliveryAddress,
                delivery_option: 'delivery', // Assuming delivery
                status: 'pending',
            };
            // FIX: Cast payload to 'any' to workaround Supabase type inference issue.
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert(orderPayload as any)
                .select()
                .single();

            if (orderError) throw orderError;
            
            if (!orderData) {
              throw new Error("Order creation failed, no order data returned.");
            }

            const typedOrderData = orderData as Order;

            // 2. Create the order items
            const orderItems: OrderItemInsert[] = cart.map(item => ({
                order_id: typedOrderData.id,
                product_id: item.product.id,
                quantity: item.selectedQuantity,
                price_at_purchase: item.product.price,
            }));

            // FIX: Cast payload to 'any' to workaround Supabase type inference issue.
            const { error: itemsError } = await supabase.from('order_items').insert(orderItems as any);
            
            if (itemsError) throw itemsError;

            // 3. Success
            showToast('Order placed successfully!');
            clearCart();
            navigate('/order-confirmation', { state: { orderId: typedOrderData.id } });

        } catch (err: any) {
            console.error('Error placing order:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
                    {/* Left Column: Form */}
                    <main className="lg:col-span-7 space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Shipping Address</h2>
                            <form className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div className="sm:col-span-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full name</label>
                                    <input type="text" name="fullName" id="fullName" value={address.fullName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Address</label>
                                    <input type="text" name="street" id="street" value={address.street} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" id="city" value={address.city} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                                    <input type="text" name="postalCode" id="postalCode" value={address.postalCode} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="text" name="phone" id="phone" value={address.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Payment Method</h2>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PaymentOption
                                    icon={<CashIcon className="w-8 h-8 text-green-500" />}
                                    label="Cash on Delivery"
                                    selected={paymentMethod === 'cash'}
                                    onClick={() => { setPaymentMethod('cash'); setCardProvider(null); }}
                                />
                                <PaymentOption
                                    icon={<CreditCardIcon className="w-8 h-8 text-blue-500" />}
                                    label="Pay by Card"
                                    selected={paymentMethod === 'card'}
                                    onClick={() => setPaymentMethod('card')}
                                />
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="mt-6 border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-800">Card Options</h3>
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <PaymentOption label="Visa / Mastercard" selected={cardProvider === 'visa'} onClick={() => setCardProvider('visa')} />
                                        <PaymentOption label="PayPal" selected={cardProvider === 'paypal'} onClick={() => setCardProvider('paypal')} />
                                    </div>
                                    <p className="mt-4 text-xs text-gray-500">Card payment functionality is for demonstration purposes only.</p>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Column: Order Summary */}
                    <aside className="lg:col-span-5 mt-10 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-sm border sticky top-24 p-6">
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-4">Order summary</h2>
                            <ul role="list" className="divide-y divide-gray-200 mt-4">
                                {cart.map(item => (
                                    <li key={item.product.id} className="flex py-4">
                                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                                            <img src={item.product.image_url || `https://picsum.photos/seed/${item.product.id}/200`} alt={item.product.name} className="w-full h-full object-center object-cover" />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div>
                                                <div className="flex justify-between text-sm font-medium text-gray-900">
                                                    <h3>{item.product.name}</h3>
                                                    <p className="ml-4">{item.product.price * item.selectedQuantity} MAD</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">Qty: {item.selectedQuantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                             <div className="mt-6 space-y-4 border-t pt-4">
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
                                {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!isFormValid() || loading}
                                    className="w-full bg-orange-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const PaymentOption = ({ icon, label, selected, onClick }: { icon?: React.ReactNode; label: string; selected: boolean; onClick: () => void; }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center text-center p-4 border-2 rounded-lg transition-colors ${
            selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
    >
        {icon && <div className="mr-3">{icon}</div>}
        <span className="font-medium text-gray-700">{label}</span>
    </button>
);


export default CheckoutPage;