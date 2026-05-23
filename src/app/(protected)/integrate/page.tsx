import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default function IntegratePage() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title="Integrate" />
      </Page.Header>
      <Page.Main className="mb-16 flex flex-col gap-4 text-sm text-zinc-700">
        <p>
          Add AgentApprove to your AI agent in under 5 minutes. When a sensitive
          action is attempted, your agent pauses and waits for human approval.
        </p>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">1. Register your agent</h2>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100">
{`POST /api/agents
{ "name": "My Agent", "callbackUrl": "https://your-agent/webhook" }`}
          </pre>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">2. Request approval</h2>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100">
{`POST /api/requests
Header: x-agent-api-key (optional)
{
  "agentId": "uuid",
  "agentName": "Travel Agent",
  "actionType": "payment",
  "summary": "Book flight SFO → Tokyo",
  "amount": "$842.00",
  "callbackUrl": "https://your-agent/webhook"
}`}
          </pre>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">3. Human approves in World App</h2>
          <p className="mt-2 text-zinc-600">
            User opens AgentApprove mini app → reviews risk level → approves with
            World ID. Each action gets a unique proof binding{' '}
            <code className="rounded bg-zinc-100 px-1">agent-approve:{'{requestId}'}</code>.
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">4. Webhook callback</h2>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100">
{`POST your-callback-url
{
  "event": "approval.approved",
  "requestId": "uuid",
  "status": "approved",
  "worldIdVerified": true,
  "approvalHash": "sha256...",
  "request": { "summary": "...", "amount": "$842" }
}`}
          </pre>
        </section>

        <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <h2 className="font-semibold text-indigo-900">World stack</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-indigo-800">
            <li>World ID 4.0 — action-bound human verification</li>
            <li>Human-in-the-Loop — compatible with @worldcoin/human-in-the-loop</li>
            <li>AgentKit — agents register via AgentBook, humans approve via mini app</li>
            <li>Credit API — high-value actions flagged by risk engine</li>
            <li>MiniKit — haptics, wallet auth, notifications (roadmap)</li>
          </ul>
        </section>
      </Page.Main>
    </>
  );
}
