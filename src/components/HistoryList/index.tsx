'use client';

import type { ApprovalRequest, RequestStatus } from '@/lib/types';
import { useEffect, useState } from 'react';

const STATUS_STYLE: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-zinc-100 text-zinc-600',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HistoryList() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/requests')
      .then(r => r.json())
      .then(data => {
        const resolved = (data.requests ?? []).filter(
          (r: ApprovalRequest) => r.status !== 'pending',
        );
        setRequests(resolved);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">Loading audit log…</p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-500">No resolved actions yet.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {requests.map(r => (
        <div
          key={r.id}
          className="rounded-xl border border-zinc-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-zinc-500">{r.agentName}</p>
              <p className="mt-0.5 text-sm font-medium text-zinc-900">
                {r.summary}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[r.status]}`}
            >
              {r.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
            <span>{formatDate(r.resolvedAt ?? r.createdAt)}</span>
            {r.worldIdVerified && (
              <span className="font-medium text-emerald-600">
                World ID verified
              </span>
            )}
          </div>
          {r.approvalHash && (
            <p className="mt-2 break-all font-mono text-[10px] text-zinc-400">
              hash: {r.approvalHash.slice(0, 32)}…
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
