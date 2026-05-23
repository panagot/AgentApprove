'use client';

import type { ActionType, RegisteredAgent } from '@/lib/types';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PRESETS: Array<{
  label: string;
  agentName: string;
  actionType: ActionType;
  summary: string;
  details?: string;
  amount?: string;
  target?: string;
}> = [
  {
    label: 'Flight booking ($842)',
    agentName: 'Travel Agent',
    actionType: 'payment',
    summary: 'Book one-way flight LAX → Seoul',
    details: 'Korean Air KE12 · Business class upgrade',
    amount: '$842.00',
    target: 'koreanair.com/checkout',
  },
  {
    label: 'Production deploy',
    agentName: 'DevOps Bot',
    actionType: 'deploy',
    summary: 'Roll out hotfix to production cluster',
    details: 'Docker image v2.4.2-hotfix · 0 downtime',
    target: 'fly.io/apps/agentapprove',
  },
  {
    label: 'Exa API call ($0.50)',
    agentName: 'Research Agent',
    actionType: 'api_call',
    summary: 'Exa search — 50 results',
    details: 'Competitor pricing intelligence',
    amount: '$0.50',
    target: 'api.exa.ai/search',
  },
];

export function SimulateAgentForm() {
  const router = useRouter();
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);
  const [agentId, setAgentId] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(d => setAgents(d.agents ?? []));
  }, []);

  const submit = async (preset: (typeof PRESETS)[number]) => {
    setSubmitting(true);
    setMessage(null);
    try {
      const agent = agents.find(a => a.name === preset.agentName);
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preset,
          agentId: agentId || agent?.id,
          callbackUrl: callbackUrl || agent?.callbackUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const { request } = await res.json();
      setMessage(`Created request ${request.id.slice(0, 8)}…`);
      router.refresh();
    } catch {
      setMessage('Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-sm text-zinc-600">
        Simulate what happens when an AI agent calls{' '}
        <code className="rounded bg-zinc-100 px-1 text-xs">POST /api/requests</code>.
        High-value actions trigger Orb verification and webhooks fire on resolve.
      </p>

      <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4">
        <label className="text-xs font-semibold text-zinc-700">Linked agent</label>
        <select
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
        >
          <option value="">Auto-match by name</option>
          {agents.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-xs"
          placeholder="Override webhook URL (optional)"
          value={callbackUrl}
          onChange={e => setCallbackUrl(e.target.value)}
        />
      </div>

      {PRESETS.map(preset => (
        <button
          key={preset.label}
          type="button"
          disabled={submitting}
          onClick={() => submit(preset)}
          className="rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm disabled:opacity-50"
        >
          <p className="text-xs font-medium uppercase text-zinc-500">
            {preset.agentName} · {preset.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {preset.summary}
          </p>
          {preset.amount && (
            <p className="mt-1 font-mono text-xs text-zinc-500">{preset.amount}</p>
          )}
        </button>
      ))}

      {message && (
        <p className="text-center text-sm font-medium text-emerald-600">{message}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="tertiary" size="lg" className="w-full" onClick={() => router.push('/home')}>
          Inbox
        </Button>
        <Link href="/integrate" className="w-full">
          <Button variant="primary" size="lg" className="w-full">
            Integration docs
          </Button>
        </Link>
      </div>
    </div>
  );
}
