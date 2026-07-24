'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiClock,
  FiStar,
  FiArrowRight,
  FiShoppingBag,
  FiMapPin,
  FiPhoneCall,
  FiCheckCircle,
  FiSearch,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Product, Category, Offer, Review } from '@/types/models';
import { getProducts, getCategories, getOffers, getReviews } from '@/services/firestore';
import { ProductCard } from '@/components/cards/ProductCard';
import { CategoryChip } from '@/components/cards/CategoryChip';
import { OfferBanner } from '@/components/cards/OfferBanner';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prods, cats, offs, revs] = await Promise.all([
          getProducts(),
          getCategories(),
          getOffers(),
          getReviews(),
        ]);
        setProducts(prods);
        setCategories(cats);
        setOffers(offs);
        setReviews(revs);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured || p.isPopular).slice(0, 6);
  const dealsProducts = products.filter((p) => p.discountPercentage > 0).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-8 pb-16 overflow-hidden">
        {/* Decorative Background Glowing Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-400 backdrop-blur-md"
              >
                <FiZap className="h-4 w-4 text-brand-500 animate-bounce" />
                <span>HOT & FRESH DIRECT TO YOUR DOORSTEP</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
              >
                Savor <span className="food-gradient-text">Gourmet Flavors</span> Delivered via WhatsApp
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Handcrafted Angus beef burgers, 72-hour sourdough pizzas, and authentic shawarmas. Order instantly with zero account creation required!
              </motion.p>

              {/* Instant Search Bar Input */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                action="/menu"
                className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-2 shadow-xl backdrop-blur-md max-w-xl mx-auto lg:mx-0"
              >
                <FiSearch className="h-5 w-5 text-slate-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="What food are you craving today? (e.g. Truffle Burger)"
                  className="w-full bg-transparent px-3 py-2 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-orange-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg hover:from-brand-600 hover:to-orange-700 transition-all food-glow-sm flex items-center gap-1.5"
                >
                  Search
                </button>
              </motion.form>

              {/* Badges / Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-500 dark:text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                    <FiStar className="h-4 w-4 fill-amber-400" />
                  </div>
                  <span>4.9 / 5.0 Rating (2,400+ Reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                    <FiClock className="h-4 w-4" />
                  </div>
                  <span>Avg 20-30 Min Delivery</span>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto h-[380px] sm:h-[460px] w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-2xl backdrop-blur-xl">
                <Image
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                  alt="Gourmet Burger Hero"
                  fill
                  priority
                  className="object-cover rounded-2xl animate-float"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent rounded-2xl" />

                {/* Floating Activity Glass Pill 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-slate-950/80 p-4 backdrop-blur-md text-white shadow-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <FaWhatsapp className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Direct WhatsApp Order</div>
                      <div className="text-sm font-extrabold text-white">Click, Confirm & Enjoy!</div>
                    </div>
                  </div>
                  <Link
                    href="/menu"
                    className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    Order Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Explore Flavor Categories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              What Are You Craving Today?
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors"
          >
            View All Categories <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <CategoryChip key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* TODAY'S DEALS & OFFERS BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Exclusive Savings</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Today's Promo Deals & Discounts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <OfferBanner key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      {/* POPULAR FOODS GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Most Wanted Dishes</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Popular Chef Specials
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600"
          >
            See Full Menu <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl skeleton-box" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* HOW WHATSAPP ORDERING WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-emerald-500/10 blur-[100px] pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Zero Signup Hassle</span>
            <h2 className="text-3xl font-black">How Direct WhatsApp Ordering Works</h2>
            <p className="text-sm text-slate-300">
              Skip traditional app logins and lengthy checkout forms. Order your meal in under 30 seconds!
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Build Your Cart',
                desc: 'Browse our mouth-watering menu and select your favorite burgers, pizzas, and sides.',
              },
              {
                step: '02',
                title: 'Click WhatsApp Order',
                desc: 'Enter your delivery address and click the Order button to automatically generate your itemized message.',
              },
              {
                step: '03',
                title: 'Instant Confirmation',
                desc: 'Our kitchen receives your order immediately and dispatches our express driver to your location.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md hover:border-emerald-500/40 transition-colors"
              >
                <span className="text-4xl font-black text-emerald-400/30">{s.step}</span>
                <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Real Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Loved By Foodies Everywhere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                    <Image src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={rev.userName} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.userName}</h4>
                    <span className="text-xs text-slate-400">Ordered: {rev.productName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RESTAURANT STORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12">
          <div className="relative h-80 sm:h-[400px] w-full overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt="Our Kitchen Story"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Our Passion</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Crafted With Passion, Wood-Fired With Perfection
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Founded in 2024, Sizzle & Slice was born from a simple belief: high quality culinary dining shouldn't require long wait times. We source 100% grass-fed Angus beef, import San Marzano tomatoes directly from Campania, and naturally ferment our sourdough for 72 hours.
            </p>

            <div className="space-y-2 pt-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-emerald-500" />
                100% Organic & Fresh Local Ingredients
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-emerald-500" />
                Sanitized Express Delivery Packaging
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-emerald-500" />
                No Hidden Service Fees
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-brand-600 transition-all food-glow-sm"
              >
                Read Our Story <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
