
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
    const { profile } = useAuth();
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8 bg-white">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome, {profile?.role || 'Admin'}!</h2>
                <p className="mt-2 text-gray-600">This is the protected admin area.</p>
                <p className="mt-4 text-gray-600">From here, you will be able to manage schools, grades, products, suppliers, and orders.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Manage Schools</h3>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-green-800">Manage Products</h3>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-semibold text-yellow-800">View Orders</h3>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
