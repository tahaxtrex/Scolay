
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Supplier } from '../types';
import { StorefrontIcon, MailIcon } from '../components/icons';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('suppliers').select('*').order('name');

      if (error) {
        console.error('Error fetching suppliers:', error);
        setError('Could not load suppliers. Please try again later.');
      } else {
        setSuppliers((data as Supplier[]) || []);
      }
      setLoading(false);
    };

    fetchSuppliers();
  }, []);

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Partner Suppliers</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Browse products directly from our trusted network of bookstores and suppliers.
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-600">
            <p>Loading suppliers...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                <div className="p-8 flex-grow">
                  <div className="flex items-center mb-4">
                    <StorefrontIcon className="w-8 h-8 mr-3 text-blue-500" />
                    <h2 className="uppercase tracking-wide text-lg text-blue-600 font-semibold">{supplier.name}</h2>
                  </div>
                   {supplier.contact_email && (
                    <p className="mt-2 text-gray-500 flex items-center text-sm">
                      <MailIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{supplier.contact_email}</span>
                   </p>
                   )}
                </div>
                 <div className="p-6 bg-gray-50">
                    <Link 
                        to={`/suppliers/${supplier.id}/products`}
                        className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                    >
                        View All Products
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
