'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiShoppingBag, FiArrowRight, FiPhoneCall } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const ordId = searchParams.get('ordId') || 'SZ-100293';

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
      <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
        <FiCheckCircle className="h-14 w-14" />
      </div>

      <div className="space-y-2">
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
          ORDER SENT TO KITCHEN
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Order #{ordId} Placed!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Your itemized order details have been formatted and sent to our kitchen via WhatsApp. Our kitchen manager will confirm your delivery time shortly.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6 text-left space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="font-bold text-slate-400">Status</span>
          <span className="font-extrabold text-amber-500 uppercase tracking-wider">Kitchen Processing</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="font-bold text-slate-400">Estimated Delivery</span>
          <span className="font-extrabold text-slate-900 dark:text-white">20 - 30 Minutes</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">Kitchen Hotline</span>
          <span className="font-extrabold text-slate-900 dark:text-white">+1 (555) 234-5678</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/menu"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:from-brand-600 hover:to-orange-700"
        >
          <FiShoppingBag className="h-4 w-4" /> Order More Food
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading success details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
