import { listAgents, registerAgent } from '@/lib/store';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const agents = await listAgents();
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const agent = await registerAgent({
    name: body.name,
    callbackUrl: body.callbackUrl,
    dailySpendLimit: body.dailySpendLimit,
  });
  return NextResponse.json({ agent }, { status: 201 });
}
