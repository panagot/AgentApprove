import type { ActionType, RiskLevel } from './types';

export function parseAmountUsd(amount?: string): number | null {
  if (!amount) return null;
  const n = parseFloat(amount.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function assessRisk(
  actionType: ActionType,
  amount?: string,
): { riskLevel: RiskLevel; requiresOrbVerification: boolean } {
  const usd = parseAmountUsd(amount);

  if (actionType === 'deploy') {
    return { riskLevel: 'high', requiresOrbVerification: true };
  }

  if (actionType === 'sign') {
    return { riskLevel: 'medium', requiresOrbVerification: false };
  }

  if (usd !== null && usd >= 500) {
    return { riskLevel: 'high', requiresOrbVerification: true };
  }

  if (usd !== null && usd >= 100) {
    return { riskLevel: 'medium', requiresOrbVerification: true };
  }

  if (actionType === 'payment' && usd !== null && usd > 0) {
    return { riskLevel: 'low', requiresOrbVerification: false };
  }

  return { riskLevel: 'low', requiresOrbVerification: false };
}

export const RISK_STYLE: Record<
  RiskLevel,
  { label: string; className: string }
> = {
  low: { label: 'Low risk', className: 'bg-emerald-50 text-emerald-700' },
  medium: { label: 'Medium risk', className: 'bg-amber-50 text-amber-800' },
  high: { label: 'High risk', className: 'bg-red-50 text-red-700' },
};
