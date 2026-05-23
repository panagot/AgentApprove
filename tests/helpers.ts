import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

export async function withTempStore(run: () => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(tmpdir(), 'agentapprove-test-'));
  const prevDir = process.env.AGENT_APPROVE_DATA_DIR;
  const prevSkip = process.env.AGENT_APPROVE_SKIP_SEED;

  process.env.AGENT_APPROVE_DATA_DIR = dir;
  process.env.AGENT_APPROVE_SKIP_SEED = '1';

  try {
    await run();
  } finally {
    if (prevDir === undefined) delete process.env.AGENT_APPROVE_DATA_DIR;
    else process.env.AGENT_APPROVE_DATA_DIR = prevDir;

    if (prevSkip === undefined) delete process.env.AGENT_APPROVE_SKIP_SEED;
    else process.env.AGENT_APPROVE_SKIP_SEED = prevSkip;

    await rm(dir, { recursive: true, force: true });
  }
}

export function mockRequest(
  url: string,
  init?: RequestInit & { json?: unknown },
): Request {
  const headers = new Headers(init?.headers);
  let body = init?.body;

  if (init?.json !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(init.json);
  }

  return new Request(url, { ...init, headers, body });
}
