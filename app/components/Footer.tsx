"use client"; 

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#00229A] text-white py-8 mt-20">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">SmartCart</h2>
            <p className="mb-4">Discover the smartest way to shop!</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <FaFacebookF className="hover:text-gray-200" />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter className="hover:text-gray-200" />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram className="hover:text-gray-200" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">COMPANY</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Career
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">HELP</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Delivery Details
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">FAQ</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Manage Deliveries
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Payments
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm mb-2 md:mb-0">
            SmartCart.com © 2025. All Rights Reserved
          </p>
          <div className="flex space-x-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              alt="MasterCard"
              className="h-5"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-5"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
