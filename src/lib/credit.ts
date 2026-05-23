import type { CreditProfile } from './types';

function scoreBand(score: number): string {
  if (score === 0) return 'New';
  if (score <= 99) return 'Bronze';
  if (score <= 299) return 'Silver';
  if (score <= 599) return 'Gold';
  if (score <= 999) return 'Platinum';
  return 'Diamond';
}

export async function fetchCreditProfile(
  address: string,
): Promise<CreditProfile | null> {
  try {
    const res = await fetch(
      `https://credit.cash/api/borrower/${encodeURIComponent(address)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { state: CreditProfile['state']; score: number };
    return {
      state: data.state,
      score: data.score,
      band: scoreBand(data.score),
    };
  } catch {
    return null;
  }
}
