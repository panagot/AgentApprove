'use client';

import type { RegisteredAgent } from '@/lib/types';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useEffect, useState } from 'react';

export function AgentsList() {
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);
  const [name, setName] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch('/api/agents')
      .then(r => r.json())
      .then(d => setAgents(d.agents ?? []));

  useEffect(() => {
    load();
  }, []);

  const register = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, callbackUrl: callbackUrl || undefined }),
      });
      setName('');
      setCallbackUrl('');
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-sm text-zinc-600">
        Link AI agents to your account. Each agent can receive webhook callbacks
        when you approve or reject actions.
      </p>

      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-sm font-semibold text-zinc-900">Register agent</p>
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
          placeholder="Agent name (e.g. Travel Bot)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-mono text-xs"
          placeholder="Webhook URL (optional)"
          value={callbackUrl}
          onChange={e => setCallbackUrl(e.target.value)}
        />
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={saving || !name.trim()}
          onClick={register}
        >
          {saving ? 'Registering…' : 'Link agent'}
        </Button>
      </div>

      <div className="space-y-2">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <p className="font-semibold text-zinc-900">{agent.name}</p>
            {agent.callbackUrl && (
              <p className="mt-1 truncate font-mono text-xs text-zinc-500">
                {agent.callbackUrl}
              </p>
            )}
            {agent.dailySpendLimit && (
              <p className="mt-1 text-xs text-zinc-500">
                Daily limit: {agent.dailySpendLimit}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
