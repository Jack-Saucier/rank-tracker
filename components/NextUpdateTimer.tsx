'use client'

import { useEffect, useState } from 'react'

function getNextRunTime(): Date {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function NextUpdateTimer() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const tick = () => {
      const next = getNextRunTime();
      setCountdown(formatCountdown(next.getTime() - Date.now()));
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!countdown) return null;

  return (
    <div className="update-timer">
      next update in {countdown}
    </div>
  );
}