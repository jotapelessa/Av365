'use client';

import { Bird, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useRef } from 'react';
import FlockCardExpert from '../flocks/FlockCardExpert';

interface FlockCarouselProps {
  flocks: any[];
}

export function FlockCarousel({ flocks }: FlockCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group" data-audit="dashboard__section__flock-carousel">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-primary">
            <Bird size={24} />
          </div>
          <div>
            <h2 className="text-h2 text-slate-900 tracking-tight italic leading-none" data-audit="dashboard__flock-carousel__title">Monitoramento de Lotes</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1" data-audit="dashboard__flock-carousel__subtitle">Visão Profunda & Analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            data-audit="dashboard__flock-carousel__nav-left"
            className="p-3 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-primary hover:border-indigo-100 hover:shadow-lg transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            data-audit="dashboard__flock-carousel__nav-right"
            className="p-3 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-primary hover:border-indigo-100 hover:shadow-lg transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        data-audit="dashboard__flock-carousel__scroll-container"
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {flocks.length > 0 ? (
          flocks.map((flock) => (
            <div key={flock.id} className="min-w-[340px] md:min-w-[380px] snap-center">
              <FlockCardExpert flock={flock} />
            </div>
          ))
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[18px] border border-dashed border-slate-200" data-audit="dashboard__flock-carousel__empty">
            <Activity size={48} className="text-slate-200 mb-4" />
            <p className="text-sm font-black italic text-slate-400">Nenhum lote ativo encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
