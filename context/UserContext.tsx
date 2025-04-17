'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type User = {
  user_id: number;
  email: string;
  name?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;

  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;

  wishlist: number[];
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  return (
    <UserContext.Provider value={{ user, setUser, cart, setCart, wishlist, setWishlist }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be inside UserProvider');
  return ctx;
}
