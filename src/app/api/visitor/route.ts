import { NextRequest, NextResponse } from 'next/server';
import { updateVisitorRecord } from '@/services/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, location, deviceType, browser, os, language, screenSize, themePreference, skippedLocation } = body;

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId is required' }, { status: 400 });
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
    const country = req.headers.get('x-vercel-ip-country') || 'US';
    const city = req.headers.get('x-vercel-ip-city') || 'New York';
    const region = req.headers.get('x-vercel-ip-country-region') || 'NY';

    await updateVisitorRecord({
      visitorId,
      location,
      ip,
      country,
      city,
      region,
      deviceType,
      browser,
      os,
      language,
      screenSize,
      themePreference,
      skippedLocation,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to sync visitor' }, { status: 500 });
  }
}
