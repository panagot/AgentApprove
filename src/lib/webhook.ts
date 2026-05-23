import type { ApprovalRequest } from './types';

export async function dispatchWebhook(
  request: ApprovalRequest,
  event: 'approval.approved' | 'approval.rejected',
): Promise<void> {
  const url = request.callbackUrl;
  if (!url) return;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        requestId: request.id,
        status: request.status,
        worldIdVerified: request.worldIdVerified ?? false,
        approvalHash: request.approvalHash,
        timestamp: request.resolvedAt,
        request: {
          agentName: request.agentName,
          actionType: request.actionType,
          summary: request.summary,
          amount: request.amount,
          target: request.target,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error('[webhook] delivery failed', url, err);
  }
}
