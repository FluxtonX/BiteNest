'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export function useVisitorTracking() {
  const [visitorId, setVisitorId] = useState<string>('');
  const { theme } = useThemeStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let id = localStorage.getItem('sizzle_visitor_id');
    if (!id) {
      id = `vis_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('sizzle_visitor_id', id);
    }
    setVisitorId(id);

    // Collect device metrics
    const userAgent = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/Mobi|Android/i.test(userAgent)) deviceType = 'Mobile';
    else if (/Tablet|iPad/i.test(userAgent)) deviceType = 'Tablet';

    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    let os = 'Unknown';
    if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Win')) os = 'Windows';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    const screenSize = `${window.innerWidth}x${window.innerHeight}`;
    const language = navigator.language || 'en-US';

    // Post metrics to visitor API
    fetch('/api/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: id,
        deviceType,
        browser,
        os,
        language,
        screenSize,
        themePreference: theme,
      }),
    }).catch((err) => console.warn('Visitor tracking error:', err));
  }, [theme]);

  return { visitorId };
}
