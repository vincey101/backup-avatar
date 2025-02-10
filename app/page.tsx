'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));

    if (authToken) {
      router.push('/tutorial'); // Redirect to dashboard if authenticated
    } else {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [router]);

  // Return null or a loading state while checking
  return null;
}
