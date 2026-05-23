#!/usr/bin/env node
/**
 * Live simulation against a running dev server (npm run dev).
 * Usage: node scripts/simulate-live.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? 'http://localhost:3000';

async function req(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, json };
}

function ok(label, condition) {
  const pass = Boolean(condition);
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) process.exitCode = 1;
  return pass;
}

async function main() {
  console.log(`\nAgentApprove live simulation → ${BASE}\n`);

  // Health
  const home = await req('/');
  ok('Landing page loads', home.status === 200);

  const statsBefore = await req('/api/stats');
  ok('Stats API responds', statsBefore.status === 200);

  // Register agent
  const agentRes = await req('/api/agents', {
    method: 'POST',
    body: JSON.stringify({
      name: `Sim Agent ${Date.now()}`,
      callbackUrl: 'https://httpbin.org/post',
    }),
  });
  ok('Register agent', agentRes.status === 201);
  const agentId = agentRes.json?.agent?.id;

  // Create low-risk request
  const low = await req('/api/requests', {
    method: 'POST',
    body: JSON.stringify({
      agentId,
      agentName: 'Sim Agent',
      actionType: 'api_call',
      summary: 'Simulated Exa search',
      amount: '$0.50',
      target: 'api.exa.ai/search',
    }),
  });
  ok('Create low-risk request', low.status === 201);
  ok('Low-risk classification', low.json?.request?.riskLevel === 'low');

  // Create high-risk request
  const high = await req('/api/requests', {
    method: 'POST',
    body: JSON.stringify({
      agentName: 'Sim Agent',
      actionType: 'payment',
      summary: 'Simulated flight booking',
      amount: '$842.00',
    }),
  });
  ok('Create high-risk request', high.status === 201);
  ok('High-risk + Orb flag', high.json?.request?.requiresOrbVerification === true);

  const highId = high.json?.request?.id;

  // Reject high-risk
  const rejected = await req(`/api/requests/${highId}/reject`, { method: 'POST' });
  ok('Reject request', rejected.status === 200);
  ok('Rejection hash recorded', rejected.json?.request?.approvalHash?.length === 64);

  // Pending inbox includes low-risk
  const pending = await req('/api/requests?status=pending');
  ok('Pending inbox lists open requests', pending.status === 200);
  ok(
    'Low-risk request still pending',
    pending.json?.requests?.some(r => r.id === low.json?.request?.id),
  );

  const statsAfter = await req('/api/stats');
  ok('Stats updated after rejection', statsAfter.status === 200);

  console.log('\nDone. World ID approve flow requires World App + Developer Portal credentials.\n');
}

main().catch(err => {
  console.error('Simulation failed:', err.message);
  console.error('Is the dev server running? Try: npm run dev');
  process.exit(1);
});
