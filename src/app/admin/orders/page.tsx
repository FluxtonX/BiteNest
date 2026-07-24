'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiPhone } from 'react-icons/fi';
import { Order, OrderStatus } from '@/types/models';
import { getOrders, updateOrderStatus } from '@/services/firestore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  }

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">WhatsApp Orders Management</h1>
        <p className="text-xs text-slate-400">Track and update active kitchen & delivery statuses</p>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4">
        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No WhatsApp orders recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-brand-500">{ord.orderNumber}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{ord.customerName}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <FiPhone className="h-3 w-3" /> {ord.customerPhone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{new Date(ord.createdAt).toLocaleTimeString()}</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-brand-500 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing in Kitchen</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Items Ordered:</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {ord.items.map((item, idx) => (
                      <li key={idx}>
                        {item.product.name} × {item.quantity} (${item.itemTotal.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-slate-400">
                    <strong>Delivery Address:</strong> {ord.deliveryAddress}
                  </div>
                  {ord.notes && <div className="mt-1 text-slate-400"><strong>Notes:</strong> {ord.notes}</div>}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white pt-1">
                  <span>Subtotal: ${ord.subtotal.toFixed(2)}</span>
                  <span>Delivery: ${ord.deliveryFee.toFixed(2)}</span>
                  <span className="text-sm font-black text-brand-500">Grand Total: ${ord.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
