'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiCheckCircle } from 'react-icons/fi';
import { RestaurantSettings } from '@/types/models';
import { getRestaurantSettings, updateRestaurantSettings } from '@/services/firestore';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getRestaurantSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await updateRestaurantSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <div className="p-12 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Restaurant Settings</h1>
        <p className="text-xs text-slate-400">Manage contact information, WhatsApp numbers, and delivery charges</p>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-500 flex items-center gap-2">
          <FiCheckCircle className="h-4 w-4" /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl space-y-4 text-xs font-bold">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1">Restaurant Name</label>
          <input
            type="text"
            required
            value={settings.restaurantName}
            onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1">WhatsApp Order Number (Include Country Code)</label>
          <input
            type="text"
            required
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Base Delivery Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Free Delivery Minimum ($)</label>
            <input
              type="number"
              step="1"
              value={settings.freeDeliveryThreshold}
              onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1">Opening Hours</label>
          <input
            type="text"
            value={settings.openingHours}
            onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-xs font-bold text-white hover:bg-brand-600 shadow-md"
        >
          <FiSave className="h-4 w-4" /> Save Settings
        </button>
      </form>
    </div>
  );
}
