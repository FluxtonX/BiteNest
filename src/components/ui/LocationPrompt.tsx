'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheckCircle, FiZap, FiNavigation, FiArrowRight } from 'react-icons/fi';
import { useGeolocation } from '@/hooks/useGeolocation';

export function LocationPrompt() {
  const { location, permissionStatus, loading, requestLocation, dismissPrompt } = useGeolocation();

  if (permissionStatus === 'granted' || permissionStatus === 'denied' || permissionStatus === 'dismissed') {
    return null;
  }

  const handleSkip = () => {
    // Just dismiss the screen without prompting browser geolocation
    dismissPrompt();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-6 text-white"
      >
        {/* Background Ambient Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6"
        >
          {/* Logo Badge */}
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-500 via-orange-500 to-amber-400 text-white shadow-2xl food-glow mx-auto animate-float">
            <FiZap className="h-10 w-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3.5 py-1 text-xs font-bold text-brand-400">
              <FiNavigation className="h-3.5 w-3.5 animate-spin" />
              LOCATION PERMISSION REQUIRED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome to <span className="food-gradient-text">Sizzle & Slice</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
              To check real-time express delivery availability and personalize location-specific offers near you, please allow location access.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={requestLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-600 py-4 text-sm font-black text-white shadow-xl hover:from-brand-600 hover:to-orange-700 transition-all food-glow active:scale-98"
            >
              {loading ? (
                <span>Requesting Location...</span>
              ) : (
                <>
                  <FiMapPin className="h-5 w-5 animate-bounce" />
                  Allow Location Access
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-slate-800/80 px-4 py-3 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              Skip & Continue to Menu <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
            🔒 Your location is used strictly to check delivery coverage and is never shared.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
