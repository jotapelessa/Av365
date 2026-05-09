'use client';

import { motion } from 'framer-motion';
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

const Shimmer = () => (
  <motion.div 
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
    animate={{ x: ['100%', '-100%'] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
  />
);

function FlockCardSkeleton() {
  return (
    <div className="ui-card relative overflow-hidden bg-white border-slate-50 min-h-[320px]">
      <Shimmer />
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[6px] bg-slate-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-3 w-20 bg-slate-50 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="w-12 h-4 rounded-full bg-slate-100 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="h-16 bg-slate-50/50 rounded-[6px] border border-slate-50 animate-pulse" />
        <div className="h-16 bg-slate-50/50 rounded-[6px] border border-slate-50 animate-pulse" />
      </div>

      <div className="flex items-end justify-between pt-6 border-t border-slate-50">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-50 rounded-full animate-pulse" />
          <div className="h-10 w-32 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-8 rounded-lg bg-slate-100 animate-pulse" />
          <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function FlocksLoading() {
  return (
    <DashboardContainer>
      <DashboardItem className="mb-10">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-100 rounded-[6px] animate-pulse" />
          <div className="h-4 w-96 bg-slate-50 rounded-full animate-pulse" />
        </div>
      </DashboardItem>

      <DashboardItem>
        <DashboardGrid cols={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="lg:col-span-4">
              <FlockCardSkeleton />
            </div>
          ))}
        </DashboardGrid>
      </DashboardItem>
    </DashboardContainer>
  );
}
