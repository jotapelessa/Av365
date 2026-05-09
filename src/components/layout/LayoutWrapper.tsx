'use client';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';
import AdminInspector from '../admin/AdminInspector';
import { LayoutProvider } from '../admin/LayoutContext';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'SUPER_ADMIN' || user?.primaryEmailAddress?.emailAddress === 'jotapelessa@gmail.com';

  useEffect(() => {
    if (user) {
      console.log("CLERK_DEBUG: User ID:", user.id);
      console.log("CLERK_DEBUG: Public Metadata:", user.publicMetadata);
    }
  }, [user]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detecta mobile e ajusta colapso inicial
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carrega as preferências de design dinâmico
  useEffect(() => {
    const root = document.documentElement;
    const r = localStorage.getItem('eggtrack-ui-radius');
    const g = localStorage.getItem('eggtrack-ui-gap');
    const p = localStorage.getItem('eggtrack-ui-padding');

    if (r) root.style.setProperty('--ui-radius', `${r}px`);
    if (g) root.style.setProperty('--ui-gap', `${g}px`);
    if (p) root.style.setProperty('--ui-padding', `${p}px`);
  }, []);

  // Rotas que NÃO devem ter a sidebar global e estrutura de dashboard
  const isPublicRoute = pathname === '/';
  const isAuthRoute = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  const isAdminRoute = pathname?.startsWith('/admin');
  const isSetupRoute = pathname?.startsWith('/setup');
  const isPrintRoute = pathname?.endsWith('/print');

  const shouldShowGlobalLayout = !isPublicRoute && !isAuthRoute && !isAdminRoute && !isSetupRoute && !isPrintRoute;

  const content = (
    <>
      <AdminInspector isAdmin={isAdmin} />
      {shouldShowGlobalLayout ? (
        <div className="flex min-h-screen bg-background overflow-x-hidden">
          {/* Sidebar Global (Dashboard Produtor) */}
          <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
          
          {/* Overlay para fechar sidebar no mobile quando aberta */}
          {isMobile && !isCollapsed && (
            <div 
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsCollapsed(true)}
            />
          )}

          <main 
            className="flex-1 transition-all duration-500 ease-[0.25, 0.1, 0.25, 1]"
            style={{ 
              marginLeft: isMobile ? '0' : (isCollapsed ? '72px' : '260px') 
            }}
          >
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
              <PageTransition key={pathname}>
                {children}
              </PageTransition>
            </div>
          </main>
        </div>
      ) : (
        children
      )}
    </>
  );

  return (
    <LayoutProvider>
      {content}
    </LayoutProvider>
  );
}
