import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiAward, FiHeart, FiSmile, FiZap } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Our Heritage & Passion</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
          Culinary Excellence Delivered Express
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          At Sizzle & Slice, we bridge the gap between high-end gourmet dining and fast casual convenience. Built around wood-fired ovens and 100% fresh organic ingredients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: FiAward,
            title: 'Master Chef Quality',
            desc: 'Every sauce, dough ball, and seasoning blend is crafted in-house by our seasoned culinary team.',
          },
          {
            icon: FiZap,
            title: 'Express 20-Min Delivery',
            desc: 'Insulated thermal delivery bags guarantee your meal arrives piping hot and fresh every single time.',
          },
          {
            icon: FiSmile,
            title: 'Customer Satisfaction',
            desc: 'Direct WhatsApp communication ensures immediate confirmation and personalized order tweaks.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-xl backdrop-blur-md space-y-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 mx-auto">
              <item.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
