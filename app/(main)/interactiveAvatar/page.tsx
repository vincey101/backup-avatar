"use client";

import { useState, useEffect } from 'react';
import InteractiveAvatar from "@/components/InteractiveAvatar";
import { Toaster } from "sonner";

export default function InteractiveAvatarPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);

  if (!userData) {
    return null; // or a loading state
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Toaster position="top-right" richColors closeButton />
      <InteractiveAvatar />
    </main>
  );
} 