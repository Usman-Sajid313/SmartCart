"use client";

import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Anton } from 'next/font/google';
import Link from 'next/link';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
});

type Product = {
  id: number;
  name: string;
  image: string; 
  price: number;
  rating: number;    
  reviews_count: number;
};

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/products/featured')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.products || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err);
        setError('Failed to load featured products.');
        setLoading(false);
      });
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <section className="mx-auto max-w-screen-xl py-8 px-4">
      <div className={`text-3xl ${anton.className}`}>
        <h2 className="text-center my-3">FEATURED PRODUCTS</h2>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`} 
            className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition-shadow flex flex-col"
          >
            <img
              src={product.image || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={product.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <div className="flex items-center space-x-1 mb-2">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500">({product.reviews_count})</span>
            </div>
            <p className="text-xl font-bold mb-2">${product.price}</p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-black rounded-md font-semibold hover:bg-black hover:text-white transition-colors">
          View All
        </button>
      </div>
    </section>
  );
}

export default FeaturedProducts;
