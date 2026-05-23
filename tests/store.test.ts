import {
  approveRequest,
  createRequest,
  getRequest,
  getStats,
  listRequests,
  registerAgent,
  rejectRequest,
} from '@/lib/store';
import { describe, expect, it, vi } from 'vitest';
import { withTempStore } from './helpers';

describe('store — agent approval lifecycle', () => {
  it('registers agent, creates request, rejects with hash + webhook', async () => {
    await withTempStore(async () => {
      const webhookCalls: unknown[] = [];
      vi.stubGlobal(
        'fetch',
        vi.fn(async (_url: string, init?: RequestInit) => {
          webhookCalls.push(JSON.parse(String(init?.body)));
          return new Response('ok', { status: 200 });
        }),
      );

      const agent = await registerAgent({
        name: 'Test Bot',
        callbackUrl: 'https://example.com/webhook',
      });

      const created = await createRequest({
        agentId: agent.id,
        agentName: 'Test Bot',
        actionType: 'payment',
        summary: 'Pay $50 invoice',
        amount: '$50.00',
        callbackUrl: 'https://example.com/webhook',
      });

      expect(created.status).toBe('pending');
      expect(created.riskLevel).toBe('low');
      expect(created.requiresOrbVerification).toBe(false);

      const pending = await listRequests('pending');
      expect(pending.some(r => r.id === created.id)).toBe(true);

      const rejected = await rejectRequest(created.id);
      expect(rejected?.status).toBe('rejected');
      expect(rejected?.approvalHash).toMatch(/^[a-f0-9]{64}$/);
      expect(rejected?.worldIdVerified).toBe(false);

      expect(webhookCalls).toHaveLength(1);
      expect(webhookCalls[0]).toMatchObject({
        event: 'approval.rejected',
        requestId: created.id,
        status: 'rejected',
      });

      vi.unstubAllGlobals();
    });
  });

  it('approves request with World ID flag and audit hash', async () => {
    await withTempStore(async () => {
      vi.stubGlobal('fetch', vi.fn(async () => new Response('ok', { status: 200 })));

      const created = await createRequest({
        agentName: 'Deploy Bot',
        actionType: 'deploy',
        summary: 'Deploy to production',
      });

      expect(created.riskLevel).toBe('high');
      expect(created.requiresOrbVerification).toBe(true);

      const approved = await approveRequest(created.id);
      expect(approved?.status).toBe('approved');
      expect(approved?.worldIdVerified).toBe(true);
      expect(approved?.approvalHash).toHaveLength(64);

      const fetched = await getRequest(created.id);
      expect(fetched?.status).toBe('approved');

      vi.unstubAllGlobals();
    });
  });

  it('updates dashboard stats after resolutions', async () => {
    await withTempStore(async () => {
      vi.stubGlobal('fetch', vi.fn(async () => new Response('ok', { status: 200 })));

      await registerAgent({ name: 'Stats Agent' });
      const a = await createRequest({
        agentName: 'Stats Agent',
        actionType: 'api_call',
        summary: 'Call API',
      });
      await createRequest({
        agentName: 'Stats Agent',
        actionType: 'api_call',
        summary: 'Call API 2',
      });

      let stats = await getStats();
      expect(stats.pending).toBe(2);
      expect(stats.registeredAgents).toBe(1);

      await approveRequest(a.id);
      stats = await getStats();
      expect(stats.pending).toBe(1);
      expect(stats.approvedToday).toBe(1);

      vi.unstubAllGlobals();
    });
  });

  it('inherits agent callback URL when agentId is provided', async () => {
    await withTempStore(async () => {
      const agent = await registerAgent({
        name: 'Linked Agent',
        callbackUrl: 'https://agent.example/hook',
      });

      const req = await createRequest({
        agentId: agent.id,
        agentName: 'ignored',
        actionType: 'sign',
        summary: 'Sign document',
      });

      expect(req.agentName).toBe('Linked Agent');
      expect(req.callbackUrl).toBe('https://agent.example/hook');
    });
  });
});
