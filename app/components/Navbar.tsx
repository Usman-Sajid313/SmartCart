'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FaSearch, FaUser } from 'react-icons/fa';
import { useUserContext } from '@/context/UserContext';

export default function Navbar() {
  const { user, setUser, cart, wishlist } = useUserContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  function handleLogout() {
    setUser(null);
  }

  return (
    <nav className="w-full bg-white shadow py-2">
      <div className="flex items-center justify-evenly w-full px-4">
        
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-700">
            SmartCart
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/category/clothing" className="hover:text-blue-600">
            Clothing
          </Link>
          <Link href="/category/cosmetics" className="hover:text-blue-600">
            Cosmetics
          </Link>
          <Link href="/category/electronics" className="hover:text-blue-600">
            Electronics
          </Link>
        </div>

        <div className="relative hidden md:block w-1/3 max-w-md">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 pl-4 pr-10 rounded-full bg-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/wishlist" className="hover:text-blue-600">
            ♡ {wishlist.length}
          </Link>

          <Link href="/cart" className="hover:text-blue-600">
            🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Link>

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="hover:text-blue-600">
              <FaUser size={20} />
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
