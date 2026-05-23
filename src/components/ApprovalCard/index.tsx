'use client';

import { approvalAction } from '@/lib/actions';
import { RISK_STYLE } from '@/lib/risk';
import type { ApprovalRequest } from '@/lib/types';
import { IDKit, orbLegacy, type RpContext } from '@worldcoin/idkit';
import { MiniKit } from '@worldcoin/minikit-js';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { NavArrowDown, NavArrowUp, ShieldCheck } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ACTION_LABELS = {
  payment: 'Payment',
  sign: 'Sign',
  deploy: 'Deploy',
  api_call: 'API Call',
} as const;

const ACTION_COLORS = {
  payment: 'bg-blue-100 text-blue-800',
  sign: 'bg-violet-100 text-violet-800',
  deploy: 'bg-orange-100 text-orange-800',
  api_call: 'bg-teal-100 text-teal-800',
} as const;

function timeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

async function hapticSuccess() {
  if (!MiniKit.isInstalled()) return;
  try {
    await MiniKit.sendHapticFeedback({
      hapticsType: 'notification',
      style: 'success',
    });
  } catch {
    /* optional */
  }
}

export function ApprovalCard({
  request,
  onUpdate,
}: {
  request: ApprovalRequest;
  onUpdate: () => void;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [approveState, setApproveState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const [rejecting, setRejecting] = useState(false);
  const action = approvalAction(request.id);
  const risk = RISK_STYLE[request.riskLevel];

  const onApprove = async () => {
    setApproveState('pending');
    try {
      const rpRes = await fetch('/api/rp-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!rpRes.ok) throw new Error('Failed to get RP signature');

      const rpSig = await rpRes.json();
      const rpContext: RpContext = {
        rp_id: rpSig.rp_id,
        nonce: rpSig.nonce,
        created_at: rpSig.created_at,
        expires_at: rpSig.expires_at,
        signature: rpSig.sig,
      };

      const idkitRequest = await IDKit.request({
        app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
        action,
        rp_context: rpContext,
        allow_legacy_proofs: true,
      }).preset(orbLegacy({ signal: '' }));

      const completion = await idkitRequest.pollUntilCompletion();

      if (!completion.success) {
        setApproveState('failed');
        setTimeout(() => setApproveState(undefined), 2500);
        return;
      }

      const response = await fetch(`/api/requests/${request.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rp_id: rpSig.rp_id,
          idkitResponse: completion.result,
        }),
      });

      if (!response.ok) {
        setApproveState('failed');
        setTimeout(() => setApproveState(undefined), 2500);
        return;
      }

      await hapticSuccess();
      setApproveState('success');
      onUpdate();
      router.refresh();
    } catch {
      setApproveState('failed');
      setTimeout(() => setApproveState(undefined), 2500);
    }
  };

  const onReject = async () => {
    setRejecting(true);
    try {
      await fetch(`/api/requests/${request.id}/reject`, { method: 'POST' });
      onUpdate();
      router.refresh();
    } finally {
      setRejecting(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {request.agentName}
            </p>
            <h3 className="mt-1 text-base font-semibold leading-snug text-zinc-900">
              {request.summary}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ACTION_COLORS[request.actionType]}`}
          >
            {ACTION_LABELS[request.actionType]}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${risk.className}`}>
            {risk.label}
          </span>
          {request.requiresOrbVerification && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
              <ShieldCheck width={12} height={12} />
              Orb verification required
            </span>
          )}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
            {timeLeft(request.expiresAt)}
          </span>
        </div>

        {request.details && !expanded && (
          <p className="mb-3 line-clamp-2 text-sm text-zinc-600">{request.details}</p>
        )}

        <button
          type="button"
          className="mb-3 flex items-center gap-1 text-xs font-medium text-indigo-600"
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? <NavArrowUp width={14} /> : <NavArrowDown width={14} />}
          {expanded ? 'Hide details' : 'View full action payload'}
        </button>

        {expanded && (
          <div className="mb-4 space-y-2 rounded-xl bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
            {request.amount && <p>amount: {request.amount}</p>}
            {request.target && <p>target: {request.target}</p>}
            {request.details && <p>details: {request.details}</p>}
            <p>action_id: {action}</p>
            {request.callbackUrl && <p>webhook: {request.callbackUrl}</p>}
            <p>request_id: {request.id}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="tertiary"
            size="lg"
            className="w-full"
            disabled={rejecting || approveState === 'pending'}
            onClick={onReject}
          >
            {rejecting ? 'Rejecting…' : 'Reject'}
          </Button>
          <LiveFeedback
            label={{
              failed: 'Verification failed',
              pending: 'Verifying…',
              success: 'Approved ✓',
            }}
            state={approveState}
            className="w-full"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={approveState === 'pending' || rejecting}
              onClick={onApprove}
            >
              Approve with World ID
            </Button>
          </LiveFeedback>
        </div>
      </div>
    </article>
  );
}
