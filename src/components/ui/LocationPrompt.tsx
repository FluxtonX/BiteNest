'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheckCircle, FiX } from 'react-icons/fi';
import { useGeolocation } from '@/hooks/useGeolocation';

export function LocationPrompt() {
  const { location, permissionStatus, loading, requestLocation, dismissPrompt } = useGeolocation();

  if (permissionStatus === 'granted' || permissionStatus === 'denied' || permissionStatus === 'dismissed') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40"
      >
        <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-slate-900/95 p-4 sm:p-5 text-white shadow-2xl backdrop-blur-xl food-glow-sm">
          <button
            onClick={dismissPrompt}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss location request"
          >
            <FiX className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-md">
              <FiMapPin className="h-5 w-5 animate-bounce" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Enable Local Delivery Experience</h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Allow location access to personalize offers and check real-time delivery availability near you.
              </p>

              <div className="mt-3.5 flex items-center gap-2">
                <button
                  onClick={requestLocation}
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-brand-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-brand-600 hover:to-orange-700 transition-all flex items-center gap-1.5"
                >
                  {loading ? (
                    <span>Locating...</span>
                  ) : (
                    <>
                      <FiCheckCircle className="h-3.5 w-3.5" />
                      Allow Location Access
                    </>
                  )}
                </button>
                <button
                  onClick={dismissPrompt}
                  className="rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
