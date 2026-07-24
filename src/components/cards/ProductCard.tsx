'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiClock, FiStar, FiShoppingBag, FiEye, FiZap } from 'react-icons/fi';
import { Product } from '@/types/models';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { QuickViewModal } from '../ui/QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);

  const discount = product.discountPercentage;
  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/50 hover:shadow-xl hover:border-brand-500/30 dark:hover:border-brand-500/40"
      >
        {/* Top Badges & Favorite Button */}
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
              <FiZap className="h-3 w-3 animate-pulse" />
              {discount}% OFF
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Add to favorites"
            className={`absolute top-3 right-3 rounded-full p-2.5 backdrop-blur-md transition-all ${
              favorite
                ? 'bg-red-500 text-white shadow-lg scale-110'
                : 'bg-slate-900/60 text-white hover:bg-white hover:text-red-500 dark:hover:bg-slate-900'
            }`}
          >
            <FiHeart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Floating Trigger */}
          <button
            onClick={() => setIsQuickViewOpen(true)}
            aria-label="Quick View"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 hover:bg-brand-500 hover:text-white"
          >
            <FiEye className="h-3.5 w-3.5" />
            Quick View
          </button>
        </div>

        {/* Product Details */}
        <div className="mt-3.5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400">
                {product.category}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="h-3 w-3 text-slate-400" />
                {product.preparationTime}
              </span>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-brand-500 transition-colors">
              <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Rating */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {product.currency}{finalPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="text-xs font-medium text-slate-400 line-through">
                    {product.currency}{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
                <span className="text-[10px] font-normal text-slate-400">({product.totalReviews})</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-all shadow-sm active:scale-95"
              >
                <FiShoppingBag className="h-3.5 w-3.5" />
                Add to Cart
              </button>

              <Link
                href={`/cart?instant=${product.id}`}
                className="w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-brand-500 to-orange-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-brand-600 hover:to-orange-700 transition-all active:scale-95 food-glow-sm"
              >
                <FiZap className="h-3.5 w-3.5" />
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
