import Link from 'next/link';
import { FiAlertCircle, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500 mx-auto">
        <FiAlertCircle className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white">404 - Dish Not Found</h1>
      <p className="text-sm text-slate-500 leading-relaxed">
        Oops! The page or food item you are looking for has been moved or doesn't exist on our menu.
      </p>
      <div className="pt-2">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-brand-600"
        >
          <FiArrowLeft className="h-4 w-4" /> Return to Menu
        </Link>
      </div>
    </div>
  );
}
