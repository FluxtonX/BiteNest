'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Product } from '@/types/models';
import { useCartStore } from '@/store/useCartStore';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen) return null;

  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Section */}
            <div className="relative p-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/50">
              <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-2xl">
                <Image
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnail selector if multiple images */}
              {product.images.length > 1 && (
                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImageIdx === idx ? 'border-brand-500 scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <FiStar className="h-4 w-4 fill-amber-400" />
                    {product.rating.toFixed(1)}
                  </div>
                </div>

                <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-black text-brand-500">
                    {product.currency}{finalPrice.toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {product.currency}{product.price.toFixed(2)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                    <FiClock className="h-3.5 w-3.5" />
                    {product.preparationTime}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Ingredients tag list */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ingredients</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <FiCheckCircle className="h-3 w-3 text-emerald-500" />
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-orange-600 py-3 font-bold text-white shadow-lg hover:from-brand-600 hover:to-orange-700 transition-all food-glow-sm"
                  >
                    <FiShoppingBag className="h-4 w-4" />
                    Add (${(finalPrice * quantity).toFixed(2)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
