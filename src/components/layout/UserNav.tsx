'use client';

import { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";

export default function UserNav() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse border border-slate-200" />;
  }

  return (
    <UserButton 
      appearance={{ 
        elements: { 
          userButtonAvatarWrapper: "w-7 h-7 border border-slate-100 transition-transform hover:scale-110 active:scale-95" 
        } 
      }} 
    />
  );
}
