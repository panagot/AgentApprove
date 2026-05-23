import { createApprovalHash } from '@/lib/audit';
import { assessRisk } from '@/lib/risk';
import { dispatchWebhook } from '@/lib/webhook';
import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type {
  ApprovalRequest,
  CreateRequestInput,
  DashboardStats,
  RegisteredAgent,
  RequestStatus,
} from './types';

function getPaths() {
  const dir =
    process.env.AGENT_APPROVE_DATA_DIR ??
    (process.env.VERCEL
      ? path.join('/tmp', 'agentapprove-data')
      : path.join(process.cwd(), 'data'));
  return {
    dir,
    store: path.join(dir, 'requests.json'),
    agents: path.join(dir, 'agents.json'),
  };
}

function emptyFallback<T>(seed: T): T {
  return process.env.AGENT_APPROVE_SKIP_SEED === '1' ? ([] as T) : seed;
}

const SEED_AGENTS: RegisteredAgent[] = [
  {
    id: 'agent-travel',
    name: 'Travel Agent',
    callbackUrl: 'https://webhook.site/demo-travel',
    dailySpendLimit: '$2,000',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-devops',
    name: 'DevOps Bot',
    callbackUrl: 'https://webhook.site/demo-devops',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-research',
    name: 'Research Agent',
    dailySpendLimit: '$50',
    createdAt: new Date().toISOString(),
  },
];

const SEED_REQUESTS: ApprovalRequest[] = [
  {
    id: 'seed-001',
    agentId: 'agent-travel',
    agentName: 'Travel Agent',
    actionType: 'payment',
    summary: 'Book round-trip flight SFO → Tokyo (Apr 12–19)',
    details: 'United UA837 · Economy · Refundable within 24h',
    amount: '$842.00',
    target: 'united.com/checkout/8f2a',
    callbackUrl: 'https://webhook.site/demo-travel',
    riskLevel: 'high',
    requiresOrbVerification: true,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'seed-002',
    agentId: 'agent-devops',
    agentName: 'DevOps Bot',
    actionType: 'deploy',
    summary: 'Deploy api-v2.4.1 to production',
    details: 'GitHub Actions run #1842 · 3 migrations pending',
    target: 'vercel.com/agentapprove/api',
    callbackUrl: 'https://webhook.site/demo-devops',
    riskLevel: 'high',
    requiresOrbVerification: true,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'seed-003',
    agentId: 'agent-research',
    agentName: 'Research Agent',
    actionType: 'api_call',
    summary: 'Query Exa search API (50 results)',
    details: 'Topic: "World ID human-in-the-loop adoption 2026"',
    amount: '$0.50',
    target: 'api.exa.ai/search',
    riskLevel: 'low',
    requiresOrbVerification: false,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'seed-004',
    agentId: 'agent-research',
    agentName: 'Research Agent',
    actionType: 'api_call',
    summary: 'Browserbase session — competitor pricing scrape',
    amount: '$0.12',
    target: 'api.browserbase.com/v1/sessions',
    riskLevel: 'low',
    requiresOrbVerification: false,
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    worldIdVerified: true,
    approvalHash: 'demo-a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  },
];

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  const { dir } = getPaths();
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    await mkdir(dir, { recursive: true });
    const initial = emptyFallback(fallback);
    await writeFile(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  const { dir } = getPaths();
  await mkdir(dir, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

function expireStale(requests: ApprovalRequest[]): ApprovalRequest[] {
  const now = Date.now();
  return requests.map(r => {
    if (r.status === 'pending' && new Date(r.expiresAt).getTime() < now) {
      return { ...r, status: 'expired' as RequestStatus };
    }
    return r;
  });
}

export async function listAgents(): Promise<RegisteredAgent[]> {
  const { agents } = getPaths();
  return readJson(agents, SEED_AGENTS);
}

export async function registerAgent(
  input: Omit<RegisteredAgent, 'id' | 'createdAt'>,
): Promise<RegisteredAgent> {
  const agents = await listAgents();
  const agent: RegisteredAgent = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  agents.unshift(agent);
  await writeJson(getPaths().agents, agents);
  return agent;
}

export async function getAgent(id: string): Promise<RegisteredAgent | undefined> {
  const agents = await listAgents();
  return agents.find(a => a.id === id);
}

export async function listRequests(status?: RequestStatus): Promise<ApprovalRequest[]> {
  const { store } = getPaths();
  let requests = expireStale(await readJson(store, SEED_REQUESTS));
  await writeJson(store, requests);
  if (status) {
    requests = requests.filter(r => r.status === status);
  }
  return requests.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getRequest(id: string): Promise<ApprovalRequest | undefined> {
  const requests = await listRequests();
  return requests.find(r => r.id === id);
}

export async function getStats(): Promise<DashboardStats> {
  const [requests, agents] = await Promise.all([listRequests(), listAgents()]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (iso?: string) =>
    iso ? new Date(iso).getTime() >= today.getTime() : false;

  return {
    pending: requests.filter(r => r.status === 'pending').length,
    approvedToday: requests.filter(
      r => r.status === 'approved' && isToday(r.resolvedAt),
    ).length,
    rejectedToday: requests.filter(
      r => r.status === 'rejected' && isToday(r.resolvedAt),
    ).length,
    totalResolved: requests.filter(r =>
      ['approved', 'rejected', 'expired'].includes(r.status),
    ).length,
    registeredAgents: agents.length,
  };
}

export async function createRequest(input: CreateRequestInput): Promise<ApprovalRequest> {
  const requests = await listRequests();
  const agent = input.agentId ? await getAgent(input.agentId) : undefined;
  const { riskLevel, requiresOrbVerification } = assessRisk(
    input.actionType,
    input.amount,
  );

  const request: ApprovalRequest = {
    id: randomUUID(),
    ...input,
    agentName: agent?.name ?? input.agentName,
    callbackUrl: input.callbackUrl ?? agent?.callbackUrl,
    riskLevel,
    requiresOrbVerification,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };
  requests.unshift(request);
  await writeJson(getPaths().store, requests);
  return request;
}

async function resolveRequest(
  id: string,
  status: 'approved' | 'rejected',
  worldIdVerified = false,
): Promise<ApprovalRequest | undefined> {
  const requests = await listRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index === -1 || requests[index].status !== 'pending') return undefined;

  const resolvedAt = new Date().toISOString();
  const base = requests[index];
  const approvalHash = createApprovalHash(base, status, resolvedAt);

  requests[index] = {
    ...base,
    status,
    resolvedAt,
    worldIdVerified: status === 'approved' ? worldIdVerified : false,
    approvalHash,
  };

  await writeJson(getPaths().store, requests);
  const resolved = requests[index];
  await dispatchWebhook(
    resolved,
    status === 'approved' ? 'approval.approved' : 'approval.rejected',
  );
  return resolved;
}

export async function approveRequest(id: string): Promise<ApprovalRequest | undefined> {
  return resolveRequest(id, 'approved', true);
}

export async function rejectRequest(id: string): Promise<ApprovalRequest | undefined> {
  return resolveRequest(id, 'rejected', false);
}
