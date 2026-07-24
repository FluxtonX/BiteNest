'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types/models';

interface CategoryChipProps {
  category: Category;
  isActive?: boolean;
}

export function CategoryChip({ category, isActive = false }: CategoryChipProps) {
  return (
    <Link href={`/menu?category=${category.slug}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
          isActive
            ? 'bg-gradient-to-r from-brand-500 to-orange-600 text-white shadow-brand-500/25 shadow-lg'
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50'
        }`}
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="40px"
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none">{category.name}</span>
          {category.itemCount !== undefined && (
            <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
              {category.itemCount} items
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
