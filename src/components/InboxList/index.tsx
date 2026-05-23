'use client';

import type { ApprovalRequest } from '@/lib/types';
import { ApprovalCard } from '@/components/ApprovalCard';
import { useCallback, useEffect, useState } from 'react';

export function InboxList() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests?status=pending');
      const data = await res.json();
      setRequests(data.requests ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <p className="text-center text-sm text-zinc-500 py-8">
        Loading pending approvals…
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-base font-medium text-zinc-700">All clear</p>
        <p className="mt-1 text-sm text-zinc-500">
          No agent actions waiting for your approval.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {requests.map(r => (
        <ApprovalCard key={r.id} request={r} onUpdate={load} />
      ))}
    </div>
  );
}
