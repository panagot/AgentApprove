import { approveRequest, getRequest } from '@/lib/store';
import type { IDKitResult } from '@worldcoin/idkit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (request.status !== 'pending') {
    return NextResponse.json(
      { error: 'Request already resolved' },
      { status: 409 },
    );
  }

  const expectedRpId = process.env.RP_ID;
  if (!expectedRpId) {
    return NextResponse.json(
      { error: 'RP_ID not configured' },
      { status: 500 },
    );
  }

  const { rp_id, idkitResponse } = (await req.json()) as {
    rp_id?: string;
    idkitResponse?: IDKitResult;
  };

  if (rp_id !== expectedRpId) {
    return NextResponse.json({ error: 'Invalid rp_id' }, { status: 400 });
  }

  if (!idkitResponse) {
    return NextResponse.json(
      { error: 'idkitResponse is required' },
      { status: 400 },
    );
  }

  const verifyRes = await fetch(
    `https://developer.world.org/api/v4/verify/${encodeURIComponent(expectedRpId)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(idkitResponse),
    },
  );

  if (!verifyRes.ok) {
    const detail = await verifyRes.text();
    return NextResponse.json(
      { error: 'World ID verification failed', detail },
      { status: 400 },
    );
  }

  const approved = await approveRequest(id);
  return NextResponse.json({ success: true, request: approved });
}
