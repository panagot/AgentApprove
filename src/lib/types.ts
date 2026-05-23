export type ActionType = 'payment' | 'sign' | 'deploy' | 'api_call';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RegisteredAgent {
  id: string;
  name: string;
  callbackUrl?: string;
  dailySpendLimit?: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  agentId?: string;
  agentName: string;
  actionType: ActionType;
  summary: string;
  details?: string;
  amount?: string;
  target?: string;
  walletAddress?: string;
  callbackUrl?: string;
  riskLevel: RiskLevel;
  requiresOrbVerification: boolean;
  status: RequestStatus;
  createdAt: string;
  expiresAt: string;
  resolvedAt?: string;
  worldIdVerified?: boolean;
  approvalHash?: string;
}

export interface CreateRequestInput {
  agentId?: string;
  agentName: string;
  actionType: ActionType;
  summary: string;
  details?: string;
  amount?: string;
  target?: string;
  walletAddress?: string;
  callbackUrl?: string;
}

export interface DashboardStats {
  pending: number;
  approvedToday: number;
  rejectedToday: number;
  totalResolved: number;
  registeredAgents: number;
}

export interface CreditProfile {
  state: 'INACTIVE' | 'ACTIVE' | 'DEFAULTED';
  score: number;
  band: string;
}
