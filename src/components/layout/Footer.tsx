'use client';

import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiClock, FiHeart, FiShield, FiTruck, FiZap } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pt-16 pb-12 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 via-orange-500 to-amber-400 text-white shadow-lg">
                <FiZap className="h-6 w-6" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                SIZZLE<span className="text-brand-500">&</span>SLICE
              </span>
            </Link>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Crafting mouth-watering gourmet burgers, wood-fired pizzas, and artisan bites delivered piping hot to your doorstep. Order directly via WhatsApp!
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: FaWhatsapp, href: 'https://wa.me/15552345678', color: 'hover:text-emerald-500' },
                { icon: FaInstagram, href: '#', color: 'hover:text-pink-500' },
                { icon: FaFacebook, href: '#', color: 'hover:text-blue-500' },
                { icon: FaTwitter, href: '#', color: 'hover:text-sky-400' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 transition-colors shadow-sm ${s.color}`}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-brand-500 transition-colors">Our Full Menu</Link></li>
              <li><Link href="/offers" className="hover:text-brand-500 transition-colors">Daily Deals & Offers</Link></li>
              <li><Link href="/favorites" className="hover:text-brand-500 transition-colors">My Favorites</Link></li>
              <li><Link href="/delivery-areas" className="hover:text-brand-500 transition-colors">Delivery Coverage</Link></li>
              <li><Link href="/about" className="hover:text-brand-500 transition-colors">Our Kitchen Story</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-brand-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-brand-500 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin/login" className="text-slate-400 hover:text-brand-500 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Kitchen Hotline
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>742 Culinary Avenue, Gourmet District, NYC 10001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span>orders@sizzlenslice.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiClock className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span>Mon - Sun: 10:00 AM - 11:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Sizzle & Slice Restaurant. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with <FiHeart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for food lovers everywhere.
          </div>
        </div>
      </div>
    </footer>
  );
}
