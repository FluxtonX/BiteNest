'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiStar, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Product } from '@/types/models';
import { getProducts } from '@/services/firestore';
import { useCartStore } from '@/store/useCartStore';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBarModal({ isOpen, onClose }: SearchBarModalProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (isOpen) {
      getProducts().then(setProducts);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
        >
          {/* Search Input Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
            <FiSearch className="h-5 w-5 text-brand-500" />
            <input
              type="text"
              autoFocus
              placeholder="Search burgers, pizza, shawarma, drinks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <FiX className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              {query.trim() ? `Search Results (${filtered.length})` : 'Popular Searches'}
            </div>

            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No delicious items found matching "{query}".
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="group flex items-center justify-between rounded-2xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Link href={`/product/${product.slug}`} onClick={onClose} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="capitalize text-brand-500 font-semibold">{product.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <FiStar className="h-3 w-3 fill-amber-400" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {product.currency}{(product.discountPrice || product.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        addItem(product, 1);
                        onClose();
                      }}
                      className="rounded-xl bg-brand-500 p-2 text-white hover:bg-brand-600 transition-colors"
                      title="Add to cart"
                    >
                      <FiShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer view all */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950/40 text-center">
            <Link
              href={`/menu?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600"
            >
              Explore Full Menu <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
