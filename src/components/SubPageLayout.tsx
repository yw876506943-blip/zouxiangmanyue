import React from 'react';
import { ChevronLeft } from '@/src/lib/icons';

export function SubPageLayout({ title, onBack, children, noPadding = false }: { title: React.ReactNode, onBack: () => void, children: React.ReactNode, noPadding?: boolean }) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafc] overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 pt-12 pb-3 flex items-center justify-center">
        <button onClick={onBack} className="absolute left-4 top-12 p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        {typeof title === 'string' ? <h2 className="text-base font-bold text-slate-800">{title}</h2> : title}
      </div>
      <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>
    </div>
  );
}
