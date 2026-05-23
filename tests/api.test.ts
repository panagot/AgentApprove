import { GET, POST } from '@/app/api/requests/route';
import { POST as rejectPost } from '@/app/api/requests/[id]/reject/route';
import { GET as statsGet } from '@/app/api/stats/route';
import { POST as agentsPost, GET as agentsGet } from '@/app/api/agents/route';
import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { mockRequest, withTempStore } from './helpers';

function nextRequest(url: string, init?: RequestInit & { json?: unknown }) {
  const req = mockRequest(url, init);
  return new NextRequest(req.url, req);
}

describe('API routes', () => {
  it('POST /api/requests validates required fields', async () => {
    await withTempStore(async () => {
      const res = await POST(
        nextRequest('http://localhost/api/requests', {
          method: 'POST',
          json: { agentName: 'Bot' },
        }),
      );
      expect(res.status).toBe(400);
    });
  });

  it('POST /api/requests creates a pending approval', async () => {
    await withTempStore(async () => {
      const res = await POST(
        nextRequest('http://localhost/api/requests', {
          method: 'POST',
          json: {
            agentName: 'API Agent',
            actionType: 'payment',
            summary: 'Charge card $25',
            amount: '$25.00',
          },
        }),
      );
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.request.status).toBe('pending');
      expect(body.request.riskLevel).toBe('low');
    });
  });

  it('POST /api/requests enforces API key when configured', async () => {
    await withTempStore(async () => {
      process.env.AGENT_API_KEY = 'secret-key';
      const bad = await POST(
        nextRequest('http://localhost/api/requests', {
          method: 'POST',
          headers: { 'x-agent-api-key': 'wrong' },
          json: {
            agentName: 'Bot',
            actionType: 'api_call',
            summary: 'Test',
          },
        }),
      );
      expect(bad.status).toBe(401);
      delete process.env.AGENT_API_KEY;
    });
  });

  it('GET /api/requests filters by status', async () => {
    await withTempStore(async () => {
      vi.stubGlobal('fetch', vi.fn(async () => new Response('ok', { status: 200 })));

      await POST(
        nextRequest('http://localhost/api/requests', {
          method: 'POST',
          json: {
            agentName: 'Bot',
            actionType: 'api_call',
            summary: 'One',
          },
        }),
      );
      const created = await POST(
        nextRequest('http://localhost/api/requests', {
          method: 'POST',
          json: {
            agentName: 'Bot',
            actionType: 'api_call',
            summary: 'Two',
          },
        }),
      );
      const { request } = await created.json();
      await rejectPost(
        nextRequest(`http://localhost/api/requests/${request.id}/reject`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: request.id }) },
      );

      const pendingRes = await GET(
        nextRequest('http://localhost/api/requests?status=pending'),
      );
      const pending = await pendingRes.json();
      expect(pending.requests.every((r: { status: string }) => r.status === 'pending')).toBe(
        true,
      );

      vi.unstubAllGlobals();
    });
  });

  it('GET /api/stats returns dashboard counts', async () => {
    await withTempStore(async () => {
      const res = await statsGet();
      const body = await res.json();
      expect(body.stats).toMatchObject({
        pending: expect.any(Number),
        approvedToday: expect.any(Number),
        rejectedToday: expect.any(Number),
        registeredAgents: expect.any(Number),
      });
    });
  });

  it('POST /api/agents registers linked agents', async () => {
    await withTempStore(async () => {
      const res = await agentsPost(
        nextRequest('http://localhost/api/agents', {
          method: 'POST',
          json: { name: 'Webhook Bot', callbackUrl: 'https://hook.test/cb' },
        }),
      );
      expect(res.status).toBe(201);

      const list = await agentsGet();
      const body = await list.json();
      expect(body.agents.some((a: { name: string }) => a.name === 'Webhook Bot')).toBe(
        true,
      );
    });
  });
});
