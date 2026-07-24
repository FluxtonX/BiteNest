'use client';

import { useState, useEffect } from 'react';
import { saveVisitorPreciseLocation } from '@/services/firestore';
import { VisitorLocation } from '@/types/models';

export function useGeolocation() {
  const [location, setLocation] = useState<VisitorLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'dismissed'>('prompt');

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
  }, []);

  const requestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: VisitorLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setLocation(coords);
        setLoading(false);
        setPermissionStatus('granted');
        localStorage.setItem('sizzle_geo_status', 'granted');
        localStorage.setItem('sizzle_geo_coords', JSON.stringify(coords));

        // Save precise lat, lon into Firebase Firestore
        const visitorId = localStorage.getItem('sizzle_visitor_id') || 'anonymous';
        saveVisitorPreciseLocation(visitorId, coords).catch((err) =>
          console.warn('Failed to save location to Firebase:', err)
        );
      },
      (err) => {
        setLoading(false);
        setError(err.message);
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
  };

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
