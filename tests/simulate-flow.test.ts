import {
  approveRequest,
  createRequest,
  getRequest,
  listRequests,
  registerAgent,
  rejectRequest,
} from '@/lib/store';
import { approvalAction } from '@/lib/actions';
import { describe, expect, it, vi } from 'vitest';
import { withTempStore } from './helpers';

/**
 * Simulates the full AgentApprove flow an agent + human would experience,
 * without World ID (approve/reject at store layer).
 */
describe('simulated end-to-end flow', () => {
  it('agent submits → human rejects → agent submits → human approves', async () => {
    await withTempStore(async () => {
      const webhookLog: Array<{ event: string; requestId: string; status: string }> =
        [];
      vi.stubGlobal(
        'fetch',
        vi.fn(async (_url: string, init?: RequestInit) => {
          const body = JSON.parse(String(init?.body));
          webhookLog.push({
            event: body.event,
            requestId: body.requestId,
            status: body.status,
          });
          return new Response(JSON.stringify({ received: true }), { status: 200 });
        }),
      );

      // 1. Developer registers agent
      const agent = await registerAgent({
        name: 'Travel Agent',
        callbackUrl: 'https://my-agent.example/webhook',
        dailySpendLimit: '$2,000',
      });

      // 2. Agent requests high-value payment approval
      const flight = await createRequest({
        agentId: agent.id,
        agentName: 'Travel Agent',
        actionType: 'payment',
        summary: 'Book flight LAX → Tokyo',
        amount: '$842.00',
        target: 'united.com/checkout',
      });

      expect(flight.riskLevel).toBe('high');
      expect(flight.requiresOrbVerification).toBe(true);
      expect(approvalAction(flight.id)).toBe(`agent-approve:${flight.id}`);

      // 3. Human sees it in inbox
      const inbox = await listRequests('pending');
      expect(inbox.find(r => r.id === flight.id)).toBeDefined();

      // 4. Human rejects (too expensive)
      await rejectRequest(flight.id);
      expect(webhookLog.at(-1)).toEqual({
        event: 'approval.rejected',
        requestId: flight.id,
        status: 'rejected',
      });

      // 5. Agent retries with cheaper option
      const train = await createRequest({
        agentId: agent.id,
        agentName: 'Travel Agent',
        actionType: 'payment',
        summary: 'Book train Tokyo → Kyoto',
        amount: '$45.00',
      });

      expect(train.riskLevel).toBe('low');

      // 6. Human approves with World ID (simulated at store layer)
      const approved = await approveRequest(train.id);
      expect(approved?.worldIdVerified).toBe(true);
      expect(approved?.approvalHash).toHaveLength(64);

      expect(webhookLog.at(-1)).toEqual({
        event: 'approval.approved',
        requestId: train.id,
        status: 'approved',
      });

      // 7. Audit log contains both resolutions
      const log = await listRequests();
      const resolved = log.filter(r => r.status !== 'pending');
      expect(resolved.length).toBeGreaterThanOrEqual(2);
      const rejectedFlight = await getRequest(flight.id);
      expect(rejectedFlight?.status).toBe('rejected');

      vi.unstubAllGlobals();
    });
  });
});
