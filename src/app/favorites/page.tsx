'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Product } from '@/types/models';
import { getProducts } from '@/services/firestore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { ProductCard } from '@/components/cards/ProductCard';

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FiHeart className="text-red-500 fill-red-500" /> Saved Favorites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Your saved dishes for instant repeat orders</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading saved favorites...</div>
      ) : favoriteProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-500 space-y-4">
          <FiHeart className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Saved Favorites Yet</h3>
          <p className="text-xs max-w-md mx-auto">
            Click the heart icon on any food item to save it here for quick access later.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-600"
          >
            Explore Menu <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
