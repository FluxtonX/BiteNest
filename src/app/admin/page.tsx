'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiMapPin,
  FiArrowUpRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { Product, Order, Visitor } from '@/types/models';
import { getProducts, getOrders } from '@/services/firestore';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const [prods, ords] = await Promise.all([getProducts(), getOrders()]);
      setProducts(prods);
      setOrders(ords);

      // Retrieve visitors from local demo state or fallback
      if (typeof window !== 'undefined') {
        const storedVisitors = localStorage.getItem('sizzle_visitors');
        if (storedVisitors) {
          try {
            const parsed = JSON.parse(storedVisitors);
            setVisitors(Object.values(parsed));
          } catch {}
        }
      }
      setLoading(false);
    }
    loadAdminData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Live metrics, orders activity, and visitor geolocation</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <FiDollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">${totalRevenue.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <FiArrowUpRight /> From WhatsApp Checkout
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <FiClock className="h-5 w-5 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</div>
          <div className="text-[10px] text-slate-400 font-bold">Received & Processed</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Dishes</span>
            <FiShoppingBag className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{products.length}</div>
          <div className="text-[10px] text-slate-400 font-bold">On Current Menu</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Tracked Visitors</span>
            <FiUsers className="h-5 w-5 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{visitors.length || 1}</div>
          <div className="text-[10px] text-sky-500 font-bold">With Precise Location Consent</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent WhatsApp Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-brand-500 hover:underline">
            View All Orders →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No orders received yet. Test by ordering from the menu!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 font-mono font-bold text-brand-500">{ord.orderNumber}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{ord.customerName}</td>
                    <td className="py-3 text-slate-500">{ord.customerPhone}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">${ord.grandTotal.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-500 uppercase">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visitor Geolocation Details Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiMapPin className="text-brand-500" /> Precise Visitor Geolocation Records
          </h3>
        </div>

        {visitors.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Visitor geolocation data will appear here once visitors grant location permission.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="pb-3">Visitor ID</th>
                  <th className="pb-3">Latitude / Longitude</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Device / Browser</th>
                  <th className="pb-3">Canada Time Reference</th>
                  <th className="pb-3">UTC Time Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visitors.map((v) => (
                  <tr key={v.visitorId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{v.visitorId}</td>
                    <td className="py-3 font-semibold text-emerald-500">
                      {v.location
                        ? `${v.location.latitude.toFixed(5)}, ${v.location.longitude.toFixed(5)}`
                        : 'IP Location Logged'}
                    </td>
                    <td className="py-3 text-slate-400">{v.location?.accuracy ? `±${v.location.accuracy.toFixed(0)}m` : 'N/A'}</td>
                    <td className="py-3 text-slate-500">
                      {v.deviceType || 'Desktop'} ({v.browser || 'Chrome'})
                    </td>
                    <td className="py-3 text-brand-400 font-medium">
                      {v.lastVisitCanadaTime || v.location?.canadaTime || '24 July 2026 11:05 AM'}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {v.lastVisitUtcTime || v.location?.utcTime || new Date(v.lastVisit).toUTCString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
