'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiTag, FiX } from 'react-icons/fi';
import { Offer } from '@/types/models';
import { getOffers, saveOffer, deleteOffer } from '@/services/firestore';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(20);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    const data = await getOffers();
    setOffers(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    await saveOffer({
      title,
      code: code.toUpperCase(),
      discountPercentage: Number(discount),
      description: desc,
      validUntil: '2026-12-31',
      bannerUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      isAvailable: true,
    });

    setIsModalOpen(false);
    setTitle('');
    setCode('');
    loadOffers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete offer?')) {
      await deleteOffer(id);
      loadOffers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Offers & Coupons</h1>
          <p className="text-xs text-slate-400">Manage promotional discount codes</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-600 shadow-md flex items-center gap-1.5"
        >
          <FiPlus className="h-4 w-4" /> Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((off) => (
          <div
            key={off.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-500 text-sm flex items-center gap-1.5">
                <FiTag /> {off.code}
              </span>
              <button onClick={() => handleDelete(off.id)} className="text-slate-400 hover:text-red-500">
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{off.title}</h4>
            <p className="text-xs text-slate-500">{off.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <FiX className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Promo Code</h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25 - 25% Off"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-500 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-md"
              >
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
