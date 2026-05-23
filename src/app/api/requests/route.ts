import { createRequest, listRequests } from '@/lib/store';
import type { CreateRequestInput } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') ?? undefined;
  const requests = await listRequests(
    status as Parameters<typeof listRequests>[0],
  );
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-agent-api-key');
  const expectedKey = process.env.AGENT_API_KEY;

  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as CreateRequestInput;

  if (!body.agentName || !body.actionType || !body.summary) {
    return NextResponse.json(
      { error: 'agentName, actionType, and summary are required' },
      { status: 400 },
    );
  }

  const request = await createRequest(body);
  return NextResponse.json({ request }, { status: 201 });
}
