import { Page } from '@/components/PageLayout';
import Link from 'next/link';
import { AuthButton } from '../components/AuthButton';

const PAGES = [
  { href: '/home', label: 'Inbox', desc: 'Pending agent approvals' },
  { href: '/agents', label: 'Agents', desc: 'Link AI agents & webhooks' },
  { href: '/history', label: 'Audit log', desc: 'Approved & rejected actions' },
  { href: '/demo', label: 'Demo', desc: 'Simulate agent requests' },
  { href: '/integrate', label: 'Docs', desc: 'Integration guide' },
] as const;

export default function Landing() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-indigo-50/80 to-zinc-50 px-6 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl shadow-lg shadow-indigo-200">
          ✓
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Human-in-the-Loop · World ID
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            AgentApprove
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
            When your AI agent wants to pay, sign, deploy, or spend on APIs — you
            approve it with a cryptographic World ID proof. One human. One
            decision. Fully auditable.
          </p>
        </div>
        <ul className="max-w-xs space-y-2 text-left text-xs text-zinc-600">
          <li className="flex gap-2">
            <span className="text-indigo-600">●</span>
            Action-bound World ID verification
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600">●</span>
            Webhook callbacks to your agent
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600">●</span>
            Risk scoring + Orb tier for high-value actions
          </li>
        </ul>
        <AuthButton />

        <nav className="w-full max-w-sm" aria-label="App pages">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Explore the app
          </p>
          <ul className="grid gap-2">
            {PAGES.map(page => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                >
                  <span className="text-sm font-semibold text-zinc-900">
                    {page.label}
                  </span>
                  <span className="text-xs text-zinc-500">{page.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Page.Main>
    </Page>
  );
}
