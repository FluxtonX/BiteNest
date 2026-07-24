'use client';

import { useState, useEffect } from 'react';
import { Offer } from '@/types/models';
import { getOffers } from '@/services/firestore';
import { OfferBanner } from '@/components/cards/OfferBanner';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers().then((data) => {
      setOffers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Deals & Coupons</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Active Offers & Promo Codes</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Copy your favorite promo codes below and paste them at cart checkout for instant discounts!
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading active offers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <OfferBanner key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
