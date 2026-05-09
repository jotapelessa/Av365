'use client';

import { motion } from 'framer-motion';

const Shimmer = () => (
  <motion.div 
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
    animate={{ x: ['100%', '-100%'] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
  />
);

export function MetricSkeleton() {
  return (
    <div className="ui-card relative overflow-hidden bg-slate-50/50 border-slate-100">
      <Shimmer />
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-md bg-slate-100 animate-pulse" />
        <div className="w-8 h-4 rounded-full bg-slate-100 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-20 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="ui-card relative overflow-hidden bg-white border-slate-50 h-[400px]">
      <Shimmer />
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-3 w-24 bg-slate-50 rounded-full animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-8 rounded-lg bg-slate-100 animate-pulse" />
          <div className="w-16 h-8 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="flex items-end gap-2 h-64 mt-4 px-2">
        {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-50 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="ui-card relative overflow-hidden bg-white border-slate-50 h-full">
      <Shimmer />
      <div className="h-5 w-48 bg-slate-100 rounded-full mb-8 animate-pulse" />
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 p-4 rounded-md border border-slate-50 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-3 w-full bg-slate-100 rounded-full" />
              <div className="h-2 w-2/3 bg-slate-50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="h-10 w-64 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-4 w-96 bg-slate-50 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-4">
          <FeedSkeleton />
        </div>
      </div>
    </div>
  );
}
