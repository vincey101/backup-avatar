'use client';

import { useEffect } from 'react';
import { initializeSessionTimeout, clearSessionTimeout } from '@/utils/sessionManager';

export default function SessionManager() {
  useEffect(() => {
    initializeSessionTimeout();
    return () => {
      clearSessionTimeout();
    };
  }, []);

  return null;
} 