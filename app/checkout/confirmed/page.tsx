'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { FaHome } from 'react-icons/fa'

type Shipping = {
  firstName: string
  lastName: string
  address: string
  city: string
  postal: string
  phone: string
}

type Item = {
  productId: number
  quantity: number
  price: number
}

export default function OrderConfirmedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [shipping, setShipping] = useState<Shipping | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [orderId, setOrderId] = useState<string | null>(null)
  const [newBalance, setNewBalance] = useState<number | null>(null)

  useEffect(() => {
    const s = searchParams.get('shipping')
    const i = searchParams.get('items')
    const oid = searchParams.get('orderId')
    const nb = searchParams.get('newBalance')

    try {
      if (s) setShipping(JSON.parse(s))
      if (i) setItems(JSON.parse(i))
      if (oid) setOrderId(oid)
      if (nb) setNewBalance(Number(nb))
    } catch {
      router.replace('/')
    }
  }, [searchParams, router])

  if (!shipping || items.length === 0 || !orderId || newBalance === null) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 text-center">
          <p className="text-red-500">Loading your confirmation…</p>
        </div>
        <Footer />
      </>
    )
  }

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 space-y-8">
        <h1 className="text-4xl font-bold text-center">Thank you for your order!</h1>
        <p className="text-center text-gray-600">Order #{orderId} has been placed successfully.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <span className="font-medium">Name:</span>{' '}
                {shipping.firstName} {shipping.lastName}
              </div>
              <div>
                <span className="font-medium">Address:</span>{' '}
                {shipping.address}, {shipping.city} {shipping.postal}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {shipping.phone}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-gray-700">
                  <span>Product #{it.productId} × {it.quantity}</span>
                  <span>${it.price * it.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-gray-800">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Your new balance:</span>
                <span>${newBalance}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <FaHome className="mr-2" />
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
