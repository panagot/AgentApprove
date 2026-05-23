'use client';

import { Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';

const KEY = 'agentapprove-onboarding-dismissed';

export function OnboardingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(KEY) !== '1');
  }, []);

  if (!visible) return null;

  return (
    <div className="relative rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
        onClick={() => {
          localStorage.setItem(KEY, '1');
          setVisible(false);
        }}
      >
        <Xmark width={18} height={18} />
      </button>
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Human-in-the-Loop
      </p>
      <p className="mt-1 pr-6 text-sm font-medium text-zinc-900">
        Your AI agents pause here until you approve with World ID.
      </p>
      <ol className="mt-3 space-y-1.5 text-xs text-zinc-600">
        <li>1. Agent submits a sensitive action via API</li>
        <li>2. You review risk level and details</li>
        <li>3. Approve with World ID — proof is bound to that action</li>
        <li>4. Agent receives webhook and continues</li>
      </ol>
    </div>
  );
}
