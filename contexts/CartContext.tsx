
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CartItem, DetailedSupplyListItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: DetailedSupplyListItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: DetailedSupplyListItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.product.id === item.product.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.product.id === item.product.id
            ? { ...cartItem, selectedQuantity: cartItem.selectedQuantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, selectedQuantity: item.quantity }];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== itemId));
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.product.id === itemId ? { ...item, selectedQuantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((count, item) => count + item.selectedQuantity, 0);
  
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.selectedQuantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};