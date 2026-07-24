'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiTag, FiClock } from 'react-icons/fi';
import { Offer } from '@/types/models';

interface OfferBannerProps {
  offer: Offer;
}

export function OfferBanner({ offer }: OfferBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 text-white shadow-xl"
    >
      {/* Background Banner Graphic */}
      <div className="absolute top-0 right-0 h-full w-1/2 opacity-30 pointer-events-none">
        <Image src={offer.bannerUrl} alt={offer.title} fill className="object-cover mask-gradient" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900" />
      </div>

      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-400 backdrop-blur-md">
          <FiTag className="h-3.5 w-3.5" />
          LIMITED OFFER
        </div>

        <h3 className="mt-3 text-xl sm:text-2xl font-black text-white leading-tight">{offer.title}</h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">{offer.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-brand-500/60 bg-brand-500/10 px-4 py-2 text-sm font-mono font-bold text-brand-400">
            <span>{offer.code}</span>
            <button
              onClick={handleCopyCode}
              className="ml-2 rounded-lg bg-brand-500 p-1.5 text-white hover:bg-brand-600 transition-colors"
              title="Copy Coupon Code"
            >
              {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <FiClock className="h-3.5 w-3.5 text-brand-400" />
            Valid until {offer.validUntil}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
