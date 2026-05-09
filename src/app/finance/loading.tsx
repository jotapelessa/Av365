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

function FinanceLogSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-[6px] bg-slate-50/50 relative overflow-hidden">
      <Shimmer />
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-[6px] bg-slate-100 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-2 w-20 bg-slate-50 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="h-4 w-16 bg-slate-100 rounded-full animate-pulse" />
    </div>
  );
}

export default function FinanceLoading() {
  return (
    <DashboardContainer>
      {/* Header Skeleton */}
      <DashboardItem className="mb-10">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-12 w-80 bg-slate-100 rounded-[6px] animate-pulse" />
        </div>
      </DashboardItem>

      {/* KPI Skeleton Grid */}
      <DashboardItem className="mb-8">
        <DashboardGrid cols={4}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ui-card h-32 animate-pulse bg-slate-50 border-slate-50 relative overflow-hidden">
               <Shimmer />
            </div>
          ))}
        </DashboardGrid>
      </DashboardItem>

      {/* Main Content Skeleton */}
      <DashboardItem className="mb-8">
        <DashboardGrid>
          <div className="lg:col-span-8 ui-card h-[400px] animate-pulse bg-slate-50 border-slate-50 relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="lg:col-span-4 ui-card h-[400px] animate-pulse bg-slate-900/5 border-slate-100 relative overflow-hidden">
            <Shimmer />
          </div>
        </DashboardGrid>
      </DashboardItem>

      {/* Logs Skeleton */}
      <DashboardItem>
        <DashboardGrid>
          <div className="lg:col-span-6 ui-card space-y-4">
            <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse mb-6" />
            {[1, 2, 3, 4, 5].map((i) => <FinanceLogSkeleton key={i} />)}
          </div>
          <div className="lg:col-span-6 ui-card space-y-4">
            <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse mb-6" />
            {[1, 2, 3, 4, 5].map((i) => <FinanceLogSkeleton key={i} />)}
          </div>
        </DashboardGrid>
      </DashboardItem>
    </DashboardContainer>
  );
}
