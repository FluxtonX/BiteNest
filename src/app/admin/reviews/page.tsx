'use client';

import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiStar } from 'react-icons/fi';
import { Review } from '@/types/models';
import { getReviews, updateReviewStatus } from '@/services/firestore';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const data = await getReviews();
    setReviews(data);
  }

  const handleModerate = async (id: string, isApproved: boolean) => {
    await updateReviewStatus(id, isApproved);
    loadReviews();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customer Reviews Moderation</h1>
        <p className="text-xs text-slate-400">Approve or reject customer submitted reviews</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.userName}</h4>
                <div className="text-xs text-slate-400">Item: {rev.productName}</div>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <FiStar key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  rev.isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                {rev.isApproved ? 'APPROVED' : 'PENDING REVIEW'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModerate(rev.id, true)}
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 flex items-center gap-1"
                >
                  <FiCheck /> Approve
                </button>
                <button
                  onClick={() => handleModerate(rev.id, false)}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 flex items-center gap-1"
                >
                  <FiX /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
