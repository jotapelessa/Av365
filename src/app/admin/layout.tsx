'use client';

import { useState, ReactNode } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import PageTransition from '@/components/layout/PageTransition';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-admin-bg">
      {/* Sidebar Exclusiva do Super Admin */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      
      <main 
        className="flex-1 transition-all duration-500 ease-[0.25, 0.1, 0.25, 1]"
        style={{ 
          marginLeft: isCollapsed ? '80px' : '280px' 
        }}
      >
        <div className="p-4 md:p-6 lg:p-6 max-w-[1600px] mx-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
