// app/cart/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useUserContext } from '@/context/UserContext';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

export default function CartPage() {
  const router = useRouter();
  const { cart, setCart } = useUserContext();

  // Helpers
  const updateQuantity = (idx: number, newQty: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left: Cart Items List */}
        <div className="flex-1 bg-white rounded-lg p-6 shadow space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(idx, Math.max(item.quantity - 1, 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(idx, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeItem(idx)}
                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 mt-6">
              Add some products to your cart!
            </p>
          )}
        </div>

        {/* Right: Order Summary & Checkout */}
        <div className="lg:w-1/3 bg-white rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity}
                      {item.size ? ` • Size: ${item.size}` : ''}
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${item.price * item.quantity}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Your cart is empty.</div>
            )}
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${subtotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded text-white ${
              cart.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Go to Checkout →
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
