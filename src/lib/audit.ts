import { createHash } from 'crypto';
import type { ApprovalRequest, RequestStatus } from './types';

export function createApprovalHash(
  request: ApprovalRequest,
  status: RequestStatus,
  resolvedAt: string,
): string {
  const payload = {
    id: request.id,
    actionType: request.actionType,
    summary: request.summary,
    agentName: request.agentName,
    status,
    resolvedAt,
  };
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}
