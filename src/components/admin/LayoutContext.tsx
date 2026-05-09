'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { getLayoutConfigs, saveLayoutConfig } from '@/app/admin/actions-layout';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface LayoutConfig {
  elementId: string;
  viewport: string;
  span: number;
  order: number;
}

interface LayoutContextType {
  configs: Record<string, LayoutConfig>;
  activeViewport: string;
  setActiveViewport: (v: string) => void;
  updateLayout: (elementId: string, span: number, order?: number) => Promise<void>;
  isLoading: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [allConfigs, setAllConfigs] = useState<LayoutConfig[]>([]);
  const [activeViewport, setActiveViewport] = useState("Desktop");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function loadConfigs() {
      setIsLoading(true);
      try {
        const data = await getLayoutConfigs(pathname);
        setAllConfigs(data as LayoutConfig[]);
      } catch (err) {
        console.error("Failed to load layout configs", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadConfigs();
  }, [pathname]);

  // Filtra as configs para o viewport atual
  const configs = useMemo(() => {
    return allConfigs
      .filter(c => c.viewport === activeViewport)
      .reduce((acc, curr) => ({
        ...acc,
        [curr.elementId]: curr
      }), {});
  }, [allConfigs, activeViewport]);

  const updateLayout = async (elementId: string, span: number, order: number = 0) => {
    // Update local state optimistically
    const newConfig = { elementId, viewport: activeViewport, span, order };
    
    setAllConfigs(prev => {
      const filtered = prev.filter(c => !(c.elementId === elementId && c.viewport === activeViewport));
      return [...filtered, newConfig];
    });

    try {
      const res = await saveLayoutConfig({
        pageUrl: pathname,
        elementId,
        viewport: activeViewport,
        span,
        order
      });

      if (!res.success) {
        toast.error("Erro ao salvar layout no servidor.");
      }
    } catch (err) {
      toast.error("Erro crítico ao salvar layout.");
    }
  };

  return (
    <LayoutContext.Provider value={{ configs, activeViewport, setActiveViewport, updateLayout, isLoading }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
