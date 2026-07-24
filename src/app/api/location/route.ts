import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Read IP from headers safely
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    // Geo headers provided by Vercel/Cloudflare if deployed
    const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'US';
    const city = req.headers.get('x-vercel-ip-city') || 'New York';
    const region = req.headers.get('x-vercel-ip-country-region') || 'NY';
    const timezone = req.headers.get('x-vercel-ip-timezone') || 'America/New_York';

    return NextResponse.json({
      ip,
      country,
      city,
      region,
      timezone,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ip: '127.0.0.1',
        country: 'US',
        city: 'New York',
        region: 'NY',
        timezone: 'America/New_York',
      },
      { status: 200 }
    );
  }
}
