'use client';

import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';

type OwnedItem = {
  item_id: number;
  name: string;
  original_price: number;
  purchase_date: string;
  category: string;
  sizes?: { size: string; stock: number }[];
};

type ResaleListing = {
  listing_id: number;
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  condition: string;
  description?: string;
  images: string[];
  sizes?: { size: string; stock: number }[];
};

export default function ResellItems() {
  const { user } = useUserContext();
  const [ownedItems, setOwnedItems] = useState<OwnedItem[]>([]);
  const [listings, setListings] = useState<ResaleListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for new resale
  const [selectedItemId, setSelectedItemId] = useState<number | ''>('');
  const [resellPrice, setResellPrice] = useState('');
  const [resellQuantity, setResellQuantity] = useState('');
  const [resellCondition, setResellCondition] = useState('');
  const [resellDescription, setResellDescription] = useState('');
  const [resellImages, setResellImages] = useState<FileList | null>(null);
  const [resellSizes, setResellSizes] = useState<{ size: string; stock: number }[]>([]);

  // Fetch owned items and existing resale listings
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/user/owned-items?user_id=${user.user_id}`).then((r) => r.json()),
      fetch(`/api/reseller/listings?user_id=${user.user_id}`).then((r) => r.json()),
    ])
      .then(([ownedData, listingsData]) => {
        setOwnedItems(ownedData.items || []);
        setListings(listingsData.listings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load data');
        setLoading(false);
      });
  }, [user]);

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !selectedItemId) {
      setError('Please select an item to resell');
      return;
    }

    const qty = parseInt(resellQuantity, 10) || 0;
    const price = parseFloat(resellPrice) || 0;

    const formData = new FormData();
    formData.append('user_id', user.user_id.toString());
    formData.append('item_id', selectedItemId.toString());
    formData.append('price', price.toString());
    formData.append('quantity', qty.toString());
    formData.append('condition', resellCondition);
    formData.append('description', resellDescription);
    if (resellImages) {
      Array.from(resellImages).forEach((file) => formData.append('images', file));
    }
    if (resellSizes.length > 0) {
      formData.append('sizes', JSON.stringify(resellSizes));
    }

    try {
      const res = await fetch('/api/reseller/add-listing', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to add listing');
        return;
      }
      const data = await res.json();
      setListings([...listings, data.listing]);
      // reset form
      setSelectedItemId('');
      setResellPrice('');
      setResellQuantity('');
      setResellCondition('');
      setResellDescription('');
      setResellImages(null);
      setResellSizes([]);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleDeleteListing = async (listing_id: number) => {
    if (!confirm('Are you sure you want to remove this resale listing?')) return;
    try {
      const res = await fetch(`/api/reseller/delete-listing?listing_id=${listing_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to delete listing');
        return;
      }
      setListings(listings.filter((l) => l.listing_id !== listing_id));
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resell Your Items</h1>

      {loading && <p>Loading your items and listings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Existing Listings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Resale Listings</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Condition</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.listing_id}>
                <td className="border p-2">{l.name}</td>
                <td className="border p-2">${l.price}</td>
                <td className="border p-2">{l.quantity}</td>
                <td className="border p-2">{l.condition}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteListing(l.listing_id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {listings.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No resale listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Add New Resale Listing */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">List an Item for Resale</h2>
        <form onSubmit={handleAddListing} className="space-y-4">
          <div>
            <label className="block mb-1">Select Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- choose your item --</option>
              {ownedItems.map((item) => (
                <option key={item.item_id} value={item.item_id}>
                  {item.name} (purchased on {new Date(item.purchase_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Resale Price</label>
              <input
                type="text"
                value={resellPrice}
                onChange={(e) => setResellPrice(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="e.g. 25.00"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Quantity to Resell</label>
              <input
                type="text"
                value={resellQuantity}
                onChange={(e) => setResellQuantity(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Condition</label>
            <select
              value={resellCondition}
              onChange={(e) => setResellCondition(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Description (optional)</label>
            <textarea
              value={resellDescription}
              onChange={(e) => setResellDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setResellImages(e.target.files)}
              className="w-full"
            />
          </div>
          {/* If the category supports sizes (e.g. clothing), show size inputs */}
          {ownedItems.find((i) => i.item_id === selectedItemId)?.sizes && (
            <div>
              <label className="block mb-1">Sizes & Stock</label>
              <div className="grid grid-cols-3 gap-2">
                {ownedItems
                  .find((i) => i.item_id === selectedItemId)!
                  .sizes!.map((s) => (
                    <div key={s.size}>
                      <label className="block text-sm">{s.size}</label>
                      <input
                        type="number"
                        placeholder="How many?"
                        className="w-full border p-1 rounded"
                        onChange={(e) => {
                          const stock = parseInt(e.target.value, 10) || 0;
                          setResellSizes((prev) => {
                            const filtered = prev.filter((x) => x.size !== s.size);
                            return [...filtered, { size: s.size, stock }];
                          });
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            List for Resale
          </button>
        </form>
      </section>
    </div>
  );
}
