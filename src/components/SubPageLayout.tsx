import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

export function SubPageLayout({ title, onBack, children, noPadding = false, rightElement, showCapsule = true }: { title: React.ReactNode, onBack: () => void, children: React.ReactNode, noPadding?: boolean, rightElement?: React.ReactNode, showCapsule?: boolean }) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafc] overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-center">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        {typeof title === 'string' ? <h2 className="text-base font-bold text-slate-800">{title}</h2> : title}
        
        <div className="absolute right-3 flex items-center space-x-2">
          {rightElement}
          {showCapsule && (
            <div className="flex items-center bg-white/80 border border-slate-200/80 rounded-full px-2.5 py-1.5 space-x-2.5 backdrop-blur-md shadow-sm">
              <MoreHorizontal size={16} className="text-slate-800" />
              <div className="w-px h-3.5 bg-slate-200" />
              <div className="w-4 h-4 rounded-full border-[1.5px] border-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>
    </div>
  );
}
