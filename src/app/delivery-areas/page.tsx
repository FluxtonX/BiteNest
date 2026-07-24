import { FiMapPin, FiCheckCircle, FiClock, FiTruck } from 'react-icons/fi';

export default function DeliveryAreasPage() {
  const areas = [
    { name: 'Downtown NYC', fee: 'Free on $35+', estTime: '15-20 min' },
    { name: 'Midtown Manhattan', fee: '$3.99', estTime: '20-25 min' },
    { name: 'Gourmet District', fee: 'Free on $25+', estTime: '10-15 min' },
    { name: 'Westside Harbor', fee: '$3.99', estTime: '25-30 min' },
    { name: 'East Heights', fee: '$4.99', estTime: '25-30 min' },
    { name: 'SoHo & Tribeca', fee: '$3.99', estTime: '20-25 min' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500 font-mono">Express Coverage</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Our Delivery Zones</h1>
        <p className="text-sm text-slate-500">
          We deliver hot and fresh within our 5-mile express radius.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white text-base">
                <FiMapPin className="text-brand-500" /> {area.name}
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500">
                ACTIVE ZONE
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <FiClock className="text-slate-400" /> {area.estTime}
              </span>
              <span className="font-bold text-brand-500">{area.fee}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
