'use client';

import type { DashboardStats } from '@/lib/types';
import { useEffect, useState } from 'react';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col rounded-xl bg-white/80 px-3 py-2.5 backdrop-blur">
      <span className="text-xl font-bold tabular-nums text-zinc-900">{value}</span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export function StatsBar() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setStats(d.stats));
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Stat label="Pending" value={stats.pending} />
      <Stat label="Approved today" value={stats.approvedToday} />
      <Stat label="Rejected today" value={stats.rejectedToday} />
      <Stat label="Agents linked" value={stats.registeredAgents} />
    </div>
  );
}
