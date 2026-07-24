'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiTag,
  FiShoppingBag,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiMapPin,
  FiPhone,
  FiUser,
  FiFileText,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCartStore } from '@/store/useCartStore';
import { getRestaurantSettings, saveOrderRecord, getProductBySlug, getProducts } from '@/services/firestore';
import { RestaurantSettings, Order } from '@/types/models';

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const instantProductId = searchParams.get('instant');
  const instantQty = Number(searchParams.get('qty')) || 1;

  const {
    items,
    couponCode,
    discountPercentage,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getGrandTotal,
    generateWhatsAppMessage,
    addItem,
  } = useCartStore();

  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function init() {
      const sett = await getRestaurantSettings();
      setSettings(sett);

      // Handle instant order query parameter if passed
      if (instantProductId) {
        const prods = await getProducts();
        const found = prods.find((p) => p.id === instantProductId);
        if (found) {
          addItem(found, instantQty);
        }
      }
    }
    init();
  }, [instantProductId, instantQty, addItem]);

  // Load saved contact details if existing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCustomerName(localStorage.getItem('sizzle_cust_name') || '');
      setCustomerPhone(localStorage.getItem('sizzle_cust_phone') || '');
      setDeliveryAddress(localStorage.getItem('sizzle_cust_address') || '');
    }
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponMessage({ text: 'Coupon code applied successfully!', success: true });
    } else {
      setCouponMessage({ text: 'Invalid coupon code. Try WELCOME20', success: false });
    }
  };

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setFormError('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }

    setFormError('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('sizzle_cust_name', customerName);
      localStorage.setItem('sizzle_cust_phone', customerPhone);
      localStorage.setItem('sizzle_cust_address', deliveryAddress);
    }

    const baseFee = settings?.deliveryFee || 3.99;
    const freeThresh = settings?.freeDeliveryThreshold || 45;
    const taxRate = settings?.taxRate || 8.5;
    const restPhone = settings?.whatsappNumber || '15552345678';
    const currSymbol = settings?.currencySymbol || '$';

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const delivery = getDeliveryFee(baseFee, freeThresh);
    const grandTotal = getGrandTotal(baseFee, freeThresh, taxRate);

    // Save order record in database for admin panel
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SZ-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      customerName,
      customerPhone,
      deliveryAddress,
      notes,
      subtotal,
      discount,
      deliveryFee: delivery,
      grandTotal,
      status: 'pending',
      whatsappSentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await saveOrderRecord(newOrder);

    // Generate WhatsApp link and open
    const waUrl = generateWhatsAppMessage(
      customerName,
      customerPhone,
      deliveryAddress,
      notes,
      restPhone,
      currSymbol,
      baseFee,
      freeThresh,
      taxRate
    );

    clearCart();
    window.open(waUrl, '_blank');
    router.push(`/order-success?ordId=${newOrder.orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 mx-auto">
          <FiShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Looks like you haven't added any gourmet dishes yet. Explore our mouth-watering burgers and sourdough pizzas!
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:from-brand-600 hover:to-orange-700 food-glow"
        >
          Explore Menu Now <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const baseFee = settings?.deliveryFee || 3.99;
  const freeThresh = settings?.freeDeliveryThreshold || 45;
  const taxRate = settings?.taxRate || 8.5;
  const currSymbol = settings?.currencySymbol || '$';

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryFee(baseFee, freeThresh);
  const grandTotal = getGrandTotal(baseFee, freeThresh, taxRate);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Your Food Cart</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Review items and place order directly via WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Items in Order ({items.length})</span>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:underline font-semibold flex items-center gap-1"
              >
                <FiTrash2 className="h-3.5 w-3.5" /> Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <div key={item.product.id} className="py-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                    <span className="text-xs text-brand-500 font-semibold">
                      {currSymbol}{(item.product.discountPrice || item.product.price).toFixed(2)} each
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                    >
                      <FiMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                    >
                      <FiPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {currSymbol}{item.itemTotal.toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-slate-400 hover:text-red-500 mt-1"
                    >
                      <FiTrash2 className="h-3.5 w-3.5 ml-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-3">
              <FiTag className="h-5 w-5 text-brand-500" />
              <input
                type="text"
                placeholder="Promo Code (e.g. WELCOME20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
              >
                Apply
              </button>
            </form>

            {couponCode && (
              <div className="mt-3 flex items-center justify-between text-xs text-emerald-500 font-bold bg-emerald-500/10 p-2.5 rounded-xl">
                <span>Active Coupon: {couponCode} ({discountPercentage}% OFF)</span>
                <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500">
                  Remove
                </button>
              </div>
            )}

            {couponMessage && !couponCode && (
              <p className={`mt-2 text-xs font-semibold ${couponMessage.success ? 'text-emerald-500' : 'text-red-500'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>
        </div>

        {/* Right Checkout & Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleWhatsAppCheckout}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-5"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiUser className="text-brand-500" /> Customer Delivery Info
            </h3>

            {formError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs font-bold text-red-500">
                {formError}
              </div>
            )}

            <div className="space-y-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Phone Number (For WhatsApp Order Updates) *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555 987 6543"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Delivery Address *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    rows={2}
                    required
                    placeholder="Street, Apartment / House No., Landmark"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Special Cooking / Delivery Notes (Optional)</label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Extra spicy sauce, ring doorbell twice"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">{currSymbol}{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Promo Discount ({discountPercentage}%)</span>
                  <span>-{currSymbol}{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Estimated Delivery Fee</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {delivery === 0 ? <strong className="text-emerald-500">FREE</strong> : `${currSymbol}${delivery.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Estimated Tax ({taxRate}%)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currSymbol}{(((subtotal - discount) * taxRate) / 100).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>Grand Total</span>
                <span className="text-brand-500">{currSymbol}{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Order CTA Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-4 text-sm font-black text-white shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all active:scale-98"
            >
              <FaWhatsapp className="h-5 w-5" />
              Order Direct via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
