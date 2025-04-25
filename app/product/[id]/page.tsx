'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaRegStar, FaMinus, FaPlus } from 'react-icons/fa';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useUserContext } from '@/context/UserContext';

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  images: string[];
  sizes?: { size: string; stock: number }[];
};

type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type RelatedProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, cart, setCart } = useUserContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<RelatedProduct[]>([]);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const p = await fetch(`/api/products/${id}`);
        if (!p.ok) throw new Error('Could not fetch product');
        const { product } = await p.json();
        setProduct(product as Product);
        if ((product as Product).sizes?.length) {
          setSelectedSize((product as Product).sizes![0].size);
        }
        const rv = await fetch(`/api/products/${id}/reviews`);
        if (!rv.ok) throw new Error('Could not fetch reviews');
        const { reviews } = await rv.json();
        setReviews(reviews || []);

        const rl = await fetch(`/api/products/${id}/related`);
        if (!rl.ok) throw new Error('Could not fetch related');
        const { products: related } = await rl.json();
        setRelated(related || []);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 text-center">Loading…</div>
        <Footer />
      </>
    );
  }
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 text-center text-red-600">
          Error: {error || 'Product not found'}
        </div>
        <Footer />
      </>
    );
  }

  const renderStars = (r: number) =>
    Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(r) ? (
        <FaStar key={i} className="text-yellow-500" />
      ) : (
        <FaRegStar key={i} className="text-yellow-500" />
      )
    );

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      alert('Please select a size.');
      return;
    }

    const newItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: product.sizes ? selectedSize : undefined,
    };

    const idx = cart.findIndex(
      (c) =>
        c.productId === newItem.productId &&
        (product.sizes ? c.size === newItem.size : true)
    );

    let updated: CartItem[];
    if (idx > -1) {
      updated = cart.map((c, i) =>
        i === idx ? { ...c, quantity: c.quantity + newItem.quantity } : c
      );
    } else {
      updated = [...cart, newItem];
    }

    setCart(updated);
    router.push('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to write a review.');
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.user_id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      const { review } = await res.json();
      setReviews((r) => [...r, review]);
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewComment('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden mb-4 max-w-sm mx-auto">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
            <div className="flex gap-2 justify-center">
              {product.images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="border rounded-lg w-20 h-20 overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              {renderStars(product.rating)}
              <span className="ml-2 text-gray-600">{product.rating}</span>
            </div>
            <p className="text-2xl font-semibold mb-4">
              ${product.price}
            </p>
            <p className="mb-4 text-gray-700">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2">Sizes:</p>
                <div className="flex gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      className={
                        'px-4 py-2 border rounded ' +
                        (selectedSize === s.size
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100')
                      }
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center gap-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            All Reviews ({reviews.length})
          </h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => alert('AI Summarizer coming soon!')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              AI Summarizer
            </button>
            <button
              onClick={() =>
                setReviews((r) => [...r].sort((a, b) => b.rating - a.rating))
              }
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Sort Reviews
            </button>
            <button
              onClick={() => {
                if (!user) {
                  alert('Please log in to write a review.');
                  return;
                }
                setShowReviewForm(true);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Write a Review
            </button>
          </div>
          {!reviews.length && (
            <p className="text-gray-600">There are currently no reviews.</p>
          )}
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="border rounded-lg p-4 mb-4 bg-white"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{rev.userName}</span>
                <div className="flex">{renderStars(rev.rating)}</div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{rev.date}</p>
              <p>{rev.comment}</p>
            </div>
          ))}

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="border rounded-lg p-6 bg-white"
            >
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block mb-1">Rating (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={reviewRating}
                  onChange={(e) =>
                    setReviewRating(Number(e.target.value))
                  }
                  className="w-20 border rounded px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) =>
                    setReviewComment(e.target.value)
                  }
                  rows={3}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="block border rounded-lg p-4 hover:shadow"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="font-bold">${p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
