'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  user_id: number;
  email: string;
  name?: string;
};

type CartItem = {
  productId: number;
  quantity: number;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;

  cart: CartItem[];
  setCart: (items: CartItem[]) => void;

  wishlist: number[]; 
  setWishlist: (items: number[]) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const value: UserContextType = {
    user,
    setUser,
    cart,
    setCart,
    wishlist,
    setWishlist,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
