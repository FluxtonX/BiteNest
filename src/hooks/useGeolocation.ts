'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveVisitorPreciseLocation } from '@/services/firestore';
import { VisitorLocation } from '@/types/models';

export function useGeolocation() {
  const [location, setLocation] = useState<VisitorLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'dismissed'>('prompt');

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      console.warn('⚠️ Geolocation API not supported or blocked (Requires HTTPS)');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('📍 Requesting browser location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: VisitorLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        console.log('✅ Latitude & Longitude acquired:', coords.latitude, coords.longitude);
        setLocation(coords);
        setLoading(false);
        setPermissionStatus('granted');
        localStorage.setItem('sizzle_geo_status', 'granted');
        localStorage.setItem('sizzle_geo_coords', JSON.stringify(coords));

        // Generate or retrieve visitor ID
        let visitorId = localStorage.getItem('sizzle_visitor_id');
        if (!visitorId) {
          visitorId = `vis_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
          localStorage.setItem('sizzle_visitor_id', visitorId);
        }

        // Save precise latitude & longitude directly to Firebase Firestore
        saveVisitorPreciseLocation(visitorId, coords)
          .then(() => console.log('🔥 Visitor precise location saved to Firestore collection "visitors"!'))
          .catch((err) => console.error('❌ Failed to save location to Firebase:', err));
      },
      (err) => {
        setLoading(false);
        setError(err.message);
        console.warn('⚠️ Geolocation error / permission denied:', err.message);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionStatus('denied');
          localStorage.setItem('sizzle_geo_status', 'denied');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Automatically trigger browser location prompt on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedStatus = localStorage.getItem('sizzle_geo_status');
    if (storedStatus) {
      setPermissionStatus(storedStatus as any);
    }

    const cachedLoc = localStorage.getItem('sizzle_geo_coords');
    if (cachedLoc) {
      try {
        setLocation(JSON.parse(cachedLoc));
      } catch {}
    }

    // Trigger request if not explicitly denied or dismissed
    if (storedStatus !== 'denied' && storedStatus !== 'dismissed') {
      requestLocation();
    }
  }, [requestLocation]);

  const dismissPrompt = () => {
    setPermissionStatus('dismissed');
    localStorage.setItem('sizzle_geo_status', 'dismissed');
  };

  return {
    location,
    error,
    loading,
    permissionStatus,
    requestLocation,
    dismissPrompt,
  };
}
