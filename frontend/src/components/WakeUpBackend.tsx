'use client';

import { useEffect } from 'react';

export default function WakeUpBackend() {
  useEffect(() => {
    // Send a minimal request to the backend to wake it up in case it's deployed on a platform like Render and went to sleep
    const wakeUp = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        // Hit the health check endpoint which is fast and lightweight
        await fetch(`${url}/health`, { method: 'GET', cache: 'no-store' });
      } catch (error) {
        // We silently ignore errors as the backend might still be waking up
        // console.error('Wake-up request failed:', error);
      }
    };

    wakeUp();
  }, []);

  // This component doesn't render anything
  return null;
}
