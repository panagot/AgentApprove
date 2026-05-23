import { rejectRequest } from '@/lib/store';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const request = await rejectRequest(id);

  if (!request) {
    return NextResponse.json(
      { error: 'Request not found or already resolved' },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, request });
}
