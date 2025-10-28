
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SupplyListPage from './pages/SupplyListPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SchoolsPage from './pages/SchoolsPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierProductsPage from './pages/SupplierProductsPage';
import { supabase } from './services/supabase';



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <HashRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/schools" element={<SchoolsPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/suppliers/:supplierId/products" element={<SupplierProductsPage />} />
                  <Route path="/list/:listId" element={<SupplyListPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route 
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                   <Route 
                    path="/order-confirmation"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute role="admin">
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;