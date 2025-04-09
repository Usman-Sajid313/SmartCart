"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { FaStar, FaRegStar, FaMinus, FaPlus } from "react-icons/fa";
import Link from 'next/link';


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

type RelatedProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const productRes = await fetch(`/api/products/${id}`);
        if (!productRes.ok) throw new Error("Failed to fetch product details");
        const productData = await productRes.json();
        setProduct(productData.product);

        const reviewsRes = await fetch(`/api/products/${id}/reviews`);
        if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);

        const relatedRes = await fetch(`/api/products/${id}/related`);
        if (!relatedRes.ok) throw new Error("Failed to fetch related products");
        const relatedData = await relatedRes.json();
        setRelated(relatedData.products || []);
      } catch (err: any) {
        console.error("Error fetching product data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <p>Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 text-center text-red-500">
          <p>Error: {error || "Product not found"}</p>
        </div>
        <Footer />
      </div>
    );
  }

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

  const handleAddToCart = () => {
    alert(`Added ${quantity} of "${product.name}" to cart.`);
  };

  const handleAISummarizer = () => alert("AI Summarizer coming soon!");
  const handleSortReviews = () => setReviews([...reviews].sort((a, b) => b.rating - a.rating));
  const handleWriteReview = () => alert("Write a Review coming soon!");

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden mb-4 max-w-[15rem] md:max-w-[20rem] mx-auto">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.slice(1).map((img, idx) => (
                <div key={idx} className="border rounded-lg w-24 h-24 overflow-hidden">
                  <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              {renderStars(product.rating)}
              <span className="ml-2 text-gray-600">{(product.rating || 0).toFixed(1)}</span>
            </div>
            <p className="text-2xl font-semibold mb-4">${product.price}</p>
            <p className="mb-4">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2">Sizes:</p>
                <div className="flex gap-2">
                  {product.sizes.map((s, idx) => (
                    <button key={idx} className="border px-3 py-1 rounded hover:bg-gray-200">
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center gap-2">
              <p className="font-semibold">Quantity:</p>
              <div className="flex items-center border rounded">
                <button type="button" className="p-2 hover:bg-gray-200" onClick={() => setQuantity((q) => Math.max(q - 1, 1))}>
                  <FaMinus />
                </button>
                <span className="px-4">{quantity}</span>
                <button type="button" className="p-2 hover:bg-gray-200" onClick={() => setQuantity((q) => q + 1)}>
                  <FaPlus />
                </button>
              </div>
            </div>
            <button onClick={handleAddToCart} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">All Reviews ({reviews.length})</h2>
          <div className="flex gap-4 mb-4">
            <button onClick={handleAISummarizer} className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white">
              AI Summarizer
            </button>
            <button onClick={handleSortReviews} className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white">
              Sort Reviews
            </button>
            <button onClick={handleWriteReview} className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white">
              Write a Review
            </button>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{rev.userName}</div>
                    <div className="flex">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{rev.date}</p>
                  <p>{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">There are currently no reviews for this product.</div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="cursor-pointer"
                >
                  <div className="border rounded p-4 shadow hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded mb-2" />
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="font-bold text-lg">${item.price}</p>
                  </div>
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
