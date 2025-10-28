
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Product, Supplier, DetailedSupplyListItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const SupplierProductsPage: React.FC = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!supplierId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch supplier details
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', supplierId)
          .single();
        
        if (supplierError) throw supplierError;
        setSupplier(supplierData as Supplier);

        // Fetch products for the supplier
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('supplier_id', supplierId)
          .order('name');

        if (productsError) throw productsError;
        setProducts(productsData as Product[]);

      } catch (err: any) {
        console.error('Error fetching supplier products:', err);
        setError(err.message || 'Failed to load data for this supplier.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supplierId]);

  const handleAddToCart = (product: Product) => {
    const itemToAdd: DetailedSupplyListItem = {
      id: product.id, // Use product ID as a unique key for cart operations
      quantity: 1, // Default quantity when adding from a general product list
      product: product,
    };
    addToCart(itemToAdd);
    showToast(`${product.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
            Products from {supplier?.name}
          </h1>
        </div>
        
        {products.length === 0 ? (
          <p className="text-center text-gray-600">This supplier does not have any products listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                <div className="relative">
                  <img 
                    src={product.image_url || `https://picsum.photos/seed/${product.id}/400`} 
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 flex-grow">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                  <p className="mt-4 text-xl font-bold text-gray-900">{product.price.toFixed(2)} MAD</p>
                </div>
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierProductsPage;
