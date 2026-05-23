import { approvalAction } from '@/lib/actions';
import { createApprovalHash } from '@/lib/audit';
import { assessRisk, parseAmountUsd } from '@/lib/risk';
import { describe, expect, it } from 'vitest';

describe('approvalAction', () => {
  it('binds a unique World ID action per request', () => {
    expect(approvalAction('abc-123')).toBe('agent-approve:abc-123');
    expect(approvalAction('xyz')).not.toBe(approvalAction('abc-123'));
  });
});

describe('parseAmountUsd', () => {
  it('parses currency strings', () => {
    expect(parseAmountUsd('$842.00')).toBe(842);
    expect(parseAmountUsd('USD 12.5')).toBe(12.5);
    expect(parseAmountUsd(undefined)).toBeNull();
  });
});

describe('assessRisk', () => {
  it('flags deploy as high risk with Orb required', () => {
    expect(assessRisk('deploy')).toEqual({
      riskLevel: 'high',
      requiresOrbVerification: true,
    });
  });

  it('flags payments over $500 as high risk', () => {
    expect(assessRisk('payment', '$842.00')).toEqual({
      riskLevel: 'high',
      requiresOrbVerification: true,
    });
  });

  it('flags payments $100–499 as medium with Orb', () => {
    expect(assessRisk('payment', '$150.00')).toEqual({
      riskLevel: 'medium',
      requiresOrbVerification: true,
    });
  });

  it('treats small API calls as low risk', () => {
    expect(assessRisk('api_call', '$0.50')).toEqual({
      riskLevel: 'low',
      requiresOrbVerification: false,
    });
  });
});

describe('createApprovalHash', () => {
  it('produces a stable 64-char hex hash', () => {
    const request = {
      id: 'test-id',
      agentName: 'Test Agent',
      actionType: 'payment' as const,
      summary: 'Pay invoice',
      riskLevel: 'low' as const,
      requiresOrbVerification: false,
      status: 'pending' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-01-02T00:00:00.000Z',
    };
    const hash = createApprovalHash(request, 'approved', '2026-01-01T12:00:00.000Z');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
    expect(createApprovalHash(request, 'approved', '2026-01-01T12:00:00.000Z')).toBe(
      hash,
    );
    expect(createApprovalHash(request, 'rejected', '2026-01-01T12:00:00.000Z')).not.toBe(
      hash,
    );
  });
});
