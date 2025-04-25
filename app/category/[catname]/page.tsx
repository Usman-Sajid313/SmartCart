"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { FaStar, FaRegStar } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  image: string;  
  price: number;
  rating: number;
  reviews_count: number;
};

export default function CategoryPage() {
  const { catname } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNum = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(pageNum);
  }, [searchParams]);

  useEffect(() => {
    if (!catname) return;
    setLoading(true);

    fetch(`/api/products?category=${catname}&page=${currentPage}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch category products");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.products || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setError("Failed to load category products.");
        setLoading(false);
      });
  }, [catname, currentPage]);

  useEffect(() => {
    if (sortOrder === "default") return;
    const sortedProducts = [...products].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setProducts(sortedProducts);
  }, [sortOrder]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/category/${catname}?page=${newPage}`);
    setCurrentPage(newPage);
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl py-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold capitalize">{catname} Products</h1>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu((prev) => !prev)}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Sort
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setShowSortMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Price Ascending
                </button>
                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setShowSortMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Price Descending
                </button>
              </div>
            )}
          </div>
        </div>

        {loading && <p className="text-center">Loading {catname} products...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition-shadow flex flex-col">
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
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Prev
            </button>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
