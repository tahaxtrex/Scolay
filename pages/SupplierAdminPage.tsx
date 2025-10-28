import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Supplier, Product, Database } from '../types';

const SupplierAdminPage: React.FC = () => {
    const { profile } = useAuth();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form state for supplier profile
    const [supplierName, setSupplierName] = useState('');
    const [supplierDesc, setSupplierDesc] = useState('');
    const [supplierLogo, setSupplierLogo] = useState('');

    // Form state for new product
    const [newProductName, setNewProductName] = useState('');
    const [newProductDesc, setNewProductDesc] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [newProductImageUrl, setNewProductImageUrl] = useState('');

    useEffect(() => {
        if (profile && profile.supplier_id) {
            fetchSupplierData(profile.supplier_id);
        } else if (profile) {
            setError("Your profile is not associated with a supplier account.");
            setLoading(false);
        }
    }, [profile]);

    const fetchSupplierData = async (supplierId: string) => {
        setLoading(true);
        try {
            const { data: supplierData, error: supplierError } = await supabase
                .from('suppliers')
                .select('*')
                .eq('id', supplierId)
                .single();
            if (supplierError) throw supplierError;

            setSupplier(supplierData);
            setSupplierName(supplierData.name);
            setSupplierDesc(supplierData.description || '');
            setSupplierLogo(supplierData.logo_url || '');

            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('supplier_id', supplierId)
                .order('name');
            if (productsError) throw productsError;

            setProducts(productsData || []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch supplier data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSupplier = async (e: FormEvent) => {
        e.preventDefault();
        if (!supplier) return;
        setIsSaving(true);
        const { error } = await supabase
            .from('suppliers')
            .update({ name: supplierName, description: supplierDesc, logo_url: supplierLogo })
            .eq('id', supplier.id);
        if (error) setError("Failed to update profile.");
        else setSuccessMessage("Profile updated successfully!");
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleAddProduct = async (e: FormEvent) => {
        e.preventDefault();
        if (!supplier) return;
        setIsSaving(true);

        const newProduct: Database['public']['Tables']['products']['Insert'] = {
            name: newProductName,
            description: newProductDesc,
            price: parseFloat(newProductPrice),
            category: newProductCategory,
            image_url: newProductImageUrl,
            supplier_id: supplier.id,
        };

        const { data, error } = await supabase.from('products').insert(newProduct).select();
        if (error) {
            setError("Failed to add product.");
        } else if (data) {
            setProducts(prev => [...prev, ...data]);
            // Reset form
            setNewProductName('');
            setNewProductDesc('');
            setNewProductPrice('');
            setNewProductCategory('');
            setNewProductImageUrl('');
            setSuccessMessage("Product added successfully!");
        }
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    if (loading) return <div className="text-center p-8">Loading Supplier Portal...</div>;
    if (error || !supplier) return <div className="text-center p-8 text-red-500">{error || "Could not load supplier information."}</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                     <div className="flex items-center space-x-4">
                        {supplier.logo_url && <img src={supplier.logo_url} alt={`${supplier.name} logo`} className="h-16 w-16 object-contain rounded-md border p-1" />}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
                            <p className="text-gray-600 mt-1">Supplier Dashboard</p>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Add Product Form */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a New Product</h2>
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                                    <input type="text" placeholder="Product Name" value={newProductName} onChange={e => setNewProductName(e.target.value)} required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                                    <input type="number" placeholder="Price (MAD)" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                                <input type="text" placeholder="Category (e.g., Writing, Art)" value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                                <textarea placeholder="Product Description" value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3}></textarea>
                                {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                                <input type="url" placeholder="Image URL" value={newProductImageUrl} onChange={e => setNewProductImageUrl(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <div className="text-right">
                                    {/* FIX: Replaced custom .btn-primary class with Tailwind CSS utilities */}
                                    <button type="submit" disabled={isSaving} className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        {isSaving ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Product List */}
                        <div className="bg-white p-6 rounded-lg shadow">
                             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Products</h2>
                             <div className="space-y-4">
                                {products.length > 0 ? products.map(product => (
                                    <div key={product.id} className="flex items-center p-3 bg-gray-50 rounded-md border">
                                        <img src={product.image_url || 'https://placehold.co/100'} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>
                                        <p className="font-semibold">{product.price} MAD</p>
                                    </div>
                                )) : <p className="text-gray-500">You haven't added any products yet.</p>}
                             </div>
                        </div>
                    </div>
                    {/* Supplier Profile */}
                    <div className="bg-white p-6 rounded-lg shadow h-fit">
                         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Store Profile</h2>
                         <form onSubmit={handleUpdateSupplier} className="space-y-4">
                            {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                            <input type="text" placeholder="Store Name" value={supplierName} onChange={e => setSupplierName(e.target.value)} required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                            <textarea placeholder="Store Description" value={supplierDesc} onChange={e => setSupplierDesc(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={4}></textarea>
                            {/* FIX: Replaced custom .input-field class with Tailwind CSS utilities */}
                            <input type="url" placeholder="Logo URL" value={supplierLogo} onChange={e => setSupplierLogo(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <div className="text-right">
                                {/* FIX: Replaced custom .btn-secondary class with Tailwind CSS utilities */}
                                <button type="submit" disabled={isSaving} className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                    {isSaving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                         </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupplierAdminPage;
