'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FiClock,
  FiStar,
  FiShoppingBag,
  FiZap,
  FiHeart,
  FiCheckCircle,
  FiArrowLeft,
  FiMessageSquare,
  FiX,
} from 'react-icons/fi';
import { Product, Review } from '@/types/models';
import { getProductBySlug, getReviews, submitReview } from '@/services/firestore';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    async function loadProductData() {
      const prod = await getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        const revs = await getReviews();
        setReviews(revs.filter((r) => r.productId === prod.id && r.isApproved));
      }
      setLoading(false);
    }
    loadProductData();
  }, [slug]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">Loading food details...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Food item not found</h2>
        <Link href="/menu" className="inline-block rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white">
          Back to Menu
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    await submitReview({
      productId: product.id,
      productName: product.name,
      userName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSubmitted(false);
      setReviewerName('');
      setReviewComment('');
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-500 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Full Menu
        </Link>
      </div>

      {/* Main product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-80 sm:h-[450px] w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xl">
            <Image
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-4 right-4 rounded-full p-3 backdrop-blur-md transition-all ${
                favorite ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-900/60 text-white hover:bg-white hover:text-red-500'
              }`}
            >
              <FiHeart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImageIdx === idx ? 'border-brand-500 scale-105 shadow-md' : 'border-transparent opacity-60'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <FiStar className="h-4 w-4 fill-amber-400" />
                {product.rating.toFixed(1)}
                <span className="text-xs text-slate-400">({product.totalReviews} reviews)</span>
              </div>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand-500">
                {product.currency}{finalPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-slate-400 line-through font-semibold">
                  {product.currency}{product.price.toFixed(2)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 ml-auto">
                <FiClock className="h-4 w-4 text-brand-500" />
                Prep Time: {product.preparationTime}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
            {product.description}
          </p>

          {/* Ingredients list */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fresh Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <FiCheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-xl px-3 py-1.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-base text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-xl px-3 py-1.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 py-3.5 text-sm font-bold text-slate-800 dark:text-white hover:bg-brand-500 hover:text-white transition-all shadow-sm"
              >
                <FiShoppingBag className="h-4 w-4" />
                Add to Cart (${(finalPrice * quantity).toFixed(2)})
              </button>
            </div>

            <Link
              href={`/cart?instant=${product.id}&qty=${quantity}`}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-600 py-4 text-sm font-black text-white shadow-xl hover:from-brand-600 hover:to-orange-700 transition-all food-glow"
            >
              <FiZap className="h-5 w-5" />
              Instant Order via WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Reviews</h3>
            <p className="text-xs text-slate-400 mt-0.5">Verified customer ratings and experiences</p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white transition-all"
          >
            <FiMessageSquare className="h-4 w-4" /> Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No reviews yet for this dish. Be the first to leave a review!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 backdrop-blur-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.userName}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review {product.name}</h3>

            {reviewSubmitted ? (
              <div className="p-4 text-center text-emerald-500 font-bold space-y-1">
                <FiCheckCircle className="h-8 w-8 mx-auto" />
                <p>Thank you! Your review has been submitted for moderation.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-xl ${star <= reviewRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Comment</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="What did you love about this food?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-500 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-md"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
