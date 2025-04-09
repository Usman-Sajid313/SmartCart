"use client";

import React from 'react';
import { Anton } from 'next/font/google';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
});

const categories = [
  {
    id: 1,
    name: "Men",
    image: "ch1.jpg",
    link: "/men",
  },
  {
    id: 2,
    name: "Electronics",
    image: "ch3.jpg",
    link: "/electronics",
  },
  {
    id: 3,
    name: "Women",
    image: "ch2.jpg",
    link: "/women",
  },
  {
    id: 4,
    name: "Cosmetics",
    image: "ch4.jpg",
    link: "/cosmetics",
  },
];

export default function BrowseByCategory() {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-screen-xl mx-auto bg-[#00229A] rounded-lg shadow-md p-6">
        <div className={`text-3xl ${anton.className}`}>
          <h2 className="text-white text-center mb-6">BROWSE BY CATEGORY</h2>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-[600px] relative">
          {categories.map((cat, index) => (
            <a
              key={cat.id}
              href={cat.link}
              className="relative rounded-md overflow-hidden group"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="absolute z-10 text-white text-2xl font-bold top-4 left-4 drop-shadow">
                {cat.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
